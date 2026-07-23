import { exportOrders } from './orders-blaze.mjs';
import { createGoogleClients } from './google.mjs';
import { loadMasterPricing, publishOrders, recordOrdersFailure } from './orders-google.mjs';

const ORDERS_SPREADSHEET_ID = process.env.ORDERS_SPREADSHEET_ID || '1peF6ujpJGi_vugM7hanoL06KLNUC_tarAOoW2dW6QfQ';
const PRICING_SPREADSHEET_ID = process.env.PRICING_SPREADSHEET_ID || '1kF3oCkjkMzAqwohT-pYk2CSKkZ0C5hGx3aPee9XsIgY';

function environment() {
  const values = {
    blazeEmail: process.env.BLAZE_EMAIL || '',
    blazePassword: process.env.BLAZE_PASSWORD || '',
    blazeTotpSecret: process.env.BLAZE_TOTP_SECRET || '',
    googleCredentials: process.env.GOOGLE_SERVICE_ACCOUNT_JSON || ''
  };
  const missing = [];
  if (!values.blazeEmail) missing.push('BLAZE_EMAIL');
  if (!values.blazePassword) missing.push('BLAZE_PASSWORD');
  if (!values.googleCredentials) missing.push('GOOGLE_SERVICE_ACCOUNT_JSON');
  if (missing.length) throw new Error(`Missing required GitHub secrets: ${missing.join(', ')}.`);
  return values;
}

function runIdentifier() {
  return `ORD-${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}`;
}

async function main() {
  const credentials = environment();
  const runId = runIdentifier();
  const startedAt = new Date().toISOString();
  const { sheets } = createGoogleClients(credentials.googleCredentials);
  try {
    const [exportResult, pricingRows] = await Promise.all([
      exportOrders(credentials),
      loadMasterPricing(sheets, PRICING_SPREADSHEET_ID)
    ]);
    const result = await publishOrders(
      sheets, ORDERS_SPREADSHEET_ID, pricingRows, exportResult, runId, startedAt
    );
    console.log(`Orders import ${runId} completed: ${JSON.stringify(result)}`);
  } catch (error) {
    const message = error?.message || String(error);
    await recordOrdersFailure(sheets, ORDERS_SPREADSHEET_ID, runId, startedAt, message)
      .catch((logError) => console.error(`Unable to record Orders failure: ${logError.message}`));
    throw error;
  }
}

main().catch((error) => {
  console.error(error?.stack || error);
  process.exitCode = 1;
});

