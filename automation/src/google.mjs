import { google } from 'googleapis';
import XLSX from 'xlsx';
import { LIEN_REPORTS } from './config.mjs';

const GOOGLE_SHEET_MIME = 'application/vnd.google-apps.spreadsheet';

function parseCredentials(raw) {
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON.');
  }
}

export function createGoogleClients(rawCredentials) {
  if (!rawCredentials) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON GitHub secret is required.');
  const auth = new google.auth.GoogleAuth({
    credentials: parseCredentials(rawCredentials),
    scopes: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/spreadsheets'
    ]
  });
  return {
    drive: google.drive({ version: 'v3', auth }),
    sheets: google.sheets({ version: 'v4', auth })
  };
}

async function listFolderFiles(drive, folderId) {
  const response = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    spaces: 'drive',
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
    pageSize: 1000,
    fields: 'files(id,name,mimeType,parents,createdTime)'
  });
  return response.data.files || [];
}

function sheetRange(title) {
  return `'${String(title).replace(/'/g, "''")}'`;
}

function workbookValues(filePath) {
  const workbook = XLSX.readFile(filePath, { cellDates: false });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error(`No worksheet found in ${filePath}.`);
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
    header: 1,
    defval: '',
    raw: false,
    blankrows: false
  });
}

async function replaceSheetValues(sheets, spreadsheetId, sheet, values) {
  const width = Math.max(1, ...values.map((row) => row.length));
  const height = Math.max(1, values.length);
  const grid = sheet.properties.gridProperties || {};
  if ((grid.rowCount || 0) < height || (grid.columnCount || 0) < width) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{
          updateSheetProperties: {
            properties: {
              sheetId: sheet.properties.sheetId,
              gridProperties: {
                rowCount: Math.max(grid.rowCount || 0, height),
                columnCount: Math.max(grid.columnCount || 0, width)
              }
            },
            fields: 'gridProperties.rowCount,gridProperties.columnCount'
          }
        }]
      }
    });
  }

  const range = sheetRange(sheet.properties.title);
  await sheets.spreadsheets.values.clear({ spreadsheetId, range, requestBody: {} });
  if (values.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${range}!A1`,
      valueInputOption: 'RAW',
      requestBody: { values }
    });
  }
}

export async function publishLienReports(drive, sheets, folderId, filesByName) {
  const folderFiles = (await listFolderFiles(drive, folderId)).filter((file) => file.mimeType === GOOGLE_SHEET_MIME);
  const targets = [];

  for (const report of LIEN_REPORTS) {
    const matches = folderFiles.filter((file) => file.name === report.fileName);
    if (matches.length !== 1) {
      throw new Error(`Expected exactly one Google Sheet named ${report.fileName}; found ${matches.length}.`);
    }
    const metadata = await sheets.spreadsheets.get({
      spreadsheetId: matches[0].id,
      fields: 'sheets.properties(sheetId,title,gridProperties)'
    });
    const sheet = (metadata.data.sheets || [])[0];
    if (!sheet) throw new Error(`${report.fileName} has no worksheet.`);
    const range = sheetRange(sheet.properties.title);
    const backup = await sheets.spreadsheets.values.get({ spreadsheetId: matches[0].id, range });
    targets.push({
      name: report.fileName,
      spreadsheetId: matches[0].id,
      sheet,
      backup: backup.data.values || [],
      values: workbookValues(filesByName.get(report.fileName))
    });
  }

  const updated = [];
  try {
    for (const target of targets) {
      await replaceSheetValues(sheets, target.spreadsheetId, target.sheet, target.values);
      updated.push(target);
    }
  } catch (error) {
    const rollbackErrors = [];
    for (const target of updated.reverse()) {
      try {
        await replaceSheetValues(sheets, target.spreadsheetId, target.sheet, target.backup);
      } catch (rollbackError) {
        rollbackErrors.push(`${target.name}: ${rollbackError.message}`);
      }
    }
    const suffix = rollbackErrors.length ? ` Rollback issues: ${rollbackErrors.join('; ')}` : '';
    throw new Error(`${error.message}${suffix}`);
  }

  return { updated: updated.length, fileIds: updated.map((target) => target.spreadsheetId) };
}

export async function publishPaymentImport(sheets, spreadsheetId, values, runId) {
  const stagingTitle = `PaymentImport_${runId}`;
  const metadata = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: 'sheets.properties(sheetId,title)'
  });
  const existing = (metadata.data.sheets || []).find((sheet) => sheet.properties.title === 'PaymentImport');
  const added = await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [{ addSheet: { properties: { title: stagingTitle, hidden: true } } }]
    }
  });
  const stagingSheetId = added.data.replies[0].addSheet.properties.sheetId;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `'${stagingTitle}'!A1:K${values.length}`,
    valueInputOption: 'RAW',
    requestBody: { values }
  });

  const verification = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${stagingTitle}'!A1:K${values.length}`,
    majorDimension: 'ROWS'
  });
  const writtenRows = (verification.data.values || []).length;
  if (writtenRows !== values.length) {
    throw new Error(`Google Sheets staged ${writtenRows} of ${values.length} Payment Import rows.`);
  }

  const swapRequests = [];
  if (existing) swapRequests.push({ deleteSheet: { sheetId: existing.properties.sheetId } });
  swapRequests.push({
    updateSheetProperties: {
      properties: { sheetId: stagingSheetId, title: 'PaymentImport', hidden: false },
      fields: 'title,hidden'
    }
  });
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: { requests: swapRequests }
  });

  return { rows: Math.max(values.length - 1, 0) };
}

async function citadelRequest(baseUrl, action, parameters = {}) {
  const url = new URL(baseUrl);
  url.searchParams.set('action', action);
  for (const [key, value] of Object.entries(parameters)) url.searchParams.set(key, String(value));
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) throw new Error(`Citadel ${action} returned HTTP ${response.status}.`);
  const payload = await response.json();
  if (!payload.ok) throw new Error(payload.error || `Citadel ${action} failed.`);
  return payload.data;
}

export async function runCitadelImports(appsScriptUrl, runId, automationToken) {
  if (!automationToken) throw new Error('CITADEL_AUTOMATION_TOKEN GitHub secret is required.');
  const liens = await citadelRequest(appsScriptUrl, 'runLienImport', {
    automation_token: automationToken,
    imported_by: `Scheduled automation ${runId}`
  });
  const payments = await citadelRequest(appsScriptUrl, 'runPaymentImport', {
    automation_token: automationToken,
    imported_by: `Scheduled automation ${runId}`,
    source_label: `Blaze Deposit Report ${runId}`
  });
  return { liens, payments };
}

export async function recordAutomationRun(appsScriptUrl, token, record) {
  if (!token) throw new Error('CITADEL_AUTOMATION_TOKEN GitHub secret is required.');
  const response = await fetch(appsScriptUrl, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action: 'recordLienAutomationRun', token, ...record })
  });
  if (!response.ok) throw new Error(`Unable to record automation status (HTTP ${response.status}).`);
  const payload = await response.json();
  if (!payload.ok) throw new Error(payload.error || 'Unable to record automation status.');
  return payload.data;
}
