const RECORD_TAB = 'ReviewRecords';
const METRIC_TAB = 'ReviewMetrics';
const IMPORT_LOG_TAB = 'ReviewImportLog';
const AUTOMATION_LOG_TAB = 'ReviewAutomationLog';
const METRIC_HEADERS = ['metric_key', 'label', 'value', 'note', 'tone', 'sort_order'];
const IMPORT_LOG_HEADERS = ['import_id', 'imported_at', 'source', 'row_count', 'exact_duplicate_rows', 'identity_duplicate_rows', 'status', 'message'];
const AUTOMATION_LOG_HEADERS = ['run_id', 'started_at', 'completed_at', 'status', 'rows_exported', 'exact_duplicate_rows', 'source', 'message'];

function quote(title) {
  return `'${String(title).replace(/'/g, "''")}'`;
}

async function spreadsheetSheets(sheets, spreadsheetId) {
  const response = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: 'sheets.properties(sheetId,title,gridProperties)'
  });
  return response.data.sheets || [];
}

async function ensureTab(sheets, spreadsheetId, title, headers) {
  let tab = (await spreadsheetSheets(sheets, spreadsheetId)).find((candidate) => candidate.properties.title === title);
  if (!tab) {
    const added = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests: [{ addSheet: { properties: { title } } }] }
    });
    tab = { properties: added.data.replies[0].addSheet.properties };
  }
  const headerResponse = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${quote(title)}!1:1`
  });
  if (!(headerResponse.data.values || []).length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${quote(title)}!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: [headers] }
    });
  }
  return tab;
}

async function replaceValues(sheets, spreadsheetId, title, values) {
  const range = quote(title);
  const previous = await sheets.spreadsheets.values.get({ spreadsheetId, range }).then((response) => response.data.values || []);
  try {
    await sheets.spreadsheets.values.clear({ spreadsheetId, range, requestBody: {} });
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${range}!A1`,
      valueInputOption: 'RAW',
      requestBody: { values }
    });
    const verification = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${range}!A1:A${values.length}` });
    if ((verification.data.values || []).length !== values.length) throw new Error(`Google Sheets verified ${(verification.data.values || []).length} of ${values.length} rows.`);
  } catch (error) {
    await sheets.spreadsheets.values.clear({ spreadsheetId, range, requestBody: {} }).catch(() => {});
    if (previous.length) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${range}!A1`,
        valueInputOption: 'RAW',
        requestBody: { values: previous }
      }).catch(() => {});
    }
    throw error;
  }
  return previous;
}

async function append(sheets, spreadsheetId, title, values) {
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${quote(title)}!A:A`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [values] }
  });
}

async function countActiveRows(sheets, spreadsheetId, title) {
  const tab = (await spreadsheetSheets(sheets, spreadsheetId)).find((candidate) => candidate.properties.title === title);
  if (!tab) return 0;
  const response = await sheets.spreadsheets.values.get({ spreadsheetId, range: quote(title) });
  const values = response.data.values || [];
  if (values.length < 2) return 0;
  const headers = values[0].map((value) => String(value).trim().toLowerCase());
  const activeIndex = headers.indexOf('active');
  if (activeIndex < 0) return values.length - 1;
  return values.slice(1).filter((row) => !/^(false|no|0|inactive|closed)$/i.test(String(row[activeIndex] ?? '').trim())).length;
}

export async function publishReviews(sheets, spreadsheetId, validation, runId, startedAt) {
  await ensureTab(sheets, spreadsheetId, RECORD_TAB, validation.values[0]);
  await ensureTab(sheets, spreadsheetId, METRIC_TAB, METRIC_HEADERS);
  await ensureTab(sheets, spreadsheetId, IMPORT_LOG_TAB, IMPORT_LOG_HEADERS);
  await ensureTab(sheets, spreadsheetId, AUTOMATION_LOG_TAB, AUTOMATION_LOG_HEADERS);

  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${quote(RECORD_TAB)}!A:A`
  });
  const existingCount = Math.max((existing.data.values || []).length - 1, 0);
  const minimumExpected = existingCount >= 100 ? Math.floor(existingCount * 0.6) : 100;
  if (validation.rowCount < minimumExpected && process.env.FORCE_REVIEWS_IMPORT !== 'true') {
    throw new Error(`The Reviews export has ${validation.rowCount} rows; at least ${minimumExpected} were expected. The current protected data was left unchanged.`);
  }

  await replaceValues(sheets, spreadsheetId, RECORD_TAB, validation.values);
  const attentionCount = validation.rows.filter((row) => Number(row.rating) < 4).length;
  const openWorkflowCount = await countActiveRows(sheets, spreadsheetId, 'ReviewAlerts') + await countActiveRows(sheets, spreadsheetId, 'ReviewFollowUps');
  await replaceValues(sheets, spreadsheetId, METRIC_TAB, [
    METRIC_HEADERS,
    ['reviews', 'Reviews', validation.rowCount, 'Current records', 'blue', 1],
    ['findings', 'Findings', attentionCount, 'Below 4 stars', 'amber', 2],
    ['due_soon', 'Due Soon', 0, 'No due date source', 'silver', 3],
    ['open_alerts', 'Open Alerts', openWorkflowCount, 'Alerts + follow-ups', 'red', 4]
  ]);
  const completedAt = new Date().toISOString();
  const message = `${validation.rowCount} rows retained; ${validation.exactDuplicateRows} exact duplicate rows and ${validation.identityDuplicateRows} duplicate review identities detected.`;
  await append(sheets, spreadsheetId, IMPORT_LOG_TAB, [runId, completedAt, 'Removify Monitoring CSV', validation.rowCount, validation.exactDuplicateRows, validation.identityDuplicateRows, 'Completed', message]);
  await append(sheets, spreadsheetId, AUTOMATION_LOG_TAB, [runId, startedAt, completedAt, 'Completed', validation.rowCount, validation.exactDuplicateRows, 'GitHub Actions', message]);
  return { rowCount: validation.rowCount, completedAt, message };
}

export async function recordReviewsFailure(sheets, spreadsheetId, record) {
  await ensureTab(sheets, spreadsheetId, AUTOMATION_LOG_TAB, AUTOMATION_LOG_HEADERS);
  await append(sheets, spreadsheetId, AUTOMATION_LOG_TAB, [record.runId, record.startedAt, new Date().toISOString(), 'Failed', record.rowsExported || 0, record.exactDuplicateRows || 0, 'GitHub Actions', record.message]);
}