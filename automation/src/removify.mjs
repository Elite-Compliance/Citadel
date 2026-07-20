import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const MONITORS_URL = 'https://app.removify.com/reviews/monitors';
const LOGIN_URL = 'https://app.removify.com/login';

async function firstVisible(page, selectors) {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if (await locator.count() && await locator.isVisible()) return locator;
  }
  return null;
}

async function waitForVisible(page, selectors, timeout = 30000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const locator = await firstVisible(page, selectors);
    if (locator) return locator;
    await page.waitForTimeout(250);
  }
  return null;
}

async function login(page, credentials) {
  await page.goto(MONITORS_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  const exportButton = page.getByRole('button', { name: /export csv/i }).first();
  if (await exportButton.count() && await exportButton.isVisible()) return exportButton;

  if (!credentials.email || !credentials.password) throw new Error('REMOVIFY_EMAIL and REMOVIFY_PASSWORD GitHub secrets are required.');
  if (!/login|sign-in|signin/i.test(page.url())) await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

  const email = await waitForVisible(page, [
    'input[type="email"]',
    'input[name="email"]',
    'input[autocomplete="email"]',
    'input[autocomplete="username"]'
  ]);
  const password = await waitForVisible(page, [
    'input[type="password"]',
    'input[name="password"]',
    'input[autocomplete="current-password"]'
  ]);
  if (!email || !password) throw new Error(`The Removify login form was not recognized (URL: ${page.url()}).`);
  await email.fill(credentials.email);
  await password.fill(credentials.password);
  const submit = page.getByRole('button', { name: /log in|login|sign in|continue/i }).first();
  if (await submit.count()) await submit.click();
  else await password.press('Enter');

  await page.goto(MONITORS_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  await exportButton.waitFor({ state: 'visible', timeout: 60000 }).catch(() => {});
  if (!await exportButton.count() || !await exportButton.isVisible()) {
    throw new Error(`Removify authentication did not reach the Monitoring export page (URL: ${page.url()}). A verification prompt may require attention.`);
  }
  return exportButton;
}

export async function exportReviewsCsv(outputDirectory, credentials) {
  fs.mkdirSync(outputDirectory, { recursive: true });
  const outputPath = path.join(outputDirectory, 'reviews.csv');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  try {
    const exportButton = await login(page, credentials);
    const downloadPromise = page.waitForEvent('download', { timeout: 120000 });
    await exportButton.click();
    const download = await downloadPromise;
    await download.saveAs(outputPath);
    const failure = await download.failure();
    if (failure) throw new Error(`Removify export failed: ${failure}`);
    return outputPath;
  } finally {
    await context.close();
    await browser.close();
  }
}