import { chromium } from 'playwright';
import { ensureAuthenticated } from './blaze.mjs';
import { moneyNumber, stableId, stateCode } from './orders-compare.mjs';

export const PRODUCTION_ORDERS_URL = 'https://blaze-crm.com/64daaf06-5043-4886-b9a2-1362e47b0b65/production-dashboard/production-orders';
const ORDER_STAGES = ['WAITING TO ORDER', 'ORDERED', 'DELIVERED'];

function clean(value) {
  return String(value ?? '').trim();
}

function absoluteBlazeUrl(path) {
  return new URL(path, PRODUCTION_ORDERS_URL).href;
}

function jobIdFromUrl(url) {
  return clean(url).match(/job-dashboard\/([^/?#]+)/)?.[1] || '';
}

function orderIdFromUrl(url) {
  return clean(url).match(/\/orders\/([^/?#]+)/)?.[1] || '';
}

function stagePanel(page, stage) {
  return page.getByLabel(stage, { exact: true });
}

function visibleStageTable(page, stage) {
  return stagePanel(page, stage).locator('table:visible').first();
}

async function waitForOrdersTable(page, stage) {
  await visibleStageTable(page, stage).getByRole('columnheader', { name: 'Job Number', exact: true })
    .waitFor({ state: 'visible', timeout: 60000 });
  await page.locator('ng-http-loader .backdrop').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
}

async function regionNames(page) {
  const picker = page.getByRole('combobox').first();
  await picker.click();
  const names = (await page.getByRole('option').allTextContents()).map(clean).filter(Boolean);
  await picker.press('Escape').catch(() => {});
  return [...new Set(names)];
}

async function selectRegion(page, region) {
  const picker = page.getByRole('combobox').first();
  await picker.click();
  await page.getByRole('option', { name: region, exact: true }).click();
  await page.locator('ng-http-loader .backdrop').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
}

async function selectStage(page, stage) {
  const tab = page.getByRole('tab', { name: stage, exact: true });
  await tab.click();
  await waitForOrdersTable(page, stage);
}

async function readVisibleOrderRows(page, region, stage) {
  return visibleStageTable(page, stage).evaluate((table, context) => {
    const headers = [...table.querySelectorAll('thead th')].map((header) => (
      header.textContent?.replace(/\s+/g, ' ').trim().toLowerCase() || ''
    ));
    const column = (name) => headers.indexOf(name.toLowerCase());
    const value = (cells, name) => {
      const index = column(name);
      return index >= 0 ? cells[index]?.textContent?.replace(/\s+/g, ' ').trim() || '' : '';
    };
    return [...table.querySelectorAll('tbody tr')].map((row) => {
      const cells = [...row.querySelectorAll('td')];
      const link = row.querySelector('a[href*="job-dashboard"]');
      if (!link) return null;
      return {
        region: context.region,
        dashboard_stage: context.stage,
        supplier: value(cells, 'Supplier'),
        trade: value(cells, 'Trade'),
        job_number: value(cells, 'Job Number'),
        customer: value(cells, 'Customer'),
        job_href: link.getAttribute('href') || '',
        customer_phone: value(cells, 'Phone'),
        location: value(cells, 'Location'),
        supplier_notified_at: value(cells, 'Supplier Notified'),
        supplier_acknowledged_at: value(cells, 'Supplier Acknowledged'),
        material_status: value(cells, 'Material Status'),
        delivery_date: value(cells, 'Delivery Date')
      };
    }).filter(Boolean);
  }, { region, stage });
}

async function readAllStageRows(page, region, stage) {
  const rows = [];
  const table = visibleStageTable(page, stage);
  const paginator = table.locator('xpath=following::mat-paginator[1]');
  const pageSize = paginator.getByRole('combobox', { name: /Items per page/ });
  if (await pageSize.count()) {
    await pageSize.click();
    const twentyRows = page.getByRole('option', { name: '20', exact: true });
    if (await twentyRows.count()) await twentyRows.click();
  }
  const next = paginator.getByRole('button', { name: 'Next page', exact: true });
  for (let pageNumber = 1; pageNumber <= 250; pageNumber += 1) {
    rows.push(...await readVisibleOrderRows(page, region, stage));
    if (!(await next.count()) || await next.isDisabled()) break;
    const previousRows = await visibleStageTable(page, stage).locator('tbody').innerText();
    await next.click();
    await page.locator('ng-http-loader .backdrop').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
    await visibleStageTable(page, stage).locator('tbody').waitFor({ state: 'visible', timeout: 30000 });
    await page.waitForFunction(
      (previous) => {
        const tables = [...document.querySelectorAll('table')];
        const visible = tables.find((candidate) => (
          candidate.offsetParent !== null
          && /Job Number/i.test(candidate.querySelector('thead')?.innerText || '')
        ));
        const body = visible?.querySelector('tbody');
        return body && body.innerText !== previous;
      },
      previousRows,
      { timeout: 30000 }
    ).catch(() => {});
  }
  return rows;
}

async function discoverOrders(page) {
  await page.goto(PRODUCTION_ORDERS_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const regions = await regionNames(page);
  if (!regions.length) {
    throw new Error('Blaze did not provide any production-order regions.');
  }
  const discovered = [];
  for (const region of regions) {
    await selectRegion(page, region);
    for (const stage of ORDER_STAGES) {
      await selectStage(page, stage);
      const rows = await readAllStageRows(page, region, stage);
      discovered.push(...rows);
    }
  }
  const unique = new Map();
  for (const record of discovered) {
    const jobUrl = absoluteBlazeUrl(record.job_href);
    const key = [
      jobIdFromUrl(jobUrl), record.region, record.dashboard_stage,
      record.trade, record.supplier, record.delivery_date
    ].join('|');
    if (!unique.has(key)) unique.set(key, { ...record, job_url: jobUrl, job_id: jobIdFromUrl(jobUrl) });
  }
  return { regions, rows: [...unique.values()] };
}

function orderGroup(rows) {
  const grouped = new Map();
  for (const row of rows) {
    if (!grouped.has(row.job_id)) grouped.set(row.job_id, []);
    grouped.get(row.job_id).push(row);
  }
  return [...grouped.values()];
}

async function openOrdersTab(page, jobUrl) {
  await page.goto(jobUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const tab = page.getByRole('tab', { name: 'Orders', exact: true });
  await tab.waitFor({ state: 'visible', timeout: 60000 });
  await tab.click();
  await page.getByText(/Order Approval Status/i).waitFor({ state: 'visible', timeout: 60000 });
  await page.locator('ng-http-loader .backdrop').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
}

async function definitionAfterTerm(scope, label) {
  return clean(await scope.locator('dt').evaluateAll((terms, expected) => {
    const normalize = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
    const term = terms.find((candidate) => normalize(candidate.textContent) === expected);
    return term?.nextElementSibling?.textContent || '';
  }, label));
}

async function headingSections(page) {
  return page.locator('h6').evaluateAll((headings) => headings.map((heading) => ({
    trade: heading.textContent?.trim() || ''
  })).filter((item) => item.trade));
}

async function readRowsByHeader(page, headerPattern, lineType, state) {
  const tables = page.locator('table');
  const count = await tables.count();
  const output = [];
  for (let index = 0; index < count; index += 1) {
    const table = tables.nth(index);
    const header = clean(await table.locator('thead, tr').first().innerText().catch(() => ''));
    if (!headerPattern.test(header)) continue;
    const sectionHeading = clean(await table.locator('xpath=preceding::h6[1]').innerText().catch(() => ''));
    const rows = table.locator('tbody tr');
    const rowCount = await rows.count();
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      const cells = rows.nth(rowIndex).locator('td');
      const values = await cells.allTextContents();
      if (!values.length) continue;
      const material = lineType === 'material';
      const supplier = material && values.length >= 7 ? clean(values[0]) : '';
      const itemOffset = material && values.length >= 7 ? 1 : 0;
      const itemName = clean(values[itemOffset]);
      const quantity = moneyNumber(values[itemOffset + 1]);
      const uom = clean(values[itemOffset + 2]);
      const unitPrice = moneyNumber(values[itemOffset + 3]);
      const total = moneyNumber(values[itemOffset + 4]);
      if (!itemName || /^(total|base cost|office fee|sales tax|contract price|profit)/i.test(itemName)) continue;
      output.push({
        section_id: stableId(state.order_id, sectionHeading),
        line_type: lineType,
        item_name: itemName,
        supplier,
        crew_name: '',
        state: state.state,
        uom,
        quantity,
        blaze_unit_price: unitPrice,
        blaze_total: total,
        note: clean(values[itemOffset + 5])
      });
    }
  }
  return output;
}

async function readCrews(page) {
  const crews = await page.locator('dt').evaluateAll((terms) => terms
    .filter((term) => term.textContent?.replace(/\s+/g, ' ').trim() === 'Crew')
    .map((term) => term.nextElementSibling?.textContent?.replace(/\s+/g, ' ').trim() || '')
    .filter(Boolean));
  return [...new Set(crews)];
}

async function readOrderDetail(page, sourceRows) {
  const source = sourceRows[0];
  await openOrdersTab(page, source.job_url);
  const currentUrl = page.url();
  const orderId = orderIdFromUrl(currentUrl) || source.job_id;
  const createdAt = await definitionAfterTerm(page, 'Created On');
  if (!/(^|\/)26$|2026/.test(createdAt)) return null;
  const approvalStatus = await definitionAfterTerm(page, 'Approval Status');
  const crews = await readCrews(page);
  const state = stateCode(source.location, source.region);
  const base = { order_id: orderId, job_id: source.job_id, state };
  const materialLines = await readRowsByHeader(page, /^(?:Supplier\s+)?Product\s+QTY\s+UOM\s+Cost\s+Total/i, 'material', base);
  const laborLines = await readRowsByHeader(page, /^Description\s+QTY\s+UOM\s+Cost\s+Total/i, 'labor', base);
  const trades = (await headingSections(page)).map((section) => section.trade);
  const suppliers = [...new Set(materialLines.map((line) => line.supplier).filter(Boolean))];
  const deliveryDates = sourceRows.map((row) => row.delivery_date).filter(Boolean);
  const order = {
    order_id: orderId,
    order_number: orderId,
    job_id: source.job_id,
    job_number: source.job_number,
    job_url: source.job_url,
    customer: source.customer,
    customer_phone: source.customer_phone,
    location: source.location,
    region: source.region,
    supplier: suppliers.join(', '),
    crew_name: crews.join(', '),
    trade: [...new Set(trades)].join(', '),
    order_status: approvalStatus || source.dashboard_stage,
    order_created_at: createdAt,
    ordered_at: createdAt,
    delivery_date: deliveryDates.sort().at(-1) || '',
    supplier_notified_at: sourceRows.map((row) => row.supplier_notified_at).filter(Boolean).sort().at(-1) || '',
    supplier_acknowledged_at: sourceRows.map((row) => row.supplier_acknowledged_at).filter(Boolean).sort().at(-1) || '',
    material_status: sourceRows.map((row) => row.material_status).filter(Boolean).sort().at(-1) || ''
  };
  const lines = [...materialLines, ...laborLines].map((line, index) => ({
    ...line,
    line_id: stableId(orderId, line.line_type, line.section_id, index, line.item_name, line.supplier),
    order_id: orderId,
    job_id: source.job_id,
    imported_at: new Date().toISOString(),
    active: 'Yes'
  }));
  return { order, lines };
}

export async function exportOrders(credentials) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  try {
    await ensureAuthenticated(page, credentials);
    const discovery = await discoverOrders(page);
    const groups = orderGroup(discovery.rows);
    if (!groups.length) {
      throw new Error('No Blaze production orders were discovered; protected order data was not changed.');
    }
    const results = [];
    let cursor = 0;
    const workerCount = Math.min(3, groups.length);
    await Promise.all(Array.from({ length: workerCount }, async () => {
      const worker = await context.newPage();
      try {
        while (cursor < groups.length) {
          const current = cursor;
          cursor += 1;
          const group = groups[current];
          try {
            const detail = await readOrderDetail(worker, group);
            if (detail) results[current] = detail;
          } catch (error) {
            console.warn(`Orders detail unavailable for ${group[0]?.job_number || group[0]?.job_id}: ${error.message}`);
          }
          await worker.waitForTimeout(200);
        }
      } finally {
        await worker.close();
      }
    }));
    const records = results.filter(Boolean);
    if (!records.length) {
      throw new Error(`Blaze exposed ${groups.length} jobs, but none produced a valid 2026 order; protected order data was not changed.`);
    }
    return {
      regionsExpected: discovery.regions.length,
      regionsCompleted: discovery.regions.length,
      jobsDiscovered: groups.length,
      records
    };
  } finally {
    await context.close();
    await browser.close();
  }
}

