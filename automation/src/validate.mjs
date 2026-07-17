import fs from 'node:fs';
import * as XLSX from 'xlsx';
import { parse } from 'csv-parse/sync';
import { LIEN_REPORTS, PAYMENT_HEADERS } from './config.mjs';

const UUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

function normalizedKey(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ');
}

function field(row, candidates) {
  const keys = Object.keys(row || {});
  const wanted = candidates.map(normalizedKey);
  const key = keys.find((item) => wanted.includes(normalizedKey(item)));
  return key ? row[key] : '';
}

function jobIdFromLink(value) {
  const match = String(value || '').match(UUID_PATTERN);
  return match ? match[0].toLowerCase() : '';
}

function readReceivablesWorkbook(filePath) {
  const workbook = XLSX.readFile(filePath, { cellDates: false });
  const sheetName = workbook.SheetNames.includes('Receivables Report')
    ? 'Receivables Report'
    : workbook.SheetNames[0];
  if (!sheetName) throw new Error(`No worksheet found in ${filePath}.`);
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '', raw: false });
}

export function validateLienReportSet(filesByName) {
  const results = [];
  const idsByReport = new Map();
  const jobNumbers = new Map();

  for (const report of LIEN_REPORTS) {
    const filePath = filesByName.get(report.fileName);
    if (!filePath || !fs.existsSync(filePath)) throw new Error(`Missing exported report: ${report.fileName}.`);
    const rows = readReceivablesWorkbook(filePath);
    const ids = new Set();
    let duplicateIds = 0;
    let invalidRows = 0;

    for (const row of rows) {
      const blazeId = jobIdFromLink(field(row, ['Job Link', 'job_link', 'Blaze URL', 'Job URL', 'URL']));
      const jobNumber = String(field(row, ['Job Number', 'job_number', 'Job', 'Account']) || '').trim().toLowerCase();
      if (!blazeId) {
        invalidRows += 1;
        continue;
      }
      if (ids.has(blazeId)) duplicateIds += 1;
      ids.add(blazeId);
      if (jobNumber) {
        if (!jobNumbers.has(jobNumber)) jobNumbers.set(jobNumber, new Set());
        jobNumbers.get(jobNumber).add(blazeId);
      }
    }

    if (invalidRows) throw new Error(`${report.fileName} has ${invalidRows} row(s) without a Blaze UUID in Job Link.`);
    if (duplicateIds) throw new Error(`${report.fileName} has ${duplicateIds} duplicate Blaze UUID row(s).`);
    if (report.master && !ids.size) throw new Error('Receivables Aging is empty. The previous protected data was not replaced.');
    idsByReport.set(report.fileName, ids);
    results.push({ name: report.fileName, rows: rows.length, uniqueJobs: ids.size, empty: rows.length === 0 });
  }

  const masterIds = idsByReport.get(LIEN_REPORTS.find((report) => report.master).fileName);
  let orphanMemberships = 0;
  const memberships = new Map();
  for (const report of LIEN_REPORTS) {
    for (const id of idsByReport.get(report.fileName)) {
      if (!report.master && !masterIds.has(id)) orphanMemberships += 1;
      if (!memberships.has(id)) memberships.set(id, new Set());
      memberships.get(id).add(report.status);
    }
  }
  if (orphanMemberships) {
    throw new Error(`${orphanMemberships} specialized-report row(s) are not present in Receivables Aging.`);
  }

  return {
    reports: results,
    activeJobs: masterIds.size,
    membershipRows: [...idsByReport.values()].reduce((sum, ids) => sum + ids.size, 0),
    multiStatusJobs: [...memberships.values()].filter((statuses) => statuses.size > 1).length,
    jobNumberCollisions: [...jobNumbers.values()].filter((ids) => ids.size > 1).length,
    emptyReports: results.filter((report) => report.empty).map((report) => report.name)
  };
}

export function validateDepositReport(filePath) {
  if (!filePath || !fs.existsSync(filePath)) throw new Error('The Deposit report was not exported.');
  const text = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const rows = parse(text, { columns: true, skip_empty_lines: true, relax_column_count: true, bom: true });
  if (!rows.length) throw new Error('The Deposit report is empty. The previous protected payment data was not replaced.');
  const headers = Object.keys(rows[0] || {});
  const missing = PAYMENT_HEADERS.filter((required) => !headers.some((header) => normalizedKey(header) === normalizedKey(required)));
  if (missing.length) throw new Error(`The Deposit report is missing required columns: ${missing.join(', ')}.`);
  return { rows, headers, rowCount: rows.length };
}

export function paymentSheetValues(depositValidation) {
  const headerMap = new Map(depositValidation.headers.map((header) => [normalizedKey(header), header]));
  const values = depositValidation.rows.map((row) => PAYMENT_HEADERS.map((header) => row[headerMap.get(normalizedKey(header))] ?? ''));
  return [PAYMENT_HEADERS, ...values];
}
