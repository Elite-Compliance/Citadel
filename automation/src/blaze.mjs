import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { authenticator } from 'otplib';
import XLSX from 'xlsx';
import { CONTRACTOR_DIRECTORY_URL, CONTRACTORS_URL, DEPOSIT_REPORT, DEPOSITS_URL, LIEN_REPORTS, RECEIVABLES_URL } from './config.mjs';

async function firstVisible(page, selectors) {
  try {
    const scopes = [page, ...page.frames().filter((frame) => frame !== page.mainFrame())];
    for (const scope of scopes) {
      for (const selector of selectors) {
        const locator = scope.locator(selector);
        if (await locator.count() && await locator.first().isVisible()) return locator.first();
      }
    }
  } catch (error) {
    if (!/Execution context was destroyed|Target page, context or browser has been closed/i.test(error.message)) throw error;
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

async function firstVisibleButton(page, labels) {
  for (const label of labels) {
    try {
      const locator = page.getByRole('button', { name: label, exact: false });
      if (await locator.count() && await locator.first().isVisible()) return locator.first();
    } catch (error) {
      if (!/Execution context was destroyed|Target page, context or browser has been closed/i.test(error.message)) throw error;
    }
  }
  return firstVisible(page, ['button[type="submit"]', 'input[type="submit"]']);
}

async function dismissPushNotificationPrompt(page, waitTimeout = 0) {
  if (waitTimeout) {
    await page.waitForFunction(() => {
      return document.body?.innerText.includes('Do you want to enable push notifications?');
    }, null, { timeout: waitTimeout }).catch(() => {});
  }

  await page.evaluate(() => {
    document.querySelectorAll('app-push-notification').forEach((element) => {
      element.remove();
    });
  });
}

async function ensureAuthenticated(page, credentials) {
  await page.goto(RECEIVABLES_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  const savedView = page.getByRole('button', { name: LIEN_REPORTS[0].view, exact: true });
  if (await savedView.count() === 1 && await savedView.isVisible()) return;

  if (!credentials.blazeEmail || !credentials.blazePassword) {
    throw new Error('BLAZE_EMAIL and BLAZE_PASSWORD GitHub secrets are required.');
  }

  const emailSelectors = [
    'input[type="email"]',
    'input[name="email"]',
    'input[name="identifier"]',
    'input[autocomplete="email"]',
    'input[autocomplete="username"]',
    'input[id*="email" i]'
  ];
  const passwordSelectors = [
    'input[type="password"]',
    'input[name="password"]',
    'input[autocomplete="current-password"]',
    'input[id*="password" i]'
  ];
  const email = await waitForVisible(page, emailSelectors, 30000);
  let password = await firstVisible(page, passwordSelectors);
  if (!email && !password) {
    throw new Error(`Blaze authentication page was not recognized (URL: ${page.url()}, title: ${await page.title()}).`);
  }

  if (email) {
    await email.fill(credentials.blazeEmail);
    if (!password) {
      const continueButton = await firstVisibleButton(page, ['Continue', 'Next', 'Sign In', 'Log In', 'Login']);
      if (continueButton) await continueButton.click();
      else await email.press('Enter');
      password = await waitForVisible(page, passwordSelectors, 30000);
    }
  }
  if (!password) throw new Error(`Blaze did not present a password field after the email step (URL: ${page.url()}).`);

  await password.fill(credentials.blazePassword);
  const loginButton = await firstVisibleButton(page, ['Log In', 'Login', 'Sign In', 'Continue', 'Submit']);
  if (!loginButton) throw new Error('The Blaze login button was not recognized.');
  await loginButton.click();

  const totpSelectors = [
    'input[autocomplete="one-time-code"]',
    'input[name="code"]',
    'input[name="otp"]',
    'input[inputmode="numeric"]'
  ];
  await Promise.race([
    savedView.waitFor({ state: 'visible', timeout: 60000 }).catch(() => {}),
    waitForVisible(page, totpSelectors, 60000)
  ]);
  const totpInput = await firstVisible(page, totpSelectors);
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

function contractorNameKey(value) {
  return String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function contractorNamesFromReport(reportPath) {
  const workbook = XLSX.readFile(reportPath, { cellDates: false });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return new Set(XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false }).map((row) => contractorNameKey(row.Subcontractor)).filter(Boolean));
}

async function setLargestPageSize(page) {
  const picker = page.getByRole('combobox', { name: /Items per page/i });
  if (!(await picker.count())) return;
  await picker.click();
  const options = page.getByRole('option');
  const labels = await options.allTextContents();
  const largest = labels.map((label) => Number(String(label).trim())).filter(Number.isFinite).sort((a, b) => b - a)[0];
  if (largest) await page.getByRole('option', { name: String(largest), exact: true }).click();
}

async function readContractorDirectory(page, reportNames) {
  await page.goto(CONTRACTOR_DIRECTORY_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.getByRole('columnheader', { name: 'Company Name', exact: true }).waitFor({ state: 'visible', timeout: 60000 });
  await setLargestPageSize(page).catch(() => {});
  const records = [];

  while (true) {
    const rows = page.locator('table tbody tr');
    await rows.first().waitFor({ state: 'visible', timeout: 30000 });
    const pageRecords = await rows.evaluateAll((elements) => elements.map((row) => {
      const cells = row.querySelectorAll('td');
      const link = cells[1]?.querySelector('a');
      if (!link) return null;
      return {
        name: link.textContent?.trim() || '',
        phone: cells[3]?.textContent?.trim() || '',
        email: cells[4]?.textContent?.trim() || '',
        href: link.getAttribute('href') || ''
      };
    }).filter(Boolean));
    for (const record of pageRecords) {
      const name = record.name;
      if (!reportNames.has(contractorNameKey(name))) continue;
      records.push(record);
    }
    const next = page.getByRole('button', { name: 'Next page', exact: true });
    if (!(await next.count()) || await next.isDisabled()) break;
    const firstHref = pageRecords[0]?.href || '';
    await next.click();
    await page.waitForFunction((previous) => {
      const anchor = document.querySelector('table tbody tr td:nth-child(2) a');
      return anchor && anchor.getAttribute('href') !== previous;
    }, firstHref, { timeout: 30000 });
  }
  return records;
}

async function readContractorDetail(page, record) {
  if (!record.href) return record;
  const detailUrl = new URL(record.href, CONTRACTOR_DIRECTORY_URL).href;
  let loaded = false;
  let loadError = null;
  for (let attempt = 1; attempt <= 2 && !loaded; attempt += 1) {
    try {
      await page.goto(detailUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.getByRole('textbox', { name: 'Company Name', exact: true }).waitFor({ state: 'visible', timeout: 30000 });
      loaded = true;
    } catch (error) {
      loadError = error;
      if (attempt < 2) await page.waitForTimeout(750);
    }
  }
  if (!loaded) throw loadError || new Error('Contractor detail page did not load.');
  const checkedRegions = await page.locator('input[type="checkbox"]:checked').evaluateAll((inputs) => inputs.map((input) => {
    const label = input.getAttribute('aria-label') || input.closest('label')?.innerText || input.parentElement?.parentElement?.innerText || '';
    return label.trim();
  }).filter((label) => label && label.toLowerCase() !== 'active'));
  const heading = page.getByRole('heading', { name: 'Billing Address', exact: true });
  let address = '';
  if (await heading.count()) {
    const parentText = String(await heading.locator('xpath=..').innerText().catch(() => '') || '');
    address = parentText.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !/^(billing address|edit)$/i.test(line)).join(', ');
    if (!address) {
      address = String(await heading.locator('xpath=following-sibling::*[1]').innerText().catch(() => '') || '').trim();
    }
  }
  return { ...record, regions: checkedRegions, address };
}

async function enrichContractors(context, page, reportPath) {
  const directory = await readContractorDirectory(page, contractorNamesFromReport(reportPath));
  const output = new Array(directory.length);
  let cursor = 0;
  const workerCount = Math.min(4, directory.length);
  await Promise.all(Array.from({ length: workerCount }, async () => {
    const worker = await context.newPage();
    try {
      while (cursor < directory.length) {
        const index = cursor;
        cursor += 1;
        try {
          output[index] = await readContractorDetail(worker, directory[index]);
        } catch (error) {
          console.warn(`Blaze contractor detail unavailable for ${directory[index].name}: ${error.message}`);
          output[index] = directory[index];
        }
      }
    } finally {
      await worker.close();
    }
  }));
  return output.filter(Boolean);
}

export async function exportContractorsReport(outputDirectory, credentials) {
  fs.mkdirSync(outputDirectory, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  page.setDefaultTimeout(30000);

  try {
    await ensureAuthenticated(page, credentials);
    await page.goto(CONTRACTORS_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.locator('ng-http-loader .backdrop').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
    await dismissPushNotificationPrompt(page, 45000);
    const runButton = page.getByRole('button', { name: 'Run Report', exact: true });
    await runButton.waitFor({ state: 'visible', timeout: 60000 });
    await runButton.click();

    const exportButton = page.getByRole('button', { name: 'Export to Excel', exact: true });
    await exportButton.waitFor({ state: 'visible', timeout: 120000 });
    await dismissPushNotificationPrompt(page);
    const downloadPromise = page.waitForEvent('download', { timeout: 120000 });
    await exportButton.click({ force: true });
    const download = await downloadPromise;
    const outputPath = path.join(outputDirectory, 'Subcontractor Details.xlsx');
    await download.saveAs(outputPath);
    const failure = await download.failure();
    if (failure) throw new Error(`Blaze subcontractor export failed: ${failure}`);
    const directory = await enrichContractors(context, page, outputPath);
    return { reportPath: outputPath, directory };
  } finally {
    await context.close();
    await browser.close();
  }
}
