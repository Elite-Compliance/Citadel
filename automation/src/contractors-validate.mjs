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

function normalizedHeader(value) {
  return text(value).toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function sourceValue(source, aliases) {
  const wanted = new Set(aliases.map(normalizedHeader));
  const entry = Object.entries(source).find(([header]) => wanted.has(normalizedHeader(header)));
  return entry ? text(entry[1]) : '';
}

function uniqueList(values) {
  const found = new Map();
  for (const value of values.flatMap((item) => text(item).split(/[,;|]+/))) {
    const cleaned = text(value);
    if (cleaned && !found.has(cleaned.toLowerCase())) found.set(cleaned.toLowerCase(), cleaned);
  }
  return [...found.values()];
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
    const match = text(part).match(/^(.*?)\s*(?:\(([^()]+)\))?\s*\((ACTIVE|INACTIVE)\)\s*$/i);
    return match
      ? { name: text(match[1]), region: text(match[2]), status: match[3].toUpperCase() }
      : { name: text(part), region: '', status: 'UNKNOWN' };
  }).filter((crew) => crew.name);
}

function readRows(filePath) {
  const workbook = XLSX.readFile(filePath, { cellDates: false });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error('The Blaze subcontractor workbook has no worksheet.');
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '', raw: false, blankrows: false });
}

export function validateContractorsExport(filePath, now = new Date(), directoryRows = []) {
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
  const directoryByName = new Map(directoryRows.map((row) => [text(row.name).toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim(), row]));

  for (const [index, source] of sourceRows.entries()) {
    const name = text(source.Subcontractor);
    if (!name) throw new Error(`The subcontractor export has a blank Subcontractor value on row ${index + 2}.`);
    const normalizedName = name.toLowerCase();
    if (seenNames.has(normalizedName)) duplicateContractors += 1;
    seenNames.add(normalizedName);

    const contractorId = stableId('contractor', name);
    const directory = directoryByName.get(name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim()) || {};
    const glExpiry = dateValue(source['General Liability Expiration Date']);
    const wcExpiry = dateValue(source['Workers Compensation Expiration Date']);
    const compliance = complianceStatus(glExpiry, wcExpiry, now);
    const crews = splitCrews(source.Crews);
    const regions = uniqueList([
      ...(Array.isArray(directory.regions) ? directory.regions : [directory.regions]),
      sourceValue(source, ['Regions', 'Region', 'Service Regions', 'Coverage Regions']),
      ...crews.map((crew) => crew.region)
    ]).join(', ');
    const phone = text(directory.phone) || sourceValue(source, ['Phone', 'Phone Number', 'Primary Phone', 'Office Phone', 'Mobile Phone', 'Cell Phone']);
    const email = text(directory.email) || sourceValue(source, ['Email', 'Email Address', 'Primary Email']);
    const address = text(directory.address) || sourceValue(source, ['Address', 'Business Address', 'Mailing Address', 'Street Address', 'Address 1']);
    unparsedCrews += crews.filter((crew) => crew.status === 'UNKNOWN').length;

    contractorRows.push([
      contractorId, name, phone, email, regions, compliance.risk, compliance.documents, glExpiry, wcExpiry,
      compliance.action, address, normalizedStatus(source.Active), crews.length, updatedAt, 'Blaze Subcontractor Details'
    ]);

    for (const crew of crews) {
      crewRows.push([
        stableId('crew', `${contractorId}|${crew.name}`), contractorId, name, crew.name, crew.status, crew.region, updatedAt,
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
