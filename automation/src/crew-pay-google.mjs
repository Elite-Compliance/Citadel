import { aggregateCrewInvoice, buildCrewRateAnalysis, compareCrewInvoiceLines } from './crew-pay-compare.mjs';
import { stableId } from './orders-compare.mjs';

const SHEETS = {
  invoices: 'CrewInvoices',
  lines: 'CrewInvoiceLines',
  analysis: 'CrewRateAnalysis',
  exceptions: 'CrewInvoiceExceptions',
  importLog: 'CrewInvoiceImportLog',
  orderLines: 'OrderLines'
};

const INVOICE_HEADERS = ['invoice_id', 'invoice_number', 'job_id', 'job_number', 'job_url', 'customer', 'region', 'crew_name', 'trade', 'invoice_status', 'invoice_date', 'total_amount', 'approved_by', 'approved_on', 'paid_on', 'archived_status', 'ordered_labor_total', 'invoice_labor_total', 'master_labor_total', 'order_variance', 'master_variance', 'comparison_status', 'source_url', 'source_updated_at', 'import_batch_id', 'active'];
const LINE_HEADERS = ['line_id', 'invoice_id', 'job_id', 'order_id', 'order_line_id', 'item_name', 'normalized_item', 'uom', 'quantity', 'original_quantity', 'invoice_unit_price', 'invoice_total', 'custom_labor', 'note', 'requirements', 'order_unit_price', 'order_quantity', 'order_total', 'master_unit_price', 'master_total', 'invoice_vs_order_variance', 'invoice_vs_master_variance', 'price_source', 'match_method', 'order_match_confidence', 'match_confidence', 'comparison_status', 'imported_at', 'active'];
const ANALYSIS_HEADERS = ['analysis_id', 'region', 'crew_name', 'trade', 'item_name', 'uom', 'invoice_count', 'job_count', 'common_rate', 'minimum_rate', 'maximum_rate', 'rate_count', 'inconsistent'];
const EXCEPTION_HEADERS = ['exception_id', 'invoice_id', 'line_id', 'exception_type', 'status', 'reason', 'reviewed_by', 'reviewed_at', 'created_at', 'active'];
const IMPORT_HEADERS = ['import_id', 'started_at', 'completed_at', 'source', 'regions_expected', 'regions_completed', 'invoices_discovered', 'invoices_retained', 'invoice_lines_retained', 'custom_labor_lines', 'order_variances', 'master_variances', 'unmatched_lines', 'status', 'warnings', 'error'];

function clean(value) {
  return String(value ?? '').trim();
}

function normalizeKey(value) {
  return clean(value).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function rowsToObjects(values) {
  if (!values.length) return [];
  const headers = values[0].map(normalizeKey);
  return values.slice(1).filter((row) => row.some((cell) => cell !== '')).map((row) => (
    Object.fromEntries(headers.map((header, index) => [header, row[index] ?? '']))
  ));
}

function objectsToValues(headers, rows) {
  return [headers, ...rows.map((row) => headers.map((header) => row[header] ?? ''))];
}

async function metadata(sheets, spreadsheetId) {
  const response = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: 'sheets.properties(sheetId,title,gridProperties)'
  });
  return response.data.sheets || [];
}

async function readSheet(sheets, spreadsheetId, title) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${title.replace(/'/g, "''")}'`
  }).catch((error) => {
    if (error.code === 400) return { data: { values: [] } };
    throw error;
  });
  return response.data.values || [];
}

async function ensureSheets(sheets, spreadsheetId) {
  const existing = await metadata(sheets, spreadsheetId);
  const titles = new Set(existing.map((sheet) => sheet.properties.title));
  const missing = [SHEETS.invoices, SHEETS.lines, SHEETS.analysis, SHEETS.exceptions, SHEETS.importLog]
    .filter((title) => !titles.has(title));
  if (missing.length) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests: missing.map((title) => ({ addSheet: { properties: { title } } })) }
    });
  }
}

async function replaceValues(sheets, spreadsheetId, title, values) {
  const current = await metadata(sheets, spreadsheetId);
  const sheet = current.find((item) => item.properties.title === title);
  if (!sheet) throw new Error(`Protected sheet ${title} is missing.`);
  const rowCount = Math.max(values.length, 2);
  const columnCount = Math.max(...values.map((row) => row.length), 1);
  const grid = sheet.properties.gridProperties || {};
  if ((grid.rowCount || 0) < rowCount || (grid.columnCount || 0) < columnCount) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{
          updateSheetProperties: {
            properties: {
              sheetId: sheet.properties.sheetId,
              gridProperties: {
                rowCount: Math.max(grid.rowCount || 0, rowCount),
                columnCount: Math.max(grid.columnCount || 0, columnCount)
              }
            },
            fields: 'gridProperties.rowCount,gridProperties.columnCount'
          }
        }]
      }
    });
  }
  await sheets.spreadsheets.values.clear({ spreadsheetId, range: `'${title}'`, requestBody: {} });
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `'${title}'!A1`,
    valueInputOption: 'RAW',
    requestBody: { values }
  });
}

async function appendLog(sheets, spreadsheetId, row) {
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `'${SHEETS.importLog}'!A:P`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [IMPORT_HEADERS.map((header) => row[header] ?? '')] }
  });
}

export async function publishCrewPay(sheets, spreadsheetId, pricingRows, exportResult, runId, startedAt) {
  await ensureSheets(sheets, spreadsheetId);
  const [orderLineValues, exceptionValues] = await Promise.all([
    readSheet(sheets, spreadsheetId, SHEETS.orderLines),
    readSheet(sheets, spreadsheetId, SHEETS.exceptions)
  ]);
  const orderLines = rowsToObjects(orderLineValues);
  const reviewed = new Map(rowsToObjects(exceptionValues).map((row) => [row.exception_id, row]));
  const lines = [];
  const invoices = exportResult.records.map((detail) => {
    const compared = compareCrewInvoiceLines(detail.invoice, detail.lines, orderLines, pricingRows);
    lines.push(...compared.map((line) => ({
      ...line,
      normalized_item: normalizeKey(line.item_name),
      imported_at: new Date().toISOString(),
      active: 'Yes'
    })));
    return {
      ...aggregateCrewInvoice(detail.invoice, compared),
      source_updated_at: new Date().toISOString(),
      import_batch_id: runId,
      active: 'Yes'
    };
  });
  const analysis = buildCrewRateAnalysis(invoices, lines);
  const exceptions = lines.filter((line) => line.comparison_status !== 'Matched').map((line) => {
    const exceptionId = stableId(line.invoice_id, line.line_id, line.comparison_status);
    const prior = reviewed.get(exceptionId) || {};
    return {
      exception_id: exceptionId,
      invoice_id: line.invoice_id,
      line_id: line.line_id,
      exception_type: line.comparison_status,
      status: prior.status || 'Open',
      reason: line.comparison_status === 'Custom Labor'
        ? 'Blaze identifies this as a custom labor item.'
        : `Invoice, order, or master labor rate requires review for ${line.item_name}.`,
      reviewed_by: prior.reviewed_by || '',
      reviewed_at: prior.reviewed_at || '',
      created_at: prior.created_at || new Date().toISOString(),
      active: 'Yes'
    };
  });

  await replaceValues(sheets, spreadsheetId, SHEETS.invoices, objectsToValues(INVOICE_HEADERS, invoices));
  await replaceValues(sheets, spreadsheetId, SHEETS.lines, objectsToValues(LINE_HEADERS, lines));
  await replaceValues(sheets, spreadsheetId, SHEETS.analysis, objectsToValues(ANALYSIS_HEADERS, analysis));
  await replaceValues(sheets, spreadsheetId, SHEETS.exceptions, objectsToValues(EXCEPTION_HEADERS, exceptions));
  const customLabor = lines.filter((line) => line.comparison_status === 'Custom Labor').length;
  const orderVariances = lines.filter((line) => line.comparison_status === 'Order Variance').length;
  const masterVariances = lines.filter((line) => line.comparison_status === 'Master Variance').length;
  const unmatched = lines.filter((line) => /Needs Review|Missing/.test(line.comparison_status)).length;
  const warnings = [
    customLabor ? `${customLabor} custom labor line(s)` : '',
    orderVariances ? `${orderVariances} order variance(s)` : '',
    masterVariances ? `${masterVariances} master-rate variance(s)` : '',
    unmatched ? `${unmatched} unmatched line(s)` : ''
  ].filter(Boolean).join('; ');
  await appendLog(sheets, spreadsheetId, {
    import_id: runId,
    started_at: startedAt,
    completed_at: new Date().toISOString(),
    source: 'Blaze Production Invoices',
    regions_expected: exportResult.regionsExpected,
    regions_completed: exportResult.regionsCompleted,
    invoices_discovered: exportResult.invoicesDiscovered,
    invoices_retained: invoices.length,
    invoice_lines_retained: lines.length,
    custom_labor_lines: customLabor,
    order_variances: orderVariances,
    master_variances: masterVariances,
    unmatched_lines: unmatched,
    status: warnings ? 'Completed with warnings' : 'Completed',
    warnings,
    error: ''
  });
  return { invoices: invoices.length, lines: lines.length, analysis: analysis.length, exceptions: exceptions.length };
}

export async function recordCrewPayFailure(sheets, spreadsheetId, runId, startedAt, message) {
  await ensureSheets(sheets, spreadsheetId);
  await appendLog(sheets, spreadsheetId, {
    import_id: runId,
    started_at: startedAt,
    completed_at: new Date().toISOString(),
    source: 'Blaze Production Invoices',
    status: 'Failed',
    error: message
  });
}
