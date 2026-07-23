const state = {
  selectedId: "87249bff-0579-42bf-b78f-a18efdf4303f",
  filters: { trade: "All trades", supplier: "All suppliers", sort: "Name A-Z", search: "" },
  records: []
};

const preview = {
  id: "87249bff-0579-42bf-b78f-a18efdf4303f",
  name: "Richard's - St. Louis - 2026",
  supplier: "Richards Building Supply",
  supplierLocation: "Richards - St. Louis",
  trade: "ROOFING",
  created: "12/17/24",
  blazeUrl: "https://blaze-crm.com/64daaf06-5043-4886-b9a2-1362e47b0b65/tool-dashboard/order-templates/87249bff-0579-42bf-b78f-a18efdf4303f",
  instructions: "***STRUCTURE 1 & STRUCTURE 2 ROOF***\n- Set up property protection.\n- Remove existing shingles and underlayment to decking.\n- Install drip edge and gutter apron, ice and water shield, synthetic felt, vents, flashing, starter shingles, IKO Dynasty shingles, and hip and ridge shingles.\n- Paint exposed pipes, boots, and flashing; seal as necessary; clean all job-related debris.",
  customMaterials: [item("ZIPPER BOOT", "EA")],
  materials: [
    item("IKO DYNASTY CLASS 3", "", "SHINGLE · Coverage 1 SQ"),
    item("IKO CAMBRIDGE", "", "SHINGLE · Coverage 1 SQ"),
    item("IKO HIP & RIDGE 12", "", "HIP AND RIDGE SHINGLES · Coverage 30 LF"),
    item("IKO 7\" STARTER 123' PER BUNDLE", "BDL", "ROOFING STARTER · Coverage 105 LF · Include rakes"),
    item("ICE & WATER ALCO GRANULATED 2 SQ NOT BOX", "ROLL", "ICE AND WATER · Coverage 60 LF"),
    item("VB DEFENDER SYNTHETIC UNDERLAYMENT 10 SQ", "ROLL", "FELT · Coverage 9 SQ · Pitch 2/12–99/12"),
    item("T-DRIP 1.75\" Q/E", "", "DRIP EDGES · Coverage 10 LF · Using gutter apron"),
    item("Q/E GUTTER APRON", "", "GUTTER APRON · Coverage 10 LF"),
    item("AIRHAWK VENT SLA SLANT"),
    item("SHINGLEVENT II 4' BLACK", "PC", "RIDGE VENTS · Coverage 4 LF"),
    item("BROAN ROOF CAP VENTS #636B", "EACH"),
    item("BROAN ROOF CAP VENTS #634K", "EACH"),
    item("3\" LEAD STACK ADJUSTABLE", "EACH"),
    item("4\" LEAD STACK ADJUSTABLE", "EACH"),
    item("5\" LEAD STACK ADJUSTABLE", "EACH"),
    item("PIPE BOOT THERMO PLASTIC"),
    item("COIL NAIL 1-1/4\"", "EACH", "NAILS · Coverage 15 SQ"),
    item("PLASTIC CAP NAIL 1-1/4\" 2M/CTN", "BOX", "CAP NAILS · Coverage 20 SQ"),
    item("OSI QUAD SEALANT #", "", "ROOFING CAULK · Coverage 15 SQ"),
    item("Q/E SPRAY PAINT", "", "ROOFING SPRAY PAINT · Coverage 20 EA"),
    item("W-VALLEY 18\"X10'", "", "VALLEY METAL · Coverage 10 LF"),
    item("QA C24 COIL .024 #"),
    item("OSB 4X8 7/16", "SHT"),
    item("QUARRIX SMART PLUG PART 8\" #99008", "EACH"),
    item("STEP FLASHING", "", "STEP FLASHING · Coverage 55 LF"),
    item("DECK MOUNT SKYLIGHT RO"),
    item("EDL DECK MOUNT RO -")
  ],
  labor: [
    item("REMOVE & REPLACE ROOFING", "SQ", "Coverage 1 SQ"),
    item("DUMP FEE", "EA"),
    item("REMOVE 2ND LAYER", "SQ"),
    item("REPLACE DECKING (PER SHEET)", "EA")
  ]
};

state.records = Array.isArray(window.CITADEL_TEMPLATE_DATA) && window.CITADEL_TEMPLATE_DATA.length
  ? window.CITADEL_TEMPLATE_DATA
  : [preview];
state.selectedId = state.records[0]?.id || "";

const app = document.querySelector("#app");
let searchTimer = 0;
let themeObserver = null;

function item(name, uom = "", rules = "") {
  return { name, uom, rules };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme === "dark" ? "dark" : "light";
}

function initializeTheme() {
  try {
    if (window.parent !== window) {
      const shell = window.parent.document.body;
      applyTheme(shell.dataset.theme);
      themeObserver = new MutationObserver(() => applyTheme(shell.dataset.theme));
      themeObserver.observe(shell, { attributes: true, attributeFilter: ["data-theme"] });
      return;
    }
    applyTheme(localStorage.getItem("citadel-theme") || "light");
  } catch (error) {
    applyTheme("light");
  }
}

function facetValues(key) {
  return [...new Set(state.records.map(record => record[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function optionList(allLabel, values, selected) {
  return [allLabel, ...values].map(value =>
    `<option${value === selected ? " selected" : ""}>${escapeHtml(value)}</option>`
  ).join("");
}

function recordSearchText(record) {
  return [
    record.name, record.supplier, record.supplierLocation, record.trade, record.created,
    ...(record.customMaterials || []).flatMap(line => [line.name, line.rules]),
    ...(record.materials || []).flatMap(line => [line.name, line.rules]),
    ...(record.labor || []).flatMap(line => [line.name, line.rules])
  ].join(" ").toLowerCase();
}

function visibleRecords() {
  const { trade, supplier, sort } = state.filters;
  const search = state.filters.search.trim().toLowerCase();
  const records = state.records.filter(record =>
    (trade === "All trades" || record.trade === trade) &&
    (supplier === "All suppliers" || record.supplier === supplier) &&
    (!search || recordSearchText(record).includes(search))
  );
  records.sort((a, b) => {
    if (sort === "Supplier A-Z") return (a.supplier || "").localeCompare(b.supplier || "");
    if (sort === "Newest created") return new Date(b.created) - new Date(a.created);
    return (a.name || "").localeCompare(b.name || "");
  });
  return records;
}

function selectedRecord(visible) {
  return state.records.find(record => record.id === state.selectedId) || visible[0] || null;
}

function metric(action, label, value, caption) {
  return `<button class="metric" type="button" data-metric-action="${escapeHtml(action)}" aria-label="${escapeHtml(`${label}: ${value}. ${caption}`)}">
    <span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(caption)}</small>
  </button>`;
}

function detailSection(id, title, lines) {
  const items = lines || [];
  return `<section class="detail-section" id="${escapeHtml(id)}">
    <header><h3>${escapeHtml(title)}</h3><span>${items.length} items</span></header>
    ${items.length ? `<div class="line-list">${items.map(line => `
      <article class="line-item">
        <div><strong>${escapeHtml(line.name)}</strong>${line.rules ? `<p>${escapeHtml(line.rules)}</p>` : ""}</div>
        <span>${escapeHtml(line.uom || "—")}</span>
      </article>`).join("")}</div>` : `<p class="empty">No ${escapeHtml(title.toLowerCase())} included.</p>`}
  </section>`;
}

function render() {
  const visible = visibleRecords();
  const selected = selectedRecord(visible);
  const materialCount = selected ? (selected.customMaterials || []).length + (selected.materials || []).length : 0;
  app.innerHTML = `
    <div class="status-line"><span class="status-pill">${state.records.length} detailed template records available</span></div>
    <section class="metrics">
      ${metric("templates", "Templates", state.records.length, "Indexed from Blaze")}
      ${metric("materials", "Materials", materialCount, "Selected template")}
      ${metric("labor", "Labor Items", selected ? (selected.labor || []).length : 0, "Selected template")}
      ${metric("trade", "Trade", selected?.trade || "Not set", "Selected template")}
    </section>
    <section class="filter-card">
      <div><h2>Filters + Sort + Search</h2><p>Search template names, suppliers, materials, product rules, and labor lines.</p></div>
      <button class="primary" type="button" data-report>Reports</button>
      <div class="filters">
        <label>Trade<select data-filter="trade">${optionList("All trades", facetValues("trade"), state.filters.trade)}</select></label>
        <label>Supplier<select data-filter="supplier">${optionList("All suppliers", facetValues("supplier"), state.filters.supplier)}</select></label>
        <label>Sort<select data-filter="sort">
          <option${state.filters.sort === "Name A-Z" ? " selected" : ""}>Name A-Z</option>
          <option${state.filters.sort === "Supplier A-Z" ? " selected" : ""}>Supplier A-Z</option>
          <option${state.filters.sort === "Newest created" ? " selected" : ""}>Newest created</option>
        </select></label>
        <label>Search<input type="search" data-filter="search" placeholder="Search templates and line items" value="${escapeHtml(state.filters.search)}"></label>
      </div>
    </section>
    <div class="workspace">
      <section class="records" id="template-records">
        <header class="section-head"><div><h2>Order Templates</h2><p>Template-level information with complete material and labor detail.</p></div><strong>${visible.length} showing</strong></header>
        <div class="table-head"><span>Template</span><span>Trade</span><span>Supplier</span><span>Location</span><span>Created</span><span>Lines</span></div>
        ${visible.length ? visible.map(record => {
          const lineCount = (record.customMaterials || []).length + (record.materials || []).length + (record.labor || []).length;
          return `<button class="template-row${record.id === selected?.id ? " active" : ""}" type="button" data-template-id="${escapeHtml(record.id)}">
            <span><strong>${escapeHtml(record.name)}</strong></span><span>${escapeHtml(record.trade)}</span>
            <span>${escapeHtml(record.supplier)}</span><span>${escapeHtml(record.supplierLocation)}</span>
            <span>${escapeHtml(record.created)}</span><span>${lineCount}</span>
          </button>`;
        }).join("") : `<p class="empty">No templates match these filters.</p>`}
      </section>
      <aside class="detail">
        ${selected ? `
          <header class="detail-head"><h2>${escapeHtml(selected.name)}</h2><p>${escapeHtml([selected.trade, selected.supplierLocation].filter(Boolean).join(" / "))}</p></header>
          <div class="detail-body">
            <div class="detail-grid">
              <article><span>Supplier</span><strong>${escapeHtml(selected.supplier || "Not set")}</strong></article>
              <article><span>Location</span><strong>${escapeHtml(selected.supplierLocation || "Not set")}</strong></article>
              <article><span>Trade</span><strong>${escapeHtml(selected.trade || "Not set")}</strong></article>
              <article><span>Created</span><strong>${escapeHtml(selected.created || "Not set")}</strong></article>
            </div>
            <section class="detail-section">
              <header><h3>Template Instructions</h3><a href="${escapeHtml(selected.blazeUrl)}" target="_blank" rel="noopener">Open in Blaze</a></header>
              <p class="instructions">${escapeHtml(selected.instructions || "No instructions included.")}</p>
            </section>
            ${detailSection("template-custom-materials", "Custom Materials", selected.customMaterials)}
            ${detailSection("template-materials", "Supplier Products", selected.materials)}
            ${detailSection("template-labor", "Labor", selected.labor)}
          </div>` : `<p class="empty">No template selected.</p>`}
      </aside>
    </div>`;
}

function openReportModal() {
  const visible = visibleRecords();
  const selected = selectedRecord(visible);
  const modal = document.createElement("div");
  modal.className = "modal-backdrop";
  modal.innerHTML = `<section class="modal" role="dialog" aria-modal="true" aria-label="Templates Reports">
    <header><div><h2>Templates Reports</h2><p>Current template filters and selected-detail summary.</p></div><button type="button" data-close aria-label="Close">X</button></header>
    <div class="modal-body">
      <div class="report-summary">
        <article><strong>${visible.length}</strong><span>Templates</span></article>
        <article><strong>${selected ? (selected.materials || []).length + (selected.customMaterials || []).length : 0}</strong><span>Material lines</span></article>
        <article><strong>${selected ? (selected.labor || []).length : 0}</strong><span>Labor lines</span></article>
      </div>
      <p>The complete exporter will be connected when all Blaze templates are imported into the protected template source.</p>
    </div>
    <footer><button class="secondary" type="button" data-close>Done</button></footer>
  </section>`;
  modal.addEventListener("click", event => {
    if (event.target === modal || event.target.closest("[data-close]")) modal.remove();
  });
  document.body.appendChild(modal);
}

function scrollToSection(id) {
  requestAnimationFrame(() => {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function activateMetric(action) {
  const selected = selectedRecord(visibleRecords());
  if (action === "templates") {
    state.filters.trade = "All trades";
    state.filters.supplier = "All suppliers";
    state.filters.search = "";
    render();
    scrollToSection("template-records");
    return;
  }
  if (action === "trade") {
    if (selected?.trade) state.filters.trade = selected.trade;
    render();
    scrollToSection("template-records");
    return;
  }
  if (action === "materials") {
    const target = selected?.customMaterials?.length ? "template-custom-materials" : "template-materials";
    scrollToSection(target);
    return;
  }
  if (action === "labor") scrollToSection("template-labor");
}

app.addEventListener("click", event => {
  const metricButton = event.target.closest("[data-metric-action]");
  if (metricButton) {
    activateMetric(metricButton.dataset.metricAction);
    return;
  }
  if (event.target.closest("[data-report]")) {
    openReportModal();
    return;
  }
  const row = event.target.closest("[data-template-id]");
  if (!row) return;
  state.selectedId = row.dataset.templateId;
  render();
});

app.addEventListener("change", event => {
  const field = event.target.closest("select[data-filter]");
  if (!field) return;
  state.filters[field.dataset.filter] = field.value;
  render();
});

app.addEventListener("input", event => {
  const field = event.target.closest('input[data-filter="search"]');
  if (!field) return;
  state.filters.search = field.value;
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    render();
    const next = app.querySelector('input[data-filter="search"]');
    if (next) {
      next.focus();
      next.setSelectionRange(next.value.length, next.value.length);
    }
  }, 180);
});

initializeTheme();
render();
