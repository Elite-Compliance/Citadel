const API_URL = "https://script.google.com/macros/s/AKfycbzKIMMrIFdmS3xKUHzSzwR-Y-Z4FebDLBod1OWmORqDC-_J9pXH2azFVrONruv1djvIhw/exec";
const TODAY = formatDateStamp(new Date());

const state = {
  page: "requests",
  requestView: "submit",
  data: { requests: [], openRequests: [], activeRegistrations: [], archivedRequests: [], notes: [], alerts: [], followUps: [], metrics: {} },
  selectedId: "",
  workflowTab: "info",
  metricFilter: "",
  sort: { key: "date_submitted", direction: "desc" },
  filters: { status: "All statuses", region: "All regions", brand: "All brands", search: "" },
  loading: false
};
let workflowSearchTimer = 0;

const brands = ["Accuserve", "Aspen Exteriors, Inc", "Elite", "Grove Exteriors, LLC dba 123 Exteriors", "Reimagine Roofing & Construction, LLC", "Universal Roofing, LLC", "Wildwood Roofing & Construction, Inc"];
const regions = ["PHX", "STL", "MIL", "CLE", "CHI", "MIN", "ABQ", "PIT", "IND", "OT"];
const openStatuses = ["New", "Open", "Researched", "Pending", "Submitted", "Follow Up", "License Received"];
const activeStatuses = ["Active", "Renewal", "Renewal Submitted", "Renewal Received", "Archived"];

const els = {
  app: document.querySelector("#app"),
  status: document.querySelector("#statusPill"),
  refresh: document.querySelector("#refreshButton"),
  tabs: document.querySelectorAll("[data-page]")
};

function setStatus(text) {
  els.status.innerHTML = `<span></span> ${escapeHtml(text)}`;
}

function toast(message) {
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  document.body.appendChild(node);
  setTimeout(() => node.remove(), 3200);
}

function jsonp(params) {
  return new Promise((resolve, reject) => {
    const callback = "citadelReg_" + Date.now() + "_" + Math.random().toString(16).slice(2);
    const script = document.createElement("script");
    const query = new URLSearchParams({ ...params, callback });
    window[callback] = (payload) => {
      delete window[callback];
      script.remove();
      resolve(payload);
    };
    script.onerror = () => {
      delete window[callback];
      script.remove();
      reject(new Error("Registrations sheet request failed"));
    };
    script.src = API_URL + "?" + query.toString();
    document.body.appendChild(script);
  });
}

function normalizeRows(payload) {
  const data = payload && payload.data ? payload.data : {};
  state.data = {
    requests: Array.isArray(data.requests) ? data.requests.map(normalizeRequest) : [],
    openRequests: Array.isArray(data.openRequests) ? data.openRequests.map(normalizeRequest) : [],
    activeRegistrations: Array.isArray(data.activeRegistrations) ? data.activeRegistrations.map(normalizeActive) : [],
    archivedRequests: Array.isArray(data.archivedRequests) ? data.archivedRequests.map(normalizeRequest) : [],
    notes: data.notes || [],
    alerts: data.alerts || [],
    followUps: data.followUps || [],
    metrics: data.metrics || {}
  };
  if (!state.data.openRequests.length) {
    state.data.openRequests = state.data.requests.filter(row => !["active", "archived"].includes(String(row.status).toLowerCase()) && row.active !== false);
  }
  const activeFromRequests = state.data.requests
    .filter(row => String(row.status).toLowerCase() === "active")
    .map(normalizeActive);
  const activeIds = new Set(state.data.activeRegistrations.map(row => row.request_id || `${row.brand}|${row.state}|${row.jurisdiction}|${row.number}`));
  activeFromRequests.forEach(row => {
    const key = row.request_id || `${row.brand}|${row.state}|${row.jurisdiction}|${row.number}`;
    if (!activeIds.has(key)) state.data.activeRegistrations.push(row);
  });
  if (!state.data.archivedRequests.length) {
    state.data.archivedRequests = state.data.requests.filter(row => String(row.status).toLowerCase() === "archived");
  }
}

function normalizeRequest(row) {
  row = row || {};
  return {
    request_id: pick(row, ["request_id", "id", "source_record_id"]) || "",
    reopened_from_request_id: pick(row, ["reopened_from_request_id"]) || "",
    research_verified_at: dateTimeValue(pick(row, ["research_verified_at"])),
    research_verified_by: pick(row, ["research_verified_by"]) || "",
    submitted_at: dateTimeValue(pick(row, ["submitted_at", "created_at"])),
    requestor_name: pick(row, ["requestor_name", "requestor", "submitted_by", "name"]) || "",
    brand: pick(row, ["brand"]) || "",
    date_submitted: dateTimeValue(pick(row, ["date_submitted", "date", "submitted_at", "created_at"])),
    region: pick(row, ["region"]) || "",
    pure: yesNo(pick(row, ["pure"])),
    jurisdiction: pick(row, ["jurisdiction"]) || "",
    requirements: pick(row, ["requirements"]) || "",
    website: pick(row, ["website"]) || "",
    phone: pick(row, ["phone"]) || "",
    email: pick(row, ["email"]) || "",
    notes: pick(row, ["notes", "research_notes"]) || "",
    status: pick(row, ["status"]) || "New",
    stage: pick(row, ["stage"]) || pick(row, ["status"]) || "New",
    assigned_to: pick(row, ["assigned_to"]) || "Emma",
    status_updated_at: dateTimeValue(pick(row, ["status_updated_at", "last_updated", "submitted_at", "created_at"])),
    received_date: dateTimeValue(pick(row, ["received_date"])),
    researched_date: dateTimeValue(pick(row, ["researched_date"])),
    submitted_license_date: dateTimeValue(pick(row, ["submitted_license_date"])),
    license_received_date: dateTimeValue(pick(row, ["license_received_date"])),
    archived_date: dateTimeValue(pick(row, ["archived_date"])),
    expiration: dateOnly(pick(row, ["expiration"])),
    license_category: pick(row, ["license_category"]) || "",
    license_action: pick(row, ["license_action"]) || "",
    bond_type: pick(row, ["bond_type"]) || "",
    coi_type: pick(row, ["coi_type"]) || "",
    payment_status: pick(row, ["payment_status"]) || "",
    payment_method: pick(row, ["payment_method"]) || "",
    documents_included: pick(row, ["documents_included"]) || "",
    submission_method: pick(row, ["submission_method"]) || "",
    research_notes: pick(row, ["research_notes"]) || "",
    license_number: pick(row, ["license_number", "number"]) || "",
    received_license_name: pick(row, ["received_license_name", "license_type_name", "license_name"]) || "",
    received_license_state: pick(row, ["received_license_state", "state"]) || "",
    received_license_type: pick(row, ["received_license_type", "type"]) || "",
    qualifier: pick(row, ["qualifier"]) || "",
    continuing_education_hours: pick(row, ["continuing_education_hours"]) || "",
    elite_owned: yesNo(pick(row, ["elite_owned"])),
    ce_due_date: dateOnly(pick(row, ["ce_due_date"])),
    ce_reminder_days: pick(row, ["ce_reminder_days"]) || "",
    ce_reminder_date: dateOnly(pick(row, ["ce_reminder_date"])),
    renewal_due_date: dateOnly(pick(row, ["renewal_due_date"])),
    renewal_status: pick(row, ["renewal_status"]) || "",
    renewal_owner: pick(row, ["renewal_owner"]) || "",
    renewal_notes: pick(row, ["renewal_notes"]) || "",
    renewal_started_date: dateTimeValue(pick(row, ["renewal_started_date"])),
    renewal_submitted_date: dateTimeValue(pick(row, ["renewal_submitted_date"])),
    renewal_received_date: dateTimeValue(pick(row, ["renewal_received_date"])),
    archive_reason: pick(row, ["archive_reason"]) || "",
    active: pick(row, ["active"]) !== false && String(pick(row, ["active"])).toLowerCase() !== "false"
  };
}

function normalizeActive(row) {
  row = row || {};
  return {
    request_id: pick(row, ["request_id", "id", "source_record_id"]) || "",
    date_submitted: dateTimeValue(pick(row, ["date_submitted", "date", "submitted_at", "created_at"])),
    brand: pick(row, ["brand", "Brand"]) || "",
    state: pick(row, ["state", "State", "received_license_state"]) || "",
    region: pick(row, ["region"]) || "",
    jurisdiction: pick(row, ["jurisdiction", "Jurisdiction"]) || "",
    license_name: pick(row, ["license_name", "license_type_name", "License Type Name", "received_license_name"]) || "",
    number: pick(row, ["number", "Number", "license_number"]) || "",
    expiration: dateOnly(pick(row, ["expiration", "Expiration"])),
    qualifier: pick(row, ["qualifier", "Qualifier"]) || "",
    type: pick(row, ["type", "received_license_type"]) || "",
    pure: yesNo(pick(row, ["pure"])),
    status: pick(row, ["status"]) || "Active",
    stage: pick(row, ["stage"]) || pick(row, ["status"]) || "Active",
    requestor_name: pick(row, ["requestor_name", "requestor", "submitted_by", "name"]) || "",
    website: pick(row, ["website"]) || "",
    phone: pick(row, ["phone"]) || "",
    email: pick(row, ["email"]) || "",
    requirements: pick(row, ["requirements"]) || "",
    notes: pick(row, ["notes", "research_notes"]) || "",
    received_date: dateTimeValue(pick(row, ["received_date"])),
    researched_date: dateTimeValue(pick(row, ["researched_date"])),
    submitted_license_date: dateTimeValue(pick(row, ["submitted_license_date"])),
    license_received_date: dateTimeValue(pick(row, ["license_received_date"])),
    completed_date: dateTimeValue(pick(row, ["completed_date"])),
    archived_date: dateTimeValue(pick(row, ["archived_date"])),
    status_updated_at: dateTimeValue(pick(row, ["status_updated_at", "last_updated"])),
    received_license_name: pick(row, ["received_license_name", "license_type_name", "license_name", "License Type Name"]) || "",
    received_license_state: pick(row, ["received_license_state", "state", "State"]) || "",
    received_license_type: pick(row, ["received_license_type", "type"]) || "",
    license_number: pick(row, ["license_number", "number", "Number"]) || "",
    continuing_education_hours: pick(row, ["continuing_education_hours", "Continuing Education Hours"]) || "",
    elite_owned: yesNo(pick(row, ["elite_owned", "Elite Owned"])),
    ce_due_date: dateOnly(pick(row, ["ce_due_date"])),
    ce_reminder_days: pick(row, ["ce_reminder_days"]) || "",
    ce_reminder_date: dateOnly(pick(row, ["ce_reminder_date"])),
    renewal_due_date: dateOnly(pick(row, ["renewal_due_date"])),
    renewal_status: pick(row, ["renewal_status"]) || "",
    renewal_owner: pick(row, ["renewal_owner"]) || "",
    renewal_notes: pick(row, ["renewal_notes"]) || "",
    renewal_started_date: dateTimeValue(pick(row, ["renewal_started_date"])),
    renewal_submitted_date: dateTimeValue(pick(row, ["renewal_submitted_date"])),
    renewal_received_date: dateTimeValue(pick(row, ["renewal_received_date"])),
    archive_reason: pick(row, ["archive_reason"]) || "",
    license_category: pick(row, ["license_category"]) || "",
    license_action: pick(row, ["license_action"]) || "",
    bond_type: pick(row, ["bond_type"]) || "",
    coi_type: pick(row, ["coi_type"]) || "",
    payment_status: pick(row, ["payment_status"]) || "",
    payment_method: pick(row, ["payment_method"]) || "",
    documents_included: pick(row, ["documents_included"]) || "",
    submission_method: pick(row, ["submission_method"]) || "",
    research_notes: pick(row, ["research_notes"]) || ""
  };
}

function pick(row, keys) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== "") return row[key];
  }
  const lower = {};
  Object.keys(row).forEach(key => lower[key.toLowerCase()] = row[key]);
  for (const key of keys) {
    const hit = lower[String(key).toLowerCase()];
    if (hit !== undefined && hit !== null && String(hit).trim() !== "") return hit;
  }
  return "";
}

function padTimePart(value) {
  return String(value).padStart(2, "0");
}

function formatDateStamp(date) {
  return `${date.getFullYear()}-${padTimePart(date.getMonth() + 1)}-${padTimePart(date.getDate())}`;
}

function currentTimestamp() {
  return new Date().toISOString();
}

function parseDateValue(value) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === "number") {
    const base = new Date(Date.UTC(1899, 11, 30));
    return new Date(base.getTime() + value * 86400000);
  }
  const text = String(value).trim();
  if (!text) return null;
  const normalized = text.includes("T") ? text : text.replace(" ", "T");
  const parsed = new Date(normalized);
  if (!Number.isNaN(parsed.getTime())) return parsed;
  const iso = text.match(/\d{4}-\d{2}-\d{2}/);
  if (!iso) return null;
  const fallback = new Date(`${iso[0]}T00:00:00`);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

function dateOnly(value) {
  if (!value) return "";
  const text = String(value).trim();
  const date = parseDateValue(value);
  return date ? formatDateStamp(date) : text;
}

function dateTimeValue(value, compact = false) {
  if (!value) return "";
  const text = String(value).trim();
  const date = parseDateValue(value);
  if (!date) return text;
  const hours = date.getHours();
  const hour12 = hours % 12 || 12;
  const minutes = padTimePart(date.getMinutes());
  const suffix = hours >= 12 ? "PM" : "AM";
  const dateStamp = compact
    ? `${date.getMonth() + 1}/${date.getDate()}/${String(date.getFullYear()).slice(-2)}`
    : formatDateStamp(date);
  return `${dateStamp} ${hour12}:${minutes} ${suffix}`;
}

function yesNo(value) {
  const text = String(value || "").trim().toLowerCase();
  if (["yes", "true", "y", "1"].includes(text)) return "Yes";
  if (["no", "false", "n", "0"].includes(text)) return "No";
  return value || "";
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function setPage(page, selectedId = "") {
  state.page = page;
  state.selectedId = selectedId;
  state.metricFilter = "";
  els.tabs.forEach(tab => tab.classList.toggle("active", tab.dataset.page === page));
  render();
}

function render() {
  if (state.page === "requests") renderRequestHub();
  if (state.page === "open") renderWorkflowPage("open");
  if (state.page === "active") renderWorkflowPage("active");
  if (state.page === "archived") renderWorkflowPage("archived");
}

function renderRequestHub() {
  const panel = state.requestView === "submit" ? requestForm() : state.requestView === "open" ? requestPreviewTable() : activePreviewTable();
  els.app.innerHTML = `
    <section class="workspace">
      <div class="choice-wrap">
        <h2>Registration Requests</h2>
        <div class="choice-grid">
          ${choiceCard("submit", "Submit A Request", "Submit a request to compliance for registration/license")}
          ${choiceCard("open", "Open Requests", "Status of submitted requests")}
          ${choiceCard("active", "Active Registrations/Licenses", "All active registrations & licenses")}
        </div>
      </div>
      ${panel}
    </section>`;
  bindRequestHub();
}

function choiceCard(key, title, subtitle) {
  return `<button type="button" class="choice-card ${state.requestView === key ? "active" : ""}" data-request-view="${key}">
    <strong>${escapeHtml(title)}</strong><span>${escapeHtml(subtitle)}</span>
  </button>`;
}

function requestForm() {
  return `<section class="request-panel">
    <div class="panel-title">Contractor Registration / License Request</div>
    <form class="request-form" id="requestForm">
      <p class="form-note">Fields marked * are required.</p>
      <div class="form-grid">
        ${field("requestor_name", "Requestor Name *", "text", "", "small")}
        ${selectField("brand", "Brand *", brands, "-- Select --", "medium")}
        ${selectField("region", "Region *", regions, "-- Select region --", "small")}
        ${field("jurisdiction", "Jurisdiction *", "text", "City, county, or municipality", "large")}
      </div>
      <div class="form-grid">
        ${textareaField("requirements", "Requirements *", "Describe permit requirements for this jurisdiction...", "large")}
        <div class="field small"><label>PURE *</label><div class="radio-line">
          <label><input type="radio" name="pure" value="Yes"> Yes</label>
          <label><input type="radio" name="pure" value="No"> No</label>
        </div></div>
      </div>
      <div class="info-strip">Please provide the following data for the jurisdiction requested</div>
      <div class="form-grid">
        ${field("website", "Website", "url", "https://...", "small")}
        ${field("phone", "Phone", "tel", "(000) 000-0000", "medium")}
        ${field("email", "Email", "email", "contact@example.com", "medium")}
      </div>
      ${textareaField("notes", "Notes", "Any additional context...", "large")}
      <div class="form-actions"><button type="reset" class="secondary">Clear</button><button type="submit" class="primary">Submit Request</button></div>
    </form>
  </section>`;
}

function field(name, label, type, placeholder, size) {
  return `<div class="field ${size}"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" placeholder="${escapeHtml(placeholder)}"></div>`;
}

function selectField(name, label, options, placeholder, size) {
  return `<div class="field ${size}"><label for="${name}">${label}</label><select id="${name}" name="${name}">
    <option value="">${escapeHtml(placeholder)}</option>${options.map(option => `<option>${escapeHtml(option)}</option>`).join("")}
  </select></div>`;
}

function textareaField(name, label, placeholder, size) {
  return `<div class="field ${size}"><label for="${name}">${label}</label><textarea id="${name}" name="${name}" placeholder="${escapeHtml(placeholder)}"></textarea></div>`;
}

function bindRequestHub() {
  document.querySelectorAll("[data-request-view]").forEach(button => {
    button.addEventListener("click", () => {
      state.requestView = button.dataset.requestView;
      renderRequestHub();
    });
  });
  const form = document.querySelector("#requestForm");
  if (form) {
    form.phone.addEventListener("input", () => form.phone.value = formatPhone(form.phone.value));
    form.website.addEventListener("blur", () => form.website.value = formatWebsite(form.website.value));
    form.email.addEventListener("blur", () => form.email.value = form.email.value.trim().toLowerCase());
    form.addEventListener("submit", saveRequest);
  }
}

function formatPhone(value) {
  const digits = String(value).replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatWebsite(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  return /^https?:\/\//i.test(text) ? text : "https://" + text;
}

function formPayload(form) {
  const data = new FormData(form);
  const stamp = currentTimestamp();
  return {
    requestor_name: data.get("requestor_name").trim(),
    brand: data.get("brand"),
    submitted_at: stamp,
    date_submitted: stamp,
    region: data.get("region"),
    pure: data.get("pure") || "",
    jurisdiction: data.get("jurisdiction").trim(),
    requirements: data.get("requirements").trim(),
    website: formatWebsite(data.get("website")),
    phone: formatPhone(data.get("phone")),
    email: String(data.get("email") || "").trim().toLowerCase(),
    notes: data.get("notes").trim(),
    status: "New",
    stage: "New",
    status_updated_at: stamp,
    assigned_to: "Emma",
    active: true
  };
}

async function saveRequest(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const payload = formPayload(form);
  if (!payload.requestor_name || !payload.brand || !payload.region || !payload.jurisdiction || !payload.requirements || !payload.pure) {
    toast("Please complete all required fields.");
    return;
  }
  setStatus("Saving...");
  try {
    const response = await jsonp({ action: "saveRegistrationRequest", ...payload });
    if (!response || !response.ok) throw new Error(response && response.error ? response.error : "Save failed");
    form.reset();
    toast("Submission Has Been Sent To Compliance Team");
    await loadData(false);
    state.requestView = "open";
    renderRequestHub();
  } catch (error) {
    setStatus("Save failed");
    toast(error.message || "Save failed");
  }
}

function requestPreviewTable() {
  return simpleTable("Open Requests", "Status of submitted requests will appear here.", requestColumns(), state.data.openRequests);
}

function activePreviewTable() {
  return simpleTable("Active Registrations/Licenses", "All active registrations and licenses.", activeColumns(), state.data.activeRegistrations);
}

function renderWorkflowPage(kind) {
  const rows = filteredRows(kind);
  const selected = rows.find(row => row.request_id === state.selectedId) || rows[0] || null;
  if (selected) state.selectedId = selected.request_id;
  const title = kind === "open" ? "Open Registrations" : kind === "active" ? "Active Registrations" : "Archived Registrations";
  const columns = kind === "active" ? activeColumns() : requestColumns();
  els.app.innerHTML = `<section class="workspace">
    ${metricRow(kind)}
    <div class="split-layout">
      <div class="main-col">
        ${filters()}
        ${tableBlock(title, "", columns, rows, true)}
      </div>
      <aside class="side-panel">${selected ? selectedPanel(selected, kind) : emptyPanel()}</aside>
    </div>
  </section>`;
  bindWorkflow(kind);
}

function metricRow(kind) {
  const open = state.data.openRequests;
  const alerts = (state.data.alerts || []).length + (state.data.followUps || []).length;
  const metrics = kind === "active"
    ? [
        { key: "alerts", label: "Open Alerts", value: alerts, note: "Follow-up needed" },
        { key: "expired", label: "Expired", value: expiredCount(), note: "Past due" },
        { key: "due7", label: "7 Days", value: expirationWindowCount(0, 7), note: "Due soon" },
        { key: "due30", label: "30 Days", value: expirationWindowCount(8, 30), note: "Renewal window" },
        { key: "renewals", label: "Renewals", value: renewalCount(), note: "In progress" },
        { key: "all", label: "Active", value: state.data.activeRegistrations.length, note: "Registrations/licenses" }
      ]
    : kind === "archived"
      ? [
          { key: "alerts", label: "Open Alerts", value: alerts, note: "Follow-up needed" },
          { key: "all", label: "Archived", value: state.data.archivedRequests.length, note: "Completed records" }
        ]
      : [
          { key: "alerts", label: "Open Alerts", value: alerts, note: "Follow-up needed" },
          { key: "new", label: "New", value: open.filter(row => row.status === "New").length, note: "Needs intake" },
          { key: "open", label: "Open", value: open.filter(row => row.status === "Open").length, note: "In compliance" },
          { key: "pending", label: "Pending", value: open.filter(row => row.status === "Pending").length, note: "With jurisdiction" },
          { key: "researched", label: "Researched", value: open.filter(row => isResearched(row)).length, note: "Ready to submit" }
        ];
  return `<div class="metric-row">${metrics.map(item => `<button type="button" class="metric-button ${state.metricFilter === item.key ? "active" : ""}" data-metric="${item.key}" aria-pressed="${state.metricFilter === item.key}"><small>${escapeHtml(item.label)}</small><b>${escapeHtml(item.value)}</b><span>${escapeHtml(item.note)}</span></button>`).join("")}</div>`;
}

function filters() {
  const statusOptions = state.page === "active" ? ["All statuses", ...activeStatuses] : ["All statuses", ...openStatuses, "Archived"];
  return `<section class="filters"><div class="filter-head"><div><h3>Filters + Sort + Search</h3><p>Track registration and license records from intake through completion.</p></div><button type="button" class="primary" data-report>Reports</button></div>
    <div class="filter-grid">
      ${filterSelect("status", "Status", statusOptions)}
      ${filterSelect("region", "Region", ["All regions", ...regions])}
      ${filterSelect("brand", "Brand", ["All brands", ...brands])}
      ${filterSelect("sort", "Sort", ["Newest first", "Oldest first", "Status A-Z", "Jurisdiction A-Z"])}
      <div class="filter"><label>Search</label><input data-filter="search" placeholder="Search" value="${escapeHtml(state.filters.search)}"></div>
    </div></section>`;
}

function filterSelect(key, label, options) {
  const current = key === "sort" ? sortLabel() : state.filters[key];
  return `<div class="filter"><label>${label}</label><select data-filter="${key}">
    ${options.map(option => `<option ${option === current ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
  </select></div>`;
}

function sortLabel() {
  if (state.sort.key === "date_submitted" && state.sort.direction === "desc") return "Newest first";
  if (state.sort.key === "date_submitted") return "Oldest first";
  if (state.sort.key === "status") return "Status A-Z";
  if (state.sort.key === "jurisdiction") return "Jurisdiction A-Z";
  return "Newest first";
}

function simpleTable(title, subtitle, columns, rows) {
  return `<section class="request-panel">${tableBlock(title, subtitle, columns, rows, false)}</section>`;
}

function tableBlock(title, subtitle, columns, rows, selectable) {
  const tableClass = columns.length === 6 && columns.some(column => column.key === "expiration") ? "active-records-table" : "";
  return `<div class="table-wrap"><div class="table-head"><div><h3>${escapeHtml(title)}</h3>${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ""}</div><span>${rows.length} showing</span></div>
    <table class="${tableClass}"><thead><tr>${columns.map(col => `<th data-sort="${col.key}">${escapeHtml(col.label)}${state.sort.key === col.key ? ` <span class="sort-mark">${state.sort.direction === "asc" ? "↑" : "↓"}</span>` : ""}</th>`).join("")}</tr></thead>
    <tbody>${rows.length ? rows.map(row => `<tr ${selectable ? `data-row-id="${escapeHtml(row.request_id)}"` : ""} class="${row.request_id && row.request_id === state.selectedId ? "selected" : ""}">${columns.map(col => `<td><div class="truncate">${escapeHtml(col.value(row))}</div></td>`).join("")}</tr>`).join("") : `<tr><td colspan="${columns.length}">No registration records match this view.</td></tr>`}</tbody></table></div>`;
}

function requestColumns() {
  return [
    { key: "status", label: "Status", value: row => row.status },
    { key: "status_updated_at", label: "Last Updated", value: row => row.status_updated_at || row.date_submitted },
    { key: "date_submitted", label: "Requested Date", value: row => row.date_submitted },
    { key: "requestor_name", label: "Requestor", value: row => row.requestor_name },
    { key: "jurisdiction", label: "Jurisdiction", value: row => row.jurisdiction }
  ];
}

function activeColumns() {
  return [
    { key: "state", label: "State", value: row => row.state },
    { key: "jurisdiction", label: "Jurisdiction", value: row => row.jurisdiction },
    { key: "expiration", label: "Expiration Date", value: row => row.expiration },
    { key: "qualifier", label: "Qualifier", value: row => row.qualifier },
    { key: "type", label: "Type", value: row => row.type },
    { key: "pure", label: "PURE", value: row => row.pure }
  ];
}

function filteredRows(kind) {
  let rows = kind === "active" ? state.data.activeRegistrations.slice() : kind === "archived" ? state.data.archivedRequests.slice() : state.data.openRequests.slice();
  rows = rows.filter(row => {
    const search = state.filters.search.toLowerCase();
    const haystack = JSON.stringify(row).toLowerCase();
    return (state.filters.status === "All statuses" || row.status === state.filters.status)
      && (state.filters.region === "All regions" || row.region === state.filters.region || row.state === state.filters.region)
      && (state.filters.brand === "All brands" || row.brand === state.filters.brand)
      && (!search || haystack.includes(search));
  });
  if (state.metricFilter && state.metricFilter !== "all") {
    rows = rows.filter(row => matchesMetric(row, kind, state.metricFilter));
  }
  rows.sort((a, b) => {
    const av = String(a[state.sort.key] || "");
    const bv = String(b[state.sort.key] || "");
    return state.sort.direction === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });
  return rows;
}

function isResearched(row) {
  return [row.status, row.stage].some(value => ["research", "researched"].includes(String(value || "").toLowerCase()));
}

function matchesMetric(row, kind, metric) {
  if (metric === "alerts") {
    const recordId = row.request_id || row.registration_id;
    return [...(state.data.alerts || []), ...(state.data.followUps || [])].some(item => (item.request_id || item.registration_id) === recordId);
  }
  if (kind === "open") {
    if (metric === "researched") return isResearched(row);
    return String(row.status || "").toLowerCase() === metric;
  }
  if (kind === "active") {
    if (metric === "renewals") return [row.status, row.stage].some(value => String(value || "").toLowerCase().includes("renewal"));
    const days = daysUntil(row.expiration);
    if (metric === "expired") return days !== null && days < 0;
    if (metric === "due7") return days !== null && days >= 0 && days <= 7;
    if (metric === "due30") return days !== null && days >= 8 && days <= 30;
  }
  return true;
}

function daysUntil(value) {
  const date = parseDateValue(value);
  if (!date) return null;
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((end - start) / 86400000);
}

function registrationReportViewName(page = state.page) {
  return page === "active" ? "Active Registrations" : page === "archived" ? "Archived Registrations" : "Open Requests";
}

function registrationReportBaseRecords(view = "All Records") {
  const requestsById = new Map((state.data.requests || []).map(row => [row.request_id, row]));
  const scopes = [
    { label: "Open Requests", rows: state.data.openRequests || [] },
    { label: "Active Registrations", rows: state.data.activeRegistrations || [] },
    { label: "Archived Registrations", rows: state.data.archivedRequests || [] }
  ];
  const selectedScopes = view === "All Records" ? scopes : scopes.filter(scope => scope.label === view);
  const records = [];
  const seen = new Set();
  selectedScopes.forEach(scope => {
    scope.rows.forEach((row, index) => {
      const key = row.request_id || row.registration_id || `${scope.label}|${row.brand || ""}|${row.jurisdiction || ""}|${index}`;
      if (seen.has(key)) return;
      seen.add(key);
      records.push({ ...(requestsById.get(row.request_id) || {}), ...row, _report_view: scope.label });
    });
  });
  return records;
}

function registrationReportOptions(records, fields) {
  return Array.from(new Set(records.flatMap(row => fields.map(field => row[field])).filter(Boolean).map(String))).sort((a, b) => a.localeCompare(b));
}

function registrationReportOptionHtml(options, selected) {
  return options.map(option => `<option ${option === selected ? "selected" : ""}>${escapeHtml(option)}</option>`).join("");
}

function registrationReportInitialFilters() {
  return {
    view: registrationReportViewName(),
    region: state.filters.region || "All regions",
    brand: state.filters.brand || "All brands",
    status: state.filters.status || "All statuses",
    stage: "All stages",
    expiration: "Any expiration",
    alertFilter: "All alerts",
    groupBy: "No grouping",
    search: state.filters.search || ""
  };
}

function readRegistrationReportFilters(modal) {
  const read = (name, fallback) => {
    const control = modal && modal.querySelector(`[data-report-filter="${name}"]`);
    return control ? control.value : fallback;
  };
  return {
    view: read("view", "All Records"),
    region: read("region", "All regions"),
    brand: read("brand", "All brands"),
    status: read("status", "All statuses"),
    stage: read("stage", "All stages"),
    expiration: read("expiration", "Any expiration"),
    alertFilter: read("alertFilter", "All alerts"),
    groupBy: read("groupBy", "No grouping"),
    search: read("search", "").trim()
  };
}

function registrationHasAlert(row) {
  const recordId = row.request_id || row.registration_id;
  const linkedAlert = [...(state.data.alerts || []), ...(state.data.followUps || [])]
    .some(item => (item.request_id || item.registration_id) === recordId);
  return linkedAlert || /\]\s*(alert|follow-up(?: needed)?):?/i.test(String(row.notes || ""));
}

function registrationMatchesExpiration(row, filter) {
  if (filter === "Any expiration") return true;
  const days = daysUntil(row.expiration);
  if (days === null) return false;
  if (filter === "Expired") return days < 0;
  if (filter === "Due in 7 days") return days >= 0 && days <= 7;
  if (filter === "Due in 30 days") return days >= 0 && days <= 30;
  if (filter === "Due in 60 days") return days >= 0 && days <= 60;
  if (filter === "Current") return days > 60;
  return true;
}

function getRegistrationReportRecords(modal = document.querySelector(".registration-report-modal")) {
  const filters = readRegistrationReportFilters(modal);
  let records = registrationReportBaseRecords(filters.view).filter(row => {
    const region = row.region || row.state || "";
    if (filters.region !== "All regions" && region !== filters.region && row.state !== filters.region) return false;
    if (filters.brand !== "All brands" && row.brand !== filters.brand) return false;
    if (filters.status !== "All statuses" && row.status !== filters.status) return false;
    if (filters.stage !== "All stages" && row.stage !== filters.stage) return false;
    if (!registrationMatchesExpiration(row, filters.expiration)) return false;
    const hasAlert = registrationHasAlert(row);
    if (filters.alertFilter === "Open alerts" && !hasAlert) return false;
    if (filters.alertFilter === "No alert set" && hasAlert) return false;
    if (filters.search && !JSON.stringify(row).toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const preset = modal ? modal.dataset.reportPreset : "";
  if (preset === "renewals") {
    records = records.filter(row => [row.status, row.stage, row.renewal_status].some(value => String(value || "").toLowerCase().includes("renewal")));
  }
  if (preset === "expiring30") {
    records = records.filter(row => {
      const days = daysUntil(row.expiration);
      return days !== null && days >= 0 && days <= 30;
    });
  }

  const groupFields = { View: "_report_view", Region: "region", Brand: "brand", Status: "status", Stage: "stage" };
  const groupField = groupFields[filters.groupBy];
  records.sort((a, b) => {
    const groupCompare = groupField ? String(a[groupField] || a.state || "").localeCompare(String(b[groupField] || b.state || "")) : 0;
    return groupCompare || String(a.jurisdiction || a.license_name || "").localeCompare(String(b.jurisdiction || b.license_name || ""));
  });
  return records;
}

function getRegistrationReportParameters(modal = document.querySelector(".registration-report-modal")) {
  const filters = readRegistrationReportFilters(modal);
  const presetButton = modal && modal.querySelector("[data-quick-registration-report].active");
  return {
    report: "Registrations",
    generated: new Date().toLocaleString(),
    preset: presetButton ? presetButton.textContent.trim() : "Custom Report",
    ...filters,
    search: filters.search || "None"
  };
}

function getRegistrationReportRows(records) {
  const headers = [
    "Request ID", "View", "Status", "Stage", "Requestor", "Brand", "Region", "State", "Jurisdiction",
    "Submitted", "Received", "Researched", "License Submitted", "License Received", "Completed", "Archived",
    "Expiration", "Qualifier", "License / Registration Name", "License Number", "Type", "PURE", "Assigned To",
    "Research Category", "License Action", "Bond / Insurance", "COI", "Payment Status", "Payment Method",
    "Documents Included", "Submission Method", "Research Notes", "Notes", "Renewal Status", "Renewal Due",
    "Renewal Owner", "Renewal Notes", "Reopened From", "Research Verified", "Research Verified By"
  ];
  const rows = records.map(row => [
    row.request_id || row.registration_id || "", row._report_view || "", row.status || "", row.stage || "",
    row.requestor_name || "", row.brand || "", row.region || "", row.state || row.received_license_state || "",
    row.jurisdiction || "", row.date_submitted || row.submitted_at || "", row.received_date || "", row.researched_date || "",
    row.submitted_license_date || "", row.license_received_date || "", row.completed_date || "", row.archived_date || "",
    row.expiration || "", row.qualifier || "", row.license_name || row.received_license_name || row.license_type_name || "",
    row.number || row.license_number || "", row.type || row.received_license_type || "", row.pure || "", row.assigned_to || "",
    row.license_category || "", row.license_action || "", row.bond_type || "", row.coi_type || "", row.payment_status || "",
    row.payment_method || "", row.documents_included || "", row.submission_method || "", row.research_notes || "", row.notes || "",
    row.renewal_status || "", row.renewal_due_date || "", row.renewal_owner || "", row.renewal_notes || "",
    row.reopened_from_request_id || "", row.research_verified_at || "", row.research_verified_by || ""
  ]);
  return { headers, rows };
}

function registrationReportFilename(extension) {
  return `citadel-registrations-report-${formatDateStamp(new Date())}.${extension}`;
}

function downloadRegistrationReport(content, type, filename) {
  const blob = new Blob([content], { type });
  const link = document.createElement("a");
  const href = URL.createObjectURL(blob);
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  window.setTimeout(() => {
    URL.revokeObjectURL(href);
    link.remove();
  }, 1200);
}

function registrationReportCsvContent(records) {
  const report = getRegistrationReportRows(records);
  return `\uFEFF${[report.headers, ...report.rows].map(row => row.map(cell => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n")}`;
}

function registrationReportExcelContent(records, params) {
  const report = getRegistrationReportRows(records);
  const parameterRows = [
    ["Report", params.report], ["Generated", params.generated], ["Quick Report", params.preset], ["View", params.view],
    ["Region", params.region], ["Brand", params.brand], ["Status", params.status], ["Stage", params.stage],
    ["Expiration", params.expiration], ["Alert Filter", params.alertFilter], ["Group By", params.groupBy],
    ["Search", params.search], ["Record Count", records.length]
  ];
  return `\uFEFF<!doctype html><html><head><meta charset="utf-8"><style>
    body{font-family:Arial,sans-serif;color:#071826}h1{font-size:20px;margin:0 0 10px}table{border-collapse:collapse}
    td,th{border:1px solid #b8c8d6;padding:6px 8px;font-size:11px;vertical-align:top}th{background:#0d2f52;color:#fff;text-align:left}
    .params{margin-bottom:14px}.params td:first-child{font-weight:bold;background:#eef3f8;white-space:nowrap}
  </style></head><body><h1>Citadel Registrations Report</h1><table class="params">${parameterRows.map(row => `<tr><td>${escapeHtml(row[0])}</td><td>${escapeHtml(row[1])}</td></tr>`).join("")}</table>
  <table><thead><tr>${report.headers.map(header => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${report.rows.map(row => `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></body></html>`;
}

function registrationPdfText(value, maxLength = 80) {
  let text = String(value ?? "").replace(/[\r\n]+/g, " ").replace(/[–—]/g, "-");
  if (text.normalize) text = text.normalize("NFKD");
  text = text.replace(/[^\x20-\x7E]/g, "").replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  return text.length > maxLength ? `${text.slice(0, Math.max(0, maxLength - 3))}...` : text;
}

function buildRegistrationReportPdf(records, params) {
  const columns = [
    { label: "Jurisdiction", x: 32, max: 22, value: row => row.jurisdiction },
    { label: "State", x: 182, max: 6, value: row => row.state || row.received_license_state },
    { label: "Region", x: 226, max: 7, value: row => row.region },
    { label: "Brand", x: 278, max: 20, value: row => row.brand },
    { label: "Status", x: 420, max: 13, value: row => row.status },
    { label: "Stage", x: 510, max: 13, value: row => row.stage },
    { label: "Expiration", x: 600, max: 11, value: row => row.expiration },
    { label: "Qualifier", x: 680, max: 20, value: row => row.qualifier }
  ];
  const rowsPerPage = 34;
  const chunks = [];
  for (let index = 0; index < records.length; index += rowsPerPage) chunks.push(records.slice(index, index + rowsPerPage));
  if (!chunks.length) chunks.push([]);

  const pageStreams = chunks.map((rows, pageIndex) => {
    const commands = [];
    const drawText = (x, y, size, value, bold = false, max = 120) => {
      commands.push(`BT /${bold ? "F2" : "F1"} ${size} Tf ${x} ${y} Td (${registrationPdfText(value, max)}) Tj ET`);
    };
    drawText(32, 562, 15, "Citadel Registrations Report", true);
    drawText(748, 562, 8, `Page ${pageIndex + 1} of ${chunks.length}`, false, 30);
    let headerY = 530;
    if (pageIndex === 0) {
      drawText(32, 546, 8, `Generated: ${params.generated} | Quick report: ${params.preset} | Records: ${records.length}`, false, 120);
      drawText(32, 534, 8, `View: ${params.view} | Region: ${params.region} | Brand: ${params.brand} | Status: ${params.status} | Stage: ${params.stage}`, false, 135);
      drawText(32, 522, 8, `Expiration: ${params.expiration} | Alerts: ${params.alertFilter} | Group: ${params.groupBy} | Search: ${params.search}`, false, 135);
      headerY = 501;
    }
    commands.push(`0.82 0.87 0.92 RG 32 ${headerY - 5} m 810 ${headerY - 5} l S`);
    columns.forEach(column => drawText(column.x, headerY, 7, column.label, true, column.max));
    rows.forEach((row, rowIndex) => {
      const y = headerY - 18 - rowIndex * 13;
      columns.forEach(column => drawText(column.x, y, 7, column.value(row) || "", false, column.max));
      commands.push(`0.9 0.92 0.94 RG 32 ${y - 4} m 810 ${y - 4} l S`);
    });
    return commands.join("\n");
  });

  const objects = [null];
  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  const pageIds = pageStreams.map((_, index) => 5 + index * 2);
  objects[2] = `<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;
  objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  objects[4] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";
  pageStreams.forEach((stream, index) => {
    const pageId = 5 + index * 2;
    const contentId = pageId + 1;
    objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`;
    objects[contentId] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  });

  let pdf = "%PDF-1.4\n%Citadel\n";
  const offsets = [0];
  for (let index = 1; index < objects.length; index += 1) {
    offsets[index] = pdf.length;
    pdf += `${index} 0 obj\n${objects[index]}\nendobj\n`;
  }
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let index = 1; index < objects.length; index += 1) pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}

function updateRegistrationReportSummary() {
  const modal = document.querySelector(".registration-report-modal");
  if (!modal) return;
  const records = getRegistrationReportRecords(modal);
  const params = getRegistrationReportParameters(modal);
  const expiring = records.filter(row => {
    const days = daysUntil(row.expiration);
    return days !== null && days >= 0 && days <= 30;
  }).length;
  const renewals = records.filter(row => [row.status, row.stage, row.renewal_status].some(value => String(value || "").toLowerCase().includes("renewal"))).length;
  modal.querySelector("[data-report-count]").textContent = `${records.length} ${records.length === 1 ? "record" : "records"}`;
  modal.querySelector("[data-report-context]").textContent = params.preset === "Custom Report" ? params.view : params.preset;
  modal.querySelector("[data-report-detail]").textContent = `${expiring} expiring in 30 days | ${renewals} renewals`;
  modal.querySelector("[data-report-parameters]").innerHTML = `<strong>Report parameters</strong>
    <span>View: ${escapeHtml(params.view)}</span><span>Status: ${escapeHtml(params.status)}</span>
    <span>Stage: ${escapeHtml(params.stage)}</span><span>Region: ${escapeHtml(params.region)}</span>
    <span>Brand: ${escapeHtml(params.brand)}</span><span>Expiration: ${escapeHtml(params.expiration)}</span>
    <span>Alerts: ${escapeHtml(params.alertFilter)}</span><span>Search: ${escapeHtml(params.search)}</span>`;
}

function setRegistrationReportControl(modal, name, value) {
  const control = modal.querySelector(`[data-report-filter="${name}"]`);
  if (!control) return;
  const valid = Array.from(control.options || []).some(option => option.value === value || option.textContent === value);
  control.value = (valid || control.tagName === "INPUT") ? value : control.options[0].value;
}

function resetRegistrationReportModal(modal) {
  const initial = registrationReportInitialFilters();
  modal.dataset.reportPreset = "";
  Object.entries(initial).forEach(([name, value]) => setRegistrationReportControl(modal, name, value));
  modal.querySelectorAll("[data-quick-registration-report]").forEach(button => button.classList.remove("active"));
  updateRegistrationReportSummary();
}

function applyRegistrationReportPreset(modal, preset) {
  const defaults = {
    view: "All Records", region: "All regions", brand: "All brands", status: "All statuses", stage: "All stages",
    expiration: "Any expiration", alertFilter: "All alerts", groupBy: "No grouping", search: ""
  };
  if (preset === "current") Object.assign(defaults, registrationReportInitialFilters());
  if (preset === "alerts") defaults.alertFilter = "Open alerts";
  if (preset === "new") Object.assign(defaults, { view: "Open Requests", status: "New" });
  if (preset === "researched") Object.assign(defaults, { view: "Open Requests", status: "Researched" });
  if (preset === "expiring30") Object.assign(defaults, { view: "Active Registrations", expiration: "Due in 30 days" });
  if (preset === "renewals") defaults.view = "Active Registrations";
  modal.dataset.reportPreset = ["renewals", "expiring30"].includes(preset) ? preset : "";
  Object.entries(defaults).forEach(([name, value]) => setRegistrationReportControl(modal, name, value));
  modal.querySelectorAll("[data-quick-registration-report]").forEach(button => button.classList.toggle("active", button.dataset.quickRegistrationReport === preset));
  updateRegistrationReportSummary();
}

function exportRegistrationReport() {
  const modal = document.querySelector(".registration-report-modal");
  if (!modal) return;
  const records = getRegistrationReportRecords(modal);
  if (!records.length) {
    toast("No registration records match this report.");
    return;
  }
  const params = getRegistrationReportParameters(modal);
  const format = modal.querySelector("[data-export-format]").value;
  if (format === "Excel") {
    downloadRegistrationReport(registrationReportExcelContent(records, params), "application/vnd.ms-excel;charset=utf-8", registrationReportFilename("xls"));
  } else if (format === "PDF") {
    downloadRegistrationReport(buildRegistrationReportPdf(records, params), "application/pdf", registrationReportFilename("pdf"));
  } else {
    downloadRegistrationReport(registrationReportCsvContent(records), "text/csv;charset=utf-8", registrationReportFilename("csv"));
  }
}

function openRegistrationReportsModal() {
  closeRegistrationReportsModal();
  const allRecords = registrationReportBaseRecords("All Records");
  const initial = registrationReportInitialFilters();
  const viewOptions = ["All Records", "Open Requests", "Active Registrations", "Archived Registrations"];
  const regionOptions = ["All regions", ...registrationReportOptions(allRecords, ["region", "state"])];
  const brandOptions = ["All brands", ...registrationReportOptions(allRecords, ["brand"])];
  const statusOptions = ["All statuses", ...registrationReportOptions(allRecords, ["status"])];
  const stageOptions = ["All stages", ...registrationReportOptions(allRecords, ["stage"])];
  const modal = document.createElement("div");
  modal.className = "modal-backdrop registration-report-backdrop";
  modal.innerHTML = `<section class="registration-report-modal" role="dialog" aria-modal="true" aria-label="Registrations Reports">
    <div class="report-modal-head"><div><h3>Registrations Reports</h3><p>Build registration and license reports from requests, research, qualifiers, renewals, and workflow dates.</p></div><button type="button" data-close-registration-report aria-label="Close reports">X</button></div>
    <div class="registration-report-callout">This report includes registration requests, active and archived licenses, research selections, qualifier details, protected notes, alerts, and renewal fields.</div>
    <section class="registration-report-band"><div class="registration-report-band-head"><strong>Quick Reports</strong><span>Common exports</span></div><div class="registration-quick-report-grid">
      <button type="button" data-quick-registration-report="alerts">Open Alerts</button><button type="button" data-quick-registration-report="new">New Requests</button>
      <button type="button" data-quick-registration-report="researched">Ready to Submit</button><button type="button" data-quick-registration-report="expiring30">Expiring 30 Days</button>
      <button type="button" data-quick-registration-report="renewals">Renewals</button><button type="button" data-quick-registration-report="current">Current View</button>
    </div></section>
    <section class="registration-report-custom"><div class="registration-report-band-head"><strong>Custom Report</strong><span>Filters, grouping, and export format</span></div><div class="registration-report-form-grid">
      <label>View<select data-report-filter="view">${registrationReportOptionHtml(viewOptions, initial.view)}</select></label>
      <label>Region<select data-report-filter="region">${registrationReportOptionHtml(regionOptions, initial.region)}</select></label>
      <label>Brand<select data-report-filter="brand">${registrationReportOptionHtml(brandOptions, initial.brand)}</select></label>
      <label>Status<select data-report-filter="status">${registrationReportOptionHtml(statusOptions, initial.status)}</select></label>
      <label>Stage<select data-report-filter="stage">${registrationReportOptionHtml(stageOptions, initial.stage)}</select></label>
      <label>Expiration<select data-report-filter="expiration">${registrationReportOptionHtml(["Any expiration", "Expired", "Due in 7 days", "Due in 30 days", "Due in 60 days", "Current"], initial.expiration)}</select></label>
      <label>Alert Filter<select data-report-filter="alertFilter">${registrationReportOptionHtml(["All alerts", "Open alerts", "No alert set"], initial.alertFilter)}</select></label>
      <label>Group By<select data-report-filter="groupBy">${registrationReportOptionHtml(["No grouping", "View", "Region", "Brand", "Status", "Stage"], initial.groupBy)}</select></label>
      <label class="registration-report-search">Search Text<input data-report-filter="search" placeholder="Requestor, brand, jurisdiction, license" value="${escapeHtml(initial.search)}"></label>
    </div></section>
    <div class="registration-report-summary-row"><div class="registration-report-parameters" data-report-parameters></div><div class="registration-report-total"><strong data-report-count>0 records</strong><span data-report-context>Current View</span><em data-report-detail>0 expiring in 30 days | 0 renewals</em></div></div>
    <div class="registration-report-actions"><button type="button" data-registration-report-reset>Reset</button><span></span><select data-export-format aria-label="Export format"><option>CSV</option><option>Excel</option><option>PDF</option></select><button type="button" data-close-registration-report>Cancel</button><button type="button" class="primary" data-registration-report-export>Export</button></div>
  </section>`;

  modal.addEventListener("click", event => {
    const quick = event.target.closest("[data-quick-registration-report]");
    if (quick) {
      applyRegistrationReportPreset(modal, quick.dataset.quickRegistrationReport);
      return;
    }
    if (event.target.closest("[data-registration-report-reset]")) {
      resetRegistrationReportModal(modal);
      return;
    }
    if (event.target.closest("[data-registration-report-export]")) {
      exportRegistrationReport();
      return;
    }
    if (event.target === modal || event.target.closest("[data-close-registration-report]")) closeRegistrationReportsModal();
  });
  const handleFilterChange = event => {
    if (event.target.matches("[data-report-filter]")) {
      modal.dataset.reportPreset = "";
      modal.querySelectorAll("[data-quick-registration-report]").forEach(button => button.classList.remove("active"));
    }
    updateRegistrationReportSummary();
  };
  modal.addEventListener("input", handleFilterChange);
  modal.addEventListener("change", handleFilterChange);
  modal._escapeHandler = event => {
    if (event.key === "Escape") closeRegistrationReportsModal();
  };
  document.addEventListener("keydown", modal._escapeHandler);
  document.body.appendChild(modal);
  updateRegistrationReportSummary();
  modal.querySelector('[data-report-filter="search"]').focus();
}

function closeRegistrationReportsModal() {
  document.querySelectorAll(".registration-report-backdrop").forEach(modal => {
    if (modal._escapeHandler) document.removeEventListener("keydown", modal._escapeHandler);
    modal.remove();
  });
}

function selectedPanel(row, kind) {
  const tabs = kind === "active"
    ? ["info", "license", "qualifier", "research", "dates", "notes", "renewal", "archive"]
    : ["info", "dates", "research", "notes", "license", "qualifier"];
  if (!tabs.includes(state.workflowTab)) state.workflowTab = "info";
  return `<div class="selected-head">
      <div><small>Selected registration</small><h3>${escapeHtml(row.jurisdiction || row.license_name || "Registration")}</h3><p>${escapeHtml(row.status || kind)} / ${escapeHtml(row.region || row.state || "")}</p></div>
      <div class="selected-meta"><span>Submitted</span><b>${escapeHtml(row.date_submitted || "")}</b><span>Age</span><b>${escapeHtml(submittedAge(row.date_submitted))}</b></div>
    </div>
    <div class="workflow-tabs">${tabs.map(tab => `<button type="button" data-workflow-tab="${tab}" class="${state.workflowTab === tab ? "active" : ""}">${tabLabel(tab)}</button>`).join("")}</div>
    <div class="workflow-card">${workflowContent(row, kind)}</div>`;
}

function submittedAge(dateValue) {
  const submitted = parseDateValue(dateValue);
  if (!submitted) return "";
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const submittedStart = new Date(submitted.getFullYear(), submitted.getMonth(), submitted.getDate());
  const days = Math.max(0, Math.floor((todayStart - submittedStart) / 86400000));
  return days === 1 ? "1 day" : `${days} days`;
}

function detail(label, value) {
  return `<div class="detail-card"><span>${escapeHtml(label)}</span><b>${escapeHtml(value || "")}</b></div>`;
}

function detailWide(label, value) {
  return `<div class="detail-card wide"><span>${escapeHtml(label)}</span><b>${escapeHtml(value || "")}</b></div>`;
}

function tabLabel(tab) {
  return { info: "Info", dates: "Dates", research: "Research", qualifier: "Qualifier", notes: "Follow up", license: "License", renewal: "Renewal", archive: "Archive" }[tab];
}

function workflowContent(row, kind) {
  let panel = "";
  if (state.workflowTab === "dates") panel = datesPanel(row, kind);
  else if (state.workflowTab === "research") panel = researchPanel(row, kind);
  else if (state.workflowTab === "qualifier") panel = qualifierPanel(row, kind);
  else if (state.workflowTab === "notes") panel = followUpPanel(row, kind);
  else if (state.workflowTab === "license") panel = licenseReceivedPanel(row, kind);
  else if (state.workflowTab === "renewal") panel = renewalPanel(row);
  else if (state.workflowTab === "archive") panel = activeArchivePanel(row);
  else panel = infoPanel(row, kind);
  return kind === "archived"
    ? `<fieldset class="archived-content" disabled aria-label="Archived record details">${panel}</fieldset>${moveToNewRequestAction()}`
    : panel;
}

function infoPanel(row, kind) {
  return `<h3>Info</h3>
    <div class="detail-grid">
      ${detail("Requestor", row.requestor_name)}
      ${detail("Brand", row.brand)}
      ${detail("Region", row.region || row.state)}
      ${detail("Jurisdiction", row.jurisdiction)}
      ${detail("Requested", row.date_submitted)}
      ${detail("PURE", row.pure)}
      ${detail("Website", row.website)}
      ${detail("Phone", row.phone)}
      ${detail("Email", row.email)}
      ${detail("Expiration", row.expiration)}
      ${detailWide("Requirements", row.requirements || "No requirements entered.")}
      ${detailWide("Notes", noteHistoryText(row.notes) || "No notes entered.")}
      ${row.reopened_from_request_id ? detail("Reopened From", row.reopened_from_request_id) : ""}
      ${row.research_verified_at ? detail("Research Verified", `${row.research_verified_at}${row.research_verified_by ? ` by ${row.research_verified_by}` : ""}`) : ""}
    </div>
    ${kind === "archived" ? "" : kind === "active" ? stageActions(["startRenewal", "alert", "archive", "undo"]) : stageActions(["received", "submitted", "undo", "archive"])}`;
}

function moveToNewRequestAction() {
  return `<div class="action-grid"><button class="primary full" data-stage-action="reopen">Move to New Request</button></div>`;
}

function followUpPanel(row, kind) {
  const notes = noteEntries(row.notes);
  return `<h3>Follow up</h3>
    <div class="follow-panel">
      <div class="note-list">
        ${notes.length ? notes.map(noteEntryHtml).join("") : `<p class="muted">No protected workflow notes yet.</p>`}
      </div>
      ${kind === "archived" ? "" : `<div class="action-grid follow-actions">
        <button class="secondary" data-stage-action="note">Add Note</button>
        <button class="secondary" data-stage-action="alert">Set Alert</button>
        <button class="secondary full" data-stage-action="undo">Undo Last Stage</button>
      </div>`}
    </div>`;
}

function noteEntries(notes) {
  return String(notes || "").split(/\r?\n/).map(line => line.trim()).filter(Boolean);
}

function parseNoteEntry(line) {
  const match = line.match(/^\[([^\]]+)\]\s*([^:]+)?(?::\s*)?(.*)$/);
  if (!match) return null;
  return {
    timestamp: match[1],
    label: String(match[2] || "Note").trim(),
    detail: match[3] || ""
  };
}

function noteHistoryText(notes) {
  return noteEntries(notes).map(line => {
    const entry = parseNoteEntry(line);
    if (!entry) return line;
    return `[${dateTimeValue(entry.timestamp, true)}] ${entry.label}${entry.detail ? `: ${entry.detail}` : ""}`;
  }).join("\n");
}

function noteEntryHtml(line) {
  const entry = parseNoteEntry(line);
  if (!entry) return `<article class="note-entry"><p>${escapeHtml(line)}</p></article>`;
  return `<article class="note-entry">
    <div><strong>${escapeHtml(entry.label)}</strong><span>${escapeHtml(dateTimeValue(entry.timestamp))}</span></div>
    ${entry.detail ? `<p>${escapeHtml(entry.detail)}</p>` : ""}
  </article>`;
}

function datesPanel(row, kind) {
  const initialDates = [
    ["Submitted", row.date_submitted],
    ["Received", row.received_date],
    ["Researched", row.researched_date],
    ["License Submitted", row.submitted_license_date],
    ["License Received", row.license_received_date],
    ["Completed", row.completed_date],
    ["Archived", row.archived_date]
  ];
  const renewalDates = [
    ["License Expires", row.expiration],
    ["Renewal Due", row.renewal_due_date],
    ["Renewal Started", row.renewal_started_date],
    ["Renewal Submitted", row.renewal_submitted_date],
    ["Renewal Received", row.renewal_received_date],
    ["Archived", row.archived_date]
  ];
  const dates = kind === "active" ? renewalDates : initialDates;
  return `<h3>Dates</h3>${dates.map(item => detail(item[0], item[1])).join("")}`;
}

function stageActions(actions) {
  return `<div class="action-grid compact-actions">${actions.map(action => `<button class="${action === "archive" ? "danger" : action === "undo" ? "secondary" : "primary"}" data-stage-action="${action}">${escapeHtml(actionLabel(action))}</button>`).join("")}</div>`;
}

function actionLabel(action) {
  return {
    received: "Mark Received",
    research: "Mark Researched",
    submitted: "Submit License",
    license: "License Received",
    active: "Move to Active",
    startRenewal: "Start Renewal",
    renewalSubmitted: "Renewal Submitted",
    renewalReceived: "Renewal Received",
    reopen: "Move to New Request",
    archive: "Archive",
    saveQualifier: "Save Qualifier",
    undo: "Undo Last Stage"
  }[action] || action;
}

function renewalPanel(row) {
  return `<h3>Renewal</h3>
    <p class="research-hint">Start the renewal here, then confirm requirements in the Research tab before submitting renewal paperwork.</p>
    <div class="license-form">
      <label class="license-field">Renewal Due Date
        <input type="date" data-license-field="renewal_due_date" value="${escapeHtml(row.renewal_due_date)}">
      </label>
      <label class="license-field">Renewal Status
        <select data-license-field="renewal_status">
          ${["", "Renewal Needed", "Renewal Started", "Renewal Submitted", "Renewal Received"].map(item => `<option value="${item}" ${item === row.renewal_status ? "selected" : ""}>${item || "-- Select status --"}</option>`).join("")}
        </select>
      </label>
      <label class="license-field">Owner
        <input data-license-field="renewal_owner" value="${escapeHtml(row.renewal_owner)}" placeholder="Who is handling this?">
      </label>
      <label class="license-field wide">Renewal Notes
        <textarea data-license-field="renewal_notes" placeholder="Renewal notes, requirements, or next steps...">${escapeHtml(row.renewal_notes)}</textarea>
      </label>
    </div>
    ${stageActions(["startRenewal", "renewalSubmitted", "renewalReceived", "undo"])}`;
}

function activeArchivePanel(row) {
  return `<h3>Archive</h3>
    <p class="research-hint">Archive only when this registration or license should leave the active queue.</p>
    <div class="license-form">
      <label class="license-field wide">Archive Reason
        <textarea data-license-field="archive_reason" placeholder="Why is this being archived?">${escapeHtml(row.archive_reason)}</textarea>
      </label>
    </div>
    ${stageActions(["archive", "undo"])}`;
}

function qualifierPanel(row, kind) {
  const reminderMode = row.ce_reminder_date ? "date" : "days";
  return `<h3>Qualifier</h3>
    <div class="license-form qualifier-form">
      <label class="license-field wide">Qualifier
        <input data-license-field="qualifier" value="${escapeHtml(row.qualifier)}" placeholder="Name of qualifier">
      </label>
      <label class="license-field">CE Hours
        <input data-license-field="continuing_education_hours" value="${escapeHtml(row.continuing_education_hours)}" placeholder="e.g. 8">
      </label>
      <label class="license-field">CE Due Date
        <input type="date" data-license-field="ce_due_date" value="${escapeHtml(row.ce_due_date)}">
      </label>
      <div class="license-field wide ce-reminder-box">
        <span>CE Reminder Alert</span>
        <div class="ce-reminder-row">
          <label class="ce-reminder-option"><input type="radio" name="ce-reminder-mode" data-license-choice="ce_reminder_mode" data-license-value="days" ${reminderMode === "days" ? "checked" : ""}> <span>Remind in</span></label>
          <input class="ce-reminder-days" data-license-field="ce_reminder_days" value="${escapeHtml(row.ce_reminder_days || "30")}" inputmode="numeric">
          <span>days before due</span>
          <label class="ce-reminder-option"><input type="radio" name="ce-reminder-mode" data-license-choice="ce_reminder_mode" data-license-value="date" ${reminderMode === "date" ? "checked" : ""}> <span>On date</span></label>
          <input class="ce-reminder-date" type="date" data-license-field="ce_reminder_date" value="${escapeHtml(row.ce_reminder_date || "")}">
        </div>
        <small>Set a CE Due Date first to use days before.</small>
      </div>
    </div>
    ${kind === "archived" ? "" : stageActions(["saveQualifier", "undo"])}`;
}

function researchPanel(row, kind) {
  const actions = kind === "active" ? ["research", "renewalSubmitted", "undo", "archive"] : ["research", "submitted", "undo", "archive"];
  return `<h3>Research</h3>
    <p class="research-hint">${escapeHtml(row.requirements || "Review jurisdiction requirements, bonds, insurance, payment, documents, and submission method.")}</p>
    <div class="research-grid">
      ${researchSection("License Type", [
        researchGroup("Type", [
          researchChoice("license_category", "Contractor License", row.license_category),
          researchChoice("license_category", "Business License", row.license_category),
          researchChoice("license_category", "Contractor Registration", row.license_category)
        ]),
        researchGroup("Action", [
          researchChoice("license_action", "New", row.license_action),
          researchChoice("license_action", "Renewal", row.license_action)
        ])
      ])}
      ${researchSection("Bonds / Insurance", [
        researchGroup("Bond", [
          researchChoice("bond_type", "Original", row.bond_type),
          researchChoice("bond_type", "Electronic", row.bond_type),
          researchChoice("bond_type", "Special Bond", row.bond_type)
        ]),
        researchGroup("COI", [
          researchChoice("coi_type", "General", row.coi_type),
          researchChoice("coi_type", "Spec Req", row.coi_type),
          researchChoice("coi_type", "Additional Insured", row.coi_type)
        ])
      ])}
      ${researchSection("Payment", [
        researchGroup("Status", [
          researchChoice("payment_status", "Pending", row.payment_status),
          researchChoice("payment_status", "Paid", row.payment_status)
        ]),
        researchGroup("Method", [
          researchChoice("payment_method", "Check", row.payment_method),
          researchChoice("payment_method", "In Person", row.payment_method),
          researchChoice("payment_method", "Phone CC", row.payment_method),
          researchChoice("payment_method", "Online CC", row.payment_method),
          researchChoice("payment_method", "Other", row.payment_method)
        ])
      ])}
      ${researchSection("Documents", [
        researchGroup("Included", [
          researchChoice("documents_included", "Driver License", row.documents_included, true),
          researchChoice("documents_included", "Check Request", row.documents_included, true),
          researchChoice("documents_included", "Other Certifications", row.documents_included, true),
          researchChoice("documents_included", "References", row.documents_included, true),
          researchChoice("documents_included", "Application", row.documents_included, true),
          researchChoice("documents_included", "State License", row.documents_included, true),
          researchChoice("documents_included", "Wet Signatures", row.documents_included, true),
          researchChoice("documents_included", "Test Results", row.documents_included, true),
          researchChoice("documents_included", "Other", row.documents_included, true)
        ]),
        researchGroup("Submit By", [
          researchChoice("submission_method", "Email", row.submission_method),
          researchChoice("submission_method", "Mail", row.submission_method),
          researchChoice("submission_method", "In Person", row.submission_method),
          researchChoice("submission_method", "Online Portal", row.submission_method)
        ])
      ])}
    </div>
    <label class="research-notes">Research Notes<textarea data-research-notes placeholder="Short research notes...">${escapeHtml(row.research_notes)}</textarea></label>
    ${kind === "archived" ? "" : stageActions(actions)}`;
}

function licenseReceivedPanel(row, kind) {
  const states = ["", "AK", "AL", "AR", "AZ", "CA", "CO", "FL", "GA", "IA", "IL", "IN", "KS", "KY", "MI", "MN", "MO", "NC", "NE", "NM", "OH", "OK", "PA", "SC", "TN", "TX", "WI"];
  return `<h3>License Received</h3>
    <p class="research-hint">Enter final license details, then click License Received to save protected workflow data.</p>
    <div class="license-form">
      <label class="license-field wide">License / Registration Name
        <input data-license-field="received_license_name" value="${escapeHtml(row.received_license_name)}" placeholder="e.g. General Contractor License">
      </label>
      <label class="license-field small">State
        <select data-license-field="received_license_state">
          ${states.map(item => `<option value="${item}" ${item === row.received_license_state ? "selected" : ""}>${item || "-- Select state --"}</option>`).join("")}
        </select>
      </label>
      <div class="license-field">Type
        <div class="research-chip-row">
          ${licenseChoice("received_license_type", "Residential", row.received_license_type)}
          ${licenseChoice("received_license_type", "Commercial", row.received_license_type)}
          ${licenseChoice("received_license_type", "Both", row.received_license_type)}
        </div>
      </div>
      <label class="license-field">Contractor Number
        <input data-license-field="license_number" value="${escapeHtml(row.license_number)}" placeholder="e.g. ROC-123456">
      </label>
      <label class="license-field">Expiration Date
        <input type="date" data-license-field="expiration" value="${escapeHtml(row.expiration)}">
      </label>
    </div>
    ${kind === "archived" ? "" : stageActions(["license", "active", "undo"])}`;
}

function licenseChoice(field, value, current) {
  const selected = String(current || "").toLowerCase() === value.toLowerCase() ? " selected" : "";
  return `<button type="button" class="research-chip${selected}" data-license-choice="${field}" data-license-value="${escapeHtml(value)}">${escapeHtml(value)}</button>`;
}

function researchSection(title, choices) {
  return `<section class="research-section"><strong>${escapeHtml(title)}</strong>${choices.join("")}</section>`;
}

function researchGroup(title, choices) {
  return `<div class="research-group"><span>${escapeHtml(title)}</span><div class="research-chip-row">${choices.join("")}</div></div>`;
}

function researchChoice(field, value, selectedValue, multiple) {
  const selectedText = String(selectedValue || "");
  const selected = multiple
    ? selectedText.split("|").map(item => item.trim()).includes(value)
    : selectedText === value;
  return `<button type="button" class="research-chip ${selected ? "selected" : ""}" data-research-field="${field}" data-research-value="${escapeHtml(value)}" data-multiple="${multiple ? "true" : "false"}">${escapeHtml(value)}</button>`;
}

function emptyPanel() {
  return `<div class="selected-head"><small>Selected registration</small><h3>No registration selected</h3><p>Select a row to view workflow details.</p></div>`;
}

function bindWorkflow(kind) {
  const reportButton = document.querySelector("[data-report]");
  if (reportButton) reportButton.addEventListener("click", openRegistrationReportsModal);
  document.querySelectorAll("[data-metric]").forEach(button => button.addEventListener("click", () => {
    state.metricFilter = state.metricFilter === button.dataset.metric ? "" : button.dataset.metric;
    state.filters.status = "All statuses";
    state.selectedId = "";
    renderWorkflowPage(kind);
  }));
  document.querySelectorAll("[data-filter]").forEach(control => {
    const eventName = control.dataset.filter === "search" ? "input" : "change";
    control.addEventListener(eventName, filterChanged);
  });
  document.querySelectorAll("[data-sort]").forEach(th => th.addEventListener("click", () => sortBy(th.dataset.sort)));
  document.querySelectorAll("[data-row-id]").forEach(row => row.addEventListener("click", () => { state.selectedId = row.dataset.rowId; renderWorkflowPage(kind); }));
  document.querySelectorAll("[data-workflow-tab]").forEach(button => button.addEventListener("click", () => { state.workflowTab = button.dataset.workflowTab; renderWorkflowPage(kind); }));
  document.querySelectorAll("[data-research-field]").forEach(button => button.addEventListener("click", toggleResearchChip));
  document.querySelectorAll("[data-license-choice]").forEach(button => button.addEventListener("click", toggleLicenseChoice));
  document.querySelectorAll("[data-stage-action]").forEach(button => button.addEventListener("click", () => runStageAction(button.dataset.stageAction)));
}

function toggleResearchChip(event) {
  const button = event.currentTarget;
  const field = button.dataset.researchField;
  const multiple = button.dataset.multiple === "true";
  if (!multiple) {
    document.querySelectorAll(`[data-research-field="${field}"]`).forEach(item => item.classList.remove("selected"));
  }
  button.classList.toggle("selected");
}

function toggleLicenseChoice(event) {
  const button = event.currentTarget;
  const field = button.dataset.licenseChoice;
  document.querySelectorAll(`[data-license-choice="${field}"]`).forEach(item => item.classList.remove("selected"));
  button.classList.add("selected");
}

function filterChanged(event) {
  const control = event.currentTarget;
  const key = control.dataset.filter;
  if (key === "search") {
    state.filters.search = control.value;
    window.clearTimeout(workflowSearchTimer);
    workflowSearchTimer = window.setTimeout(render, 180);
    return;
  }
  if (key === "sort") {
    const value = control.value;
    state.sort = value === "Oldest first" ? { key: "date_submitted", direction: "asc" } : value === "Status A-Z" ? { key: "status", direction: "asc" } : value === "Jurisdiction A-Z" ? { key: "jurisdiction", direction: "asc" } : { key: "date_submitted", direction: "desc" };
  } else {
    state.filters[key] = control.value;
  }
  render();
}

function sortBy(key) {
  state.sort.direction = state.sort.key === key && state.sort.direction === "asc" ? "desc" : "asc";
  state.sort.key = key;
  render();
}

async function runStageAction(action) {
  const row = findSelectedRegistration();
  if (!row) return;
  if (action === "reopen") {
    await runRestartAction(row);
    return;
  }
  if (["note", "alert", "followup", "followupNeeded"].includes(action)) {
    await runWorkflowNoteAction(row, action);
    return;
  }
  if (action === "undo") {
    await runUndoAction(row);
    return;
  }
  if (action === "saveQualifier") {
    await saveRegistrationUpdate(row.request_id, { ...collectProtectedFieldPayload(), status_updated_at: currentTimestamp() }, "Qualifier saved.");
    return;
  }
  const stamp = currentTimestamp();
  const updates = {
    received: { status: "Open", stage: "Received", received_date: stamp },
    research: { status: "Researched", stage: "Researched", researched_date: stamp },
    submitted: { status: "Pending", stage: "Submitted", submitted_license_date: stamp },
    license: { status: "License Received", stage: "License Received", license_received_date: stamp },
    active: { status: "Active", stage: "Active", completed_date: stamp },
    startRenewal: { status: "Renewal", stage: "Renewal", renewal_status: "Renewal Started", renewal_started_date: stamp },
    renewalSubmitted: { status: "Renewal Submitted", stage: "Renewal Submitted", renewal_status: "Renewal Submitted", renewal_submitted_date: stamp },
    renewalReceived: { status: "Active", stage: "Active", renewal_status: "Renewal Received", renewal_received_date: stamp },
    archive: { status: "Archived", stage: "Archived", archived_date: stamp, active: false }
  }[action];
  if (!updates) return;
  updates.status_updated_at = stamp;
  if (["research", "submitted", "renewalSubmitted"].includes(action)) Object.assign(updates, collectResearchPayload(row));
  if (action === "license") Object.assign(updates, collectLicensePayload());
  if (["startRenewal", "renewalSubmitted", "renewalReceived", "archive"].includes(action)) Object.assign(updates, collectProtectedFieldPayload());
  await saveRegistrationUpdate(row.request_id, updates, "Registration updated.");
}

function findSelectedRegistration() {
  return state.data.openRequests.find(item => item.request_id === state.selectedId)
    || state.data.activeRegistrations.find(item => item.request_id === state.selectedId)
    || state.data.archivedRequests.find(item => item.request_id === state.selectedId)
    || state.data.requests.find(item => item.request_id === state.selectedId);
}

async function runUndoAction(row) {
  const status = String(row.status || "").toLowerCase();
  const stage = String(row.stage || "").toLowerCase();
  let updates = null;
  if (status.includes("renewal submitted") || stage.includes("renewal submitted")) {
    updates = { status: "Renewal", stage: "Renewal", renewal_status: "Renewal Started", renewal_submitted_date: "" };
  } else if (status.includes("renewal") || stage.includes("renewal")) {
    updates = { status: "Active", stage: "Active", renewal_status: "", renewal_started_date: "" };
  } else if (status.includes("archived") || stage.includes("archived")) {
    updates = { status: "Active", stage: "Active", archived_date: "", active: true };
  } else if (status.includes("license received") || stage.includes("license received")) {
    updates = { status: "Pending", stage: "Submitted", license_received_date: "" };
  } else if (status.includes("pending") || stage.includes("submitted")) {
    updates = { status: "Researched", stage: "Researched", submitted_license_date: "" };
  } else if (status.includes("research") || stage.includes("research")) {
    updates = { status: "Open", stage: "Received", researched_date: "" };
  } else if (status.includes("open") || stage.includes("received")) {
    updates = { status: "New", stage: "New", received_date: "" };
  }
  if (!updates) {
    toast("Nothing to undo for this stage.");
    return;
  }
  updates.status_updated_at = currentTimestamp();
  await saveRegistrationUpdate(row.request_id, updates, "Last stage undone.");
}

async function runWorkflowNoteAction(row, action) {
  const labels = {
    note: "Note",
    alert: "Alert",
    followup: "Follow-up",
    followupNeeded: "Follow-up needed"
  };
  let text = "";
  if (action === "alert") {
    const alert = await openAlertModal();
    if (!alert) return;
    const reminder = alert.mode === "date"
      ? `Remind on ${alert.date || "not set"}`
      : `Remind in ${alert.days || "0"} days`;
    text = `${alert.note} | ${reminder}`;
  } else if (action === "followupNeeded") {
    text = "Follow-up needed";
  } else {
    const input = window.prompt(action === "note" ? "Add protected note:" : "Add follow-up detail:", "");
    if (input === null) return;
    text = input.trim();
  }
  const stamp = currentTimestamp();
  const line = `[${stamp}] ${labels[action]}${text ? `: ${text}` : ""}`;
  const updates = { notes: [line, row.notes].filter(Boolean).join("\n"), status_updated_at: stamp };
  if (action === "followupNeeded") Object.assign(updates, { status: "Follow Up", stage: "Follow Up" });
  await saveRegistrationUpdate(row.request_id, updates, `${labels[action]} saved.`);
}

async function runRestartAction(row) {
  const choice = await openRestartModal(row);
  if (!choice) return;
  setStatus("Creating request...");
  try {
    const response = await jsonp({
      action: "restartRegistrationRequest",
      request_id: row.request_id,
      restart_mode: choice.mode,
      research_verified_by: row.assigned_to || "Emma"
    });
    if (!response || !response.ok) throw new Error(response && response.error ? response.error : "Restart failed");
    const newRequestId = response.data && response.data.request_id;
    if (!newRequestId) throw new Error("The restarted request did not return a request ID.");
    await loadData(false);
    state.workflowTab = choice.mode === "reuse_research" ? "research" : "info";
    setPage("open", newRequestId);
    toast(choice.mode === "reuse_research" ? "Verified research moved to a new Researched request." : "Fresh New request created.");
  } catch (error) {
    setStatus("Restart failed");
    toast(error.message || "Restart failed");
  }
}

function openRestartModal(row) {
  return new Promise(resolve => {
    const reusableResearch = [
      ["License Category", row.license_category],
      ["License Action", row.license_action],
      ["Bond Requirement", row.bond_type],
      ["COI Requirement", row.coi_type],
      ["Payment Status", row.payment_status],
      ["Payment Method", row.payment_method],
      ["Documents Included", row.documents_included],
      ["Submission Method", row.submission_method],
      ["Research Notes", row.research_notes]
    ];
    const modal = document.createElement("div");
    modal.className = "modal-backdrop";
    modal.innerHTML = `<div class="alert-modal restart-modal" role="dialog" aria-modal="true" aria-label="Restart archived request">
      <div class="modal-head">
        <h3>Restart Archived Request</h3>
        <button class="modal-close" type="button" data-restart-cancel>X</button>
      </div>
      <div class="restart-modal-body">
        <p>The archived record will remain unchanged. A new linked request will be created with a fresh submission timestamp.</p>
        <label class="restart-choice">
          <input type="radio" name="restartMode" value="fresh" checked>
          <span><strong>Start Fresh</strong><small>Copy only the original request, company, jurisdiction, contact, and requirement information. Begin at New.</small></span>
        </label>
        <label class="restart-choice">
          <input type="radio" name="restartMode" value="reuse_research">
          <span><strong>Reuse Verified Research</strong><small>Copy reusable jurisdiction research and begin at Researched. All transaction and license data still starts blank.</small></span>
        </label>
        <section class="restart-research" data-restart-research hidden>
          <h4>Research that will carry forward</h4>
          <div class="restart-research-grid">
            ${reusableResearch.map(item => `<div><span>${escapeHtml(item[0])}</span><b>${escapeHtml(item[1] || "Not recorded")}</b></div>`).join("")}
          </div>
          <label class="restart-confirm">
            <input type="checkbox" data-research-confirmed>
            <span>I reviewed the prior research and confirm it is still current.</span>
          </label>
        </section>
      </div>
      <div class="modal-actions">
        <button class="secondary" type="button" data-restart-cancel>Cancel</button>
        <button class="primary" type="button" data-restart-save>Create New Request</button>
      </div>
    </div>`;

    const cleanup = value => {
      modal.remove();
      document.removeEventListener("keydown", onKeydown);
      resolve(value);
    };
    const onKeydown = event => {
      if (event.key === "Escape") cleanup(null);
    };

    document.body.appendChild(modal);
    document.addEventListener("keydown", onKeydown);

    const researchSection = modal.querySelector("[data-restart-research]");
    const confirmation = modal.querySelector("[data-research-confirmed]");
    const save = modal.querySelector("[data-restart-save]");
    const selectedMode = () => modal.querySelector("input[name='restartMode']:checked").value;
    const syncChoice = () => {
      const reuseResearch = selectedMode() === "reuse_research";
      researchSection.hidden = !reuseResearch;
      save.disabled = reuseResearch && !confirmation.checked;
      save.textContent = reuseResearch ? "Create Researched Request" : "Create New Request";
    };

    modal.querySelectorAll("input[name='restartMode']").forEach(input => input.addEventListener("change", syncChoice));
    confirmation.addEventListener("change", syncChoice);
    modal.querySelectorAll("[data-restart-cancel]").forEach(button => button.addEventListener("click", () => cleanup(null)));
    save.addEventListener("click", () => {
      const mode = selectedMode();
      if (mode === "reuse_research" && !confirmation.checked) {
        confirmation.focus();
        return;
      }
      cleanup({ mode });
    });
    modal.addEventListener("click", event => {
      if (event.target === modal) cleanup(null);
    });
    modal.querySelector("input[name='restartMode']").focus();
  });
}

function openAlertModal() {
  return new Promise(resolve => {
    const modal = document.createElement("div");
    modal.className = "modal-backdrop";
    modal.innerHTML = `<div class="alert-modal" role="dialog" aria-modal="true" aria-label="Set alert">
      <div class="modal-head">
        <h3>Set Alert</h3>
        <button class="modal-close" type="button" data-alert-cancel>X</button>
      </div>
      <div class="alert-modal-body">
        <label>Alert note
          <textarea data-alert-note rows="4" placeholder="What needs attention?"></textarea>
        </label>
        <div class="alert-options">
          <label class="alert-option">
            <input type="radio" name="alertMode" value="days" checked>
            <span>Alert in</span>
            <input type="number" min="0" value="7" data-alert-days>
            <span>days</span>
          </label>
          <label class="alert-option">
            <input type="radio" name="alertMode" value="date">
            <span>On set date</span>
            <input type="date" data-alert-date>
          </label>
        </div>
      </div>
      <div class="modal-actions">
        <button class="secondary" type="button" data-alert-cancel>Cancel</button>
        <button class="primary" type="button" data-alert-save>Save Alert</button>
      </div>
    </div>`;

    const cleanup = value => {
      modal.remove();
      document.removeEventListener("keydown", onKeydown);
      resolve(value);
    };
    const onKeydown = event => {
      if (event.key === "Escape") cleanup(null);
    };

    document.body.appendChild(modal);
    document.addEventListener("keydown", onKeydown);

    const note = modal.querySelector("[data-alert-note]");
    const days = modal.querySelector("[data-alert-days]");
    const date = modal.querySelector("[data-alert-date]");

    modal.querySelectorAll("[data-alert-cancel]").forEach(button => button.addEventListener("click", () => cleanup(null)));
    modal.querySelector("[data-alert-save]").addEventListener("click", () => {
      const noteText = note.value.trim();
      if (!noteText) {
        note.focus();
        return;
      }
      const checked = modal.querySelector("input[name='alertMode']:checked");
      cleanup({
        note: noteText,
        mode: checked ? checked.value : "days",
        days: days.value.trim(),
        date: date.value
      });
    });
    modal.addEventListener("click", event => {
      if (event.target === modal) cleanup(null);
    });
    note.focus();
  });
}

async function saveRegistrationUpdate(requestId, updates, message) {
  setStatus("Saving...");
  try {
    const response = await jsonp({ action: "updateRegistrationRequest", request_id: requestId, ...updates });
    if (!response || !response.ok) throw new Error(response && response.error ? response.error : "Update failed");
    mergeRegistrationUpdate(requestId, updates);
    toast(message || "Registration updated.");
    await loadData(false);
    mergeRegistrationUpdate(requestId, updates);
    render();
    return true;
  } catch (error) {
    setStatus("Save failed");
    toast(error.message || "Update failed");
    return false;
  }
}

function mergeRegistrationUpdate(requestId, updates) {
  const timestampFields = [
    "submitted_at",
    "date_submitted",
    "status_updated_at",
    "received_date",
    "researched_date",
    "submitted_license_date",
    "license_received_date",
    "completed_date",
    "archived_date",
    "renewal_started_date",
    "renewal_submitted_date",
    "renewal_received_date"
  ];
  const normalizedUpdates = { ...updates };
  timestampFields.forEach(field => {
    if (field in normalizedUpdates) normalizedUpdates[field] = dateTimeValue(normalizedUpdates[field]);
  });
  ["requests", "openRequests", "activeRegistrations", "archivedRequests"].forEach(listName => {
    const row = state.data[listName].find(item => item.request_id === requestId);
    if (row) Object.assign(row, normalizedUpdates);
  });
}

function collectResearchPayload(row = {}) {
  const payload = {
    license_category: row.license_category || "",
    license_action: row.license_action || "",
    bond_type: row.bond_type || "",
    coi_type: row.coi_type || "",
    payment_status: row.payment_status || "",
    payment_method: row.payment_method || "",
    documents_included: row.documents_included || "",
    submission_method: row.submission_method || "",
    research_notes: row.research_notes || ""
  };
  const selectedByField = {};
  document.querySelectorAll("[data-research-field].selected").forEach(button => {
    const field = button.dataset.researchField;
    if (!selectedByField[field]) selectedByField[field] = [];
    selectedByField[field].push(button.dataset.researchValue);
  });
  Object.keys(selectedByField).forEach(field => {
    payload[field] = selectedByField[field].join("|");
  });
  const notes = document.querySelector("[data-research-notes]");
  if (notes) payload.research_notes = notes.value.trim();
  return payload;
}

function collectLicensePayload() {
  const payload = collectProtectedFieldPayload();
  payload.license_type_name = payload.received_license_name || "";
  payload.license_number = payload.license_number || "";
  payload.expiration = payload.expiration || "";
  return payload;
}

function collectProtectedFieldPayload() {
  const payload = {};
  document.querySelectorAll("[data-license-field]").forEach(field => {
    payload[field.dataset.licenseField] = field.value.trim();
  });
  document.querySelectorAll("[data-license-choice].selected").forEach(button => {
    payload[button.dataset.licenseChoice] = button.dataset.licenseValue;
  });
  document.querySelectorAll("input[type='radio'][data-license-choice]:checked").forEach(input => {
    payload[input.dataset.licenseChoice] = input.dataset.licenseValue;
  });
  return payload;
}

function expiredCount() {
  return state.data.activeRegistrations.filter(row => {
    const date = new Date(row.expiration);
    if (Number.isNaN(date.getTime())) return false;
    return date < new Date(`${TODAY}T00:00:00`);
  }).length;
}

function renewalCount() {
  return state.data.activeRegistrations.filter(row => String(row.status || "").toLowerCase().includes("renewal") || String(row.stage || "").toLowerCase().includes("renewal")).length;
}

function expirationWindowCount(minDays, maxDays) {
  return state.data.activeRegistrations.filter(row => {
    const date = new Date(row.expiration);
    if (Number.isNaN(date.getTime())) return false;
    const days = (date - new Date(TODAY)) / 86400000;
    return days >= minDays && days <= maxDays;
  }).length;
}

async function loadData(showLoading = true) {
  if (showLoading) setStatus("Refreshing...");
  state.loading = true;
  try {
    const response = await jsonp({ action: "getRegistrations" });
    if (!response || !response.ok) throw new Error(response && response.error ? response.error : "Registrations sheet request failed");
    normalizeRows(response);
    setStatus("Ready");
  } catch (error) {
    setStatus("Sheet failed");
    toast(error.message || "Registrations sheet request failed");
  } finally {
    state.loading = false;
    render();
  }
}

els.tabs.forEach(tab => tab.addEventListener("click", () => setPage(tab.dataset.page)));
els.refresh.addEventListener("click", () => loadData(true));
loadData(true);
