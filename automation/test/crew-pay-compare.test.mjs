import test from 'node:test';
import assert from 'node:assert/strict';
import {
  aggregateCrewInvoice,
  buildCrewRateAnalysis,
  compareCrewInvoiceLines
} from '../src/crew-pay-compare.mjs';

const invoice = {
  invoice_id: 'inv-1',
  job_id: 'job-1',
  region: 'Wisconsin - Aspen',
  crew_name: 'AJ Roofing',
  trade: 'ROOFING'
};
const orderLines = [{
  line_id: 'order-line-1',
  order_id: 'order-1',
  job_id: 'job-1',
  line_type: 'labor',
  item_name: 'Remove and replace roofing',
  uom: 'SQ',
  quantity: 20,
  blaze_unit_price: 150
}];
const pricing = [{
  elite_product_name: 'Remove and replace roofing labor',
  type: 'Labor',
  state: 'WI',
  uom: 'SQ',
  price: 150
}];

test('matches a crew invoice line to its job order and master labor rate', () => {
  const [line] = compareCrewInvoiceLines(invoice, [{
    item_name: 'REMOVE & REPLACE ROOFING',
    uom: 'SQ',
    quantity: 20,
    invoice_unit_price: 225,
    invoice_total: 4500
  }], orderLines, pricing);
  assert.equal(line.order_line_id, 'order-line-1');
  assert.equal(line.order_unit_price, 150);
  assert.equal(line.master_unit_price, 150);
  assert.equal(line.invoice_vs_order_variance, 1500);
  assert.equal(line.comparison_status, 'Order Variance');
});

test('keeps custom labor visible for review', () => {
  const [line] = compareCrewInvoiceLines(invoice, [{
    item_name: '*REMOVE EXTRA LAYER FELT',
    uom: 'SQ',
    quantity: 20,
    invoice_unit_price: 7,
    invoice_total: 140
  }], orderLines, pricing);
  assert.equal(line.custom_labor, 'Yes');
  assert.equal(line.comparison_status, 'Custom Labor');
});

test('aggregates invoice totals and highlights review work', () => {
  const lines = compareCrewInvoiceLines(invoice, [{
    item_name: 'REMOVE & REPLACE ROOFING',
    uom: 'SQ',
    quantity: 20,
    invoice_unit_price: 225,
    invoice_total: 4500
  }], orderLines, pricing);
  const result = aggregateCrewInvoice(invoice, lines);
  assert.equal(result.invoice_labor_total, 4500);
  assert.equal(result.order_variance, 1500);
  assert.equal(result.comparison_status, 'Order Variance');
});

test('detects inconsistent crew rates across jobs', () => {
  const invoices = [
    { ...invoice, invoice_id: 'inv-1', job_id: 'job-1' },
    { ...invoice, invoice_id: 'inv-2', job_id: 'job-2' }
  ];
  const rows = [
    { invoice_id: 'inv-1', item_name: 'Roof replacement', uom: 'SQ', invoice_unit_price: 150 },
    { invoice_id: 'inv-2', item_name: 'Roof replacement', uom: 'SQ', invoice_unit_price: 225 }
  ];
  const [analysis] = buildCrewRateAnalysis(invoices, rows);
  assert.equal(analysis.job_count, 2);
  assert.equal(analysis.rate_count, 2);
  assert.equal(analysis.inconsistent, 'Yes');
});
