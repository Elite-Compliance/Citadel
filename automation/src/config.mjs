export const BLAZE_ORGANIZATION_ID = '64daaf06-5043-4886-b9a2-1362e47b0b65';
export const BLAZE_BASE_URL = `https://blaze-crm.com/${BLAZE_ORGANIZATION_ID}/tool-dashboard/reports-dashboard`;
export const RECEIVABLES_URL = `${BLAZE_BASE_URL}/receivables-report`;
export const DEPOSITS_URL = `${BLAZE_BASE_URL}/payment-report`;
export const CONTRACTORS_URL = `https://blaze-crm.com/${BLAZE_ORGANIZATION_ID}/dashboard/reports-dashboard/dynamic-reports/execute/ab6e0ea6-f955-4aad-8d33-797c9bc55faa`;
export const CONTRACTOR_DIRECTORY_URL = `https://blaze-crm.com/${BLAZE_ORGANIZATION_ID}/tool-dashboard/subcontractors-crews/subcontractors/list`;

export const LIEN_REPORTS = [
  { view: 'Receivables Aging', fileName: 'Receivables Aging', status: 'Receivable', master: true },
  { view: 'Receivables- Paid in Full w/ Lien', fileName: 'Paid In Full with Lien', status: 'Paid In Full with Lien' },
  { view: 'Receivables-Attorney', fileName: 'Attorney', status: 'Attorney' },
  { view: 'Receivables-Attorney-Customer', fileName: 'Attorney - Customer', status: 'Attorney - Customer' },
  { view: 'Receivables-Attorney-Elite', fileName: 'Attorney - Elite', status: 'Attorney - Elite' },
  { view: 'Receivables-Bankruptcy', fileName: 'Bankruptcy', status: 'Bankruptcy' },
  { view: 'Receivables-Collection Agency', fileName: 'Collection Agency', status: 'Collection Agency' },
  { view: 'Receivables-Foreclosure', fileName: 'Foreclosure', status: 'Foreclosure' },
  { view: 'Receivables-Lien', fileName: 'Lien', status: 'Lien' },
  { view: 'Receivables-Lien Released', fileName: 'Lien Released', status: 'Lien Released' },
  { view: 'Receivables-Small Claims', fileName: 'Small Claims', status: 'Small Claims' }
];

export const DEPOSIT_REPORT = {
  view: 'Deposits',
  fileName: 'Deposit Report'
};

export const PAYMENT_HEADERS = [
  'Region',
  'Sales Rep',
  'Job Number',
  'Job Link',
  'Customer',
  'Current Stage',
  'Stage Enter Date',
  'Payment Amount',
  'Payment Type',
  'Payment Source Type',
  'Payment Date'
];

export const SCHEDULE = {
  timezone: 'America/New_York',
  weekdays: [1, 2, 3, 4, 5],
  hours: [7, 12, 15]
};

export function requiredEnvironment() {
  return {
    blazeEmail: process.env.BLAZE_EMAIL || '',
    blazePassword: process.env.BLAZE_PASSWORD || '',
    blazeTotpSecret: process.env.BLAZE_TOTP_SECRET || '',
    googleCredentials: process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '',
    lienFolderId: process.env.LIEN_REPORTS_FOLDER_ID || '1XcllT_u0WP7H5Cr9zvw9G6NNcOUTYcTH',
    paymentSpreadsheetId: process.env.PAYMENT_SPREADSHEET_ID || '1peF6ujpJGi_vugM7hanoL06KLNUC_tarAOoW2dW6QfQ',
    appsScriptUrl: process.env.CITADEL_APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbzKIMMrIFdmS3xKUHzSzwR-Y-Z4FebDLBod1OWmORqDC-_J9pXH2azFVrONruv1djvIhw/exec',
    automationToken: process.env.CITADEL_AUTOMATION_TOKEN || ''
  };
}
