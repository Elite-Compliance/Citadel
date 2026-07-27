import { chromium } from 'playwright';
import { ensureAuthenticated } from './blaze.mjs';
import { moneyNumber, stableId } from './orders-compare.mjs';

export const PRODUCTION_INVOICES_URL = 'https://blaze-crm.com/64daaf06-5043-4886-b9a2-1362e47b0b65/production-dashboard/production-invoices';
const INVOICE_STATUSES = [
  'APPROVED',
  'DENIED',
  'DENIED_PRE_APPROVED',
  'PAID',
  'PENDING',
  'PRE_APPROVED',
  'SUBMITTED'
];

function clean(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function absoluteBlazeUrl(path) {
  return new URL(path, PRODUCTION_INVOICES_URL).href;
}

function invoiceIdFromUrl(url) {
  return clean(url).match(/production-invoices\/([^/?#]+)/)?.[1] || '';
}

function jobIdFromUrl(url) {
  return clean(url).match(/job-dashboard\/([^/?#]+)/)?.[1] || '';
}

function labeledValue(text, label) {
  const pattern = new RegExp(`${label}\\s*:?\\s*([^|\\n]+)`, 'i');
  return clean(text.match(pattern)?.[1] || '');
}

async function waitForLoading(page) {
  // Blaze uses both its HTTP loader and an ngx-spinner overlay. Give the
  // overlay a moment to mount, then wait until neither loader is visible.
  await page.waitForTimeout(250);
  await page.waitForFunction(() => {
    const loaders = document.querySelectorAll(
      'ng-http-loader .backdrop, ngx-spinner .ngx-spinner-overlay, .ngx-spinner-overlay'
    );
    return [...loaders].every((loader) => {
      const style = window.getComputedStyle(loader);
      const bounds = loader.getBoundingClientRect();
      return style.display === 'none'
        || style.visibility === 'hidden'
        || Number(style.opacity) === 0
        || bounds.width === 0
        || bounds.height === 0;
    });
  }, undefined, { timeout: 60000 });
}

function regionPicker(page) {
  return page.getByRole('combobox', { name: 'Region', exact: true });
}

function statusPicker(page) {
  const status = '(?:APPROVED|DENIED|DENIED_PRE_APPROVED|PAID|PENDING|PRE_APPROVED|SUBMITTED)';
  return page.getByRole('combobox', {
    name: new RegExp(`^${status}(?:,\\s*${status})*$`, 'i')
  }).first();
}

async function waitForFilters(page) {
  await waitForLoading(page);
  const region = regionPicker(page);
  const status = statusPicker(page);
  if (
    await region.isVisible().catch(() => false)
    && await status.isVisible().catch(() => false)
  ) {
    return { region, status };
  }

  const showFilters = page.getByRole('button', { name: 'Show Filters', exact: true });
  if (await showFilters.isVisible().catch(() => false)) {
    await showFilters.click();
  }
  await region.waitFor({ state: 'visible', timeout: 60000 });
  await status.waitFor({ state: 'visible', timeout: 60000 });
  return { region, status };
}

async function ensureInvoicePage(page) {
  if (!page.url().startsWith(PRODUCTION_INVOICES_URL)) {
    await page.goto(PRODUCTION_INVOICES_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }
  try {
    return await waitForFilters(page);
  } catch {
    await page.goto(PRODUCTION_INVOICES_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    return waitForFilters(page);
  }
}

async function closeSelectOverlay(page) {
  const backdrop = page.locator('.cdk-overlay-backdrop-showing').last();
  if (!(await backdrop.count())) return;
  await page.keyboard.press('Escape');
  await backdrop.waitFor({ state: 'hidden', timeout: 10000 });
}

async function waitForRegionResults(page) {
  await waitForLoading(page);
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  await page.waitForFunction(() => {
    const invoice = document.querySelector('a[href*="/production-invoices/"][href*="/crew-invoice-item-list"]');
    const empty = /no\s+(?:production\s+)?invoices?|no\s+records?|no\s+data/i.test(document.body?.innerText || '');
    return Boolean(invoice || empty);
  }, undefined, { timeout: 60000 });
}

function normalizeStatus(value) {
  return clean(value).toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

async function clearSelections(page) {
  const selected = page.locator('[role="option"][aria-selected="true"]:visible');
  for (let guard = 0; guard < 100 && await selected.count(); guard += 1) {
    await selected.first().click();
  }
}

async function clearRegionFilter(page) {
  await closeSelectOverlay(page);
  const { region } = await ensureInvoicePage(page);
  await region.click();
  await clearSelections(page);
  await page.keyboard.press('Escape');
  await closeSelectOverlay(page);
  await waitForRegionResults(page);
}

async function selectInvoiceStatus(page, status) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await closeSelectOverlay(page);
      const { status: picker } = await ensureInvoicePage(page);
      await picker.click();
      await clearSelections(page);
      const options = page.locator('[role="option"]:visible');
      let match = null;
      for (let index = 0; index < await options.count(); index += 1) {
        const option = options.nth(index);
        if (normalizeStatus(await option.textContent()) === status) {
          match = option;
          break;
        }
      }
      if (!match) throw new Error(`status option ${status} is unavailable`);
      await match.click();
      await page.keyboard.press('Escape');
      await closeSelectOverlay(page);
      await waitForRegionResults(page);
      return;
    } catch (error) {
      lastError = error;
      await page.goto(PRODUCTION_INVOICES_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await clearRegionFilter(page);
    }
  }
  throw new Error(`Blaze invoice status "${status}" could not be selected after 3 attempts: ${lastError?.message || 'unknown error'}`);
}

async function readVisibleInvoices(page, context) {
  return page.locator('main table tbody tr').evaluateAll((rows, context) => (
    rows.map((row) => {
      const cellText = (column) => (
        row.querySelector(`.cdk-column-${column}, .mat-column-${column}`)
          ?.textContent?.replace(/\s+/g, ' ').trim() || ''
      );
      const invoiceLink = row.querySelector(
        'a[href*="/production-invoices/"][href*="/crew-invoice-item-list"]'
      );
      return {
        region: '',
        invoice_href: invoiceLink?.getAttribute('href') || '',
        invoice_number: cellText('name'),
        job_number: cellText('jobNumber'),
        customer: cellText('jobName'),
        crew_name: cellText('crewName'),
        trade: cellText('tradeType'),
        total_amount: cellText('totalAmount'),
        invoice_status: cellText('invoiceStatus') || context.status,
        invoice_type: cellText('invoiceType'),
        invoice_date: cellText('completedDate'),
        approved_by: '',
        approved_on: '',
        source_updated_at: '',
        card_text: row.textContent?.replace(/\s+/g, ' ').trim() || ''
      };
    }).filter((row) => row.invoice_href)
  ), context);
}

async function setRowsPerPage(page, paginator) {
  const pageSize = paginator.getByRole('combobox', { name: /Items per page:/i });
  if (!(await pageSize.count()) || !(await pageSize.isVisible())) return;
  if (clean(await pageSize.textContent()) === '20') return;
  await closeSelectOverlay(page);
  await pageSize.click();
  const option = page.getByRole('option', { name: '20', exact: true });
  if (!(await option.count())) {
    await pageSize.press('Escape').catch(() => {});
    return;
  }
  await option.click();
  await page.locator('.cdk-overlay-backdrop-showing').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  await waitForLoading(page);
}

async function readStatusInvoices(page, status) {
  const rows = [];
  const paginator = page.locator('mat-paginator:visible').last();
  const next = paginator.getByRole('button', { name: 'Next page', exact: true });
  await setRowsPerPage(page, paginator);
  for (let pageNumber = 1; pageNumber <= 1000; pageNumber += 1) {
    await waitForLoading(page);
    rows.push(...await readVisibleInvoices(page, { status }));
    if (!(await next.count()) || await next.isDisabled()) break;
    const firstInvoice = page.locator('a[href*="/production-invoices/"][href*="/crew-invoice-item-list"]').first();
    if (!(await firstInvoice.count())) break;
    const previous = await firstInvoice.getAttribute('href');
    await waitForLoading(page);
    if (await next.isDisabled()) break;
    await next.click({ timeout: 15000 });
    await waitForLoading(page);
    await page.waitForFunction((href) => {
      const first = document.querySelector('a[href*="/production-invoices/"][href*="/crew-invoice-item-list"]');
      return first && first.getAttribute('href') !== href;
    }, previous, { timeout: 30000 });
  }
  return rows;
}

async function discoverInvoices(page) {
  await page.goto(PRODUCTION_INVOICES_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await waitForFilters(page);
  await clearRegionFilter(page);
  const rows = [];
  const completedStatuses = [];
  for (const status of INVOICE_STATUSES) {
    await selectInvoiceStatus(page, status);
    rows.push(...await readStatusInvoices(page, status));
    completedStatuses.push(status);
  }
  const unique = new Map();
  for (const row of rows) {
    const sourceUrl = absoluteBlazeUrl(row.invoice_href);
    const invoiceId = invoiceIdFromUrl(sourceUrl);
    if (!invoiceId) continue;
    unique.set(invoiceId, { ...row, invoice_id: invoiceId, source_url: sourceUrl });
  }
  return {
    regions: ['All regions'],
    statuses: completedStatuses,
    rows: [...unique.values()]
  };
}

async function definitionValue(page, label) {
  return clean(await page.locator('dt').evaluateAll((terms, expected) => {
    const normalize = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
    const term = terms.find((candidate) => normalize(candidate.textContent).toLowerCase() === expected.toLowerCase());
    return term?.nextElementSibling?.textContent || '';
  }, label));
}

async function pageLabeledValue(page, label) {
  return clean(await page.locator('main').evaluate((root, expected) => {
    const normalize = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
    const wanted = expected.replace(/:$/, '').toLowerCase();
    const labels = [...root.querySelectorAll('*')].filter((element) => {
      const text = normalize(element.textContent).replace(/:$/, '').toLowerCase();
      if (text !== wanted) return false;
      return ![...element.children].some((child) => (
        normalize(child.textContent).replace(/:$/, '').toLowerCase() === wanted
      ));
    });
    const labelElement = labels[0];
    if (!labelElement) return '';
    const directSibling = labelElement.nextElementSibling;
    if (directSibling && normalize(directSibling.textContent)) {
      return normalize(directSibling.textContent);
    }
    const container = labelElement.parentElement;
    if (!container) return '';
    const valueElement = [...container.querySelectorAll('p, strong, a, span')]
      .find((element) => element !== labelElement && normalize(element.textContent)
        && normalize(element.textContent).replace(/:$/, '').toLowerCase() !== wanted);
    return normalize(valueElement?.textContent);
  }, label));
}

async function readInvoiceDetail(page, source) {
  await page.goto(source.source_url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.getByRole('columnheader', { name: 'Item', exact: true }).waitFor({ state: 'visible', timeout: 60000 });
  await page.locator('ng-http-loader .backdrop').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
  const jobLink = page.locator('a[href*="job-dashboard"]').first();
  const jobHref = await jobLink.getAttribute('href').catch(() => '');
  const jobUrl = jobHref ? absoluteBlazeUrl(jobHref) : '';
  const heading = clean(await jobLink.innerText().catch(() => ''));
  const [headingJobNumber, ...headingCustomerParts] = heading.split(':');
  const invoiceNumber = await pageLabeledValue(page, 'Invoice #')
    || await definitionValue(page, 'Invoice Number')
    || source.invoice_number;
  const crewName = await pageLabeledValue(page, 'Crew Name')
    || await definitionValue(page, 'Crew')
    || source.crew_name;
  const trade = await pageLabeledValue(page, 'Trade')
    || await definitionValue(page, 'Trade')
    || source.trade;
  const status = await definitionValue(page, 'Status') || source.invoice_status;
  const invoiceDate = await definitionValue(page, 'Date Of Invoice') || source.invoice_date;
  const approvedBy = await definitionValue(page, 'Approved By') || source.approved_by;
  const approvedOn = await definitionValue(page, 'Approved On') || source.approved_on;
  const paidOn = await definitionValue(page, 'Paid On');
  const rows = await page.locator('table').filter({ has: page.getByRole('columnheader', { name: 'Item', exact: true }) }).first()
    .locator('tbody tr').evaluateAll((tableRows) => tableRows.map((row) => {
      const cell = (column) => (
        row.querySelector(`.cdk-column-${column}, .mat-column-${column}`)
      );
      const text = (column) => (
        cell(column)?.textContent?.replace(/\s+/g, ' ').trim() || ''
      );
      const fieldValue = (column, selector) => (
        cell(column)?.querySelector(selector)?.value?.trim() || ''
      );
      return {
        item_name: text('description'),
        uom: text('uom'),
        invoice_unit_price: text('itemCost'),
        quantity: fieldValue('quantity', 'input') || text('quantity').replace(/^QTY\s*/i, ''),
        original_quantity: text('originalQuantity'),
        invoice_total: text('itemPrice'),
        note: fieldValue('note', 'textarea, input') || text('note').replace(/^Note\s*/i, ''),
        requirements: cell('requirements')?.querySelector('button')?.getAttribute('title') || text('requirements')
      };
    }));
  const invoice = {
    invoice_id: source.invoice_id,
    invoice_number: invoiceNumber,
    job_id: jobIdFromUrl(jobUrl),
    job_number: clean(headingJobNumber) || source.job_number,
    job_url: jobUrl,
    customer: clean(headingCustomerParts.join(':')) || source.customer,
    region: source.region,
    crew_name: crewName,
    trade,
    invoice_status: status,
    invoice_date: invoiceDate,
    total_amount: moneyNumber(source.total_amount) || rows.reduce((total, line) => total + moneyNumber(line.invoice_total), 0),
    approved_by: approvedBy,
    approved_on: approvedOn,
    paid_on: paidOn,
    archived_status: /archived/i.test(source.card_text) ? 'Archived' : 'Active',
    source_url: source.source_url
  };
  const lines = rows.filter((line) => line.item_name).map((line, index) => ({
    ...line,
    line_id: stableId(source.invoice_id, index, line.item_name, line.uom),
    invoice_id: source.invoice_id,
    job_id: invoice.job_id,
    invoice_unit_price: moneyNumber(line.invoice_unit_price),
    quantity: moneyNumber(line.quantity),
    original_quantity: moneyNumber(line.original_quantity),
    invoice_total: moneyNumber(line.invoice_total),
    custom_labor: /^\*/.test(line.item_name) ? 'Yes' : ''
  }));
  if (!invoice.invoice_number || !invoice.job_number || !invoice.crew_name
    || !invoice.trade || !Number.isFinite(invoice.total_amount) || !lines.length) {
    throw new Error(
      `Incomplete Blaze invoice detail (invoice=${invoice.invoice_number || 'missing'}, `
      + `job=${invoice.job_number || 'missing'}, crew=${invoice.crew_name || 'missing'}, `
      + `trade=${invoice.trade || 'missing'}, lines=${lines.length})`
    );
  }
  return { invoice, lines };
}

export async function exportCrewPay(credentials) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  try {
    await ensureAuthenticated(page, credentials);
    const discovery = await discoverInvoices(page);
    if (!discovery.rows.length) {
      throw new Error('No Blaze production invoices were discovered; protected Crew Pay data was not changed.');
    }
    const results = [];
    let cursor = 0;
    const workerCount = Math.min(3, discovery.rows.length);
    await Promise.all(Array.from({ length: workerCount }, async () => {
      const worker = await context.newPage();
      try {
        while (cursor < discovery.rows.length) {
          const current = cursor;
          cursor += 1;
          const source = discovery.rows[current];
          try {
            results[current] = await readInvoiceDetail(worker, source);
          } catch (error) {
            console.warn(`Crew invoice ${source.invoice_number || source.invoice_id} unavailable: ${error.message}`);
          }
          await worker.waitForTimeout(150);
        }
      } finally {
        await worker.close();
      }
    }));
    const records = results.filter(Boolean);
    if (!records.length) {
      throw new Error(`Blaze exposed ${discovery.rows.length} invoices, but none produced line details; protected Crew Pay data was not changed.`);
    }
    return {
      regionsExpected: discovery.regions.length,
      regionsCompleted: discovery.regions.length,
      invoicesDiscovered: discovery.rows.length,
      records
    };
  } finally {
    await context.close();
    await browser.close();
  }
}

