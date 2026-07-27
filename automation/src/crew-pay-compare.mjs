import { compareOrderLines, moneyNumber, normalizeText, normalizeUom, stableId, stateCode } from './orders-compare.mjs';

function clean(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function tokens(value) {
  return new Set(normalizeText(value).split(' ').filter((token) => token.length > 1));
}

function similarity(left, right) {
  const a = tokens(left);
  const b = tokens(right);
  if (!a.size || !b.size) return 0;
  let shared = 0;
  for (const token of a) if (b.has(token)) shared += 1;
  return (2 * shared) / (a.size + b.size);
}

function orderCandidateScore(invoiceLine, orderLine) {
  if (clean(orderLine.line_type).toLowerCase() !== 'labor') return -1;
  const invoiceUom = normalizeUom(invoiceLine.uom);
  const orderUom = normalizeUom(orderLine.uom);
  if (invoiceUom && orderUom && invoiceUom !== orderUom) return -1;
  const nameScore = similarity(invoiceLine.item_name, orderLine.item_name);
  if (nameScore < 0.45) return -1;
  let score = nameScore * 100;
  if (invoiceUom && invoiceUom === orderUom) score += 15;
  return score;
}

function bestOrderMatch(invoiceLine, orderLines) {
  const candidates = orderLines
    .map((line) => ({ line, score: orderCandidateScore(invoiceLine, line) }))
    .filter((candidate) => candidate.score >= 0)
    .sort((left, right) => right.score - left.score);
  const best = candidates[0];
  const second = candidates[1];
  if (!best || best.score < 72 || (second && best.score - second.score < 5)) return null;
  return best;
}

function comparisonStatus(line) {
  if (line.custom_labor) return 'Custom Labor';
  if (!line.order_line_id && line.master_unit_price === '') return 'Needs Review';
  if (!line.order_line_id) return 'Missing Order';
  if (line.master_unit_price === '') return 'Missing Master Rate';
  if (Math.abs(moneyNumber(line.invoice_vs_order_variance)) > 0.01) return 'Order Variance';
  if (Math.abs(moneyNumber(line.invoice_vs_master_variance)) > 0.01) return 'Master Variance';
  return 'Matched';
}

export function compareCrewInvoiceLines(invoice, invoiceLines, orderLines, pricingRows) {
  const applicableOrders = (orderLines || []).filter((line) => (
    clean(line.job_id) === clean(invoice.job_id)
    && clean(line.line_type).toLowerCase() === 'labor'
  ));
  const prepared = invoiceLines.map((line, index) => {
    const orderMatch = bestOrderMatch(line, applicableOrders);
    const quantity = moneyNumber(line.quantity);
    const invoiceUnitPrice = moneyNumber(line.invoice_unit_price);
    const orderUnitPrice = orderMatch ? moneyNumber(orderMatch.line.blaze_unit_price) : '';
    const orderQuantity = orderMatch ? moneyNumber(orderMatch.line.quantity) : '';
    return {
      ...line,
      line_id: line.line_id || stableId(invoice.invoice_id, index, line.item_name, line.uom),
      invoice_id: invoice.invoice_id,
      job_id: invoice.job_id,
      line_type: 'labor',
      state: stateCode(invoice.region),
      crew_name: invoice.crew_name,
      quantity,
      invoice_unit_price: invoiceUnitPrice,
      invoice_total: moneyNumber(line.invoice_total) || invoiceUnitPrice * quantity,
      custom_labor: line.custom_labor || /^\*/.test(clean(line.item_name)) ? 'Yes' : '',
      order_id: orderMatch?.line.order_id || '',
      order_line_id: orderMatch?.line.line_id || '',
      order_unit_price: orderUnitPrice,
      order_quantity: orderQuantity,
      order_total: orderMatch ? orderUnitPrice * quantity : '',
      invoice_vs_order_variance: orderMatch ? (invoiceUnitPrice - orderUnitPrice) * quantity : '',
      order_match_method: orderMatch ? 'Job UUID + normalized labor item + UOM' : 'No confident job-order match',
      order_match_confidence: orderMatch ? Math.min(100, Math.round(orderMatch.score)) : 0
    };
  });

  return compareOrderLines(prepared.map((line) => ({
    ...line,
    blaze_unit_price: line.invoice_unit_price,
    blaze_total: line.invoice_total
  })), pricingRows).map((line) => {
    const compared = {
      ...line,
      invoice_vs_master_variance: line.master_unit_price === ''
        ? ''
        : (moneyNumber(line.invoice_unit_price) - moneyNumber(line.master_unit_price)) * moneyNumber(line.quantity),
      match_method: [
        line.order_match_method,
        line.match_method
      ].filter(Boolean).join(' | ')
    };
    compared.comparison_status = comparisonStatus(compared);
    delete compared.blaze_unit_price;
    delete compared.blaze_total;
    delete compared.variance;
    delete compared.variance_percent;
    return compared;
  });
}

export function aggregateCrewInvoice(invoice, lines) {
  const sum = (key) => lines.reduce((total, line) => total + moneyNumber(line[key]), 0);
  const statuses = new Set(lines.map((line) => clean(line.comparison_status)).filter(Boolean));
  let comparisonStatus = 'Matched';
  if (statuses.has('Needs Review') || statuses.has('Missing Order') || statuses.has('Missing Master Rate')) {
    comparisonStatus = 'Needs Review';
  } else if (statuses.has('Order Variance') && statuses.has('Master Variance')) {
    comparisonStatus = 'Order + Master Variance';
  } else if (statuses.has('Order Variance')) {
    comparisonStatus = 'Order Variance';
  } else if (statuses.has('Master Variance')) {
    comparisonStatus = 'Master Variance';
  } else if (statuses.has('Custom Labor')) {
    comparisonStatus = 'Custom Labor';
  }
  return {
    ...invoice,
    ordered_labor_total: sum('order_total'),
    invoice_labor_total: sum('invoice_total'),
    master_labor_total: sum('master_total'),
    order_variance: sum('invoice_vs_order_variance'),
    master_variance: sum('invoice_vs_master_variance'),
    comparison_status: comparisonStatus
  };
}

export function buildCrewRateAnalysis(invoices, lines) {
  const invoiceById = new Map(invoices.map((invoice) => [clean(invoice.invoice_id), invoice]));
  const groups = new Map();
  for (const line of lines) {
    const invoice = invoiceById.get(clean(line.invoice_id));
    if (!invoice) continue;
    const key = [
      clean(invoice.region).toUpperCase(),
      normalizeText(invoice.crew_name),
      normalizeText(invoice.trade),
      normalizeText(line.item_name),
      normalizeUom(line.uom)
    ].join('|');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({ invoice, line });
  }
  return [...groups.entries()].map(([key, records]) => {
    const rates = records.map(({ line }) => moneyNumber(line.invoice_unit_price));
    const frequency = new Map();
    rates.forEach((rate) => frequency.set(rate, (frequency.get(rate) || 0) + 1));
    const commonRate = [...frequency.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0]?.[0] || 0;
    const first = records[0];
    return {
      analysis_id: stableId(key),
      region: first.invoice.region,
      crew_name: first.invoice.crew_name,
      trade: first.invoice.trade,
      item_name: first.line.item_name,
      uom: normalizeUom(first.line.uom),
      invoice_count: new Set(records.map(({ invoice }) => invoice.invoice_id)).size,
      job_count: new Set(records.map(({ invoice }) => invoice.job_id)).size,
      common_rate: commonRate,
      minimum_rate: Math.min(...rates),
      maximum_rate: Math.max(...rates),
      rate_count: frequency.size,
      inconsistent: frequency.size > 1 ? 'Yes' : 'No'
    };
  });
}
