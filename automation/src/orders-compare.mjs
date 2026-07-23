Exit code: 0
Wall time: 1.9 seconds
Output:
import crypto from 'node:crypto';

const UOM_ALIASES = new Map([
  ['BD', 'BD'], ['BDL', 'BD'], ['BUNDLE', 'BD'],
  ['BX', 'BX'], ['BOX', 'BX'],
  ['EA', 'EA'], ['EACH', 'EA'],
  ['LF', 'LF'], ['LINEAR FT', 'LF'], ['LINEAR FOOT', 'LF'], ['LINEAR FEET', 'LF'],
  ['PC', 'PC'], ['PCS', 'PC'], ['PIECE', 'PC'], ['PIECES', 'PC'],
  ['RL', 'RL'], ['ROLL', 'RL'], ['ROLLS', 'RL'],
  ['SQ', 'SQ'], ['SQUARE', 'SQ'], ['SQUARES', 'SQ']
]);

const STATE_ABBREVIATIONS = {
  alabama: 'AL', alaska: 'AK', arizona: 'AZ', arkansas: 'AR', california: 'CA',
  colorado: 'CO', connecticut: 'CT', delaware: 'DE', florida: 'FL', georgia: 'GA',
  hawaii: 'HI', idaho: 'ID', illinois: 'IL', indiana: 'IN', iowa: 'IA',
  kansas: 'KS', kentucky: 'KY', louisiana: 'LA', maine: 'ME', maryland: 'MD',
  massachusetts: 'MA', michigan: 'MI', minnesota: 'MN', mississippi: 'MS',
  missouri: 'MO', montana: 'MT', nebraska: 'NE', nevada: 'NV',
  'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
  'north carolina': 'NC', 'north dakota': 'ND', ohio: 'OH', oklahoma: 'OK',
  oregon: 'OR', pennsylvania: 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
  'south dakota': 'SD', tennessee: 'TN', texas: 'TX', utah: 'UT', vermont: 'VT',
  virginia: 'VA', washington: 'WA', 'west virginia': 'WV', wisconsin: 'WI',
  wyoming: 'WY'
};

const SUPPLIER_ALIASES = [
  [/^richards\b|richards building|\brbs\b/i, 'RBS'],
  [/^srs\b|srs distribution|srs building/i, 'SRS'],
  [/^abc\b|abc supply/i, 'ABC'],
  [/^alside\b/i, 'ALSIDE']
];

function clean(value) {
  return String(value ?? '').trim();
}

export function normalizeText(value) {
  return clean(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b(the|inc|llc|company|co|corp|corporation)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeUom(value) {
  const key = clean(value).toUpperCase().replace(/[.]/g, '').replace(/\s+/g, ' ');
  return UOM_ALIASES.get(key) || key;
}

export function normalizeSupplier(value) {
  const source = clean(value);
  const alias = SUPPLIER_ALIASES.find(([pattern]) => pattern.test(source));
  return alias ? alias[1] : normalizeText(source);
}

export function stateCode(...values) {
  for (const value of values) {
    const source = clean(value);
    const abbreviation = source.match(/(?:^|[,\s-])([A-Z]{2})(?:\s+\d{5}(?:-\d{4})?|[,\s-]|$)/);
    if (abbreviation) return abbreviation[1];
    const lower = source.toLowerCase();
    for (const [name, code] of Object.entries(STATE_ABBREVIATIONS)) {
      if (new RegExp(`\\b${name.replace(/\s+/g, '\\s+')}\\b`, 'i').test(lower)) return code;
    }
  }
  return '';
}

export function moneyNumber(value) {
  const parsed = Number(String(value ?? '').replace(/[$,%\s,]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function tokenSet(value) {
  return new Set(normalizeText(value).split(' ').filter((token) => token.length > 1));
}

function similarity(left, right) {
  const a = tokenSet(left);
  const b = tokenSet(right);
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  for (const token of a) if (b.has(token)) intersection += 1;
  return (2 * intersection) / (a.size + b.size);
}

function field(row, candidates) {
  for (const candidate of candidates) {
    if (row[candidate] !== undefined && clean(row[candidate]) !== '') return row[candidate];
  }
  return '';
}

function priceRecord(row) {
  return {
    source: row,
    name: clean(field(row, ['elite_product_name', 'product', 'item_final', 'item', 'name', 'description', 'service_name', 'scope'])),
    supplier: clean(field(row, ['supplier', 'vendor', 'brand_name'])),
    state: clean(field(row, ['state', 'region', 'market', 'location', 'territory'])).toUpperCase(),
    uom: normalizeUom(field(row, ['uom', 'unit'])),
    type: clean(field(row, ['type', 'item_type', 'type_code', 'trade'])),
    price: moneyNumber(field(row, ['price', 'rate', 'amount', 'cost', 'total', 'labor_price', 'unit_price']))
  };
}

function isLaborPrice(record) {
  return /\blabor\b/i.test(record.type) || /\blabor\b/i.test(record.name);
}

export function createPriceIndex(rows) {
  return rows
    .map(priceRecord)
    .filter((record) => record.name && record.price > 0)
    .map((record) => ({
      ...record,
      nameKey: normalizeText(record.name),
      supplierKey: normalizeSupplier(record.supplier)
    }));
}

function candidateScore(line, price) {
  if (line.line_type === 'labor' && !isLaborPrice(price)) return -1;
  if (line.line_type === 'material' && isLaborPrice(price)) return -1;
  const lineUom = normalizeUom(line.uom);
  if (lineUom && price.uom && lineUom !== price.uom) return -1;
  const lineState = clean(line.state).toUpperCase();
  if (lineState && price.state && lineState !== price.state) return -1;

  const nameScore = similarity(line.item_name, price.name);
  if (nameScore < 0.45) return -1;
  let score = nameScore * 100;
  if (lineUom && price.uom === lineUom) score += 12;
  if (lineState && price.state === lineState) score += 12;
  const lineSupplier = normalizeSupplier(line.supplier || line.crew_name);
  if (lineSupplier && price.supplierKey && lineSupplier === price.supplierKey) score += 16;
  return score;
}

export function compareOrderLines(lines, priceRows) {
  const prices = createPriceIndex(priceRows);
  return lines.map((line) => {
    let best = null;
    let second = null;
    for (const price of prices) {
      const score = candidateScore(line, price);
      if (score < 0) continue;
      if (!best || score > best.score) {
        second = best;
        best = { price, score };
      } else if (!second || score > second.score) {
        second = { price, score };
      }
    }

    const confidenceGap = best && second ? best.score - second.score : 100;
    const confident = best && best.score >= 72 && confidenceGap >= 5;
    const masterUnitPrice = confident ? best.price.price : '';
    const masterTotal = confident ? masterUnitPrice * Number(line.quantity || 0) : '';
    const blazeTotal = moneyNumber(line.blaze_total);
    const variance = confident ? blazeTotal - masterTotal : '';
    const comparison = !confident
      ? 'Needs Review'
      : variance > 0.01
        ? 'Overpayment'
        : variance < -0.01
          ? 'Below Master'
          : 'Within Pricing';
    return {
      ...line,
      master_unit_price: masterUnitPrice,
      master_total: masterTotal,
      variance,
      variance_percent: confident && masterTotal ? variance / masterTotal : '',
      price_source: confident ? best.price.source.source_file || 'Master Pricing' : '',
      match_method: confident ? 'Normalized name + UOM + state' : 'No confident master match',
      match_confidence: best ? Math.min(100, Math.round(best.score)) : 0,
      comparison_status: comparison
    };
  });
}

export function stableId(...values) {
  return crypto.createHash('sha256').update(values.map(clean).join('|')).digest('hex').slice(0, 24);
}

export function aggregateOrder(order, lines) {
  const material = lines.filter((line) => line.line_type === 'material');
  const labor = lines.filter((line) => line.line_type === 'labor');
  const sum = (source, key) => source.reduce((total, line) => total + moneyNumber(line[key]), 0);
  const unmatched = lines.filter((line) => line.comparison_status === 'Needs Review');
  const materialVariance = sum(material, 'variance');
  const laborVariance = sum(labor, 'variance');
  let comparisonStatus = 'Within Pricing';
  if (unmatched.length) comparisonStatus = 'Needs Review';
  else if (materialVariance > 0.01 && laborVariance > 0.01) comparisonStatus = 'Material + Labor Overpayment';
  else if (materialVariance > 0.01) comparisonStatus = 'Material Overpayment';
  else if (laborVariance > 0.01) comparisonStatus = 'Labor Overpayment';
  return {
    ...order,
    material_actual: sum(material, 'blaze_total'),
    material_expected: sum(material, 'master_total'),
    material_variance: materialVariance,
    labor_actual: sum(labor, 'blaze_total'),
    labor_expected: sum(labor, 'master_total'),
    labor_variance: laborVariance,
    comparison_status: comparisonStatus
  };
}


