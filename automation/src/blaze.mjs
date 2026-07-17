import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { authenticator } from 'otplib';
import { DEPOSIT_REPORT, DEPOSITS_URL, LIEN_REPORTS, RECEIVABLES_URL } from './config.mjs';

async function firstVisible(page, selectors) {
  for (const selector of selectors) {
    const locator = page.locator(selector);
    if (await locator.count() && await locator.first().isVisible()) return locator.first();
  }
  return null;
}

async function firstVisibleButton(page, labels) {
  for (const label of labels) {
    const locator = page.getByRole('button', { name: label, exact: true });
    if (await locator.count() === 1 && await locator.isVisible()) return locator;
  }
  return null;
}

async function ensureAuthenticated(page, credentials) {
  await page.goto(RECEIVABLES_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const savedView = page.getByRole('button', { name: LIEN_REPORTS[0].view, exact: true });
  if (await savedView.count() === 1 && await savedView.isVisible()) return;

  const email = await firstVisible(page, ['input[type="email"]', 'input[name="email"]', 'input[autocomplete="username"]']);
  const password = await firstVisible(page, ['input[type="password"]', 'input[name="password"]', 'input[autocomplete="current-password"]']);
  if (!email || !password) {
    throw new Error('Blaze authentication is required, but the login form was not recognized. Refresh the stored credentials or authentication session.');
  }
  if (!credentials.blazeEmail || !credentials.blazePassword) {
    throw new Error('BLAZE_EMAIL and BLAZE_PASSWORD GitHub secrets are required.');
  }

  await email.fill(credentials.blazeEmail);
  await password.fill(credentials.blazePassword);
  const loginButton = await firstVisibleButton(page, ['Log In', 'Login', 'Sign In', 'Continue']);
  if (!loginButton) throw new Error('The Blaze login button was not recognized.');
  await loginButton.click();

  const totpInput = await firstVisible(page, [
    'input[autocomplete="one-time-code"]',
    'input[name="code"]',
    'input[name="otp"]',
    'input[inputmode="numeric"]'
  ]);
  if (totpInput) {
    if (!credentials.blazeTotpSecret) throw new Error('Blaze requested a verification code. Configure the BLAZE_TOTP_SECRET GitHub secret.');
    await totpInput.fill(authenticator.generate(credentials.blazeTotpSecret));
    const verifyButton = await firstVisibleButton(page, ['Verify', 'Continue', 'Submit']);
    if (!verifyButton) throw new Error('The Blaze verification button was not recognized.');
    await verifyButton.click();
  }

  await savedView.waitFor({ state: 'visible', timeout: 60000 });
}

async function exportLoadedReport(page, outputPath) {
  const loadButton = page.getByRole('button', { name: 'Load Report', exact: true });
  await loadButton.waitFor({ state: 'visible', timeout: 30000 });
  await loadButton.click();
  const exportButton = page.getByRole('button', { name: 'Export Report', exact: true });
  await exportButton.waitFor({ state: 'visible', timeout: 120000 });
  await page.waitForLoadState('networkidle', { timeout: 120000 }).catch(() => {});
  const downloadPromise = page.waitForEvent('download', { timeout: 120000 });
  await exportButton.click();
  const download = await downloadPromise;
  await download.saveAs(outputPath);
  const failure = await download.failure();
  if (failure) throw new Error(`Blaze export failed: ${failure}`);
}

async function selectSavedView(page, viewName) {
  const button = page.getByRole('button', { name: viewName, exact: true });
  await button.waitFor({ state: 'visible', timeout: 30000 });
  await button.click();
}

export async function exportBlazeReports(outputDirectory, credentials) {
  fs.mkdirSync(outputDirectory, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  const lienFiles = new Map();

  try {
    await ensureAuthenticated(page, credentials);
    for (const report of LIEN_REPORTS) {
      await page.goto(RECEIVABLES_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await selectSavedView(page, report.view);
      const outputPath = path.join(outputDirectory, `${report.fileName}.xlsx`);
      await exportLoadedReport(page, outputPath);
      lienFiles.set(report.fileName, outputPath);
    }

    await page.goto(DEPOSITS_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await selectSavedView(page, DEPOSIT_REPORT.view);
    const depositPath = path.join(outputDirectory, `${DEPOSIT_REPORT.fileName}.csv`);
    await exportLoadedReport(page, depositPath);

    return { lienFiles, depositPath };
  } finally {
    await context.close();
    await browser.close();
  }
}
