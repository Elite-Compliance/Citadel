import assert from 'node:assert/strict';
import test from 'node:test';
import {
  aggregateOrder, compareOrderLines, normalizeUom, stateCode
} from '../src/orders-compare.mjs';

test('normalizes equivalent units of measure', () => {
  assert.equal(normalizeUom('ROLL'), 'RL');
  assert.equal(normalizeUom('RL'), 'RL');
  assert.equal(normalizeUom('Bundle'), 'BD');
});

test('extracts state from an order location', () => {
  assert.equal(stateCode('6728 Duneden Ave Solon, Ohio, 44139'), 'OH');
  assert.equal(stateCode('Indianapolis, IN 46201'), 'IN');
});

test('matches material lines and calculates overpayment', () => {
  const [line] = compareOrderLines([{
    line_type: 'material',
    item_name: 'IKO Dynasty (3 bdl/sq)',
    supplier: 'Richards Building Supply',
    state: 'OH',
    uom: 'SQ',
    quantity: 10,
    blaze_total: 1000
  }], [{
    elite_product_name: 'Dynasty (3 bdl/sq)',
    supplier: 'RBS',
    state: 'OH',
    uom: 'SQ',
    price: 93.75
  }]);
  assert.equal(line.master_unit_price, 93.75);
  assert.equal(line.master_total, 937.5);
  assert.equal(line.variance, 62.5);
  assert.equal(line.comparison_status, 'Overpayment');
});

test('preserves unmatched lines for review', () => {
  const [line] = compareOrderLines([{
    line_type: 'labor',
    item_name: 'Unknown labor task',
    state: 'OH',
    uom: 'EA',
    quantity: 1,
    blaze_total: 100
  }], []);
  assert.equal(line.comparison_status, 'Needs Review');
  const order = aggregateOrder({ order_id: 'order-1' }, [line]);
  assert.equal(order.comparison_status, 'Needs Review');
});

