import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { exportBlazeReports } from './blaze.mjs';
import { requiredEnvironment, SCHEDULE } from './config.mjs';
import {
  createGoogleClients,
  publishLienReports,
  publishPaymentImport,
  recordAutomationRun,
  runCitadelImports
} from './google.mjs';
import { paymentSheetValues, validateDepositReport, validateLienReportSet } from './validate.mjs';

function localScheduleParts(date = new Date()) {
  const values = new Intl.DateTimeFormat('en-US', {
    timeZone: SCHEDULE.timezone,
    weekday: 'short',
    hour: 'numeric',
    hour12: false
  }).formatToParts(date).reduce((result, part) => {
    result[part.type] = part.value;
    return result;
  }, {});
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(values.weekday);
  return { weekday, hour: Number(values.hour) % 24 };
}

function scheduledUtcHour() {
  const match = String(process.env.GITHUB_SCHEDULE || '').trim().match(/^\d+\s+(\d+)\s/);
  return match ? Number(match[1]) : null;
}

function shouldRun() {
  if (process.env.FORCE_RUN === 'true' || process.env.GITHUB_EVENT_NAME === 'workflow_dispatch') return true;

  const utcHour = scheduledUtcHour();
  if (utcHour !== null) {
    const scheduledTime = new Date();
    scheduledTime.setUTCHours(utcHour, 0, 0, 0);
    const scheduledLocal = localScheduleParts(scheduledTime);
    return SCHEDULE.weekdays.includes(scheduledLocal.weekday) && SCHEDULE.hours.includes(scheduledLocal.hour);
  }

  const local = localScheduleParts();
  return SCHEDULE.weekdays.includes(local.weekday) && SCHEDULE.hours.includes(local.hour);
}

function requireSecrets(environment) {
  const missing = [];
  if (!environment.blazeEmail) missing.push('BLAZE_EMAIL');
  if (!environment.blazePassword) missing.push('BLAZE_PASSWORD');
  if (!environment.googleCredentials) missing.push('GOOGLE_SERVICE_ACCOUNT_JSON');
  if (!environment.automationToken) missing.push('CITADEL_AUTOMATION_TOKEN');
  if (missing.length) throw new Error(`Missing required GitHub secrets: ${missing.join(', ')}.`);
}

function runIdentifier() {
  return `AUTO-${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}`;
}

async function main() {
  if (!shouldRun()) {
    console.log('This paired UTC trigger is not one of today's Eastern-time import slots.');
    return;
  }

  const environment = requiredEnvironment();
  requireSecrets(environment);
  const runId = runIdentifier();
  const startedAt = new Date().toISOString();
  const outputDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'citadel-blaze-'));
  let reportsExported = 0;
  let imports = null;

  try {
    const exported = await exportBlazeReports(outputDirectory, environment);
    reportsExported = exported.lienFiles.size + (exported.depositPath ? 1 : 0);
    const lienValidation = validateLienReportSet(exported.lienFiles);
    const depositValidation = validateDepositReport(exported.depositPath);
    const paymentValues = paymentSheetValues(depositValidation);
    const { drive, sheets } = createGoogleClients(environment.googleCredentials);

    await publishLienReports(drive, sheets, environment.lienFolderId, exported.lienFiles);
    await publishPaymentImport(sheets, environment.paymentSpreadsheetId, paymentValues, runId);
    imports = await runCitadelImports(environment.appsScriptUrl, runId, environment.automationToken);

    await recordAutomationRun(environment.appsScriptUrl, environment.automationToken, {
      run_id: runId,
      started_at: startedAt,
      completed_at: new Date().toISOString(),
      status: 'Completed',
      reports_expected: 12,
      reports_exported: reportsExported,
      liens_import_id: imports.liens.import_id,
      payment_import_id: imports.payments.import_id,
      source: 'GitHub Actions',
      message: `${lienValidation.activeJobs} active Liens jobs, ${lienValidation.membershipRows} memberships, ${lienValidation.repeatedJobRows} repeated job rows retained, ${depositValidation.rowCount} payment rows.`
    });

    console.log(`Citadel automation ${runId} completed: 12 reports exported and both protected imports succeeded.`);
  } catch (error) {
    const message = error && error.message ? error.message : String(error);
    await recordAutomationRun(environment.appsScriptUrl, environment.automationToken, {
      run_id: runId,
      started_at: startedAt,
      completed_at: new Date().toISOString(),
      status: 'Failed',
      reports_expected: 12,
      reports_exported: reportsExported,
      liens_import_id: imports && imports.liens ? imports.liens.import_id : '',
      payment_import_id: imports && imports.payments ? imports.payments.import_id : '',
      source: 'GitHub Actions',
      message
    }).catch((logError) => console.error(`Unable to record the automation failure: ${logError.message}`));
    throw error;
  } finally {
    fs.rmSync(outputDirectory, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exitCode = 1;
});
