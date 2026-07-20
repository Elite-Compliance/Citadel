import fs from 'node:fs';
import { parse } from 'csv-parse/sync';

export const REVIEW_HEADERS = [
  'monitor',
  'platform',
  'name',
  'rating',
  'review_title',
  'review_text',
  'review_date',
  'review_url',
  'created_at'
];

function normalized(value) {
  return String(value ?? '').trim();
}

function rowSignature(row) {
  return REVIEW_HEADERS.map((header) => normalized(row[header])).join('\u001f');
}

function identitySignature(row) {
  return [row.review_url, row.review_date, row.name, row.monitor].map(normalized).join('\u001f');
}

export function validateReviewsExport(filePath) {
  if (!filePath || !fs.existsSync(filePath)) throw new Error('Removify did not produce a Reviews CSV export.');
  const source = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const rows = parse(source, {
    columns: true,
    bom: true,
    skip_empty_lines: true,
    relax_quotes: true,
    trim: false
  });
  const headers = Object.keys(rows[0] || {});
  const missing = REVIEW_HEADERS.filter((header) => !headers.includes(header));
  const unexpected = headers.filter((header) => !REVIEW_HEADERS.includes(header));
  if (missing.length || unexpected.length) {
    throw new Error(`Unexpected Removify columns. Missing: ${missing.join(', ') || 'none'}. Unexpected: ${unexpected.join(', ') || 'none'}.`);
  }
  if (!rows.length) throw new Error('The Removify export contains no review rows.');

  const errors = [];
  const exactCounts = new Map();
  const identityCounts = new Map();
  for (const [index, row] of rows.entries()) {
    const rowNumber = index + 2;
    for (const field of ['monitor', 'platform', 'name', 'rating', 'review_date', 'review_url', 'created_at']) {
      if (!normalized(row[field])) errors.push(`row ${rowNumber}: ${field} is blank`);
    }
    const rating = Number(normalized(row.rating));
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) errors.push(`row ${rowNumber}: rating is not between 1 and 5`);
    const exactKey = rowSignature(row);
    const identityKey = identitySignature(row);
    exactCounts.set(exactKey, (exactCounts.get(exactKey) || 0) + 1);
    identityCounts.set(identityKey, (identityCounts.get(identityKey) || 0) + 1);
  }
  if (errors.length) throw new Error(`Removify validation failed: ${errors.slice(0, 10).join('; ')}${errors.length > 10 ? `; plus ${errors.length - 10} more` : ''}.`);

  const exactDuplicateRows = [...exactCounts.values()].reduce((total, count) => total + Math.max(count - 1, 0), 0);
  const identityDuplicateRows = [...identityCounts.values()].reduce((total, count) => total + Math.max(count - 1, 0), 0);
  const values = [REVIEW_HEADERS, ...rows.map((row) => REVIEW_HEADERS.map((header) => row[header] ?? ''))];
  return { rows, values, rowCount: rows.length, exactDuplicateRows, identityDuplicateRows };
}