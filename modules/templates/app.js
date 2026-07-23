const state = {
  selectedId: "87249bff-0579-42bf-b78f-a18efdf4303f",
  filters: { trade: "All trades", supplier: "All suppliers", sort: "Name A-Z", search: "", quick: "all" },
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
    item("IKO DYNASTY CLASS 3", "", "SHINGLE Â· Coverage 1 SQ"),
    item("IKO CAMBRIDGE", "", "SHINGLE Â· Coverage 1 SQ"),
    item("IKO HIP & RIDGE 12", "", "HIP AND RIDGE SHINGLES Â· Coverage 30 LF"),
    item("IKO 7\" STARTER 123' PER BUNDLE", "BDL", "ROOFING STARTER Â· Coverage 105 LF Â· Include rakes"),
    item("ICE & WATER ALCO GRANULATED 2 SQ NOT BOX", "ROLL", "ICE AND WATER Â· Coverage 60 LF"),
    item("VB DEFENDER SYNTHETIC UNDERLAYMENT 10 SQ", "ROLL", "FELT Â· Coverage 9 SQ Â· Pitch 2/12â€“99/12"),
    item("T-DRIP 1.75\" Q/E", "", "DRIP EDGES Â· Coverage 10 LF Â· Using gutter apron"),
    item("Q/E GUTTER APRON", "", "GUTTER APRON Â· Coverage 10 LF"),
    item("AIRHAWK VENT SLA SLANT"),
    item("SHINGLEVENT II 4' BLACK", "PC", "RIDGE VENTS Â· Coverage 4 LF"),
    item("BROAN ROOF CAP VENTS #636B", "EACH"),
    item("BROAN ROOF CAP VENTS #634K", "EACH"),
    item("3\" LEAD STACK ADJUSTABLE", "EACH"),
    item("4\" LEAD STACK ADJUSTABLE", "EACH"),
    item("5\" LEAD STACK ADJUSTABLE", "EACH"),
    item("PIPE BOOT THERMO PLASTIC"),
    item("COIL NAIL 1-1/4\"", "EACH", "NAILS Â· Coverage 15 SQ"),
    item("PLASTIC CAP NAIL 1-1/4\" 2M/CTN", "BOX", "CAP NAILS Â· Coverage 20 SQ"),
    item("OSI QUAD SEALANT #", "", "ROOFING CAULK Â· Coverage 15 SQ"),
    item("Q/E SPRAY PAINT", "", "ROOFING SPRAY PAINT Â· Coverage 20 EA"),
    item("W-VALLEY 18\"X10'", "", "VALLEY METAL Â· Coverage 10 LF"),
    item("QA C24 COIL .024 #"),
    item("OSB 4X8 7/16", "SHT"),
    item("QUARRIX SMART PLUG PART 8\" #99008", "EACH"),
    item("STEP FLASHING", "", "STEP FLASHING Â· Coverage 55 LF"),
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
const pricingState = {
  overrides: new Map(),
  overridesLoaded: false,
  overridesError: "",
  index: null
};

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

function normalizeMatchValue(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeUom(value) {
  const normalized = normalizeMatchValue(value);
  const aliases = {
    ea: "each", each: "each", pc: "each", piece: "each",
    bdl: "bundle", bundle: "bundle", bx: "box", box: "box",
    rl: "roll", roll: "roll", sht: "sheet", sheet: "sheet",
    sq: "square", square: "square", qt: "quantity"
  };
  return aliases[normalized] || normalized;
}

function pricingRows() {
  try {
    const source = window.parent !== window
      ? window.parent.CITADEL_PRICING_DATA
      : window.CITADEL_PRICING_DATA;
    return Array.isArray(source?.rows) ? source.rows : [];
  } catch (error) {
    return [];
  }
}

function matchTokens(value) {
  const ignored = new Set([
    "the", "and", "with", "per", "each", "piece", "pieces", "bundle", "roll", "box",
    "square", "squares", "feet", "inch", "inches", "class", "product", "roofing",
    "siding", "coverage", "color"
  ]);
  return normalizeMatchValue(value).split(" ")
    .filter(token => token.length > 2 && !ignored.has(token) && !/^\d+$/.test(token));
}

function pricingIndex() {
  if (pricingState.index) return pricingState.index;
  const exact = new Map();
  const token = new Map();
  pricingRows().forEach(row => {
    [row.elite_product_name, row.item_final, row.item_number, row.item].forEach(value => {
      const key = normalizeMatchValue(value);
      if (!key) return;
      if (!exact.has(key)) exact.set(key, []);
      exact.get(key).push(row);
    });
    matchTokens(row.elite_product_name).forEach(value => {
      if (!token.has(value)) token.set(value, []);
      token.get(value).push(row);
    });
  });
  pricingState.index = { exact, token };
  return pricingState.index;
}

function templateState(record) {
  const text = `${record?.supplierLocation || ""} ${record?.name || ""}`.toUpperCase();
  const stateNames = {
    ARIZONA: "AZ", ILLINOIS: "IL", INDIANA: "IN", MINNESOTA: "MN", MISSOURI: "MO",
    "NEW MEXICO": "NM", OHIO: "OH", OKLAHOMA: "OK", PENNSYLVANIA: "PA", WISCONSIN: "WI"
  };
  const fullName = Object.keys(stateNames).find(name => text.includes(name));
  if (fullName) return stateNames[fullName];
  const abbreviation = text.match(/(?:^|[\s,/-])(AZ|IL|IN|MN|MO|NM|OH|OK|PA|WI)(?:$|[\s,/-])/);
  return abbreviation ? abbreviation[1] : "";
}

function supplierCode(value) {
  const supplier = normalizeMatchValue(value);
  if (supplier.includes("richards")) return "rbs";
  if (supplier.includes("srs")) return "srs";
  if (supplier.includes("abc")) return "abc";
  if (supplier.includes("beacon")) return "beacon";
  return supplier;
}

function lineKey(record, lineType, line) {
  return [record.id, lineType, normalizeMatchValue(line.name), normalizeUom(line.uom)].join("|");
}

function moneyValue(value) {
  const cleaned = String(value == null ? "" : value).replace(/[$,\s]/g, "");
  if (!cleaned) return null;
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
}

function formatMoney(value) {
  return Number(value).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function materialPriceMatch(record, line) {
  const name = normalizeMatchValue(line.name);
  if (!name) return { status: "missing", candidates: [] };
  const index = pricingIndex();
  let candidates = (index.exact.get(name) || []).slice();
  let matchMethod = "Exact product";
  if (!candidates.length) {
    const templateTokens = new Set(matchTokens(line.name));
    const possible = new Set();
    templateTokens.forEach(value => (index.token.get(value) || []).forEach(row => possible.add(row)));
    candidates = [...possible].filter(row => {
      const productTokens = matchTokens(row.elite_product_name);
      const brand = normalizeMatchValue(row.brand);
      const brandMatches = !brand || brand === "gen" || templateTokens.has(brand);
      return brandMatches && productTokens.length > 0 && productTokens.length <= 5 &&
        productTokens.every(value => templateTokens.has(value));
    });
    matchMethod = "Product name + brand";
  }
  if (!candidates.length) return { status: "missing", candidates: [] };

  const stateCode = templateState(record);
  const stateMatches = stateCode ? candidates.filter(row => String(row.state || "").toUpperCase() === stateCode) : [];
  if (stateMatches.length) candidates = stateMatches;

  const supplier = supplierCode(record.supplier);
  const supplierMatches = supplier ? candidates.filter(row => supplierCode(row.supplier) === supplier) : [];
  if (supplierMatches.length) candidates = supplierMatches;

  const uom = normalizeUom(line.uom);
  const uomMatches = uom ? candidates.filter(row => normalizeUom(row.uom) === uom) : [];
  if (uomMatches.length) candidates = uomMatches;

  const prices = [...new Set(candidates.map(row => moneyValue(row.price)).filter(value => value !== null))];
  if (!prices.length) return { status: "missing", candidates };
  if (prices.length === 1) {
    const match = candidates.find(row => moneyValue(row.price) === prices[0]) || candidates[0];
    return {
      status: "matched",
      price: prices[0],
      candidates,
      matchMethod,
      matchKey: String(match.item_final || match.item_number || match.item || match.elite_product_name || "")
    };
  }
  return { status: "varies", candidates, prices, matchMethod };
}

function resolvedLinePrice(record, lineType, line) {
  const key = lineKey(record, lineType, line);
  const override = pricingState.overrides.get(key);
  if (override && moneyValue(override.manual_price) !== null) {
    return { key, price: moneyValue(override.manual_price), source: "Manual override", status: "override", override };
  }
  const match = materialPriceMatch(record, line);
  if (match.status === "matched") return { key, price: match.price, source: "Material Pricing", ...match };
  if (match.status === "varies") return { key, price: null, source: "Color-dependent", ...match };
  return { key, price: null, source: "Needs price", ...match };
}

function templatesApi(action, params = {}) {
  try {
    if (window.parent === window || !window.parent.CITADEL_API_URL || !window.parent.jsonp) {
      return Promise.reject(new Error("Protected pricing service is unavailable."));
    }
    const query = new URLSearchParams({ action, ...params }).toString();
    const url = `${window.parent.CITADEL_API_URL}?${query}`;
    const securedUrl = window.parent.citadelAuthQuery ? window.parent.citadelAuthQuery(url) : url;
    return window.parent.jsonp(securedUrl).then(response => {
      if (!response?.ok) throw new Error(response?.error || "Pricing request failed.");
      return response.data;
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

function loadTemplatePriceOverrides() {
  templatesApi("getTemplatePriceOverrides")
    .then(rows => {
      pricingState.overrides = new Map((rows || []).map(row => [String(row.line_key || ""), row]));
      pricingState.overridesLoaded = true;
      pricingState.overridesError = "";
      render();
    })
    .catch(error => {
      pricingState.overridesLoaded = true;
      pricingState.overridesError = error.message || "Manual overrides are unavailable.";
      render();
    });
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

function recordLineCount(record) {
  return (record.customMaterials || []).length + (record.materials || []).length + (record.labor || []).length;
}

function recordCreatedDate(record) {
  const [month, day, year] = String(record.created || "").split("/").map(Number);
  if (!month || !day || !year) return null;
  return new Date(year < 100 ? 2000 + year : year, month - 1, day);
}

function isRecentlyAdded(record) {
  const created = recordCreatedDate(record);
  if (!created) return false;
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setHours(0, 0, 0, 0);
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  return created >= ninetyDaysAgo;
}

function matchesQuickFilter(record, quick) {
  if (quick === "recent") return isRecentlyAdded(record);
  if (quick === "ready") return recordLineCount(record) > 0;
  if (quick === "review") return recordLineCount(record) === 0;
  return true;
}

function visibleRecords() {
  const { trade, supplier, sort, quick } = state.filters;
  const search = state.filters.search.trim().toLowerCase();
  const records = state.records.filter(record =>
    matchesQuickFilter(record, quick) &&
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

function metric(action, label, value, caption, active = false) {
  return `<button class="metric${active ? " active" : ""}" type="button" data-metric-action="${escapeHtml(action)}" aria-pressed="${active}" aria-label="${escapeHtml(`${label}: ${value}. ${caption}`)}">
    <span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(caption)}</small>
  </button>`;
}

function detailSection(id, title, lines, record, lineType = "", priceable = false) {
  const items = lines || [];
  return `<section class="detail-section" id="${escapeHtml(id)}">
    <header><h3>${escapeHtml(title)}</h3><span>${items.length} items</span></header>
    ${items.length ? `<div class="line-list">${items.map(line => {
      const resolved = priceable ? resolvedLinePrice(record, lineType, line) : null;
      return `<article class="line-item">
        <div><strong>${escapeHtml(line.name)}</strong>${line.rules ? `<p>${escapeHtml(line.rules)}</p>` : ""}</div>
        <div class="line-values">
          <span class="line-uom">${escapeHtml(line.uom || "â€”")}</span>
          ${priceable ? `<button class="line-price ${escapeHtml(resolved.status)}" type="button"
            data-price-key="${escapeHtml(resolved.key)}" data-line-type="${escapeHtml(lineType)}"
            data-product-name="${escapeHtml(line.name)}" data-uom="${escapeHtml(line.uom || "")}">
            <strong>${resolved.price === null ? (resolved.status === "varies" ? "Varies" : "Add price") : formatMoney(resolved.price)}</strong>
            <small>${escapeHtml(resolved.source)}</small>
          </button>` : ""}
        </div>
      </article>`;
    }).join("")}</div>` : `<p class="empty">No ${escapeHtml(title.toLowerCase())} included.</p>`}
  </section>`;
}

function render() {
  const visible = visibleRecords();
  const selected = selectedRecord(visible);
  const recentCount = state.records.filter(isRecentlyAdded).length;
  const readyCount = state.records.filter(record => recordLineCount(record) > 0).length;
  const reviewCount = state.records.length - readyCount;
  app.innerHTML = `
    <div class="status-line"><span class="status-pill">${state.records.length} detailed template records available</span></div>
    <section class="metrics">
      ${metric("all", "Templates", state.records.length, "All templates", state.filters.quick === "all")}
      ${metric("recent", "Recently Added", recentCount, "Created in the last 90 days", state.filters.quick === "recent")}
      ${metric("ready", "Ready to Use", readyCount, "Includes template line items", state.filters.quick === "ready")}
      ${metric("review", "Needs Review", reviewCount, "No line items included", state.filters.quick === "review")}
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
          const lineCount = recordLineCount(record);
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
            ${pricingState.overridesError ? `<p class="pricing-warning">${escapeHtml(pricingState.overridesError)}</p>` : ""}
            ${detailSection("template-custom-materials", "Custom Materials", selected.customMaterials, selected, "custom-material", true)}
            ${detailSection("template-materials", "Supplier Products", selected.materials, selected, "supplier-product", true)}
            ${detailSection("template-labor", "Labor", selected.labor, selected, "labor", false)}
          </div>` : `<p class="empty">No template selected.</p>`}
      </aside>
    </div>`;
}

function openPriceModal(button) {
  const record = state.records.find(item => item.id === state.selectedId);
  if (!record) return;
  const lineType = button.dataset.lineType;
  const productName = button.dataset.productName;
  const uom = button.dataset.uom || "";
  const lines = lineType === "custom-material" ? record.customMaterials : record.materials;
  const line = (lines || []).find(item => item.name === productName && String(item.uom || "") === uom);
  if (!line) return;

  const resolved = resolvedLinePrice(record, lineType, line);
  const currentOverride = pricingState.overrides.get(resolved.key);
  const automaticText = resolved.status === "matched"
    ? `${formatMoney(resolved.price)} from Material Pricing`
    : resolved.status === "varies"
      ? `${resolved.prices.length} color-dependent prices found`
      : "No exact Material Pricing match";
  const modal = document.createElement("div");
  modal.className = "modal-backdrop";
  modal.innerHTML = `<section class="modal price-modal" role="dialog" aria-modal="true" aria-label="Product price">
    <header><div><h2>Product Price</h2><p>${escapeHtml(productName)}</p></div><button type="button" data-close aria-label="Close">X</button></header>
    <form class="modal-body" data-price-form>
      <div class="price-source-summary"><span>Automatic result</span><strong>${escapeHtml(automaticText)}</strong></div>
      <label>Manual override
        <input name="manual_price" inputmode="decimal" placeholder="0.00" value="${escapeHtml(currentOverride?.manual_price ?? "")}">
      </label>
      <label>Reason
        <textarea name="reason" rows="3" placeholder="Why is this price different?">${escapeHtml(currentOverride?.reason || "")}</textarea>
      </label>
      <p class="form-message" aria-live="polite"></p>
      <div class="modal-actions">
        ${currentOverride ? `<button class="secondary" type="button" data-clear-price>Use Material Pricing</button>` : ""}
        <button class="secondary" type="button" data-close>Cancel</button>
        <button class="primary" type="submit">Save Override</button>
      </div>
    </form>
  </section>`;

  const close = () => modal.remove();
  const save = clearOverride => {
    const form = modal.querySelector("[data-price-form]");
    const message = form.querySelector(".form-message");
    const saveButton = form.querySelector('[type="submit"]');
    const price = form.elements.manual_price.value;
    const numericPrice = Number(price.replace(/[$,\s]/g, ""));
    if (!clearOverride && (!price.trim() || !Number.isFinite(numericPrice) || numericPrice < 0)) {
      message.textContent = "Enter a valid price.";
      return;
    }
    saveButton.disabled = true;
    message.textContent = "Saving protected override...";
    templatesApi("saveTemplatePriceOverride", {
      template_id: record.id,
      template_name: record.name,
      line_type: lineType,
      line_key: resolved.key,
      product_name: line.name,
      uom: line.uom || "",
      manual_price: price,
      reason: form.elements.reason.value,
      source_match_key: resolved.matchKey || "",
      clear_override: clearOverride ? "true" : "false"
    }).then(saved => {
      if (clearOverride || !saved?.active) pricingState.overrides.delete(resolved.key);
      else pricingState.overrides.set(resolved.key, saved);
      close();
      render();
    }).catch(error => {
      saveButton.disabled = false;
      message.textContent = error.message || "Unable to save the override.";
    });
  };

  modal.addEventListener("click", event => {
    if (event.target === modal || event.target.closest("[data-close]")) close();
    if (event.target.closest("[data-clear-price]")) save(true);
  });
  modal.querySelector("[data-price-form]").addEventListener("submit", event => {
    event.preventDefault();
    save(false);
  });
  document.body.appendChild(modal);
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
  if (["all", "recent", "ready", "review"].includes(action)) {
    state.filters.quick = action;
    state.filters.trade = "All trades";
    state.filters.supplier = "All suppliers";
    state.filters.search = "";
    render();
    scrollToSection("template-records");
  }
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
  const priceButton = event.target.closest("[data-price-key]");
  if (priceButton) {
    openPriceModal(priceButton);
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
loadTemplatePriceOverrides();

