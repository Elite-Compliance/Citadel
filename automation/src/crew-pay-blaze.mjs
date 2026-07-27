import { chromium } from 'playwright';
import { ensureAuthenticated } from './blaze.mjs';
import { moneyNumber, stableId } from './orders-compare.mjs';

export const PRODUCTION_INVOICES_URL = 'https://blaze-crm.com/64daaf06-5043-4886-b9a2-1362e47b0b65/production-dashboard/production-invoices';

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

async function waitForRegionPicker(page) {
  await waitForLoading(page);
  await regionPicker(page).then((picker) => picker.waitFor({ state: 'visible', timeout: 60000 }));
}

async function regionPicker(page) {
  return page.getByRole('combobox', { name: 'Region', exact: true });
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

async function regionNames(page) {
  const picker = await regionPicker(page);
  await picker.click();
  const names = (await page.getByRole('option').allTextContents()).map(clean).filter(Boolean);
  await closeSelectOverlay(page);
  return [...new Set(names)];
}

async function selectRegion(page, region) {
  const picker = await regionPicker(page);
  await picker.click();
  await page.getByRole('option', { name: region, exact: true }).click();
  await page.locator('.cdk-overlay-backdrop-showing').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  await waitForRegionResults(page);
}

async function readVisibleInvoices(page, region) {
  return page.locator('a[href*="/production-invoices/"][href*="/crew-invoice-item-list"]').evaluateAll((links, context) => (
    links.map((link) => {
      const card = link.closest('tr, mat-card, .card, [class*="invoice"], [class*="list-item"]') || link.parentElement?.parentElement || link;
      const text = card.textContent?.replace(/\s+/g, ' ').trim() || '';
      const invoiceNumber = (link.textContent || '').match(/Invoice\s*#?\s*(\d+)/i)?.[1]
        || text.match(/Invoice\s*#?\s*(\d+)/i)?.[1]
        || '';
      const read = (label) => {
        const expression = new RegExp(`${label}\\s*:?\\s*(.*?)(?=\\s+(?:Job Number|Crew Name|Trade|Total|Status|Approved By|Approved On|Date Of Invoice|Last Updated)\\s*:?|$)`, 'i');
        return (text.match(expression)?.[1] || '').trim();
      };
      return {
        region: context.region,
        invoice_href: link.getAttribute('href') || '',
        invoice_number: invoiceNumber,
        job_number: read('Job Number'),
        crew_name: read('Crew Name'),
        trade: read('Trade'),
        total_amount: read('Total'),
        invoice_status: read('Status'),
        invoice_date: read('Date Of Invoice'),
        approved_by: read('Approved By'),
        approved_on: read('Approved On'),
        source_updated_at: read('Last Updated'),
        card_text: text
      };
    })
  ), { region });
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

async function readRegionInvoices(page, region) {
  const rows = [];
  const paginator = page.locator('mat-paginator:visible').last();
  const next = paginator.getByRole('button', { name: 'Next page', exact: true });
  await setRowsPerPage(page, paginator);
  for (let pageNumber = 1; pageNumber <= 100; pageNumber += 1) {
    await waitForLoading(page);
    rows.push(...await readVisibleInvoices(page, region));
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
  await waitForRegionPicker(page);
  const regions = await regionNames(page);
  if (!regions.length) throw new Error('Blaze did not provide any production-invoice regions.');
  const rows = [];
  for (const region of regions) {
    await selectRegion(page, region);
    rows.push(...await readRegionInvoices(page, region));
  }
  const unique = new Map();
  for (const row of rows) {
    const sourceUrl = absoluteBlazeUrl(row.invoice_href);
    const invoiceId = invoiceIdFromUrl(sourceUrl);
    if (!invoiceId) continue;
    unique.set(invoiceId, { ...row, invoice_id: invoiceId, source_url: sourceUrl });
  }
  return { regions, rows: [...unique.values()] };
}

async function definitionValue(page, label) {
  return clean(await page.locator('dt').evaluateAll((terms, expected) => {
    const normalize = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
    const term = terms.find((candidate) => normalize(candidate.textContent).toLowerCase() === expected.toLowerCase());
    return term?.nextElementSibling?.textContent || '';
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
  const invoiceNumber = await definitionValue(page, 'Invoice Number') || source.invoice_number;
  const crewName = await definitionValue(page, 'Crew') || source.crew_name;
  const trade = await definitionValue(page, 'Trade') || source.trade;
  const status = await definitionValue(page, 'Status') || source.invoice_status;
  const invoiceDate = await definitionValue(page, 'Date Of Invoice') || source.invoice_date;
  const approvedBy = await definitionValue(page, 'Approved By') || source.approved_by;
  const approvedOn = await definitionValue(page, 'Approved On') || source.approved_on;
  const paidOn = await definitionValue(page, 'Paid On');
  const rows = await page.locator('table').filter({ has: page.getByRole('columnheader', { name: 'Item', exact: true }) }).first()
    .locator('tbody tr').evaluateAll((tableRows) => tableRows.map((row) => {
      const values = [...row.querySelectorAll('td')].map((cell) => cell.textContent?.replace(/\s+/g, ' ').trim() || '');
      return {
        item_name: values[0] || '',
        uom: values[1] || '',
        invoice_unit_price: values[2] || '',
        quantity: values[3] || '',
        original_quantity: values[4] || '',
        invoice_total: values[5] || '',
        note: values[6] || '',
        requirements: values[7] || ''
      };
    }));
  const invoice = {
    invoice_id: source.invoice_id,
    invoice_number: invoiceNumber,
    job_id: jobIdFromUrl(jobUrl),
    job_number: source.job_number || heading.split(':')[0],
    job_url: jobUrl,
    customer: heading.includes(':') ? heading.split(':').slice(1).join(':').trim() : '',
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
