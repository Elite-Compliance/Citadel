import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { exportContractorsReport } from './blaze.mjs';
import { createGoogleClients } from './google.mjs';
import { publishContractors, recordContractorsFailure } from './contractors-google.mjs';
import { validateContractorsExport } from './contractors-validate.mjs';

const CONTRACTORS_SPREADSHEET_ID = process.env.CONTRACTORS_SPREADSHEET_ID || '1qsMCA_kC129S4FbbMiLt1X9_VJlkwPRqGxx0WRrPuTg';

function shouldRun(date = new Date()) {
  if (process.env.GITHUB_EVENT_NAME === 'workflow_dispatch' || process.env.FORCE_RUN === 'true') return true;
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false })
    .formatToParts(date).reduce((result, part) => { result[part.type] = part.value; return result; }, {});
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(parts.weekday) && Number(parts.hour) % 24 === 7 && Number(parts.minute) === 15;
}

function environment() {
  const values = {
    blazeEmail: process.env.BLAZE_EMAIL || '',
    blazePassword: process.env.BLAZE_PASSWORD || '',
    blazeTotpSecret: process.env.BLAZE_TOTP_SECRET || '',
    googleCredentials: process.env.GOOGLE_SERVICE_ACCOUNT_JSON || ''
  };
  const missing = [];
  if (!values.blazeEmail) missing.push('BLAZE_EMAIL');
  if (!values.blazePassword) missing.push('BLAZE_PASSWORD');
  if (!values.googleCredentials) missing.push('GOOGLE_SERVICE_ACCOUNT_JSON');
  if (missing.length) throw new Error(`Missing required GitHub secrets: ${missing.join(', ')}.`);
  return values;
}

function runIdentifier() {
  return `CON-${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}`;
}

async function main() {
  if (!shouldRun()) {
    console.log('No Contractors pull is scheduled for the current America/New_York time.');
    return;
  }
  const credentials = environment();
  const runId = runIdentifier();
  const startedAt = new Date().toISOString();
  const outputDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'citadel-contractors-'));
  let validation = null;
  let sheets = null;
  try {
    const reportPath = await exportContractorsReport(outputDirectory, credentials);
    validation = validateContractorsExport(reportPath);
    ({ sheets } = createGoogleClients(credentials.googleCredentials));
    const result = await publishContractors(sheets, CONTRACTORS_SPREADSHEET_ID, validation, runId, startedAt);
    console.log(`Contractors automation ${runId} completed: ${result.message}`);
  } catch (error) {
    const message = error && error.message ? error.message : String(error);
    if (sheets) {
      await recordContractorsFailure(sheets, CONTRACTORS_SPREADSHEET_ID, {
        runId, startedAt,
        contractorCount: validation ? validation.contractorCount : 0,
        crewCount: validation ? validation.crewCount : 0,
        message
      }).catch((logError) => console.error(`Unable to record the Contractors automation failure: ${logError.message}`));
    }
    throw error;
  } finally {
    fs.rmSync(outputDirectory, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exitCode = 1;
});
