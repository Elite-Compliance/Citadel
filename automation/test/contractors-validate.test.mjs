import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import XLSX from 'xlsx';
import { validateContractorsExport } from '../src/contractors-validate.mjs';

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
