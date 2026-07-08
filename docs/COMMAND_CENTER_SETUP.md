# Citadel Command Center Setup

## Current Rule

Command Center is now an overview page. It summarizes finished module data instead of owning editable workflow rows.

Liens feeds Command Center today. Future modules should feed similar summary signals after they are built.

## Current Inputs

Command Center currently derives:

- Open Alerts from active Liens alerts plus follow-ups.
- 60+ Days from Liens aging.
- No Payment from Liens payment fields.
- Balance at Risk from records needing attention.
- Focus items from the highest-priority live Liens records.

## What Not To Use

The old CommandMetrics and CommandFocus rows are legacy setup data. They are no longer used by the app.

If those rows still exist in Google Sheets, run this manual Apps Script utility:

testClearLegacyCommandCenterRows

## Safety Rule

Command Center should not write notes, alerts, follow-ups, or done states. Those belong to the module workspace, such as Liens.
