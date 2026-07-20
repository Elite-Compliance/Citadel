import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { exportReviewsCsv } from './removify.mjs';
import { createGoogleClients } from './google.mjs';
import { publishReviews, recordReviewsFailure } from './reviews-google.mjs';
import { validateReviewsExport } from './reviews-validate.mjs';

const REVIEWS_SPREADSHEET_ID = process.env.REVIEWS_SPREADSHEET_ID || '1EjRpoie4MP8eE4SmYi0xqXIbGavH3ffz5DTb-MUdE1U';

function shouldRun(date = new Date()) {
  if (process.env.GITHUB_EVENT_NAME === 'workflow_dispatch' || process.env.FORCE_RUN === 'true') return true;
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  }).formatToParts(date).reduce((result, part) => {
    result[part.type] = part.value;
    return result;
  }, {});
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(parts.weekday) && Number(parts.hour) % 24 === 7 && Number(parts.minute) === 30;
}

function requireEnvironment() {
  const environment = {
    email: process.env.REMOVIFY_EMAIL || '',
    password: process.env.REMOVIFY_PASSWORD || '',
    googleCredentials: process.env.GOOGLE_SERVICE_ACCOUNT_JSON || ''
  };
  const missing = [];
  if (!environment.email) missing.push('REMOVIFY_EMAIL');
  if (!environment.password) missing.push('REMOVIFY_PASSWORD');
  if (!environment.googleCredentials) missing.push('GOOGLE_SERVICE_ACCOUNT_JSON');
  if (missing.length) throw new Error(`Missing required GitHub secrets: ${missing.join(', ')}.`);
  return environment;
}

function runIdentifier() {
  return `REV-${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}`;
}

async function main() {
  if (!shouldRun()) {
    console.log('No Reviews pull is scheduled for the current America/New_York time.');
    return;
  }
  const environment = requireEnvironment();
  const runId = runIdentifier();
  const startedAt = new Date().toISOString();
  const outputDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'citadel-removify-'));
  let validation = null;
  let sheets = null;
  try {
    const csvPath = await exportReviewsCsv(outputDirectory, environment);
    validation = validateReviewsExport(csvPath);
    ({ sheets } = createGoogleClients(environment.googleCredentials));
    const result = await publishReviews(sheets, REVIEWS_SPREADSHEET_ID, validation, runId, startedAt);
    console.log(`Reviews automation ${runId} completed: ${result.message}`);
  } catch (error) {
    const message = error && error.message ? error.message : String(error);
    if (sheets) {
      await recordReviewsFailure(sheets, REVIEWS_SPREADSHEET_ID, {
        runId,
        startedAt,
        rowsExported: validation ? validation.rowCount : 0,
        exactDuplicateRows: validation ? validation.exactDuplicateRows : 0,
        message
      }).catch((logError) => console.error(`Unable to record the Reviews automation failure: ${logError.message}`));
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