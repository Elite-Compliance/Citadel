const CITADEL_VERSION = '1.3.9';
const SPREADSHEETS = {
  commandCenter: '1zouXOWT2OIH-B74I0CAu1Ox-80s5bj2gDG2t_R2qGII',
  liens: '1X53Or2M0ORxtSAgpE9edH1cTo11Q8FNrXpytsWFcLLQ',
  contractors: '1qsMCA_kC129S4FbbMiLt1X9_VJlkwPRqGxx0WRrPuTg',
  pricing: '1kF3oCkjkMzAqwohT-pYk2CSKkZ0C5hGx3aPee9XsIgY',
  reviews: '1EjRpoie4MP8eE4SmYi0xqXIbGavH3ffz5DTb-MUdE1U',
  fleet: '1cUbzbYW_7UCwD4oD9_pSWZBLDZYF3VpvqBijUOMBhuo',
  registrations: '1_vi1q6qUu821TiUgMtelsF4ya2EBsXlPIlt-COEb6X8'
};
const LIEN_STATUS_REPORTS_FOLDER_ID = '1XcllT_u0WP7H5Cr9zvw9G6NNcOUTYcTH';
const LIEN_MASTER_REPORT_NAME = 'Receivables Aging';
const REQUIRED_LIEN_RECORD_COLUMNS = ['blaze_url', 'days_past_due', 'first_invoice_date', 'latest_invoice_date', 'invoice_count', 'no_payment_received', 'payment_received', 'last_payment_date', 'payment_status'];
const SHEETS = {
  commandMetrics: 'CommandMetrics',
  commandFocus: 'CommandFocus',
  lienRecords: 'LienRecords',
  lienNotes: 'LienNotes',
  lienAlerts: 'LienAlerts',
  lienFollowUps: 'LienFollowUps',
  lienMetrics: 'LienMetrics',
  contractorRecords: 'ContractorRecords',
  contractorNotes: 'ContractorNotes',
  contractorAlerts: 'ContractorAlerts',
  contractorFollowUps: 'ContractorFollowUps',
  contractorMetrics: 'ContractorMetrics',
  reviewRecords: 'ReviewRecords',
  reviewNotes: 'ReviewNotes',
  reviewAlerts: 'ReviewAlerts',
  reviewFollowUps: 'ReviewFollowUps',
  reviewMetrics: 'ReviewMetrics',
  fleet: 'Fleet',
  fleetVehicles: 'FleetVehicles',
  fleetDrivers: 'FleetDrivers',
  fleetNotes: 'FleetNotes',
  fleetAlerts: 'FleetAlerts',
  fleetFollowUps: 'FleetFollowUps',
  fleetMetrics: 'FleetMetrics',
  registrationRequests: 'RegistrationRequests'
};

const CONTRACTOR_RECORD_HEADERS = ['Contractor', 'Phone', 'Email', 'Regions', 'Risk', 'Documents', 'GL Expiry', 'WC Expiry', 'Next Action', 'Address'];
const CONTRACTOR_NOTE_HEADERS = ['note_id', 'contractor_id', 'note_date', 'note_by', 'note_type', 'note_text', 'follow_up_date', 'active'];
const CONTRACTOR_ALERT_HEADERS = ['alert_id', 'contractor_id', 'alert_type', 'alert_text', 'priority', 'owner', 'due_date', 'status', 'created_date', 'resolved_date', 'active'];
const CONTRACTOR_FOLLOWUP_HEADERS = ['followup_id', 'contractor_id', 'assigned_to', 'due_date', 'followup_type', 'followup_text', 'status', 'created_by', 'created_date', 'completed_date', 'active'];
const CONTRACTOR_METRIC_HEADERS = ['metric_key', 'label', 'value', 'note', 'tone', 'sort_order'];
const REVIEW_RECORD_HEADERS = ['monitor', 'platform', 'name', 'rating', 'review_title', 'review_text', 'review_date', 'review_url', 'created_at'];
const REVIEW_NOTE_HEADERS = ['note_id', 'review_id', 'note_date', 'note_by', 'note_type', 'note_text', 'follow_up_date', 'active'];
const REVIEW_ALERT_HEADERS = ['alert_id', 'review_id', 'alert_type', 'alert_text', 'priority', 'owner', 'due_date', 'status', 'created_date', 'resolved_date', 'active'];
const REVIEW_FOLLOWUP_HEADERS = ['followup_id', 'review_id', 'assigned_to', 'due_date', 'followup_type', 'followup_text', 'status', 'created_by', 'created_date', 'completed_date', 'active'];
const REVIEW_METRIC_HEADERS = ['metric_key', 'label', 'value', 'note', 'tone', 'sort_order'];
const FLEET_SOURCE_HEADERS = ['Device', 'Device Group', 'First Name', 'Last Name', 'Current Driver', 'Work time', 'Current Activity', 'In Privacy Mode', 'Last Stop Address', 'Last Stop Zone Types', 'Current Odometer', 'Current Engine Hours', 'Active from', 'Active to', 'Is Archived (Historical)', 'Plan', 'Device Type', 'Firmware Version', 'Serial No.', 'License Plate', 'License State/Province', 'VIN', 'Time Zone', 'Device Comment', 'Download Status', 'Last Trip', 'Last Communication Date'];
const FLEET_VEHICLE_HEADERS = ['vehicle_id', 'unit_number', 'device_group', 'region', 'status', 'service_status', 'registration_status', 'vin', 'plate', 'license_state', 'make', 'model', 'year', 'assigned_driver', 'current_activity', 'last_stop_address', 'current_odometer', 'current_engine_hours', 'active_from', 'active_to', 'is_archived', 'plan', 'device_type', 'firmware_version', 'serial_no', 'time_zone', 'device_comment', 'download_status', 'last_trip', 'last_communication_date', 'last_updated'];
const FLEET_DRIVER_HEADERS = ['driver_id', 'driver_name', 'first_name', 'last_name', 'region', 'status', 'phone', 'email', 'license_expiry', 'medical_card_expiry', 'insurance_expiry', 'assigned_vehicle', 'current_activity', 'work_time', 'last_stop_address', 'next_action', 'last_updated'];
const FLEET_NOTE_HEADERS = ['note_id', 'fleet_record_id', 'record_type', 'note_date', 'note_by', 'note_type', 'note_text', 'follow_up_date', 'active'];
const FLEET_ALERT_HEADERS = ['alert_id', 'fleet_record_id', 'record_type', 'alert_type', 'alert_text', 'priority', 'owner', 'due_date', 'status', 'created_date', 'resolved_date', 'active'];
const FLEET_FOLLOWUP_HEADERS = ['followup_id', 'fleet_record_id', 'record_type', 'assigned_to', 'due_date', 'followup_type', 'followup_text', 'status', 'created_by', 'created_date', 'completed_date', 'active'];
const FLEET_METRIC_HEADERS = ['metric_key', 'label', 'value', 'note', 'tone', 'sort_order'];
const REGISTRATION_REQUEST_HEADERS = ['request_id', 'submitted_at', 'requestor_name', 'brand', 'date_submitted', 'region', 'pure', 'jurisdiction', 'requirements', 'website', 'phone', 'email', 'notes', 'status', 'stage', 'assigned_to', 'completed_date', 'active', 'source_system', 'source_record_id', 'received_date', 'researched_date', 'submitted_license_date', 'license_received_date', 'archived_date', 'renewal_due_date', 'license_type_name', 'license_number', 'expiration', 'qualifier', 'continuing_education_hours', 'elite_owned', 'expires_soon_flag', 'expired_flag', 'license_category', 'license_action', 'bond_type', 'coi_type', 'payment_status', 'payment_method', 'documents_included', 'submission_method', 'research_notes', 'received_license_name', 'received_license_state', 'received_license_type', 'ce_due_date', 'ce_reminder_days'];

function doGet(e) {
  const action = getParam_(e, 'action') || 'getLiens';

  try {
    if (action === 'getLiens') {
      return output_(e, { ok: true, data: getLiens(), version: CITADEL_VERSION });
    }

    if (action === 'getContractors') {
      return output_(e, { ok: true, data: getContractors(), version: CITADEL_VERSION });
    }

    if (action === 'getPricing') {
      return output_(e, { ok: true, data: getPricing(e), version: CITADEL_VERSION });
    }

    if (action === 'getReviews') {
      return output_(e, { ok: true, data: getReviews(), version: CITADEL_VERSION });
    }

    if (action === 'getFleet') {
      return output_(e, { ok: true, data: getFleet(), version: CITADEL_VERSION });
    }

    if (action === 'saveLienNote') {
      return output_(e, { ok: true, data: saveLienNote(paramsToPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'saveLienAlert') {
      return output_(e, { ok: true, data: saveLienAlert(paramsToPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'saveLienFollowUp') {
      return output_(e, { ok: true, data: saveLienFollowUp(paramsToPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'saveContractorNote') {
      return output_(e, { ok: true, data: saveContractorNote(paramsToPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'saveContractorAlert') {
      return output_(e, { ok: true, data: saveContractorAlert(paramsToPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'saveContractorFollowUp') {
      return output_(e, { ok: true, data: saveContractorFollowUp(paramsToPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'saveReviewNote') {
      return output_(e, { ok: true, data: saveReviewNote(paramsToPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'saveReviewAlert') {
      return output_(e, { ok: true, data: saveReviewAlert(paramsToPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'saveReviewFollowUp') {
      return output_(e, { ok: true, data: saveReviewFollowUp(paramsToPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'getRegistrations') {
      return output_(e, { ok: true, data: getRegistrations(), version: CITADEL_VERSION });
    }

    if (action === 'setupRegistrationsSheet') {
      return output_(e, { ok: true, data: setupRegistrationsSheet(), version: CITADEL_VERSION });
    }

    if (action === 'importRegistrationStartingData') {
      return output_(e, { ok: true, data: importRegistrationStartingData(), version: CITADEL_VERSION });
    }

    if (action === 'saveRegistrationRequest') {
      return output_(e, { ok: true, data: saveRegistrationRequest(paramsToPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'updateRegistrationRequest') {
      return output_(e, { ok: true, data: updateRegistrationRequest(paramsToPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'setupContractorsSheet') {
      return output_(e, { ok: true, data: setupContractorsSheet(), version: CITADEL_VERSION });
    }

    if (action === 'setupReviewsSheet') {
      return output_(e, { ok: true, data: setupReviewsSheet(), version: CITADEL_VERSION });
    }

    if (action === 'importLienStatusReports') {
      return output_(e, { ok: true, data: importLienStatusReports(), version: CITADEL_VERSION });
    }

    return output_(e, { ok: false, error: 'Unknown action: ' + action });
  } catch (error) {
    return output_(e, { ok: false, error: error.message || String(error) });
  }
}

function doPost(e) {
  const action = getParam_(e, 'action');

  try {
    return output_(e, { ok: false, error: 'Unknown action: ' + action });
  } catch (error) {
    return output_(e, { ok: false, error: error.message || String(error) });
  }
}

function getRegistrationsSpreadsheetId_() {
  return SPREADSHEETS.registrations || SPREADSHEETS.commandCenter;
}

function setupRegistrationsSheet() {
  const spreadsheetId = getRegistrationsSpreadsheetId_();
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.registrationRequests, REGISTRATION_REQUEST_HEADERS);
  return { spreadsheet_id: spreadsheetId, sheets: [SHEETS.registrationRequests] };
}

function getRegistrations() {
  setupRegistrationsSheet();
  const importResult = ensureRegistrationStartingDataImported_();
  const requests = readSheetObjects_(getRegistrationsSpreadsheetId_(), SHEETS.registrationRequests);
  return { requests: requests, import_status: importResult };
}

function ensureRegistrationStartingDataImported_() {
  const existing = readSheetObjects_(getRegistrationsSpreadsheetId_(), SHEETS.registrationRequests);
  if (existing.length) return { skipped: true, reason: 'RegistrationRequests already has rows', existing: existing.length };
  return importRegistrationStartingData();
}

function normalizeRegistrationStarterRowsActive() {
  setupRegistrationsSheet();
  const spreadsheetId = getRegistrationsSpreadsheetId_();
  const sheet = getRequiredSheet_(spreadsheetId, SHEETS.registrationRequests);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return { updated: 0, reason: 'No registration rows found.' };
  const headers = values[0].map(normalizeHeader_);
  const sourceIndex = headers.indexOf('source_system');
  const statusIndex = headers.indexOf('status');
  const stageIndex = headers.indexOf('stage');
  const activeIndex = headers.indexOf('active');
  if (sourceIndex < 0 || statusIndex < 0 || stageIndex < 0 || activeIndex < 0) {
    throw new Error('RegistrationRequests is missing source_system, status, stage, or active. Run setupRegistrationsSheet first.');
  }
  let updated = 0;
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][sourceIndex]) !== 'registration-starting-data') continue;
    sheet.getRange(i + 1, statusIndex + 1).setValue('Active');
    sheet.getRange(i + 1, stageIndex + 1).setValue('Active');
    sheet.getRange(i + 1, activeIndex + 1).setValue(true);
    updated++;
  }
  return { updated: updated, status: 'Active', stage: 'Active' };
}

function testNormalizeRegistrationStarterRowsActive() {
  Logger.log(JSON.stringify(normalizeRegistrationStarterRowsActive(), null, 2));
}

function importRegistrationStartingData() {
  setupRegistrationsSheet();
  const spreadsheetId = getRegistrationsSpreadsheetId_();
  const sourceSheet = getRegistrationSourceSheet_(spreadsheetId);
  if (!sourceSheet) return { imported: 0, skipped: true, reason: 'No Sheet1 or starting data sheet found' };

  const sourceLastRow = sourceSheet.getLastRow();
  const sourceLastColumn = sourceSheet.getLastColumn();
  if (sourceLastRow < 2 || sourceLastColumn < 1) {
    return { imported: 0, skipped: true, reason: 'No starting rows found on ' + sourceSheet.getName() };
  }

  const values = sourceSheet.getRange(1, 1, sourceLastRow, sourceLastColumn).getValues();
  const headers = values[0].map(normalizeHeader_);
  const targetSheet = getRequiredSheet_(spreadsheetId, SHEETS.registrationRequests);
  const targetHeaders = targetSheet.getRange(1, 1, 1, targetSheet.getLastColumn()).getValues()[0].map(normalizeHeader_);
  const existing = readSheetObjects_(spreadsheetId, SHEETS.registrationRequests);
  const existingKeys = existing.reduce(function(map, row) {
    const key = String(row.source_record_id || row.request_id || '');
    if (key) map[key] = true;
    return map;
  }, {});

  const records = [];
  values.slice(1).forEach(function(row, index) {
    if (!row.some(function(cell) { return cell !== '' && cell !== null; })) return;
    const raw = headers.reduce(function(record, header, col) {
      if (header) record[header] = normalizeValue_(row[col]);
      return record;
    }, {});
    const record = mapRegistrationStartingRow_(raw, index + 2);
    if (existingKeys[record.source_record_id]) return;
    existingKeys[record.source_record_id] = true;
    records.push(record);
  });

  if (!records.length) {
    return { imported: 0, skipped: true, reason: 'No new starter rows to import', source_sheet: sourceSheet.getName(), existing: existing.length };
  }

  const outputRows = records.map(function(record) {
    return targetHeaders.map(function(header) {
      return Object.prototype.hasOwnProperty.call(record, header) ? record[header] : '';
    });
  });
  targetSheet.getRange(targetSheet.getLastRow() + 1, 1, outputRows.length, targetHeaders.length).setValues(outputRows);

  return { imported: records.length, source_sheet: sourceSheet.getName(), region_buckets: REGISTRATION_REGION_CODES_() };
}

function getRegistrationSourceSheet_(spreadsheetId) {
  const ss = SpreadsheetApp.openById(spreadsheetId);
  const sheet1 = ss.getSheetByName('Sheet1');
  if (sheet1 && sheet1.getName() !== SHEETS.registrationRequests) return sheet1;
  const sheets = ss.getSheets();
  for (let i = 0; i < sheets.length; i++) {
    if (sheets[i].getName() !== SHEETS.registrationRequests) return sheets[i];
  }
  return null;
}

function REGISTRATION_REGION_CODES_() {
  return ['PHX', 'STL', 'MIL', 'CLE', 'CHI', 'MIN', 'ABQ', 'PIT', 'IND', 'OT'];
}

function normalizeCitadelRegion_(value) {
  const text = String(value || '').toUpperCase();
  if (!text) return 'OT';
  if (/\b(PHX|PHOENIX|PHEONIX|AZ|ARIZONA)\b/.test(text)) return 'PHX';
  if (/\b(STL|ST\.?\s*LOUIS|SAINT\s*LOUIS|MO|MISSOURI)\b/.test(text)) return 'STL';
  if (/\b(MIL|MILWAUKEE|WI|WISCONSIN)\b/.test(text)) return 'MIL';
  if (/\b(CLE|CLEVELAND|OH|OHIO)\b/.test(text)) return 'CLE';
  if (/\b(CHI|CHICAGO|IL|ILLINOIS)\b/.test(text)) return 'CHI';
  if (/\b(MIN|MINNEAPOLIS|MN|MINNESOTA)\b/.test(text)) return 'MIN';
  if (/\b(ABQ|ALBUQUERQUE|NM|NEW\s*MEXICO)\b/.test(text)) return 'ABQ';
  if (/\b(PIT|PITTSBURGH|PITTSBURG|PA|PENNSYLVANIA)\b/.test(text)) return 'PIT';
  if (/\b(IND|INDIANAPOLIS|IN|INDIANA)\b/.test(text)) return 'IND';
  return 'OT';
}

function getFirstRegistrationValue_(row, names) {
  for (let i = 0; i < names.length; i++) {
    if (Object.prototype.hasOwnProperty.call(row, names[i]) && row[names[i]] !== '') return row[names[i]];
  }
  return '';
}

function isTruthyRegistrationFlag_(value) {
  return /^(true|yes|y|1|expired|x)$/i.test(String(value || '').trim());
}

function mapRegistrationStartingRow_(row, rowNumber) {
  const state = getFirstRegistrationValue_(row, ['State', 'state']);
  const jurisdiction = getFirstRegistrationValue_(row, ['Jurisdiction', 'jurisdiction']);
  const brand = getFirstRegistrationValue_(row, ['Brand', 'brand']);
  const licenseType = getFirstRegistrationValue_(row, ['License Type Name', 'license_type_name']);
  const number = getFirstRegistrationValue_(row, ['Number', 'number']);
  const expiration = getFirstRegistrationValue_(row, ['Expiration', 'expiration']);
  const qualifier = getFirstRegistrationValue_(row, ['Qualifier', 'qualifier']);
  const ceHours = getFirstRegistrationValue_(row, ['Continuing Education Hours', 'continuing_education_hours']);
  const notes = getFirstRegistrationValue_(row, ['Notes', 'notes']);
  const eliteOwned = getFirstRegistrationValue_(row, ['Elite Owned', 'elite_owned']);
  const expiredIn30 = getFirstRegistrationValue_(row, ['Expired in 30 days', 'expired_in_30_days']);
  const expiresWithin7 = getFirstRegistrationValue_(row, ['Expires within 7 days or Expired', 'expires_within_7_days_or_expired']);
  const region = normalizeCitadelRegion_(state + ' ' + jurisdiction);
  const flagged = isTruthyRegistrationFlag_(expiredIn30) || isTruthyRegistrationFlag_(expiresWithin7) || isDatePast_(expiration);
  const stage = 'Active';
  const sourceKey = ['license', state, jurisdiction, brand, licenseType, number, rowNumber].map(function(part) { return String(part || '').trim().toLowerCase(); }).join('|');
  const requirements = [
    licenseType ? 'License Type: ' + licenseType : '',
    number ? 'Number: ' + number : '',
    expiration ? 'Expiration: ' + expiration : '',
    qualifier ? 'Qualifier: ' + qualifier : '',
    ceHours ? 'CE Hours: ' + ceHours : ''
  ].filter(Boolean).join(' | ');
  return {
    request_id: 'reg-license-' + Utilities.base64EncodeWebSafe(sourceKey).slice(0, 18),
    submitted_at: new Date(),
    requestor_name: 'Imported License Data',
    brand: brand || 'Unknown',
    date_submitted: today_(),
    region: region,
    pure: '',
    jurisdiction: jurisdiction || state || 'Unknown jurisdiction',
    requirements: requirements || 'Imported license record',
    website: '',
    phone: '',
    email: '',
    notes: notes || '',
    status: 'Active',
    stage: 'Active',
    assigned_to: 'Emma',
    completed_date: '',
    active: true,
    source_system: 'registration-starting-data',
    source_record_id: sourceKey,
    license_type_name: licenseType,
    license_number: number,
    expiration: expiration,
    qualifier: qualifier,
    continuing_education_hours: ceHours,
    elite_owned: eliteOwned,
    expires_soon_flag: expiredIn30,
    expired_flag: expiresWithin7
  };
}

function updateRegistrationRequest(payload) {
  if (!payload || !payload.request_id) throw new Error('request_id is required.');
  setupRegistrationsSheet();
  const spreadsheetId = getRegistrationsSpreadsheetId_();
  const sheet = getRequiredSheet_(spreadsheetId, SHEETS.registrationRequests);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) throw new Error('No registration requests found.');
  const headers = values[0].map(normalizeHeader_);
  const idIndex = headers.indexOf('request_id');
  if (idIndex < 0) throw new Error('RegistrationRequests is missing request_id.');
  let rowNumber = -1;
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][idIndex]) === String(payload.request_id)) { rowNumber = i + 1; break; }
  }
  if (rowNumber < 0) throw new Error('Registration request not found.');
  const allowed = ['status', 'stage', 'assigned_to', 'completed_date', 'active', 'received_date', 'researched_date', 'submitted_license_date', 'license_received_date', 'archived_date', 'renewal_due_date', 'license_type_name', 'license_number', 'expiration', 'qualifier', 'continuing_education_hours', 'elite_owned', 'license_category', 'license_action', 'bond_type', 'coi_type', 'payment_status', 'payment_method', 'documents_included', 'submission_method', 'research_notes', 'received_license_name', 'received_license_state', 'received_license_type', 'ce_due_date', 'ce_reminder_days'];
  allowed.forEach(function(key) {
    if (!Object.prototype.hasOwnProperty.call(payload, key)) return;
    const col = headers.indexOf(key);
    if (col > -1) sheet.getRange(rowNumber, col + 1).setValue(payload[key]);
  });
  return { request_id: payload.request_id, updated: true };
}

function saveRegistrationRequest(payload) {
  if (!payload || !payload.requestor_name) throw new Error('requestor_name is required.');
  if (!payload.brand) throw new Error('brand is required.');
  if (!payload.region) throw new Error('region is required.');
  if (!payload.jurisdiction) throw new Error('jurisdiction is required.');
  if (!payload.requirements) throw new Error('requirements are required.');
  const record = {
    request_id: payload.request_id || makeId_('reg'),
    submitted_at: new Date(),
    requestor_name: payload.requestor_name || '',
    brand: payload.brand || '',
    date_submitted: payload.date_submitted || today_(),
    region: normalizeCitadelRegion_(payload.region || ''),
    pure: payload.pure || '',
    jurisdiction: payload.jurisdiction || '',
    requirements: payload.requirements || '',
    website: payload.website || '',
    phone: payload.phone || '',
    email: payload.email || '',
    notes: payload.notes || '',
    status: payload.status || 'New',
    stage: payload.stage || 'Info',
    assigned_to: payload.assigned_to || 'Emma',
    completed_date: payload.completed_date || '',
    active: true
  };
  setupRegistrationsSheet();
  appendObject_(getRegistrationsSpreadsheetId_(), SHEETS.registrationRequests, record);
  return record;
}

function setupReviewsSheet() {
  const spreadsheetId = getReviewsSpreadsheetId_();
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.reviewRecords, REVIEW_RECORD_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.reviewNotes, REVIEW_NOTE_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.reviewAlerts, REVIEW_ALERT_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.reviewFollowUps, REVIEW_FOLLOWUP_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.reviewMetrics, REVIEW_METRIC_HEADERS);
  return { spreadsheet_id: spreadsheetId, sheets: [SHEETS.reviewRecords, SHEETS.reviewNotes, SHEETS.reviewAlerts, SHEETS.reviewFollowUps, SHEETS.reviewMetrics] };
}

function getReviewSourceSheetName_(spreadsheetId) {
  const ss = SpreadsheetApp.openById(spreadsheetId);
  const recordSheet = ss.getSheetByName(SHEETS.reviewRecords);
  if (recordSheet && recordSheet.getLastRow() > 1) return SHEETS.reviewRecords;
  const workflowNames = [SHEETS.reviewNotes, SHEETS.reviewAlerts, SHEETS.reviewFollowUps, SHEETS.reviewMetrics];
  const source = ss.getSheets().find(function(sheet) { return workflowNames.indexOf(sheet.getName()) === -1 && sheet.getLastRow() > 1; });
  return source ? source.getName() : (recordSheet ? SHEETS.reviewRecords : ss.getSheets()[0].getName());
}

function getReviews() {
  const spreadsheetId = getReviewsSpreadsheetId_();
  const sourceSheet = getReviewSourceSheetName_(spreadsheetId);
  const rawRecords = readSheetObjects_(spreadsheetId, sourceSheet);
  const notes = sheetExists_(spreadsheetId, SHEETS.reviewNotes) ? readSheetObjects_(spreadsheetId, SHEETS.reviewNotes) : [];
  const alerts = sheetExists_(spreadsheetId, SHEETS.reviewAlerts) ? readSheetObjects_(spreadsheetId, SHEETS.reviewAlerts) : [];
  const followUps = sheetExists_(spreadsheetId, SHEETS.reviewFollowUps) ? readSheetObjects_(spreadsheetId, SHEETS.reviewFollowUps) : [];
  const records = rawRecords.map(mapReviewRecord_).filter(function(row) { return row.review_name || row.customer; });
  const activeAlerts = alerts.filter(isActiveRow_);
  const activeFollowUps = followUps.filter(isActiveRow_);
  const latestNoteByReview = latestById_(notes, 'review_id', 'note_date');
  return {
    metrics: sheetExists_(spreadsheetId, SHEETS.reviewMetrics) ? readSheetObjects_(spreadsheetId, SHEETS.reviewMetrics).sort(sortByOrder_) : buildReviewMetrics_(records, activeAlerts, activeFollowUps),
    notes: notes,
    alerts: activeAlerts,
    followUps: activeFollowUps,
    records: records.map(function(record) {
      const note = latestNoteByReview[String(record.review_id)] || {};
      record.workflow_note = note.note_text || '';
      record.notes_count = notes.filter(function(item) { return String(item.review_id) === String(record.review_id); }).length;
      record.alerts_count = activeAlerts.filter(function(item) { return String(item.review_id) === String(record.review_id); }).length;
      record.followups_count = activeFollowUps.filter(function(item) { return String(item.review_id) === String(record.review_id); }).length;
      return record;
    })
  };
}

function mapReviewRecord_(row) {
  const platform = getField_(row, ['platform']);
  const name = getField_(row, ['name', 'customer', 'customer_name']);
  const rating = getField_(row, ['rating']);
  const title = getField_(row, ['review_title', 'review title', 'title']);
  const text = getField_(row, ['review_text', 'review text', 'text']);
  const reviewDate = getField_(row, ['review_date', 'review date', 'date']);
  const url = getField_(row, ['review_url', 'review url', 'url']);
  const monitor = getField_(row, ['monitor']);
  const key = String(platform || '') + '|' + String(name || '') + '|' + String(title || '') + '|' + String(reviewDate || '') + '|' + String(text || '').slice(0, 80);
  const score = Number(String(rating || '').replace(/[^0-9.]/g, '')) || '';
  const result = score && score < 4 ? 'Needs Review' : 'Monitor';
  return {
    review_id: 'REV-' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, key)).slice(0, 12),
    monitor: monitor,
    platform: platform,
    review_name: title || name || platform,
    customer: name,
    region: platform,
    owner: 'Carlynn',
    status: result,
    result: result,
    score: rating,
    rating: rating,
    review_title: title,
    review_text: text,
    review_date: reviewDate,
    review_url: url,
    due_date: '',
    last_updated: getField_(row, ['created_at', 'created at']) || reviewDate || today_(),
    source_system: 'Reviews sheet',
    source_record_id: key,
    active: true
  };
}
function buildReviewMetrics_(records, alerts, followUps) {
  const findings = records.filter(function(row) { return /finding|exception|fail|recheck/i.test(String(row.result || row.status || '')); }).length;
  const due = records.filter(function(row) { return isDateWithinDays_(row.due_date, 7); }).length;
  return [
    { metric_key: 'reviews', label: 'Reviews', value: records.length, note: 'Current records', tone: 'blue', sort_order: 1 },
    { metric_key: 'findings', label: 'Findings', value: findings, note: 'Need attention', tone: 'amber', sort_order: 2 },
    { metric_key: 'due_soon', label: 'Due Soon', value: due, note: 'Next 7 days', tone: 'silver', sort_order: 3 },
    { metric_key: 'open_alerts', label: 'Open Alerts', value: alerts.length + followUps.length, note: 'Alerts + follow-ups', tone: 'red', sort_order: 4 }
  ];
}

function saveReviewNote(payload) {
  if (!payload || !payload.review_id) throw new Error('review_id is required.');
  const record = { note_id: payload.note_id || makeId_('review-note'), review_id: payload.review_id, note_date: payload.note_date || today_(), note_by: payload.note_by || 'Amanda', note_type: payload.note_type || 'General', note_text: payload.note_text || '', follow_up_date: payload.follow_up_date || '', active: true };
  ensureSheetWithHeaders_(getReviewsSpreadsheetId_(), SHEETS.reviewNotes, REVIEW_NOTE_HEADERS);
  appendObject_(getReviewsSpreadsheetId_(), SHEETS.reviewNotes, record);
  return record;
}

function saveReviewAlert(payload) {
  if (!payload || !payload.review_id) throw new Error('review_id is required.');
  const record = { alert_id: payload.alert_id || makeId_('review-alert'), review_id: payload.review_id, alert_type: payload.alert_type || 'Review', alert_text: payload.alert_text || '', priority: payload.priority || 'Normal', owner: payload.owner || 'Carlynn', due_date: payload.due_date || '', status: payload.status || 'Open', created_date: today_(), resolved_date: '', active: true };
  ensureSheetWithHeaders_(getReviewsSpreadsheetId_(), SHEETS.reviewAlerts, REVIEW_ALERT_HEADERS);
  appendObject_(getReviewsSpreadsheetId_(), SHEETS.reviewAlerts, record);
  return record;
}

function saveReviewFollowUp(payload) {
  if (!payload || !payload.review_id) throw new Error('review_id is required.');
  const record = { followup_id: payload.followup_id || makeId_('review-followup'), review_id: payload.review_id, assigned_to: payload.assigned_to || 'Carlynn', due_date: payload.due_date || '', followup_type: payload.followup_type || 'Review', followup_text: payload.followup_text || '', status: payload.status || 'Open', created_by: payload.created_by || 'Amanda', created_date: today_(), completed_date: '', active: true };
  ensureSheetWithHeaders_(getReviewsSpreadsheetId_(), SHEETS.reviewFollowUps, REVIEW_FOLLOWUP_HEADERS);
  appendObject_(getReviewsSpreadsheetId_(), SHEETS.reviewFollowUps, record);
  return record;
}

function setupContractorsSheet() {
  const spreadsheetId = getContractorsSpreadsheetId_();
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.contractorRecords, CONTRACTOR_RECORD_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.contractorNotes, CONTRACTOR_NOTE_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.contractorAlerts, CONTRACTOR_ALERT_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.contractorFollowUps, CONTRACTOR_FOLLOWUP_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.contractorMetrics, CONTRACTOR_METRIC_HEADERS);
  return { spreadsheet_id: spreadsheetId, sheets: [SHEETS.contractorRecords, SHEETS.contractorNotes, SHEETS.contractorAlerts, SHEETS.contractorFollowUps, SHEETS.contractorMetrics] };
}

function getContractors() {
  const spreadsheetId = getContractorsSpreadsheetId_();
  const rawRecords = sheetExists_(spreadsheetId, SHEETS.contractorRecords) ? readSheetObjects_(spreadsheetId, SHEETS.contractorRecords) : [];
  const notes = sheetExists_(spreadsheetId, SHEETS.contractorNotes) ? readSheetObjects_(spreadsheetId, SHEETS.contractorNotes) : [];
  const alerts = sheetExists_(spreadsheetId, SHEETS.contractorAlerts) ? readSheetObjects_(spreadsheetId, SHEETS.contractorAlerts) : [];
  const followUps = sheetExists_(spreadsheetId, SHEETS.contractorFollowUps) ? readSheetObjects_(spreadsheetId, SHEETS.contractorFollowUps) : [];
  const records = rawRecords.map(mapContractorRecord_).filter(function(row) { return row.contractor_name; });
  const activeAlerts = alerts.filter(isActiveRow_);
  const activeFollowUps = followUps.filter(isActiveRow_);
  const latestNoteByContractor = latestById_(notes, 'contractor_id', 'note_date');
  return {
    metrics: sheetExists_(spreadsheetId, SHEETS.contractorMetrics) ? readSheetObjects_(spreadsheetId, SHEETS.contractorMetrics).sort(sortByOrder_) : buildContractorMetrics_(records, activeAlerts, activeFollowUps),
    notes: notes,
    alerts: activeAlerts,
    followUps: activeFollowUps,
    records: records.map(function(record) {
      const note = latestNoteByContractor[String(record.contractor_id)] || {};
      record.workflow_note = note.note_text || '';
      record.notes_count = notes.filter(function(item) { return String(item.contractor_id) === String(record.contractor_id); }).length;
      record.alerts_count = activeAlerts.filter(function(item) { return String(item.contractor_id) === String(record.contractor_id); }).length;
      record.followups_count = activeFollowUps.filter(function(item) { return String(item.contractor_id) === String(record.contractor_id); }).length;
      return record;
    })
  };
}

function mapContractorRecord_(row) {
  const name = getField_(row, ['contractor', 'contractor_name', 'company_name', 'name']);
  const glExpiry = getField_(row, ['gl_expiry', 'gl expiry', 'general_liability_expiration_date', 'general liability expiration date']);
  const wcExpiry = getField_(row, ['wc_expiry', 'wc expiry', 'workers_compensation_expiration_date', 'workers compensation expiration date']);
  const documents = getField_(row, ['documents', 'document_status', 'status']) || getContractorDocumentStatus_(glExpiry, wcExpiry);
  const risk = getField_(row, ['risk', 'risk_level']) || getContractorRisk_(documents, glExpiry, wcExpiry);
  return {
    contractor_id: getField_(row, ['contractor_id', 'id']) || makeContractorId_(name),
    contractor_name: name,
    phone: getField_(row, ['phone', 'crew_phone']),
    email: getField_(row, ['email', 'orders_email']),
    regions_raw: getField_(row, ['regions', 'regions_raw', 'region']),
    risk: risk,
    documents: documents,
    gl_expiry: glExpiry,
    wc_expiry: wcExpiry,
    next_action: getField_(row, ['next_action', 'next action']) || getContractorNextAction_(documents, glExpiry, wcExpiry),
    address: getField_(row, ['address', 'billing_address']),
    active: getField_(row, ['active', 'is_active']) || '',
    source_system: 'Blaze contractor report',
    last_updated: today_()
  };
}

function saveContractorNote(payload) {
  if (!payload || !payload.contractor_id) throw new Error('contractor_id is required.');
  const record = {
    note_id: payload.note_id || makeId_('contractor-note'),
    contractor_id: payload.contractor_id,
    note_date: payload.note_date || today_(),
    note_by: payload.note_by || 'Amanda',
    note_type: payload.note_type || 'General',
    note_text: payload.note_text || '',
    follow_up_date: payload.follow_up_date || '',
    active: true
  };
  appendObject_(getContractorsSpreadsheetId_(), SHEETS.contractorNotes, record);
  return record;
}

function saveContractorAlert(payload) {
  if (!payload || !payload.contractor_id) throw new Error('contractor_id is required.');
  const record = {
    alert_id: payload.alert_id || makeId_('contractor-alert'),
    contractor_id: payload.contractor_id,
    alert_type: payload.alert_type || 'Compliance',
    alert_text: payload.alert_text || '',
    priority: payload.priority || 'High',
    owner: payload.owner || 'Carlynn',
    due_date: payload.due_date || today_(),
    status: payload.status || 'Open',
    created_date: payload.created_date || today_(),
    resolved_date: payload.resolved_date || '',
    active: true
  };
  appendObject_(getContractorsSpreadsheetId_(), SHEETS.contractorAlerts, record);
  return record;
}

function saveContractorFollowUp(payload) {
  if (!payload || !payload.contractor_id) throw new Error('contractor_id is required.');
  const record = {
    followup_id: payload.followup_id || makeId_('contractor-followup'),
    contractor_id: payload.contractor_id,
    assigned_to: payload.assigned_to || 'Carlynn',
    due_date: payload.due_date || today_(),
    followup_type: payload.followup_type || 'Compliance',
    followup_text: payload.followup_text || '',
    status: payload.status || 'Open',
    created_by: payload.created_by || 'Amanda',
    created_date: payload.created_date || today_(),
    completed_date: payload.completed_date || '',
    active: true
  };
  appendObject_(getContractorsSpreadsheetId_(), SHEETS.contractorFollowUps, record);
  return record;
}

function buildContractorMetrics_(records, alerts, followUps) {
  const expired = records.filter(function(row) { return /expired/i.test(String(row.documents || '')); }).length;
  const expiringSoon = records.filter(function(row) { return isDateWithinDays_(row.gl_expiry, 30) || isDateWithinDays_(row.wc_expiry, 30); }).length;
  const highRisk = records.filter(function(row) { return /high|critical/i.test(String(row.risk || '')); }).length;
  const openWorkflow = (alerts || []).length + (followUps || []).length;
  return [
    { metric_key: 'total_contractors', label: 'Contractors', value: records.length, note: 'Current report records', tone: 'blue', sort_order: 1 },
    { metric_key: 'expired_docs', label: 'Expired Docs', value: expired, note: 'GL or WC expired', tone: 'red', sort_order: 2 },
    { metric_key: 'expiring_soon', label: 'Expiring Soon', value: expiringSoon, note: 'Next 30 days', tone: 'amber', sort_order: 3 },
    { metric_key: 'high_risk', label: 'High Risk', value: highRisk, note: 'Needs compliance review', tone: 'silver', sort_order: 4 },
    { metric_key: 'open_workflow', label: 'Open Alerts', value: openWorkflow, note: 'Alerts + follow-ups', tone: 'blue', sort_order: 5 }
  ];
}

function getContractorsSpreadsheetId_() {
  const spreadsheetId = SPREADSHEETS.contractors;
  if (!spreadsheetId || spreadsheetId === 'PASTE_CONTRACTORS_SHEET_ID_HERE') throw new Error('Contractors spreadsheet ID is not configured yet.');
  return spreadsheetId;
}

function setupFleetSheet() {
  const spreadsheetId = getFleetSpreadsheetId_();
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.fleet, FLEET_SOURCE_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.fleetVehicles, FLEET_VEHICLE_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.fleetDrivers, FLEET_DRIVER_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.fleetNotes, FLEET_NOTE_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.fleetAlerts, FLEET_ALERT_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.fleetFollowUps, FLEET_FOLLOWUP_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.fleetMetrics, FLEET_METRIC_HEADERS);
  return { spreadsheet_id: spreadsheetId, sheets: [SHEETS.fleet, SHEETS.fleetVehicles, SHEETS.fleetDrivers, SHEETS.fleetNotes, SHEETS.fleetAlerts, SHEETS.fleetFollowUps, SHEETS.fleetMetrics] };
}

function getFleet() {
  const spreadsheetId = getFleetSpreadsheetId_();
  const fleetSource = readFleetSource_(spreadsheetId);
  const sourceRows = fleetSource.rows;
  const vehicles = sourceRows.length ? sourceRows.map(mapFleetVehicle_) : (sheetExists_(spreadsheetId, SHEETS.fleetVehicles) ? readSheetObjects_(spreadsheetId, SHEETS.fleetVehicles).map(mapFleetVehicle_) : []);
  const drivers = sheetExists_(spreadsheetId, SHEETS.fleetDrivers) ? readSheetObjects_(spreadsheetId, SHEETS.fleetDrivers).map(mapFleetDriver_) : [];
  const notes = sheetExists_(spreadsheetId, SHEETS.fleetNotes) ? readSheetObjects_(spreadsheetId, SHEETS.fleetNotes) : [];
  const alerts = sheetExists_(spreadsheetId, SHEETS.fleetAlerts) ? readSheetObjects_(spreadsheetId, SHEETS.fleetAlerts).filter(isActiveRow_) : [];
  const followUps = sheetExists_(spreadsheetId, SHEETS.fleetFollowUps) ? readSheetObjects_(spreadsheetId, SHEETS.fleetFollowUps).filter(isActiveRow_) : [];
  const metrics = sheetExists_(spreadsheetId, SHEETS.fleetMetrics) ? readSheetObjects_(spreadsheetId, SHEETS.fleetMetrics).sort(sortByOrder_) : buildFleetMetrics_(vehicles, drivers, alerts, followUps);
  return { metrics: metrics, fleetRecords: sourceRows.map(mapFleetSource_), vehicles: vehicles, drivers: drivers, notes: notes, alerts: alerts, followUps: followUps, source_rows: sourceRows.length, source_tab: fleetSource.name };
}

function readFleetSource_(spreadsheetId) {
  const ss = SpreadsheetApp.openById(spreadsheetId);
  const sourceSheet = findFleetSourceSheet_(ss);
  if (!sourceSheet) return { name: '', rows: [] };
  return { name: sourceSheet.getName(), rows: readSheetObjects_(spreadsheetId, sourceSheet.getName()) };
}

function findFleetSourceSheet_(ss) {
  const preferredNames = [SHEETS.fleet, 'Fleet', 'Geotab', 'Geotab Fleet', 'Fleet Report'];
  for (let i = 0; i < preferredNames.length; i++) {
    const sheet = ss.getSheetByName(preferredNames[i]);
    if (sheet && sheetLooksLikeFleetSource_(sheet)) return sheet;
  }
  const sheets = ss.getSheets();
  for (let j = 0; j < sheets.length; j++) {
    if (sheetLooksLikeFleetSource_(sheets[j])) return sheets[j];
  }
  return ss.getSheetByName(SHEETS.fleet);
}

function sheetLooksLikeFleetSource_(sheet) {
  if (!sheet || sheet.getLastRow() < 1 || sheet.getLastColumn() < 1) return false;
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(normalizeHeader_);
  return headers.indexOf('device') > -1 && headers.indexOf('device_group') > -1 && headers.indexOf('vin') > -1;
}

function mapFleetSource_(row) {
  return {
    device: getFleetField_(row, ['device']),
    device_group: getFleetField_(row, ['device_group', 'device group']),
    first_name: getFleetField_(row, ['first_name', 'first name']),
    last_name: getFleetField_(row, ['last_name', 'last name']),
    current_driver: getFleetField_(row, ['current_driver', 'current driver']),
    work_time: getFleetField_(row, ['work_time', 'work time']),
    current_activity: getFleetField_(row, ['current_activity', 'current activity']),
    in_privacy_mode: getFleetField_(row, ['in_privacy_mode', 'in privacy mode']),
    last_stop_address: getFleetField_(row, ['last_stop_address', 'last stop address']),
    last_stop_zone_types: getFleetField_(row, ['last_stop_zone_types', 'last stop zone types']),
    current_odometer: getFleetField_(row, ['current_odometer', 'current odometer']),
    current_engine_hours: getFleetField_(row, ['current_engine_hours', 'current engine hours']),
    active_from: getFleetField_(row, ['active_from', 'active from']),
    active_to: getFleetField_(row, ['active_to', 'active to']),
    is_archived: getFleetField_(row, ['is_archived_historical', 'is archived historical', 'is_archived', 'archived']),
    plan: getFleetField_(row, ['plan']),
    device_type: getFleetField_(row, ['device_type', 'device type']),
    firmware_version: getFleetField_(row, ['firmware_version', 'firmware version']),
    serial_no: getFleetField_(row, ['serial_no', 'serial no', 'serial number']),
    license_plate: getFleetField_(row, ['license_plate', 'license plate']),
    license_state: getFleetField_(row, ['license_state_province', 'license state province', 'license_state']),
    vin: getFleetField_(row, ['vin']),
    time_zone: getFleetField_(row, ['time_zone', 'time zone']),
    device_comment: getFleetField_(row, ['device_comment', 'device comment']),
    download_status: getFleetField_(row, ['download_status', 'download status']),
    last_trip: getFleetField_(row, ['last_trip', 'last trip']),
    last_communication_date: getFleetField_(row, ['last_communication_date', 'last communication date'])
  };
}

function mapFleetVehicle_(row) {
  const device = getFleetField_(row, ['device', 'unit_number', 'unit', 'vehicle', 'vehicle_id', 'truck_number']);
  const group = getFleetField_(row, ['device_group', 'device group', 'group', 'region']);
  const archived = getFleetField_(row, ['is_archived_historical', 'is archived historical', 'is_archived', 'archived']);
  const activity = getFleetField_(row, ['current_activity', 'current activity', 'status', 'vehicle_status']);
  return {
    vehicle_id: getFleetField_(row, ['vehicle_id', 'id']) || makeIdFromText_('vehicle', device),
    unit_number: device,
    device_group: group,
    region: fleetRegionFromGroup_(group),
    status: /true|yes|archived/i.test(String(archived || '')) ? 'Archived' : 'Active',
    service_status: activity || getFleetField_(row, ['service_status', 'service', 'maintenance_status']),
    registration_status: getFleetField_(row, ['registration_status', 'registration']) || 'Source only',
    vin: getFleetField_(row, ['vin']),
    plate: getFleetField_(row, ['license_plate', 'license plate', 'plate']),
    license_state: getFleetField_(row, ['license_state_province', 'license state province', 'license_state']),
    make: getFleetField_(row, ['make']),
    model: getFleetField_(row, ['model', 'device_type', 'device type']),
    year: getFleetField_(row, ['year']),
    assigned_driver: getFleetField_(row, ['current_driver', 'current driver', 'assigned_driver', 'driver']) || fleetDriverNameFromRow_(row),
    current_activity: activity,
    last_stop_address: getFleetField_(row, ['last_stop_address', 'last stop address']),
    current_odometer: getFleetField_(row, ['current_odometer', 'current odometer']),
    current_engine_hours: getFleetField_(row, ['current_engine_hours', 'current engine hours']),
    active_from: getFleetField_(row, ['active_from', 'active from']),
    active_to: getFleetField_(row, ['active_to', 'active to']),
    is_archived: archived,
    plan: getFleetField_(row, ['plan']),
    device_type: getFleetField_(row, ['device_type', 'device type']),
    firmware_version: getFleetField_(row, ['firmware_version', 'firmware version']),
    serial_no: getFleetField_(row, ['serial_no', 'serial no', 'serial number']),
    time_zone: getFleetField_(row, ['time_zone', 'time zone']),
    device_comment: getFleetField_(row, ['device_comment', 'device comment']),
    download_status: getFleetField_(row, ['download_status', 'download status']),
    last_trip: getFleetField_(row, ['last_trip', 'last trip']),
    last_communication_date: getFleetField_(row, ['last_communication_date', 'last communication date']),
    last_updated: getFleetField_(row, ['last_updated', 'updated_at', 'last_communication_date', 'last communication date']) || today_()
  };
}

function mapFleetDriver_(row) {
  const name = getFleetField_(row, ['driver_name', 'current_driver', 'current driver', 'driver', 'name']) || fleetDriverNameFromRow_(row);
  return {
    driver_id: getFleetField_(row, ['driver_id', 'id']) || makeIdFromText_('driver', name),
    driver_name: name,
    first_name: getFleetField_(row, ['first_name', 'first name']),
    last_name: getFleetField_(row, ['last_name', 'last name']),
    region: fleetRegionFromGroup_(getFleetField_(row, ['device_group', 'device group', 'region', 'market', 'location'])),
    status: getFleetField_(row, ['status', 'driver_status']) || 'Active',
    phone: getFleetField_(row, ['phone']),
    email: getFleetField_(row, ['email']),
    license_expiry: getFleetField_(row, ['license_expiry', 'license_expiration']),
    medical_card_expiry: getFleetField_(row, ['medical_card_expiry', 'medical_expiry']),
    insurance_expiry: getFleetField_(row, ['insurance_expiry']),
    assigned_vehicle: getFleetField_(row, ['assigned_vehicle', 'vehicle', 'unit_number', 'device']),
    current_activity: getFleetField_(row, ['current_activity', 'current activity']),
    work_time: getFleetField_(row, ['work_time', 'work time']),
    last_stop_address: getFleetField_(row, ['last_stop_address', 'last stop address']),
    next_action: getFleetField_(row, ['next_action', 'next action']) || 'Review protected workflow',
    last_updated: getFleetField_(row, ['last_updated', 'updated_at', 'last_communication_date', 'last communication date']) || today_()
  };
}

function getFleetField_(row, names) {
  if (!row) return '';
  const normalized = {};
  Object.keys(row).forEach(function(key) {
    normalized[normalizeHeader_(key)] = row[key];
  });
  for (let i = 0; i < names.length; i++) {
    const key = normalizeHeader_(names[i]);
    if (Object.prototype.hasOwnProperty.call(normalized, key) && normalized[key] !== '') return normalized[key];
  }
  return '';
}

function fleetDriverNameFromRow_(row) {
  const first = getFleetField_(row, ['first_name', 'first name']);
  const last = getFleetField_(row, ['last_name', 'last name']);
  return [first, last].filter(Boolean).join(' ').trim();
}

function fleetRegionFromGroup_(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  const upper = text.toUpperCase();
  const regions = ['PHX', 'STL', 'MIL', 'CLE', 'CHI', 'MIN', 'ABQ', 'PIT', 'IND'];
  for (let i = 0; i < regions.length; i++) if (upper.indexOf(regions[i]) > -1) return regions[i];
  if (/PHOENIX|ARIZONA|AZ/.test(upper)) return 'PHX';
  if (/ST.?s*LOUIS|MISSOURI|MO/.test(upper)) return 'STL';
  if (/MILWAUKEE|WISCONSIN|WI/.test(upper)) return 'MIL';
  if (/CLEVELAND|OHIO|OH/.test(upper)) return 'CLE';
  if (/CHICAGO|ILLINOIS|IL/.test(upper)) return 'CHI';
  if (/MINNEAPOLIS|MINNESOTA|MN/.test(upper)) return 'MIN';
  if (/ALBUQUERQUE|NEW MEXICO|NM/.test(upper)) return 'ABQ';
  if (/PITTSBURGH|PITTSBURG|PENNSYLVANIA|PA/.test(upper)) return 'PIT';
  if (/INDIANAPOLIS|INDIANA|IN/.test(upper)) return 'IND';
  return text;
}

function buildFleetMetrics_(vehicles, drivers, alerts, followUps) {
  const openWorkflow = (alerts || []).length + (followUps || []).length;
  const serviceDue = vehicles.filter(function(row) { return /due|overdue|service/i.test(String(row.service_status || '')) || isDateWithinDays_(row.next_service_date, 30); }).length;
  const driverDocs = drivers.filter(function(row) { return isDateWithinDays_(row.license_expiry, 30) || isDateWithinDays_(row.medical_card_expiry, 30) || isDateWithinDays_(row.insurance_expiry, 30); }).length;
  return [
    { metric_key: 'open_alerts', label: 'Open Alerts', value: openWorkflow, note: 'Alerts + follow-ups', tone: 'blue', sort_order: 1 },
    { metric_key: 'vehicles', label: 'Vehicles', value: vehicles.length, note: 'Current records', tone: 'blue', sort_order: 2 },
    { metric_key: 'drivers', label: 'Drivers', value: drivers.length, note: 'Current records', tone: 'blue', sort_order: 3 },
    { metric_key: 'service_due', label: 'Service Due', value: serviceDue, note: 'Next 30 days', tone: 'amber', sort_order: 4 },
    { metric_key: 'driver_docs', label: 'Driver Docs', value: driverDocs, note: 'Expiring soon', tone: 'red', sort_order: 5 }
  ];
}

function getFleetSpreadsheetId_() {
  const spreadsheetId = SPREADSHEETS.fleet;
  if (!spreadsheetId) throw new Error('Fleet spreadsheet ID is not configured yet.');
  return spreadsheetId;
}

function makeIdFromText_(prefix, value) {
  const clean = String(value || prefix).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
  return prefix + '-' + (clean || Utilities.getUuid().slice(0, 8));
}

function ensureSheetWithHeaders_(spreadsheetId, sheetName, headers) {
  const ss = SpreadsheetApp.openById(spreadsheetId);
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) sheet = ss.insertSheet(sheetName);
  if (sheet.getLastRow() === 0 || sheet.getLastColumn() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    return;
  }
  const existing = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0].map(String);
  const missing = headers.filter(function(header) { return existing.indexOf(header) === -1; });
  if (missing.length) sheet.getRange(1, existing.length + 1, 1, missing.length).setValues([missing]);
}

function isActiveRow_(row) {
  return row.active === '' || row.active === true || String(row.active).toUpperCase() === 'TRUE';
}

function isDateWithinDays_(value, days) {
  if (!value) return false;
  const date = new Date(value);
  if (isNaN(date.getTime())) return false;
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.floor((end.getTime() - start.getTime()) / 86400000);
  return diff >= 0 && diff <= days;
}

function isDatePast_(value) {
  if (!value) return false;
  const date = new Date(value);
  if (isNaN(date.getTime())) return false;
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return end.getTime() < start.getTime();
}

function getContractorDocumentStatus_(glExpiry, wcExpiry) {
  if (isDatePast_(glExpiry) || isDatePast_(wcExpiry)) return 'Expired';
  if (isDateWithinDays_(glExpiry, 30) || isDateWithinDays_(wcExpiry, 30)) return 'Expiring Soon';
  return 'Current';
}

function getContractorRisk_(documents, glExpiry, wcExpiry) {
  if (/expired/i.test(String(documents || ''))) return '70 High';
  if (isDateWithinDays_(glExpiry, 30) || isDateWithinDays_(wcExpiry, 30)) return '50 Review';
  return '20 Monitor';
}

function getContractorNextAction_(documents, glExpiry, wcExpiry) {
  if (/expired/i.test(String(documents || ''))) return 'Immediate compliance review';
  if (isDateWithinDays_(glExpiry, 30) || isDateWithinDays_(wcExpiry, 30)) return 'Request updated certificate';
  return 'No immediate action';
}

function makeContractorId_(name) {
  const raw = String(name || 'contractor').trim().toLowerCase();
  return 'CTR-' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw)).slice(0, 12);
}

function clearLegacyCommandCenterRows() {
  return [
    clearSheetRows_(SPREADSHEETS.commandCenter, SHEETS.commandMetrics),
    clearSheetRows_(SPREADSHEETS.commandCenter, SHEETS.commandFocus)
  ];
}

function getLiens() {
  const records = readSheetObjects_(SPREADSHEETS.liens, SHEETS.lienRecords)
    .filter(function(row) { return row.active === '' || row.active === true || String(row.active).toUpperCase() === 'TRUE'; });
  const notes = sheetExists_(SPREADSHEETS.liens, SHEETS.lienNotes) ? readSheetObjects_(SPREADSHEETS.liens, SHEETS.lienNotes) : [];
  const alerts = sheetExists_(SPREADSHEETS.liens, SHEETS.lienAlerts) ? readSheetObjects_(SPREADSHEETS.liens, SHEETS.lienAlerts) : [];
  const followUps = sheetExists_(SPREADSHEETS.liens, SHEETS.lienFollowUps) ? readSheetObjects_(SPREADSHEETS.liens, SHEETS.lienFollowUps) : [];
  const metrics = sheetExists_(SPREADSHEETS.liens, SHEETS.lienMetrics) ? readSheetObjects_(SPREADSHEETS.liens, SHEETS.lienMetrics).sort(sortByOrder_) : buildLienMetrics_(records);

  const latestNoteByLien = latestById_(notes, 'lien_id', 'note_date');
  const activeAlertByLien = latestById_(alerts.filter(function(alert) {
    return alert.active === '' || alert.active === true || String(alert.active).toUpperCase() === 'TRUE';
  }), 'lien_id', 'created_date');
  const activeFollowUps = followUps.filter(function(item) {
    return item.active === '' || item.active === true || String(item.active).toUpperCase() === 'TRUE';
  });

  return {
    metrics: metrics,
    notes: notes,
    alerts: alerts,
    followUps: activeFollowUps,
    records: records.map(function(record) {
      const note = latestNoteByLien[String(record.lien_id)] || {};
      const alert = activeAlertByLien[String(record.lien_id)] || {};
      record.workflow_note = note.note_text || record.workflow_note || '';
      record.alert_text = alert.alert_text || record.alert_text || '';
      record.notes_count = notes.filter(function(item) { return String(item.lien_id) === String(record.lien_id); }).length;
      record.alerts_count = alerts.filter(function(item) { return String(item.lien_id) === String(record.lien_id) && (item.active === '' || item.active === true || String(item.active).toUpperCase() === 'TRUE'); }).length;
      record.followups_count = activeFollowUps.filter(function(item) { return String(item.lien_id) === String(record.lien_id); }).length;
      return record;
    })
  };
}



function importLienStatusReports() {
  const folder = DriveApp.getFolderById(LIEN_STATUS_REPORTS_FOLDER_ID);
  const files = folder.getFilesByType(MimeType.GOOGLE_SHEETS);
  let masterRows = [];
  let statusRows = [];
  const seenStatuses = {};
  const scanned = [];

  while (files.hasNext()) {
    const file = files.next();
    const ss = SpreadsheetApp.openById(file.getId());
    scanned.push(file.getName());
    ss.getSheets().forEach(function(sheet) {
      const sheetName = sheet.getName();
      const rows = readSheetObjectsFromSheet_(sheet);
      if (!rows.length) return;
      if (sameName_(file.getName(), LIEN_MASTER_REPORT_NAME) || sameName_(sheetName, LIEN_MASTER_REPORT_NAME)) {
        masterRows = masterRows.concat(rows);
        return;
      }
      const status = file.getName();
      seenStatuses[status] = true;
      rows.forEach(function(row) {
        row.__status = status;
        row.__source_sheet = sheetName;
        row.__source_file = file.getName();
        statusRows.push(row);
      });
    });
  }

  if (!masterRows.length) {
    throw new Error('No master rows found. Need a Google Sheet or tab named Receivables Aging in the lien status reports folder.');
  }

  const statusByKey = {};
  statusRows.forEach(function(row) {
    statusByKey[makeReceivableKey_(row)] = row.__status;
  });

  const normalized = masterRows.map(function(row) {
    const key = makeReceivableKey_(row);
    const status = statusByKey[key] || 'Receivable';
    seenStatuses[status] = true;
    return mapReceivableToLienRecord_(row, status, key);
  });

  replaceSourceRecords_(normalized);
  return {
    imported: normalized.length,
    statuses: Object.keys(seenStatuses).sort(),
    scanned_files: scanned
  };
}

function readSheetObjectsFromSheet_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(normalizeHeader_);
  return values.slice(1)
    .filter(function(row) { return row.some(function(cell) { return cell !== '' && cell !== null; }); })
    .map(function(row) {
      return headers.reduce(function(record, header, index) {
        if (!header) return record;
        record[header] = normalizeValue_(row[index]);
        return record;
      }, {});
    });
}

function ensureLienRecordColumns_(sheet) {
  const existing = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0].map(normalizeHeader_);
  const missing = REQUIRED_LIEN_RECORD_COLUMNS.filter(function(header) { return existing.indexOf(header) === -1; });
  if (!missing.length) return;
  sheet.getRange(1, existing.length + 1, 1, missing.length).setValues([missing]);
}

function replaceSourceRecords_(records) {
  const sheet = getRequiredSheet_(SPREADSHEETS.liens, SHEETS.lienRecords);
  ensureLienRecordColumns_(sheet);
  const values = sheet.getDataRange().getValues();
  if (!values.length) throw new Error('LienRecords is missing headers.');
  const headers = values[0].map(normalizeHeader_);
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
  }
  if (!records.length) return;
  sheet.getRange(2, 1, records.length, headers.length).setValues(records.map(function(record) {
    return headers.map(function(header) {
      return Object.prototype.hasOwnProperty.call(record, header) ? record[header] : '';
    });
  }));
}

function mapReceivableToLienRecord_(row, status, key) {
  const customer = getField_(row, ['customer', 'customer_name', 'name', 'account', 'account_name']);
  const account = getField_(row, ['job_number', 'job', 'job_number_', 'job #', 'account_name', 'account', 'account_number']);
  const blazeUrl = getField_(row, ['job_link', 'job link', 'Job Link', 'blaze_url', 'blaze link', 'blaze_link', 'url', 'job_url', 'record_url']);
  const balance = getField_(row, ['balance', 'total_balance', 'total revenue', 'amount', 'invoice_balance', 'ar_balance']);
  const invoiceDates = getInvoiceSentDates_(row);
  const firstInvoiceDate = invoiceDates.length ? invoiceDates[0] : getField_(row, ['first_invoice_date', 'first invoice date', 'first invoice', 'invoice 1 sent date', 'invoice_1_sent_date', 'oldest_invoice_date', 'oldest invoice date', 'oldest invoice', 'first_invoice_dt']);
  const latestInvoiceDate = invoiceDates.length ? invoiceDates[invoiceDates.length - 1] : getField_(row, ['latest_invoice_date', 'latest invoice date', 'latest invoice', 'last_invoice_date', 'last invoice date', 'last invoice', 'newest invoice date']);
  const invoiceCount = invoiceDates.length || getField_(row, ['invoice_count', 'invoice count', 'invoice count ', 'invoices', '# invoices', 'number of invoices']);
  const days = getField_(row, ['days_past_due', 'days past due', 'days past due date', 'days past due balance', 'past due days', 'dpd', '60+ days', '60_days', 'aging_days', 'days', 'age']) || daysSince_(firstInvoiceDate);
  const noPaymentReceived = getNoPaymentReceived_(row);
  const paymentReceived = getField_(row, ['payments', 'payment_received', 'payment received', 'payments_received', 'payments received', 'amount_paid', 'amount paid', 'paid_amount', 'paid amount', 'total_paid', 'total paid', 'payment amount']);
  return {
    lien_id: 'REC-' + key,
    customer: customer,
    account_name: account || customer,
    blaze_url: blazeUrl,
    region: getField_(row, ['region', 'market', 'branch', 'office']),
    owner: getField_(row, ['owner', 'sales_rep', 'sales rep', 'rep', 'assigned_to']) || 'Carlynn',
    status: status,
    stage: getStageFromReceivable_(row, status, days),
    balance: balance,
    days_past_due: days,
    first_invoice_date: firstInvoiceDate,
    latest_invoice_date: latestInvoiceDate,
    invoice_count: invoiceCount,
    no_payment_received: noPaymentReceived,
    payment_received: paymentReceived,
    last_payment_date: getField_(row, ['last_payment_date', 'last payment date', 'last payment', 'latest payment date']),
    payment_status: getField_(row, ['payment_status', 'payment status', 'payment filter', 'payment']),
    filing_date: getField_(row, ['filing_date', 'filed_date', 'lien_filed']),
    release_due_date: getField_(row, ['release_due_date', 'due_date', 'deadline']),
    release_status: status,
    legal_hold: /attorney|legal|hold/i.test(String(status || '')),
    source_system: 'Blaze / Receivables Aging',
    source_record_id: account || key,
    last_updated: today_(),
    active: true
  };
}

function getInvoiceSentDates_(row) {
  const dates = [];
  for (let i = 1; i <= 20; i++) {
    const value = getField_(row, ['invoice_' + i + '_sent_date', 'invoice ' + i + ' sent date', 'invoice ' + i, 'invoice_' + i]);
    if (value) dates.push(value);
  }
  return dates;
}

function daysSince_(dateValue) {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return '';
  const today = new Date();
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / 86400000));
}

function getNoPaymentReceived_(row) {
  const direct = getField_(row, ['no_payment_received', 'no payment received', 'no payments received', 'no payment', 'no payments', 'no deposit', 'missing deposit']);
  if (direct !== '' && direct !== null && direct !== undefined) {
    return /^(true|yes|y|1|x|no payment|no payments|none)$/i.test(String(direct).trim());
  }
  const payment = getField_(row, ['payments', 'payment_received', 'payment received', 'payments_received', 'payments received', 'amount_paid', 'amount paid', 'paid_amount', 'paid amount', 'total_paid', 'total paid', 'payment amount']);
  if (payment !== '' && payment !== null && payment !== undefined) return parseMoney_(payment) <= 0;
  const lastPayment = getField_(row, ['last_payment_date', 'last payment date', 'last payment', 'latest payment date']);
  if (lastPayment) return false;
  const status = getField_(row, ['payment_status', 'payment status', 'payment filter', 'payment']);
  if (status) return /no payment|no payments|none|unpaid/i.test(String(status));
  return false;
}

function getStageFromReceivable_(row, status, days) {
  const age = Number(days || getField_(row, ['days_past_due', 'days past due', 'aging_days', 'age', 'days']) || 0);
  if (age >= 120) return 'Critical';
  if (age >= 90) return 'High';
  if (age >= 60) return 'Review';
  if (age >= 30) return 'Monitor';
  if (/attorney|legal/i.test(String(status || ''))) return 'Review';
  return 'Monitor';
}

function makeReceivableKey_(row) {
  const parts = [
    getField_(row, ['job_number', 'job', 'job #', 'account', 'account_name', 'account number']),
    getField_(row, ['customer', 'customer_name', 'name']),
    getField_(row, ['first_invoice_date', 'first invoice', 'oldest_invoice_date', 'invoice_number', 'invoice #'])
  ].map(function(value) { return String(value || '').trim().toLowerCase(); }).filter(Boolean);
  const raw = parts.length ? parts.join('|') : JSON.stringify(row);
  return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw)).slice(0, 16);
}

function getField_(row, names) {
  const normalized = {};
  Object.keys(row || {}).forEach(function(key) {
    normalized[String(key).trim().toLowerCase().replace(/[^a-z0-9]+/g, '_')] = row[key];
  });
  for (let i = 0; i < names.length; i++) {
    const key = String(names[i]).trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
    if (Object.prototype.hasOwnProperty.call(normalized, key) && normalized[key] !== '') return normalized[key];
  }
  return '';
}

function sameName_(left, right) {
  return String(left || '').trim().toLowerCase() === String(right || '').trim().toLowerCase();
}


function inspectLienStatusReports() {
  const folder = DriveApp.getFolderById(LIEN_STATUS_REPORTS_FOLDER_ID);
  const files = folder.getFilesByType(MimeType.GOOGLE_SHEETS);
  const output = [];
  while (files.hasNext()) {
    const file = files.next();
    const ss = SpreadsheetApp.openById(file.getId());
    const book = { file: file.getName(), id: file.getId(), sheets: [] };
    ss.getSheets().forEach(function(sheet) {
      const values = sheet.getDataRange().getValues();
      const headers = values.length ? values[0].map(normalizeHeader_) : [];
      const dataRows = values.slice(1).filter(function(row) {
        return row.some(function(cell) { return cell !== '' && cell !== null; });
      }).length;
      book.sheets.push({
        sheet: sheet.getName(),
        last_row: sheet.getLastRow(),
        last_column: sheet.getLastColumn(),
        readable_data_rows: dataRows,
        headers: headers.slice(0, 25)
      });
    });
    output.push(book);
  }
  Logger.log(JSON.stringify(output, null, 2));
  return output;
}

function testInspectLienStatusReports() {
  inspectLienStatusReports();
}

function testImportLienStatusReports() {
  Logger.log(JSON.stringify(importLienStatusReports(), null, 2));
}

function saveLienNote(payload) {
  if (!payload || !payload.lien_id) throw new Error('lien_id is required.');
  const record = {
    note_id: payload.note_id || makeId_('note'),
    lien_id: payload.lien_id,
    note_date: payload.note_date || today_(),
    note_by: payload.note_by || 'Amanda',
    note_type: payload.note_type || 'General',
    note_text: payload.note_text || '',
    follow_up_date: payload.follow_up_date || '',
    active: true
  };
  appendObject_(SPREADSHEETS.liens, SHEETS.lienNotes, record);
  return record;
}

function saveLienAlert(payload) {
  if (!payload || !payload.lien_id) throw new Error('lien_id is required.');
  const record = {
    alert_id: payload.alert_id || makeId_('alert'),
    lien_id: payload.lien_id,
    alert_type: payload.alert_type || 'Follow-up',
    alert_text: payload.alert_text || '',
    priority: payload.priority || 'High',
    owner: payload.owner || 'Carlynn',
    due_date: payload.due_date || today_(),
    status: payload.status || 'Open',
    created_date: payload.created_date || today_(),
    resolved_date: payload.resolved_date || '',
    active: true
  };
  appendObject_(SPREADSHEETS.liens, SHEETS.lienAlerts, record);
  return record;
}

function saveLienFollowUp(payload) {
  if (!payload || !payload.lien_id) throw new Error('lien_id is required.');
  const record = {
    followup_id: payload.followup_id || makeId_('followup'),
    lien_id: payload.lien_id,
    assigned_to: payload.assigned_to || 'Carlynn',
    due_date: payload.due_date || today_(),
    followup_type: payload.followup_type || 'Call/Email',
    followup_text: payload.followup_text || '',
    status: payload.status || 'Open',
    created_by: payload.created_by || 'Amanda',
    created_date: payload.created_date || today_(),
    completed_date: payload.completed_date || '',
    active: true
  };
  appendObject_(SPREADSHEETS.liens, SHEETS.lienFollowUps, record);
  return record;
}

function appendObject_(spreadsheetId, sheetName, record) {
  const sheet = getRequiredSheet_(spreadsheetId, sheetName);
  const values = sheet.getDataRange().getValues();
  if (!values.length) throw new Error(sheetName + ' is missing headers.');
  const headers = values[0].map(normalizeHeader_);
  sheet.appendRow(headers.map(function(header) {
    return Object.prototype.hasOwnProperty.call(record, header) ? record[header] : '';
  }));
}

function makeId_(prefix) {
  return prefix + '-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 1296).toString(36).padStart(2, '0');
}

function today_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function buildLienMetrics_(records) {
  const open = records.length;
  const pendingRelease = records.filter(function(row) { return /release/i.test(String(row.release_status || row.status || '')); }).length;
  const pastDue = records.filter(function(row) { return Number(row.days_past_due || 0) > 0; }).length;
  const legalHolds = records.filter(function(row) { return row.legal_hold === true || String(row.legal_hold).toUpperCase() === 'TRUE' || /legal/i.test(String(row.stage || '')); }).length;
  const totalBalance = records.reduce(function(sum, row) { return sum + parseMoney_(row.balance); }, 0);
  return [
    { metric_key: 'open_liens', label: 'Open Liens', value: open, note: 'Active records', tone: 'blue', sort_order: 1 },
    { metric_key: 'pending_releases', label: 'Pending Releases', value: pendingRelease, note: 'Need filing status', tone: 'amber', sort_order: 2 },
    { metric_key: 'past_due', label: 'Past Due', value: pastDue, note: 'Escalate today', tone: 'red', sort_order: 3 },
    { metric_key: 'legal_holds', label: 'Legal Holds', value: legalHolds, note: 'Protected records', tone: 'silver', sort_order: 4 },
    { metric_key: 'balance_at_risk', label: 'Balance at Risk', value: formatMoney_(totalBalance), note: 'Linked exposure', tone: 'blue', sort_order: 5 }
  ];
}

function getPricing(e) {
  const spreadsheetId = getPricingSpreadsheetId_();
  const sheetName = getParam_(e, 'sheet') || 'Pricing';
  const limit = Math.min(Math.max(Number(getParam_(e, 'limit') || 75), 1), 2000);
  const offset = Math.max(Number(getParam_(e, 'offset') || 0), 0);
  const search = String(getParam_(e, 'search') || '').trim().toLowerCase();
  const state = String(getParam_(e, 'state') || 'All states');
  const trade = String(getParam_(e, 'trade') || 'All trades');
  const type = String(getParam_(e, 'type') || 'All types');
  const supplier = String(getParam_(e, 'supplier') || 'All suppliers');
  const sort = String(getParam_(e, 'sort') || 'Default');
  const ss = SpreadsheetApp.openById(spreadsheetId);
  const sheet = ss.getSheetByName(sheetName) || ss.getSheets()[0];
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 2 || lastCol < 1) return emptyPricingPayload_(sheet.getName(), offset, limit);

  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(normalizeHeader_);
  const keys = headers.map(normalizePricingKey_);
  const indexes = getPricingIndexes_(keys);
  const meta = getPricingMeta_(sheet, keys, indexes);
  const hasFilter = !!search || state !== 'All states' || trade !== 'All trades' || type !== 'All types' || supplier !== 'All suppliers' || sort !== 'Default';
  let total = Math.max(lastRow - 1, 0);
  let rows = [];

  if (!hasFilter) {
    const startRow = Math.min(offset + 2, lastRow + 1);
    const readCount = Math.max(Math.min(limit, lastRow - startRow + 1), 0);
    rows = readCount ? sheet.getRange(startRow, 1, readCount, lastCol).getValues().map(function(row, index) {
      return pricingRecordFromRow_(row, keys, startRow + index);
    }) : [];
  } else if (search) {
    const result = findPricingRowsByText_(sheet, keys, indexes, { search: search, state: state, trade: trade, type: type, supplier: supplier, offset: offset, limit: limit });
    total = result.total;
    rows = result.rows;
    if (sort !== 'Default') rows = sortPricingRecords_(rows, sort);
  } else {
    const result = scanPricingRowsFast_(sheet, keys, indexes, { state: state, trade: trade, type: type, supplier: supplier, offset: offset, limit: limit });
    total = result.total;
    rows = result.rows;
    if (sort !== 'Default') rows = sortPricingRecords_(rows, sort);
  }

  return {
    headers: headers,
    keys: keys,
    rows: rows,
    total: total,
    offset: offset,
    limit: limit,
    sheet: sheet.getName(),
    states: meta.states,
    trades: meta.trades,
    types: meta.types,
    suppliers: meta.suppliers
  };
}

function findPricingRowsByText_(sheet, keys, indexes, options) {
  const lastCol = sheet.getLastColumn();
  const offset = Math.max(Number(options.offset || 0), 0);
  const limit = Math.min(Math.max(Number(options.limit || 75), 1), 2000);
  const needed = offset + limit + 1;
  const rowNumbers = [];
  const seen = {};
  const finder = sheet.createTextFinder(options.search).matchCase(false).matchEntireCell(false);
  const matches = finder.findAll();
  for (let i = 0; i < matches.length && rowNumbers.length < needed; i++) {
    const rowNumber = matches[i].getRow();
    if (rowNumber < 2 || seen[rowNumber]) continue;
    seen[rowNumber] = true;
    rowNumbers.push(rowNumber);
  }
  rowNumbers.sort(function(a, b) { return a - b; });

  const pageRows = [];
  for (let i = offset; i < rowNumbers.length && pageRows.length < limit; i++) {
    const rowNumber = rowNumbers[i];
    const row = sheet.getRange(rowNumber, 1, 1, lastCol).getValues()[0];
    if (!pricingRowMatches_(row, indexes, options)) continue;
    pageRows.push(pricingRecordFromRow_(row, keys, rowNumber));
  }

  return {
    rows: pageRows,
    total: rowNumbers.length > offset + pageRows.length ? offset + pageRows.length + 1 : offset + pageRows.length
  };
}

function scanPricingRowsFast_(sheet, keys, indexes, options) {
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  const offset = Math.max(Number(options.offset || 0), 0);
  const limit = Math.min(Math.max(Number(options.limit || 75), 1), 2000);
  const matched = [];
  let total = 0;
  const chunkSize = 1200;

  for (let rowStart = 2; rowStart <= lastRow; rowStart += chunkSize) {
    const rowCount = Math.min(chunkSize, lastRow - rowStart + 1);
    const values = sheet.getRange(rowStart, 1, rowCount, lastCol).getValues();
    for (let i = 0; i < values.length; i++) {
      const row = values[i];
      if (!pricingRowMatches_(row, indexes, options)) continue;
      if (total >= offset && matched.length < limit) matched.push(pricingRecordFromRow_(row, keys, rowStart + i));
      total++;
      if (matched.length >= limit) return { rows: matched, total: total + 1 };
    }
  }

  return { rows: matched, total: total };
}

function emptyPricingPayload_(sheetName, offset, limit) {
  return { headers: [], keys: [], rows: [], total: 0, offset: offset, limit: limit, sheet: sheetName, states: [], trades: [], types: [], suppliers: [] };
}

function getPricingIndexes_(keys) {
  return {
    state: findPricingColumn_(keys, ['state', 'region', 'market', 'location', 'territory']),
    trade: findPricingColumn_(keys, ['trade', 'category', 'service']),
    type: findPricingColumn_(keys, ['type', 'item_type', 'type_code']),
    supplier: findPricingColumn_(keys, ['supplier', 'vendor', 'brand_name']),
    price: findPricingColumn_(keys, ['price', 'rate', 'amount', 'cost', 'total', 'labor_price', 'unit_price']),
    name: findPricingColumn_(keys, ['elite_product_name', 'product', 'item_final', 'item', 'name', 'description', 'service_name', 'scope']),
    brand: findPricingColumn_(keys, ['brand', 'brand_name', 'brandline']),
    color: findPricingColumn_(keys, ['color', 'color2', 'color_code']),
    itemFinal: findPricingColumn_(keys, ['item_final']),
    uom: findPricingColumn_(keys, ['uom', 'unit'])
  };
}

function getPricingMeta_(sheet, keys, indexes) {
  const cache = CacheService.getScriptCache();
  const cacheKey = 'pricing_meta_fast_v2_' + sheet.getSheetId() + '_' + sheet.getLastRow() + '_' + sheet.getLastColumn();
  const cached = cache.get(cacheKey);
  if (cached) return JSON.parse(cached);
  const meta = { states: [], trades: [], types: [], suppliers: [] };
  const fields = [
    { key: 'states', index: indexes.state },
    { key: 'trades', index: indexes.trade },
    { key: 'types', index: indexes.type },
    { key: 'suppliers', index: indexes.supplier }
  ];
  fields.forEach(function(field) {
    if (field.index < 0) return;
    const scanRows = Math.min(Math.max(sheet.getLastRow() - 1, 0), 5000);
    const values = scanRows ? sheet.getRange(2, field.index + 1, scanRows, 1).getValues() : [];
    const seen = {};
    values.forEach(function(row) {
      const value = String(row[0] || '').trim();
      if (value) seen[value] = true;
    });
    meta[field.key] = Object.keys(seen).sort();
  });
  cache.put(cacheKey, JSON.stringify(meta), 21600);
  return meta;
}

function pricingRowMatches_(row, indexes, filters) {
  if (filters.state !== 'All states' && indexes.state > -1 && String(row[indexes.state] || '').trim() !== filters.state) return false;
  if (filters.trade !== 'All trades' && indexes.trade > -1 && String(row[indexes.trade] || '').trim() !== filters.trade) return false;
  if (filters.type !== 'All types' && indexes.type > -1 && String(row[indexes.type] || '').trim() !== filters.type) return false;
  if (filters.supplier !== 'All suppliers' && indexes.supplier > -1 && String(row[indexes.supplier] || '').trim() !== filters.supplier) return false;
  if (filters.search) {
    const searchIndexes = [indexes.supplier, indexes.state, indexes.brand, indexes.name, indexes.color, indexes.itemFinal, indexes.type, indexes.uom, indexes.price].filter(function(index) { return index > -1; });
    const haystack = searchIndexes.map(function(index) { return row[index]; }).join(' ').toLowerCase();
    if (haystack.indexOf(filters.search) < 0) return false;
  }
  return true;
}

function pricingRecordFromRow_(row, keys, rowNumber) {
  const record = { _row: rowNumber };
  keys.forEach(function(key, colIndex) {
    if (!key) return;
    record[key] = normalizeValue_(row[colIndex]);
  });
  return record;
}

function sortPricingRecords_(rows, sort) {
  if (sort === 'Lowest price') rows.sort(function(a, b) { return parseMoney_(a.price) - parseMoney_(b.price); });
  if (sort === 'Highest price') rows.sort(function(a, b) { return parseMoney_(b.price) - parseMoney_(a.price); });
  if (sort === 'Name A-Z') rows.sort(function(a, b) { return String(a.elite_product_name || a.product || a.item || '').localeCompare(String(b.elite_product_name || b.product || b.item || '')); });
  return rows;
}

function getReviewsSpreadsheetId_() {
  const spreadsheetId = SPREADSHEETS.reviews;
  if (!spreadsheetId) throw new Error('Reviews sheet is not connected yet.');
  return spreadsheetId;
}

function getPricingSpreadsheetId_() {
  const spreadsheetId = SPREADSHEETS.pricing;
  if (!spreadsheetId || spreadsheetId === 'PASTE_PRICING_SHEET_ID_HERE') {
    throw new Error('Pricing sheet is not connected yet. Paste the pricing Google Sheet ID into SPREADSHEETS.pricing.');
  }
  return spreadsheetId;
}

function normalizePricingKey_(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function findPricingColumn_(keys, candidates) {
  for (let i = 0; i < candidates.length; i++) {
    const exact = keys.indexOf(candidates[i]);
    if (exact > -1) return exact;
  }
  for (let i = 0; i < keys.length; i++) {
    for (let j = 0; j < candidates.length; j++) {
      if (keys[i].indexOf(candidates[j]) > -1) return i;
    }
  }
  return -1;
}

function readSheetObjects_(spreadsheetId, sheetName) {
  const sheet = getRequiredSheet_(spreadsheetId, sheetName);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0].map(normalizeHeader_);
  return values.slice(1)
    .filter(function(row) { return row.some(function(cell) { return cell !== '' && cell !== null; }); })
    .map(function(row) {
      return headers.reduce(function(record, header, index) {
        if (!header) return record;
        record[header] = normalizeValue_(row[index]);
        return record;
      }, {});
    });
}

function getRequiredSheet_(spreadsheetId, sheetName) {
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  if (!sheet) throw new Error('Missing required sheet tab: ' + sheetName);
  return sheet;
}

function clearSheetRows_(spreadsheetId, sheetName) {
  if (!sheetExists_(spreadsheetId, sheetName)) return { sheet: sheetName, cleared: 0, skipped: true };
  const sheet = getRequiredSheet_(spreadsheetId, sheetName);
  const rows = Math.max(sheet.getLastRow() - 1, 0);
  if (rows > 0) sheet.getRange(2, 1, rows, sheet.getLastColumn()).clearContent();
  return { sheet: sheetName, cleared: rows, skipped: false };
}

function sheetExists_(spreadsheetId, sheetName) {
  return !!SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
}

function latestById_(rows, idField, dateField) {
  return rows.reduce(function(map, row) {
    const id = String(row[idField] || '');
    if (!id) return map;
    if (!map[id] || String(row[dateField] || '') >= String(map[id][dateField] || '')) map[id] = row;
    return map;
  }, {});
}

function parseMoney_(value) {
  const number = Number(String(value || '').replace(/[^0-9.-]/g, ''));
  return isNaN(number) ? 0 : number;
}

function formatMoney_(value) {
  return '$' + Math.round(value).toLocaleString('en-US');
}

function normalizeHeader_(value) {
  return String(value || '').trim();
}

function normalizeValue_(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  if (typeof value === 'boolean') return value;
  return value === null || value === undefined ? '' : value;
}

function sortByOrder_(a, b) {
  const left = Number(a.sort_order || 0);
  const right = Number(b.sort_order || 0);
  return left - right;
}

function paramsToPayload_(e) {
  const payload = {};
  const params = e && e.parameter ? e.parameter : {};
  ['lien_id', 'contractor_id', 'note_id', 'note_date', 'note_by', 'note_type', 'note_text', 'follow_up_date', 'alert_id', 'alert_type', 'alert_text', 'priority', 'owner', 'due_date', 'status', 'created_date', 'resolved_date', 'followup_id', 'assigned_to', 'followup_type', 'followup_text', 'created_by', 'completed_date', 'active', 'request_id', 'requestor_name', 'brand', 'date_submitted', 'region', 'pure', 'jurisdiction', 'requirements', 'website', 'phone', 'email', 'notes', 'stage'].forEach(function(key) {
    if (Object.prototype.hasOwnProperty.call(params, key)) payload[key] = params[key];
  });
  return payload;
}

function getParam_(e, key) {
  return e && e.parameter ? e.parameter[key] : '';
}

function output_(e, payload) {
  const callback = getParam_(e, 'callback');
  const body = JSON.stringify(payload);

  if (callback && /^[A-Za-z_$][0-9A-Za-z_$]*$/.test(callback)) {
    return ContentService
      .createTextOutput(callback + '(' + body + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(body)
    .setMimeType(ContentService.MimeType.JSON);
}

function testClearLegacyCommandCenterRows() {
  Logger.log(JSON.stringify(clearLegacyCommandCenterRows(), null, 2));
}

function testGetLiens() {
  Logger.log(JSON.stringify(getLiens(), null, 2));
}

function testSetupContractorsSheet() {
  Logger.log(JSON.stringify(setupContractorsSheet(), null, 2));
}

function testGetContractors() {
  Logger.log(JSON.stringify(getContractors(), null, 2));
}

function testGetPricing() {
  Logger.log(JSON.stringify(getPricing({ parameter: { limit: '10' } }), null, 2));
}

function testSetupFleetSheet() {
  Logger.log(JSON.stringify(setupFleetSheet(), null, 2));
}

function testGetFleet() {
  Logger.log(JSON.stringify(getFleet(), null, 2));
}
