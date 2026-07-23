import { aggregateOrder, compareOrderLines, stableId } from './orders-compare.mjs';

const SHEETS = {
  orders: 'Orders',
  lines: 'OrderLines',
  exceptions: 'OrderExceptions',
  importLog: 'OrderImportLog'
};

const ORDER_HEADERS = ['order_id', 'order_number', 'job_id', 'job_number', 'job_url', 'customer', 'customer_phone', 'location', 'region', 'supplier', 'crew_name', 'trade', 'order_status', 'order_created_at', 'ordered_at', 'delivery_date', 'supplier_notified_at', 'supplier_acknowledged_at', 'material_status', 'material_actual', 'material_expected', 'material_variance', 'labor_actual', 'labor_expected', 'labor_variance', 'comparison_status', 'source_updated_at', 'import_batch_id', 'active'];
const LINE_HEADERS = ['line_id', 'order_id', 'job_id', 'section_id', 'line_type', 'item_name', 'sku', 'color', 'uom', 'quantity', 'blaze_unit_price', 'blaze_total', 'master_unit_price', 'master_total', 'variance', 'variance_percent', 'price_source', 'match_method', 'match_confidence', 'comparison_status', 'imported_at', 'active'];
const EXCEPTION_HEADERS = ['exception_id', 'order_id', 'line_id', 'exception_type', 'status', 'reason', 'reviewed_by', 'reviewed_at', 'created_at', 'active'];
const IMPORT_HEADERS = ['import_id', 'started_at', 'completed_at', 'source', 'year', 'regions_expected', 'regions_completed', 'jobs_discovered', 'orders_discovered', 'order_lines_retained', 'duplicate_lines', 'unmatched_lines', 'status', 'warnings', 'error'];

function normalizeKey(value) {
  return String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
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
  const missing = Object.values(SHEETS).filter((title) => !titles.has(title));
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
  const requests = [];
  if ((grid.rowCount || 0) < rowCount || (grid.columnCount || 0) < columnCount) {
    requests.push({
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
    });
  }
  if (requests.length) {
    await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests } });
  }
  await sheets.spreadsheets.values.clear({ spreadsheetId, range: `'${title}'`, requestBody: {} });
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `'${title}'!A1`,
    valueInputOption: 'RAW',
    requestBody: { values }
  });
}

async function appendImportLog(sheets, spreadsheetId, row) {
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `'${SHEETS.importLog}'!A:O`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [IMPORT_HEADERS.map((header) => row[header] ?? '')] }
  });
}

export async function loadMasterPricing(sheets, pricingSpreadsheetId) {
  const sheetsMeta = await metadata(sheets, pricingSpreadsheetId);
  const first = sheetsMeta[0]?.properties?.title;
  if (!first) throw new Error('Master Pricing does not contain a worksheet.');
  return rowsToObjects(await readSheet(sheets, pricingSpreadsheetId, first));
}

export async function publishOrders(sheets, spreadsheetId, pricingRows, exportResult, runId, startedAt) {
  await ensureSheets(sheets, spreadsheetId);
  const existingExceptions = rowsToObjects(await readSheet(sheets, spreadsheetId, SHEETS.exceptions));
  const reviewed = new Map(existingExceptions.map((row) => [row.exception_id, row]));
  const comparedLines = [];
  const orders = [];
  for (const detail of exportResult.records) {
    const lines = compareOrderLines(detail.lines, pricingRows);
    comparedLines.push(...lines);
    orders.push({
      ...aggregateOrder(detail.order, lines),
      source_updated_at: new Date().toISOString(),
      import_batch_id: runId,
      active: 'Yes'
    });
  }
  const exceptions = comparedLines
    .filter((line) => line.comparison_status === 'Needs Review' || line.comparison_status === 'Overpayment')
    .map((line) => {
      const type = line.comparison_status === 'Needs Review' ? 'Unmatched Pricing' : `${line.line_type === 'labor' ? 'Labor' : 'Material'} Overpayment`;
      const exceptionId = stableId(line.order_id, line.line_id, type);
      const prior = reviewed.get(exceptionId) || {};
      return {
        exception_id: exceptionId,
        order_id: line.order_id,
        line_id: line.line_id,
        exception_type: type,
        status: prior.status || 'Open',
        reason: line.comparison_status === 'Needs Review'
          ? 'No confident master-pricing match.'
          : `Blaze unit cost is above the matched master price by ${Number(line.variance || 0).toFixed(2)}.`,
        reviewed_by: prior.reviewed_by || '',
        reviewed_at: prior.reviewed_at || '',
        created_at: prior.created_at || new Date().toISOString(),
        active: 'Yes'
      };
    });

  await replaceValues(sheets, spreadsheetId, SHEETS.orders, objectsToValues(ORDER_HEADERS, orders));
  await replaceValues(sheets, spreadsheetId, SHEETS.lines, objectsToValues(LINE_HEADERS, comparedLines));
  await replaceValues(sheets, spreadsheetId, SHEETS.exceptions, objectsToValues(EXCEPTION_HEADERS, exceptions));
  const unmatched = comparedLines.filter((line) => line.comparison_status === 'Needs Review').length;
  await appendImportLog(sheets, spreadsheetId, {
    import_id: runId,
    started_at: startedAt,
    completed_at: new Date().toISOString(),
    source: 'Blaze Production Orders',
    year: 2026,
    regions_expected: exportResult.regionsExpected,
    regions_completed: exportResult.regionsCompleted,
    jobs_discovered: exportResult.jobsDiscovered,
    orders_discovered: orders.length,
    order_lines_retained: comparedLines.length,
    duplicate_lines: 0,
    unmatched_lines: unmatched,
    status: unmatched ? 'Completed with warnings' : 'Completed',
    warnings: unmatched ? `${unmatched} line(s) need master-pricing review.` : '',
    error: ''
  });
  return { orders: orders.length, lines: comparedLines.length, exceptions: exceptions.length, unmatched };
}

export async function recordOrdersFailure(sheets, spreadsheetId, runId, startedAt, message) {
  await ensureSheets(sheets, spreadsheetId);
  await appendImportLog(sheets, spreadsheetId, {
    import_id: runId,
    started_at: startedAt,
    completed_at: new Date().toISOString(),
    source: 'Blaze Production Orders',
    year: 2026,
    status: 'Failed',
    error: message
  });
}

