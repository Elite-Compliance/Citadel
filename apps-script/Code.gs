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
const LIEN_MASTER_REPORT_NAME = 'Receivables Aging';
const REQUIRED_LIEN_RECORD_COLUMNS = ['blaze_url', 'contracted_amount', 'days_past_due', 'first_invoice_date', 'latest_invoice_date', 'invoice_count', 'no_payment_received', 'payment_received', 'last_payment_date', 'payment_status'];
const SHEETS = {
  commandMetrics: 'CommandMetrics',
  commandFocus: 'CommandFocus',
  lienRecords: 'LienRecords',
  lienNotes: 'LienNotes',
  lienAlerts: 'LienAlerts',
  lienFollowUps: 'LienFollowUps',
  lienMetrics: 'LienMetrics',
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

    if (action === 'saveCollectionAttorney') {
      return output_(e, { ok: true, data: saveCollectionAttorney(paramsToRegistrationPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'saveLienNote') {
      return output_(e, { ok: true, data: saveLienNote(paramsToPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'saveLienAlert') {
      return output_(e, { ok: true, data: saveLienAlert(paramsToPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'saveLienFollowUp') {
      return output_(e, { ok: true, data: saveLienFollowUp(paramsToPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'saveContractorNote') {
      return output_(e, { ok: true, data: saveContractorNote(paramsToPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'saveContractorAlert') {
      return output_(e, { ok: true, data: saveContractorAlert(paramsToPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'saveContractorFollowUp') {
      return output_(e, { ok: true, data: saveContractorFollowUp(paramsToPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'saveReviewNote') {
      return output_(e, { ok: true, data: saveReviewNote(paramsToPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'saveReviewAlert') {
      return output_(e, { ok: true, data: saveReviewAlert(paramsToPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'saveReviewFollowUp') {
      return output_(e, { ok: true, data: saveReviewFollowUp(paramsToPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'saveRegistrationRequest') {
      return output_(e, { ok: true, data: saveRegistrationRequest(paramsToRegistrationPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'restartRegistrationRequest') {
      return output_(e, { ok: true, data: restartRegistrationRequest(paramsToRegistrationPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'updateRegistrationRequest') {
      return output_(e, { ok: true, data: updateRegistrationRequest(paramsToRegistrationPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'saveRegistrationBanner') {
      return output_(e, { ok: true, data: saveRegistrationBanner(paramsToRegistrationPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'removeRegistrationBanner') {
      return output_(e, { ok: true, data: removeRegistrationBanner(paramsToRegistrationPayload_(e)), version: CITADEL_VERSION });
    }

    if (action === 'setupContractorsSheet') {
      return output_(e, { ok: true, data: setupContractorsSheet(), version: CITADEL_VERSION });
    }

    if (action === 'setupReviewsSheet') {
      return output_(e, { ok: true, data: setupReviewsSheet(), version: CITADEL_VERSION });
    }

    if (action === 'setupRegistrationsSheet') {
      return output_(e, { ok: true, data: setupRegistrationsSheet(), version: CITADEL_VERSION });
    }

    if (action === 'setupCollectionsSheet') {
      return output_(e, { ok: true, data: setupCollectionsSheet(), version: CITADEL_VERSION });
    }

    if (action === 'setupSuppliersSheet') {
      return output_(e, { ok: true, data: setupSuppliersSheet(), version: CITADEL_VERSION });
    }

    if (action === 'importLienStatusReports') {
      return output_(e, { ok: true, data: importLienStatusReports(), version: CITADEL_VERSION });
    }

    return output_(e, { ok: false, error: 'Unknown action: ' + action });
  } catch (error) {
    return output_(e, { ok: false, error: error.message || String(error) });
  }
}

function doPost(e) {
  const action = getParam_(e, 'action');

  try {
    return output_(e, { ok: false, error: 'Unknown action: ' + action });
  } catch (error) {
    return output_(e, { ok: false, error: error.message || String(error) });
  }
}


function setupSuppliersSheet() {
  const spreadsheetId = SPREADSHEETS.suppliers;
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.supplierAccounts, SUPPLIER_ACCOUNT_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.supplierContacts, SUPPLIER_CONTACT_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.supplierDocuments, SUPPLIER_DOCUMENT_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.supplierNotes, SUPPLIER_NOTE_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.supplierAlerts, SUPPLIER_ALERT_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.supplierAudit, SUPPLIER_AUDIT_HEADERS);
  return {
    spreadsheet_id: spreadsheetId,
    sheets: [SHEETS.supplierAccounts, SHEETS.supplierContacts, SHEETS.supplierDocuments, SHEETS.supplierNotes, SHEETS.supplierAlerts, SHEETS.supplierAudit]
  };
}

function isSupplierActive_(row) {
  const value = String(row.active == null ? '' : row.active).trim().toLowerCase();
  return value === '' || value === 'true' || value === 'yes' || value === 'active' || row.active === true;
}

function getSuppliers() {
  setupSuppliersSheet();
  const spreadsheetId = SPREADSHEETS.suppliers;
  const contacts = readSheetObjects_(spreadsheetId, SHEETS.supplierContacts).filter(isSupplierActive_);
  const documents = readSheetObjects_(spreadsheetId, SHEETS.supplierDocuments).filter(isSupplierActive_);
  const notes = readSheetObjects_(spreadsheetId, SHEETS.supplierNotes);
  const alerts = readSheetObjects_(spreadsheetId, SHEETS.supplierAlerts).filter(function(row) {
    return !/resolved|closed/i.test(String(row.status || ''));
  });
  const audit = readSheetObjects_(spreadsheetId, SHEETS.supplierAudit);
  const records = readSheetObjects_(spreadsheetId, SHEETS.supplierAccounts).filter(isSupplierActive_).map(function(row) {
    const id = String(row.supplier_id || '');
    const record = Object.assign({}, row);
    record.contacts_count = contacts.filter(function(item) { return String(item.supplier_id) === id; }).length;
    record.documents_count = documents.filter(function(item) { return String(item.supplier_id) === id; }).length;
    record.notes_count = notes.filter(function(item) { return String(item.supplier_id) === id; }).length;
    record.alerts_count = alerts.filter(function(item) { return String(item.supplier_id) === id; }).length;
    return record;
  });
  return {
    records: records,
    contacts: contacts,
    documents: documents,
    notes: notes,
    alerts: alerts,
    audit: audit,
    metrics: buildSupplierMetrics_(records, alerts),
    source: 'Citadel Supplier Accounts'
  };
}

function saveSupplierAccount(payload) {
  payload = payload || {};
  setupSuppliersSheet();
  const spreadsheetId = SPREADSHEETS.suppliers;
  const supplierId = String(payload.supplier_id || '').trim() || makeIdFromText_('SUP', [payload.supplier_name, payload.branch_number, payload.region].join('|'));
  if (!String(payload.supplier_name || '').trim()) throw new Error('Supplier name is required.');
  const existing = readSheetObjects_(spreadsheetId, SHEETS.supplierAccounts).filter(function(row) {
    return String(row.supplier_id) === supplierId;
  })[0] || {};
  const record = Object.assign({}, existing);
  SUPPLIER_ACCOUNT_HEADERS.forEach(function(header) {
    if (Object.prototype.hasOwnProperty.call(payload, header)) record[header] = payload[header];
  });
  record.supplier_id = supplierId;
  ['current_balance', 'credit_limit', 'available_credit', 'minimum_order'].forEach(function(header) {
    if (String(record[header] == null ? '' : record[header]).trim() !== '') record[header] = parseMoney_(record[header]);
  });
  if (String(record.renewal_notice_days == null ? '' : record.renewal_notice_days).trim() !== '') {
    record.renewal_notice_days = Number(record.renewal_notice_days) || 0;
  }
  record.created_at = existing.created_at || timestamp_();
  record.created_by = existing.created_by || String(payload.updated_by || 'Amanda').trim();
  record.updated_at = timestamp_();
  record.updated_by = String(payload.updated_by || 'Amanda').trim();
  const activeText = String(record.active == null ? '' : record.active).toLowerCase();
  record.active = activeText ? !/^(false|no|inactive|closed)$/.test(activeText) : true;
  upsertSheetObject_(spreadsheetId, SHEETS.supplierAccounts, 'supplier_id', supplierId, record);
  logSupplierChanges_(supplierId, existing, record, record.updated_by, existing.supplier_id ? 'Account Updated' : 'Account Created');
  return record;
}

function saveSupplierContact(payload) {
  payload = payload || {};
  setupSuppliersSheet();
  const supplierId = String(payload.supplier_id || '').trim();
  if (!supplierId) throw new Error('supplier_id is required.');
  if (!String(payload.contact_name || '').trim() && !String(payload.email || '').trim()) throw new Error('Contact name or email is required.');
  const contactId = String(payload.contact_id || '').trim() || makeId_('supplier-contact');
  const existing = readSheetObjects_(SPREADSHEETS.suppliers, SHEETS.supplierContacts).filter(function(row) {
    return String(row.contact_id) === contactId;
  })[0] || {};
  const record = Object.assign({}, existing);
  SUPPLIER_CONTACT_HEADERS.forEach(function(header) {
    if (Object.prototype.hasOwnProperty.call(payload, header)) record[header] = payload[header];
  });
  record.contact_id = contactId;
  record.supplier_id = supplierId;
  record.created_at = existing.created_at || timestamp_();
  record.created_by = existing.created_by || String(payload.updated_by || 'Amanda').trim();
  record.updated_at = timestamp_();
  record.updated_by = String(payload.updated_by || 'Amanda').trim();
  record.active = !/^(false|no|inactive)$/.test(String(record.active || 'true').toLowerCase());
  upsertSheetObject_(SPREADSHEETS.suppliers, SHEETS.supplierContacts, 'contact_id', contactId, record);
  appendSupplierAudit_(supplierId, existing.contact_id ? 'Contact Updated' : 'Contact Added', 'contact', existing.contact_name || '', record.contact_name || record.email || '', record.updated_by);
  return record;
}

function saveSupplierDocument(payload) {
  payload = payload || {};
  setupSuppliersSheet();
  const supplierId = String(payload.supplier_id || '').trim();
  if (!supplierId) throw new Error('supplier_id is required.');
  if (!String(payload.document_type || '').trim()) throw new Error('Document type is required.');
  const documentId = String(payload.document_id || '').trim() || makeId_('supplier-document');
  const existing = readSheetObjects_(SPREADSHEETS.suppliers, SHEETS.supplierDocuments).filter(function(row) {
    return String(row.document_id) === documentId;
  })[0] || {};
  const record = Object.assign({}, existing);
  SUPPLIER_DOCUMENT_HEADERS.forEach(function(header) {
    if (Object.prototype.hasOwnProperty.call(payload, header)) record[header] = payload[header];
  });
  record.document_id = documentId;
  record.supplier_id = supplierId;
  record.created_at = existing.created_at || timestamp_();
  record.created_by = existing.created_by || String(payload.updated_by || 'Amanda').trim();
  record.updated_at = timestamp_();
  record.updated_by = String(payload.updated_by || 'Amanda').trim();
  record.active = !/^(false|no|inactive)$/.test(String(record.active || 'true').toLowerCase());
  upsertSheetObject_(SPREADSHEETS.suppliers, SHEETS.supplierDocuments, 'document_id', documentId, record);
  appendSupplierAudit_(supplierId, existing.document_id ? 'Document Updated' : 'Document Added', record.document_type, existing.status || '', record.status || '', record.updated_by);
  return record;
}

function saveSupplierNote(payload) {
  payload = payload || {};
  const supplierId = String(payload.supplier_id || '').trim();
  const noteText = String(payload.note_text || '').trim();
  if (!supplierId || !noteText) throw new Error('Supplier and note text are required.');
  setupSuppliersSheet();
  const record = {
    note_id: makeId_('supplier-note'),
    supplier_id: supplierId,
    note_text: noteText,
    created_at: timestamp_(),
    created_by: String(payload.created_by || payload.updated_by || 'Amanda').trim()
  };
  appendObject_(SPREADSHEETS.suppliers, SHEETS.supplierNotes, record);
  appendSupplierAudit_(supplierId, 'Note Added', 'note', '', noteText, record.created_by);
  return record;
}

function saveSupplierAlert(payload) {
  payload = payload || {};
  const supplierId = String(payload.supplier_id || '').trim();
  const alertText = String(payload.alert_text || '').trim();
  if (!supplierId || !alertText) throw new Error('Supplier and alert text are required.');
  setupSuppliersSheet();
  const record = {
    alert_id: makeId_('supplier-alert'),
    supplier_id: supplierId,
    alert_text: alertText,
    due_date: String(payload.due_date || '').trim(),
    status: String(payload.status || 'Open').trim(),
    created_at: timestamp_(),
    created_by: String(payload.created_by || payload.updated_by || 'Amanda').trim(),
    resolved_at: '',
    resolved_by: ''
  };
  appendObject_(SPREADSHEETS.suppliers, SHEETS.supplierAlerts, record);
  appendSupplierAudit_(supplierId, 'Alert Added', 'alert', '', alertText, record.created_by);
  return record;
}

function logSupplierChanges_(supplierId, before, after, changedBy, action) {
  const ignored = { created_at: true, created_by: true, updated_at: true, updated_by: true };
  let changes = 0;
  SUPPLIER_ACCOUNT_HEADERS.forEach(function(header) {
    if (ignored[header] || header === 'supplier_id') return;
    const oldValue = before[header] == null ? '' : before[header];
    const newValue = after[header] == null ? '' : after[header];
    if (String(oldValue) === String(newValue)) return;
    appendSupplierAudit_(supplierId, action, header, oldValue, newValue, changedBy);
    changes += 1;
  });
  if (!changes && !before.supplier_id) appendSupplierAudit_(supplierId, action, 'supplier_name', '', after.supplier_name || '', changedBy);
}

function appendSupplierAudit_(supplierId, action, fieldName, priorValue, newValue, changedBy) {
  appendObject_(SPREADSHEETS.suppliers, SHEETS.supplierAudit, {
    audit_id: makeId_('supplier-audit'),
    supplier_id: supplierId,
    action: action,
    field_name: fieldName || '',
    prior_value: priorValue == null ? '' : priorValue,
    new_value: newValue == null ? '' : newValue,
    changed_at: timestamp_(),
    changed_by: changedBy || 'Amanda'
  });
}

function buildSupplierMetrics_(records, alerts) {
  const missingAgreements = records.filter(function(row) {
    return !/^(signed|not required)$/i.test(String(row.signed_agreement_status || ''));
  }).length;
  const renewals = records.filter(function(row) {
    return isDateWithinDays_(row.renewal_date || row.agreement_expiration_date, 90);
  }).length;
  const compliance = records.filter(function(row) {
    return !/^(current|not required)$/i.test(String(row.compliance_status || ''));
  }).length;
  const credit = records.filter(function(row) {
    return /review|hold|cod|not verified/i.test(String(row.credit_status || ''));
  }).length;
  return [
    { key: 'open_alerts', label: 'Open Alerts', value: alerts.length, note: 'Supplier follow-up' },
    { key: 'all', label: 'Suppliers', value: records.length, note: 'Active accounts' },
    { key: 'agreements', label: 'Agreements', value: missingAgreements, note: 'Missing or unverified' },
    { key: 'renewals', label: '90 Day Renewals', value: renewals, note: 'Agreement window' },
    { key: 'compliance', label: 'Compliance', value: compliance, note: 'Needs review' },
    { key: 'credit', label: 'Credit Review', value: credit, note: 'Terms or limit review' }
  ];
}

function setupCollectionsSheet() {
  const spreadsheetId = SPREADSHEETS.commandCenter;
  ensureSheetWithExactHeaders_(spreadsheetId, SHEETS.collectionRecords, COLLECTION_RECORD_HEADERS, {
    lien_id: ['source_lien_id'],
    date_sent_to_agency: ['sent_date'],
    tracking_status: ['status']
  });
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.collectionNotes, COLLECTION_NOTE_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.collectionAlerts, COLLECTION_ALERT_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.businessContacts, BUSINESS_CONTACT_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.collectionAttorneys, COLLECTION_ATTORNEY_HEADERS);
  return {
    spreadsheet_id: spreadsheetId,
    sheets: [SHEETS.collectionRecords, SHEETS.collectionNotes, SHEETS.collectionAlerts, SHEETS.businessContacts, SHEETS.collectionAttorneys]
  };
}

function getCollections() {
  setupCollectionsSheet();
  const spreadsheetId = SPREADSHEETS.commandCenter;
  const sourceRecords = readSheetObjects_(SPREADSHEETS.liens, SHEETS.lienRecords).filter(function(row) {
    return isActiveRow_(row) && isCollectionAgencyLien_(row);
  });
  const trackingRows = readSheetObjects_(spreadsheetId, SHEETS.collectionRecords).filter(isActiveRow_);
  const notes = readSheetObjects_(spreadsheetId, SHEETS.collectionNotes).filter(isActiveRow_);
  const alerts = readSheetObjects_(spreadsheetId, SHEETS.collectionAlerts).filter(function(row) {
    return isActiveRow_(row) && !/resolved|closed/i.test(String(row.status || ''));
  });
  const contacts = readSheetObjects_(spreadsheetId, SHEETS.businessContacts).filter(isActiveRow_);
  const attorneys = readSheetObjects_(spreadsheetId, SHEETS.collectionAttorneys).filter(isActiveRow_);
  const trackingByLienId = {};
  trackingRows.forEach(function(row) {
    trackingByLienId[String(row.lien_id || '')] = row;
  });
  const records = sourceRecords.map(function(source) {
    const lienId = String(source.lien_id || '').trim();
    const record = mergeCollectionSource_(source, trackingByLienId[lienId] || {});
    record.notes_count = notes.filter(function(item) {
      return String(item.collection_id) === String(record.collection_id);
    }).length;
    record.alerts_count = alerts.filter(function(item) {
      return String(item.collection_id) === String(record.collection_id);
    }).length;
    return record;
  });
  const currentCollectionIds = {};
  records.forEach(function(record) { currentCollectionIds[String(record.collection_id)] = true; });
  const currentNotes = notes.filter(function(item) { return currentCollectionIds[String(item.collection_id)]; });
  const currentAlerts = alerts.filter(function(item) { return currentCollectionIds[String(item.collection_id)]; });
  return {
    records: records,
    notes: currentNotes,
    alerts: currentAlerts,
    contacts: contacts,
    attorneys: attorneys,
    metrics: buildCollectionMetrics_(records, currentAlerts),
    source: 'LienRecords / Collection Agency'
  };
}

function saveCollectionRecord(payload) {
  payload = payload || {};
  const lienId = String(payload.lien_id || '').trim();
  if (!lienId) throw new Error('lien_id is required.');
  setupCollectionsSheet();
  const source = readSheetObjects_(SPREADSHEETS.liens, SHEETS.lienRecords).filter(function(row) {
    return isActiveRow_(row) && String(row.lien_id || '') === lienId && isCollectionAgencyLien_(row);
  })[0] || {};
  if (!source.lien_id) throw new Error('This Liens record is not currently in Collection Agency status.');
  const existing = readSheetObjects_(SPREADSHEETS.commandCenter, SHEETS.collectionRecords).filter(function(row) {
    return String(row.lien_id || '') === lienId;
  })[0] || {};
  const collectionId = String(existing.collection_id || payload.collection_id || '').trim() || makeIdFromText_('COL', lienId);
  const amountCollected = parseMoney_(payload.amount_collected);
  const hasOutstanding = String(payload.amount_outstanding == null ? '' : payload.amount_outstanding).trim() !== '';
  const amountOutstanding = hasOutstanding ? parseMoney_(payload.amount_outstanding) : Math.max(parseMoney_(source.balance) - amountCollected, 0);
  const dateReceived = String(payload.date_received || '').trim();
  const assignedAttorneyId = String(payload.assigned_attorney_id || '').trim();
  const assignedAttorney = assignedAttorneyId ? findCollectionAttorney_(assignedAttorneyId) : null;
  if (assignedAttorneyId && !assignedAttorney) throw new Error('The selected attorney is no longer active in the protected directory.');
  const assignedAttorneyName = assignedAttorney ? assignedAttorney.name : '';
  const record = {
    collection_id: collectionId,
    lien_id: lienId,
    assigned_attorney_id: assignedAttorneyId,
    assigned_attorney_name: assignedAttorneyName,
    collection_agency: String(existing.collection_agency || '').trim(),
    date_sent_to_agency: String(payload.date_sent_to_agency || payload.sent_date || '').trim(),
    amount_outstanding: amountOutstanding,
    amount_collected: amountCollected,
    amount_we_receive: parseMoney_(payload.amount_we_receive),
    date_received: dateReceived,
    tracking_status: collectionTrackingStatus_(dateReceived, amountCollected, assignedAttorneyName),
    created_at: existing.created_at || timestamp_(),
    updated_by: String(payload.updated_by || 'Amanda').trim(),
    last_updated: timestamp_(),
    active: true
  };
  upsertSheetObject_(SPREADSHEETS.commandCenter, SHEETS.collectionRecords, 'collection_id', collectionId, record);
  return record;
}

function findCollectionAttorney_(attorneyId) {
  const spreadsheetId = SPREADSHEETS.commandCenter;
  const attorney = readSheetObjects_(spreadsheetId, SHEETS.collectionAttorneys).filter(function(row) {
    return isActiveRow_(row) && String(row.attorney_id || '').trim() === attorneyId;
  })[0];
  if (attorney) return { id: attorneyId, name: String(attorney.firm_name || attorney.office_name || attorney.attorney_name || '').trim() };
  const contact = readSheetObjects_(spreadsheetId, SHEETS.businessContacts).filter(function(row) {
    return isActiveRow_(row) && String(row.contact_type || '').trim() === 'Attorney' && String(row.contact_id || '').trim() === attorneyId;
  })[0];
  return contact ? { id: attorneyId, name: String(contact.organization_name || contact.contact_name || '').trim() } : null;
}

function isCollectionAgencyLien_(row) {
  return String(row.status || '').trim().toLowerCase() === 'collection agency';
}

function collectionTrackingStatus_(dateReceived, amountCollected, assignedAttorney) {
  if (dateReceived) return 'Received';
  if (amountCollected > 0) return 'Partially Collected';
  return assignedAttorney ? 'Placed' : 'Needs Assignment';
}

function mergeCollectionSource_(source, tracking) {
  const lienId = String(source.lien_id || '').trim();
  const amountCollected = parseMoney_(tracking.amount_collected);
  const hasOutstanding = String(tracking.amount_outstanding == null ? '' : tracking.amount_outstanding).trim() !== '';
  const assignedAttorneyName = String(tracking.assigned_attorney_name || '').trim();
  const dateReceived = String(tracking.date_received || '').trim();
  return {
    collection_id: String(tracking.collection_id || '').trim() || makeIdFromText_('COL', lienId),
    lien_id: lienId,
    region: source.region || '',
    sales_rep: source.owner || '',
    job_number: source.job_number || source.source_record_id || source.account_name || lienId,
    job_link: source.blaze_url || source.job_link || '',
    customer: source.customer || source.account_name || '',
    current_stage: source.stage || '',
    aging_days: Math.max(Number(source.days_past_due) || 0, 0),
    source_balance: parseMoney_(source.balance),
    payments_received: parseMoney_(source.payment_received || source.payments_received),
    first_invoice_date: source.first_invoice_date || '',
    latest_invoice_date: source.latest_invoice_date || '',
    invoice_count: source.invoice_count || '',
    assigned_attorney_id: tracking.assigned_attorney_id || '',
    assigned_attorney_name: assignedAttorneyName,
    date_sent_to_agency: tracking.date_sent_to_agency || '',
    amount_outstanding: hasOutstanding ? parseMoney_(tracking.amount_outstanding) : Math.max(parseMoney_(source.balance) - amountCollected, 0),
    amount_collected: amountCollected,
    amount_we_receive: parseMoney_(tracking.amount_we_receive),
    date_received: dateReceived,
    tracking_status: tracking.tracking_status || collectionTrackingStatus_(dateReceived, amountCollected, assignedAttorneyName),
    source_status: source.status || '',
    created_at: tracking.created_at || '',
    updated_by: tracking.updated_by || '',
    last_updated: tracking.last_updated || ''
  };
}

function saveBusinessContact(payload) {
  payload = payload || {};
  const organizationName = String(payload.organization_name || '').trim();
  const contactName = String(payload.contact_name || '').trim();
  const contactType = String(payload.contact_type || '').trim();
  if (!organizationName && !contactName) throw new Error('Organization or contact name is required.');
  if (!contactType || contactType === 'Select type') throw new Error('Contact type is required.');
  setupCollectionsSheet();
  const contactId = String(payload.contact_id || '').trim() || makeId_('contact');
  const existing = readSheetObjects_(SPREADSHEETS.commandCenter, SHEETS.businessContacts).filter(function(row) {
    return String(row.contact_id) === contactId;
  })[0] || {};
  const record = {
    contact_id: contactId,
    contact_type: contactType,
    organization_name: organizationName,
    contact_name: contactName,
    job_title: String(payload.job_title || '').trim(),
    department: String(payload.department || '').trim(),
    primary_email: String(payload.primary_email || '').trim(),
    secondary_email: String(payload.secondary_email || '').trim(),
    office_phone: String(payload.office_phone || '').trim(),
    phone_extension: String(payload.phone_extension || '').trim(),
    mobile_phone: String(payload.mobile_phone || '').trim(),
    fax: String(payload.fax || '').trim(),
    website: String(payload.website || '').trim(),
    preferred_contact_method: String(payload.preferred_contact_method || '').trim(),
    business_address_1: String(payload.business_address_1 || '').trim(),
    business_address_2: String(payload.business_address_2 || '').trim(),
    business_city: String(payload.business_city || '').trim(),
    business_state: String(payload.business_state || '').trim(),
    business_zip: String(payload.business_zip || '').trim(),
    business_country: String(payload.business_country || '').trim(),
    mailing_same_as_business: String(payload.mailing_same_as_business || '').toLowerCase() === 'true',
    mailing_address_1: String(payload.mailing_address_1 || '').trim(),
    mailing_address_2: String(payload.mailing_address_2 || '').trim(),
    mailing_city: String(payload.mailing_city || '').trim(),
    mailing_state: String(payload.mailing_state || '').trim(),
    mailing_zip: String(payload.mailing_zip || '').trim(),
    mailing_country: String(payload.mailing_country || '').trim(),
    notes: String(payload.notes || '').trim(),
    created_at: existing.created_at || timestamp_(),
    updated_at: timestamp_(),
    active: true
  };
  upsertSheetObject_(SPREADSHEETS.commandCenter, SHEETS.businessContacts, 'contact_id', contactId, record);
  return record;
}

function saveCollectionAttorney(payload) {
  payload = payload || {};
  const firmName = String(payload.firm_name || payload.organization_name || '').trim();
  const officeName = String(payload.office_name || '').trim();
  const attorneyName = String(payload.attorney_name || payload.contact_name || '').trim();
  if (!attorneyName) throw new Error('Attorney name is required.');
  if (!firmName && !officeName) throw new Error('Law firm or office name is required.');

  setupCollectionsSheet();
  const attorneyId = String(payload.attorney_id || payload.contact_id || '').trim() || makeId_('attorney');
  const existing = readSheetObjects_(SPREADSHEETS.commandCenter, SHEETS.collectionAttorneys).filter(function(row) {
    return String(row.attorney_id) === attorneyId;
  })[0] || {};
  const record = {
    attorney_id: attorneyId,
    firm_name: firmName,
    office_name: officeName,
    attorney_name: attorneyName,
    job_title: String(payload.job_title || 'Attorney').trim(),
    bar_number: String(payload.bar_number || '').trim(),
    licensed_states: String(payload.licensed_states || '').trim(),
    practice_areas: String(payload.practice_areas || '').trim(),
    primary_email: String(payload.primary_email || '').trim(),
    secondary_email: String(payload.secondary_email || '').trim(),
    office_phone: String(payload.office_phone || '').trim(),
    phone_extension: String(payload.phone_extension || '').trim(),
    mobile_phone: String(payload.mobile_phone || '').trim(),
    fax: String(payload.fax || '').trim(),
    website: String(payload.website || '').trim(),
    preferred_contact_method: String(payload.preferred_contact_method || '').trim(),
    business_address_1: String(payload.business_address_1 || '').trim(),
    business_address_2: String(payload.business_address_2 || '').trim(),
    business_city: String(payload.business_city || '').trim(),
    business_state: String(payload.business_state || '').trim(),
    business_zip: String(payload.business_zip || '').trim(),
    business_country: String(payload.business_country || '').trim(),
    mailing_same_as_business: String(payload.mailing_same_as_business || '').toLowerCase() === 'true',
    mailing_address_1: String(payload.mailing_address_1 || '').trim(),
    mailing_address_2: String(payload.mailing_address_2 || '').trim(),
    mailing_city: String(payload.mailing_city || '').trim(),
    mailing_state: String(payload.mailing_state || '').trim(),
    mailing_zip: String(payload.mailing_zip || '').trim(),
    mailing_country: String(payload.mailing_country || '').trim(),
    notes: String(payload.notes || '').trim(),
    created_at: existing.created_at || timestamp_(),
    updated_at: timestamp_(),
    active: true
  };
  upsertSheetObject_(SPREADSHEETS.commandCenter, SHEETS.collectionAttorneys, 'attorney_id', attorneyId, record);
  return record;
}

function saveCollectionNote(payload) {
  payload = payload || {};
  if (!payload.collection_id) throw new Error('collection_id is required.');
  const noteText = String(payload.note_text || '').trim();
  if (!noteText) throw new Error('Note text is required.');
  setupCollectionsSheet();
  const record = {
    note_id: payload.note_id || makeId_('note'),
    collection_id: payload.collection_id,
    note_date: payload.note_date || timestamp_(),
    note_by: payload.note_by || 'Amanda',
    note_type: payload.note_type || 'General',
    note_text: noteText,
    active: true
  };
  appendObject_(SPREADSHEETS.commandCenter, SHEETS.collectionNotes, record);
  return record;
}

function saveCollectionAlert(payload) {
  payload = payload || {};
  if (!payload.collection_id) throw new Error('collection_id is required.');
  const alertText = String(payload.alert_text || '').trim();
  if (!alertText) throw new Error('Alert text is required.');
  setupCollectionsSheet();
  const record = {
    alert_id: payload.alert_id || makeId_('alert'),
    collection_id: payload.collection_id,
    alert_type: payload.alert_type || 'Collection Follow-up',
    alert_text: alertText,
    priority: payload.priority || 'High',
    owner: payload.owner || 'Carlynn',
    due_date: payload.due_date || today_(),
    status: payload.status || 'Open',
    created_date: payload.created_date || timestamp_(),
    resolved_date: payload.resolved_date || '',
    active: true
  };
  appendObject_(SPREADSHEETS.commandCenter, SHEETS.collectionAlerts, record);
  return record;
}

function buildCollectionMetrics_(records, alerts) {
  const outstanding = records.reduce(function(sum, row) { return sum + parseMoney_(row.amount_outstanding); }, 0);
  const collected = records.reduce(function(sum, row) { return sum + parseMoney_(row.amount_collected); }, 0);
  const expected = records.reduce(function(sum, row) { return sum + parseMoney_(row.amount_we_receive); }, 0);
  return [
    { metric_key: 'open_alerts', label: 'Open Alerts', value: alerts.length, note: 'Collection follow-up', tone: 'blue', sort_order: 1 },
    { metric_key: 'accounts', label: 'Jobs', value: records.length, note: 'Sent to collections', tone: 'blue', sort_order: 2 },
    { metric_key: 'outstanding', label: 'Outstanding', value: formatMoney_(outstanding), note: 'Still due', tone: 'amber', sort_order: 3 },
    { metric_key: 'collected', label: 'Collected', value: formatMoney_(collected), note: 'Agency recovery', tone: 'blue', sort_order: 4 },
    { metric_key: 'expected', label: 'Expected Receipt', value: formatMoney_(expected), note: 'Amount due to Elite', tone: 'blue', sort_order: 5 }
  ];
}

function setupPaymentsSheet() {
  const spreadsheetId = getPaymentsSpreadsheetId_();
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.paymentImport, PAYMENT_IMPORT_HEADERS);
  ensureSheetWithExactHeaders_(spreadsheetId, SHEETS.paymentTransactions, PAYMENT_TRANSACTION_HEADERS, {
    payment_method: ['payment_source'],
    source_row_hash: ['source_row_has'],
    duplicate_group_size: ['duplicate_count', 'duplicate_1']
  });
  ensureSheetWithExactHeaders_(spreadsheetId, SHEETS.paymentSummary, PAYMENT_SUMMARY_HEADERS);
  ensureSheetWithExactHeaders_(spreadsheetId, SHEETS.paymentImportLog, PAYMENT_IMPORT_LOG_HEADERS);
  return {
    spreadsheet_id: spreadsheetId,
    sheets: [SHEETS.paymentImport, SHEETS.paymentTransactions, SHEETS.paymentSummary, SHEETS.paymentImportLog]
  };
}

function importPaymentsFromStaging() {
  return runPaymentImport({
    imported_by: 'Apps Script editor',
    source_label: 'Manual Apps Script import'
  });
}

function runPaymentImport(options) {
  const context = options || {};
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) {
    throw new Error('Another payment import is already running. Please wait a moment and try again.');
  }

  const spreadsheetId = getPaymentsSpreadsheetId_();
  const importedAt = timestamp_();
  const importedBy = String(context.imported_by || 'Citadel user').trim() || 'Citadel user';
  const sourceLabel = String(context.source_label || '').trim().slice(0, 160);
  let sourceRows = 0;

  try {
    setupPaymentsSheet();
    validatePaymentImportHeaders_(spreadsheetId);
    const rawRows = readSheetObjects_(spreadsheetId, SHEETS.paymentImport);
    sourceRows = rawRows.length;
    if (!rawRows.length) {
      throw new Error('PaymentImport is empty. Paste a fresh Deposit Report into the PaymentImport tab, then run the import again.');
    }

    const groupSizes = {};
    rawRows.forEach(function(row) {
      const sourceHash = paymentSourceRowHash_(row);
      groupSizes[sourceHash] = (groupSizes[sourceHash] || 0) + 1;
    });

    const groupSequences = {};
    const transactions = rawRows.map(function(row, index) {
      const sourceHash = paymentSourceRowHash_(row);
      groupSequences[sourceHash] = (groupSequences[sourceHash] || 0) + 1;
      return normalizePaymentTransaction_(
        row,
        sourceHash,
        index + 2,
        groupSizes[sourceHash],
        groupSequences[sourceHash],
        importedAt
      );
    }).sort(function(left, right) {
      return String(right.payment_date).localeCompare(String(left.payment_date)) ||
        String(left.job_number).localeCompare(String(right.job_number)) ||
        Number(left.source_row_number) - Number(right.source_row_number);
    });

    const uniqueRows = Object.keys(groupSizes).length;
    const duplicateRows = rawRows.length - uniqueRows;
    const validationErrorRows = transactions.filter(function(row) { return !!row.validation_error; }).length;
    const summaryTransactions = transactions.filter(function(row) {
      return row.included_in_summary && !row.validation_error;
    });
    const summaries = buildPaymentSummaries_(summaryTransactions, importedAt);

    replaceSheetObjects_(spreadsheetId, SHEETS.paymentTransactions, PAYMENT_TRANSACTION_HEADERS, transactions);
    replaceSheetObjects_(spreadsheetId, SHEETS.paymentSummary, PAYMENT_SUMMARY_HEADERS, summaries);

    const importLog = {
      import_id: makeId_('payment-import'),
      imported_at: importedAt,
      imported_by: importedBy,
      source_sheet: SHEETS.paymentImport,
      source_label: sourceLabel,
      source_rows: rawRows.length,
      unique_rows: uniqueRows,
      duplicate_rows: duplicateRows,
      negative_rows: transactions.filter(function(row) { return row.is_reversal; }).length,
      missing_payment_method_rows: transactions.filter(function(row) { return row.missing_payment_method; }).length,
      validation_error_rows: validationErrorRows,
      zero_net_jobs: summaries.filter(function(row) { return row.net_payment_zero; }).length,
      outlier_rows: transactions.filter(function(row) { return row.outlier_review; }).length,
      status: duplicateRows || validationErrorRows ||
        transactions.some(function(row) { return row.missing_payment_method || row.outlier_review; })
          ? 'Completed with warnings'
          : 'Completed',
      notes: 'All source rows retained. Exact duplicate groups are flagged; only the first row in each group is counted. Reversals remain included in net totals.'
    };
    appendObject_(spreadsheetId, SHEETS.paymentImportLog, importLog);

    const result = {
      import_id: importLog.import_id,
      imported_at: importLog.imported_at,
      status: importLog.status,
      source_label: importLog.source_label,
      source_rows: importLog.source_rows,
      retained_rows: transactions.length,
      unique_rows: importLog.unique_rows,
      duplicate_rows: importLog.duplicate_rows,
      negative_rows: importLog.negative_rows,
      missing_payment_method_rows: importLog.missing_payment_method_rows,
      validation_error_rows: importLog.validation_error_rows,
      zero_net_jobs: importLog.zero_net_jobs,
      outlier_rows: importLog.outlier_rows,
      job_summaries: summaries.length
    };
    Logger.log(JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    try {
      setupPaymentsSheet();
      appendObject_(spreadsheetId, SHEETS.paymentImportLog, {
        import_id: makeId_('payment-import'),
        imported_at: importedAt,
        imported_by: importedBy,
        source_sheet: SHEETS.paymentImport,
        source_label: sourceLabel,
        source_rows: sourceRows,
        unique_rows: '',
        duplicate_rows: '',
        negative_rows: '',
        missing_payment_method_rows: '',
        validation_error_rows: '',
        zero_net_jobs: '',
        outlier_rows: '',
        status: 'Failed',
        notes: error && error.message ? error.message : String(error)
      });
    } catch (logError) {
      Logger.log('Unable to write failed payment import log: ' + (logError.message || String(logError)));
    }
    throw error;
  } finally {
    lock.releaseLock();
  }
}

function getPaymentImportStatus() {
  const spreadsheetId = getPaymentsSpreadsheetId_();
  setupPaymentsSheet();
  const logs = readSheetObjects_(spreadsheetId, SHEETS.paymentImportLog);
  const status = {
    staging_rows: readSheetObjects_(spreadsheetId, SHEETS.paymentImport).length,
    transactions: readSheetObjects_(spreadsheetId, SHEETS.paymentTransactions).length,
    summaries: readSheetObjects_(spreadsheetId, SHEETS.paymentSummary).length,
    latest_import: logs.length ? logs[logs.length - 1] : null,
    recent_imports: logs.slice(-5).reverse()
  };
  Logger.log(JSON.stringify(status, null, 2));
  return status;
}

function validatePaymentImportHeaders_(spreadsheetId) {
  const sheet = getRequiredSheet_(spreadsheetId, SHEETS.paymentImport);
  const headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getDisplayValues()[0].map(function(value) {
    return String(value || '').trim();
  });
  const missing = PAYMENT_IMPORT_HEADERS.filter(function(header) { return headers.indexOf(header) === -1; });
  if (missing.length) throw new Error('PaymentImport is missing required columns: ' + missing.join(', '));
}

function paymentSourceRowHash_(row) {
  const sourceText = PAYMENT_IMPORT_HEADERS.map(function(header) {
    return String(row[header] === null || row[header] === undefined ? '' : row[header]).trim();
  }).join('\u001f');
  return sha256Hex_(sourceText);
}

function normalizePaymentTransaction_(row, sourceHash, sourceRowNumber, duplicateGroupSize, duplicateSequence, importedAt) {
  const jobLink = String(row['Job Link'] || '').trim();
  const blazeJobId = extractBlazeJobId_(jobLink);
  const rawStage = String(row['Current Stage'] || '').trim();
  const blazeStage = normalizeBlazeStage_(rawStage);
  const stageEnterDate = normalizeSourceDate_(row['Stage Enter Date']);
  const paymentDate = normalizeSourceDate_(row['Payment Date']);
  const amountText = String(row['Payment Amount'] === null || row['Payment Amount'] === undefined ? '' : row['Payment Amount']).replace(/[$,\s]/g, '');
  const amount = amountText === '' ? NaN : Number(amountText);
  const paymentMethod = String(row['Payment Source Type'] || '').trim();
  const validationErrors = [];
  if (!blazeJobId) validationErrors.push('Missing or invalid Blaze job UUID');
  if (!paymentDate) validationErrors.push('Missing or invalid payment date');
  if (!isFinite(amount)) validationErrors.push('Missing or invalid payment amount');

  const hasExactDuplicate = duplicateGroupSize > 1;
  const includedInSummary = duplicateSequence === 1;
  const duplicateStatus = !hasExactDuplicate
    ? ''
    : includedInSummary
      ? 'Exact duplicate group - included in totals'
      : 'Exact duplicate - review source entry; excluded from totals';

  return {
    payment_key: 'pay-' + sourceHash.slice(0, 24) + '-' + String(sourceRowNumber),
    blaze_job_id: blazeJobId,
    job_number: String(row['Job Number'] || '').trim(),
    job_link: jobLink,
    region: String(row.Region || '').trim(),
    sales_rep: String(row['Sales Rep'] || '').trim(),
    customer: String(row.Customer || '').trim(),
    blaze_stage: blazeStage,
    stage_enter_date: stageEnterDate,
    days_in_current_stage: stageEnterDate ? calculateAgingDays_(stageEnterDate) : '',
    payment_amount: isFinite(amount) ? amount : '',
    payment_type: String(row['Payment Type'] || '').trim(),
    payment_method: paymentMethod,
    payment_date: paymentDate,
    source_row_hash: sourceHash,
    source_row_number: sourceRowNumber,
    duplicate_group_size: duplicateGroupSize,
    duplicate_sequence: duplicateSequence,
    duplicate_status: duplicateStatus,
    included_in_summary: includedInSummary,
    is_reversal: isFinite(amount) && amount < 0,
    missing_payment_method: !paymentMethod,
    stage_normalized: rawStage !== blazeStage,
    outlier_review: isFinite(amount) && Math.abs(amount) >= 1000000,
    validation_error: validationErrors.join('; '),
    imported_at: importedAt,
    active: true
  };
}

function buildPaymentSummaries_(transactions, importedAt) {
  const byJobId = {};
  transactions.forEach(function(row) {
    if (!row.blaze_job_id || row.validation_error) return;
    if (!byJobId[row.blaze_job_id]) byJobId[row.blaze_job_id] = [];
    byJobId[row.blaze_job_id].push(row);
  });

  return Object.keys(byJobId).map(function(blazeJobId) {
    const rows = byJobId[blazeJobId].slice().sort(function(left, right) {
      return String(right.payment_date).localeCompare(String(left.payment_date));
    });
    const latest = rows[0];
    const gross = rows.reduce(function(sum, row) { return sum + Math.max(Number(row.payment_amount || 0), 0); }, 0);
    const net = rows.reduce(function(sum, row) { return sum + Number(row.payment_amount || 0); }, 0);
    const reversals = rows.filter(function(row) { return row.is_reversal; });
    return {
      blaze_job_id: blazeJobId,
      job_number: latest.job_number,
      job_link: latest.job_link,
      region: latest.region,
      sales_rep: latest.sales_rep,
      customer: latest.customer,
      blaze_stage: latest.blaze_stage,
      stage_enter_date: latest.stage_enter_date,
      days_in_current_stage: latest.days_in_current_stage,
      gross_payments: roundCurrency_(gross),
      net_payments_received: roundCurrency_(net),
      latest_payment_date: latest.payment_date,
      payment_count: rows.length,
      latest_payment_type: latest.payment_type,
      latest_payment_method: latest.payment_method,
      reversal_count: reversals.length,
      reversal_amount: roundCurrency_(reversals.reduce(function(sum, row) { return sum + Math.abs(Number(row.payment_amount || 0)); }, 0)),
      has_reversal: reversals.length > 0,
      net_payment_zero: Math.abs(net) < 0.005,
      outlier_review: rows.some(function(row) { return row.outlier_review; }),
      last_imported_at: importedAt,
      active: true
    };
  }).sort(function(left, right) {
    return String(left.job_number).localeCompare(String(right.job_number));
  });
}

function extractBlazeJobId_(jobLink) {
  const match = String(jobLink || '').match(/\/job-dashboard\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:[\/?#]|$)/i);
  return match ? match[1].toLowerCase() : '';
}

function normalizeBlazeStage_(value) {
  const compact = String(value || '').trim().replace(/\s+/g, ' ');
  if (compact.toLowerCase() === 'waiting for payment') return 'Waiting for Payment';
  return compact;
}

function normalizeSourceDate_(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return iso[1] + '-' + iso[2] + '-' + iso[3];
  const mdy = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
  if (!mdy) return '';
  const year = Number(mdy[3]) < 100 ? 2000 + Number(mdy[3]) : Number(mdy[3]);
  const month = Number(mdy[1]);
  const day = Number(mdy[2]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return '';
  return Utilities.formatDate(date, 'UTC', 'yyyy-MM-dd');
}

function sha256Hex_(value) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(value || ''), Utilities.Charset.UTF_8)
    .map(function(byte) { return ((byte + 256) % 256).toString(16).padStart(2, '0'); })
    .join('');
}

function roundCurrency_(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function replaceSheetObjects_(spreadsheetId, sheetName, headers, records) {
  const sheet = getRequiredSheet_(spreadsheetId, sheetName);
  const existingRows = Math.max(sheet.getLastRow() - 1, 0);
  if (existingRows) sheet.getRange(2, 1, existingRows, Math.max(sheet.getLastColumn(), headers.length)).clearContent();
  if (!records.length) return;
  sheet.getRange(2, 1, records.length, headers.length).setValues(records.map(function(record) {
    return headers.map(function(header) {
      return Object.prototype.hasOwnProperty.call(record, header) ? record[header] : '';
    });
  }));
}

function setupRegistrationsSheet() {
  const spreadsheetId = getRegistrationsSpreadsheetId_();
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.registrationRequests, REGISTRATION_REQUEST_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.activeRegistrations, ACTIVE_REGISTRATION_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.registrationNotes, REGISTRATION_NOTE_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.registrationAlerts, REGISTRATION_ALERT_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.registrationFollowUps, REGISTRATION_FOLLOWUP_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.registrationBanners, REGISTRATION_BANNER_HEADERS);
  return { spreadsheet_id: spreadsheetId, sheets: [SHEETS.registrationRequests, SHEETS.activeRegistrations, SHEETS.registrationNotes, SHEETS.registrationAlerts, SHEETS.registrationFollowUps, SHEETS.registrationBanners] };
}

function getRegistrations() {
  const spreadsheetId = getRegistrationsSpreadsheetId_();
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.registrationRequests, REGISTRATION_REQUEST_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.activeRegistrations, ACTIVE_REGISTRATION_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.registrationBanners, REGISTRATION_BANNER_HEADERS);
  const requests = sheetExists_(spreadsheetId, SHEETS.registrationRequests) ? readSheetObjects_(spreadsheetId, SHEETS.registrationRequests).map(mapRegistrationRequest_) : [];
  const activeRegistrations = sheetExists_(spreadsheetId, SHEETS.activeRegistrations) ? readSheetObjects_(spreadsheetId, SHEETS.activeRegistrations).map(mapActiveRegistration_) : [];
  const notes = sheetExists_(spreadsheetId, SHEETS.registrationNotes) ? readSheetObjects_(spreadsheetId, SHEETS.registrationNotes) : [];
  const alerts = sheetExists_(spreadsheetId, SHEETS.registrationAlerts) ? readSheetObjects_(spreadsheetId, SHEETS.registrationAlerts).filter(isActiveRow_) : [];
  const followUps = sheetExists_(spreadsheetId, SHEETS.registrationFollowUps) ? readSheetObjects_(spreadsheetId, SHEETS.registrationFollowUps).filter(isActiveRow_) : [];
  const banners = readSheetObjects_(spreadsheetId, SHEETS.registrationBanners).filter(isActiveBanner_);
  const openRequests = requests.filter(function(row) {
    const status = String(row.status || '').toLowerCase();
    return status !== 'active' && status !== 'archived' && isActiveRow_(row);
  });
  const archivedRequests = requests.filter(function(row) {
    return String(row.status || '').toLowerCase() === 'archived' || !isActiveRow_(row);
  });
  const openAlertCount = alerts.length + followUps.filter(function(row) { return String(row.status || '').toLowerCase() !== 'completed'; }).length;
  return {
    requests: requests,
    openRequests: openRequests,
    activeRegistrations: activeRegistrations.filter(function(row) { return String(row.status || '').toLowerCase() !== 'archived' && isActiveRow_(row); }),
    archivedRequests: archivedRequests,
    notes: notes,
    alerts: alerts,
    followUps: followUps,
    banners: banners,
    metrics: {
      open_alerts: openAlertCount,
      new_requests: openRequests.filter(function(row) { return String(row.status || '').toLowerCase() === 'new'; }).length,
      open_requests: openRequests.length,
      active_registrations: activeRegistrations.filter(function(row) { return String(row.status || '').toLowerCase() !== 'archived' && isActiveRow_(row); }).length,
      archived_requests: archivedRequests.length
    }
  };
}

function saveRegistrationBanner(payload) {
  payload = payload || {};
  const message = String(payload.message || '').trim();
  if (!message) throw new Error('Banner message is required.');

  const spreadsheetId = getRegistrationsSpreadsheetId_();
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.registrationBanners, REGISTRATION_BANNER_HEADERS);
  const record = {
    banner_id: makeId_('banner'),
    regions: normalizeBannerRegions_(payload.regions),
    message: message,
    status: 'Active',
    active_at: new Date(),
    active_by: resolveBannerActor_(payload.active_by),
    removed_at: '',
    removed_by: '',
    active: true
  };
  appendObject_(spreadsheetId, SHEETS.registrationBanners, record);
  return record;
}

function removeRegistrationBanner(payload) {
  payload = payload || {};
  if (!payload.banner_id) throw new Error('banner_id is required.');

  const spreadsheetId = getRegistrationsSpreadsheetId_();
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.registrationBanners, REGISTRATION_BANNER_HEADERS);
  const sheet = getRequiredSheet_(spreadsheetId, SHEETS.registrationBanners);
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(normalizeHeader_);
  const idIndex = headers.indexOf('banner_id');
  if (idIndex < 0) throw new Error('RegistrationBanners is missing banner_id.');

  for (let rowIndex = 1; rowIndex < values.length; rowIndex++) {
    if (String(values[rowIndex][idIndex]) !== String(payload.banner_id)) continue;
    const record = {};
    const updatedRow = values[rowIndex].slice();
    const changes = {
      status: 'Removed',
      removed_at: new Date(),
      removed_by: resolveBannerActor_(payload.removed_by),
      active: false
    };
    headers.forEach(function(header, columnIndex) {
      if (Object.prototype.hasOwnProperty.call(changes, header)) updatedRow[columnIndex] = changes[header];
      record[header] = updatedRow[columnIndex];
    });
    sheet.getRange(rowIndex + 1, 1, 1, headers.length).setValues([updatedRow]);
    return record;
  }
  throw new Error('Banner not found: ' + payload.banner_id);
}

function normalizeBannerRegions_(value) {
  const regions = String(value || '').split('|').map(function(region) {
    return String(region || '').trim().toUpperCase();
  }).filter(Boolean);
  if (!regions.length || regions.indexOf('ALL') > -1) return 'ALL';
  const unique = [];
  regions.forEach(function(region) {
    const normalized = normalizeCitadelRegion_(region);
    if (normalized && unique.indexOf(normalized) === -1) unique.push(normalized);
  });
  if (!unique.length) throw new Error('Select at least one region.');
  return unique.join('|');
}

function resolveBannerActor_(providedActor) {
  const provided = String(providedActor || '').trim();
  if (provided) return provided;
  const activeUser = Session.getActiveUser().getEmail();
  return activeUser || 'Citadel User';
}

function isActiveBanner_(row) {
  return isActiveRow_(row) && String(row.status || '').toLowerCase() !== 'removed';
}

function saveRegistrationRequest(payload) {
  payload = payload || {};
  const spreadsheetId = getRegistrationsSpreadsheetId_();
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.registrationRequests, REGISTRATION_REQUEST_HEADERS);
  const stateCode = String(payload.state || '').trim().toUpperCase();
  const licenseScope = normalizeLicenseScope_(payload.license_scope, payload.jurisdiction, stateCode);
  const jurisdiction = licenseScope === 'Statewide' ? '' : String(payload.jurisdiction || '').trim();
  if (!stateCode) throw new Error('State is required.');
  if (!licenseScope) throw new Error('License scope is required.');
  if (licenseScope === 'Local Jurisdiction' && !jurisdiction) throw new Error('Jurisdiction is required for a local license.');
  const record = {
    request_id: payload.request_id || makeId_('REG'),
    submitted_at: payload.submitted_at || new Date(),
    requestor_name: payload.requestor_name || payload.requestor || payload.submitted_by || '',
    brand: payload.brand || '',
    date_submitted: payload.date_submitted || today_(),
    region: normalizeCitadelRegion_(payload.region || ''),
    state: stateCode,
    license_scope: licenseScope,
    pure: payload.pure || '',
    jurisdiction: jurisdiction,
    requirements: payload.requirements || '',
    website: payload.website || '',
    phone: payload.phone || '',
    email: payload.email || '',
    notes: payload.notes || '',
    status: payload.status || 'New',
    stage: payload.stage || 'New',
    assigned_to: payload.assigned_to || 'Emma',
    status_updated_by: payload.status_updated_by || payload.assigned_to || 'Emma',
    status_updated_at: payload.status_updated_at || payload.submitted_at || new Date(),
    completed_date: '',
    active: true,
    source_system: payload.source_system || 'Citadel',
    source_record_id: payload.source_record_id || '',
    reopened_from_request_id: '',
    research_verified_at: '',
    research_verified_by: '',
    received_date: '',
    researched_date: '',
    submitted_license_date: '',
    license_received_date: '',
    archived_date: '',
    renewal_due_date: '',
    renewal_status: '',
    renewal_owner: '',
    renewal_notes: '',
    renewal_started_date: '',
    renewal_submitted_date: '',
    renewal_received_date: '',
    archive_reason: '',
    license_type_name: '',
    license_number: '',
    expiration: '',
    qualifier: '',
    continuing_education_hours: '',
    elite_owned: '',
    expires_soon_flag: '',
    expired_flag: '',
    license_category: '',
    license_action: '',
    bond_type: '',
    coi_type: '',
    payment_status: '',
    payment_method: '',
    documents_included: '',
    submission_method: '',
    research_notes: '',
    received_license_name: '',
    received_license_state: '',
    received_license_type: '',
    ce_due_date: '',
    ce_reminder_days: '',
    ce_reminder_date: ''
  };
  appendObject_(spreadsheetId, SHEETS.registrationRequests, record);
  return record;
}

function restartRegistrationRequest(payload) {
  payload = payload || {};
  if (!payload.request_id) throw new Error('request_id is required.');
  const mode = String(payload.restart_mode || 'fresh');
  if (['fresh', 'reuse_research'].indexOf(mode) === -1) throw new Error('Invalid restart_mode.');

  const spreadsheetId = getRegistrationsSpreadsheetId_();
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.registrationRequests, REGISTRATION_REQUEST_HEADERS);
  const requests = readSheetObjects_(spreadsheetId, SHEETS.registrationRequests);
  const source = requests.find(function(row) { return String(row.request_id) === String(payload.request_id); });
  if (!source) throw new Error('Archived registration request not found: ' + payload.request_id);
  if (String(source.status || '').trim().toLowerCase() !== 'archived') throw new Error('Only archived requests can be restarted.');

  const now = new Date();
  const reuseResearch = mode === 'reuse_research';
  const verifiedBy = payload.research_verified_by || payload.updated_by || source.assigned_to || 'Emma';
  const record = {};
  REGISTRATION_REQUEST_HEADERS.forEach(function(header) { record[header] = ''; });
  Object.assign(record, {
    request_id: makeId_('REG'),
    submitted_at: now,
    requestor_name: source.requestor_name || '',
    brand: source.brand || '',
    date_submitted: now,
    region: normalizeCitadelRegion_(source.region || ''),
    state: String(source.state || source.received_license_state || '').trim().toUpperCase(),
    license_scope: normalizeLicenseScope_(source.license_scope, source.jurisdiction, source.state || source.received_license_state),
    pure: source.pure || '',
    jurisdiction: source.jurisdiction || '',
    requirements: source.requirements || '',
    website: source.website || '',
    phone: source.phone || '',
    email: source.email || '',
    status: reuseResearch ? 'Researched' : 'New',
    stage: reuseResearch ? 'Researched' : 'New',
    assigned_to: source.assigned_to || 'Emma',
    status_updated_by: verifiedBy,
    status_updated_at: now,
    active: true,
    source_system: 'Citadel Restart',
    source_record_id: source.request_id,
    reopened_from_request_id: source.request_id,
    research_verified_at: reuseResearch ? now : '',
    research_verified_by: reuseResearch ? verifiedBy : '',
    researched_date: reuseResearch ? now : '',
    license_category: reuseResearch ? (source.license_category || '') : '',
    license_action: reuseResearch ? (source.license_action || '') : '',
    bond_type: reuseResearch ? (source.bond_type || '') : '',
    coi_type: reuseResearch ? (source.coi_type || '') : '',
    payment_status: reuseResearch ? (source.payment_status || '') : '',
    payment_method: reuseResearch ? (source.payment_method || '') : '',
    documents_included: reuseResearch ? (source.documents_included || '') : '',
    submission_method: reuseResearch ? (source.submission_method || '') : '',
    research_notes: reuseResearch ? (source.research_notes || '') : ''
  });

  appendObject_(spreadsheetId, SHEETS.registrationRequests, record);
  return {
    request_id: record.request_id,
    reopened_from_request_id: source.request_id,
    restart_mode: mode,
    status: record.status,
    stage: record.stage
  };
}

function updateRegistrationRequest(payload) {
  payload = payload || {};
  if (!payload.request_id) throw new Error('request_id is required.');
  const spreadsheetId = getRegistrationsSpreadsheetId_();
  const sheet = getRequiredSheet_(spreadsheetId, SHEETS.registrationRequests);
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(normalizeHeader_);
  const idIndex = headers.indexOf('request_id');
  if (idIndex < 0) throw new Error('RegistrationRequests is missing request_id.');
  for (let rowIndex = 1; rowIndex < values.length; rowIndex++) {
    if (String(values[rowIndex][idIndex]) === String(payload.request_id)) {
      const updatedRecord = {};
      const updatedRow = values[rowIndex].slice();
      headers.forEach(function(header, columnIndex) {
        if (header && Object.prototype.hasOwnProperty.call(payload, header)) {
          updatedRow[columnIndex] = payload[header];
        }
        if (header) updatedRecord[header] = updatedRow[columnIndex];
      });
      sheet.getRange(rowIndex + 1, 1, 1, headers.length).setValues([updatedRow]);
      syncActiveRegistrationFromRequest_(spreadsheetId, updatedRecord);
      return { request_id: payload.request_id, updated: true };
    }
  }
  throw new Error('Registration request not found: ' + payload.request_id);
}

function syncActiveRegistrationFromRequest_(spreadsheetId, request) {
  const status = String(request.status || '').trim();
  const lifecycleStatus = status.toLowerCase();
  if (['active', 'renewal', 'renewal submitted', 'renewal received', 'archived'].indexOf(lifecycleStatus) < 0) return;

  ensureSheetWithHeaders_(spreadsheetId, SHEETS.activeRegistrations, ACTIVE_REGISTRATION_HEADERS);
  const archived = lifecycleStatus === 'archived' || String(request.active).toLowerCase() === 'false';
  const licenseName = request.received_license_name || request.license_type_name || request.license_category || '';
  const record = {
    registration_id: 'ACTIVE-' + request.request_id,
    request_id: request.request_id,
    brand: request.brand || '',
    state: request.received_license_state || request.state || '',
    license_scope: normalizeLicenseScope_(request.license_scope, request.jurisdiction, request.received_license_state || request.state),
    region: request.region || '',
    jurisdiction: request.jurisdiction || '',
    license_name: licenseName,
    license_type_name: licenseName,
    number: request.license_number || '',
    license_number: request.license_number || '',
    expiration: request.expiration || '',
    qualifier: request.qualifier || '',
    type: request.received_license_type || '',
    pure: request.pure || '',
    continuing_education_hours: request.continuing_education_hours || '',
    elite_owned: request.elite_owned || '',
    expires_soon_flag: request.expires_soon_flag || '',
    expired_flag: request.expired_flag || '',
    status: status || 'Active',
    stage: request.stage || status || 'Active',
    source_system: 'Citadel',
    source_record_id: request.request_id,
    created_at: request.completed_date || request.status_updated_at || new Date(),
    last_updated: request.status_updated_at || new Date(),
    archived_date: request.archived_date || '',
    active: !archived,
    requestor_name: request.requestor_name || '',
    website: request.website || '',
    phone: request.phone || '',
    email: request.email || '',
    requirements: request.requirements || '',
    notes: request.notes || '',
    date_submitted: request.date_submitted || request.submitted_at || '',
    received_date: request.received_date || '',
    researched_date: request.researched_date || '',
    submitted_license_date: request.submitted_license_date || '',
    license_received_date: request.license_received_date || '',
    completed_date: request.completed_date || '',
    received_license_name: request.received_license_name || '',
    received_license_state: request.received_license_state || '',
    received_license_type: request.received_license_type || '',
    ce_due_date: request.ce_due_date || '',
    ce_reminder_days: request.ce_reminder_days || '',
    ce_reminder_date: request.ce_reminder_date || '',
    renewal_due_date: request.renewal_due_date || '',
    renewal_status: request.renewal_status || '',
    renewal_owner: request.renewal_owner || '',
    renewal_notes: request.renewal_notes || '',
    renewal_started_date: request.renewal_started_date || '',
    renewal_submitted_date: request.renewal_submitted_date || '',
    renewal_received_date: request.renewal_received_date || '',
    archive_reason: request.archive_reason || '',
    license_category: request.license_category || '',
    license_action: request.license_action || '',
    bond_type: request.bond_type || '',
    coi_type: request.coi_type || '',
    payment_status: request.payment_status || '',
    payment_method: request.payment_method || '',
    documents_included: request.documents_included || '',
    submission_method: request.submission_method || '',
    research_notes: request.research_notes || '',
    status_updated_by: request.status_updated_by || '',
    status_updated_at: request.status_updated_at || ''
  };
  upsertSheetObject_(spreadsheetId, SHEETS.activeRegistrations, 'request_id', request.request_id, record);
}

function upsertSheetObject_(spreadsheetId, sheetName, keyHeader, keyValue, record) {
  const sheet = getRequiredSheet_(spreadsheetId, sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(normalizeHeader_);
  const keyIndex = headers.indexOf(keyHeader);
  if (keyIndex < 0) throw new Error(sheetName + ' is missing ' + keyHeader + '.');
  for (let rowIndex = 1; rowIndex < values.length; rowIndex++) {
    if (String(values[rowIndex][keyIndex]) !== String(keyValue)) continue;
    const updatedRow = values[rowIndex].slice();
    headers.forEach(function(header, columnIndex) {
      if (header && Object.prototype.hasOwnProperty.call(record, header)) updatedRow[columnIndex] = record[header];
    });
    sheet.getRange(rowIndex + 1, 1, 1, headers.length).setValues([updatedRow]);
    return;
  }
  appendObject_(spreadsheetId, sheetName, record);
}

function mapRegistrationRequest_(row) {
  const status = getField_(row, ['status']) || 'New';
  const dateSubmitted = getField_(row, ['date_submitted', 'requested_date', 'submitted_at', 'date']);
  return {
    request_id: getField_(row, ['request_id', 'id']) || makeIdFromText_('REG', [getField_(row, ['brand']), getField_(row, ['jurisdiction']), dateSubmitted].join('|')),
    submitted_at: getField_(row, ['submitted_at', 'created_at']) || dateSubmitted,
    requestor_name: getField_(row, ['requestor_name', 'requestor', 'submitted_by', 'name']),
    brand: getField_(row, ['brand']),
    date_submitted: dateSubmitted,
    region: normalizeCitadelRegion_(getField_(row, ['region'])),
    state: getField_(row, ['state', 'received_license_state']),
    license_scope: normalizeLicenseScope_(getField_(row, ['license_scope', 'scope']), getField_(row, ['jurisdiction']), getField_(row, ['state', 'received_license_state'])),
    pure: getField_(row, ['pure']),
    jurisdiction: getField_(row, ['jurisdiction']),
    requirements: getField_(row, ['requirements']),
    website: getField_(row, ['website']),
    phone: getField_(row, ['phone']),
    email: getField_(row, ['email']),
    notes: getField_(row, ['notes']),
    status: status,
    stage: getField_(row, ['stage']) || status,
    assigned_to: getField_(row, ['assigned_to']) || 'Emma',
    status_updated_by: getField_(row, ['status_updated_by']),
    status_updated_at: getField_(row, ['status_updated_at', 'last_updated']) || dateSubmitted,
    completed_date: getField_(row, ['completed_date']),
    active: getField_(row, ['active']) === '' ? true : getField_(row, ['active']),
    reopened_from_request_id: getField_(row, ['reopened_from_request_id']),
    research_verified_at: getField_(row, ['research_verified_at']),
    research_verified_by: getField_(row, ['research_verified_by']),
    received_date: getField_(row, ['received_date']),
    researched_date: getField_(row, ['researched_date']),
    submitted_license_date: getField_(row, ['submitted_license_date']),
    license_received_date: getField_(row, ['license_received_date']),
    archived_date: getField_(row, ['archived_date']),
    renewal_due_date: getField_(row, ['renewal_due_date']),
    renewal_status: getField_(row, ['renewal_status']),
    renewal_owner: getField_(row, ['renewal_owner']),
    renewal_notes: getField_(row, ['renewal_notes']),
    renewal_started_date: getField_(row, ['renewal_started_date']),
    renewal_submitted_date: getField_(row, ['renewal_submitted_date']),
    renewal_received_date: getField_(row, ['renewal_received_date']),
    archive_reason: getField_(row, ['archive_reason']),
    license_type_name: getField_(row, ['license_type_name', 'license type name']),
    license_number: getField_(row, ['license_number', 'number']),
    expiration: getField_(row, ['expiration']),
    qualifier: getField_(row, ['qualifier']),
    continuing_education_hours: getField_(row, ['continuing_education_hours']),
    elite_owned: getField_(row, ['elite_owned']),
    expires_soon_flag: getField_(row, ['expires_soon_flag', 'expired in 30 days']),
    expired_flag: getField_(row, ['expired_flag', 'expires within 7 days or expired']),
    license_category: getField_(row, ['license_category']),
    license_action: getField_(row, ['license_action']),
    bond_type: getField_(row, ['bond_type']),
    coi_type: getField_(row, ['coi_type']),
    payment_status: getField_(row, ['payment_status']),
    payment_method: getField_(row, ['payment_method']),
    documents_included: getField_(row, ['documents_included']),
    submission_method: getField_(row, ['submission_method']),
    research_notes: getField_(row, ['research_notes']),
    received_license_name: getField_(row, ['received_license_name']),
    received_license_state: getField_(row, ['received_license_state']),
    received_license_type: getField_(row, ['received_license_type']),
    ce_due_date: getField_(row, ['ce_due_date']),
    ce_reminder_days: getField_(row, ['ce_reminder_days']),
    ce_reminder_date: getField_(row, ['ce_reminder_date'])
  };
}

function mapActiveRegistration_(row) {
  return {
    registration_id: getField_(row, ['registration_id']) || makeIdFromText_('ACTIVE-REG', [getField_(row, ['brand']), getField_(row, ['jurisdiction']), getField_(row, ['number', 'license_number'])].join('|')),
    request_id: getField_(row, ['request_id']),
    brand: getField_(row, ['brand']),
    state: getField_(row, ['state']),
    license_scope: normalizeLicenseScope_(getField_(row, ['license_scope', 'scope']), getField_(row, ['jurisdiction']), getField_(row, ['state', 'received_license_state'])),
    region: normalizeCitadelRegion_(getField_(row, ['region', 'state'])),
    jurisdiction: getField_(row, ['jurisdiction']),
    license_name: getField_(row, ['license_name', 'license_type_name', 'license type name']),
    license_type_name: getField_(row, ['license_type_name', 'license type name']),
    number: getField_(row, ['number', 'license_number']),
    license_number: getField_(row, ['license_number', 'number']),
    expiration: getField_(row, ['expiration']),
    qualifier: getField_(row, ['qualifier']),
    type: getField_(row, ['type', 'received_license_type']),
    pure: getField_(row, ['pure']),
    continuing_education_hours: getField_(row, ['continuing_education_hours']),
    elite_owned: getField_(row, ['elite_owned']),
    expires_soon_flag: getField_(row, ['expires_soon_flag', 'expired in 30 days']),
    expired_flag: getField_(row, ['expired_flag', 'expires within 7 days or expired']),
    status: getField_(row, ['status']) || 'Active',
    stage: getField_(row, ['stage']) || 'Active',
    last_updated: getField_(row, ['last_updated', 'created_at']),
    active: getField_(row, ['active']) === '' ? true : getField_(row, ['active']),
    requestor_name: getField_(row, ['requestor_name']),
    website: getField_(row, ['website']),
    phone: getField_(row, ['phone']),
    email: getField_(row, ['email']),
    requirements: getField_(row, ['requirements']),
    notes: getField_(row, ['notes']),
    date_submitted: getField_(row, ['date_submitted', 'created_at']),
    received_date: getField_(row, ['received_date']),
    researched_date: getField_(row, ['researched_date']),
    submitted_license_date: getField_(row, ['submitted_license_date']),
    license_received_date: getField_(row, ['license_received_date']),
    completed_date: getField_(row, ['completed_date', 'created_at']),
    archived_date: getField_(row, ['archived_date']),
    received_license_name: getField_(row, ['received_license_name', 'license_name']),
    received_license_state: getField_(row, ['received_license_state', 'state']),
    received_license_type: getField_(row, ['received_license_type', 'type']),
    ce_due_date: getField_(row, ['ce_due_date']),
    ce_reminder_days: getField_(row, ['ce_reminder_days']),
    ce_reminder_date: getField_(row, ['ce_reminder_date']),
    renewal_due_date: getField_(row, ['renewal_due_date']),
    renewal_status: getField_(row, ['renewal_status']),
    renewal_owner: getField_(row, ['renewal_owner']),
    renewal_notes: getField_(row, ['renewal_notes']),
    renewal_started_date: getField_(row, ['renewal_started_date']),
    renewal_submitted_date: getField_(row, ['renewal_submitted_date']),
    renewal_received_date: getField_(row, ['renewal_received_date']),
    archive_reason: getField_(row, ['archive_reason']),
    license_category: getField_(row, ['license_category']),
    license_action: getField_(row, ['license_action']),
    bond_type: getField_(row, ['bond_type']),
    coi_type: getField_(row, ['coi_type']),
    payment_status: getField_(row, ['payment_status']),
    payment_method: getField_(row, ['payment_method']),
    documents_included: getField_(row, ['documents_included']),
    submission_method: getField_(row, ['submission_method']),
    research_notes: getField_(row, ['research_notes']),
    status_updated_by: getField_(row, ['status_updated_by']),
    status_updated_at: getField_(row, ['status_updated_at', 'last_updated'])
  };
}

function getRegistrationsSpreadsheetId_() {
  const spreadsheetId = SPREADSHEETS.registrations;
  if (!spreadsheetId) throw new Error('Registrations spreadsheet ID is not configured yet.');
  return spreadsheetId;
}

function getPaymentsSpreadsheetId_() {
  const spreadsheetId = SPREADSHEETS.payments;
  if (!spreadsheetId) throw new Error('Payments spreadsheet ID is not configured yet.');
  return spreadsheetId;
}

function normalizeLicenseScope_(value, jurisdiction, stateCode) {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'statewide' || normalized === 'state') return 'Statewide';
  if (normalized === 'local jurisdiction' || normalized === 'local' || normalized === 'jurisdiction') return 'Local Jurisdiction';
  if (String(jurisdiction || '').trim()) return 'Local Jurisdiction';
  return String(stateCode || '').trim() ? 'Statewide' : '';
}

function normalizeCitadelRegion_(value) {
  const text = String(value || '').trim();
  const upper = text.toUpperCase();
  const map = [
    ['PHX', ['PHX', 'PHOENIX', 'ARIZONA', 'AZ']],
    ['STL', ['STL', 'ST LOUIS', 'SAINT LOUIS', 'MISSOURI', 'MO']],
    ['MIL', ['MIL', 'MILWAUKEE', 'WISCONSIN', 'WI']],
    ['CLE', ['CLE', 'CLEVELAND', 'OHIO', 'OH']],
    ['CHI', ['CHI', 'CHICAGO', 'ILLINOIS', 'IL']],
    ['MIN', ['MIN', 'MINNEAPOLIS', 'MINNESOTA', 'MN']],
    ['ABQ', ['ABQ', 'ALBUQUERQUE', 'NEW MEXICO', 'NM']],
    ['PIT', ['PIT', 'PITTSBURGH', 'PENNSYLVANIA', 'PA']],
    ['IND', ['IND', 'INDIANAPOLIS', 'INDIANA', 'IN']]
  ];
  for (let i = 0; i < map.length; i++) {
    if (map[i][1].some(function(token) { return upper.indexOf(token) > -1 || upper === token; })) return map[i][0];
  }
  return text ? 'OT' : '';
}

function setupReviewsSheet() {
  const spreadsheetId = getReviewsSpreadsheetId_();
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.reviewRecords, REVIEW_RECORD_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.reviewNotes, REVIEW_NOTE_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.reviewAlerts, REVIEW_ALERT_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.reviewFollowUps, REVIEW_FOLLOWUP_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.reviewMetrics, REVIEW_METRIC_HEADERS);
  return { spreadsheet_id: spreadsheetId, sheets: [SHEETS.reviewRecords, SHEETS.reviewNotes, SHEETS.reviewAlerts, SHEETS.reviewFollowUps, SHEETS.reviewMetrics] };
}

function getReviewSourceSheetName_(spreadsheetId) {
  const ss = SpreadsheetApp.openById(spreadsheetId);
  const recordSheet = ss.getSheetByName(SHEETS.reviewRecords);
  if (recordSheet && recordSheet.getLastRow() > 1) return SHEETS.reviewRecords;
  const workflowNames = [SHEETS.reviewNotes, SHEETS.reviewAlerts, SHEETS.reviewFollowUps, SHEETS.reviewMetrics];
  const source = ss.getSheets().find(function(sheet) { return workflowNames.indexOf(sheet.getName()) === -1 && sheet.getLastRow() > 1; });
  return source ? source.getName() : (recordSheet ? SHEETS.reviewRecords : ss.getSheets()[0].getName());
}

function getReviews() {
  const spreadsheetId = getReviewsSpreadsheetId_();
  const sourceSheet = getReviewSourceSheetName_(spreadsheetId);
  const rawRecords = readSheetObjects_(spreadsheetId, sourceSheet);
  const notes = sheetExists_(spreadsheetId, SHEETS.reviewNotes) ? readSheetObjects_(spreadsheetId, SHEETS.reviewNotes) : [];
  const alerts = sheetExists_(spreadsheetId, SHEETS.reviewAlerts) ? readSheetObjects_(spreadsheetId, SHEETS.reviewAlerts) : [];
  const followUps = sheetExists_(spreadsheetId, SHEETS.reviewFollowUps) ? readSheetObjects_(spreadsheetId, SHEETS.reviewFollowUps) : [];
  const records = rawRecords.map(mapReviewRecord_).filter(function(row) { return row.review_name || row.customer; });
  const activeAlerts = alerts.filter(isActiveRow_);
  const activeFollowUps = followUps.filter(isActiveRow_);
  const latestNoteByReview = latestById_(notes, 'review_id', 'note_date');
  return {
    metrics: sheetExists_(spreadsheetId, SHEETS.reviewMetrics) ? readSheetObjects_(spreadsheetId, SHEETS.reviewMetrics).sort(sortByOrder_) : buildReviewMetrics_(records, activeAlerts, activeFollowUps),
    notes: notes,
    alerts: activeAlerts,
    followUps: activeFollowUps,
    records: records.map(function(record) {
      const note = latestNoteByReview[String(record.review_id)] || {};
      record.workflow_note = note.note_text || '';
      record.notes_count = notes.filter(function(item) { return String(item.review_id) === String(record.review_id); }).length;
      record.alerts_count = activeAlerts.filter(function(item) { return String(item.review_id) === String(record.review_id); }).length;
      record.followups_count = activeFollowUps.filter(function(item) { return String(item.review_id) === String(record.review_id); }).length;
      return record;
    })
  };
}

function mapReviewRecord_(row) {
  const platform = getField_(row, ['platform']);
  const name = getField_(row, ['name', 'customer', 'customer_name']);
  const rating = getField_(row, ['rating']);
  const title = getField_(row, ['review_title', 'review title', 'title']);
  const text = getField_(row, ['review_text', 'review text', 'text']);
  const reviewDate = getField_(row, ['review_date', 'review date', 'date']);
  const url = getField_(row, ['review_url', 'review url', 'url']);
  const monitor = getField_(row, ['monitor']);
  const key = String(platform || '') + '|' + String(name || '') + '|' + String(title || '') + '|' + String(reviewDate || '') + '|' + String(text || '').slice(0, 80);
  const score = Number(String(rating || '').replace(/[^0-9.]/g, '')) || '';
  const result = score && score < 4 ? 'Needs Review' : 'Monitor';
  return {
    review_id: 'REV-' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, key)).slice(0, 12),
    monitor: monitor,
    platform: platform,
    review_name: title || name || platform,
    customer: name,
    region: platform,
    owner: 'Carlynn',
    status: result,
    result: result,
    score: rating,
    rating: rating,
    review_title: title,
    review_text: text,
    review_date: reviewDate,
    review_url: url,
    due_date: '',
    last_updated: getField_(row, ['created_at', 'created at']) || reviewDate || today_(),
    source_system: 'Reviews sheet',
    source_record_id: key,
    active: true
  };
}
function buildReviewMetrics_(records, alerts, followUps) {
  const findings = records.filter(function(row) { return /finding|exception|fail|recheck/i.test(String(row.result || row.status || '')); }).length;
  const due = records.filter(function(row) { return isDateWithinDays_(row.due_date, 7); }).length;
  return [
    { metric_key: 'reviews', label: 'Reviews', value: records.length, note: 'Current records', tone: 'blue', sort_order: 1 },
    { metric_key: 'findings', label: 'Findings', value: findings, note: 'Need attention', tone: 'amber', sort_order: 2 },
    { metric_key: 'due_soon', label: 'Due Soon', value: due, note: 'Next 7 days', tone: 'silver', sort_order: 3 },
    { metric_key: 'open_alerts', label: 'Open Alerts', value: alerts.length + followUps.length, note: 'Alerts + follow-ups', tone: 'red', sort_order: 4 }
  ];
}

function saveReviewNote(payload) {
  if (!payload || !payload.review_id) throw new Error('review_id is required.');
  const record = { note_id: payload.note_id || makeId_('review-note'), review_id: payload.review_id, note_date: payload.note_date || today_(), note_by: payload.note_by || 'Amanda', note_type: payload.note_type || 'General', note_text: payload.note_text || '', follow_up_date: payload.follow_up_date || '', active: true };
  ensureSheetWithHeaders_(getReviewsSpreadsheetId_(), SHEETS.reviewNotes, REVIEW_NOTE_HEADERS);
  appendObject_(getReviewsSpreadsheetId_(), SHEETS.reviewNotes, record);
  return record;
}

function saveReviewAlert(payload) {
  if (!payload || !payload.review_id) throw new Error('review_id is required.');
  const record = { alert_id: payload.alert_id || makeId_('review-alert'), review_id: payload.review_id, alert_type: payload.alert_type || 'Review', alert_text: payload.alert_text || '', priority: payload.priority || 'Normal', owner: payload.owner || 'Carlynn', due_date: payload.due_date || '', status: payload.status || 'Open', created_date: today_(), resolved_date: '', active: true };
  ensureSheetWithHeaders_(getReviewsSpreadsheetId_(), SHEETS.reviewAlerts, REVIEW_ALERT_HEADERS);
  appendObject_(getReviewsSpreadsheetId_(), SHEETS.reviewAlerts, record);
  return record;
}

function saveReviewFollowUp(payload) {
  if (!payload || !payload.review_id) throw new Error('review_id is required.');
  const record = { followup_id: payload.followup_id || makeId_('review-followup'), review_id: payload.review_id, assigned_to: payload.assigned_to || 'Carlynn', due_date: payload.due_date || '', followup_type: payload.followup_type || 'Review', followup_text: payload.followup_text || '', status: payload.status || 'Open', created_by: payload.created_by || 'Amanda', created_date: today_(), completed_date: '', active: true };
  ensureSheetWithHeaders_(getReviewsSpreadsheetId_(), SHEETS.reviewFollowUps, REVIEW_FOLLOWUP_HEADERS);
  appendObject_(getReviewsSpreadsheetId_(), SHEETS.reviewFollowUps, record);
  return record;
}

function setupContractorsSheet() {
  const spreadsheetId = getContractorsSpreadsheetId_();
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.contractorRecords, CONTRACTOR_RECORD_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.contractorNotes, CONTRACTOR_NOTE_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.contractorAlerts, CONTRACTOR_ALERT_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.contractorFollowUps, CONTRACTOR_FOLLOWUP_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.contractorMetrics, CONTRACTOR_METRIC_HEADERS);
  return { spreadsheet_id: spreadsheetId, sheets: [SHEETS.contractorRecords, SHEETS.contractorNotes, SHEETS.contractorAlerts, SHEETS.contractorFollowUps, SHEETS.contractorMetrics] };
}

function getContractors() {
  const spreadsheetId = getContractorsSpreadsheetId_();
  const rawRecords = sheetExists_(spreadsheetId, SHEETS.contractorRecords) ? readSheetObjects_(spreadsheetId, SHEETS.contractorRecords) : [];
  const notes = sheetExists_(spreadsheetId, SHEETS.contractorNotes) ? readSheetObjects_(spreadsheetId, SHEETS.contractorNotes) : [];
  const alerts = sheetExists_(spreadsheetId, SHEETS.contractorAlerts) ? readSheetObjects_(spreadsheetId, SHEETS.contractorAlerts) : [];
  const followUps = sheetExists_(spreadsheetId, SHEETS.contractorFollowUps) ? readSheetObjects_(spreadsheetId, SHEETS.contractorFollowUps) : [];
  const records = rawRecords.map(mapContractorRecord_).filter(function(row) { return row.contractor_name; });
  const activeAlerts = alerts.filter(isActiveRow_);
  const activeFollowUps = followUps.filter(isActiveRow_);
  const latestNoteByContractor = latestById_(notes, 'contractor_id', 'note_date');
  return {
    metrics: sheetExists_(spreadsheetId, SHEETS.contractorMetrics) ? readSheetObjects_(spreadsheetId, SHEETS.contractorMetrics).sort(sortByOrder_) : buildContractorMetrics_(records, activeAlerts, activeFollowUps),
    notes: notes,
    alerts: activeAlerts,
    followUps: activeFollowUps,
    records: records.map(function(record) {
      const note = latestNoteByContractor[String(record.contractor_id)] || {};
      record.workflow_note = note.note_text || '';
      record.notes_count = notes.filter(function(item) { return String(item.contractor_id) === String(record.contractor_id); }).length;
      record.alerts_count = activeAlerts.filter(function(item) { return String(item.contractor_id) === String(record.contractor_id); }).length;
      record.followups_count = activeFollowUps.filter(function(item) { return String(item.contractor_id) === String(record.contractor_id); }).length;
      return record;
    })
  };
}

function mapContractorRecord_(row) {
  const name = getField_(row, ['contractor', 'contractor_name', 'company_name', 'name']);
  const glExpiry = getField_(row, ['gl_expiry', 'gl expiry', 'general_liability_expiration_date', 'general liability expiration date']);
  const wcExpiry = getField_(row, ['wc_expiry', 'wc expiry', 'workers_compensation_expiration_date', 'workers compensation expiration date']);
  const documents = getField_(row, ['documents', 'document_status', 'status']) || getContractorDocumentStatus_(glExpiry, wcExpiry);
  const risk = getField_(row, ['risk', 'risk_level']) || getContractorRisk_(documents, glExpiry, wcExpiry);
  return {
    contractor_id: getField_(row, ['contractor_id', 'id']) || makeContractorId_(name),
    contractor_name: name,
    phone: getField_(row, ['phone', 'crew_phone']),
    email: getField_(row, ['email', 'orders_email']),
    regions_raw: getField_(row, ['regions', 'regions_raw', 'region']),
    risk: risk,
    documents: documents,
    gl_expiry: glExpiry,
    wc_expiry: wcExpiry,
    next_action: getField_(row, ['next_action', 'next action']) || getContractorNextAction_(documents, glExpiry, wcExpiry),
    address: getField_(row, ['address', 'billing_address']),
    active: getField_(row, ['active', 'is_active']) || '',
    source_system: 'Blaze contractor report',
    last_updated: today_()
  };
}

function saveContractorNote(payload) {
  if (!payload || !payload.contractor_id) throw new Error('contractor_id is required.');
  const record = {
    note_id: payload.note_id || makeId_('contractor-note'),
    contractor_id: payload.contractor_id,
    note_date: payload.note_date || today_(),
    note_by: payload.note_by || 'Amanda',
    note_type: payload.note_type || 'General',
    note_text: payload.note_text || '',
    follow_up_date: payload.follow_up_date || '',
    active: true
  };
  appendObject_(getContractorsSpreadsheetId_(), SHEETS.contractorNotes, record);
  return record;
}

function saveContractorAlert(payload) {
  if (!payload || !payload.contractor_id) throw new Error('contractor_id is required.');
  const record = {
    alert_id: payload.alert_id || makeId_('contractor-alert'),
    contractor_id: payload.contractor_id,
    alert_type: payload.alert_type || 'Compliance',
    alert_text: payload.alert_text || '',
    priority: payload.priority || 'High',
    owner: payload.owner || 'Carlynn',
    due_date: payload.due_date || today_(),
    status: payload.status || 'Open',
    created_date: payload.created_date || today_(),
    resolved_date: payload.resolved_date || '',
    active: true
  };
  appendObject_(getContractorsSpreadsheetId_(), SHEETS.contractorAlerts, record);
  return record;
}

function saveContractorFollowUp(payload) {
  if (!payload || !payload.contractor_id) throw new Error('contractor_id is required.');
  const record = {
    followup_id: payload.followup_id || makeId_('contractor-followup'),
    contractor_id: payload.contractor_id,
    assigned_to: payload.assigned_to || 'Carlynn',
    due_date: payload.due_date || today_(),
    followup_type: payload.followup_type || 'Compliance',
    followup_text: payload.followup_text || '',
    status: payload.status || 'Open',
    created_by: payload.created_by || 'Amanda',
    created_date: payload.created_date || today_(),
    completed_date: payload.completed_date || '',
    active: true
  };
  appendObject_(getContractorsSpreadsheetId_(), SHEETS.contractorFollowUps, record);
  return record;
}

function buildContractorMetrics_(records, alerts, followUps) {
  const expired = records.filter(function(row) { return /expired/i.test(String(row.documents || '')); }).length;
  const expiringSoon = records.filter(function(row) { return isDateWithinDays_(row.gl_expiry, 30) || isDateWithinDays_(row.wc_expiry, 30); }).length;
  const highRisk = records.filter(function(row) { return /high|critical/i.test(String(row.risk || '')); }).length;
  const openWorkflow = (alerts || []).length + (followUps || []).length;
  return [
    { metric_key: 'total_contractors', label: 'Contractors', value: records.length, note: 'Current report records', tone: 'blue', sort_order: 1 },
    { metric_key: 'expired_docs', label: 'Expired Docs', value: expired, note: 'GL or WC expired', tone: 'red', sort_order: 2 },
    { metric_key: 'expiring_soon', label: 'Expiring Soon', value: expiringSoon, note: 'Next 30 days', tone: 'amber', sort_order: 3 },
    { metric_key: 'high_risk', label: 'High Risk', value: highRisk, note: 'Needs compliance review', tone: 'silver', sort_order: 4 },
    { metric_key: 'open_workflow', label: 'Open Alerts', value: openWorkflow, note: 'Alerts + follow-ups', tone: 'blue', sort_order: 5 }
  ];
}

function getContractorsSpreadsheetId_() {
  const spreadsheetId = SPREADSHEETS.contractors;
  if (!spreadsheetId || spreadsheetId === 'PASTE_CONTRACTORS_SHEET_ID_HERE') throw new Error('Contractors spreadsheet ID is not configured yet.');
  return spreadsheetId;
}

function setupFleetSheet() {
  const spreadsheetId = getFleetSpreadsheetId_();
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.fleet, FLEET_SOURCE_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.fleetVehicles, FLEET_VEHICLE_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.fleetDrivers, FLEET_DRIVER_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.fleetNotes, FLEET_NOTE_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.fleetAlerts, FLEET_ALERT_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.fleetFollowUps, FLEET_FOLLOWUP_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.fleetMetrics, FLEET_METRIC_HEADERS);
  return { spreadsheet_id: spreadsheetId, sheets: [SHEETS.fleet, SHEETS.fleetVehicles, SHEETS.fleetDrivers, SHEETS.fleetNotes, SHEETS.fleetAlerts, SHEETS.fleetFollowUps, SHEETS.fleetMetrics] };
}

function getFleet() {
  const spreadsheetId = getFleetSpreadsheetId_();
  const fleetSource = readFleetSource_(spreadsheetId);
  const sourceRows = fleetSource.rows;
  const vehicles = sourceRows.length ? sourceRows.map(mapFleetVehicle_) : (sheetExists_(spreadsheetId, SHEETS.fleetVehicles) ? readSheetObjects_(spreadsheetId, SHEETS.fleetVehicles).map(mapFleetVehicle_) : []);
  const drivers = sheetExists_(spreadsheetId, SHEETS.fleetDrivers) ? readSheetObjects_(spreadsheetId, SHEETS.fleetDrivers).map(mapFleetDriver_) : [];
  const notes = sheetExists_(spreadsheetId, SHEETS.fleetNotes) ? readSheetObjects_(spreadsheetId, SHEETS.fleetNotes) : [];
  const alerts = sheetExists_(spreadsheetId, SHEETS.fleetAlerts) ? readSheetObjects_(spreadsheetId, SHEETS.fleetAlerts).filter(isActiveRow_) : [];
  const followUps = sheetExists_(spreadsheetId, SHEETS.fleetFollowUps) ? readSheetObjects_(spreadsheetId, SHEETS.fleetFollowUps).filter(isActiveRow_) : [];
  const metrics = sheetExists_(spreadsheetId, SHEETS.fleetMetrics) ? readSheetObjects_(spreadsheetId, SHEETS.fleetMetrics).sort(sortByOrder_) : buildFleetMetrics_(vehicles, drivers, alerts, followUps);
  return { metrics: metrics, fleetRecords: sourceRows.map(mapFleetSource_), vehicles: vehicles, drivers: drivers, notes: notes, alerts: alerts, followUps: followUps, source_rows: sourceRows.length, source_tab: fleetSource.name };
}

function readFleetSource_(spreadsheetId) {
  const ss = SpreadsheetApp.openById(spreadsheetId);
  const sourceSheet = findFleetSourceSheet_(ss);
  if (!sourceSheet) return { name: '', rows: [] };
  return { name: sourceSheet.getName(), rows: readSheetObjects_(spreadsheetId, sourceSheet.getName()) };
}

function findFleetSourceSheet_(ss) {
  const preferredNames = [SHEETS.fleet, 'Fleet', 'Geotab', 'Geotab Fleet', 'Fleet Report'];
  for (let i = 0; i < preferredNames.length; i++) {
    const sheet = ss.getSheetByName(preferredNames[i]);
    if (sheet && sheetLooksLikeFleetSource_(sheet)) return sheet;
  }
  const sheets = ss.getSheets();
  for (let j = 0; j < sheets.length; j++) {
    if (sheetLooksLikeFleetSource_(sheets[j])) return sheets[j];
  }
  return ss.getSheetByName(SHEETS.fleet);
}

function sheetLooksLikeFleetSource_(sheet) {
  if (!sheet || sheet.getLastRow() < 1 || sheet.getLastColumn() < 1) return false;
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(normalizeHeader_);
  return headers.indexOf('device') > -1 && headers.indexOf('device_group') > -1 && headers.indexOf('vin') > -1;
}

function mapFleetSource_(row) {
  return {
    device: getFleetField_(row, ['device']),
    device_group: getFleetField_(row, ['device_group', 'device group']),
    first_name: getFleetField_(row, ['first_name', 'first name']),
    last_name: getFleetField_(row, ['last_name', 'last name']),
    current_driver: getFleetField_(row, ['current_driver', 'current driver']),
    work_time: getFleetField_(row, ['work_time', 'work time']),
    current_activity: getFleetField_(row, ['current_activity', 'current activity']),
    in_privacy_mode: getFleetField_(row, ['in_privacy_mode', 'in privacy mode']),
    last_stop_address: getFleetField_(row, ['last_stop_address', 'last stop address']),
    last_stop_zone_types: getFleetField_(row, ['last_stop_zone_types', 'last stop zone types']),
    current_odometer: getFleetField_(row, ['current_odometer', 'current odometer']),
    current_engine_hours: getFleetField_(row, ['current_engine_hours', 'current engine hours']),
    active_from: getFleetField_(row, ['active_from', 'active from']),
    active_to: getFleetField_(row, ['active_to', 'active to']),
    is_archived: getFleetField_(row, ['is_archived_historical', 'is archived historical', 'is_archived', 'archived']),
    plan: getFleetField_(row, ['plan']),
    device_type: getFleetField_(row, ['device_type', 'device type']),
    firmware_version: getFleetField_(row, ['firmware_version', 'firmware version']),
    serial_no: getFleetField_(row, ['serial_no', 'serial no', 'serial number']),
    license_plate: getFleetField_(row, ['license_plate', 'license plate']),
    license_state: getFleetField_(row, ['license_state_province', 'license state province', 'license_state']),
    vin: getFleetField_(row, ['vin']),
    time_zone: getFleetField_(row, ['time_zone', 'time zone']),
    device_comment: getFleetField_(row, ['device_comment', 'device comment']),
    download_status: getFleetField_(row, ['download_status', 'download status']),
    last_trip: getFleetField_(row, ['last_trip', 'last trip']),
    last_communication_date: getFleetField_(row, ['last_communication_date', 'last communication date'])
  };
}

function mapFleetVehicle_(row) {
  const device = getFleetField_(row, ['device', 'unit_number', 'unit', 'vehicle', 'vehicle_id', 'truck_number']);
  const group = getFleetField_(row, ['device_group', 'device group', 'group', 'region']);
  const archived = getFleetField_(row, ['is_archived_historical', 'is archived historical', 'is_archived', 'archived']);
  const activity = getFleetField_(row, ['current_activity', 'current activity', 'status', 'vehicle_status']);
  return {
    vehicle_id: getFleetField_(row, ['vehicle_id', 'id']) || makeIdFromText_('vehicle', device),
    unit_number: device,
    device_group: group,
    region: fleetRegionFromGroup_(group),
    status: /true|yes|archived/i.test(String(archived || '')) ? 'Archived' : 'Active',
    service_status: activity || getFleetField_(row, ['service_status', 'service', 'maintenance_status']),
    registration_status: getFleetField_(row, ['registration_status', 'registration']) || 'Source only',
    vin: getFleetField_(row, ['vin']),
    plate: getFleetField_(row, ['license_plate', 'license plate', 'plate']),
    license_state: getFleetField_(row, ['license_state_province', 'license state province', 'license_state']),
    make: getFleetField_(row, ['make']),
    model: getFleetField_(row, ['model', 'device_type', 'device type']),
    year: getFleetField_(row, ['year']),
    assigned_driver: getFleetField_(row, ['current_driver', 'current driver', 'assigned_driver', 'driver']) || fleetDriverNameFromRow_(row),
    current_activity: activity,
    last_stop_address: getFleetField_(row, ['last_stop_address', 'last stop address']),
    current_odometer: getFleetField_(row, ['current_odometer', 'current odometer']),
    current_engine_hours: getFleetField_(row, ['current_engine_hours', 'current engine hours']),
    active_from: getFleetField_(row, ['active_from', 'active from']),
    active_to: getFleetField_(row, ['active_to', 'active to']),
    is_archived: archived,
    plan: getFleetField_(row, ['plan']),
    device_type: getFleetField_(row, ['device_type', 'device type']),
    firmware_version: getFleetField_(row, ['firmware_version', 'firmware version']),
    serial_no: getFleetField_(row, ['serial_no', 'serial no', 'serial number']),
    time_zone: getFleetField_(row, ['time_zone', 'time zone']),
    device_comment: getFleetField_(row, ['device_comment', 'device comment']),
    download_status: getFleetField_(row, ['download_status', 'download status']),
    last_trip: getFleetField_(row, ['last_trip', 'last trip']),
    last_communication_date: getFleetField_(row, ['last_communication_date', 'last communication date']),
    last_updated: getFleetField_(row, ['last_updated', 'updated_at', 'last_communication_date', 'last communication date']) || today_()
  };
}

function mapFleetDriver_(row) {
  const name = getFleetField_(row, ['driver_name', 'current_driver', 'current driver', 'driver', 'name']) || fleetDriverNameFromRow_(row);
  return {
    driver_id: getFleetField_(row, ['driver_id', 'id']) || makeIdFromText_('driver', name),
    driver_name: name,
    first_name: getFleetField_(row, ['first_name', 'first name']),
    last_name: getFleetField_(row, ['last_name', 'last name']),
    region: fleetRegionFromGroup_(getFleetField_(row, ['device_group', 'device group', 'region', 'market', 'location'])),
    status: getFleetField_(row, ['status', 'driver_status']) || 'Active',
    phone: getFleetField_(row, ['phone']),
    email: getFleetField_(row, ['email']),
    license_expiry: getFleetField_(row, ['license_expiry', 'license_expiration']),
    medical_card_expiry: getFleetField_(row, ['medical_card_expiry', 'medical_expiry']),
    insurance_expiry: getFleetField_(row, ['insurance_expiry']),
    assigned_vehicle: getFleetField_(row, ['assigned_vehicle', 'vehicle', 'unit_number', 'device']),
    current_activity: getFleetField_(row, ['current_activity', 'current activity']),
    work_time: getFleetField_(row, ['work_time', 'work time']),
    last_stop_address: getFleetField_(row, ['last_stop_address', 'last stop address']),
    next_action: getFleetField_(row, ['next_action', 'next action']) || 'Review protected workflow',
    last_updated: getFleetField_(row, ['last_updated', 'updated_at', 'last_communication_date', 'last communication date']) || today_()
  };
}

function getFleetField_(row, names) {
  if (!row) return '';
  const normalized = {};
  Object.keys(row).forEach(function(key) {
    normalized[normalizeHeader_(key)] = row[key];
  });
  for (let i = 0; i < names.length; i++) {
    const key = normalizeHeader_(names[i]);
    if (Object.prototype.hasOwnProperty.call(normalized, key) && normalized[key] !== '') return normalized[key];
  }
  return '';
}

function fleetDriverNameFromRow_(row) {
  const first = getFleetField_(row, ['first_name', 'first name']);
  const last = getFleetField_(row, ['last_name', 'last name']);
  return [first, last].filter(Boolean).join(' ').trim();
}

function fleetRegionFromGroup_(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  const upper = text.toUpperCase();
  const regions = ['PHX', 'STL', 'MIL', 'CLE', 'CHI', 'MIN', 'ABQ', 'PIT', 'IND'];
  for (let i = 0; i < regions.length; i++) if (upper.indexOf(regions[i]) > -1) return regions[i];
  if (/PHOENIX|ARIZONA|AZ/.test(upper)) return 'PHX';
  if (/ST.?s*LOUIS|MISSOURI|MO/.test(upper)) return 'STL';
  if (/MILWAUKEE|WISCONSIN|WI/.test(upper)) return 'MIL';
  if (/CLEVELAND|OHIO|OH/.test(upper)) return 'CLE';
  if (/CHICAGO|ILLINOIS|IL/.test(upper)) return 'CHI';
  if (/MINNEAPOLIS|MINNESOTA|MN/.test(upper)) return 'MIN';
  if (/ALBUQUERQUE|NEW MEXICO|NM/.test(upper)) return 'ABQ';
  if (/PITTSBURGH|PITTSBURG|PENNSYLVANIA|PA/.test(upper)) return 'PIT';
  if (/INDIANAPOLIS|INDIANA|IN/.test(upper)) return 'IND';
  return text;
}

function buildFleetMetrics_(vehicles, drivers, alerts, followUps) {
  const openWorkflow = (alerts || []).length + (followUps || []).length;
  const serviceDue = vehicles.filter(function(row) { return /due|overdue|service/i.test(String(row.service_status || '')) || isDateWithinDays_(row.next_service_date, 30); }).length;
  const driverDocs = drivers.filter(function(row) { return isDateWithinDays_(row.license_expiry, 30) || isDateWithinDays_(row.medical_card_expiry, 30) || isDateWithinDays_(row.insurance_expiry, 30); }).length;
  return [
    { metric_key: 'open_alerts', label: 'Open Alerts', value: openWorkflow, note: 'Alerts + follow-ups', tone: 'blue', sort_order: 1 },
    { metric_key: 'vehicles', label: 'Vehicles', value: vehicles.length, note: 'Current records', tone: 'blue', sort_order: 2 },
    { metric_key: 'drivers', label: 'Drivers', value: drivers.length, note: 'Current records', tone: 'blue', sort_order: 3 },
    { metric_key: 'service_due', label: 'Service Due', value: serviceDue, note: 'Next 30 days', tone: 'amber', sort_order: 4 },
    { metric_key: 'driver_docs', label: 'Driver Docs', value: driverDocs, note: 'Expiring soon', tone: 'red', sort_order: 5 }
  ];
}

function getFleetSpreadsheetId_() {
  const spreadsheetId = SPREADSHEETS.fleet;
  if (!spreadsheetId) throw new Error('Fleet spreadsheet ID is not configured yet.');
  return spreadsheetId;
}

function makeIdFromText_(prefix, value) {
  const clean = String(value || prefix).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
  return prefix + '-' + (clean || Utilities.getUuid().slice(0, 8));
}

function ensureSheetWithHeaders_(spreadsheetId, sheetName, headers) {
  const ss = SpreadsheetApp.openById(spreadsheetId);
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) sheet = ss.insertSheet(sheetName);
  if (sheet.getLastRow() === 0 || sheet.getLastColumn() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    return;
  }
  const existing = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0].map(String);
  const missing = headers.filter(function(header) { return existing.indexOf(header) === -1; });
  if (missing.length) sheet.getRange(1, existing.length + 1, 1, missing.length).setValues([missing]);
}

function ensureSheetWithExactHeaders_(spreadsheetId, sheetName, headers, aliases) {
  const ss = SpreadsheetApp.openById(spreadsheetId);
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) sheet = ss.insertSheet(sheetName);
  if (sheet.getLastRow() === 0 || sheet.getLastColumn() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    return;
  }

  const values = sheet.getDataRange().getValues();
  const existingHeaders = values[0].map(normalizeHeader_);
  const schemaMatches = existingHeaders.length === headers.length && headers.every(function(header, index) {
    return existingHeaders[index] === normalizeHeader_(header);
  });
  if (schemaMatches) return;

  aliases = aliases || {};
  const remappedRows = values.slice(1)
    .filter(function(row) { return row.some(function(cell) { return cell !== '' && cell !== null; }); })
    .map(function(row) {
      return headers.map(function(header) {
        const candidates = [header].concat(aliases[header] || []).map(normalizeHeader_);
        for (let index = 0; index < candidates.length; index++) {
          const existingIndex = existingHeaders.indexOf(candidates[index]);
          if (existingIndex > -1) return row[existingIndex];
        }
        return '';
      });
    });

  sheet.clearContents();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (remappedRows.length) sheet.getRange(2, 1, remappedRows.length, headers.length).setValues(remappedRows);
}

function isActiveRow_(row) {
  return row.active === '' || row.active === true || String(row.active).toUpperCase() === 'TRUE';
}

function isDateWithinDays_(value, days) {
  if (!value) return false;
  const date = new Date(value);
  if (isNaN(date.getTime())) return false;
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.floor((end.getTime() - start.getTime()) / 86400000);
  return diff >= 0 && diff <= days;
}

function isDatePast_(value) {
  if (!value) return false;
  const date = new Date(value);
  if (isNaN(date.getTime())) return false;
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return end.getTime() < start.getTime();
}

function getContractorDocumentStatus_(glExpiry, wcExpiry) {
  if (isDatePast_(glExpiry) || isDatePast_(wcExpiry)) return 'Expired';
  if (isDateWithinDays_(glExpiry, 30) || isDateWithinDays_(wcExpiry, 30)) return 'Expiring Soon';
  return 'Current';
}

function getContractorRisk_(documents, glExpiry, wcExpiry) {
  if (/expired/i.test(String(documents || ''))) return '70 High';
  if (isDateWithinDays_(glExpiry, 30) || isDateWithinDays_(wcExpiry, 30)) return '50 Review';
  return '20 Monitor';
}

function getContractorNextAction_(documents, glExpiry, wcExpiry) {
  if (/expired/i.test(String(documents || ''))) return 'Immediate compliance review';
  if (isDateWithinDays_(glExpiry, 30) || isDateWithinDays_(wcExpiry, 30)) return 'Request updated certificate';
  return 'No immediate action';
}

function makeContractorId_(name) {
  const raw = String(name || 'contractor').trim().toLowerCase();
  return 'CTR-' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw)).slice(0, 12);
}

function clearLegacyCommandCenterRows() {
  return [
    clearSheetRows_(SPREADSHEETS.commandCenter, SHEETS.commandMetrics),
    clearSheetRows_(SPREADSHEETS.commandCenter, SHEETS.commandFocus)
  ];
}

function paymentSheetRowIsActive_(row) {
  return row.active === '' || row.active === true || String(row.active).toUpperCase() === 'TRUE';
}

function buildLienPaymentContext_() {
  const emptyContext = {
    available: false,
    summaryByJobId: {},
    transactionsByJobId: {}
  };

  try {
    const spreadsheetId = getPaymentsSpreadsheetId_();
    const summaries = readSheetObjects_(spreadsheetId, SHEETS.paymentSummary).filter(paymentSheetRowIsActive_);
    const transactions = readSheetObjects_(spreadsheetId, SHEETS.paymentTransactions).filter(paymentSheetRowIsActive_);
    const summaryByJobId = {};
    const transactionsByJobId = {};

    summaries.forEach(function(summary) {
      const blazeJobId = String(summary.blaze_job_id || '').trim().toLowerCase();
      if (blazeJobId) summaryByJobId[blazeJobId] = summary;
    });

    transactions.forEach(function(transaction) {
      const blazeJobId = String(transaction.blaze_job_id || '').trim().toLowerCase();
      if (!blazeJobId) return;
      if (!transactionsByJobId[blazeJobId]) transactionsByJobId[blazeJobId] = [];
      transactionsByJobId[blazeJobId].push(transaction);
    });

    Object.keys(transactionsByJobId).forEach(function(blazeJobId) {
      transactionsByJobId[blazeJobId].sort(function(left, right) {
        return String(right.payment_date || '').localeCompare(String(left.payment_date || '')) ||
          Number(left.source_row_number || 0) - Number(right.source_row_number || 0);
      });
    });

    return {
      available: true,
      summaryByJobId: summaryByJobId,
      transactionsByJobId: transactionsByJobId
    };
  } catch (error) {
    Logger.log('Liens payment enrichment unavailable: ' + error.message);
    return emptyContext;
  }
}

function lienBlazeJobId_(record) {
  const direct = String(record.blaze_job_id || '').trim().toLowerCase();
  if (direct) return direct;
  return extractBlazeJobId_(record.blaze_url || record.job_link || record['Job Link'] || record.url || record.record_url || '');
}

function getLienPayments(payload) {
  payload = payload || {};
  const directId = String(payload.blaze_job_id || '').trim().toLowerCase();
  const blazeJobId = directId || extractBlazeJobId_(payload.job_link || payload.blaze_url || '');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(blazeJobId)) {
    throw new Error('A valid Blaze job UUID is required for payment history.');
  }

  const context = buildLienPaymentContext_();
  return {
    data_available: context.available,
    blaze_job_id: blazeJobId,
    summary: context.summaryByJobId[blazeJobId] || null,
    transactions: (context.transactionsByJobId[blazeJobId] || []).slice()
  };
}

function getLiens() {
  const records = readSheetObjects_(SPREADSHEETS.liens, SHEETS.lienRecords)
    .filter(function(row) { return row.active === '' || row.active === true || String(row.active).toUpperCase() === 'TRUE'; });
  const notes = sheetExists_(SPREADSHEETS.liens, SHEETS.lienNotes) ? readSheetObjects_(SPREADSHEETS.liens, SHEETS.lienNotes) : [];
  const alerts = sheetExists_(SPREADSHEETS.liens, SHEETS.lienAlerts) ? readSheetObjects_(SPREADSHEETS.liens, SHEETS.lienAlerts) : [];
  const followUps = sheetExists_(SPREADSHEETS.liens, SHEETS.lienFollowUps) ? readSheetObjects_(SPREADSHEETS.liens, SHEETS.lienFollowUps) : [];
  const metrics = sheetExists_(SPREADSHEETS.liens, SHEETS.lienMetrics) ? readSheetObjects_(SPREADSHEETS.liens, SHEETS.lienMetrics).sort(sortByOrder_) : buildLienMetrics_(records);
  const paymentContext = buildLienPaymentContext_();

  const latestNoteByLien = latestById_(notes, 'lien_id', 'note_date');
  const activeAlertByLien = latestById_(alerts.filter(function(alert) {
    return alert.active === '' || alert.active === true || String(alert.active).toUpperCase() === 'TRUE';
  }), 'lien_id', 'created_date');
  const activeFollowUps = followUps.filter(function(item) {
    return item.active === '' || item.active === true || String(item.active).toUpperCase() === 'TRUE';
  });

  return {
    metrics: metrics,
    notes: notes,
    alerts: alerts,
    followUps: activeFollowUps,
    payments_available: paymentContext.available,
    records: records.map(function(record) {
      const note = latestNoteByLien[String(record.lien_id)] || {};
      const alert = activeAlertByLien[String(record.lien_id)] || {};
      const blazeJobId = lienBlazeJobId_(record);
      const paymentSummary = blazeJobId ? paymentContext.summaryByJobId[blazeJobId] || null : null;
      const paymentHistory = blazeJobId ? paymentContext.transactionsByJobId[blazeJobId] || [] : [];

      record.workflow_note = note.note_text || record.workflow_note || '';
      record.alert_text = alert.alert_text || record.alert_text || '';
      record.notes_count = notes.filter(function(item) { return String(item.lien_id) === String(record.lien_id); }).length;
      record.alerts_count = alerts.filter(function(item) {
        return String(item.lien_id) === String(record.lien_id) &&
          (item.active === '' || item.active === true || String(item.active).toUpperCase() === 'TRUE');
      }).length;
      record.followups_count = activeFollowUps.filter(function(item) { return String(item.lien_id) === String(record.lien_id); }).length;
      record.blaze_job_id = blazeJobId;
      record.payment_data_available = paymentContext.available;
      record.payment_summary = paymentSummary;
      record.payment_history_preview = paymentHistory.slice(0, 3);
      return record;
    })
  };
}


function importLienStatusReports() {
  const folder = DriveApp.getFolderById(LIEN_STATUS_REPORTS_FOLDER_ID);
  const files = folder.getFilesByType(MimeType.GOOGLE_SHEETS);
  let masterRows = [];
  let statusRows = [];
  const seenStatuses = {};
  const scanned = [];

  while (files.hasNext()) {
    const file = files.next();
    const ss = SpreadsheetApp.openById(file.getId());
    scanned.push(file.getName());
    ss.getSheets().forEach(function(sheet) {
      const sheetName = sheet.getName();
      const rows = readSheetObjectsFromSheet_(sheet);
      if (!rows.length) return;
      if (sameName_(file.getName(), LIEN_MASTER_REPORT_NAME) || sameName_(sheetName, LIEN_MASTER_REPORT_NAME)) {
        masterRows = masterRows.concat(rows);
        return;
      }
      const status = file.getName();
      seenStatuses[status] = true;
      rows.forEach(function(row) {
        row.__status = status;
        row.__source_sheet = sheetName;
        row.__source_file = file.getName();
        statusRows.push(row);
      });
    });
  }

  if (!masterRows.length) {
    throw new Error('No master rows found. Need a Google Sheet or tab named Receivables Aging in the lien status reports folder.');
  }

  const statusByKey = {};
  statusRows.forEach(function(row) {
    statusByKey[makeReceivableKey_(row)] = row.__status;
  });

  const normalized = masterRows.map(function(row) {
    const key = makeReceivableKey_(row);
    const status = statusByKey[key] || 'Receivable';
    seenStatuses[status] = true;
    return mapReceivableToLienRecord_(row, status, key);
  });

  replaceSourceRecords_(normalized);
  return {
    imported: normalized.length,
    statuses: Object.keys(seenStatuses).sort(),
    scanned_files: scanned
  };
}

function readSheetObjectsFromSheet_(sheet) {
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

function ensureLienRecordColumns_(sheet) {
  const existing = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0].map(normalizeHeader_);
  const missing = REQUIRED_LIEN_RECORD_COLUMNS.filter(function(header) { return existing.indexOf(header) === -1; });
  if (!missing.length) return;
  sheet.getRange(1, existing.length + 1, 1, missing.length).setValues([missing]);
}

function replaceSourceRecords_(records) {
  const sheet = getRequiredSheet_(SPREADSHEETS.liens, SHEETS.lienRecords);
  ensureLienRecordColumns_(sheet);
  const values = sheet.getDataRange().getValues();
  if (!values.length) throw new Error('LienRecords is missing headers.');
  const headers = values[0].map(normalizeHeader_);
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
  }
  if (!records.length) return;
  sheet.getRange(2, 1, records.length, headers.length).setValues(records.map(function(record) {
    return headers.map(function(header) {
      return Object.prototype.hasOwnProperty.call(record, header) ? record[header] : '';
    });
  }));
}

function mapReceivableToLienRecord_(row, status, key) {
  const customer = getField_(row, ['customer', 'customer_name', 'name', 'account', 'account_name']);
  const account = getField_(row, ['job_number', 'job', 'job_number_', 'job #', 'account_name', 'account', 'account_number']);
  const blazeUrl = getField_(row, ['job_link', 'job link', 'Job Link', 'blaze_url', 'blaze link', 'blaze_link', 'url', 'job_url', 'record_url']);
  const balance = getField_(row, ['balance', 'total_balance', 'total revenue', 'amount', 'invoice_balance', 'ar_balance']);
  const contractedAmount = getField_(row, ['total_revenue', 'total revenue', 'contracted_amount', 'contracted amount', 'contract value', 'contracted value']);
  const invoiceDates = getInvoiceSentDates_(row);
  const firstInvoiceDate = invoiceDates.length ? invoiceDates[0] : getField_(row, ['first_invoice_date', 'first invoice date', 'first invoice', 'invoice 1 sent date', 'invoice_1_sent_date', 'oldest_invoice_date', 'oldest invoice date', 'oldest invoice', 'first_invoice_dt']);
  const latestInvoiceDate = invoiceDates.length ? invoiceDates[invoiceDates.length - 1] : getField_(row, ['latest_invoice_date', 'latest invoice date', 'latest invoice', 'last_invoice_date', 'last invoice date', 'last invoice', 'newest invoice date']);
  const invoiceCount = invoiceDates.length || getField_(row, ['invoice_count', 'invoice count', 'invoice count ', 'invoices', '# invoices', 'number of invoices']);
  const days = getField_(row, ['days_past_due', 'days past due', 'days past due date', 'days past due balance', 'past due days', 'dpd', '60+ days', '60_days', 'aging_days', 'days', 'age']) || daysSince_(firstInvoiceDate);
  const noPaymentReceived = getNoPaymentReceived_(row);
  const paymentReceived = getField_(row, ['payments', 'payment_received', 'payment received', 'payments_received', 'payments received', 'amount_paid', 'amount paid', 'paid_amount', 'paid amount', 'total_paid', 'total paid', 'payment amount']);
  return {
    lien_id: 'REC-' + key,
    customer: customer,
    account_name: account || customer,
    blaze_url: blazeUrl,
    region: getField_(row, ['region', 'market', 'branch', 'office']),
    owner: getField_(row, ['owner', 'sales_rep', 'sales rep', 'rep', 'assigned_to']) || 'Carlynn',
    status: status,
    stage: getStageFromReceivable_(row, status, days),
    balance: balance,
    contracted_amount: contractedAmount,
    days_past_due: days,
    first_invoice_date: firstInvoiceDate,
    latest_invoice_date: latestInvoiceDate,
    invoice_count: invoiceCount,
    no_payment_received: noPaymentReceived,
    payment_received: paymentReceived,
    last_payment_date: getField_(row, ['last_payment_date', 'last payment date', 'last payment', 'latest payment date']),
    payment_status: getField_(row, ['payment_status', 'payment status', 'payment filter', 'payment']),
    filing_date: getField_(row, ['filing_date', 'filed_date', 'lien_filed']),
    release_due_date: getField_(row, ['release_due_date', 'due_date', 'deadline']),
    release_status: status,
    legal_hold: /attorney|legal|hold/i.test(String(status || '')),
    source_system: 'Blaze / Receivables Aging',
    source_record_id: account || key,
    last_updated: today_(),
    active: true
  };
}

function getInvoiceSentDates_(row) {
  const dates = [];
  for (let i = 1; i <= 20; i++) {
    const value = getField_(row, ['invoice_' + i + '_sent_date', 'invoice ' + i + ' sent date', 'invoice ' + i, 'invoice_' + i]);
    if (value) dates.push(value);
  }
  return dates;
}

function daysSince_(dateValue) {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return '';
  const today = new Date();
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / 86400000));
}

function getNoPaymentReceived_(row) {
  const direct = getField_(row, ['no_payment_received', 'no payment received', 'no payments received', 'no payment', 'no payments', 'no deposit', 'missing deposit']);
  if (direct !== '' && direct !== null && direct !== undefined) {
    return /^(true|yes|y|1|x|no payment|no payments|none)$/i.test(String(direct).trim());
  }
  const payment = getField_(row, ['payments', 'payment_received', 'payment received', 'payments_received', 'payments received', 'amount_paid', 'amount paid', 'paid_amount', 'paid amount', 'total_paid', 'total paid', 'payment amount']);
  if (payment !== '' && payment !== null && payment !== undefined) return parseMoney_(payment) <= 0;
  const lastPayment = getField_(row, ['last_payment_date', 'last payment date', 'last payment', 'latest payment date']);
  if (lastPayment) return false;
  const status = getField_(row, ['payment_status', 'payment status', 'payment filter', 'payment']);
  if (status) return /no payment|no payments|none|unpaid/i.test(String(status));
  return false;
}

function getStageFromReceivable_(row, status, days) {
  const age = Number(days || getField_(row, ['days_past_due', 'days past due', 'aging_days', 'age', 'days']) || 0);
  if (age >= 120) return 'Critical';
  if (age >= 90) return 'High';
  if (age >= 60) return 'Review';
  if (age >= 30) return 'Monitor';
  if (/attorney|legal/i.test(String(status || ''))) return 'Review';
  return 'Monitor';
}

function makeReceivableKey_(row) {
  const parts = [
    getField_(row, ['job_number', 'job', 'job #', 'account', 'account_name', 'account number']),
    getField_(row, ['customer', 'customer_name', 'name']),
    getField_(row, ['first_invoice_date', 'first invoice', 'oldest_invoice_date', 'invoice_number', 'invoice #'])
  ].map(function(value) { return String(value || '').trim().toLowerCase(); }).filter(Boolean);
  const raw = parts.length ? parts.join('|') : JSON.stringify(row);
  return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw)).slice(0, 16);
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
  const folder = DriveApp.getFolderById(LIEN_STATUS_REPORTS_FOLDER_ID);
  const files = folder.getFilesByType(MimeType.GOOGLE_SHEETS);
  const output = [];
  while (files.hasNext()) {
    const file = files.next();
    const ss = SpreadsheetApp.openById(file.getId());
    const book = { file: file.getName(), id: file.getId(), sheets: [] };
    ss.getSheets().forEach(function(sheet) {
      const values = sheet.getDataRange().getValues();
      const headers = values.length ? values[0].map(normalizeHeader_) : [];
      const dataRows = values.slice(1).filter(function(row) {
        return row.some(function(cell) { return cell !== '' && cell !== null; });
      }).length;
      book.sheets.push({
        sheet: sheet.getName(),
        last_row: sheet.getLastRow(),
        last_column: sheet.getLastColumn(),
        readable_data_rows: dataRows,
        headers: headers.slice(0, 25)
      });
    });
    output.push(book);
  }
  Logger.log(JSON.stringify(output, null, 2));
  return output;
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
