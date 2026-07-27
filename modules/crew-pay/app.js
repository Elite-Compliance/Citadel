const app=document.querySelector("#app");
const state={data:window.CITADEL_CREW_PAY_DATA||{},loading:true,error:"",selected:"",quick:"all",report:false,reportMode:"invoices",reportUom:"SQ",reportTolerance:5,filters:{region:"All regions",crew:"All crews",trade:"All trades",status:"All statuses",comparison:"All results",from:"",to:"",search:""},sort:"Newest invoice"};
let searchTimer=0;
const esc=value=>String(value??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
const num=value=>{const parsed=Number(String(value??"").replace(/[$,\s]/g,""));return Number.isFinite(parsed)?parsed:0};
const money=value=>num(value).toLocaleString("en-US",{style:"currency",currency:"USD"});
const date=value=>{if(!value)return"";const parsed=new Date(value);return Number.isNaN(parsed.getTime())?String(value):parsed.toLocaleDateString("en-US")};
const norm=value=>String(value||"").trim().toLowerCase();
const cleanName=value=>norm(value).replace(/&/g," and ").replace(/\b(llc|inc|corp|corporation|company|co|ltd)\b/g," ").replace(/[^a-z0-9]+/g," ").replace(/\s+/g," ").trim();
const normalizeUom=value=>{const key=String(value||"").toUpperCase().replace(/[^A-Z]/g,"");if(["SQ","SQS","SQUARE","SQUARES"].includes(key))return"SQ";if(["LF","LNFT","LINEARFT","LINEARFEET"].includes(key))return"LF";return key||"Not set"};
const dash=value=>value===""||value==null?"—":value;
const unique=field=>[...new Set((state.data.invoices||[]).flatMap(row=>String(row[field]||"").split(",")).map(value=>value.trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
const options=(all,values,selected)=>[all,...values].map(value=>`<option ${value===selected?"selected":""}>${esc(value)}</option>`).join("");
const lines=id=>(state.data.lines||[]).filter(line=>String(line.invoice_id||"")===String(id||""));
function group(row){const value=norm(row.comparison_status);if(value==="matched")return"Matched";if(value.includes("custom"))return"Custom Labor";if(value.includes("order")&&value.includes("variance"))return"Order Variance";if(value.includes("master")&&value.includes("variance"))return"Master Variance";return"Needs Review"}
function visible(){
  const f=state.filters,search=norm(f.search);
  let rows=(state.data.invoices||[]).filter(row=>{
    if(f.region!=="All regions"&&String(row.region||"")!==f.region)return false;
    if(f.crew!=="All crews"&&String(row.crew_name||"")!==f.crew)return false;
    if(f.trade!=="All trades"&&!String(row.trade||"").split(",").map(x=>x.trim()).includes(f.trade))return false;
    if(f.status!=="All statuses"&&String(row.invoice_status||"")!==f.status)return false;
    if(f.comparison!=="All results"&&group(row)!==f.comparison)return false;
    const invoiceDate=new Date(row.invoice_date||0);
    if(f.from&&invoiceDate<new Date(`${f.from}T00:00:00`))return false;
    if(f.to&&invoiceDate>new Date(`${f.to}T23:59:59`))return false;
    if(search&&![row.invoice_number,row.job_number,row.customer,row.region,row.crew_name,row.trade,row.invoice_status,row.comparison_status].join(" ").toLowerCase().includes(search))return false;
    if(state.quick==="pending"&&!/pending/i.test(String(row.invoice_status||"")))return false;
    if(state.quick==="variances"&&!/variance/i.test(String(row.comparison_status||"")))return false;
    if(state.quick==="custom"&&!lines(row.invoice_id).some(line=>/custom/i.test(String(line.comparison_status||""))))return false;
    if(state.quick==="review"&&!/review|missing/i.test(String(row.comparison_status||"")))return false;
    return true;
  });
  return rows.sort((a,b)=>state.sort==="Largest variance"?Math.abs(num(b.order_variance)+num(b.master_variance))-Math.abs(num(a.order_variance)+num(a.master_variance)):state.sort==="Crew A-Z"?String(a.crew_name||"").localeCompare(String(b.crew_name||"")):String(b.invoice_date||b.source_updated_at||"").localeCompare(String(a.invoice_date||a.source_updated_at||"")));
}
function metrics(){const invoices=state.data.invoices||[],allLines=state.data.lines||[];return{all:invoices.length,pending:invoices.filter(row=>/pending/i.test(String(row.invoice_status||""))).length,variances:allLines.filter(row=>/variance/i.test(String(row.comparison_status||""))).length,custom:allLines.filter(row=>/custom/i.test(String(row.comparison_status||""))).length,review:invoices.filter(row=>/review|missing/i.test(String(row.comparison_status||""))).length}}
function metric(key,label,value,note){return`<button class="metric ${state.quick===key?"active":""}" data-quick="${key}"><span>${esc(label)}</span><strong>${value}</strong><small>${esc(note)}</small></button>`}
function statusClass(value){value=norm(value);return value==="matched"?"good":value.includes("variance")?"over":"review"}
function table(rows){if(!rows.length)return`<div class="empty"><strong>${(state.data.invoices||[]).length?"No labor invoices match these filters.":"Labor Invoice import is ready for its first run."}</strong><span>${(state.data.invoices||[]).length?"Change a filter or clear the search.":"Run the protected Blaze Labor Invoice import from Data Connections."}</span></div>`;return`<div class="table-scroll"><table><thead><tr><th>Invoice Number</th><th>Job Number</th><th>Region</th><th>Date</th><th>Status</th><th>Trade</th><th>Crew</th><th>Invoice Total</th><th>Vs Order</th><th>Vs Master</th><th>Result</th></tr></thead><tbody>${rows.map(row=>`<tr tabindex="0" data-id="${esc(row.invoice_id)}"><td><strong>${esc(row.invoice_number||"Not set")}</strong></td><td><strong>${esc(row.job_number||"Not set")}</strong><small>${esc(row.customer||"")}</small></td><td>${esc(row.region||"Not set")}</td><td>${esc(date(row.invoice_date))}</td><td>${esc(row.invoice_status||"Not set")}</td><td>${esc(row.trade||"Not set")}</td><td><strong>${esc(row.crew_name||"Not assigned")}</strong></td><td class="money">${money(row.invoice_labor_total||row.total_amount)}</td><td class="money ${num(row.order_variance)>0?"positive":num(row.order_variance)<0?"negative":""}">${money(row.order_variance)}</td><td class="money ${num(row.master_variance)>0?"positive":num(row.master_variance)<0?"negative":""}">${money(row.master_variance)}</td><td><span class="result ${statusClass(row.comparison_status)}">${esc(group(row))}</span></td></tr>`).join("")}</tbody></table></div>`}
function detail(invoice){if(!invoice)return"";const rows=lines(invoice.invoice_id);return`<div class="modal-backdrop" data-close><section class="modal"><header><div><small>Crew invoice comparison</small><h2>Invoice ${esc(invoice.invoice_number||"Not set")}</h2><p>${esc([`Job ${invoice.job_number||"Not set"}`,invoice.customer,invoice.region].filter(Boolean).join(" · "))}</p></div><button class="close" data-close aria-label="Close">X</button></header><div class="modal-body"><div class="summary"><span><small>Crew</small><strong>${esc(invoice.crew_name||"Not assigned")}</strong></span><span><small>Status</small><strong>${esc(invoice.invoice_status||"Not set")}</strong></span><span><small>Invoice</small><strong>${money(invoice.invoice_labor_total||invoice.total_amount)}</strong></span><span><small>Vs Order</small><strong>${money(invoice.order_variance)}</strong></span><span><small>Vs Master</small><strong>${money(invoice.master_variance)}</strong></span></div><div class="line-table"><table><thead><tr><th>Item</th><th>UOM</th><th>Qty</th><th>Order Rate</th><th>Invoice Rate</th><th>Master Rate</th><th>Vs Order</th><th>Vs Master</th><th>Match</th></tr></thead><tbody>${rows.length?rows.map(line=>`<tr><td><strong>${esc(line.item_name)}</strong><small>${esc(line.custom_labor?"Custom labor":"")}</small></td><td>${esc(line.uom)}</td><td>${esc(line.quantity)}</td><td class="money">${line.order_unit_price===""?"—":money(line.order_unit_price)}</td><td class="money">${money(line.invoice_unit_price)}</td><td class="money">${line.master_unit_price===""?"—":money(line.master_unit_price)}</td><td class="money ${num(line.invoice_vs_order_variance)>0?"positive":""}">${line.invoice_vs_order_variance===""?"—":money(line.invoice_vs_order_variance)}</td><td class="money ${num(line.invoice_vs_master_variance)>0?"positive":""}">${line.invoice_vs_master_variance===""?"—":money(line.invoice_vs_master_variance)}</td><td><span class="result ${statusClass(line.comparison_status)}">${esc(line.comparison_status||"Needs Review")}</span></td></tr>`).join(""):`<tr><td colspan="9">No invoice line items are available.</td></tr>`}</tbody></table></div></div><footer>${invoice.source_url?`<a class="secondary" href="${esc(invoice.source_url)}" target="_blank" rel="noopener">Open invoice in Blaze</a>`:""}${invoice.job_url?`<a class="secondary" href="${esc(invoice.job_url)}" target="_blank" rel="noopener">Open job in Blaze</a>`:""}<button class="primary" data-close>Done</button></footer></section></div>`}
function activeAliases(){
  const aliases=new Map();
  (state.data.activeSubcontractors||[]).forEach(sub=>{
    [sub.contractor_name,...(sub.crew_names||[])].filter(Boolean).forEach(name=>{
      const key=cleanName(name);
      if(key)aliases.set(key,sub.contractor_name||name);
    });
  });
  return aliases;
}
function activeContractorFor(name,aliases){
  const key=cleanName(name);
  if(!key)return"";
  if(aliases.has(key))return aliases.get(key);
  for(const [alias,contractor] of aliases){
    if(alias.length>5&&(key.includes(alias)||alias.includes(key)))return contractor;
  }
  return"";
}
function comparativeRows(invoices,mode){
  const aliases=activeAliases(),invoiceById=new Map(invoices.map(row=>[String(row.invoice_id||""),row])),groups=new Map();
  (state.data.lines||[]).forEach(line=>{
    const invoice=invoiceById.get(String(line.invoice_id||""));
    if(!invoice)return;
    const contractor=activeContractorFor(invoice.crew_name,aliases);
    if(!contractor)return;
    const uom=normalizeUom(line.uom);
    if(state.reportUom!=="All UOM"&&uom!==state.reportUom)return;
    const quantity=num(line.quantity),rate=num(line.invoice_unit_price);
    if(quantity<=0||rate<0)return;
    const region=invoice.region||"Not set",trade=invoice.trade||"Not set",crew=invoice.crew_name||contractor;
    const key=[region,trade,crew,uom].join("|");
    if(!groups.has(key))groups.set(key,{region,trade,crew,contractor,uom,jobs:new Set(),invoices:new Set(),quantity:0,paid:0,rates:[]});
    const group=groups.get(key);
    group.jobs.add(String(invoice.job_id||invoice.job_number||invoice.invoice_id||""));
    group.invoices.add(String(invoice.invoice_id||""));
    group.quantity+=quantity;
    group.paid+=quantity*rate;
    group.rates.push(rate);
  });
  const contractorRows=[...groups.values()].map(group=>({...group,average:group.quantity?group.paid/group.quantity:0,min:Math.min(...group.rates),max:Math.max(...group.rates)}));
  const benchmarks=new Map();
  contractorRows.forEach(row=>{
    const key=[row.region,row.trade,row.uom].join("|");
    if(!benchmarks.has(key))benchmarks.set(key,{paid:0,quantity:0});
    const benchmark=benchmarks.get(key);
    benchmark.paid+=row.paid;
    benchmark.quantity+=row.quantity;
  });
  const detailed=contractorRows.map(row=>{
    const benchmark=benchmarks.get([row.region,row.trade,row.uom].join("|"));
    const regionalAverage=benchmark.quantity?benchmark.paid/benchmark.quantity:0;
    const variance=row.average-regionalAverage;
    const variancePct=regionalAverage?variance/regionalAverage*100:0;
    const inconsistent=Math.abs(row.max-row.min)>.005;
    const result=variancePct>state.reportTolerance?"Potential Overpayment":variancePct<-state.reportTolerance?"Below Regional Average":inconsistent?"Inconsistent Rate":"Consistent";
    return[row.region,row.contractor,row.crew,row.trade,row.uom,row.jobs.size,row.invoices.size,row.quantity.toFixed(2),row.paid.toFixed(2),row.average.toFixed(2),regionalAverage.toFixed(2),variance.toFixed(2),variancePct.toFixed(1)+"%",row.min.toFixed(2),row.max.toFixed(2),result];
  });
  if(mode==="analysis"||mode==="overpay"){
    return{headers:["Region","Subcontractor","Crew","Trade","UOM","Jobs","Invoices","Quantity","Total Paid","Avg Rate","Regional Avg","Variance $","Variance %","Min Rate","Max Rate","Assessment"],body:mode==="overpay"?detailed.filter(row=>row[15]==="Potential Overpayment"):detailed};
  }
  const regionalGroups=new Map();
  contractorRows.forEach(row=>{
    const key=[row.region,row.trade,row.uom].join("|");
    if(!regionalGroups.has(key))regionalGroups.set(key,{region:row.region,trade:row.trade,uom:row.uom,rows:[],contractors:new Set(),jobs:new Set(),quantity:0,paid:0});
    const group=regionalGroups.get(key);
    group.rows.push(row);
    group.contractors.add(row.contractor);
    row.jobs.forEach(job=>group.jobs.add(job));
    group.quantity+=row.quantity;
    group.paid+=row.paid;
  });
  return{headers:["Region","Trade","UOM","Active Subs","Jobs","Quantity","Total Paid","Weighted Avg","Lowest Sub Avg","Highest Sub Avg","Spread $","Spread %","Assessment"],body:[...regionalGroups.values()].map(group=>{
    const averages=group.rows.map(row=>row.average),average=group.quantity?group.paid/group.quantity:0,low=Math.min(...averages),high=Math.max(...averages),spread=high-low,spreadPct=average?spread/average*100:0;
    return[group.region,group.trade,group.uom,group.contractors.size,group.jobs.size,group.quantity.toFixed(2),group.paid.toFixed(2),average.toFixed(2),low.toFixed(2),high.toFixed(2),spread.toFixed(2),spreadPct.toFixed(1)+"%",spreadPct>state.reportTolerance?"Needs Review":"Consistent"];
  })};
}
function reportData(rows){
  if(state.reportMode==="lines"){
    const invoiceIds=new Set(rows.map(row=>String(row.invoice_id)));
    return{headers:["Invoice","Job","Region","Crew","Trade","Item","UOM","Qty","Order Rate","Invoice Rate","Master Rate","Vs Order","Vs Master","Match"],body:(state.data.lines||[]).filter(line=>invoiceIds.has(String(line.invoice_id))).map(line=>{const invoice=(state.data.invoices||[]).find(row=>String(row.invoice_id)===String(line.invoice_id))||{};return[invoice.invoice_number,invoice.job_number,invoice.region,invoice.crew_name,invoice.trade,line.item_name,line.uom,line.quantity,dash(line.order_unit_price),line.invoice_unit_price,dash(line.master_unit_price),dash(line.invoice_vs_order_variance),dash(line.invoice_vs_master_variance),line.comparison_status]})};
  }
  if(["analysis","regions","overpay"].includes(state.reportMode))return comparativeRows(rows,state.reportMode);
  return{headers:["Invoice","Job","Customer","Region","Date","Status","Trade","Crew","Invoice Total","Order Variance","Master Variance","Result"],body:rows.map(row=>[row.invoice_number,row.job_number,row.customer,row.region,date(row.invoice_date),row.invoice_status,row.trade,row.crew_name,num(row.invoice_labor_total||row.total_amount),num(row.order_variance),num(row.master_variance),group(row)])};
}
function reportPreview(data){
  const rows=data.body.slice(0,100);
  return`<div class="analysis"><table><thead><tr>${data.headers.map(header=>`<th>${esc(header)}</th>`).join("")}</tr></thead><tbody>${rows.length?rows.map(row=>`<tr>${row.map(value=>`<td>${esc(value)}</td>`).join("")}</tr>`).join(""):`<tr><td colspan="${data.headers.length}">No records match the current report settings.</td></tr>`}</tbody></table></div>`;
}
function report(rows){if(!state.report)return"";const data=reportData(rows),invoiceTotal=rows.reduce((sum,row)=>sum+num(row.invoice_labor_total||row.total_amount),0),orderVariance=rows.reduce((sum,row)=>sum+num(row.order_variance),0),comparisonMode=["analysis","regions","overpay"].includes(state.reportMode);return`<div class="modal-backdrop" data-close-report><section class="modal report-modal"><header><div><h2>Labor Invoice Reports</h2><p>Compare active subcontractor labor rates by region, trade, and unit of measure.</p></div><button class="close" data-close-report>X</button></header><div class="modal-body"><div class="quick"><button data-report-mode="analysis">Active Sub Rates</button><button data-report-mode="regions">Region Comparison</button><button data-report-mode="overpay">Potential Overpayments</button><button data-report="variances">All Variances</button><button data-report="pending">Pending Approval</button><button data-report="all">Current View</button></div><div class="report-controls"><label>Report Detail<select data-report-mode><option value="invoices" ${state.reportMode==="invoices"?"selected":""}>Invoice Summary</option><option value="lines" ${state.reportMode==="lines"?"selected":""}>Line-Item Detail</option><option value="analysis" ${state.reportMode==="analysis"?"selected":""}>Active Subcontractor Rates</option><option value="regions" ${state.reportMode==="regions"?"selected":""}>Regional Rate Consistency</option><option value="overpay" ${state.reportMode==="overpay"?"selected":""}>Potential Overpayments</option></select></label>${comparisonMode?`<label>Unit of Measure<select data-report-uom>${options("All UOM",["SQ","LF","EA"],state.reportUom)}</select></label><label>Allowed Difference %<input data-report-tolerance type="number" min="0" step="1" value="${esc(state.reportTolerance)}"></label>`:`<div><span>Invoice Total</span><strong>${money(invoiceTotal)}</strong></div><div><span>Vs Order</span><strong>${money(orderVariance)}</strong></div>`}<div><span>Records</span><strong>${data.body.length}</strong></div><div><span>Active Subs</span><strong>${(state.data.activeSubcontractors||[]).length}</strong></div></div><div class="report-parameters"><strong>Active filters:</strong> ${esc([state.filters.region,state.filters.crew,state.filters.trade,state.filters.status,state.filters.comparison,state.filters.from&&`From ${state.filters.from}`,state.filters.to&&`To ${state.filters.to}`,state.filters.search&&`Search: ${state.filters.search}`].filter(value=>value&&!String(value).startsWith("All ")).join(" · ")||"None")}${comparisonMode?`<br><span>Rates use actual invoice quantities and weighted averages. Only active subcontractors are included.</span>`:""}</div>${reportPreview(data)}${data.body.length>100?`<p class="preview-note">Preview shows the first 100 records. The export includes all ${data.body.length} records.</p>`:""}</div><footer><button class="secondary" data-close-report>Cancel</button><select data-format><option>CSV</option><option>Excel</option><option>PDF</option></select><button class="primary" data-export>Export Report</button></footer></section></div>`}
function render(){const rows=visible(),m=metrics(),selected=(state.data.invoices||[]).find(row=>String(row.invoice_id)===String(state.selected)),log=state.data.importStatus;app.innerHTML=`<section class="status"><span class="${state.error?"error":state.loading?"loading":""}">${state.error?esc(state.error):state.loading?"Loading protected Labor Invoice data...":log?`Last import: ${esc(log.status||"Complete")} · ${esc(date(log.completed_at||log.started_at))}`:"Protected Labor Invoice workspace ready"}</span></section><section class="metrics">${metric("all","All Invoices",m.all,"Protected labor invoices")}${metric("pending","Pending Approval",m.pending,"Awaiting decision")}${metric("variances","Rate Variances",m.variances,"Order or master difference")}${metric("custom","Custom Labor",m.custom,"Outside standard lines")}${metric("review","Needs Review",m.review,"Missing or uncertain matches")}</section><section class="filters-card"><div class="section-heading"><div><h2>Filters + Sort + Search</h2><p>Compare labor invoices with authorized job labor and master labor pricing.</p></div><button class="primary" data-open-report>Reports</button></div><div class="filters"><label>Region<select data-filter="region">${options("All regions",unique("region"),state.filters.region)}</select></label><label>Crew<select data-filter="crew">${options("All crews",unique("crew_name"),state.filters.crew)}</select></label><label>Trade<select data-filter="trade">${options("All trades",unique("trade"),state.filters.trade)}</select></label><label>Status<select data-filter="status">${options("All statuses",unique("invoice_status"),state.filters.status)}</select></label><label>Comparison<select data-filter="comparison">${options("All results",["Matched","Order Variance","Master Variance","Custom Labor","Needs Review"],state.filters.comparison)}</select></label><label>Sort<select data-sort><option>Newest invoice</option><option ${state.sort==="Largest variance"?"selected":""}>Largest variance</option><option ${state.sort==="Crew A-Z"?"selected":""}>Crew A-Z</option></select></label><div class="date-range"><label>Invoice From<input data-filter="from" type="date" value="${esc(state.filters.from)}"></label><label>Invoice To<input data-filter="to" type="date" value="${esc(state.filters.to)}"></label></div><label class="search">Search<input data-filter="search" type="search" value="${esc(state.filters.search)}" placeholder="Invoice, job, customer, crew"></label></div></section><section class="records"><header><div><h2>Labor Invoices</h2><p>Invoice requests compared with job orders and approved labor rates.</p></div><strong>${rows.length} showing</strong></header>${table(rows)}</section>${detail(selected)}${report(rows)}`}
function exportRows(rows,format){const {headers,body}=reportData(rows);if(format==="PDF"){const win=window.open("","_blank");win.document.write(`<title>Labor Invoice Report</title><style>body{font:12px Arial;margin:24px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccd6e0;padding:6px}th{background:#12385e;color:white}</style><h1>Labor Invoice Report</h1><p>Generated ${esc(new Date().toLocaleString())}</p><table><tr>${headers.map(x=>`<th>${esc(x)}</th>`).join("")}</tr>${body.map(row=>`<tr>${row.map(x=>`<td>${esc(x)}</td>`).join("")}</tr>`).join("")}</table><script>onload=()=>print()<\/script>`);win.document.close();return}const sep=format==="Excel"?"\t":",",quote=value=>format==="Excel"?String(value??""):`"${String(value??"").replace(/"/g,'""')}"`,blob=new Blob([[headers,...body].map(row=>row.map(quote).join(sep)).join("\r\n")],{type:format==="Excel"?"application/vnd.ms-excel":"text/csv;charset=utf-8"}),link=document.createElement("a");link.href=URL.createObjectURL(blob);link.download=`citadel-labor-invoices-${state.reportMode}-${new Date().toISOString().slice(0,10)}.${format==="Excel"?"xls":"csv"}`;link.click();URL.revokeObjectURL(link.href)}
app.addEventListener("click",event=>{const quick=event.target.closest("[data-quick]");if(quick){state.quick=quick.dataset.quick;render();return}const row=event.target.closest("[data-id]");if(row){state.selected=row.dataset.id;render();return}if(event.target.closest("[data-close]")){state.selected="";render();return}if(event.target.closest("[data-open-report]")){state.report=true;render();return}if(event.target.closest("[data-close-report]")){state.report=false;render();return}const reportQuick=event.target.closest("[data-report]");if(reportQuick){state.quick=reportQuick.dataset.report;render();return}const mode=event.target.closest("button[data-report-mode]");if(mode){state.reportMode=mode.dataset.reportMode;render();return}if(event.target.closest("[data-export]"))exportRows(visible(),app.querySelector("[data-format]").value)});
app.addEventListener("change",event=>{if(event.target.matches("[data-filter]")){state.filters[event.target.dataset.filter]=event.target.value;render()}else if(event.target.matches("[data-sort]")){state.sort=event.target.value;render()}else if(event.target.matches("select[data-report-mode]")){state.reportMode=event.target.value;render()}else if(event.target.matches("[data-report-uom]")){state.reportUom=event.target.value;render()}else if(event.target.matches("[data-report-tolerance]")){state.reportTolerance=Math.max(0,num(event.target.value));render()}});
app.addEventListener("input",event=>{if(!event.target.matches('input[data-filter="search"]'))return;state.filters.search=event.target.value;clearTimeout(searchTimer);searchTimer=setTimeout(()=>{render();const next=app.querySelector('input[data-filter="search"]');if(next){next.focus();next.setSelectionRange(next.value.length,next.value.length)}},220)});
function parentValue(name,fallback){try{return window.parent!==window&&window.parent[name]!=null?window.parent[name]:fallback}catch(error){return fallback}}
function load(){const api=parentValue("CITADEL_API_URL",""),auth=parentValue("citadelAuth",{});if(!api){state.loading=false;render();return}const callback=`citadelCrewPay_${Date.now()}`,script=document.createElement("script"),params=new URLSearchParams({action:"getCrewPay",callback});if(auth.sessionToken)params.set("session_token",auth.sessionToken);if(auth.csrfToken)params.set("csrf_token",auth.csrfToken);window[callback]=payload=>{delete window[callback];script.remove();state.loading=false;if(!payload||!payload.ok)state.error=payload?.error||"Crew Pay data could not be loaded.";else state.data=Object.assign({invoices:[],lines:[],analysis:[],exceptions:[],activeSubcontractors:[],metrics:{},importStatus:null},payload.data||{});render()};script.onerror=()=>{delete window[callback];script.remove();state.loading=false;state.error="Crew Pay data could not be loaded.";render()};script.src=`${api}?${params.toString()}`;document.head.appendChild(script)}
try{const apply=()=>{document.documentElement.dataset.theme=window.parent.document.body.dataset.theme||"light"};apply();new MutationObserver(apply).observe(window.parent.document.body,{attributes:true,attributeFilter:["data-theme"]})}catch(error){}
render();load();

