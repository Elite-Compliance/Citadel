const app = document.querySelector("#app");

const state = {
  data: window.CITADEL_ORDER_DATA || { orders: [], lines: [], exceptions: [], metrics: {}, importStatus: null },
  loading: true,
  error: "",
  selectedOrderId: "",
  quickFilter: "all",
  filters: {
    region: "All regions",
    status: "All statuses",
    trade: "All trades",
    supplier: "All suppliers",
    pricing: "All pricing results",
    search: ""
  },
  sort: "Newest order",
  reportOpen: false
};

let searchTimer = 0;
let themeObserver = null;

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function numberValue(value) {
  const parsed = Number(String(value ?? "").replace(/[$,\s]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function money(value) {
  return numberValue(value).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function dateValue(value) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString("en-US");
}

function normalized(value) {
  return String(value || "").trim().toLowerCase();
}

function unique(field) {
  return [...new Set(state.data.orders.map(row => String(row[field] || "").trim()).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right));
}

function options(allLabel, values, selected) {
  return [allLabel, ...values].map(value =>
    `<option ${value === selected ? "selected" : ""}>${escapeHtml(value)}</option>`
  ).join("");
}

function orderLines(orderId) {
  return state.data.lines.filter(line => String(line.order_id || "") === String(orderId || ""));
}

function orderSearchText(row) {
  return [
    row.job_number, row.customer, row.region, row.supplier, row.crew_name,
    row.trade, row.order_status, row.comparison_status, row.order_number
  ].join(" ").toLowerCase();
}

function pricingGroup(row) {
  const status = normalized(row.comparison_status);
  if (status.includes("review") || status.includes("unmatched") || status.includes("missing")) return "Needs review";
  if (numberValue(row.material_variance) > 0) return "Material overpayment";
  if (numberValue(row.labor_variance) > 0) return "Labor overpayment";
  if (status.includes("exception") || status.includes("overpay")) return "Pricing exception";
  if (status.includes("matched") || status.includes("ready") || status.includes("within")) return "Within pricing";
  return "Not compared";
}

function filteredOrders() {
  const filters = state.filters;
  const search = normalized(filters.search);
  let rows = state.data.orders.filter(row => {
    if (filters.region !== "All regions" && String(row.region || "") !== filters.region) return false;
    if (filters.status !== "All statuses" && String(row.order_status || "") !== filters.status) return false;
    if (filters.trade !== "All trades" && String(row.trade || "") !== filters.trade) return false;
    if (filters.supplier !== "All suppliers" && String(row.supplier || "") !== filters.supplier) return false;
    if (filters.pricing !== "All pricing results" && pricingGroup(row) !== filters.pricing) return false;
    if (search && !orderSearchText(row).includes(search)) return false;
    if (state.quickFilter === "exceptions" && !/exception|overpay/i.test(String(row.comparison_status || "")) && numberValue(row.material_variance) <= 0 && numberValue(row.labor_variance) <= 0) return false;
    if (state.quickFilter === "materials" && numberValue(row.material_variance) <= 0) return false;
    if (state.quickFilter === "labor" && numberValue(row.labor_variance) <= 0) return false;
    if (state.quickFilter === "review" && pricingGroup(row) !== "Needs review") return false;
    return true;
  });

  rows = rows.slice().sort((left, right) => {
    if (state.sort === "Largest variance") {
      return (numberValue(right.material_variance) + numberValue(right.labor_variance)) -
        (numberValue(left.material_variance) + numberValue(left.labor_variance));
    }
    if (state.sort === "Job number A-Z") return String(left.job_number || "").localeCompare(String(right.job_number || ""));
    if (state.sort === "Supplier A-Z") return String(left.supplier || "").localeCompare(String(right.supplier || ""));
    return String(right.ordered_at || right.order_created_at || "").localeCompare(String(left.ordered_at || left.order_created_at || ""));
  });
  return rows;
}

function calculatedMetrics() {
  const orders = state.data.orders;
  return {
    all: orders.length,
    exceptions: orders.filter(row => /exception|overpay/i.test(String(row.comparison_status || "")) || numberValue(row.material_variance) > 0 || numberValue(row.labor_variance) > 0).length,
    materials: orders.filter(row => numberValue(row.material_variance) > 0).length,
    labor: orders.filter(row => numberValue(row.labor_variance) > 0).length,
    review: orders.filter(row => pricingGroup(row) === "Needs review").length
  };
}

function metricButton(key, label, value, note) {
  return `<button class="metric ${state.quickFilter === key ? "active" : ""}" type="button" data-quick="${key}">
    <span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(note)}</small>
  </button>`;
}

function statusClass(row) {
  const variance = numberValue(row.material_variance) + numberValue(row.labor_variance);
  const group = pricingGroup(row);
  if (group === "Needs review") return "review";
  if (variance > 0) return "over";
  if (group === "Within pricing") return "good";
  return "neutral";
}

function renderTable(rows) {
  if (!rows.length) {
    return `<div class="empty-state">
      <strong>${state.data.orders.length ? "No orders match these filters." : "Orders import is ready for its first run."}</strong>
      <span>${state.data.orders.length ? "Change a filter or clear the search." : "The protected Orders tables are configured; imported 2026 Blaze orders will appear here."}</span>
    </div>`;
  }
  return `<div class="table-scroll">
    <table>
      <thead><tr>
        <th>Job</th><th>Region</th><th>Order Date</th><th>Status</th><th>Trade</th>
        <th>Supplier / Crew</th><th>Blaze Cost</th><th>Expected</th><th>Variance</th><th>Result</th>
      </tr></thead>
      <tbody>${rows.map(row => {
        const actual = numberValue(row.material_actual) + numberValue(row.labor_actual);
        const expected = numberValue(row.material_expected) + numberValue(row.labor_expected);
        const variance = numberValue(row.material_variance) + numberValue(row.labor_variance);
        const identity = row.order_id || row.job_id || row.job_number;
        return `<tr data-order-id="${escapeHtml(identity)}" tabindex="0">
          <td><strong>${escapeHtml(row.job_number || "No job number")}</strong><small>${escapeHtml(row.customer || row.order_number || "")}</small></td>
          <td>${escapeHtml(row.region || "Not set")}</td>
          <td>${escapeHtml(dateValue(row.ordered_at || row.order_created_at))}</td>
          <td>${escapeHtml(row.order_status || "Not set")}</td>
          <td>${escapeHtml(row.trade || "Not set")}</td>
          <td><strong>${escapeHtml(row.supplier || row.crew_name || "Not assigned")}</strong><small>${escapeHtml(row.crew_name && row.supplier ? row.crew_name : "")}</small></td>
          <td class="money">${money(actual)}</td>
          <td class="money">${money(expected)}</td>
          <td class="money ${variance > 0 ? "positive-variance" : variance < 0 ? "negative-variance" : ""}">${money(variance)}</td>
          <td><span class="result ${statusClass(row)}">${escapeHtml(pricingGroup(row))}</span></td>
        </tr>`;
      }).join("")}</tbody>
    </table>
  </div>`;
}

function renderOrderModal(order) {
  if (!order) return "";
  const lines = orderLines(order.order_id);
  return `<div class="modal-backdrop" data-close-modal>
    <section class="modal order-modal" role="dialog" aria-modal="true" aria-labelledby="orderModalTitle">
      <header>
        <div><small>Order comparison</small><h2 id="orderModalTitle">${escapeHtml(order.job_number || order.order_number || "Order")}</h2>
        <p>${escapeHtml([order.customer, order.region, order.trade].filter(Boolean).join(" · "))}</p></div>
        <button class="close" type="button" aria-label="Close order details" data-close-modal>×</button>
      </header>
      <div class="modal-body">
        <div class="order-summary">
          <span><small>Supplier</small><strong>${escapeHtml(order.supplier || "Not assigned")}</strong></span>
          <span><small>Crew</small><strong>${escapeHtml(order.crew_name || "Not assigned")}</strong></span>
          <span><small>Status</small><strong>${escapeHtml(order.order_status || "Not set")}</strong></span>
          <span><small>Delivery</small><strong>${escapeHtml(dateValue(order.delivery_date) || "Not set")}</strong></span>
        </div>
        <div class="line-table">
          <table>
            <thead><tr><th>Type</th><th>Item</th><th>UOM</th><th>Qty</th><th>Blaze Price</th><th>Master Price</th><th>Variance</th><th>Match</th></tr></thead>
            <tbody>${lines.length ? lines.map(line => `<tr>
              <td>${escapeHtml(line.line_type || "")}</td>
              <td><strong>${escapeHtml(line.item_name || "")}</strong><small>${escapeHtml([line.sku, line.color].filter(Boolean).join(" · "))}</small></td>
              <td>${escapeHtml(line.uom || "")}</td><td>${escapeHtml(line.quantity || "")}</td>
              <td class="money">${money(line.blaze_unit_price)}</td><td class="money">${money(line.master_unit_price)}</td>
              <td class="money ${numberValue(line.variance) > 0 ? "positive-variance" : ""}">${money(line.variance)}</td>
              <td><span class="result ${statusClass(line)}">${escapeHtml(line.comparison_status || "Not compared")}</span></td>
            </tr>`).join("") : `<tr><td colspan="8" class="no-lines">No imported line items are available for this order yet.</td></tr>`}</tbody>
          </table>
        </div>
      </div>
      <footer>
        ${order.job_url ? `<a class="secondary-button" href="${escapeHtml(order.job_url)}" target="_blank" rel="noopener">Open job in Blaze</a>` : ""}
        <button class="primary-button" type="button" data-close-modal>Done</button>
      </footer>
    </section>
  </div>`;
}

function reportModal(rows) {
  if (!state.reportOpen) return "";
  const totalActual = rows.reduce((sum, row) => sum + numberValue(row.material_actual) + numberValue(row.labor_actual), 0);
  const totalVariance = rows.reduce((sum, row) => sum + numberValue(row.material_variance) + numberValue(row.labor_variance), 0);
  return `<div class="modal-backdrop" data-close-report>
    <section class="modal report-modal" role="dialog" aria-modal="true" aria-labelledby="reportTitle">
      <header><div><h2 id="reportTitle">Orders Reports</h2><p>Export order status and pricing comparisons from the current view.</p></div>
        <button class="close" type="button" aria-label="Close reports" data-close-report>×</button></header>
      <div class="modal-body">
        <div class="report-note">Reports include protected order records and their master-pricing comparison.</div>
        <div class="quick-reports">
          <button type="button" data-report-quick="exceptions">Pricing Exceptions</button>
          <button type="button" data-report-quick="materials">Material Overpayments</button>
          <button type="button" data-report-quick="labor">Labor Overpayments</button>
          <button type="button" data-report-quick="review">Needs Review</button>
          <button type="button" data-report-quick="all">Current View</button>
        </div>
        <div class="report-summary"><span><strong>${rows.length}</strong> orders</span><span><strong>${money(totalActual)}</strong> Blaze cost</span><span><strong>${money(totalVariance)}</strong> variance</span></div>
      </div>
      <footer><button type="button" class="secondary-button" data-close-report>Cancel</button>
        <select data-export-format aria-label="Export format"><option>CSV</option><option>Excel</option><option>PDF</option></select>
        <button type="button" class="primary-button" data-export>Export</button></footer>
    </section>
  </div>`;
}

function render() {
  const rows = filteredOrders();
  const metrics = calculatedMetrics();
  const selected = state.data.orders.find(row => String(row.order_id || row.job_id || row.job_number) === String(state.selectedOrderId));
  const importStatus = state.data.importStatus;
  app.innerHTML = `
    <section class="orders-status">
      <span class="${state.error ? "error" : state.loading ? "loading" : "ready"}">
        ${state.error ? escapeHtml(state.error) : state.loading ? "Loading protected order data…" :
          importStatus ? `Last import: ${escapeHtml(importStatus.status || "Complete")} · ${escapeHtml(dateValue(importStatus.completed_at || importStatus.started_at))}` :
          "Protected Orders workspace ready"}
      </span>
    </section>
    <section class="metrics">
      ${metricButton("all", "All Orders", metrics.all, "2026 order records")}
      ${metricButton("exceptions", "Pricing Exceptions", metrics.exceptions, "Outside master pricing")}
      ${metricButton("materials", "Material Overpayments", metrics.materials, "Jobs over benchmark")}
      ${metricButton("labor", "Labor Overpayments", metrics.labor, "Jobs over labor pricing")}
      ${metricButton("review", "Needs Review", metrics.review, "Missing or uncertain matches")}
    </section>
    <section class="filters-card">
      <div class="section-heading"><div><h2>Filters + Sort + Search</h2><p>Review every region, supplier, crew, order stage, and pricing result in one place.</p></div>
        <button type="button" class="primary-button" data-open-report>Reports</button></div>
      <div class="filters">
        <label>Region<select data-filter="region">${options("All regions", unique("region"), state.filters.region)}</select></label>
        <label>Order Status<select data-filter="status">${options("All statuses", unique("order_status"), state.filters.status)}</select></label>
        <label>Trade<select data-filter="trade">${options("All trades", unique("trade"), state.filters.trade)}</select></label>
        <label>Supplier<select data-filter="supplier">${options("All suppliers", unique("supplier"), state.filters.supplier)}</select></label>
        <label>Pricing Result<select data-filter="pricing">${options("All pricing results", ["Within pricing", "Material overpayment", "Labor overpayment", "Pricing exception", "Needs review", "Not compared"], state.filters.pricing)}</select></label>
        <label>Sort<select data-sort><option ${state.sort === "Newest order" ? "selected" : ""}>Newest order</option><option ${state.sort === "Largest variance" ? "selected" : ""}>Largest variance</option><option ${state.sort === "Job number A-Z" ? "selected" : ""}>Job number A-Z</option><option ${state.sort === "Supplier A-Z" ? "selected" : ""}>Supplier A-Z</option></select></label>
        <label class="search">Search<input data-filter="search" type="search" value="${escapeHtml(state.filters.search)}" placeholder="Job, customer, supplier, crew"></label>
      </div>
    </section>
    <section class="records">
      <header><div><h2>Orders</h2><p>Blaze order cost compared with the applicable material and labor pricing.</p></div><strong>${rows.length} showing</strong></header>
      ${renderTable(rows)}
    </section>
    ${renderOrderModal(selected)}
    ${reportModal(rows)}
  `;
}

function exportRows(rows, format) {
  const headers = ["Job", "Customer", "Region", "Order Date", "Status", "Trade", "Supplier", "Crew", "Blaze Cost", "Expected Cost", "Variance", "Pricing Result"];
  const body = rows.map(row => [
    row.job_number || "", row.customer || "", row.region || "", dateValue(row.ordered_at || row.order_created_at),
    row.order_status || "", row.trade || "", row.supplier || "", row.crew_name || "",
    numberValue(row.material_actual) + numberValue(row.labor_actual),
    numberValue(row.material_expected) + numberValue(row.labor_expected),
    numberValue(row.material_variance) + numberValue(row.labor_variance), pricingGroup(row)
  ]);
  if (format === "PDF") {
    const win = window.open("", "_blank");
    win.document.write(`<title>Citadel Orders Report</title><style>body{font:12px Arial;margin:24px}h1{color:#12385e}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccd6e0;padding:6px;text-align:left}th{background:#12385e;color:white}</style><h1>Citadel Orders Report</h1><table><thead><tr>${headers.map(value => `<th>${escapeHtml(value)}</th>`).join("")}</tr></thead><tbody>${body.map(row => `<tr>${row.map(value => `<td>${escapeHtml(value)}</td>`).join("")}</tr>`).join("")}</tbody></table><script>window.onload=()=>window.print()<\/script>`);
    win.document.close();
    return;
  }
  const separator = format === "Excel" ? "\t" : ",";
  const quote = value => format === "Excel" ? String(value ?? "") : `"${String(value ?? "").replace(/"/g, '""')}"`;
  const text = [headers, ...body].map(row => row.map(quote).join(separator)).join("\r\n");
  const blob = new Blob([text], { type: format === "Excel" ? "application/vnd.ms-excel" : "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `citadel-orders-${new Date().toISOString().slice(0, 10)}.${format === "Excel" ? "xls" : "csv"}`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function bindEvents() {
  app.addEventListener("click", event => {
    const quick = event.target.closest("[data-quick]");
    if (quick) {
      state.quickFilter = quick.dataset.quick;
      render();
      return;
    }
    const row = event.target.closest("[data-order-id]");
    if (row) {
      state.selectedOrderId = row.dataset.orderId;
      render();
      return;
    }
    if (event.target.closest("[data-close-modal]") && (event.target.hasAttribute("data-close-modal") || event.target.closest("button[data-close-modal]"))) {
      state.selectedOrderId = "";
      render();
      return;
    }
    if (event.target.closest("[data-open-report]")) {
      state.reportOpen = true;
      render();
      return;
    }
    if (event.target.closest("[data-close-report]") && (event.target.hasAttribute("data-close-report") || event.target.closest("button[data-close-report]"))) {
      state.reportOpen = false;
      render();
      return;
    }
    const reportQuick = event.target.closest("[data-report-quick]");
    if (reportQuick) {
      state.quickFilter = reportQuick.dataset.reportQuick;
      render();
      return;
    }
    if (event.target.closest("[data-export]")) {
      const format = app.querySelector("[data-export-format]").value;
      exportRows(filteredOrders(), format);
    }
  });

  app.addEventListener("keydown", event => {
    if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-order-id]")) {
      state.selectedOrderId = event.target.dataset.orderId;
      render();
    }
    if (event.key === "Escape" && (state.selectedOrderId || state.reportOpen)) {
      state.selectedOrderId = "";
      state.reportOpen = false;
      render();
    }
  });

  app.addEventListener("change", event => {
    const filter = event.target.closest("select[data-filter]");
    if (filter) {
      state.filters[filter.dataset.filter] = filter.value;
      render();
      return;
    }
    if (event.target.matches("[data-sort]")) {
      state.sort = event.target.value;
      render();
    }
  });

  app.addEventListener("input", event => {
    const search = event.target.closest('input[data-filter="search"]');
    if (!search) return;
    state.filters.search = search.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      render();
      const next = app.querySelector('input[data-filter="search"]');
      if (next) {
        next.focus();
        next.setSelectionRange(next.value.length, next.value.length);
      }
    }, 220);
  });
}

function parentValue(name, fallback) {
  try {
    return window.parent !== window && window.parent[name] != null ? window.parent[name] : fallback;
  } catch (error) {
    return fallback;
  }
}

function loadOrders() {
  const apiUrl = parentValue("CITADEL_API_URL", "");
  const auth = parentValue("citadelAuth", {});
  if (!apiUrl) {
    state.loading = false;
    render();
    return;
  }
  const callbackName = `citadelOrders_${Date.now()}`;
  const script = document.createElement("script");
  const params = new URLSearchParams({ action: "getOrders", callback: callbackName });
  if (auth.sessionToken) params.set("session_token", auth.sessionToken);
  if (auth.csrfToken) params.set("csrf_token", auth.csrfToken);
  window[callbackName] = payload => {
    delete window[callbackName];
    script.remove();
    state.loading = false;
    if (!payload || !payload.ok) {
      state.error = payload?.error || "Orders data could not be loaded.";
    } else {
      state.data = Object.assign({ orders: [], lines: [], exceptions: [], metrics: {}, importStatus: null }, payload.data || {});
    }
    render();
  };
  script.onerror = () => {
    delete window[callbackName];
    script.remove();
    state.loading = false;
    state.error = "Orders data could not be loaded.";
    render();
  };
  script.src = `${apiUrl}?${params.toString()}`;
  document.head.appendChild(script);
}

function syncTheme() {
  try {
    const apply = () => {
      document.documentElement.dataset.theme = window.parent.document.body.dataset.theme || "light";
    };
    apply();
    themeObserver = new MutationObserver(apply);
    themeObserver.observe(window.parent.document.body, { attributes: true, attributeFilter: ["data-theme"] });
  } catch (error) {}
}

bindEvents();
syncTheme();
render();
loadOrders();
