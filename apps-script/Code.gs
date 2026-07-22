const CITADEL_VERSION='2.1.2';
const CITADEL_INITIAL_ADMIN_EMAIL = 'amashalom21@gmail.com';
const CITADEL_ACCESS_MODULES = ['command-center', 'region-health', 'data-connections', 'inbox', 'tasks', 'legal', 'reviews', 'pricing', 'fleet', 'contractors', 'registrations', 'liens', 'suppliers', 'collections'];
const CITADEL_APP_ORIGIN = 'https://elite-compliance.github.io';
const CITADEL_SESSION_HOURS = 8;
const CITADEL_PASSWORD_ITERATIONS = 600000;
const CITADEL_MAX_FAILED_LOGINS = 5;
const CITADEL_LOCKOUT_MINUTES = 15;
let CITADEL_REQUEST_CONTEXT = null;
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
const LIEN_AUTOMATION_SCHEDULE = ['7:00 AM', '12:00 PM', '3:00 PM'];
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
  contractorCrews: 'ContractorCrews',
  contractorImportLog: 'ContractorImportLog',
  contractorAutomationLog: 'ContractorAutomationLog',
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
  fleetImport: 'FleetImport',
  fleetImportLog: 'FleetImportLog',
  fleetAutomationLog: 'FleetAutomationLog',
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
  paymentImportLog: 'PaymentImportLog',
  citadelUsers: 'CitadelUsers',
  citadelSessions: 'CitadelSessions',
  accessAudit: 'AccessAudit'
};

const CONTRACTOR_RECORD_HEADERS = ['contractor_id', 'Contractor', 'Phone', 'Email', 'Regions', 'Risk', 'Documents', 'GL Expiry', 'WC Expiry', 'Next Action', 'Address', 'Active', 'Crew Count', 'Source Updated At', 'Source System'];
const CONTRACTOR_CREW_HEADERS = ['crew_id', 'contractor_id', 'contractor_name', 'crew_name', 'crew_status', 'region', 'source_updated_at', 'active'];
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
const FLEET_RECORD_HEADERS = FLEET_SOURCE_HEADERS.concat(['fleet_record_key', 'source_row_hash', 'source_row_number', 'duplicate_group_size', 'duplicate_sequence', 'duplicate_status', 'validation_error', 'import_batch_id', 'imported_at', 'active']);
const FLEET_IMPORT_LOG_HEADERS = ['import_id', 'started_at', 'completed_at', 'imported_by', 'source_sheet', 'source_rows', 'retained_rows', 'unique_devices', 'duplicate_rows', 'validation_error_rows', 'status', 'warnings', 'error'];
const FLEET_AUTOMATION_LOG_HEADERS = ['run_id', 'started_at', 'completed_at', 'status', 'source_rows', 'fleet_import_id', 'message', 'source', 'source_message_id', 'attachment_name', 'attachment_hash'];
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
const CITADEL_USER_HEADERS = ['user_id', 'email', 'display_name', 'role', 'modules', 'regions', 'permissions', 'status', 'password_salt', 'password_hash', 'password_iterations', 'password_changed_at', 'must_change_password', 'failed_login_count', 'locked_until', 'invited_at', 'invited_by', 'last_login_at', 'created_at', 'created_by', 'updated_at', 'updated_by'];
const CITADEL_SESSION_HEADERS = ['session_hash', 'user_id', 'email', 'issued_at', 'expires_at', 'last_seen_at', 'revoked_at', 'revoked_by', 'active', 'csrf_hash'];
const ACCESS_AUDIT_HEADERS = ['event_id', 'occurred_at', 'user_id', 'email', 'action', 'resource', 'outcome', 'ip_hash', 'user_agent_hash', 'details'];

function doGet(e) {
  const action = getParam_(e, 'action') || 'getLiens';

  try {
    if (action === 'getAuthConfig') {
      return output_(e, { ok: true, data: getCitadelAuthConfig_(), version: CITADEL_VERSION });
    }
    if (action === 'getPasswordChallenge') {
      return output_(e, { ok: true, data: getCitadelPasswordChallenge_(getParam_(e, 'username')), version: CITADEL_VERSION });
    }

    CITADEL_REQUEST_CONTEXT = authorizeCitadelRequest_(e, action);

    if (action === 'getCurrentUser') {
      return output_(e, { ok: true, data: publicCitadelUser_(CITADEL_REQUEST_CONTEXT.user), version: CITADEL_VERSION });
    }

    if (action === 'getCitadelUsers') {
      requireCitadelAdmin_(CITADEL_REQUEST_CONTEXT);
      return output_(e, { ok: true, data: getCitadelUsers_(), version: CITADEL_VERSION });
    }

    if (action === 'logout') {
      return output_(e, { ok: true, data: revokeCitadelSession_(CITADEL_REQUEST_CONTEXT), version: CITADEL_VERSION });
    }

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

    if (action === 'getFleetImportStatus') {
      return output_(e, { ok: true, data: getFleetImportStatus(), version: CITADEL_VERSION });
    }

    if (action === 'runFleetImport') {
      return output_(e, {
        ok: true,
        data: runFleetImport({
          imported_by: getParam_(e, 'imported_by') || 'Citadel user'
        }),
        version: CITADEL_VERSION
      });
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

    if (action === 'saveContractorDetails') {
      return output_(e, { ok: true, data: saveContractorDetails(paramsToPayload_(e)), version: CITADEL_VERSION });
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
  let payload = {};
  let action = '';

  try {
    const contentType = String(e && e.postData && e.postData.type || '').toLowerCase();
    payload = contentType.indexOf('application/json') > -1 && e && e.postData && e.postData.contents
      ? JSON.parse(e.postData.contents)
      : Object.assign({}, e && e.parameter ? e.parameter : {});
    action = String(payload.action || getParam_(e, 'action') || '').trim();
    if (action === 'loginWithPassword') {
      return citadelLoginBridgeOutput_(loginWithPassword_(payload));
    }
    if (action === 'saveCitadelUser') {
      CITADEL_REQUEST_CONTEXT = authorizeCitadelRequest_(e, action);
      requireCitadelAdmin_(CITADEL_REQUEST_CONTEXT);
      return citadelLoginBridgeOutput_({ ok: true, data: saveCitadelUser_(payload, CITADEL_REQUEST_CONTEXT.user) });
    }
    if (action === 'recordLienAutomationRun') {
      verifyLienAutomationToken_(payload.token);
      return output_(e, { ok: true, data: recordLienAutomationRun_(payload), version: CITADEL_VERSION });
    }
    if (action === 'recordFleetAutomationRun') {
      verifyLienAutomationToken_(payload.token);
      return output_(e, { ok: true, data: recordFleetAutomationRun_(payload), version: CITADEL_VERSION });
    }
    return output_(e, { ok: false, error: 'Unknown action: ' + action });
  } catch (error) {
    if (action === 'loginWithPassword') {
      return citadelLoginBridgeOutput_({ ok: false, error: error.message || String(error) });
    }
    return output_(e, { ok: false, error: error.message || String(error) });
  }
}

function setupAccessControl() {
  const spreadsheetId = SPREADSHEETS.commandCenter;
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.citadelUsers, CITADEL_USER_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.citadelSessions, CITADEL_SESSION_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.accessAudit, ACCESS_AUDIT_HEADERS);
  getCitadelPasswordPepper_();

  const now = new Date().toISOString();
  const adminEmail = normalizeEmail_(CITADEL_INITIAL_ADMIN_EMAIL);
  const users = readSheetObjects_(spreadsheetId, SHEETS.citadelUsers);
  const existing = users.find(function(user) { return normalizeEmail_(user.email) === adminEmail; }) || {};
  const admin = {
    user_id: existing.user_id || 'USR-AMASHALOM21',
    email: adminEmail,
    display_name: existing.display_name || 'Ama Shalom',
    role: 'Admin',
    modules: '*',
    regions: '*',
    permissions: '*',
    status: 'Active',
    password_salt: existing.password_salt || '',
    password_hash: existing.password_hash || '',
    password_iterations: existing.password_iterations || '',
    password_changed_at: existing.password_changed_at || '',
    must_change_password: existing.must_change_password || '',
    failed_login_count: existing.failed_login_count || 0,
    locked_until: existing.locked_until || '',
    invited_at: existing.invited_at || now,
    invited_by: existing.invited_by || 'System bootstrap',
    last_login_at: existing.last_login_at || '',
    created_at: existing.created_at || now,
    created_by: existing.created_by || 'System bootstrap',
    updated_at: now,
    updated_by: 'System bootstrap'
  };
  upsertSheetObject_(spreadsheetId, SHEETS.citadelUsers, 'email', adminEmail, admin);

  return {
    spreadsheet_id: spreadsheetId,
    administrator: adminEmail,
    modules: CITADEL_ACCESS_MODULES.slice(),
    sheets: [SHEETS.citadelUsers, SHEETS.citadelSessions, SHEETS.accessAudit],
    enforcement_enabled: isCitadelAuthEnforced_()
  };
}

function initializeCitadelAdministrator() {
  setupAccessControl();
  const email = normalizeEmail_(CITADEL_INITIAL_ADMIN_EMAIL);
  const users = readSheetObjects_(SPREADSHEETS.commandCenter, SHEETS.citadelUsers);
  const existing = users.find(function(user) { return normalizeEmail_(user.email) === email; });
  if (!existing) throw new Error('The initial administrator row could not be created.');
  if (String(existing.password_hash || '').trim()) {
    throw new Error('The administrator password is already configured. Reset it from Citadel User Access.');
  }

  const temporaryPassword = (secureCitadelToken_() + secureCitadelToken_()).replace(/[^A-Za-z0-9]/g, '').slice(0, 24);
  const salt = secureCitadelToken_();
  const proof = citadelPbkdf2FirstBlock_(temporaryPassword, salt);
  const now = new Date().toISOString();
  const record = Object.assign({}, existing, {
    password_salt: salt,
    password_hash: citadelPasswordVerifier_(proof, salt, 1),
    password_iterations: 1,
    password_changed_at: now,
    must_change_password: false,
    failed_login_count: 0,
    locked_until: '',
    updated_at: now,
    updated_by: email
  });
  upsertSheetObject_(SPREADSHEETS.commandCenter, SHEETS.citadelUsers, 'email', email, record);
  PropertiesService.getScriptProperties().setProperty('CITADEL_AUTH_ENFORCEMENT', 'true');
  appendAccessAudit_({ user_id: record.user_id, email: email, action: 'initialize_administrator', resource: 'citadel', outcome: 'allowed', details: 'Administrator-managed password authentication enabled.' });
  const result = { administrator: email, temporary_password: temporaryPassword, enforcement_enabled: true };
  Logger.log(JSON.stringify(result, null, 2));
  return result;
}

function citadelPbkdf2FirstBlock_(password, salt) {
  const saltBytes = Utilities.base64DecodeWebSafe(String(salt || ''));
  const block = saltBytes.concat([0, 0, 0, 1]);
  const key = Utilities.newBlob(String(password || '')).getBytes();
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(block, key)).replace(/=+$/g, '');
}

function getAccessControlStatus() {
  const spreadsheetId = SPREADSHEETS.commandCenter;
  const ready = [SHEETS.citadelUsers, SHEETS.citadelSessions, SHEETS.accessAudit].every(function(sheetName) {
    return sheetExists_(spreadsheetId, sheetName);
  });
  const users = ready ? readSheetObjects_(spreadsheetId, SHEETS.citadelUsers) : [];
  const activeUsers = users.filter(function(user) { return String(user.status || '').toLowerCase() === 'active'; });
  const properties = PropertiesService.getScriptProperties();
  return {
    ready: ready,
    enforcement_enabled: isCitadelAuthEnforced_(),
    password_auth_ready: activeUsers.some(function(user) {
      return normalizeEmail_(user.email) === normalizeEmail_(CITADEL_INITIAL_ADMIN_EMAIL) && !!String(user.password_hash || '').trim();
    }),
    user_count: users.length,
    active_user_count: activeUsers.length,
    initial_administrator_configured: activeUsers.some(function(user) {
      return normalizeEmail_(user.email) === normalizeEmail_(CITADEL_INITIAL_ADMIN_EMAIL) && String(user.role || '').toLowerCase() === 'admin';
    })
  };
}

function setCitadelAuthEnforcement(enabled) {
  if (enabled && !getAccessControlStatus().password_auth_ready) {
    throw new Error('Set the initial administrator password before enabling sign-in enforcement.');
  }
  PropertiesService.getScriptProperties().setProperty('CITADEL_AUTH_ENFORCEMENT', enabled ? 'true' : 'false');
  return getAccessControlStatus();
}

function isCitadelAuthEnforced_() {
  return String(PropertiesService.getScriptProperties().getProperty('CITADEL_AUTH_ENFORCEMENT') || '').toLowerCase() === 'true';
}

function normalizeEmail_(value) {
  return String(value || '').trim().toLowerCase();
}

function getCitadelAuthConfig_() {
  const enabled = isCitadelAuthEnforced_();
  return {
    enforcement_enabled: enabled,
    administrator_ready: getAccessControlStatus().initial_administrator_configured,
    password_auth_ready: getAccessControlStatus().password_auth_ready,
    session_hours: CITADEL_SESSION_HOURS,
    password_iterations: CITADEL_PASSWORD_ITERATIONS,
    password_management: 'administrator'
  };
}

function getCitadelPasswordChallenge_(username) {
  setupAccessControl();
  const email = normalizeEmail_(username);
  const users = readSheetObjects_(SPREADSHEETS.commandCenter, SHEETS.citadelUsers);
  const user = users.find(function(candidate) {
    return normalizeEmail_(candidate.email) === email && String(candidate.status || '').toLowerCase() === 'active' && !!String(candidate.password_hash || '').trim();
  });
  return {
    login_challenge: createCitadelLoginChallenge_(),
    password_salt: user ? String(user.password_salt || '') : secureCitadelToken_(),
    password_iterations: user ? Math.max(Number(user.password_iterations || CITADEL_PASSWORD_ITERATIONS), 1) : CITADEL_PASSWORD_ITERATIONS
  };
}

function createCitadelLoginChallenge_() {
  const challenge = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
  CacheService.getScriptCache().put('CITADEL_LOGIN_' + challenge, 'unused', 600);
  return challenge;
}

function consumeCitadelLoginChallenge_(challenge) {
  const normalized = String(challenge || '').trim();
  if (!normalized) throw new Error('The sign-in request is missing its security challenge.');
  const cache = CacheService.getScriptCache();
  const key = 'CITADEL_LOGIN_' + normalized;
  if (cache.get(key) !== 'unused') throw new Error('The sign-in request expired. Please try again.');
  cache.remove(key);
  return normalized;
}

function loginWithPassword_(payload) {
  setupAccessControl();
  consumeCitadelLoginChallenge_(payload.login_challenge);
  const email = normalizeEmail_(payload.username);
  const passwordProof = String(payload.password_proof || '');
  if (!email || !passwordProof) throw new Error('Enter your email address and password.');
  const spreadsheetId = SPREADSHEETS.commandCenter;
  const users = readSheetObjects_(spreadsheetId, SHEETS.citadelUsers);
  const user = users.find(function(candidate) { return normalizeEmail_(candidate.email) === email; });
  if (!user || String(user.status || '').toLowerCase() !== 'active' || !user.password_hash) {
    appendAccessAudit_({ email: email, action: 'login', resource: 'citadel', outcome: 'denied', details: 'Invalid credentials or inactive account.' });
    throw new Error('The email address or password is incorrect.');
  }
  const lockedUntil = user.locked_until ? new Date(user.locked_until).getTime() : 0;
  if (lockedUntil > Date.now()) {
    appendAccessAudit_({ user_id: user.user_id, email: email, action: 'login', resource: 'citadel', outcome: 'denied', details: 'Account temporarily locked.' });
    throw new Error('This account is temporarily locked. Try again later or contact the Citadel administrator.');
  }
  if (!verifyCitadelPasswordProof_(passwordProof, user)) {
    recordCitadelLoginFailure_(user);
    appendAccessAudit_({ user_id: user.user_id, email: email, action: 'login', resource: 'citadel', outcome: 'denied', details: 'Invalid password.' });
    throw new Error('The email address or password is incorrect.');
  }

  const now = new Date();
  const nowIso = now.toISOString();
  const updatedUser = Object.assign({}, user, {
    failed_login_count: 0,
    locked_until: '',
    last_login_at: nowIso,
    updated_at: nowIso,
    updated_by: email
  });
  upsertSheetObject_(spreadsheetId, SHEETS.citadelUsers, 'email', email, updatedUser);
  appendAccessAudit_({ user_id: updatedUser.user_id, email: email, action: 'login', resource: 'citadel', outcome: 'allowed', details: 'Password sign-in completed.' });
  return createCitadelSession_(updatedUser);
}

function getCitadelPasswordPepper_() {
  const properties = PropertiesService.getScriptProperties();
  let pepper = properties.getProperty('CITADEL_PASSWORD_PEPPER');
  if (!pepper) {
    pepper = secureCitadelToken_() + secureCitadelToken_();
    properties.setProperty('CITADEL_PASSWORD_PEPPER', pepper);
  }
  return pepper;
}

function citadelPasswordVerifier_(passwordProof, salt, iterations) {
  const message = [String(passwordProof || ''), String(salt || ''), String(iterations || '')].join('|');
  return Utilities.base64EncodeWebSafe(
    Utilities.computeHmacSha256Signature(message, getCitadelPasswordPepper_())
  ).replace(/=+$/g, '');
}

function verifyCitadelPasswordProof_(passwordProof, user) {
  const expected = String(user.password_hash || '');
  const actual = citadelPasswordVerifier_(passwordProof, user.password_salt, user.password_iterations);
  if (expected.length !== actual.length) return false;
  let difference = 0;
  for (let i = 0; i < expected.length; i++) difference |= expected.charCodeAt(i) ^ actual.charCodeAt(i);
  return difference === 0;
}

function recordCitadelLoginFailure_(user) {
  const failures = Number(user.failed_login_count || 0) + 1;
  const now = new Date();
  const lockedUntil = failures >= CITADEL_MAX_FAILED_LOGINS
    ? new Date(now.getTime() + CITADEL_LOCKOUT_MINUTES * 60 * 1000).toISOString()
    : '';
  upsertSheetObject_(SPREADSHEETS.commandCenter, SHEETS.citadelUsers, 'email', normalizeEmail_(user.email), Object.assign({}, user, {
    failed_login_count: failures >= CITADEL_MAX_FAILED_LOGINS ? 0 : failures,
    locked_until: lockedUntil,
    updated_at: now.toISOString(),
    updated_by: 'Authentication service'
  }));
}

function applyCitadelPasswordProof_(record, payload, actorEmail) {
  const proof = String(payload.password_proof || '').trim();
  if (!proof) return record;
  const salt = String(payload.password_salt || '').trim();
  const iterations = Number(payload.password_iterations || 0);
  if (!salt || iterations < CITADEL_PASSWORD_ITERATIONS) throw new Error('The password security settings are invalid.');
  record.password_salt = salt;
  record.password_hash = citadelPasswordVerifier_(proof, salt, iterations);
  record.password_iterations = iterations;
  record.password_changed_at = new Date().toISOString();
  record.must_change_password = false;
  record.failed_login_count = 0;
  record.locked_until = '';
  revokeCitadelUserSessions_(record.user_id, actorEmail);
  return record;
}

function revokeCitadelUserSessions_(userId, actorEmail) {
  if (!userId || !sheetExists_(SPREADSHEETS.commandCenter, SHEETS.citadelSessions)) return;
  const sessions = readSheetObjects_(SPREADSHEETS.commandCenter, SHEETS.citadelSessions);
  const now = new Date().toISOString();
  sessions.filter(function(session) {
    return String(session.user_id || '') === String(userId) && citadelBoolean_(session.active);
  }).forEach(function(session) {
    upsertSheetObject_(SPREADSHEETS.commandCenter, SHEETS.citadelSessions, 'session_hash', session.session_hash, Object.assign({}, session, {
      active: false, revoked_at: now, revoked_by: actorEmail || 'Administrator'
    }));
  });
}

function createCitadelSession_(user) {
  const now = new Date();
  const sessionToken = secureCitadelToken_();
  const csrfToken = secureCitadelToken_();
  const expires = new Date(now.getTime() + CITADEL_SESSION_HOURS * 60 * 60 * 1000);
  const session = { session_hash: hashCitadelSecret_(sessionToken), user_id: user.user_id, email: normalizeEmail_(user.email), issued_at: now.toISOString(), expires_at: expires.toISOString(), last_seen_at: now.toISOString(), revoked_at: '', revoked_by: '', active: true, csrf_hash: hashCitadelSecret_(csrfToken) };
  appendObject_(SPREADSHEETS.commandCenter, SHEETS.citadelSessions, session);
  return { ok: true, session_token: sessionToken, csrf_token: csrfToken, expires_at: session.expires_at, user: publicCitadelUser_(user) };
}

function citadelLoginBridgeOutput_(payload) {
  const safePayload = JSON.stringify(payload || {}).replace(/</g, '\\u003c');
  const html = '<!doctype html><meta charset="utf-8"><script>' +
    'window.parent.postMessage({type:"citadel-auth",payload:' + safePayload + '},' + JSON.stringify(CITADEL_APP_ORIGIN) + ');' +
    '<\/script>';
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function authorizeCitadelRequest_(e, action) {
  if (!isCitadelAuthEnforced_()) return { bypass: true, action: action, user: null, session: null };
  setupAccessControl();
  const params = e && e.parameter ? e.parameter : {};
  const sessionToken = String(params.session_token || '').trim();
  if (!sessionToken) throw new Error('Sign in is required.');
  const spreadsheetId = SPREADSHEETS.commandCenter;
  const sessionHash = hashCitadelSecret_(sessionToken);
  const sessions = readSheetObjects_(spreadsheetId, SHEETS.citadelSessions);
  const session = sessions.find(function(candidate) { return String(candidate.session_hash || '') === sessionHash; });
  if (!session || !citadelBoolean_(session.active) || session.revoked_at || new Date(session.expires_at).getTime() <= Date.now()) {
    throw new Error('Your Citadel session expired. Please sign in again.');
  }
  const users = readSheetObjects_(spreadsheetId, SHEETS.citadelUsers);
  const user = users.find(function(candidate) { return String(candidate.user_id || '') === String(session.user_id || ''); });
  if (!user || String(user.status || '').toLowerCase() !== 'active') throw new Error('Your Citadel access is not active.');

  const rule = citadelAccessRule_(action);
  if (!citadelListAllows_(user.modules, rule.module) || !citadelListAllows_(user.permissions, rule.permission)) {
    appendAccessAudit_({ user_id: user.user_id, email: user.email, action: action, resource: rule.module, outcome: 'denied', details: 'Permission required: ' + rule.permission });
    throw new Error('You do not have permission to perform this Citadel action.');
  }
  if (rule.mutates) {
    const csrfToken = String(params.csrf_token || '').trim();
    if (!csrfToken || hashCitadelSecret_(csrfToken) !== String(session.csrf_hash || '')) throw new Error('The request security token is invalid.');
    assertCitadelMutationRegion_(action, params, user);
  }
  return { bypass: false, action: action, user: user, session: session, rule: rule, session_token: sessionToken };
}

function citadelAccessRule_(action) {
  const rules = {
    getLiens: ['liens', 'view'], getLienPayments: ['liens', 'view'], getPaymentImportStatus: ['data-connections', 'admin'], runPaymentImport: ['data-connections', 'admin', true],
    getLienImportStatus: ['data-connections', 'admin'], runLienImport: ['data-connections', 'admin', true], getContractors: ['contractors', 'view'], getPricing: ['pricing', 'view'],
    getReviews: ['reviews', 'view'], getFleet: ['fleet', 'view'], getFleetImportStatus: ['data-connections', 'admin'], runFleetImport: ['data-connections', 'admin', true],
    getRegistrations: ['registrations', 'view'], getSuppliers: ['suppliers', 'view'], getCollections: ['collections', 'view'], getCurrentUser: ['', 'view'], logout: ['', 'view', true],
    getCitadelUsers: ['command-center', 'admin'], saveCitadelUser: ['command-center', 'admin', true]
  };
  if (rules[action]) return { module: rules[action][0], permission: rules[action][1], mutates: !!rules[action][2] };
  if (/^(setup|import|run)/i.test(action)) return { module: 'data-connections', permission: 'admin', mutates: true };
  if (/^(save|update|restart|remove)/i.test(action)) {
    const module = /Registration/i.test(action) ? 'registrations' : /Supplier/i.test(action) ? 'suppliers' : /Collection|BusinessContact/i.test(action) ? 'collections' : /Contractor/i.test(action) ? 'contractors' : /Review/i.test(action) ? 'reviews' : /Fleet/i.test(action) ? 'fleet' : 'liens';
    return { module: module, permission: 'edit', mutates: true };
  }
  return { module: 'command-center', permission: 'view', mutates: false };
}

function citadelListAllows_(value, required) {
  if (!String(required || '').trim()) return true;
  const values = String(value || '').split(',').map(function(item) { return item.trim().toLowerCase(); }).filter(Boolean);
  return values.indexOf('*') > -1 || values.indexOf(String(required || '').toLowerCase()) > -1;
}

function citadelBoolean_(value) {
  return value === true || /^(true|yes|active|1)$/i.test(String(value || '').trim());
}

function citadelAuthorizedRegions_(user) {
  const raw = String(user && user.regions || '').trim();
  if (!raw || raw === '*') return raw === '*' ? null : [];
  return raw.split(',').map(citadelRegionKey_).filter(Boolean);
}

function citadelRegionKey_(value) {
  return String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function citadelRegionValues_(row) {
  if (!row || typeof row !== 'object') return [];
  const keys = ['region', 'regions', 'regions_raw', 'state', 'platform', 'market', 'location', 'device_group'];
  const values = [];
  keys.forEach(function(key) {
    String(row[key] == null ? '' : row[key]).split(/[|,;]/).forEach(function(value) {
      const normalized = citadelRegionKey_(value);
      if (normalized) values.push(normalized);
    });
  });
  return Array.from(new Set(values));
}

function citadelRegionMatches_(allowed, candidate) {
  if (!allowed || !candidate) return false;
  if (allowed === candidate) return true;
  if (allowed.length < 3 || candidate.length < 3) return false;
  return (' ' + candidate + ' ').indexOf(' ' + allowed + ' ') > -1 ||
    (' ' + allowed + ' ').indexOf(' ' + candidate + ' ') > -1;
}

function citadelRowInRegionScope_(row, user) {
  const allowed = citadelAuthorizedRegions_(user);
  if (allowed === null) return true;
  if (!allowed.length) return false;
  const candidates = citadelRegionValues_(row);
  return candidates.some(function(candidate) {
    return allowed.some(function(region) { return citadelRegionMatches_(region, candidate); });
  });
}

function citadelFilterRelated_(rows, idFields, allowedIds) {
  return (rows || []).filter(function(row) {
    return idFields.some(function(field) { return allowedIds[String(row[field] || '')]; });
  });
}

function scopeCitadelResponse_(action, data, context) {
  if (!context || context.bypass || !context.user || citadelAuthorizedRegions_(context.user) === null || !data) return data;
  const user = context.user;
  const scoped = Object.assign({}, data);

  if (action === 'getLiens') {
    scoped.records = (data.records || []).filter(function(row) { return citadelRowInRegionScope_(row, user); });
    const ids = scoped.records.reduce(function(map, row) { map[String(row.lien_id || '')] = true; return map; }, {});
    scoped.notes = citadelFilterRelated_(data.notes, ['lien_id'], ids);
    scoped.alerts = citadelFilterRelated_(data.alerts, ['lien_id'], ids);
    scoped.followUps = citadelFilterRelated_(data.followUps, ['lien_id'], ids);
    scoped.metrics = buildLienMetrics_(scoped.records);
    return scoped;
  }

  if (action === 'getLienPayments') {
    const summary = data.summary || {};
    if (!citadelRowInRegionScope_(summary, user)) throw new Error('This payment history is outside your assigned regions.');
    return data;
  }

  if (action === 'getCollections') {
    scoped.records = (data.records || []).filter(function(row) { return citadelRowInRegionScope_(row, user); });
    const ids = scoped.records.reduce(function(map, row) { map[String(row.collection_id || '')] = true; return map; }, {});
    scoped.notes = citadelFilterRelated_(data.notes, ['collection_id'], ids);
    scoped.alerts = citadelFilterRelated_(data.alerts, ['collection_id'], ids);
    scoped.metrics = buildCollectionMetrics_(scoped.records, scoped.alerts);
    return scoped;
  }

  if (action === 'getRegistrations') {
    scoped.requests = (data.requests || []).filter(function(row) { return citadelRowInRegionScope_(row, user); });
    scoped.openRequests = (data.openRequests || []).filter(function(row) { return citadelRowInRegionScope_(row, user); });
    scoped.activeRegistrations = (data.activeRegistrations || []).filter(function(row) { return citadelRowInRegionScope_(row, user); });
    scoped.archivedRequests = (data.archivedRequests || []).filter(function(row) { return citadelRowInRegionScope_(row, user); });
    const requestIds = scoped.requests.reduce(function(map, row) { map[String(row.request_id || '')] = true; return map; }, {});
    const registrationIds = scoped.activeRegistrations.reduce(function(map, row) { map[String(row.registration_id || '')] = true; return map; }, {});
    scoped.notes = citadelFilterRelated_(data.notes, ['request_id', 'registration_id'], Object.assign({}, requestIds, registrationIds));
    scoped.alerts = citadelFilterRelated_(data.alerts, ['request_id', 'registration_id'], Object.assign({}, requestIds, registrationIds));
    scoped.followUps = citadelFilterRelated_(data.followUps, ['request_id', 'registration_id'], Object.assign({}, requestIds, registrationIds));
    scoped.banners = (data.banners || []).filter(function(row) {
      return String(row.regions || '').toUpperCase() === 'ALL' || citadelRowInRegionScope_(row, user);
    });
    scoped.metrics = {
      open_alerts: scoped.alerts.length + scoped.followUps.filter(function(row) { return String(row.status || '').toLowerCase() !== 'completed'; }).length,
      new_requests: scoped.openRequests.filter(function(row) { return String(row.status || '').toLowerCase() === 'new'; }).length,
      open_requests: scoped.openRequests.length,
      active_registrations: scoped.activeRegistrations.length,
      archived_requests: scoped.archivedRequests.length
    };
    return scoped;
  }

  if (action === 'getSuppliers') {
    scoped.records = (data.records || []).filter(function(row) { return citadelRowInRegionScope_(row, user); });
    const ids = scoped.records.reduce(function(map, row) { map[String(row.supplier_id || '')] = true; return map; }, {});
    scoped.contacts = citadelFilterRelated_(data.contacts, ['supplier_id'], ids);
    scoped.documents = citadelFilterRelated_(data.documents, ['supplier_id'], ids);
    scoped.notes = citadelFilterRelated_(data.notes, ['supplier_id'], ids);
    scoped.alerts = citadelFilterRelated_(data.alerts, ['supplier_id'], ids);
    scoped.audit = citadelFilterRelated_(data.audit, ['supplier_id'], ids);
    scoped.metrics = buildSupplierMetrics_(scoped.records, scoped.alerts);
    return scoped;
  }

  if (action === 'getReviews' || action === 'getContractors') {
    const idField = action === 'getReviews' ? 'review_id' : 'contractor_id';
    scoped.records = (data.records || []).filter(function(row) { return citadelRowInRegionScope_(row, user); });
    const ids = scoped.records.reduce(function(map, row) { map[String(row[idField] || '')] = true; return map; }, {});
    scoped.notes = citadelFilterRelated_(data.notes, [idField], ids);
    scoped.alerts = citadelFilterRelated_(data.alerts, [idField], ids);
    scoped.followUps = citadelFilterRelated_(data.followUps, [idField], ids);
    scoped.metrics = action === 'getReviews' ? buildReviewMetrics_(scoped.records, scoped.alerts, scoped.followUps) : buildContractorMetrics_(scoped.records, scoped.alerts, scoped.followUps);
    return scoped;
  }

  if (action === 'getFleet') {
    scoped.fleetRecords = (data.fleetRecords || []).filter(function(row) { return citadelRowInRegionScope_(row, user); });
    scoped.vehicles = (data.vehicles || []).filter(function(row) { return citadelRowInRegionScope_(row, user); });
    scoped.drivers = (data.drivers || []).filter(function(row) { return citadelRowInRegionScope_(row, user); });
    const ids = scoped.vehicles.concat(scoped.drivers, scoped.fleetRecords).reduce(function(map, row) {
      [row.fleet_record_id, row.vehicle_id, row.driver_id, row.unit_number].forEach(function(id) { if (id) map[String(id)] = true; });
      return map;
    }, {});
    scoped.notes = citadelFilterRelated_(data.notes, ['fleet_record_id'], ids);
    scoped.alerts = citadelFilterRelated_(data.alerts, ['fleet_record_id'], ids);
    scoped.followUps = citadelFilterRelated_(data.followUps, ['fleet_record_id'], ids);
    scoped.metrics = buildFleetMetrics_(scoped.vehicles, scoped.drivers, scoped.alerts, scoped.followUps);
    scoped.source_rows = scoped.fleetRecords.length;
    return scoped;
  }

  if (action === 'getPricing') {
    scoped.rows = (data.rows || []).filter(function(row) { return citadelRowInRegionScope_(row, user); });
    scoped.total = scoped.rows.length;
    scoped.states = Array.from(new Set(scoped.rows.map(function(row) { return row.state; }).filter(Boolean))).sort();
    return scoped;
  }

  return data;
}

function assertCitadelMutationRegion_(action, params, user) {
  const allowed = citadelAuthorizedRegions_(user);
  if (allowed === null || action === 'logout' || action === 'saveCitadelUser' || /^(run|setup|import|record)/i.test(action)) return;
  if (action === 'saveBusinessContact' || action === 'saveCollectionAttorney') return;
  if (!allowed.length) throw new Error('No regions are assigned to your Citadel account.');

  const requestedRegions = String(params.regions || '').split(/[|,;]/).map(citadelRegionKey_).filter(Boolean);
  if (requestedRegions.length) {
    if (requestedRegions.indexOf('ALL') > -1 || requestedRegions.some(function(region) {
      return !allowed.some(function(candidate) { return citadelRegionMatches_(candidate, region); });
    })) throw new Error('You cannot save records outside your assigned regions.');
    return;
  }

  const direct = citadelRegionValues_(params);
  if (direct.length) {
    if (!citadelRowInRegionScope_(params, user)) throw new Error('You cannot save records outside your assigned regions.');
    return;
  }

  const linked = citadelMutationRegionRecord_(action, params);
  if (!linked || !citadelRowInRegionScope_(linked, user)) throw new Error('This record is outside your assigned regions.');
}

function citadelMutationRegionRecord_(action, params) {
  function find(rows, field, value) {
    return (rows || []).find(function(row) { return String(row[field] || '') === String(value || ''); }) || null;
  }
  if (/Lien/i.test(action) && params.lien_id) return find(readSheetObjects_(SPREADSHEETS.liens, SHEETS.lienRecords), 'lien_id', params.lien_id);
  if (/Contractor/i.test(action) && params.contractor_id) return find(readSheetObjects_(getContractorsSpreadsheetId_(), SHEETS.contractorRecords).map(mapContractorRecord_), 'contractor_id', params.contractor_id);
  if (/Review/i.test(action) && params.review_id) {
    const spreadsheetId = getReviewsSpreadsheetId_();
    return find(readSheetObjects_(spreadsheetId, getReviewSourceSheetName_(spreadsheetId)).map(mapReviewRecord_), 'review_id', params.review_id);
  }
  if (/Fleet/i.test(action) && params.fleet_record_id) {
    const data = getFleet();
    return find((data.vehicles || []).concat(data.drivers || [], data.fleetRecords || []), 'fleet_record_id', params.fleet_record_id) ||
      find(data.vehicles, 'vehicle_id', params.fleet_record_id) || find(data.drivers, 'driver_id', params.fleet_record_id);
  }
  if (/Registration/i.test(action)) {
    const spreadsheetId = getRegistrationsSpreadsheetId_();
    if (params.request_id) return find(readSheetObjects_(spreadsheetId, SHEETS.registrationRequests), 'request_id', params.request_id);
    if (params.registration_id) return find(readSheetObjects_(spreadsheetId, SHEETS.activeRegistrations), 'registration_id', params.registration_id);
    if (params.banner_id) return find(readSheetObjects_(spreadsheetId, SHEETS.registrationBanners), 'banner_id', params.banner_id);
  }
  if (/Supplier/i.test(action) && params.supplier_id) return find(readSheetObjects_(SPREADSHEETS.suppliers, SHEETS.supplierAccounts), 'supplier_id', params.supplier_id);
  if (/Collection/i.test(action)) {
    if (params.collection_id) {
      const tracking = find(readSheetObjects_(SPREADSHEETS.commandCenter, SHEETS.collectionRecords), 'collection_id', params.collection_id);
      if (tracking) return tracking;
    }
    if (params.lien_id) return find(readSheetObjects_(SPREADSHEETS.liens, SHEETS.lienRecords), 'lien_id', params.lien_id);
  }
  return null;
}

function secureCitadelToken_() {
  return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, Utilities.getUuid() + '|' + Utilities.getUuid() + '|' + new Date().getTime())).replace(/=+$/g, '');
}

function hashCitadelSecret_(value) {
  return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(value || ''))).replace(/=+$/g, '');
}

function publicCitadelUser_(user) {
  if (!user) return null;
  return {
    user_id: user.user_id || '', email: normalizeEmail_(user.email), display_name: user.display_name || '', role: user.role || '',
    modules: user.modules || '', regions: user.regions || '', permissions: user.permissions || '', status: user.status || '',
    password_configured: !!String(user.password_hash || '').trim()
  };
}

function getCitadelUsers_() {
  return readSheetObjects_(SPREADSHEETS.commandCenter, SHEETS.citadelUsers)
    .map(function(user) {
      return Object.assign(publicCitadelUser_(user), {
        invited_at: user.invited_at || '',
        invited_by: user.invited_by || '',
        last_login_at: user.last_login_at || '',
        updated_at: user.updated_at || ''
      });
    })
    .sort(function(a, b) { return String(a.display_name || a.email).localeCompare(String(b.display_name || b.email)); });
}

function saveCitadelUser_(payload, actor) {
  const email = normalizeEmail_(payload.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.');
  const allowedRoles = ['Admin', 'Manager', 'Editor', 'Read Only'];
  const allowedStatuses = ['Invited', 'Active', 'Suspended', 'Deactivated'];
  const role = allowedRoles.indexOf(payload.role) > -1 ? payload.role : 'Read Only';
  const status = allowedStatuses.indexOf(payload.status) > -1 ? payload.status : 'Invited';
  if (email === normalizeEmail_(CITADEL_INITIAL_ADMIN_EMAIL) && (role !== 'Admin' || status !== 'Active')) {
    throw new Error('The initial Citadel administrator must remain an active Admin.');
  }
  const modules = normalizeCitadelAccessList_(payload.modules, CITADEL_ACCESS_MODULES, role === 'Admin');
  const permissions = normalizeCitadelAccessList_(payload.permissions, ['view', 'edit', 'export', 'admin'], role === 'Admin');
  const regions = normalizeCitadelRegionAccess_(payload.regions, role === 'Admin');
  const now = new Date().toISOString();
  const users = readSheetObjects_(SPREADSHEETS.commandCenter, SHEETS.citadelUsers);
  const existing = users.find(function(user) { return normalizeEmail_(user.email) === email; }) || {};
  if (!existing.user_id && !String(payload.password_proof || '').trim()) throw new Error('Set a password for the new user.');
  const record = {
    user_id: existing.user_id || ('USR-' + Utilities.getUuid()),
    email: email,
    display_name: String(payload.display_name || existing.display_name || email).trim(),
    role: role,
    modules: modules,
    regions: regions,
    permissions: permissions,
    status: status,
    password_salt: existing.password_salt || '',
    password_hash: existing.password_hash || '',
    password_iterations: existing.password_iterations || '',
    password_changed_at: existing.password_changed_at || '',
    must_change_password: false,
    failed_login_count: existing.failed_login_count || 0,
    locked_until: existing.locked_until || '',
    invited_at: existing.invited_at || now,
    invited_by: existing.invited_by || actor.email,
    last_login_at: existing.last_login_at || '',
    created_at: existing.created_at || now,
    created_by: existing.created_by || actor.email,
    updated_at: now,
    updated_by: actor.email
  };
  applyCitadelPasswordProof_(record, payload, actor.email);
  upsertSheetObject_(SPREADSHEETS.commandCenter, SHEETS.citadelUsers, 'email', email, record);
  appendAccessAudit_({
    user_id: actor.user_id,
    email: actor.email,
    action: existing.user_id ? (payload.password_proof ? 'reset_password_and_update_user' : 'update_user') : 'create_user',
    resource: email,
    outcome: 'allowed',
    details: role + '; ' + status + '; modules=' + modules + '; regions=' + regions + '; permissions=' + permissions
  });
  return publicCitadelUser_(record);
}

function normalizeCitadelAccessList_(value, allowed, allAccess) {
  if (allAccess || String(value || '').trim() === '*') return '*';
  const lookup = allowed.reduce(function(map, item) { map[String(item).toLowerCase()] = item; return map; }, {});
  const result = String(value || '').split(',').map(function(item) { return lookup[item.trim().toLowerCase()] || ''; }).filter(Boolean);
  return Array.from(new Set(result)).join(',');
}

function normalizeCitadelRegionAccess_(value, allAccess) {
  if (allAccess || String(value || '').trim() === '*') return '*';
  const result = String(value || '').split(',').map(function(item) { return item.trim().toUpperCase(); }).filter(function(item) {
    return /^[A-Z0-9 -]{2,30}$/.test(item);
  });
  return Array.from(new Set(result)).join(',');
}

function requireCitadelAdmin_(context) {
  if (!context || context.bypass || !context.user || !citadelListAllows_(context.user.permissions, 'admin')) {
    throw new Error('Administrator sign-in is required.');
  }
}

function revokeCitadelSession_(context) {
  if (!context || context.bypass || !context.session) return { revoked: false };
  const now = new Date().toISOString();
  const session = Object.assign({}, context.session, { active: false, revoked_at: now, revoked_by: context.user.email, last_seen_at: now });
  upsertSheetObject_(SPREADSHEETS.commandCenter, SHEETS.citadelSessions, 'session_hash', session.session_hash, session);
  appendAccessAudit_({ user_id: context.user.user_id, email: context.user.email, action: 'logout', resource: 'citadel', outcome: 'allowed', details: 'Session revoked.' });
  return { revoked: true };
}

function appendAccessAudit_(event) {
  if (!sheetExists_(SPREADSHEETS.commandCenter, SHEETS.accessAudit)) return;
  const occurredAt = new Date().toISOString();
  appendObject_(SPREADSHEETS.commandCenter, SHEETS.accessAudit, {
    event_id: Utilities.getUuid(), occurred_at: occurredAt, user_id: event.user_id || '', email: normalizeEmail_(event.email),
    action: event.action || '', resource: event.resource || '', outcome: event.outcome || '', ip_hash: event.ip_hash || '',
    user_agent_hash: event.user_agent_hash || '', details: event.details || ''
  });
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
  const statuses = String(row.source_statuses || row.status || '')
    .split('|')
    .map(function(value) { return value.trim().toLowerCase(); });
  return statuses.indexOf('collection agency') >= 0;
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
    notifyLienAutomationFailure_('Payment import', error && error.message ? error.message : String(error));
    throw error;
  } finally {
    lock.releaseLock();
  }
}

function readPaymentImportLogs_() {
  const sheet = getRequiredSheet_(getPaymentsSpreadsheetId_(), SHEETS.paymentImportLog);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0].map(normalizeHeader_);
  return values.slice(1)
    .filter(function(row) { return row.some(function(cell) { return cell !== '' && cell !== null; }); })
    .map(function(row) {
      return headers.reduce(function(record, header, index) {
        if (!header) return record;
        const value = row[index];
        record[header] = header === 'imported_at' && value instanceof Date
          ? Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd h:mm a')
          : normalizeValue_(value);
        return record;
      }, {});
    });
}
function getPaymentImportStatus() {
  const spreadsheetId = getPaymentsSpreadsheetId_();
  setupPaymentsSheet();
  const logs = readPaymentImportLogs_();
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
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.contractorCrews, CONTRACTOR_CREW_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.contractorNotes, CONTRACTOR_NOTE_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.contractorAlerts, CONTRACTOR_ALERT_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.contractorFollowUps, CONTRACTOR_FOLLOWUP_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.contractorMetrics, CONTRACTOR_METRIC_HEADERS);
  return { spreadsheet_id: spreadsheetId, sheets: [SHEETS.contractorRecords, SHEETS.contractorCrews, SHEETS.contractorNotes, SHEETS.contractorAlerts, SHEETS.contractorFollowUps, SHEETS.contractorMetrics] };
}

function getContractors() {
  const spreadsheetId = getContractorsSpreadsheetId_();
  const rawRecords = sheetExists_(spreadsheetId, SHEETS.contractorRecords) ? readSheetObjects_(spreadsheetId, SHEETS.contractorRecords) : [];
  const rawCrews = sheetExists_(spreadsheetId, SHEETS.contractorCrews) ? readSheetObjects_(spreadsheetId, SHEETS.contractorCrews).filter(isActiveRow_) : [];
  const notes = sheetExists_(spreadsheetId, SHEETS.contractorNotes) ? readSheetObjects_(spreadsheetId, SHEETS.contractorNotes) : [];
  const alerts = sheetExists_(spreadsheetId, SHEETS.contractorAlerts) ? readSheetObjects_(spreadsheetId, SHEETS.contractorAlerts) : [];
  const followUps = sheetExists_(spreadsheetId, SHEETS.contractorFollowUps) ? readSheetObjects_(spreadsheetId, SHEETS.contractorFollowUps) : [];
  const recordsById = {};
  rawRecords.map(mapContractorRecord_).filter(function(row) { return row.contractor_name; }).forEach(function(record) {
    const key = String(record.contractor_id || record.contractor_name).toLowerCase();
    if (!recordsById[key]) recordsById[key] = record;
  });
  const records = Object.keys(recordsById).map(function(key) { return recordsById[key]; });
  const crewsById = {};
  rawCrews.forEach(function(crew) {
    const key = String(crew.crew_id || [crew.contractor_id, crew.crew_name, crew.crew_status].join('|')).toLowerCase();
    if (!crewsById[key]) crewsById[key] = crew;
  });
  const crews = Object.keys(crewsById).map(function(key) { return crewsById[key]; });
  const activeAlerts = alerts.filter(isActiveRow_);
  const activeFollowUps = followUps.filter(isActiveRow_);
  const latestNoteByContractor = latestById_(notes, 'contractor_id', 'note_date');
  return {
    metrics: sheetExists_(spreadsheetId, SHEETS.contractorMetrics) ? readSheetObjects_(spreadsheetId, SHEETS.contractorMetrics).sort(sortByOrder_) : buildContractorMetrics_(records, activeAlerts, activeFollowUps),
    notes: notes,
    alerts: activeAlerts,
    followUps: activeFollowUps,
    crews: crews,
    records: records.map(function(record) {
      const note = latestNoteByContractor[String(record.contractor_id)] || {};
      record.workflow_note = note.note_text || '';
      record.notes_count = notes.filter(function(item) { return String(item.contractor_id) === String(record.contractor_id); }).length;
      record.alerts_count = activeAlerts.filter(function(item) { return String(item.contractor_id) === String(record.contractor_id); }).length;
      record.followups_count = activeFollowUps.filter(function(item) { return String(item.contractor_id) === String(record.contractor_id); }).length;
      record.crews = crews.filter(function(item) { return String(item.contractor_id) === String(record.contractor_id); });
      record.crew_count = record.crews.length;
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

function saveContractorDetails(payload) {
  if (!payload || !payload.contractor_id) throw new Error('contractor_id is required.');
  const spreadsheetId = getContractorsSpreadsheetId_();
  const rows = readSheetObjects_(spreadsheetId, SHEETS.contractorRecords);
  const existing = rows.find(function(row) {
    return String(getField_(row, ['contractor_id', 'id'])) === String(payload.contractor_id);
  });
  if (!existing) throw new Error('The contractor record could not be found.');

  const record = {
    contractor_id: payload.contractor_id,
    Contractor: getField_(existing, ['contractor', 'contractor_name', 'company_name', 'name']),
    Phone: String(payload.phone || '').trim(),
    Email: String(payload.email || '').trim(),
    Regions: String(payload.regions || '').trim(),
    Address: String(payload.address || '').trim()
  };
  upsertSheetObject_(spreadsheetId, SHEETS.contractorRecords, 'contractor_id', payload.contractor_id, record);
  return mapContractorRecord_(record);
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
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.fleet, FLEET_RECORD_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.fleetImport, FLEET_SOURCE_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.fleetImportLog, FLEET_IMPORT_LOG_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.fleetAutomationLog, FLEET_AUTOMATION_LOG_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.fleetVehicles, FLEET_VEHICLE_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.fleetDrivers, FLEET_DRIVER_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.fleetNotes, FLEET_NOTE_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.fleetAlerts, FLEET_ALERT_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.fleetFollowUps, FLEET_FOLLOWUP_HEADERS);
  ensureSheetWithHeaders_(spreadsheetId, SHEETS.fleetMetrics, FLEET_METRIC_HEADERS);
  return { spreadsheet_id: spreadsheetId, sheets: [SHEETS.fleetImport, SHEETS.fleet, SHEETS.fleetImportLog, SHEETS.fleetAutomationLog, SHEETS.fleetVehicles, SHEETS.fleetDrivers, SHEETS.fleetNotes, SHEETS.fleetAlerts, SHEETS.fleetFollowUps, SHEETS.fleetMetrics] };
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
  return { metrics: metrics, fleetRecords: sourceRows.map(mapFleetSource_), vehicles: vehicles, drivers: drivers, notes: notes, alerts: alerts, followUps: followUps, source_rows: sourceRows.length, source_tab: fleetSource.name, import_status: getFleetImportHealth_() };
}

function getFleetImportStatus() {
  const spreadsheetId = getFleetSpreadsheetId_();
  setupFleetSheet();
  const stagingSheet = getRequiredSheet_(spreadsheetId, SHEETS.fleetImport);
  const headerResult = validateFleetImportHeaders_(stagingSheet);
  const rows = readSheetObjects_(spreadsheetId, SHEETS.fleetImport);
  const keyCounts = {};
  let missingKeyRows = 0;
  rows.forEach(function(row) {
    const key = fleetStableKey_(row);
    if (!key) {
      missingKeyRows += 1;
      return;
    }
    keyCounts[key] = (keyCounts[key] || 0) + 1;
  });
  const duplicateRows = Object.keys(keyCounts).reduce(function(total, key) {
    return total + Math.max(keyCounts[key] - 1, 0);
  }, 0);
  const logs = readSheetObjects_(spreadsheetId, SHEETS.fleetImportLog);
  const errors = headerResult.missing.map(function(header) { return 'Missing required column: ' + header; });
  if (!rows.length) errors.push('FleetImport has no source rows.');
  if (missingKeyRows) errors.push(missingKeyRows + ' row(s) do not have a usable VIN, serial number, or device name.');
  const warnings = [];
  if (duplicateRows) warnings.push(duplicateRows + ' duplicate device row(s) will be retained and flagged for review.');
  return {
    ready: errors.length === 0,
    source_sheet: SHEETS.fleetImport,
    staging_rows: rows.length,
    unique_devices: Object.keys(keyCounts).length,
    duplicate_rows: duplicateRows,
    missing_key_rows: missingKeyRows,
    errors: errors,
    warnings: warnings,
    latest_import: logs.length ? logs[logs.length - 1] : null,
    recent_imports: logs.slice(-5).reverse(),
    spreadsheet_url: 'https://docs.google.com/spreadsheets/d/' + spreadsheetId + '/edit'
  };
}

function getFleetImportHealth_() {
  const spreadsheetId = getFleetSpreadsheetId_();
  if (!sheetExists_(spreadsheetId, SHEETS.fleetImportLog)) return { status: 'Not configured', latest_import: null };
  const logs = readSheetObjects_(spreadsheetId, SHEETS.fleetImportLog);
  const latest = logs.length ? logs[logs.length - 1] : null;
  const automationLogs = sheetExists_(spreadsheetId, SHEETS.fleetAutomationLog)
    ? readSheetObjects_(spreadsheetId, SHEETS.fleetAutomationLog)
    : [];
  const latestAutomation = automationLogs.length ? automationLogs[automationLogs.length - 1] : null;
  const scheduleEnabled = String(PropertiesService.getScriptProperties().getProperty('FLEET_AUTOMATION_ENABLED') || '').toLowerCase() === 'true';
  return {
    status: latest ? latest.status : 'Not run',
    latest_import: latest,
    latest_automation: latestAutomation,
    schedule_enabled: scheduleEnabled,
    schedule_label: scheduleEnabled ? 'Daily at 7:00 AM ET after the 6:00 AM Geotab report' : 'Geotab daily report configured; protected pickup is not active yet'
  };
}

function setupFleetEmailAutomation() {
  setupFleetSheet();
  const handler = 'runFleetEmailAutomation';
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (trigger.getHandlerFunction() === handler) ScriptApp.deleteTrigger(trigger);
  });
  ScriptApp.newTrigger(handler)
    .timeBased()
    .atHour(7)
    .everyDays(1)
    .inTimezone('America/New_York')
    .create();
  PropertiesService.getScriptProperties().setProperty('FLEET_AUTOMATION_ENABLED', 'true');
  return {
    enabled: true,
    source: 'Geotab Advanced Device Report email',
    schedule: 'Daily at 7:00 AM America/New_York; Saturday and Sunday are skipped',
    next_step: 'The first report will be picked up after Geotab emails it at 6:00 AM.'
  };
}

function disableFleetEmailAutomation() {
  const handler = 'runFleetEmailAutomation';
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (trigger.getHandlerFunction() === handler) ScriptApp.deleteTrigger(trigger);
  });
  PropertiesService.getScriptProperties().setProperty('FLEET_AUTOMATION_ENABLED', 'false');
  return { enabled: false };
}

function runFleetEmailAutomation() {
  const now = new Date();
  const weekday = Number(Utilities.formatDate(now, 'America/New_York', 'u'));
  if (weekday > 5) return { status: 'Skipped', message: 'Fleet automation does not run on weekends.' };

  const startedAt = timestamp_();
  const runId = makeId_('fleet-auto');
  let candidate = null;
  let sourceRows = 0;
  let fleetImport = null;

  try {
    setupFleetSheet();
    candidate = findLatestFleetReportAttachment_();
    if (!candidate) {
      const skipped = {
        run_id: runId,
        started_at: startedAt,
        completed_at: timestamp_(),
        status: 'Skipped - no new report',
        source_rows: '',
        fleet_import_id: '',
        message: 'No new Advanced Device Report email attachment was available. The last good Fleet snapshot remains active.',
        source: 'Geotab email',
        source_message_id: '',
        attachment_name: '',
        attachment_hash: ''
      };
      recordFleetAutomationRun_(skipped);
      return skipped;
    }

    const values = fleetWorkbookValues_(candidate.attachment);
    sourceRows = Math.max(values.length - 1, 0);
    replaceFleetImportValues_(values);
    fleetImport = runFleetImport({ imported_by: 'Scheduled Geotab email ' + runId });

    const completed = {
      run_id: runId,
      started_at: startedAt,
      completed_at: timestamp_(),
      status: 'Completed',
      source_rows: sourceRows,
      fleet_import_id: fleetImport.import_id,
      message: sourceRows + ' Fleet source row(s) validated and published.',
      source: 'Geotab email',
      source_message_id: candidate.messageId,
      attachment_name: candidate.attachment.getName(),
      attachment_hash: candidate.attachmentHash
    };
    recordFleetAutomationRun_(completed);
    return completed;
  } catch (error) {
    const failed = {
      run_id: runId,
      started_at: startedAt,
      completed_at: timestamp_(),
      status: 'Failed',
      source_rows: sourceRows || '',
      fleet_import_id: fleetImport && fleetImport.import_id ? fleetImport.import_id : '',
      message: error && error.message ? error.message : String(error),
      source: 'Geotab email',
      source_message_id: candidate ? candidate.messageId : '',
      attachment_name: candidate ? candidate.attachment.getName() : '',
      attachment_hash: candidate ? candidate.attachmentHash : ''
    };
    try {
      recordFleetAutomationRun_(failed);
    } catch (logError) {
      Logger.log('Unable to write failed Fleet automation log: ' + (logError.message || String(logError)));
    }
    notifyFleetAutomationFailure_(failed.message);
    throw error;
  }
}

function recordFleetAutomationRun_(payload) {
  setupFleetSheet();
  const record = {
    run_id: String(payload.run_id || makeId_('fleet-auto')),
    started_at: payload.started_at || timestamp_(),
    completed_at: payload.completed_at || timestamp_(),
    status: String(payload.status || 'Unknown'),
    source_rows: payload.source_rows === undefined ? '' : payload.source_rows,
    fleet_import_id: String(payload.fleet_import_id || ''),
    message: String(payload.message || ''),
    source: String(payload.source || 'Scheduled automation'),
    source_message_id: String(payload.source_message_id || ''),
    attachment_name: String(payload.attachment_name || ''),
    attachment_hash: String(payload.attachment_hash || '')
  };
  appendObject_(getFleetSpreadsheetId_(), SHEETS.fleetAutomationLog, record);
  return record;
}

function findLatestFleetReportAttachment_() {
  const spreadsheetId = getFleetSpreadsheetId_();
  const processed = {};
  readSheetObjects_(spreadsheetId, SHEETS.fleetAutomationLog).forEach(function(row) {
    if (row.source_message_id) processed[String(row.source_message_id)] = true;
    if (row.attachment_hash) processed[String(row.attachment_hash)] = true;
  });

  const threads = GmailApp.search('newer_than:14d has:attachment (filename:xlsx OR filename:xls)', 0, 50);
  const candidates = [];
  threads.forEach(function(thread) {
    thread.getMessages().forEach(function(message) {
      const messageId = String(message.getId());
      message.getAttachments({ includeInlineImages: false, includeAttachments: true }).forEach(function(attachment) {
        const name = String(attachment.getName() || '');
        const subject = String(message.getSubject() || '');
        if (!/\.xlsx?$/i.test(name)) return;
        if (!/advanced\s*device\s*report|device\s*report|fleet/i.test(name + ' ' + subject)) return;
        const attachmentHash = fleetAttachmentHash_(attachment);
        if (processed[messageId] || processed[attachmentHash]) return;
        candidates.push({
          messageId: messageId,
          messageDate: message.getDate(),
          attachment: attachment,
          attachmentHash: attachmentHash
        });
      });
    });
  });
  candidates.sort(function(a, b) { return b.messageDate.getTime() - a.messageDate.getTime(); });
  return candidates.length ? candidates[0] : null;
}

function fleetAttachmentHash_(attachment) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, attachment.getBytes());
  return digest.map(function(value) { return (value + 256).toString(16).slice(-2); }).join('');
}

function fleetWorkbookValues_(attachment) {
  const convertedId = convertFleetWorkbook_(attachment.copyBlob());
  try {
    let converted = null;
    let lastError = null;
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        converted = SpreadsheetApp.openById(convertedId);
        break;
      } catch (error) {
        lastError = error;
        Utilities.sleep(1000);
      }
    }
    if (!converted) throw lastError || new Error('The converted Fleet workbook was not ready.');
    const sourceSheet = converted.getSheets()[0];
    const rawValues = sourceSheet.getDataRange().getDisplayValues();
    if (rawValues.length < 2) throw new Error('The emailed Advanced Device Report is empty. The last good Fleet snapshot was not changed.');

    const sourceHeaders = rawValues[0].map(function(value) { return String(value || '').trim(); });
    const sourceIndexes = {};
    sourceHeaders.forEach(function(header, index) { sourceIndexes[normalizeFleetHeader_(header)] = index; });
    const missing = FLEET_SOURCE_HEADERS.filter(function(header) {
      return sourceIndexes[normalizeFleetHeader_(header)] === undefined;
    });
    if (missing.length) throw new Error('The emailed Advanced Device Report is missing columns: ' + missing.join(', ') + '. The last good Fleet snapshot was not changed.');

    const rows = rawValues.slice(1).filter(function(row) {
      return row.some(function(value) { return String(value || '').trim() !== ''; });
    }).map(function(row) {
      return FLEET_SOURCE_HEADERS.map(function(header) {
        const index = sourceIndexes[normalizeFleetHeader_(header)];
        return index === undefined ? '' : row[index];
      });
    });
    if (!rows.length) throw new Error('The emailed Advanced Device Report has no Fleet rows. The last good Fleet snapshot was not changed.');
    return [FLEET_SOURCE_HEADERS].concat(rows);
  } finally {
    try {
      DriveApp.getFileById(convertedId).setTrashed(true);
    } catch (cleanupError) {
      Logger.log('Unable to remove temporary Fleet workbook: ' + (cleanupError.message || String(cleanupError)));
    }
  }
}

function convertFleetWorkbook_(blob) {
  const boundary = 'citadel_fleet_' + Utilities.getUuid().replace(/-/g, '');
  const metadata = JSON.stringify({
    name: 'Citadel Fleet Import ' + Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd HH:mm:ss'),
    mimeType: 'application/vnd.google-apps.spreadsheet'
  });
  const contentType = blob.getContentType() || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const prefix = '--' + boundary + '\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n' + metadata +
    '\r\n--' + boundary + '\r\nContent-Type: ' + contentType + '\r\n\r\n';
  const suffix = '\r\n--' + boundary + '--';
  const payload = Utilities.newBlob(prefix).getBytes()
    .concat(blob.getBytes())
    .concat(Utilities.newBlob(suffix).getBytes());
  const response = UrlFetchApp.fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
    method: 'post',
    contentType: 'multipart/related; boundary=' + boundary,
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    payload: payload,
    muteHttpExceptions: true
  });
  if (response.getResponseCode() < 200 || response.getResponseCode() >= 300) {
    throw new Error('Google Drive could not convert the Fleet workbook (HTTP ' + response.getResponseCode() + ').');
  }
  const result = JSON.parse(response.getContentText() || '{}');
  if (!result.id) throw new Error('Google Drive did not return a converted Fleet workbook ID.');
  return result.id;
}

function replaceFleetImportValues_(values) {
  const sheet = getRequiredSheet_(getFleetSpreadsheetId_(), SHEETS.fleetImport);
  const rowCount = values.length;
  const columnCount = values[0].length;
  if (sheet.getMaxRows() < rowCount) sheet.insertRowsAfter(sheet.getMaxRows(), rowCount - sheet.getMaxRows());
  if (sheet.getMaxColumns() < columnCount) sheet.insertColumnsAfter(sheet.getMaxColumns(), columnCount - sheet.getMaxColumns());
  sheet.clearContents();
  sheet.getRange(1, 1, rowCount, columnCount).setValues(values);
}

function notifyFleetAutomationFailure_(message) {
  const configured = String(PropertiesService.getScriptProperties().getProperty('FLEET_AUTOMATION_ALERT_EMAIL') || '').trim();
  if (!configured) {
    Logger.log('Fleet automation failure: ' + message);
    return;
  }
  try {
    MailApp.sendEmail({
      to: configured,
      subject: 'Citadel Fleet automation failed',
      body: 'Citadel could not refresh Fleet from the Geotab Advanced Device Report.\n\n' + message + '\n\nThe last good Fleet snapshot remains active.'
    });
  } catch (notificationError) {
    Logger.log('Unable to send Fleet automation failure notification: ' + (notificationError.message || String(notificationError)));
  }
}

function runFleetImport(options) {
  const context = options || {};
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) throw new Error('Another protected import is already running. Please wait a moment and try again.');

  const spreadsheetId = getFleetSpreadsheetId_();
  const startedAt = timestamp_();
  const importedBy = String(context.imported_by || 'Citadel user').trim() || 'Citadel user';
  const importId = makeId_('fleet-import');
  let sourceRows = 0;

  try {
    setupFleetSheet();
    const stagingSheet = getRequiredSheet_(spreadsheetId, SHEETS.fleetImport);
    const headerResult = validateFleetImportHeaders_(stagingSheet);
    if (headerResult.missing.length) throw new Error('FleetImport is missing required columns: ' + headerResult.missing.join(', '));

    const rawRows = readSheetObjects_(spreadsheetId, SHEETS.fleetImport);
    sourceRows = rawRows.length;
    if (!rawRows.length) throw new Error('FleetImport is empty. Load a fresh Geotab fleet report before running the import.');

    const keyCounts = {};
    const sourceHashCounts = {};
    rawRows.forEach(function(row) {
      const key = fleetStableKey_(row);
      const hash = fleetSourceRowHash_(row);
      if (key) keyCounts[key] = (keyCounts[key] || 0) + 1;
      sourceHashCounts[hash] = (sourceHashCounts[hash] || 0) + 1;
    });

    const missingKeyRows = rawRows.filter(function(row) { return !fleetStableKey_(row); }).length;
    if (missingKeyRows) throw new Error(missingKeyRows + ' FleetImport row(s) do not have a usable VIN, serial number, or device name. The current Fleet snapshot was not changed.');

    const keySequences = {};
    const sourceHashSequences = {};
    const importedAt = timestamp_();
    const records = rawRows.map(function(row, index) {
      const key = fleetStableKey_(row);
      const sourceHash = fleetSourceRowHash_(row);
      keySequences[key] = (keySequences[key] || 0) + 1;
      sourceHashSequences[sourceHash] = (sourceHashSequences[sourceHash] || 0) + 1;
      const duplicateGroupSize = keyCounts[key] || 1;
      const exactDuplicateGroupSize = sourceHashCounts[sourceHash] || 1;
      const duplicateStatus = duplicateGroupSize < 2
        ? ''
        : exactDuplicateGroupSize > 1
          ? 'Exact duplicate source row - retained for review'
          : 'Duplicate device identifier - retained for review';
      const record = {};
      FLEET_SOURCE_HEADERS.forEach(function(header) { record[header] = row[header]; });
      record.fleet_record_key = key;
      record.source_row_hash = sourceHash;
      record.source_row_number = index + 2;
      record.duplicate_group_size = duplicateGroupSize;
      record.duplicate_sequence = keySequences[key];
      record.duplicate_status = duplicateStatus;
      record.validation_error = '';
      record.import_batch_id = importId;
      record.imported_at = importedAt;
      record.active = true;
      return record;
    });

    const duplicateRows = records.filter(function(row) { return Number(row.duplicate_sequence) > 1; }).length;
    replaceSheetObjects_(spreadsheetId, SHEETS.fleet, FLEET_RECORD_HEADERS, records);

    const warnings = duplicateRows ? duplicateRows + ' duplicate device row(s) retained and flagged.' : '';
    const log = {
      import_id: importId,
      started_at: startedAt,
      completed_at: timestamp_(),
      imported_by: importedBy,
      source_sheet: SHEETS.fleetImport,
      source_rows: rawRows.length,
      retained_rows: records.length,
      unique_devices: Object.keys(keyCounts).length,
      duplicate_rows: duplicateRows,
      validation_error_rows: 0,
      status: duplicateRows ? 'Completed with warnings' : 'Completed',
      warnings: warnings,
      error: ''
    };
    appendObject_(spreadsheetId, SHEETS.fleetImportLog, log);
    return log;
  } catch (error) {
    try {
      setupFleetSheet();
      appendObject_(spreadsheetId, SHEETS.fleetImportLog, {
        import_id: importId,
        started_at: startedAt,
        completed_at: timestamp_(),
        imported_by: importedBy,
        source_sheet: SHEETS.fleetImport,
        source_rows: sourceRows,
        retained_rows: '',
        unique_devices: '',
        duplicate_rows: '',
        validation_error_rows: '',
        status: 'Failed',
        warnings: '',
        error: error && error.message ? error.message : String(error)
      });
    } catch (logError) {
      Logger.log('Unable to write failed Fleet import log: ' + (logError.message || String(logError)));
    }
    throw error;
  } finally {
    lock.releaseLock();
  }
}

function validateFleetImportHeaders_(sheet) {
  const headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getDisplayValues()[0].map(function(value) {
    return String(value || '').trim();
  });
  const required = ['Device', 'Device Group', 'Serial No.', 'VIN'];
  return { headers: headers, missing: required.filter(function(header) { return headers.indexOf(header) === -1; }) };
}

function fleetStableKey_(row) {
  const vin = String(getFleetField_(row, ['vin']) || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (vin && vin !== '0') return 'VIN:' + vin;
  const serial = String(getFleetField_(row, ['serial_no', 'serial no', 'serial number']) || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (serial && serial !== '0') return 'SERIAL:' + serial;
  const device = String(getFleetField_(row, ['device']) || '').trim().toUpperCase().replace(/\s+/g, ' ');
  return device && device !== '0' ? 'DEVICE:' + device : '';
}

function fleetSourceRowHash_(row) {
  return sha256Hex_(FLEET_SOURCE_HEADERS.map(function(header) {
    return String(row[header] === null || row[header] === undefined ? '' : row[header]).trim();
  }).join('\u001f'));
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
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(normalizeFleetHeader_);
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
    last_communication_date: getFleetField_(row, ['last_communication_date', 'last communication date']),
    fleet_record_key: getFleetField_(row, ['fleet_record_key']),
    duplicate_status: getFleetField_(row, ['duplicate_status']),
    validation_error: getFleetField_(row, ['validation_error']),
    imported_at: getFleetField_(row, ['imported_at'])
  };
}

function mapFleetVehicle_(row) {
  const device = getFleetField_(row, ['device', 'unit_number', 'unit', 'vehicle', 'vehicle_id', 'truck_number']);
  const group = getFleetField_(row, ['device_group', 'device group', 'group', 'region']);
  const archived = getFleetField_(row, ['is_archived_historical', 'is archived historical', 'is_archived', 'archived']);
  const activity = getFleetField_(row, ['current_activity', 'current activity', 'status', 'vehicle_status']);
  return {
    vehicle_id: getFleetField_(row, ['vehicle_id', 'fleet_record_key', 'id']) || makeIdFromText_('vehicle', device),
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
    normalized[normalizeFleetHeader_(key)] = row[key];
  });
  for (let i = 0; i < names.length; i++) {
    const key = normalizeFleetHeader_(names[i]);
    if (Object.prototype.hasOwnProperty.call(normalized, key) && normalized[key] !== '') return normalized[key];
  }
  return '';
}

function normalizeFleetHeader_(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
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
  const value = String(row.active == null ? '' : row.active).trim().toUpperCase();
  return value === '' || value === 'TRUE' || value === 'YES' || value === 'Y' || value === '1';
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
    import_status: getLienImportHealth_(),
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


function normalizeLienReportName_(value) {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function readLienReportRows_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(normalizeHeader_);
  return values.slice(1)
    .map(function(row, index) {
      if (!row.some(function(cell) { return cell !== '' && cell !== null; })) return null;
      const record = headers.reduce(function(result, header, columnIndex) {
        if (header) result[header] = normalizeValue_(row[columnIndex]);
        return result;
      }, {});
      record.__source_row_number = index + 2;
      return record;
    })
    .filter(Boolean);
}

function scanLienReportSet_() {
  const folder = DriveApp.getFolderById(LIEN_STATUS_REPORTS_FOLDER_ID);
  const iterator = folder.getFilesByType(MimeType.GOOGLE_SHEETS);
  const expectedByName = {};
  const filesByName = {};
  const extras = [];

  LIEN_REPORT_MANIFEST.forEach(function(report) {
    expectedByName[normalizeLienReportName_(report.name)] = report;
  });

  while (iterator.hasNext()) {
    const file = iterator.next();
    const key = normalizeLienReportName_(file.getName());
    if (!expectedByName[key]) {
      extras.push(file.getName());
      continue;
    }
    if (!filesByName[key]) filesByName[key] = [];
    filesByName[key].push(file);
  }

  const errors = [];
  const warnings = [];
  const reports = [];
  const masterRows = [];
  const membershipRows = [];

  LIEN_REPORT_MANIFEST.forEach(function(report) {
    const key = normalizeLienReportName_(report.name);
    const matches = filesByName[key] || [];
    if (!matches.length) {
      errors.push('Missing report: ' + report.name);
      reports.push({ name: report.name, status: report.status, present: false, valid: false, row_count: 0, empty: true });
      return;
    }
    if (matches.length > 1) {
      errors.push('Duplicate report files: ' + report.name + ' (' + matches.length + ')');
      reports.push({ name: report.name, status: report.status, present: true, valid: false, row_count: 0, empty: false });
      return;
    }

    const file = matches[0];
    const spreadsheet = SpreadsheetApp.openById(file.getId());
    const sheet = spreadsheet.getSheetByName('Receivables Report') || spreadsheet.getSheets()[0];
    if (!sheet) {
      errors.push('No worksheet found in ' + report.name);
      reports.push({ name: report.name, status: report.status, present: true, valid: false, row_count: 0, empty: true, file_id: file.getId() });
      return;
    }

    const rows = readLienReportRows_(sheet);
    const seenIds = {};
    let invalidRows = 0;
    let duplicateIds = 0;

    rows.forEach(function(row) {
      const jobLink = getField_(row, ['job_link', 'job link', 'blaze_url', 'job_url', 'url']);
      const blazeJobId = extractBlazeJobId_(jobLink);
      const jobNumber = getField_(row, ['job_number', 'job number', 'job', 'account', 'account_name']);
      if (!blazeJobId) {
        invalidRows++;
        return;
      }
      if (seenIds[blazeJobId]) duplicateIds++;
      seenIds[blazeJobId] = true;
      row.__blaze_job_id = blazeJobId;
      row.__job_number = String(jobNumber || '').trim();
      row.__report_name = report.name;
      row.__report_status = report.status;
      row.__source_file_id = file.getId();
      row.__source_sheet = sheet.getName();
      membershipRows.push(row);
      if (report.master) masterRows.push(row);
    });

    if (invalidRows) errors.push(report.name + ' has ' + invalidRows + ' row(s) without a valid Blaze job UUID.');
    if (duplicateIds) errors.push(report.name + ' has ' + duplicateIds + ' duplicate Blaze UUID row(s).');
    reports.push({
      name: report.name,
      status: report.status,
      present: true,
      valid: invalidRows === 0 && duplicateIds === 0,
      row_count: rows.length,
      empty: rows.length === 0,
      file_id: file.getId(),
      sheet: sheet.getName(),
      invalid_rows: invalidRows,
      duplicate_uuid_rows: duplicateIds
    });
  });

  if (!masterRows.length) errors.push('Receivables Aging must contain at least one data row.');

  const masterIds = {};
  const masterDuplicateIds = {};
  masterRows.forEach(function(row) {
    if (masterIds[row.__blaze_job_id]) masterDuplicateIds[row.__blaze_job_id] = true;
    masterIds[row.__blaze_job_id] = true;
  });
  const masterDuplicateCount = Object.keys(masterDuplicateIds).length;
  if (masterDuplicateCount) errors.push('Receivables Aging contains ' + masterDuplicateCount + ' duplicate Blaze UUID(s).');

  let orphanMemberships = 0;
  membershipRows.forEach(function(row) {
    if (row.__report_name !== LIEN_MASTER_REPORT_NAME && !masterIds[row.__blaze_job_id]) orphanMemberships++;
  });
  if (orphanMemberships) errors.push(orphanMemberships + ' specialized-report row(s) are not present in Receivables Aging.');

  const statusesByJob = {};
  const jobIdsByNumber = {};
  membershipRows.forEach(function(row) {
    if (!statusesByJob[row.__blaze_job_id]) statusesByJob[row.__blaze_job_id] = {};
    statusesByJob[row.__blaze_job_id][row.__report_status] = true;
    if (row.__job_number) {
      const jobKey = row.__job_number.toLowerCase();
      if (!jobIdsByNumber[jobKey]) jobIdsByNumber[jobKey] = {};
      jobIdsByNumber[jobKey][row.__blaze_job_id] = true;
    }
  });

  const multiStatusJobs = Object.keys(statusesByJob).filter(function(id) {
    return Object.keys(statusesByJob[id]).length > 1;
  }).length;
  const jobNumberCollisions = Object.keys(jobIdsByNumber).filter(function(jobNumber) {
    return Object.keys(jobIdsByNumber[jobNumber]).length > 1;
  }).length;
  const emptyReports = reports.filter(function(report) { return report.present && report.empty; });

  if (emptyReports.length) warnings.push(emptyReports.length + ' report(s) are valid but contain zero rows.');
  if (multiStatusJobs) warnings.push(multiStatusJobs + ' job(s) appear in more than one saved view; every membership will be retained.');
  if (jobNumberCollisions) warnings.push(jobNumberCollisions + ' job number(s) map to multiple Blaze UUIDs; UUID matching will be used.');
  if (extras.length) warnings.push('Ignored non-manifest spreadsheet(s): ' + extras.join(', '));

  return {
    ready: errors.length === 0,
    reports: reports,
    reports_found: reports.filter(function(report) { return report.present; }).length,
    reports_required: LIEN_REPORT_MANIFEST.length,
    source_rows: membershipRows.length,
    master_rows: masterRows.length,
    unique_jobs: Object.keys(masterIds).length,
    multi_status_jobs: multiStatusJobs,
    job_number_collisions: jobNumberCollisions,
    empty_reports: emptyReports.map(function(report) { return report.name; }),
    warnings: warnings,
    errors: errors,
    masterRows: masterRows,
    membershipRows: membershipRows
  };
}

function setupLienImporter_() {
  const recordSheet = getRequiredSheet_(SPREADSHEETS.liens, SHEETS.lienRecords);
  ensureLienRecordColumns_(recordSheet);
  ensureSheetWithHeaders_(SPREADSHEETS.liens, SHEETS.lienImportLog, LIEN_IMPORT_LOG_HEADERS);
  ensureSheetWithHeaders_(SPREADSHEETS.liens, SHEETS.lienAutomationLog, LIEN_AUTOMATION_LOG_HEADERS);
  ensureSheetWithHeaders_(SPREADSHEETS.liens, SHEETS.lienReportMemberships, LIEN_REPORT_MEMBERSHIP_HEADERS);
}

function latestLienImportLog_() {
  if (!sheetExists_(SPREADSHEETS.liens, SHEETS.lienImportLog)) return null;
  const rows = readSheetObjects_(SPREADSHEETS.liens, SHEETS.lienImportLog);
  return rows.length ? rows[rows.length - 1] : null;
}

function setupLienAutomation() {
  const properties = PropertiesService.getScriptProperties();
  let token = properties.getProperty('LIEN_AUTOMATION_TOKEN');
  if (!token) {
    token = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
    properties.setProperty('LIEN_AUTOMATION_TOKEN', token);
  }
  const configuredEmail = String(properties.getProperty('LIEN_AUTOMATION_ALERT_EMAIL') || '').trim();
  const alertEmail = configuredEmail || String(Session.getEffectiveUser().getEmail() || '').trim();
  if (alertEmail) properties.setProperty('LIEN_AUTOMATION_ALERT_EMAIL', alertEmail);
  ensureSheetWithHeaders_(SPREADSHEETS.liens, SHEETS.lienAutomationLog, LIEN_AUTOMATION_LOG_HEADERS);
  return {
    token: token,
    alert_email: alertEmail,
    schedule: LIEN_AUTOMATION_SCHEDULE,
    weekdays: LIEN_AUTOMATION_WEEKDAYS,
    timezone: LIEN_AUTOMATION_TIMEZONE,
    enabled: String(properties.getProperty('LIEN_AUTOMATION_ENABLED') || '').toLowerCase() === 'true'
  };
}

function verifyLienAutomationToken_(provided) {
  const expected = String(PropertiesService.getScriptProperties().getProperty('LIEN_AUTOMATION_TOKEN') || '').trim();
  if (!expected || String(provided || '').trim() !== expected) throw new Error('Unauthorized automation request.');
}

function recordLienAutomationRun_(payload) {
  ensureSheetWithHeaders_(SPREADSHEETS.liens, SHEETS.lienAutomationLog, LIEN_AUTOMATION_LOG_HEADERS);
  const record = {
    run_id: String(payload.run_id || '').trim() || ('AUTO-' + Date.now().toString(36).toUpperCase()),
    started_at: String(payload.started_at || '').trim(),
    completed_at: String(payload.completed_at || new Date().toISOString()).trim(),
    status: String(payload.status || 'Unknown').trim(),
    reports_expected: Number(payload.reports_expected || 12),
    reports_exported: Number(payload.reports_exported || 0),
    liens_import_id: String(payload.liens_import_id || '').trim(),
    payment_import_id: String(payload.payment_import_id || '').trim(),
    message: String(payload.message || '').trim().slice(0, 2000),
    source: String(payload.source || 'GitHub Actions').trim().slice(0, 160)
  };
  appendObject_(SPREADSHEETS.liens, SHEETS.lienAutomationLog, record);
  if (/^Completed/i.test(record.status)) {
    PropertiesService.getScriptProperties().setProperty('LIEN_AUTOMATION_ENABLED', 'true');
  } else if (/^Failed/i.test(record.status)) {
    notifyLienAutomationFailure_('Blaze scheduled pull', record.message || 'The unattended export did not complete.');
  }
  return record;
}

function getLienImportHealth_() {
  const automationEnabled = String(PropertiesService.getScriptProperties().getProperty('LIEN_AUTOMATION_ENABLED') || '').toLowerCase() === 'true';
  const rows = sheetExists_(SPREADSHEETS.liens, SHEETS.lienImportLog)
    ? readSheetObjects_(SPREADSHEETS.liens, SHEETS.lienImportLog)
    : [];
  const latest = rows.length ? rows[rows.length - 1] : null;
  const successful = rows.slice().reverse().find(function(row) {
    return /^Completed/i.test(String(row.status || ''));
  }) || null;
  const failed = rows.slice().reverse().find(function(row) {
    return /^Failed/i.test(String(row.status || ''));
  }) || null;
  const automationRows = sheetExists_(SPREADSHEETS.liens, SHEETS.lienAutomationLog)
    ? readSheetObjects_(SPREADSHEETS.liens, SHEETS.lienAutomationLog)
    : [];
  const latestAutomation = automationRows.length ? automationRows[automationRows.length - 1] : null;
  const successAt = successful && (successful.completed_at || successful.started_at)
    ? new Date(successful.completed_at || successful.started_at)
    : null;
  const failureAt = failed && (failed.completed_at || failed.started_at)
    ? new Date(failed.completed_at || failed.started_at)
    : null;
  const now = new Date();
  const day = Utilities.formatDate(now, LIEN_AUTOMATION_TIMEZONE, 'EEE');
  const hour = Number(Utilities.formatDate(now, LIEN_AUTOMATION_TIMEZONE, 'H'));
  const extendedWindow = day === 'Sat' || day === 'Sun' || (day === 'Mon' && hour < 9);
  const allowedAgeHours = extendedWindow ? 72 : 18;
  const ageHours = successAt && !isNaN(successAt.getTime())
    ? Math.max(0, Math.round(((now.getTime() - successAt.getTime()) / 3600000) * 10) / 10)
    : null;
  const stale = ageHours === null || ageHours > allowedAgeHours;
  const importFailedAfterSuccess = !!(
    failureAt && !isNaN(failureAt.getTime()) &&
    (!successAt || isNaN(successAt.getTime()) || failureAt.getTime() > successAt.getTime())
  );
  const automationAt = latestAutomation && (latestAutomation.completed_at || latestAutomation.started_at)
    ? new Date(latestAutomation.completed_at || latestAutomation.started_at)
    : null;
  const automationFailed = !!(
    latestAutomation &&
    /^Failed/i.test(String(latestAutomation.status || '')) &&
    automationAt && !isNaN(automationAt.getTime()) &&
    (!successAt || isNaN(successAt.getTime()) || automationAt.getTime() > successAt.getTime())
  );
  const failedAfterSuccess = importFailedAfterSuccess || automationFailed;
  return {
    latest_import: latest,
    latest_success: successful,
    latest_failure: failed,
    latest_automation: latestAutomation,
    age_hours: ageHours,
    stale: stale,
    failed_after_success: failedAfterSuccess,
    healthy: !!successful && !stale && !failedAfterSuccess,
    automation_enabled: automationEnabled,
    schedule: LIEN_AUTOMATION_SCHEDULE,
    weekdays: LIEN_AUTOMATION_WEEKDAYS,
    timezone: LIEN_AUTOMATION_TIMEZONE
  };
}

function notifyLienAutomationFailure_(area, message) {
  try {
    const configured = PropertiesService.getScriptProperties().getProperty('LIEN_AUTOMATION_ALERT_EMAIL');
    const recipient = String(configured || Session.getEffectiveUser().getEmail() || '').trim();
    if (!recipient) {
      Logger.log('Automation failure notification skipped because no alert email is configured.');
      return;
    }
    MailApp.sendEmail({
      to: recipient,
      subject: 'Citadel automation failed: ' + area,
      body: [
        'Citadel could not complete the ' + area + ' automation.',
        '',
        'Failure: ' + String(message || 'Unknown error'),
        'Time: ' + Utilities.formatDate(new Date(), LIEN_AUTOMATION_TIMEZONE, 'yyyy-MM-dd h:mm a z'),
        '',
        'The last successful protected data remains available. Review the import log before retrying.'
      ].join('\n')
    });
  } catch (notificationError) {
    Logger.log('Unable to send automation failure notification: ' + (notificationError.message || String(notificationError)));
  }
}

function getLienImportStatus() {
  const scan = scanLienReportSet_();
  return {
    ready: scan.ready,
    reports: scan.reports,
    reports_found: scan.reports_found,
    reports_required: scan.reports_required,
    source_rows: scan.source_rows,
    master_rows: scan.master_rows,
    unique_jobs: scan.unique_jobs,
    multi_status_jobs: scan.multi_status_jobs,
    job_number_collisions: scan.job_number_collisions,
    empty_reports: scan.empty_reports,
    warnings: scan.warnings,
    errors: scan.errors,
    latest_import: latestLienImportLog_()
  };
}

function primaryLienStatus_(statuses) {
  const present = {};
  (statuses || []).forEach(function(status) { present[String(status || '')] = true; });
  const match = LIEN_REPORT_MANIFEST
    .filter(function(report) { return !report.master && present[report.status]; })
    .sort(function(left, right) { return left.priority - right.priority; })[0];
  return match ? match.status : 'Receivable';
}





function syncLienSourceRecords_(records, importedAt) {
  const sheet = getRequiredSheet_(SPREADSHEETS.liens, SHEETS.lienRecords);
  ensureLienRecordColumns_(sheet);
  const existing = readSheetObjects_(SPREADSHEETS.liens, SHEETS.lienRecords);
  const activeLienIds = {};
  records.forEach(function(record) { activeLienIds[String(record.lien_id)] = true; });

  const preserved = existing
    .filter(function(record) { return !activeLienIds[String(record.lien_id)]; })
    .map(function(record) {
      const copy = Object.assign({}, record);
      copy.active = false;
      copy.source_removed_at = copy.source_removed_at || importedAt;
      copy.last_updated = today_();
      return copy;
    });

  const output = records.concat(preserved);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(normalizeHeader_);
  if (sheet.getLastRow() > 1) sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
  if (output.length) {
    sheet.getRange(2, 1, output.length, headers.length).setValues(output.map(function(record) {
      return headers.map(function(header) {
        return Object.prototype.hasOwnProperty.call(record, header) ? record[header] : '';
      });
    }));
  }
  return { active_records: records.length, inactive_records: preserved.length };
}

function runLienImport(payload) {
  payload = payload || {};
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) throw new Error('A Liens import is already running. Please wait and try again.');

  const importId = 'LIEN-' + Date.now().toString(36).toUpperCase();
  const startedAt = new Date().toISOString();
  let scan = null;
  let log = {
    import_id: importId,
    started_at: startedAt,
    completed_at: '',
    imported_by: String(payload.imported_by || 'Citadel user').trim(),
    source_folder_id: LIEN_STATUS_REPORTS_FOLDER_ID,
    report_count: 0,
    source_rows: 0,
    master_rows: 0,
    active_records: 0,
    inactive_records: 0,
    membership_rows: 0,
    multi_status_jobs: 0,
    job_number_collision_count: 0,
    empty_report_count: 0,
    status: 'Running',
    warnings: '',
    error: ''
  };

  try {
    setupLienImporter_();
    scan = scanLienReportSet_();
    log.report_count = scan.reports_found;
    log.source_rows = scan.source_rows;
    log.master_rows = scan.master_rows;
    log.multi_status_jobs = scan.multi_status_jobs;
    log.job_number_collision_count = scan.job_number_collisions;
    log.empty_report_count = scan.empty_reports.length;
    log.warnings = scan.warnings.join(' ');

    if (!scan.ready) throw new Error(scan.errors.join(' '));

    const existingRows = readSheetObjects_(SPREADSHEETS.liens, SHEETS.lienRecords);
    const existingByBlazeId = {};
    existingRows.forEach(function(record) {
      const blazeJobId = lienBlazeJobId_(record);
      if (blazeJobId && !existingByBlazeId[blazeJobId]) existingByBlazeId[blazeJobId] = record;
    });

    const statusesByJob = {};
    scan.membershipRows.forEach(function(row) {
      if (!statusesByJob[row.__blaze_job_id]) statusesByJob[row.__blaze_job_id] = {};
      statusesByJob[row.__blaze_job_id][row.__report_status] = true;
    });

    const recordsByBlazeId = {};
    const records = scan.masterRows.map(function(row) {
      const blazeJobId = row.__blaze_job_id;
      const statuses = Object.keys(statusesByJob[blazeJobId] || { Receivable: true });
      const status = primaryLienStatus_(statuses);
      const record = mapReceivableToLienRecord_(row, status, blazeJobId, statuses, existingByBlazeId[blazeJobId] || null, importId);
      recordsByBlazeId[blazeJobId] = record;
      return record;
    });

    const importedAt = new Date().toISOString();
    const memberships = scan.membershipRows.map(function(row) {
      const record = recordsByBlazeId[row.__blaze_job_id];
      return {
        import_id: importId,
        blaze_job_id: row.__blaze_job_id,
        lien_id: record ? record.lien_id : '',
        job_number: row.__job_number,
        report_name: row.__report_name,
        report_status: row.__report_status,
        source_file_id: row.__source_file_id,
        source_sheet: row.__source_sheet,
        source_row_number: row.__source_row_number,
        imported_at: importedAt,
        active: true
      };
    });

    const sync = syncLienSourceRecords_(records, importedAt);
    replaceSheetObjects_(SPREADSHEETS.liens, SHEETS.lienReportMemberships, LIEN_REPORT_MEMBERSHIP_HEADERS, memberships);

    log.completed_at = new Date().toISOString();
    log.active_records = sync.active_records;
    log.inactive_records = sync.inactive_records;
    log.membership_rows = memberships.length;
    log.status = scan.warnings.length ? 'Completed with warnings' : 'Completed';
    appendObject_(SPREADSHEETS.liens, SHEETS.lienImportLog, log);

    return {
      import_id: importId,
      status: log.status,
      imported_at: log.completed_at,
      report_count: scan.reports_found,
      source_rows: scan.source_rows,
      active_records: sync.active_records,
      inactive_records: sync.inactive_records,
      membership_rows: memberships.length,
      multi_status_jobs: scan.multi_status_jobs,
      job_number_collisions: scan.job_number_collisions,
      empty_reports: scan.empty_reports,
      warnings: scan.warnings,
      reports: scan.reports
    };
  } catch (error) {
    log.completed_at = new Date().toISOString();
    log.status = 'Failed';
    log.error = error && error.message ? error.message : String(error);
    try {
      setupLienImporter_();
      appendObject_(SPREADSHEETS.liens, SHEETS.lienImportLog, log);
    } catch (ignored) {}
    notifyLienAutomationFailure_('Liens import', log.error);
    throw error;
  } finally {
    lock.releaseLock();
  }
}

function importLienStatusReports() {
  return runLienImport({ imported_by: 'Apps Script' });
}



function ensureLienRecordColumns_(sheet) {
  const existing = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0].map(normalizeHeader_);
  const missing = REQUIRED_LIEN_RECORD_COLUMNS.filter(function(header) { return existing.indexOf(header) === -1; });
  if (!missing.length) return;
  sheet.getRange(1, existing.length + 1, 1, missing.length).setValues([missing]);
}



function mapReceivableToLienRecord_(row, status, blazeJobId, statuses, existing, importId) {
  const record = Object.assign({}, existing || {});
  const customer = getField_(row, ['customer', 'customer_name', 'name', 'account', 'account_name']);
  const account = getField_(row, ['job_number', 'job number', 'job', 'account_name', 'account', 'account_number']);
  const blazeUrl = getField_(row, ['job_link', 'job link', 'blaze_url', 'blaze_link', 'url', 'job_url', 'record_url']);
  const balance = getField_(row, ['balance', 'total_balance', 'amount', 'invoice_balance', 'ar_balance']);
  const contractedAmount = getField_(row, ['total_revenue', 'total revenue', 'contracted_amount', 'contracted amount', 'contract value', 'contracted value']);
  const invoiceDates = getInvoiceSentDates_(row);
  const firstInvoiceDate = invoiceDates.length ? invoiceDates[0] : getField_(row, ['first_invoice_date', 'first invoice date', 'first invoice', 'oldest_invoice_date']);
  const latestInvoiceDate = invoiceDates.length ? invoiceDates[invoiceDates.length - 1] : getField_(row, ['latest_invoice_date', 'latest invoice date', 'latest invoice', 'last_invoice_date']);
  const invoiceCount = invoiceDates.length || getField_(row, ['invoice_count', 'invoice count', 'invoices', 'number of invoices']);
  const agingValue = getField_(row, ['aging', 'days_past_due', 'days past due', 'aging_days', 'age', 'days']);
  const days = String(agingValue == null ? '' : agingValue).trim() === '' ? daysSince_(firstInvoiceDate) : Math.max(0, Math.floor(Number(agingValue) || 0));
  const sourceStage = getField_(row, ['current_stage', 'current stage', 'blaze_stage']);
  const paymentReceived = getField_(row, ['payments', 'payment_received', 'payments received', 'amount_paid', 'total_paid']);
  const allStatuses = (statuses || ['Receivable']).filter(Boolean);

  record.lien_id = record.lien_id || ('REC-' + blazeJobId);
  record.customer = customer;
  record.account_name = account || customer;
  record.job_number = account;
  record.blaze_job_id = blazeJobId;
  record.blaze_url = blazeUrl;
  record.region = getField_(row, ['region', 'market', 'branch', 'office']);
  record.owner = getField_(row, ['sales_rep', 'sales rep', 'owner', 'rep', 'assigned_to']) || record.owner || 'Carlynn';
  record.status = status;
  record.stage = getStageFromReceivable_(row, status, days);
  record.balance = balance;
  record.contracted_amount = contractedAmount;
  record.days_past_due = days;
  record.first_invoice_date = firstInvoiceDate;
  record.latest_invoice_date = latestInvoiceDate;
  record.invoice_count = invoiceCount;
  record.no_payment_received = getNoPaymentReceived_(row);
  record.payment_received = paymentReceived;
  record.source_current_stage = sourceStage;
  record.source_last_note = getField_(row, ['lastnote', 'last_note', 'last note']);
  record.profit_percentage = getField_(row, ['profit_percentage', 'profit percentage']);
  record.source_statuses = allStatuses.join(' | ');
  record.source_report_count = allStatuses.length;
  record.filing_date = record.filing_date || '';
  record.release_due_date = record.release_due_date || '';
  record.release_status = allStatuses.indexOf('Lien Released') >= 0 ? 'Lien Released' : status;
  record.legal_hold = allStatuses.some(function(value) { return /attorney|bankruptcy|foreclosure|legal|hold/i.test(String(value)); });
  record.source_system = 'Blaze / Receivables Reports';
  record.source_record_id = blazeJobId;
  record.import_batch_id = importId;
  record.source_row_number = row.__source_row_number || '';
  record.source_removed_at = '';
  record.last_updated = today_();
  record.active = true;
  return record;
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
    if (key !== 'action' && key !== 'callback' && key !== 'session_token' && key !== 'csrf_token') payload[key] = params[key];
  });
  return payload;
}

function getParam_(e, key) {
  return e && e.parameter ? e.parameter[key] : '';
}

function output_(e, payload) {
  const callback = getParam_(e, 'callback');
  if (payload && payload.ok && Object.prototype.hasOwnProperty.call(payload, 'data') && CITADEL_REQUEST_CONTEXT) {
    payload.data = scopeCitadelResponse_(CITADEL_REQUEST_CONTEXT.action, payload.data, CITADEL_REQUEST_CONTEXT);
  }
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
