const RECORD_TAB = 'ContractorRecords';
const CREW_TAB = 'ContractorCrews';
const IMPORT_LOG_TAB = 'ContractorImportLog';
const AUTOMATION_LOG_TAB = 'ContractorAutomationLog';
const IMPORT_LOG_HEADERS = ['import_id', 'imported_at', 'source', 'contractor_count', 'crew_count', 'duplicate_contractors', 'unparsed_crews', 'status', 'message'];
const AUTOMATION_LOG_HEADERS = ['run_id', 'started_at', 'completed_at', 'status', 'contractor_count', 'crew_count', 'source', 'message'];

function quote(title) {
  return `'${String(title).replace(/'/g, "''")}'`;
}

async function metadata(sheets, spreadsheetId) {
  const response = await sheets.spreadsheets.get({ spreadsheetId, fields: 'sheets.properties(sheetId,title,gridProperties)' });
  return response.data.sheets || [];
}

async function ensureTab(sheets, spreadsheetId, title, headers) {
  let tab = (await metadata(sheets, spreadsheetId)).find((candidate) => candidate.properties.title === title);
  if (!tab) {
    const added = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests: [{ addSheet: { properties: { title } } }] }
    });
    tab = { properties: added.data.replies[0].addSheet.properties };
  }
  const firstRow = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${quote(title)}!1:1` });
  if (!(firstRow.data.values || []).length) {
    await sheets.spreadsheets.values.update({ spreadsheetId, range: `${quote(title)}!A1`, valueInputOption: 'RAW', requestBody: { values: [headers] } });
  }
  return tab;
}

async function replaceValues(sheets, spreadsheetId, title, values) {
  const range = quote(title);
  const previous = await sheets.spreadsheets.values.get({ spreadsheetId, range }).then((response) => response.data.values || []);
  try {
    await sheets.spreadsheets.values.clear({ spreadsheetId, range, requestBody: {} });
    await sheets.spreadsheets.values.update({ spreadsheetId, range: `${range}!A1`, valueInputOption: 'RAW', requestBody: { values } });
    const verification = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${range}!A1:A${values.length}` });
    if ((verification.data.values || []).length !== values.length) throw new Error(`Google Sheets verified ${(verification.data.values || []).length} of ${values.length} ${title} rows.`);
  } catch (error) {
    await sheets.spreadsheets.values.clear({ spreadsheetId, range, requestBody: {} }).catch(() => {});
    if (previous.length) await sheets.spreadsheets.values.update({ spreadsheetId, range: `${range}!A1`, valueInputOption: 'RAW', requestBody: { values: previous } }).catch(() => {});
    throw error;
  }
}

async function append(sheets, spreadsheetId, title, row) {
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${quote(title)}!A:A`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [row] }
  });
}

export async function publishContractors(sheets, spreadsheetId, validation, runId, startedAt) {
  await ensureTab(sheets, spreadsheetId, RECORD_TAB, validation.contractorValues[0]);
  await ensureTab(sheets, spreadsheetId, CREW_TAB, validation.crewValues[0]);
  await ensureTab(sheets, spreadsheetId, IMPORT_LOG_TAB, IMPORT_LOG_HEADERS);
  await ensureTab(sheets, spreadsheetId, AUTOMATION_LOG_TAB, AUTOMATION_LOG_HEADERS);

  const existing = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${quote(RECORD_TAB)}!A:A` });
  const existingCount = Math.max((existing.data.values || []).length - 1, 0);
  const minimumExpected = existingCount >= 100 ? Math.floor(existingCount * 0.6) : 100;
  if (validation.contractorCount < minimumExpected && process.env.FORCE_CONTRACTORS_IMPORT !== 'true') {
    throw new Error(`The subcontractor export has ${validation.contractorCount} rows; at least ${minimumExpected} were expected. Protected contractor data was left unchanged.`);
  }

  await replaceValues(sheets, spreadsheetId, RECORD_TAB, validation.contractorValues);
  await replaceValues(sheets, spreadsheetId, CREW_TAB, validation.crewValues);
  const completedAt = new Date().toISOString();
  const message = `${validation.contractorCount} subcontractors and ${validation.crewCount} crews retained; ${validation.duplicateContractors} duplicate subcontractor rows and ${validation.unparsedCrews} crew statuses require review.`;
  await append(sheets, spreadsheetId, IMPORT_LOG_TAB, [runId, completedAt, 'Blaze Subcontractor Details', validation.contractorCount, validation.crewCount, validation.duplicateContractors, validation.unparsedCrews, 'Completed', message]);
  await append(sheets, spreadsheetId, AUTOMATION_LOG_TAB, [runId, startedAt, completedAt, 'Completed', validation.contractorCount, validation.crewCount, 'GitHub Actions', message]);
  return { completedAt, message };
}

export async function recordContractorsFailure(sheets, spreadsheetId, record) {
  await ensureTab(sheets, spreadsheetId, AUTOMATION_LOG_TAB, AUTOMATION_LOG_HEADERS);
  await append(sheets, spreadsheetId, AUTOMATION_LOG_TAB, [record.runId, record.startedAt, new Date().toISOString(), 'Failed', record.contractorCount || 0, record.crewCount || 0, 'GitHub Actions', record.message]);
}
