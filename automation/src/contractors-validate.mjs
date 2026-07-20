import fs from 'node:fs';
import crypto from 'node:crypto';
import XLSX from 'xlsx';

export const CONTRACTOR_SOURCE_HEADERS = [
  'Subcontractor',
  'General Liability Expiration Date',
  'Workers Compensation Expiration Date',
  'Active',
  'Crews'
];

export const CONTRACTOR_RECORD_HEADERS = [
  'contractor_id',
  'Contractor',
  'Phone',
  'Email',
  'Regions',
  'Risk',
  'Documents',
  'GL Expiry',
  'WC Expiry',
  'Next Action',
  'Address',
  'Active',
  'Crew Count',
  'Source Updated At',
  'Source System'
];

export const CONTRACTOR_CREW_HEADERS = [
  'crew_id',
  'contractor_id',
  'contractor_name',
  'crew_name',
  'crew_status',
  'region',
  'source_updated_at',
  'active'
];

function text(value) {
  return String(value ?? '').trim();
}

function stableId(prefix, value) {
  return `${prefix}-${crypto.createHash('sha256').update(text(value).toLowerCase()).digest('hex').slice(0, 16)}`;
}

function normalizedStatus(value) {
  return /^(yes|true|active|1)$/i.test(text(value)) ? 'Yes' : 'No';
}

function dateValue(value) {
  const raw = text(value);
  if (!raw) return '';
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  return parsed.toISOString().slice(0, 10);
}

function daysUntil(value, now) {
  if (!value) return Number.POSITIVE_INFINITY;
  const parsed = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? Number.POSITIVE_INFINITY : Math.floor((parsed.getTime() - now.getTime()) / 86400000);
}

function complianceStatus(glExpiry, wcExpiry, now) {
  const minimum = Math.min(daysUntil(glExpiry, now), daysUntil(wcExpiry, now));
  if (minimum < 0) return { documents: 'Expired', risk: '70 High', action: 'Renew expired insurance' };
  if (minimum <= 30) return { documents: 'Expiring Soon', risk: '50 Review', action: 'Request updated insurance' };
  return { documents: 'Current', risk: '20 Monitor', action: 'Monitor compliance dates' };
}

function splitCrews(value) {
  const raw = text(value);
  if (!raw) return [];
  return raw.split(/,\s*(?=[^,]+\((?:ACTIVE|INACTIVE)\)\s*(?:,|$))/i).map((part) => {
    const match = text(part).match(/^(.*?)\s*\((ACTIVE|INACTIVE)\)\s*$/i);
    return match ? { name: text(match[1]), status: match[2].toUpperCase() } : { name: text(part), status: 'UNKNOWN' };
  }).filter((crew) => crew.name);
}

function readRows(filePath) {
  const workbook = XLSX.readFile(filePath, { cellDates: false });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error('The Blaze subcontractor workbook has no worksheet.');
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '', raw: false, blankrows: false });
}

export function validateContractorsExport(filePath, now = new Date()) {
  if (!filePath || !fs.existsSync(filePath)) throw new Error('Blaze did not produce a subcontractor Excel export.');
  const sourceRows = readRows(filePath);
  if (!sourceRows.length) throw new Error('The Blaze subcontractor export contains no rows.');

  const headers = Object.keys(sourceRows[0]);
  const missing = CONTRACTOR_SOURCE_HEADERS.filter((header) => !headers.includes(header));
  if (missing.length) throw new Error(`The subcontractor export is missing required columns: ${missing.join(', ')}.`);

  const seenNames = new Set();
  const contractorRows = [];
  const crewRows = [];
  let duplicateContractors = 0;
  let unparsedCrews = 0;
  const updatedAt = now.toISOString();

  for (const [index, source] of sourceRows.entries()) {
    const name = text(source.Subcontractor);
    if (!name) throw new Error(`The subcontractor export has a blank Subcontractor value on row ${index + 2}.`);
    const normalizedName = name.toLowerCase();
    if (seenNames.has(normalizedName)) duplicateContractors += 1;
    seenNames.add(normalizedName);

    const contractorId = stableId('contractor', name);
    const glExpiry = dateValue(source['General Liability Expiration Date']);
    const wcExpiry = dateValue(source['Workers Compensation Expiration Date']);
    const compliance = complianceStatus(glExpiry, wcExpiry, now);
    const crews = splitCrews(source.Crews);
    unparsedCrews += crews.filter((crew) => crew.status === 'UNKNOWN').length;

    contractorRows.push([
      contractorId, name, '', '', '', compliance.risk, compliance.documents, glExpiry, wcExpiry,
      compliance.action, '', normalizedStatus(source.Active), crews.length, updatedAt, 'Blaze Subcontractor Details'
    ]);

    for (const crew of crews) {
      crewRows.push([
        stableId('crew', `${contractorId}|${crew.name}`), contractorId, name, crew.name, crew.status, '', updatedAt,
        crew.status === 'ACTIVE' ? 'Yes' : 'No'
      ]);
    }
  }

  return {
    contractorValues: [CONTRACTOR_RECORD_HEADERS, ...contractorRows],
    crewValues: [CONTRACTOR_CREW_HEADERS, ...crewRows],
    contractorCount: contractorRows.length,
    crewCount: crewRows.length,
    duplicateContractors,
    unparsedCrews
  };
}
