# Citadel Data Contract

## Core Rule

Each module page owns its detailed source data and its protected Citadel workflow data. Command Center summarizes finished module data; it does not own protected notes, alerts, or follow-ups.

## Current Live Module

Liens is live now.

Liens source tabs:
- LienRecords
- LienMetrics

Liens protected workflow tabs:
- LienNotes
- LienAlerts
- LienFollowUps

The source import can refresh Blaze/report data without deleting protected Citadel workflow rows.

## Planned Module Tabs

Modules will be added one page at a time:
- Collections
- Registrations
- Contractors
- FleetVehicles
- FleetDrivers
- Tasks
- Legal
- Reviews
- Pricing
- DataConnections

## Required Pattern

Every data row needs a stable ID column. Do not use row numbers as IDs.

Examples:
- lien_id
- collection_id
- registration_id
- contractor_id

## Source vs Workflow Fields

Imported/source fields must stay separate from Citadel workflow fields.

Source examples:
- job_number
- job_link
- customer
- region
- balance
- source_status
- source_updated_at

Workflow examples:
- note_text
- alert_text
- followup_text
- owner
- priority
- due_date
- status
- active

## Command Center Summary Contract

Command Center reads summarized module state from loaded modules. Today it summarizes Liens. Later modules should expose the same kind of summary without letting Command Center mutate module-owned workflow data.

## Safety Rules

- Do not rename sheet tabs after wiring.
- Do not rename headers after wiring.
- Add new fields to the right instead of inserting into the middle when possible.
- Keep formulas out of app-owned workflow columns.
- Imports may replace source rows, but must not clear notes, alerts, or follow-ups.
- Test read first, then test writeback on one row, then enable writes broadly.
