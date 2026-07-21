import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import XLSX from 'xlsx';
import { validateContractorsExport } from '../src/contractors-validate.mjs';
import { preserveContractorContactDetails } from '../src/contractors-google.mjs';

test('retains one contractor and expands every embedded crew', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'citadel-contractors-test-'));
  const filePath = path.join(directory, 'Subcontractor Details.xlsx');
  try {
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet([{
      Subcontractor: 'VK Cifuentes Contractors',
      'General Liability Expiration Date': '2/27/2027',
      'Workers Compensation Expiration Date': '2/27/2027',
      Active: 'Yes',
      Crews: 'VK Cifuentes Contractors Crew #2(ACTIVE), VK Cifuentes Contractors(ACTIVE)'
    }]);
    XLSX.utils.book_append_sheet(workbook, sheet, 'Report');
    XLSX.writeFile(workbook, filePath);

    const result = validateContractorsExport(filePath, new Date('2026-07-20T12:00:00Z'));
    assert.equal(result.contractorCount, 1);
    assert.equal(result.crewCount, 2);
    assert.deepEqual(result.crewValues.slice(1).map((row) => row[3]), [
      'VK Cifuentes Contractors Crew #2',
      'VK Cifuentes Contractors'
    ]);
    assert.equal(result.unparsedCrews, 0);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('extracts crew regions and maps optional contractor contact columns', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'citadel-contractors-test-'));
  const filePath = path.join(directory, 'Subcontractor Details.xlsx');
  try {
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet([{
      Subcontractor: 'BK Seamless Gutters',
      'General Liability Expiration Date': '2/12/2027',
      'Workers Compensation Expiration Date': '2/12/2027',
      Active: 'Yes',
      Crews: 'BK Seamless Gutters (Wisconsin)(ACTIVE), BK Seamless Gutters North (Minnesota)(INACTIVE)',
      'Phone Number': '555-0100',
      'Email Address': 'office@example.com',
      'Business Address': '100 Main St'
    }]);
    XLSX.utils.book_append_sheet(workbook, sheet, 'Report');
    XLSX.writeFile(workbook, filePath);

    const result = validateContractorsExport(filePath, new Date('2026-07-20T12:00:00Z'), [{
      name: 'BK Seamless Gutters',
      phone: '(555) 010-0200',
      email: 'directory@example.com',
      address: '200 Directory Ave',
      regions: ['Wisconsin - Aspen', 'Minnesota - Aspen']
    }]);
    const contractor = result.contractorValues[1];
    assert.equal(contractor[2], '(555) 010-0200');
    assert.equal(contractor[3], 'directory@example.com');
    assert.equal(contractor[4], 'Wisconsin - Aspen, Minnesota - Aspen, Wisconsin, Minnesota');
    assert.equal(contractor[10], '200 Directory Ave');
    assert.deepEqual(result.crewValues.slice(1).map((row) => [row[3], row[5]]), [
      ['BK Seamless Gutters', 'Wisconsin'],
      ['BK Seamless Gutters North', 'Minnesota']
    ]);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('preserves protected contact details when the Blaze export leaves them blank', () => {
  const headers = ['contractor_id', 'Contractor', 'Phone', 'Email', 'Regions', 'Address'];
  const incoming = [headers, ['contractor-1', 'Example Contractor', '', '', 'Wisconsin', '']];
  const existing = [headers, ['contractor-1', 'Example Contractor', '555-0100', 'office@example.com', 'Minnesota', '100 Main St']];
  const result = preserveContractorContactDetails(incoming, existing);
  assert.deepEqual(result[1], [
    'contractor-1', 'Example Contractor', '555-0100', 'office@example.com', 'Minnesota, Wisconsin', '100 Main St'
  ]);
});

test('removes an invalid region block left by a prior Blaze page scrape', () => {
  const headers = ['contractor_id', 'Contractor', 'Phone', 'Email', 'Regions', 'Address'];
  const incoming = [headers, ['contractor-1', 'Example Contractor', '', '', 'Wisconsin - Aspen', '']];
  const existing = [headers, ['contractor-1', 'Example Contractor', '', '', 'Active\nCancel\nSave, All regions', '']];
  const result = preserveContractorContactDetails(incoming, existing);
  assert.equal(result[1][4], 'Wisconsin - Aspen');
});

