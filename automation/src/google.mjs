import fs from 'node:fs';
import { google } from 'googleapis';
import { LIEN_REPORTS } from './config.mjs';

const GOOGLE_SHEET_MIME = 'application/vnd.google-apps.spreadsheet';
const GOOGLE_FOLDER_MIME = 'application/vnd.google-apps.folder';
const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

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

async function createFolder(drive, name, parentId) {
  const response = await drive.files.create({
    supportsAllDrives: true,
    requestBody: { name, mimeType: GOOGLE_FOLDER_MIME, parents: [parentId] },
    fields: 'id,name'
  });
  return response.data;
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

async function moveFile(drive, fileId, fromFolderId, toFolderId) {
  await drive.files.update({
    fileId,
    addParents: toFolderId,
    removeParents: fromFolderId,
    supportsAllDrives: true,
    fields: 'id,parents'
  });
}

async function uploadConvertedSheet(drive, parentId, name, filePath) {
  const response = await drive.files.create({
    supportsAllDrives: true,
    requestBody: { name, mimeType: GOOGLE_SHEET_MIME, parents: [parentId] },
    media: { mimeType: XLSX_MIME, body: fs.createReadStream(filePath) },
    fields: 'id,name,mimeType,parents'
  });
  return response.data;
}

export async function publishLienReports(drive, folderId, filesByName, runId) {
  const currentNames = new Set(LIEN_REPORTS.map((report) => report.fileName));
  const stagingFolder = await createFolder(drive, `Incoming ${runId}`, folderId);
  const uploaded = [];
  const archivedFiles = [];
  const activatedFiles = [];
  let archiveFolder = null;

  try {
    for (const report of LIEN_REPORTS) {
      const filePath = filesByName.get(report.fileName);
      uploaded.push(await uploadConvertedSheet(drive, stagingFolder.id, report.fileName, filePath));
    }

    const stagedFiles = await listFolderFiles(drive, stagingFolder.id);
    if (stagedFiles.length !== LIEN_REPORTS.length) {
      throw new Error(`Google Drive staged ${stagedFiles.length} of ${LIEN_REPORTS.length} Liens reports.`);
    }

    const currentFiles = (await listFolderFiles(drive, folderId)).filter((file) =>
      file.mimeType === GOOGLE_SHEET_MIME && currentNames.has(file.name)
    );
    archiveFolder = await createFolder(drive, `Previous Report Set - ${runId}`, folderId);
    for (const file of currentFiles) {
      await moveFile(drive, file.id, folderId, archiveFolder.id);
      archivedFiles.push(file);
    }
    for (const file of stagedFiles) {
      await moveFile(drive, file.id, stagingFolder.id, folderId);
      activatedFiles.push(file);
    }
    await drive.files.delete({ fileId: stagingFolder.id, supportsAllDrives: true });

    return {
      uploaded: stagedFiles.length,
      archived: currentFiles.length,
      archiveFolderId: archiveFolder.id,
      fileIds: stagedFiles.map((file) => file.id)
    };
  } catch (error) {
    const rollbackErrors = [];
    for (const file of activatedFiles.reverse()) {
      try {
        await moveFile(drive, file.id, folderId, stagingFolder.id);
      } catch (rollbackError) {
        rollbackErrors.push(`new ${file.name}: ${rollbackError.message}`);
      }
    }
    if (archiveFolder) {
      for (const file of archivedFiles.reverse()) {
        try {
          await moveFile(drive, file.id, archiveFolder.id, folderId);
        } catch (rollbackError) {
          rollbackErrors.push(`previous ${file.name}: ${rollbackError.message}`);
        }
      }
    }
    const suffix = rollbackErrors.length ? ` Rollback issues: ${rollbackErrors.join('; ')}` : '';
    throw new Error(`${error.message}${suffix}`);
  }
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

export async function runCitadelImports(appsScriptUrl, runId) {
  const liens = await citadelRequest(appsScriptUrl, 'runLienImport', { imported_by: `Scheduled automation ${runId}` });
  const payments = await citadelRequest(appsScriptUrl, 'runPaymentImport', {
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
