const CITADEL_VERSION='2.1.2';
const SPREADSHEETS = {
  commandCenter: '1zouXOWT2OIH-B74I0CAu1Ox-80s5bj2gDG2t_R2qGII',
  liens: '1X53Or2M0ORxtSAgpE9edH1cTo11Q8FNrXpytsWFcLLQ',
  contractors: '1qsMCA_kC129S4FbbMiLt1X9_VJlkwPRqGxx0WRrPuTg',
  pricing: '1kF3oCkjkMzAqwohT-pYk2CSKkZ0C5hGx3aPee9XsIgY',
  reviews: '1EjRpoie4MP8eE4SmYi0xqXIbGavH3ffz5DTb-MUdE1U',
  fleet: '1cUbzbYW_7UCwD4oD9_pSWZBLDZYF3VpvqBijUOMBhuo',
  registrations: '1_vi1q6qUu821TiUgMtelsF4ya2EBsXlPIlt-COEb6X8',
  payments: '1peF6ujpJGi_vugM7hanoL06KLNUC_tarAOoW2dW6QfQ',
  suppliers: '1dKaiRkQNb3C1T4ajWYZZ0v72Pk6T9jaw7lmmJFl4cTA'
};
const LIEN_STATUS_REPORTS_FOLDER_ID = '1XcllT_u0WP7H5Cr9zvw9G6NNcOUTYcTH';
const LIEN_AUTOMATION_TIMEZONE = 'America/New_York';
const LIEN_AUTOMATION_SCHEDULE = ['7:00 AM', '12:00 PM', '5:00 PM'];
const LIEN_AUTOMATION_WEEKDAYS = 'Monday-Friday';
const LIEN_MASTER_REPORT_NAME = 'Receivables Aging';
const LIEN_REPORT_MANIFEST = [
  { name: 'Receivables Aging', status: 'Receivable', master: true, priority: 999 },
  { name: 'Paid In Full with Lien', status: 'Paid In Full with Lien', priority: 100 },
  { name: 'Attorney', status: 'Attorney', priority: 50 },
  { name: 'Attorney - Customer', status: 'Attorney - Customer', priority: 30 },
  { name: 'Attorney - Elite', status: 'Attorney - Elite', priority: 40 },
  { name: 'Bankruptcy', status: 'Bankruptcy', priority: 10 },
  { name: 'Collection Agency', status: 'Collection Agency', priority: 60 },
  { name: 'Foreclosure', status: 'Foreclosure', priority: 20 },
  { name: 'Lien', status: 'Lien', priority: 80 },
  { name: 'Lien Released', status: 'Lien Released', priority: 90 },
  { name: 'Small Claims', status: 'Small Claims', priority: 70 }
];
const REQUIRED_LIEN_RECORD_COLUMNS = ['job_number', 'blaze_job_id', 'blaze_url', 'contracted_amount', 'days_past_due', 'first_invoice_date', 'latest_invoice_date', 'invoice_count', 'no_payment_received', 'payment_received', 'last_payment_date', 'payment_status', 'source_statuses', 'source_report_count', 'source_current_stage', 'source_last_note', 'profit_percentage', 'import_batch_id', 'source_row_number', 'source_removed_at'];
const SHEETS = {
  commandMetrics: 'CommandMetrics',
  commandFocus: 'CommandFocus',
  lienRecords: 'LienRecords',
  lienNotes: 'LienNotes',
  lienAlerts: 'LienAlerts',
  lienFollowUps: 'LienFollowUps',
  lienMetrics: 'LienMetrics',
  lienImportLog: 'LienImportLog',
  lienAutomationLog: 'LienAutomationLog',
  lienReportMemberships: 'LienReportMemberships',
  contractorRecords: 'ContractorRecords',
  contractorNotes: 'ContractorNotes',
  contractorAlerts: 'ContractorAlerts',
  contractorFollowUps: 'ContractorFollowUps',
  contractorMetrics: 'ContractorMetrics',
  reviewRecords: 'ReviewRecords',
  reviewNotes: 'ReviewNotes',
  reviewAlerts: 'ReviewAlerts',
  reviewFollowUps: 'ReviewFollowUps',
  reviewMetrics: 'ReviewMetrics',
  fleet: 'Fleet',
  fleetVehicles: 'FleetVehicles',
  fleetDrivers: 'FleetDrivers',
  fleetNotes: 'FleetNotes',
  fleetAlerts: 'FleetAlerts',
  fleetFollowUps: 'FleetFollowUps',
  fleetMetrics: 'FleetMetrics',
  registrationRequests: 'RegistrationRequests',
  activeRegistrations: 'ActiveRegistrations',
  registrationNotes: 'RegistrationNotes',
  registrationAlerts: 'RegistrationAlerts',
  registrationFollowUps: 'RegistrationFollowUps',
  registrationBanners: 'RegistrationBanners',
  collectionRecords: 'CollectionRecords',
  collectionNotes: 'CollectionNotes',
  collectionAlerts: 'CollectionAlerts',
  businessContacts: 'BusinessContacts',
  collectionAttorneys: 'CollectionAttorneys',
  supplierAccounts: 'SupplierAccounts',
  supplierContacts: 'SupplierContacts',
  supplierDocuments: 'SupplierDocuments',
  supplierNotes: 'SupplierNotes',
  supplierAlerts: 'SupplierAlerts',
  supplierAudit: 'SupplierAudit',
  paymentImport: 'PaymentImport',
  paymentTransactions: 'Payments',
  paymentSummary: 'PaymentSummary',
  paymentImportLog: 'PaymentImportLog'
};

const CONTRACTOR_RECORD_HEADERS = ['Contractor', 'Phone', 'Email', 'Regions', 'Risk', 'Documents', 'GL Expiry', 'WC Expiry', 'Next Action', 'Address'];
const CONTRACTOR_NOTE_HEADERS = ['note_id', 'contractor_id', 'note_date', 'note_by', 'note_type', 'note_text', 'follow_up_date', 'active'];
const CONTRACTOR_ALERT_HEADERS = ['alert_id', 'contractor_id', 'alert_type', 'alert_text', 'priority', 'owner', 'due_date', 'status', 'created_date', 'resolved_date', 'active'];
const CONTRACTOR_FOLLOWUP_HEADERS = ['followup_id', 'contractor_id', 'assigned_to', 'due_date', 'followup_type', 'followup_text', 'status', 'created_by', 'created_date', 'completed_date', 'active'];
const CONTRACTOR_METRIC_HEADERS = ['metric_key', 'label', 'value', 'note', 'tone', 'sort_order'];
const REVIEW_RECORD_HEADERS = ['monitor', 'platform', 'name', 'rating', 'review_title', 'review_text', 'review_date', 'review_url', 'created_at'];
const REVIEW_NOTE_HEADERS = ['note_id', 'review_id', 'note_date', 'note_by', 'note_type', 'note_text', 'follow_up_date', 'active'];
const REVIEW_ALERT_HEADERS = ['alert_id', 'review_id', 'alert_type', 'alert_text', 'priority', 'owner', 'due_date', 'status', 'created_date', 'resolved_date', 'active'];
const REVIEW_FOLLOWUP_HEADERS = ['followup_id', 'review_id', 'assigned_to', 'due_date', 'followup_type', 'followup_text', 'status', 'created_by', 'created_date', 'completed_date', 'active'];
const REVIEW_METRIC_HEADERS = ['metric_key', 'label', 'value', 'note', 'tone', 'sort_order'];
const FLEET_SOURCE_HEADERS = ['Device', 'Device Group', 'First Name', 'Last Name', 'Current Driver', 'Work time', 'Current Activity', 'In Privacy Mode', 'Last Stop Address', 'Last Stop Zone Types', 'Current Odometer', 'Current Engine Hours', 'Active from', 'Active to', 'Is Archived (Historical)', 'Plan', 'Device Type', 'Firmware Version', 'Serial No.', 'License Plate', 'License State/Province', 'VIN', 'Time Zone', 'Device Comment', 'Download Status', 'Last Trip', 'Last Communication Date'];
const FLEET_VEHICLE_HEADERS = ['vehicle_id', 'unit_number', 'device_group', 'region', 'status', 'service_status', 'registration_status', 'vin', 'plate', 'license_state', 'make', 'model', 'year', 'assigned_driver', 'current_activity', 'last_stop_address', 'current_odometer', 'current_engine_hours', 'active_from', 'active_to', 'is_archived', 'plan', 'device_type', 'firmware_version', 'serial_no', 'time_zone', 'device_comment', 'download_status', 'last_trip', 'last_communication_date', 'last_updated'];
const FLEET_DRIVER_HEADERS = ['driver_id', 'driver_name', 'first_name', 'last_name', 'region', 'status', 'phone', 'email', 'license_expiry', 'medical_card_expiry', 'insurance_expiry', 'assigned_vehicle', 'current_activity', 'work_time', 'last_stop_address', 'next_action', 'last_updated'];
const FLEET_NOTE_HEADERS = ['note_id', 'fleet_record_id', 'record_type', 'note_date', 'note_by', 'note_type', 'note_text', 'follow_up_date', 'active'];
const FLEET_ALERT_HEADERS = ['alert_id', 'fleet_record_id', 'record_type', 'alert_type', 'alert_text', 'priority', 'owner', 'due_date', 'status', 'created_date', 'resolved_date', 'active'];
const FLEET_FOLLOWUP_HEADERS = ['followup_id', 'fleet_record_id', 'record_type', 'assigned_to', 'due_date', 'followup_type', 'followup_text', 'status', 'created_by', 'created_date', 'completed_date', 'active'];
const FLEET_METRIC_HEADERS = ['metric_key', 'label', 'value', 'note', 'tone', 'sort_order'];
const REGISTRATION_REQUEST_HEADERS = ['request_id', 'submitted_at', 'requestor_name', 'brand', 'date_submitted', 'region', 'state', 'license_scope', 'pure', 'jurisdiction', 'requirements', 'website', 'phone', 'email', 'notes', 'status', 'stage', 'assigned_to', 'status_updated_by', 'status_updated_at', 'completed_date', 'active', 'source_system', 'source_record_id', 'reopened_from_request_id', 'research_verified_at', 'research_verified_by', 'received_date', 'researched_date', 'submitted_license_date', 'license_received_date', 'archived_date', 'renewal_due_date', 'renewal_status', 'renewal_owner', 'renewal_notes', 'renewal_started_date', 'renewal_submitted_date', 'renewal_received_date', 'archive_reason', 'license_type_name', 'license_number', 'expiration', 'qualifier', 'continuing_education_hours', 'elite_owned', 'expires_soon_flag', 'expired_flag', 'license_category', 'license_action', 'bond_type', 'coi_type', 'payment_status', 'payment_method', 'documents_included', 'submission_method', 'research_notes', 'received_license_name', 'received_license_state', 'received_license_type', 'ce_due_date', 'ce_reminder_days', 'ce_reminder_date'];
const ACTIVE_REGISTRATION_HEADERS = ['registration_id', 'request_id', 'brand', 'state', 'license_scope', 'region', 'jurisdiction', 'license_name', 'license_type_name', 'number', 'license_number', 'expiration', 'qualifier', 'type', 'pure', 'continuing_education_hours', 'elite_owned', 'expires_soon_flag', 'expired_flag', 'status', 'stage', 'source_system', 'source_record_id', 'created_at', 'last_updated', 'archived_date', 'active', 'requestor_name', 'website', 'phone', 'email', 'requirements', 'notes', 'date_submitted', 'received_date', 'researched_date', 'submitted_license_date', 'license_received_date', 'completed_date', 'received_license_name', 'received_license_state', 'received_license_type', 'ce_due_date', 'ce_reminder_days', 'ce_reminder_date', 'renewal_due_date', 'renewal_status', 'renewal_owner', 'renewal_notes', 'renewal_started_date', 'renewal_submitted_date', 'renewal_received_date', 'archive_reason', 'license_category', 'license_action', 'bond_type', 'coi_type', 'payment_status', 'payment_method', 'documents_included', 'submission_method', 'research_notes', 'status_updated_by', 'status_updated_at'];
const REGISTRATION_NOTE_HEADERS = ['note_id', 'request_id', 'registration_id', 'note_date', 'note_by', 'note_type', 'note_text', 'follow_up_date', 'active'];
const REGISTRATION_ALERT_HEADERS = ['alert_id', 'request_id', 'registration_id', 'alert_type', 'alert_text', 'priority', 'owner', 'due_date', 'status', 'created_date', 'resolved_date', 'active'];
const REGISTRATION_FOLLOWUP_HEADERS = ['followup_id', 'request_id', 'registration_id', 'assigned_to', 'due_date', 'followup_type', 'followup_text', 'status', 'created_by', 'created_date', 'completed_date', 'active'];
const REGISTRATION_BANNER_HEADERS = ['banner_id', 'regions', 'message', 'status', 'active_at', 'active_by', 'removed_at', 'removed_by', 'active'];
const SUPPLIER_ACCOUNT_HEADERS = ['supplier_id', 'supplier_code', 'supplier_name', 'supplier_type', 'priority', 'status', 'account_name', 'customer_number', 'account_number', 'region', 'branch_number', 'branch_name', 'branch_address_1', 'branch_address_2', 'branch_city', 'branch_state', 'branch_zip', 'branch_phone', 'orders_email', 'website', 'portal_url', 'portal_username', 'signed_agreement_status', 'agreement_date', 'agreement_expiration_date', 'renewal_date', 'auto_renews', 'renewal_notice_days', 'payment_terms', 'current_balance', 'credit_limit', 'available_credit', 'credit_status', 'purchasing_status', 'tax_exempt_status', 'w9_status', 'vendor_application_status', 'resale_certificate_status', 'insurance_required', 'insurance_status', 'insurance_expiration_date', 'compliance_status', 'compliance_review_date', 'next_review_date', 'default_ship_to', 'freight_terms', 'delivery_terms', 'minimum_order', 'account_notes', 'source_file', 'created_at', 'created_by', 'updated_at', 'updated_by', 'active'];
const SUPPLIER_CONTACT_HEADERS = ['contact_id', 'supplier_id', 'role_type', 'contact_name', 'title_department', 'email', 'secondary_email', 'office_phone', 'secondary_phone', 'extension', 'fax', 'branch_number', 'region', 'preferred_contact_method', 'notes', 'active', 'created_at', 'created_by', 'updated_at', 'updated_by'];
const SUPPLIER_DOCUMENT_HEADERS = ['document_id', 'supplier_id', 'document_type', 'status', 'issue_date', 'expiration_date', 'renewal_date', 'document_url', 'notes', 'created_at', 'created_by', 'updated_at', 'updated_by'];
const SUPPLIER_NOTE_HEADERS = ['note_id', 'supplier_id', 'note_text', 'created_at', 'created_by'];
const SUPPLIER_ALERT_HEADERS = ['alert_id', 'supplier_id', 'alert_text', 'due_date', 'status', 'created_at', 'created_by', 'resolved_at', 'resolved_by'];
const SUPPLIER_AUDIT_HEADERS = ['audit_id', 'supplier_id', 'action', 'field_name', 'prior_value', 'new_value', 'changed_at', 'changed_by'];

const COLLECTION_RECORD_HEADERS = ['collection_id', 'lien_id', 'assigned_attorney_id', 'assigned_attorney_name', 'collection_agency', 'date_sent_to_agency', 'amount_outstanding', 'amount_collected', 'amount_we_receive', 'date_received', 'tracking_status', 'created_at', 'updated_by', 'last_updated', 'active'];
const COLLECTION_NOTE_HEADERS = ['note_id', 'collection_id', 'note_date', 'note_by', 'note_type', 'note_text', 'active'];
const COLLECTION_ALERT_HEADERS = ['alert_id', 'collection_id', 'alert_type', 'alert_text', 'priority', 'owner', 'due_date', 'status', 'created_date', 'resolved_date', 'active'];
const BUSINESS_CONTACT_HEADERS = ['contact_id', 'contact_type', 'organization_name', 'contact_name', 'job_title', 'department', 'primary_email', 'secondary_email', 'office_phone', 'phone_extension', 'mobile_phone', 'fax', 'website', 'preferred_contact_method', 'business_address_1', 'business_address_2', 'business_city', 'business_state', 'business_zip', 'business_country', 'mailing_same_as_business', 'mailing_address_1', 'mailing_address_2', 'mailing_city', 'mailing_state', 'mailing_zip', 'mailing_country', 'notes', 'created_at', 'updated_at', 'active'];
const COLLECTION_ATTORNEY_HEADERS = ['attorney_id', 'firm_name', 'office_name', 'attorney_name', 'job_title', 'bar_number', 'licensed_states', 'practice_areas', 'primary_email', 'secondary_email', 'office_phone', 'phone_extension', 'mobile_phone', 'fax', 'website', 'preferred_contact_method', 'business_address_1', 'business_address_2', 'business_city', 'business_state', 'business_zip', 'business_country', 'mailing_same_as_business', 'mailing_address_1', 'mailing_address_2', 'mailing_city', 'mailing_state', 'mailing_zip', 'mailing_country', 'notes', 'created_at', 'updated_at', 'active'];
const PAYMENT_IMPORT_HEADERS = ['Region', 'Sales Rep', 'Job Number', 'Job Link', 'Customer', 'Current Stage', 'Stage Enter Date', 'Payment Amount', 'Payment Type', 'Payment Source Type', 'Payment Date'];
const PAYMENT_TRANSACTION_HEADERS = ['payment_key', 'blaze_job_id', 'job_number', 'job_link', 'region', 'sales_rep', 'customer', 'blaze_stage', 'stage_enter_date', 'days_in_current_stage', 'payment_amount', 'payment_type', 'payment_method', 'payment_date', 'source_row_hash', 'source_row_number', 'duplicate_group_size', 'duplicate_sequence', 'duplicate_status', 'included_in_summary', 'is_reversal', 'missing_payment_method', 'stage_normalized', 'outlier_review', 'validation_error', 'imported_at', 'active'];
const PAYMENT_SUMMARY_HEADERS = ['blaze_job_id', 'job_number', 'job_link', 'region', 'sales_rep', 'customer', 'blaze_stage', 'stage_enter_date', 'days_in_current_stage', 'gross_payments', 'net_payments_received', 'latest_payment_date', 'payment_count', 'latest_payment_type', 'latest_payment_method', 'reversal_count', 'reversal_amount', 'has_reversal', 'net_payment_zero', 'outlier_review', 'last_imported_at', 'active'];
const PAYMENT_IMPORT_LOG_HEADERS = ['import_id', 'imported_at', 'imported_by', 'source_sheet', 'source_label', 'source_rows', 'unique_rows', 'duplicate_rows', 'negative_rows', 'missing_payment_method_rows', 'validation_error_rows', 'zero_net_jobs', 'outlier_rows', 'status', 'notes'];
const LIEN_IMPORT_LOG_HEADERS = ['import_id', 'started_at', 'completed_at', 'imported_by', 'source_folder_id', 'report_count', 'source_rows', 'master_rows', 'active_records', 'inactive_records', 'membership_rows', 'multi_status_jobs', 'job_number_collision_count', 'empty_report_count', 'status', 'warnings', 'error'];
const LIEN_AUTOMATION_LOG_HEADERS = ['run_id', 'started_at', 'completed_at', 'status', 'reports_expected', 'reports_exported', 'liens_import_id', 'payment_import_id', 'message', 'source'];
const LIEN_REPORT_MEMBERSHIP_HEADERS = ['import_id', 'blaze_job_id', 'lien_id', 'job_number', 'report_name', 'report_status', 'source_file_id', 'source_sheet', 'source_row_number', 'imported_at', 'active'];

function doGet(e) {
  const action = getParam_(e, 'action') || 'getLiens';

  try {
    if (action === 'getLiens') {
      return output_(e, { ok: true, data: getLiens(), version: CITADEL_VERSION });
    }

    if (action === 'getLienPayments') {
      return output_(e, { ok: true, data: getLienPayments(paramsToRegistrationPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'getPaymentImportStatus') {
      return output_(e, { ok: true, data: getPaymentImportStatus(), version: CITADEL_VERSION });
    }

    if (action === 'runPaymentImport') {
      return output_(e, {
        ok: true,
        data: runPaymentImport({
          imported_by: getParam_(e, 'imported_by') || 'Citadel user',
          source_label: getParam_(e, 'source_label') || ''
        }),
        version: CITADEL_VERSION
      });
    }

    if (action === 'getLienImportStatus') {
      return output_(e, { ok: true, data: getLienImportStatus(), version: CITADEL_VERSION });
    }

    if (action === 'runLienImport') {
      return output_(e, {
        ok: true,
        data: runLienImport({
          imported_by: getParam_(e, 'imported_by') || 'Citadel user'
        }),
        version: CITADEL_VERSION
      });
    }

    if (action === 'getContractors') {
      return output_(e, { ok: true, data: getContractors(), version: CITADEL_VERSION });
    }

    if (action === 'getPricing') {
      return output_(e, { ok: true, data: getPricing(e), version: CITADEL_VERSION });
    }

    if (action === 'getReviews') {
      return output_(e, { ok: true, data: getReviews(), version: CITADEL_VERSION });
    }

    if (action === 'getFleet') {
      return output_(e, { ok: true, data: getFleet(), version: CITADEL_VERSION });
    }

    if (action === 'getRegistrations') {
      return output_(e, { ok: true, data: getRegistrations(), version: CITADEL_VERSION });
    }

    if (action === 'getSuppliers') {
      return output_(e, { ok: true, data: getSuppliers(), version: CITADEL_VERSION });
    }

    if (action === 'saveSupplierAccount') {
      return output_(e, { ok: true, data: saveSupplierAccount(paramsToRegistrationPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'saveSupplierContact') {
      return output_(e, { ok: true, data: saveSupplierContact(paramsToRegistrationPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'saveSupplierDocument') {
      return output_(e, { ok: true, data: saveSupplierDocument(paramsToRegistrationPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'saveSupplierNote') {
      return output_(e, { ok: true, data: saveSupplierNote(paramsToRegistrationPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'saveSupplierAlert') {
      return output_(e, { ok: true, data: saveSupplierAlert(paramsToRegistrationPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'getCollections') {
      return output_(e, { ok: true, data: getCollections(), version: CITADEL_VERSION });
    }

    if (action === 'saveCollectionRecord') {
      return output_(e, { ok: true, data: saveCollectionRecord(paramsToRegistrationPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'saveCollectionNote') {
      return output_(e, { ok: true, data: saveCollectionNote(paramsToRegistrationPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'saveCollectionAlert') {
      return output_(e, { ok: true, data: saveCollectionAlert(paramsToRegistrationPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'saveBusinessContact') {
      return output_(e, { ok: true, data: saveBusinessContact(paramsToRegistrationPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'saveCollectionAttorney') …35309 tokens truncated…w, status, days) {
  const age = Number(days || getField_(row, ['days_past_due', 'days past due', 'aging_days', 'age', 'days']) || 0);
  if (age >= 120) return 'Critical';
  if (age >= 90) return 'High';
  if (age >= 60) return 'Review';
  if (age >= 30) return 'Monitor';
  if (/attorney|legal/i.test(String(status || ''))) return 'Review';
  return 'Monitor';
}



function getField_(row, names) {
  const normalized = {};
  Object.keys(row || {}).forEach(function(key) {
    normalized[String(key).trim().toLowerCase().replace(/[^a-z0-9]+/g, '_')] = row[key];
  });
  for (let i = 0; i < names.length; i++) {
    const key = String(names[i]).trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
    if (Object.prototype.hasOwnProperty.call(normalized, key) && normalized[key] !== '') return normalized[key];
  }
  return '';
}

function sameName_(left, right) {
  return String(left || '').trim().toLowerCase() === String(right || '').trim().toLowerCase();
}


function inspectLienStatusReports() {
  const status = getLienImportStatus();
  Logger.log(JSON.stringify(status, null, 2));
  return status;
}

function testInspectLienStatusReports() {
  inspectLienStatusReports();
}

function testImportLienStatusReports() {
  Logger.log(JSON.stringify(importLienStatusReports(), null, 2));
}

function saveLienNote(payload) {
  if (!payload || !payload.lien_id) throw new Error('lien_id is required.');
  const record = {
    note_id: payload.note_id || makeId_('note'),
    lien_id: payload.lien_id,
    note_date: payload.note_date || today_(),
    note_by: payload.note_by || 'Amanda',
    note_type: payload.note_type || 'General',
    note_text: payload.note_text || '',
    follow_up_date: payload.follow_up_date || '',
    active: true
  };
  appendObject_(SPREADSHEETS.liens, SHEETS.lienNotes, record);
  return record;
}

function saveLienAlert(payload) {
  if (!payload || !payload.lien_id) throw new Error('lien_id is required.');
  const record = {
    alert_id: payload.alert_id || makeId_('alert'),
    lien_id: payload.lien_id,
    alert_type: payload.alert_type || 'Follow-up',
    alert_text: payload.alert_text || '',
    priority: payload.priority || 'High',
    owner: payload.owner || 'Carlynn',
    due_date: payload.due_date || today_(),
    status: payload.status || 'Open',
    created_date: payload.created_date || today_(),
    resolved_date: payload.resolved_date || '',
    active: true
  };
  appendObject_(SPREADSHEETS.liens, SHEETS.lienAlerts, record);
  return record;
}

function saveLienFollowUp(payload) {
  if (!payload || !payload.lien_id) throw new Error('lien_id is required.');
  const record = {
    followup_id: payload.followup_id || makeId_('followup'),
    lien_id: payload.lien_id,
    assigned_to: payload.assigned_to || 'Carlynn',
    due_date: payload.due_date || today_(),
    followup_type: payload.followup_type || 'Call/Email',
    followup_text: payload.followup_text || '',
    status: payload.status || 'Open',
    created_by: payload.created_by || 'Amanda',
    created_date: payload.created_date || today_(),
    completed_date: payload.completed_date || '',
    active: true
  };
  appendObject_(SPREADSHEETS.liens, SHEETS.lienFollowUps, record);
  return record;
}

function appendObject_(spreadsheetId, sheetName, record) {
  const sheet = getRequiredSheet_(spreadsheetId, sheetName);
  const values = sheet.getDataRange().getValues();
  if (!values.length) throw new Error(sheetName + ' is missing headers.');
  const headers = values[0].map(normalizeHeader_);
  sheet.appendRow(headers.map(function(header) {
    return Object.prototype.hasOwnProperty.call(record, header) ? record[header] : '';
  }));
}

function makeId_(prefix) {
  return prefix + '-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 1296).toString(36).padStart(2, '0');
}

function today_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function timestamp_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd h:mm a');
}

function calculateAgingDays_(value) {
  if (!value) return 0;
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  const start = match
    ? Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(value).getTime();
  if (isNaN(start)) return 0;
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(Math.floor((today - start) / 86400000), 0);
}

function buildLienMetrics_(records) {
  const open = records.length;
  const pendingRelease = records.filter(function(row) { return /release/i.test(String(row.release_status || row.status || '')); }).length;
  const pastDue = records.filter(function(row) { return Number(row.days_past_due || 0) > 0; }).length;
  const legalHolds = records.filter(function(row) { return row.legal_hold === true || String(row.legal_hold).toUpperCase() === 'TRUE' || /legal/i.test(String(row.stage || '')); }).length;
  const totalBalance = records.reduce(function(sum, row) { return sum + parseMoney_(row.balance); }, 0);
  return [
    { metric_key: 'open_liens', label: 'Open Liens', value: open, note: 'Active records', tone: 'blue', sort_order: 1 },
    { metric_key: 'pending_releases', label: 'Pending Releases', value: pendingRelease, note: 'Need filing status', tone: 'amber', sort_order: 2 },
    { metric_key: 'past_due', label: 'Past Due', value: pastDue, note: 'Escalate today', tone: 'red', sort_order: 3 },
    { metric_key: 'legal_holds', label: 'Legal Holds', value: legalHolds, note: 'Protected records', tone: 'silver', sort_order: 4 },
    { metric_key: 'balance_at_risk', label: 'Balance at Risk', value: formatMoney_(totalBalance), note: 'Linked exposure', tone: 'blue', sort_order: 5 }
  ];
}

function getPricing(e) {
  const spreadsheetId = getPricingSpreadsheetId_();
  const sheetName = getParam_(e, 'sheet') || 'Pricing';
  const limit = Math.min(Math.max(Number(getParam_(e, 'limit') || 75), 1), 2000);
  const offset = Math.max(Number(getParam_(e, 'offset') || 0), 0);
  const search = String(getParam_(e, 'search') || '').trim().toLowerCase();
  const state = String(getParam_(e, 'state') || 'All states');
  const trade = String(getParam_(e, 'trade') || 'All trades');
  const type = String(getParam_(e, 'type') || 'All types');
  const supplier = String(getParam_(e, 'supplier') || 'All suppliers');
  const sort = String(getParam_(e, 'sort') || 'Default');
  const ss = SpreadsheetApp.openById(spreadsheetId);
  const sheet = ss.getSheetByName(sheetName) || ss.getSheets()[0];
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 2 || lastCol < 1) return emptyPricingPayload_(sheet.getName(), offset, limit);

  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(normalizeHeader_);
  const keys = headers.map(normalizePricingKey_);
  const indexes = getPricingIndexes_(keys);
  const meta = getPricingMeta_(sheet, keys, indexes);
  const hasFilter = !!search || state !== 'All states' || trade !== 'All trades' || type !== 'All types' || supplier !== 'All suppliers' || sort !== 'Default';
  let total = Math.max(lastRow - 1, 0);
  let rows = [];

  if (!hasFilter) {
    const startRow = Math.min(offset + 2, lastRow + 1);
    const readCount = Math.max(Math.min(limit, lastRow - startRow + 1), 0);
    rows = readCount ? sheet.getRange(startRow, 1, readCount, lastCol).getValues().map(function(row, index) {
      return pricingRecordFromRow_(row, keys, startRow + index);
    }) : [];
  } else if (search) {
    const result = findPricingRowsByText_(sheet, keys, indexes, { search: search, state: state, trade: trade, type: type, supplier: supplier, offset: offset, limit: limit });
    total = result.total;
    rows = result.rows;
    if (sort !== 'Default') rows = sortPricingRecords_(rows, sort);
  } else {
    const result = scanPricingRowsFast_(sheet, keys, indexes, { state: state, trade: trade, type: type, supplier: supplier, offset: offset, limit: limit });
    total = result.total;
    rows = result.rows;
    if (sort !== 'Default') rows = sortPricingRecords_(rows, sort);
  }

  return {
    headers: headers,
    keys: keys,
    rows: rows,
    total: total,
    offset: offset,
    limit: limit,
    sheet: sheet.getName(),
    states: meta.states,
    trades: meta.trades,
    types: meta.types,
    suppliers: meta.suppliers
  };
}

function findPricingRowsByText_(sheet, keys, indexes, options) {
  const lastCol = sheet.getLastColumn();
  const offset = Math.max(Number(options.offset || 0), 0);
  const limit = Math.min(Math.max(Number(options.limit || 75), 1), 2000);
  const needed = offset + limit + 1;
  const rowNumbers = [];
  const seen = {};
  const finder = sheet.createTextFinder(options.search).matchCase(false).matchEntireCell(false);
  const matches = finder.findAll();
  for (let i = 0; i < matches.length && rowNumbers.length < needed; i++) {
    const rowNumber = matches[i].getRow();
    if (rowNumber < 2 || seen[rowNumber]) continue;
    seen[rowNumber] = true;
    rowNumbers.push(rowNumber);
  }
  rowNumbers.sort(function(a, b) { return a - b; });

  const pageRows = [];
  for (let i = offset; i < rowNumbers.length && pageRows.length < limit; i++) {
    const rowNumber = rowNumbers[i];
    const row = sheet.getRange(rowNumber, 1, 1, lastCol).getValues()[0];
    if (!pricingRowMatches_(row, indexes, options)) continue;
    pageRows.push(pricingRecordFromRow_(row, keys, rowNumber));
  }

  return {
    rows: pageRows,
    total: rowNumbers.length > offset + pageRows.length ? offset + pageRows.length + 1 : offset + pageRows.length
  };
}

function scanPricingRowsFast_(sheet, keys, indexes, options) {
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  const offset = Math.max(Number(options.offset || 0), 0);
  const limit = Math.min(Math.max(Number(options.limit || 75), 1), 2000);
  const matched = [];
  let total = 0;
  const chunkSize = 1200;

  for (let rowStart = 2; rowStart <= lastRow; rowStart += chunkSize) {
    const rowCount = Math.min(chunkSize, lastRow - rowStart + 1);
    const values = sheet.getRange(rowStart, 1, rowCount, lastCol).getValues();
    for (let i = 0; i < values.length; i++) {
      const row = values[i];
      if (!pricingRowMatches_(row, indexes, options)) continue;
      if (total >= offset && matched.length < limit) matched.push(pricingRecordFromRow_(row, keys, rowStart + i));
      total++;
      if (matched.length >= limit) return { rows: matched, total: total + 1 };
    }
  }

  return { rows: matched, total: total };
}

function emptyPricingPayload_(sheetName, offset, limit) {
  return { headers: [], keys: [], rows: [], total: 0, offset: offset, limit: limit, sheet: sheetName, states: [], trades: [], types: [], suppliers: [] };
}

function getPricingIndexes_(keys) {
  return {
    state: findPricingColumn_(keys, ['state', 'region', 'market', 'location', 'territory']),
    trade: findPricingColumn_(keys, ['trade', 'category', 'service']),
    type: findPricingColumn_(keys, ['type', 'item_type', 'type_code']),
    supplier: findPricingColumn_(keys, ['supplier', 'vendor', 'brand_name']),
    price: findPricingColumn_(keys, ['price', 'rate', 'amount', 'cost', 'total', 'labor_price', 'unit_price']),
    name: findPricingColumn_(keys, ['elite_product_name', 'product', 'item_final', 'item', 'name', 'description', 'service_name', 'scope']),
    brand: findPricingColumn_(keys, ['brand', 'brand_name', 'brandline']),
    color: findPricingColumn_(keys, ['color', 'color2', 'color_code']),
    itemFinal: findPricingColumn_(keys, ['item_final']),
    uom: findPricingColumn_(keys, ['uom', 'unit'])
  };
}

function getPricingMeta_(sheet, keys, indexes) {
  const cache = CacheService.getScriptCache();
  const cacheKey = 'pricing_meta_fast_v2_' + sheet.getSheetId() + '_' + sheet.getLastRow() + '_' + sheet.getLastColumn();
  const cached = cache.get(cacheKey);
  if (cached) return JSON.parse(cached);
  const meta = { states: [], trades: [], types: [], suppliers: [] };
  const fields = [
    { key: 'states', index: indexes.state },
    { key: 'trades', index: indexes.trade },
    { key: 'types', index: indexes.type },
    { key: 'suppliers', index: indexes.supplier }
  ];
  fields.forEach(function(field) {
    if (field.index < 0) return;
    const scanRows = Math.min(Math.max(sheet.getLastRow() - 1, 0), 5000);
    const values = scanRows ? sheet.getRange(2, field.index + 1, scanRows, 1).getValues() : [];
    const seen = {};
    values.forEach(function(row) {
      const value = String(row[0] || '').trim();
      if (value) seen[value] = true;
    });
    meta[field.key] = Object.keys(seen).sort();
  });
  cache.put(cacheKey, JSON.stringify(meta), 21600);
  return meta;
}

function pricingRowMatches_(row, indexes, filters) {
  if (filters.state !== 'All states' && indexes.state > -1 && String(row[indexes.state] || '').trim() !== filters.state) return false;
  if (filters.trade !== 'All trades' && indexes.trade > -1 && String(row[indexes.trade] || '').trim() !== filters.trade) return false;
  if (filters.type !== 'All types' && indexes.type > -1 && String(row[indexes.type] || '').trim() !== filters.type) return false;
  if (filters.supplier !== 'All suppliers' && indexes.supplier > -1 && String(row[indexes.supplier] || '').trim() !== filters.supplier) return false;
  if (filters.search) {
    const searchIndexes = [indexes.supplier, indexes.state, indexes.brand, indexes.name, indexes.color, indexes.itemFinal, indexes.type, indexes.uom, indexes.price].filter(function(index) { return index > -1; });
    const haystack = searchIndexes.map(function(index) { return row[index]; }).join(' ').toLowerCase();
    if (haystack.indexOf(filters.search) < 0) return false;
  }
  return true;
}

function pricingRecordFromRow_(row, keys, rowNumber) {
  const record = { _row: rowNumber };
  keys.forEach(function(key, colIndex) {
    if (!key) return;
    record[key] = normalizeValue_(row[colIndex]);
  });
  return record;
}

function sortPricingRecords_(rows, sort) {
  if (sort === 'Lowest price') rows.sort(function(a, b) { return parseMoney_(a.price) - parseMoney_(b.price); });
  if (sort === 'Highest price') rows.sort(function(a, b) { return parseMoney_(b.price) - parseMoney_(a.price); });
  if (sort === 'Name A-Z') rows.sort(function(a, b) { return String(a.elite_product_name || a.product || a.item || '').localeCompare(String(b.elite_product_name || b.product || b.item || '')); });
  return rows;
}

function getReviewsSpreadsheetId_() {
  const spreadsheetId = SPREADSHEETS.reviews;
  if (!spreadsheetId) throw new Error('Reviews sheet is not connected yet.');
  return spreadsheetId;
}

function getPricingSpreadsheetId_() {
  const spreadsheetId = SPREADSHEETS.pricing;
  if (!spreadsheetId || spreadsheetId === 'PASTE_PRICING_SHEET_ID_HERE') {
    throw new Error('Pricing sheet is not connected yet. Paste the pricing Google Sheet ID into SPREADSHEETS.pricing.');
  }
  return spreadsheetId;
}

function normalizePricingKey_(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function findPricingColumn_(keys, candidates) {
  for (let i = 0; i < candidates.length; i++) {
    const exact = keys.indexOf(candidates[i]);
    if (exact > -1) return exact;
  }
  for (let i = 0; i < keys.length; i++) {
    for (let j = 0; j < candidates.length; j++) {
      if (keys[i].indexOf(candidates[j]) > -1) return i;
    }
  }
  return -1;
}

function readSheetObjects_(spreadsheetId, sheetName) {
  const sheet = getRequiredSheet_(spreadsheetId, sheetName);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0].map(normalizeHeader_);
  return values.slice(1)
    .filter(function(row) { return row.some(function(cell) { return cell !== '' && cell !== null; }); })
    .map(function(row) {
      return headers.reduce(function(record, header, index) {
        if (!header) return record;
        record[header] = normalizeValue_(row[index]);
        return record;
      }, {});
    });
}

function getRequiredSheet_(spreadsheetId, sheetName) {
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  if (!sheet) throw new Error('Missing required sheet tab: ' + sheetName);
  return sheet;
}

function clearSheetRows_(spreadsheetId, sheetName) {
  if (!sheetExists_(spreadsheetId, sheetName)) return { sheet: sheetName, cleared: 0, skipped: true };
  const sheet = getRequiredSheet_(spreadsheetId, sheetName);
  const rows = Math.max(sheet.getLastRow() - 1, 0);
  if (rows > 0) sheet.getRange(2, 1, rows, sheet.getLastColumn()).clearContent();
  return { sheet: sheetName, cleared: rows, skipped: false };
}

function sheetExists_(spreadsheetId, sheetName) {
  return !!SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
}

function latestById_(rows, idField, dateField) {
  return rows.reduce(function(map, row) {
    const id = String(row[idField] || '');
    if (!id) return map;
    if (!map[id] || String(row[dateField] || '') >= String(map[id][dateField] || '')) map[id] = row;
    return map;
  }, {});
}

function parseMoney_(value) {
  const number = Number(String(value || '').replace(/[^0-9.-]/g, ''));
  return isNaN(number) ? 0 : number;
}

function formatMoney_(value) {
  return '$' + Math.round(value).toLocaleString('en-US');
}

function normalizeHeader_(value) {
  return String(value || '').trim();
}

function normalizeValue_(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  if (typeof value === 'boolean') return value;
  return value === null || value === undefined ? '' : value;
}

function sortByOrder_(a, b) {
  const left = Number(a.sort_order || 0);
  const right = Number(b.sort_order || 0);
  return left - right;
}

function paramsToPayload_(e) {
  const payload = {};
  const params = e && e.parameter ? e.parameter : {};
  ['lien_id', 'contractor_id', 'note_id', 'note_date', 'note_by', 'note_type', 'note_text', 'follow_up_date', 'alert_id', 'alert_type', 'alert_text', 'priority', 'owner', 'due_date', 'status', 'created_date', 'resolved_date', 'followup_id', 'assigned_to', 'followup_type', 'followup_text', 'created_by', 'completed_date', 'active'].forEach(function(key) {
    if (Object.prototype.hasOwnProperty.call(params, key)) payload[key] = params[key];
  });
  return payload;
}

function paramsToRegistrationPayload_(e) {
  const payload = {};
  const params = e && e.parameter ? e.parameter : {};
  Object.keys(params).forEach(function(key) {
    if (key !== 'action' && key !== 'callback') payload[key] = params[key];
  });
  return payload;
}

function getParam_(e, key) {
  return e && e.parameter ? e.parameter[key] : '';
}

function output_(e, payload) {
  const callback = getParam_(e, 'callback');
  const body = JSON.stringify(payload);

  if (callback && /^[A-Za-z_$][0-9A-Za-z_$]*$/.test(callback)) {
    return ContentService
      .createTextOutput(callback + '(' + body + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(body)
    .setMimeType(ContentService.MimeType.JSON);
}

function testClearLegacyCommandCenterRows() {
  Logger.log(JSON.stringify(clearLegacyCommandCenterRows(), null, 2));
}

function testGetLiens() {
  Logger.log(JSON.stringify(getLiens(), null, 2));
}

function testSetupContractorsSheet() {
  Logger.log(JSON.stringify(setupContractorsSheet(), null, 2));
}

function testGetContractors() {
  Logger.log(JSON.stringify(getContractors(), null, 2));
}

function testGetPricing() {
  Logger.log(JSON.stringify(getPricing({ parameter: { limit: '10' } }), null, 2));
}

function testSetupFleetSheet() {
  Logger.log(JSON.stringify(setupFleetSheet(), null, 2));
}

function testGetFleet() {
  Logger.log(JSON.stringify(getFleet(), null, 2));
}
