# Apps Script Setup for Citadel

## What This Does

This script powers Citadel module data. Liens is the first live module.

Current public endpoints:

- getLiens
- saveLienNote
- saveLienAlert
- saveLienFollowUp
- importLienStatusReports

Manual Apps Script utilities:

- testImportLienStatusReports
- testGetLiens
- testClearLegacyCommandCenterRows

## Steps

1. Open the Citadel Backend Apps Script project.
2. Replace Code.gs with the current apps-script/Code.gs contents.
3. Click Save.
4. Run testGetLiens once from Apps Script.
5. Approve the script permissions when Google asks.
6. Confirm the execution log shows Liens records, notes, alerts, and follow-ups.

## Deploy As Web App

After testGetLiens works:

1. Click Deploy > New deployment.
2. Select Web app.
3. Description: Citadel Backend API.
4. Execute as: Me.
5. Who has access: choose the narrowest option that works for testing.
6. Click Deploy.
7. Copy the Web app URL into the app if it changes.

## Test URL Format

After deployment, this should return JSON in the browser:

YOUR_WEB_APP_URL?action=getLiens

## Legacy Cleanup

If the old CommandMetrics and CommandFocus rows are still in the old Command Center workbook, run this manually inside Apps Script:

testClearLegacyCommandCenterRows

That clears data rows only. It leaves the headers and sheet tabs intact.

## Important Safety Notes

- Do not rename wired sheet tabs.
- Do not rename column headers after wiring.
- Keep stable IDs such as lien_id.
- Imports may replace source rows, but must not clear notes, alerts, or follow-ups.
