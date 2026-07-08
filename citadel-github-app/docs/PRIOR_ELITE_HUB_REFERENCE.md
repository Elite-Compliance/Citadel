# Prior Elite Hub Reference Map

These files are reference material only. Do not merge the old build directly into Citadel. Use the useful tab/header patterns to shape Citadel's clean module sheets and workflows.

## Useful Source References

### Operations Workbook

Strong references for Citadel pages:

- Contractors: CONTRACTORS, CONTRACTOR_CREWS, COMPLIANCE_DATA
- Fleet: VEHICLES, FLEET_SCORING
- Reviews: REVIEWS_INDIVIDUAL, REVIEWS_SUMMARY
- Registrations: PERMIT_REQUESTS, PERMIT_RESEARCH, Licenses, PERMIT_BANNERS
- Legal: LEGAL_CASES, Liens, ROC Complaints, BBB Complaints, AG Complaints, Lawsuits, Notices
- Inbox: FIELD_SUBMISSIONS, SUBMISSION_REPLIES
- Pricing/Expenses: Expense_Requests
- Region Health/Data Connections: Regions, Suppliers, Supplier_Contacts

### Config Workbook

Useful references:

- USERS: user display names, roles, permissions, active status
- REGIONS: region code/name/state/brands
- COMPLIANCE_RULES: compliance thresholds such as expiration windows
- PROJECT_DEFAULTS: registration/license categories
- AUDIT_LOG: model for protected activity history

### User Workspaces Workbook

Useful references:

- TASKS: personal/team task structure
- WIDGETS: saved links/scratchpad pattern
- SETTINGS: user preference storage

## Citadel Rule

Every Citadel module should separate source data from workspace data. Bot refreshes update source records only. Human notes, alerts, follow-ups, assignments, and audit history must live in protected workspace tabs and must not be overwritten by bot pulls.

## Best Reuse

Reuse field ideas and workflow concepts. Do not reuse old sheet IDs, old auth/session logic, old route structure, or mixed all-in-one backend style.
