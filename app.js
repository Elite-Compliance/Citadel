var CITADEL_VERSION="2.1.2";
var CITADEL_API_URL="https://script.google.com/macros/s/AKfycbzKIMMrIFdmS3xKUHzSzwR-Y-Z4FebDLBod1OWmORqDC-_J9pXH2azFVrONruv1djvIhw/exec";
var COMMAND_FOCUS_NOTE_PREFIX="citadel_command_focus_note_";
var selectedCommandModule="liens";
var liensWorkspaceStatus="";
var activeLienMetric="all";
var lienFilters={status:"All statuses",stage:"All stages",region:"All regions",sort:"Highest balance",search:""};
var lienSearchTimer=null;
var liensPageEventsBound=false;
var LIEN_STATUS_OPTIONS=["Attorney","Attorney - Customer","Attorney - Elite","Bankruptcy","Collection Agency","Foreclosure","Lien","Lien Released","Paid In Full with Lien","Small Claims","Receivable"];
var LIEN_STAGE_OPTIONS=["Monitor","Review","High","Critical"];
var pages=[{id:"command-center",label:"Command Center"},{id:"region-health",label:"Region Health"},{id:"data-connections",label:"Data Connections"},{id:"inbox",label:"Inbox"},{id:"tasks",label:"Tasks"},{id:"legal",label:"Legal"},{id:"reviews",label:"Reviews"},{id:"pricing",label:"Pricing"},{id:"fleet",label:"Fleet",children:[{id:"fleet-vehicles",label:"Vehicles"},{id:"fleet-drivers",label:"Drivers"}]},{id:"contractors",label:"Contractors"},{id:"registrations",label:"Registrations"},{id:"liens",label:"Liens"},{id:"collections",label:"Collections"}];


var LIENS_CACHE_KEY="citadel_liens_cache_v1";
var liensData={metrics:[],notes:[],alerts:[],followUps:[],selectedIndex:0,records:[]};
var liensLoading=!!CITADEL_API_URL;
var liensLoadError="";
var liensLastUpdated="";

var contractorFilters={documents:"All documents",risk:"All risks",region:"All regions",sort:"Highest risk",search:""};
var contractorWorkspaceStatus="";
var contractorSearchTimer=null;
var activeContractorMetric="total";
var activeStandardMetric="";
var contractorsPageEventsBound=false;
var standardPageEventsBound=false;
var CONTRACTORS_CACHE_KEY="citadel_contractors_cache_v1";
var contractorsData={metrics:[],notes:[],alerts:[],followUps:[],selectedIndex:0,records:[]};
var contractorsLoading=!!CITADEL_API_URL;
var contractorsLoadError="";
var contractorsLastUpdated="";
var CONTRACTOR_DOCUMENT_OPTIONS=["Current","Expiring Soon","Expired"];
var CONTRACTOR_RISK_OPTIONS=["70 High","50 Review","20 Monitor"];


var pricingState={headers:[],keys:[],rows:[],allRows:[],total:0,offset:0,limit:75,chunkSize:1200,states:[],trades:[],types:[],suppliers:[],sheet:'',loading:false,cacheLoading:false,cacheReady:false,error:'',cacheMessage:'Loading most current pricing',filters:{search:'',state:'All states',trade:'All trades',type:'All types',supplier:'All suppliers',sort:'Default'},visibleColumns:null};
var REVIEWS_CACHE_KEY="citadel_reviews_cache_v1";
var reviewsData={records:[],notes:[],alerts:[],followUps:[],metrics:[],selectedIndex:0};var reviewsLoading=!!CITADEL_API_URL;var reviewsLoadError='';var reviewsLastUpdated='';var reviewFilters={platform:'All platforms',rating:'All ratings',status:'All statuses',sort:'Newest first',search:''};var activeReviewMetric='all';var reviewsPageEventsBound=false;var reviewWorkspaceStatus='';var reviewSearchTimer=null;
var FLEET_CACHE_KEY="citadel_fleet_cache_v1";
var fleetData={sourceRows:[],vehicles:[],drivers:[],notes:[],alerts:[],followUps:[],metrics:[],selectedFleetIndex:0,selectedVehicleIndex:0,selectedDriverIndex:0};
var fleetLoading=!!CITADEL_API_URL;
var fleetLoadError="";
var fleetLastUpdated="";
var fleetPageEventsBound=false;
var activeFleetMetric="all";
var fleetVehicleFilters={status:"All statuses",service:"All service",region:"All regions",sort:"Unit A-Z",search:""};
var fleetDriverFilters={status:"All statuses",credential:"All credentials",region:"All regions",sort:"Driver A-Z",search:""};
var fleetSearchTimer=null;
var registrationsSummary={openRequests:[],activeRegistrations:[],archivedRequests:[],alerts:[],followUps:[],metrics:{}};
var registrationsSummaryLoading=!!CITADEL_API_URL;
var registrationsSummaryError="";
var registrationsSummaryUpdated="";
var COLLECTIONS_CACHE_KEY="citadel_collections_cache_v1";
var collectionsData={records:[],notes:[],alerts:[],contacts:[],attorneys:[],contactLinks:[],metrics:[],selectedIndex:0,selectedContactIndex:0};
var collectionsLoading=!!CITADEL_API_URL;
var collectionsLoadError="";
var collectionsLastUpdated="";
var collectionsWorkspaceStatus="";
var collectionsPageEventsBound=false;
var activeCollectionMetric="accounts";
var collectionView="accounts";
var collectionFilters={agency:"All agencies",stage:"All stages",region:"All regions",sort:"Highest outstanding",search:""};
var contactFilters={type:"All contact types",state:"All states",sort:"Organization A-Z",search:""};
var collectionSearchTimer=null;
var pricingPageEventsBound=false;
var pricingSearchTimer=null;
var pricingRequestId=0;
var pricingColorSelections={};
var PRICING_CACHE_DB='citadel_pricing_cache_v1';
var PRICING_CACHE_STORE='rows';
var PRICING_META_KEY='pricing_meta';
function pricingDefaultColumns(){return ['supplier','state','brand','elite_product_name','color','item_final','type','uom','price']}
function pricingColumnLabel(key){var labels={supplier:'Supplier',state:'State',brand:'Brand',elite_product_name:'Elite Product Name',color:'Color',item_final:'Item Final',trade:'Trade',type:'Type',item_number:'Item Number',item:'Item',color_code:'Color Code',uom:'UOM',price:'Price',source_file:'Source File',received_date:'Received Date'};return labels[key]||key.replace(/_/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase()})}
function pricingAvailableColumns(){var keys=pricingState.keys.length?pricingState.keys:pricingDefaultColumns();return keys.filter(function(key){return key&&key!=='_row'})}
function pricingDisplayColumns(){var available=pricingAvailableColumns();var selected=pricingState.visibleColumns&&pricingState.visibleColumns.length?pricingState.visibleColumns:pricingDefaultColumns();var columns=selected.filter(function(key){return available.indexOf(key)>-1});if(!columns.length)columns=pricingDefaultColumns().filter(function(key){return available.indexOf(key)>-1});return columns.length?columns:available.slice(0,9)}
function pricingSearchText(row){return pricingAvailableColumns().map(function(key){return row[key]}).join(' ').toLowerCase()}
function pricingMatchesLocal(row){var filters=pricingState.filters;if(filters.state!=='All states'&&String(row.state||'')!==filters.state)return false;if(filters.trade!=='All trades'&&String(row.trade||'')!==filters.trade)return false;if(filters.type!=='All types'&&String(row.type||'')!==filters.type)return false;if(filters.supplier!=='All suppliers'&&String(row.supplier||'')!==filters.supplier)return false;var q=filters.search.toLowerCase().trim();if(q&&pricingSearchText(row).indexOf(q)<0)return false;return true}
function pricingSortLocal(rows){var sort=pricingState.filters.sort;if(sort==='Lowest price')rows.sort(function(a,b){return moneyNumber(a.price)-moneyNumber(b.price)});if(sort==='Highest price')rows.sort(function(a,b){return moneyNumber(b.price)-moneyNumber(a.price)});if(sort==='Name A-Z')rows.sort(function(a,b){return String(a.elite_product_name||'').localeCompare(String(b.elite_product_name||''))});return rows}
function pricingColorValue(row){return row.color||row.item_color||row.color_name||''}
function pricingGroupKey(row){return ['supplier','state','brand','elite_product_name','trade','type','uom'].map(function(key){return String(row[key]||'').trim().toLowerCase()}).join('|')}
function pricingGroupedRows(rows){var map={};var groups=[];rows.forEach(function(row){var key=pricingGroupKey(row);if(!map[key]){map[key]={key:key,base:Object.assign({},row),variants:[]};map[key].base._groupKey=key;groups.push(map[key])}map[key].variants.push(row)});groups.forEach(function(group){group.variants.sort(function(a,b){return String(pricingColorValue(a)||'').localeCompare(String(pricingColorValue(b)||''))});var colors=[];var seen={};group.variants.forEach(function(variant){var color=pricingColorValue(variant);if(color&&!seen[color]){seen[color]=true;colors.push(color)}});var selected=pricingSelectedVariant(group);if(selected)Object.assign(group.base,selected);else if(colors.length>1){['color','item_final','item_number','item','color_code','price'].forEach(function(key){group.base[key]=''});group.base._needsColor=true}group.base._groupKey=group.key;group.base._variants=group.variants});return groups.map(function(group){return group.base})}
function pricingSelectedVariant(group){var selectedColor=pricingColorSelections[group.key];if(selectedColor){var found=group.variants.find(function(row){return String(pricingColorValue(row))===String(selectedColor)});if(found)return found}return null}
function pricingCellHtml(row,key){if(key==='color'){var variants=row._variants||[];var colors=[];var seen={};variants.forEach(function(variant){var color=pricingColorValue(variant);if(color&&!seen[color]){seen[color]=true;colors.push(color)}});if(colors.length>1){var current=pricingColorSelections[row._groupKey]||'';return '<span><select class="pricing-color-select" data-pricing-color-group="'+escapeHtml(row._groupKey||'')+'"><option value="">Select color</option>'+colors.map(function(color){return '<option value="'+escapeHtml(color)+'" '+(String(color)===String(current)?'selected':'')+'>'+escapeHtml(color)+'</option>'}).join('')+'</select></span>'}}var value=row[key];if(row._needsColor&&['item_final','item_number','item','color_code','price'].indexOf(key)>-1)value='';if(/price|rate|amount|cost|total/i.test(key)&&value!=='')value=moneyLabel(value);return '<span title="'+escapeHtml(value)+'">'+escapeHtml(value)+'</span>'}

function refreshPricingFacets(){var states={},trades={},types={},suppliers={};pricingState.allRows.forEach(function(row){if(row.state)states[row.state]=true;if(row.trade)trades[row.trade]=true;if(row.type)types[row.type]=true;if(row.supplier)suppliers[row.supplier]=true});pricingState.states=Object.keys(states).sort();pricingState.trades=Object.keys(trades).sort();pricingState.types=Object.keys(types).sort();pricingState.suppliers=Object.keys(suppliers).sort()}
function loadPricingStaticData(){var data=window.CITADEL_PRICING_DATA;if(!data||!data.rows||!data.rows.length)return false;pricingState.headers=data.headers||[];pricingState.keys=data.keys||Object.keys(data.rows[0]||{});pricingState.allRows=data.rows||[];pricingState.sheet='Pricing snapshot';pricingState.cacheReady=true;pricingState.loading=false;pricingState.cacheLoading=false;pricingState.error='';pricingState.cacheMessage='Pricing snapshot ready';refreshPricingFacets();applyPricingLocalView();return true}
function applyPricingLocalView(){var rows=pricingState.allRows.filter(pricingMatchesLocal);pricingSortLocal(rows);var grouped=pricingGroupedRows(rows);pricingState.total=grouped.length;pricingState.offset=Math.min(pricingState.offset,Math.max(grouped.length-1,0));pricingState.rows=grouped.slice(pricingState.offset,pricingState.offset+pricingState.limit)}
function openPricingDb(){return new Promise(function(resolve,reject){if(!window.indexedDB){reject(new Error('Browser cache unavailable'));return}var req=indexedDB.open(PRICING_CACHE_DB,1);req.onupgradeneeded=function(){var db=req.result;if(!db.objectStoreNames.contains(PRICING_CACHE_STORE))db.createObjectStore(PRICING_CACHE_STORE,{keyPath:'_row'});if(!db.objectStoreNames.contains('meta'))db.createObjectStore('meta',{keyPath:'key'})};req.onsuccess=function(){resolve(req.result)};req.onerror=function(){reject(req.error)}})}
function pricingDbGetAll(){return openPricingDb().then(function(db){return new Promise(function(resolve,reject){var tx=db.transaction([PRICING_CACHE_STORE,'meta'],'readonly');var rowsReq=tx.objectStore(PRICING_CACHE_STORE).getAll();var metaReq=tx.objectStore('meta').get(PRICING_META_KEY);tx.oncomplete=function(){resolve({rows:rowsReq.result||[],meta:metaReq.result||{}});db.close()};tx.onerror=function(){reject(tx.error);db.close()}})})}
function pricingDbReplace(rows,meta){return openPricingDb().then(function(db){return new Promise(function(resolve,reject){var tx=db.transaction([PRICING_CACHE_STORE,'meta'],'readwrite');var store=tx.objectStore(PRICING_CACHE_STORE);store.clear();rows.forEach(function(row){store.put(row)});tx.objectStore('meta').put(Object.assign({key:PRICING_META_KEY,savedAt:Date.now()},meta||{}));tx.oncomplete=function(){resolve();db.close()};tx.onerror=function(){reject(tx.error);db.close()}})})}
function hydratePricingFromCache(){return pricingDbGetAll().then(function(payload){if(!payload.rows.length)return false;pricingState.allRows=payload.rows;pricingState.headers=payload.meta.headers||[];pricingState.keys=payload.meta.keys||Object.keys(payload.rows[0]||{});pricingState.sheet=payload.meta.sheet||'Cached pricing';pricingState.cacheReady=true;pricingState.loading=false;pricingState.cacheMessage='Cached pricing ready';refreshPricingFacets();applyPricingLocalView();return true}).catch(function(){return false})}
function renderPricingPage(){pagePanel.className='page-panel pricing-page';var status=pricingState.cacheLoading?pricingState.cacheMessage:pricingState.error?pricingState.error:(pricingState.cacheReady?'Cached pricing ready':pricingState.sheet?'Pricing sheet: '+pricingState.sheet:'Pricing sheet ready');var columns=pricingDisplayColumns();var start=pricingState.total?pricingState.offset+1:0;var end=Math.min(pricingState.offset+pricingState.rows.length,pricingState.total);pagePanel.innerHTML=renderModuleStatusLine(status)+'<section class="pricing-filter-card"><div><h3>Filters + Sort + Search</h3><p>Search across pricing columns. Results update after you pause typing.</p></div><div class="pricing-actions"><button type="button" data-pricing-columns>Columns</button><button type="button" data-pricing-refresh>Refresh</button><button type="button" data-pricing-report>Reports</button></div><div class="pricing-filters"><label>State<select data-pricing-filter="state">'+renderSelectOptions('All states',pricingState.states,pricingState.filters.state)+'</select></label><label>Trade<select data-pricing-filter="trade">'+renderSelectOptions('All trades',pricingState.trades,pricingState.filters.trade)+'</select></label><label>Type<select data-pricing-filter="type">'+renderSelectOptions('All types',pricingState.types,pricingState.filters.type)+'</select></label><label>Supplier<select data-pricing-filter="supplier">'+renderSelectOptions('All suppliers',pricingState.suppliers,pricingState.filters.supplier)+'</select></label><label>Sort<select data-pricing-filter="sort"><option'+(pricingState.filters.sort==='Default'?' selected':'')+'>Default</option><option'+(pricingState.filters.sort==='Lowest price'?' selected':'')+'>Lowest price</option><option'+(pricingState.filters.sort==='Highest price'?' selected':'')+'>Highest price</option><option'+(pricingState.filters.sort==='Name A-Z'?' selected':'')+'>Name A-Z</option></select></label><label>Search<input data-pricing-filter="search" type="search" placeholder="Search across all columns" value="'+escapeHtml(pricingState.filters.search)+'"></label></div>'+renderPricingColumnPanel()+'</section><div class="pricing-layout"><section class="pricing-results"><div class="pricing-section-head"><div><h3>Pricing Records</h3><p>'+escapeHtml(start)+'-'+escapeHtml(end)+' of '+escapeHtml(pricingState.total)+' matching rows</p></div><div class="pricing-pager"><button type="button" data-pricing-page="prev" '+(pricingState.offset<=0?'disabled':'')+'>Previous</button><button type="button" data-pricing-page="next" '+(end>=pricingState.total?'disabled':'')+'>Next</button></div></div>'+renderPricingTable(columns)+'</section></div>'}
function renderPricingColumnPanel(){var available=pricingAvailableColumns();var selected=pricingDisplayColumns();return '<div class="pricing-column-panel" hidden>'+available.map(function(key){return '<label><input type="checkbox" data-pricing-column="'+escapeHtml(key)+'" '+(selected.indexOf(key)>-1?'checked':'')+'> '+escapeHtml(pricingColumnLabel(key))+'</label>'}).join('')+'</div>'}
function pricingSearchIsActive(){var active=document.activeElement;return !!(active&&active.matches&&active.matches('input[data-pricing-filter="search"]'))}
function renderPricingPageKeepingSearch(){var active=document.activeElement;var keep=pricingSearchIsActive();var cursor=keep?active.selectionStart:null;renderPricingPage();if(keep){var next=pagePanel.querySelector('input[data-pricing-filter="search"]');if(next){next.focus();var position=cursor==null?next.value.length:Math.min(cursor,next.value.length);next.setSelectionRange(position,position)}}}
function renderPricingTable(columns){if((pricingState.loading||pricingState.cacheLoading)&&!pricingState.rows.length)return '<div class="pricing-loading-card"><div class="loading-pulse"></div><h3>Loading pricing</h3><p>Finding the latest pricing rows.</p></div>';if(pricingState.error&&!pricingState.rows.length)return '<div class="pricing-empty">'+escapeHtml(pricingState.error)+'</div>';if(!pricingState.rows.length)return '<div class="pricing-empty">No pricing records found.</div>';var displayRows=pricingState.rows;return '<div class="pricing-table"><div class="pricing-table-head" style="grid-template-columns:repeat('+columns.length+',minmax(90px,1fr))">'+columns.map(function(key){return '<span>'+escapeHtml(pricingColumnLabel(key))+'</span>'}).join('')+'</div>'+displayRows.map(function(row){return '<div class="pricing-row" style="grid-template-columns:repeat('+columns.length+',minmax(90px,1fr))">'+columns.map(function(key){return pricingCellHtml(row,key)}).join('')+'</div>'}).join('')+'</div>'}
function pricingUniqueValues(key){var seen={};var rows=pricingState.allRows.length?pricingState.allRows:pricingState.rows;rows.forEach(function(row){var value=row[key];if(value!==undefined&&value!==null&&String(value).trim()!=='')seen[String(value).trim()]=true});return Object.keys(seen).sort(function(a,b){return a.localeCompare(b)})}
function pricingReportSelect(label,name,allLabel,values,current){return '<label>'+escapeHtml(label)+'<select data-pricing-report-field="'+escapeHtml(name)+'">'+renderSelectOptions(allLabel,values,current||allLabel)+'</select></label>'}
function pricingReportInput(label,name,placeholder,value){return '<label>'+escapeHtml(label)+'<input data-pricing-report-field="'+escapeHtml(name)+'" placeholder="'+escapeHtml(placeholder)+'" value="'+escapeHtml(value||'')+'"></label>'}
function pricingReportOptions(modal){function value(name){var field=modal.querySelector('[data-pricing-report-field="'+name+'"]');return field?field.value:''}var columns=Array.from(modal.querySelectorAll('[data-pricing-report-column]:checked')).map(function(input){return input.getAttribute('data-pricing-report-column')});if(!columns.length)columns=pricingDisplayColumns();return {state:value('state'),supplier:value('supplier'),trade:value('trade'),type:value('type'),brand:value('brand'),color:value('color'),search:value('search'),sort:value('sort'),columns:columns}}
function pricingReportMatches(row,options){if(options.state&&options.state!=='All states'&&String(row.state||'')!==options.state)return false;if(options.supplier&&options.supplier!=='All suppliers'&&String(row.supplier||'')!==options.supplier)return false;if(options.trade&&options.trade!=='All trades'&&String(row.trade||'')!==options.trade)return false;if(options.type&&options.type!=='All types'&&String(row.type||'')!==options.type)return false;if(options.brand&&options.brand!=='All brands'&&String(row.brand||'')!==options.brand)return false;if(options.color&&options.color!=='All colors'&&String(pricingColorValue(row)||'')!==options.color)return false;var q=String(options.search||'').toLowerCase().trim();if(q&&pricingSearchText(row).indexOf(q)<0)return false;return true}
function pricingReportRows(options){var source=pricingState.allRows.length?pricingState.allRows:pricingState.rows;var rows=source.filter(function(row){return pricingReportMatches(row,options)});pricingSortLocal(rows);return pricingGroupedRows(rows)}
function updatePricingReportSummary(modal){var options=pricingReportOptions(modal);var rows=pricingReportRows(options);var total=rows.reduce(function(sum,row){return sum+moneyNumber(row.price)},0);var count=modal.querySelector('[data-pricing-report-count]');var value=modal.querySelector('[data-pricing-report-value]');if(count)count.textContent=rows.length.toLocaleString('en-US')+' pricing rows';if(value)value.textContent=moneyLabel(total)+' selected total'}
function setQuickPricingReport(modal,type){if(type==='current'){var map={state:pricingState.filters.state,supplier:pricingState.filters.supplier,trade:pricingState.filters.trade,type:pricingState.filters.type,search:pricingState.filters.search,sort:pricingState.filters.sort};Object.keys(map).forEach(function(key){var field=modal.querySelector('[data-pricing-report-field="'+key+'"]');if(field)field.value=map[key]||field.options[0].value})}else if(type==='all'){modal.querySelectorAll('[data-pricing-report-field]').forEach(function(field){field.value=field.options&&field.options.length?field.options[0].value:''})}else if(type==='no-color'){var field=modal.querySelector('[data-pricing-report-field="color"]');if(field)field.value='All colors'}updatePricingReportSummary(modal)}
function openPricingReportsModal(){if(!pricingState.cacheReady)loadPricingStaticData();var modal=document.createElement('div');modal.className='citadel-modal-backdrop';var selected=pricingDisplayColumns();var available=pricingAvailableColumns();modal.innerHTML='<section class="citadel-report-modal" role="dialog" aria-modal="true" aria-label="Pricing Reports"><div class="modal-head"><div><h3>Pricing Reports</h3><p>Build exports from the full pricing snapshot, not just the visible page.</p></div><button type="button" data-close-modal aria-label="Close">x</button></div><div class="report-callout">Choose the states, suppliers, trades, product details, search text, and columns to include.</div><div class="report-band"><div class="report-band-head"><strong>Quick Reports</strong><span>Common exports</span></div><div class="quick-report-grid"><button type="button" data-pricing-quick-report="current">Current View</button><button type="button" data-pricing-quick-report="all">All Pricing</button><button type="button" data-pricing-quick-report="no-color">All Colors</button></div></div><div class="report-custom"><div class="report-band-head"><strong>Custom Report</strong><span>Filters and columns</span></div><div class="report-form-grid">'+pricingReportSelect('State','state','All states',pricingUniqueValues('state'),pricingState.filters.state)+pricingReportSelect('Supplier','supplier','All suppliers',pricingUniqueValues('supplier'),pricingState.filters.supplier)+pricingReportSelect('Trade','trade','All trades',pricingUniqueValues('trade'),pricingState.filters.trade)+pricingReportSelect('Type','type','All types',pricingUniqueValues('type'),pricingState.filters.type)+pricingReportSelect('Brand','brand','All brands',pricingUniqueValues('brand'),'All brands')+pricingReportSelect('Color','color','All colors',pricingUniqueValues('color'),'All colors')+'<label>Sort<select data-pricing-report-field="sort"><option'+(pricingState.filters.sort==='Default'?' selected':'')+'>Default</option><option'+(pricingState.filters.sort==='Lowest price'?' selected':'')+'>Lowest price</option><option'+(pricingState.filters.sort==='Highest price'?' selected':'')+'>Highest price</option><option'+(pricingState.filters.sort==='Name A-Z'?' selected':'')+'>Name A-Z</option></select></label>'+pricingReportInput('Search Text','search','Name, item, color, supplier',pricingState.filters.search)+'</div><div class="pricing-column-panel pricing-report-columns">'+available.map(function(key){return '<label><input type="checkbox" data-pricing-report-column="'+escapeHtml(key)+'" '+(selected.indexOf(key)>-1?'checked':'')+'> '+escapeHtml(pricingColumnLabel(key))+'</label>'}).join('')+'</div></div><div class="report-summary-row"><div class="report-parameters"><strong>Report Parameters</strong><span>State: <b data-report-param="state"></b></span><span>Supplier: <b data-report-param="supplier"></b></span><span>Trade: <b data-report-param="trade"></b></span><span>Type: <b data-report-param="type"></b></span><span>Brand: <b data-report-param="brand"></b></span><span>Color: <b data-report-param="color"></b></span></div><div class="report-total"><strong data-pricing-report-count>0 rows</strong><span>Matching pricing records</span><em data-pricing-report-value>$0.00 selected total</em></div></div><div class="modal-actions"><button type="button" data-pricing-report-reset>Reset</button><span></span><select data-pricing-report-format><option value="csv">CSV</option><option value="excel">Excel</option></select><button type="button" data-close-modal>Cancel</button><button type="button" data-pricing-report-export>Export</button></div></section>';function syncParams(){var options=pricingReportOptions(modal);['state','supplier','trade','type','brand','color'].forEach(function(key){var slot=modal.querySelector('[data-report-param="'+key+'"]');if(slot)slot.textContent=options[key]||'All'})}modal.addEventListener('click',function(event){var quick=event.target.closest('[data-pricing-quick-report]');if(quick){setQuickPricingReport(modal,quick.getAttribute('data-pricing-quick-report'));syncParams();return}if(event.target.closest('[data-pricing-report-reset]')){setQuickPricingReport(modal,'all');syncParams();return}if(event.target.closest('[data-pricing-report-export]')){var options=pricingReportOptions(modal);var formatField=modal.querySelector('[data-pricing-report-format]');options.format=formatField?formatField.value:'csv';exportPricingReportCsv(options);return}if(event.target===modal||event.target.closest('[data-close-modal]'))closeLiensReportsModal()});modal.addEventListener('input',function(){updatePricingReportSummary(modal);syncParams()});modal.addEventListener('change',function(){updatePricingReportSummary(modal);syncParams()});document.body.appendChild(modal);updatePricingReportSummary(modal);syncParams()}
function pricingReportTable(options){var columns=options.columns&&options.columns.length?options.columns:pricingDisplayColumns();var rows=pricingReportRows(options);var filterRow=['Filters','State: '+options.state,'Supplier: '+options.supplier,'Trade: '+options.trade,'Type: '+options.type,'Brand: '+options.brand,'Color: '+options.color,'Search: '+options.search,'Sort: '+options.sort];return {columns:columns,rows:rows,table:[filterRow,[],columns.map(pricingColumnLabel)].concat(rows.map(function(row){return columns.map(function(key){var value=row[key];if(/price|rate|amount|cost|total/i.test(key)&&value!=='')value=moneyLabel(value);return value})}))}}
function exportPricingReportCsv(options){options=options||{columns:pricingDisplayColumns(),state:pricingState.filters.state,supplier:pricingState.filters.supplier,trade:pricingState.filters.trade,type:pricingState.filters.type,brand:'All brands',color:'All colors',search:pricingState.filters.search,sort:pricingState.filters.sort};var format=(options.format||'csv').toLowerCase();var report=pricingReportTable(options);if(format==='excel'){var html='<!doctype html><html><head><meta charset="UTF-8"></head><body><table>'+report.table.map(function(row){return '<tr>'+row.map(function(cell){return '<td>'+escapeHtml(cell==null?'':cell)+'</td>'}).join('')+'</tr>'}).join('')+'</table></body></html>';downloadReportBlob('\uFEFF'+html,'application/vnd.ms-excel;charset=utf-8','citadel-pricing-report.xls');return}var csv='\uFEFF'+report.table.map(function(row){return row.map(function(cell){return '"'+String(cell==null?'':cell).replace(/"/g,'""')+'"'}).join(',')}).join('\n');downloadReportBlob(csv,'text/csv;charset=utf-8','citadel-pricing-report.csv')}
function bindPricingPage(){if(pricingPageEventsBound)return;pricingPageEventsBound=true;pagePanel.addEventListener('click',function(event){if(activePage!=='pricing')return;var columnsButton=event.target.closest('[data-pricing-columns]');if(columnsButton){var panel=pagePanel.querySelector('.pricing-column-panel');if(panel)panel.hidden=!panel.hidden;return}if(event.target.closest('[data-pricing-refresh]')){pricingState.allRows=[];pricingState.cacheReady=false;pricingState.offset=0;startPricingCacheLoad(true);return}if(event.target.closest('[data-pricing-report]')){openPricingReportsModal();return}var pager=event.target.closest('[data-pricing-page]');if(pager){var dir=pager.getAttribute('data-pricing-page');pricingState.offset=Math.max(0,pricingState.offset+(dir==='next'?pricingState.limit:-pricingState.limit));if(pricingState.cacheReady){applyPricingLocalView();renderPricingPage()}else loadPricingData();return}});pagePanel.addEventListener('change',function(event){if(activePage!=='pricing')return;var colorField=event.target.closest('[data-pricing-color-group]');if(colorField){pricingColorSelections[colorField.getAttribute('data-pricing-color-group')]=colorField.value;renderPricingPageKeepingSearch();return}var col=event.target.closest('[data-pricing-column]');if(col){var selected=Array.from(pagePanel.querySelectorAll('[data-pricing-column]:checked')).map(function(input){return input.getAttribute('data-pricing-column')});pricingState.visibleColumns=selected;renderPricingPage();var panel=pagePanel.querySelector('.pricing-column-panel');if(panel)panel.hidden=false;return}var field=event.target.closest('select[data-pricing-filter]');if(!field)return;pricingState.filters[field.getAttribute('data-pricing-filter')]=field.value;pricingState.offset=0;if(pricingState.cacheReady){applyPricingLocalView();renderPricingPage()}else loadPricingData()});pagePanel.addEventListener('input',function(event){if(activePage!=='pricing')return;var search=event.target.closest('input[data-pricing-filter="search"]');if(!search)return;pricingState.filters.search=search.value;window.clearTimeout(pricingSearchTimer);pricingSearchTimer=window.setTimeout(function(){pricingState.offset=0;if(pricingState.cacheReady){applyPricingLocalView();renderPricingPageKeepingSearch()}else loadPricingData()},500)})}
function loadPricingData(){if(!pricingState.cacheReady&&loadPricingStaticData()){if(activePage==='pricing')renderPricingPageKeepingSearch();return}if(!CITADEL_API_URL){pricingState.loading=false;return}if(pricingState.cacheReady){applyPricingLocalView();renderPricingPageKeepingSearch();return}var requestId=++pricingRequestId;pricingState.loading=true;pricingState.error='';if(activePage==='pricing'&&!pricingSearchIsActive())renderPricingPage();var query='?action=getPricing&limit='+encodeURIComponent(pricingState.limit)+'&offset='+encodeURIComponent(pricingState.offset)+'&search='+encodeURIComponent(pricingState.filters.search)+'&state='+encodeURIComponent(pricingState.filters.state)+'&trade='+encodeURIComponent(pricingState.filters.trade)+'&type='+encodeURIComponent(pricingState.filters.type)+'&supplier='+encodeURIComponent(pricingState.filters.supplier)+'&sort='+encodeURIComponent(pricingState.filters.sort);jsonp(CITADEL_API_URL+query).then(function(response){if(requestId!==pricingRequestId)return;if(!response||!response.ok||!response.data)throw new Error(response&&response.error?response.error:'No pricing data returned');pricingState.headers=response.data.headers||[];pricingState.keys=response.data.keys||[];pricingState.rows=response.data.rows||[];pricingState.total=Number(response.data.total||0);pricingState.offset=Number(response.data.offset||0);pricingState.limit=Number(response.data.limit||pricingState.limit);pricingState.states=response.data.states||[];pricingState.trades=response.data.trades||[];pricingState.types=response.data.types||[];pricingState.suppliers=response.data.suppliers||[];pricingState.sheet=response.data.sheet||'';pricingState.loading=false;if(activePage==='pricing')renderPricingPageKeepingSearch()}).catch(function(error){if(requestId!==pricingRequestId)return;pricingState.loading=false;pricingState.error=error.message||'Pricing sheet is not connected yet';if(activePage==='pricing')renderPricingPageKeepingSearch()})}
function startPricingCacheLoad(force){if(!CITADEL_API_URL||pricingState.cacheLoading)return;hydratePricingFromCache().then(function(found){if(found&&!force){if(activePage==='pricing')renderPricingPageKeepingSearch();return}pricingState.cacheLoading=true;pricingState.error='';pricingState.cacheMessage='Loading most current pricing';if(activePage==='pricing'&&!pricingSearchIsActive())renderPricingPage();var rows=[];function loadChunk(offset){var query='?action=getPricing&limit='+encodeURIComponent(pricingState.chunkSize)+'&offset='+encodeURIComponent(offset)+'&sort=Default';return jsonp(CITADEL_API_URL+query).then(function(response){if(!response||!response.ok||!response.data)throw new Error(response&&response.error?response.error:'No pricing data returned');var data=response.data;pricingState.headers=data.headers||pricingState.headers;pricingState.keys=data.keys||pricingState.keys;pricingState.sheet=data.sheet||pricingState.sheet;pricingState.states=data.states||pricingState.states;pricingState.trades=data.trades||pricingState.trades;pricingState.types=data.types||pricingState.types;pricingState.suppliers=data.suppliers||pricingState.suppliers;rows=rows.concat(data.rows||[]);pricingState.cacheMessage='Loading most current pricing: '+rows.length+' of '+(data.total||'...')+' rows';pricingState.allRows=rows.slice();if(activePage==='pricing'&&!pricingSearchIsActive())renderPricingPage();if(rows.length<(data.total||0)&&data.rows&&data.rows.length)return loadChunk(offset+data.rows.length);pricingState.allRows=rows;pricingState.cacheReady=true;pricingState.cacheLoading=false;refreshPricingFacets();applyPricingLocalView();return pricingDbReplace(rows,{headers:pricingState.headers,keys:pricingState.keys,sheet:pricingState.sheet})})}return loadChunk(0)}).then(function(){pricingState.cacheLoading=false;if(activePage==='pricing')renderPricingPageKeepingSearch()}).catch(function(error){pricingState.cacheLoading=false;pricingState.error=error.message||'Pricing cache failed';if(activePage==='pricing')renderPricingPageKeepingSearch()})}

var pageDetails={"data-connections":{section:"Source management",focus:"Monitor integrations, feed status, sync health, credential expiration, and the quality checks that keep the platform trustworthy.",metrics:[["Sources","24","21 healthy"],["Failed Syncs","3","needs review"],["Freshness","12m","median delay"],["Mappings","148","5 pending"]],queue:[["Broken feeds","3"],["Pending maps","5"],["Warnings","12"]]},inbox:{section:"Message triage",focus:"Centralize incoming requests, escalations, shared notes, and system-generated messages so nothing important sits outside the workflow.",metrics:[["Unread","37","9 priority"],["Assigned","22","active"],["Escalations","6","legal included"],["Avg Response","1.8h","within target"]],queue:[["Urgent","9"],["Needs owner","7"],["Waiting","14"]]},tasks:{section:"Execution queue",focus:"Coordinate task ownership, due dates, blockers, dependencies, and completion status across operational teams.",metrics:[["Open Tasks","126","31 due today"],["Blocked","12","owner needed"],["Completed","48","today"],["On Time","91%","rolling 7 days"]],queue:[["Overdue","11"],["Due today","31"],["Unassigned","6"]]},legal:{section:"Risk workflow",focus:"Track matters, exceptions, approval gates, document requests, and legal review items with clear ownership and next actions.",metrics:[["Open Matters","18","4 urgent"],["Approvals","9","pending"],["Docs Needed","15","from field"],["Risk Flags","7","watchlist"]],queue:[["New matters","4"],["Review needed","9"],["Expired docs","3"]]},reviews:{section:"Quality control",focus:"Manage operational reviews, audit outcomes, exception scoring, quality checks, and approval history in one place.",metrics:[["Reviews","64","this cycle"],["Pass Rate","88%","up 3%"],["Rechecks","10","scheduled"],["Findings","21","open"]],queue:[["Awaiting review","16"],["Recheck","10"],["Approved","38"]]},pricing:{section:"Rate intelligence",focus:"Compare pricing signals, margin movement, exceptions, contract terms, and recommended adjustments without crowding the rest of the app.",metrics:[["Active Rates","312","across regions"],["Exceptions","17","needs approval"],["Margin","22.8%","weighted"],["Change Queue","26","pending"]],queue:[["Approve","17"],["Model updates","6"],["Expiring","12"]]},"fleet-vehicles":{section:"Fleet management",focus:"Maintain vehicle records, registration status, utilization, service windows, and compliance exceptions for the active fleet.",metrics:[["Vehicles","284","247 active"],["Service Due","18","next 14 days"],["Utilization","73%","fleet average"],["Offline","11","review"]],queue:[["Service due","18"],["Missing docs","7"],["Inactive","11"]]},"fleet-drivers":{section:"Fleet management",focus:"Track driver status, onboarding, documents, credential expiration, region assignments, and performance exceptions.",metrics:[["Drivers","412","389 active"],["Expiring Docs","23","next 30 days"],["Onboarding","31","in progress"],["Flagged","8","review"]],queue:[["Docs expiring","23"],["Onboarding","31"],["Flagged","8"]]},"region-health":{section:"Market signals",focus:"Evaluate regional capacity, backlog, compliance pressure, contractor coverage, and revenue risk by market.",metrics:[["Regions","18","tracked"],["Healthy","14","green"],["Watchlist","4","needs action"],["Coverage","92%","target 95%"]],queue:[["Watchlist","4"],["Capacity gaps","6"],["Escalations","3"]]},contractors:{section:"Partner network",focus:"Manage contractor profiles, documents, assignments, coverage zones, quality scores, and payment readiness.",metrics:[["Contractors","156","139 active"],["Pending Docs","29","follow up"],["Coverage Gaps","6","regions"],["Score Avg","4.6","last 90 days"]],queue:[["Pending docs","29"],["Low score","5"],["Needs assignment","12"]]}};

var STANDARD_FILTERS={
  "data-connections":[["Source","All sources",["Google Sheets","Apps Script","Blaze","Manual"]],["Status","All statuses",["Healthy","Warning","Failed","Pending"]],["Owner","All owners",["Amanda","Carlynn","Ops","Admin"]],["Sort","Most recent",["Most recent","Needs attention","Source name"]]],
  inbox:[["Type","All messages",["Request","Alert","Escalation","System"]],["Priority","All priorities",["Urgent","High","Normal","Low"]],["Owner","All owners",["Amanda","Carlynn","Ops","Finance"]],["Sort","Newest first",["Newest first","Priority","Oldest first"]]],
  tasks:[["Status","All statuses",["Open","Blocked","In Progress","Done"]],["Priority","All priorities",["Urgent","High","Normal","Low"]],["Owner","All owners",["Amanda","Carlynn","Ops","Legal"]],["Sort","Due soon",["Due soon","Priority","Newest"]]],
  legal:[["Status","All statuses",["Open","Review","Approved","Blocked"]],["Risk","All risks",["Critical","High","Monitor","Low"]],["Owner","All owners",["Legal","Amanda","Carlynn","Ops"]],["Sort","Highest risk",["Highest risk","Due soon","Newest"]]],
  reviews:[["Status","All statuses",["Awaiting Review","In Review","Approved","Recheck"]],["Result","All results",["Pass","Finding","Exception","Recheck"]],["Owner","All owners",["Amanda","Carlynn","Ops","Quality"]],["Sort","Newest first",["Newest first","Findings first","Due soon"]]],
  pricing:[["Region","All regions",["All active","Wisconsin","St. Louis","Indianapolis","Chicago"]],["Category","All categories",["Labor","Materials","Exceptions","Contracts"]],["Status","All statuses",["Active","Pending","Needs Approval","Expired"]],["Sort","Needs approval",["Needs approval","Newest","Highest margin impact"]]],
  "fleet-vehicles":[["Status","All statuses",["Active","Service Due","Offline","Inactive"]],["Service","All service",["Due Soon","Overdue","Scheduled","Complete"]],["Region","All regions",["Wisconsin","St. Louis","Indianapolis","Chicago"]],["Sort","Service due",["Service due","Region","Vehicle ID"]]],
  "fleet-drivers":[["Status","All statuses",["Active","Onboarding","Flagged","Inactive"]],["Credential","All credentials",["Expiring Soon","Expired","Missing","Current"]],["Region","All regions",["Wisconsin","St. Louis","Indianapolis","Chicago"]],["Sort","Expiring soon",["Expiring soon","Flagged first","Driver name"]]],
  "region-health":[["Region","All regions",["Wisconsin","St. Louis","Indianapolis","Chicago","Santa Fe"]],["Health","All health",["Healthy","Watchlist","Critical","No Coverage"]],["Coverage","All coverage",["Covered","Gap","Low Capacity","Escalated"]],["Sort","Needs attention",["Needs attention","Coverage low","Region name"]]]
};

var activePage="command-center";
var primaryNav=document.querySelector("#primaryNav"),pageTitle=document.querySelector("#pageTitle"),subTabs=document.querySelector("#subTabs"),pagePanel=document.querySelector(".page-panel");

function escapeHtml(value){return String(value==null?"":value).replace(/[&<>'"]/g,function(char){return {"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]})}
function moneyNumber(value){var number=Number(String(value||"").replace(/[^0-9.-]/g,""));return isNaN(number)?0:number}
function moneyLabel(value){var number=moneyNumber(value);return "$"+number.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}
function renderModuleStatusLine(status){return '<div class="module-status-line">'+(status?'<span class="module-status-pill"><i></i>'+escapeHtml(status)+'</span>':'')+'</div>'}
function getPageLabel(pageId){var flat=[];pages.forEach(function(page){flat.push(page);(page.children||[]).forEach(function(child){flat.push(child)})});var found=flat.find(function(page){return page.id===pageId});return found?found.label:"Command Center"}


function showUpdateToast(latestVersion){if(document.querySelector('.update-toast'))return;var toast=document.createElement('div');toast.className='update-toast';toast.innerHTML='<strong>Update available</strong><span>Citadel '+escapeHtml(latestVersion)+' is ready.</span><button type="button" data-update-now>Refresh</button><button type="button" data-update-dismiss aria-label="Dismiss">x</button>';toast.addEventListener('click',function(event){if(event.target.closest('[data-update-now]')){try{localStorage.setItem('citadel_version_seen',latestVersion)}catch(error){}forceCitadelRefresh()}if(event.target.closest('[data-update-dismiss]'))toast.remove()});document.body.appendChild(toast)}
function checkForCitadelUpdate(){try{fetch('./version.json?ts='+Date.now(),{cache:'no-store'}).then(function(response){return response.ok?response.json():null}).then(function(info){if(!info||!info.version)return;if(String(info.version)!==String(CITADEL_VERSION))showUpdateToast(info.version);else localStorage.setItem('citadel_version_seen',CITADEL_VERSION)}).catch(function(){})}catch(error){}}
function clearCitadelLocalCaches(){try{Object.keys(localStorage).forEach(function(key){if(key.indexOf('citadel')===0||key.indexOf('liens')>-1||key.indexOf('contractor')>-1||key.indexOf('review')>-1||key.indexOf('fleet')>-1)localStorage.removeItem(key)})}catch(error){}try{sessionStorage.clear()}catch(error){}}
function forceCitadelRefresh(){clearCitadelLocalCaches();var clean=location.origin+location.pathname;location.replace(clean+'?fresh='+Date.now())}
function initForceRefreshButton(){var button=document.querySelector('#forceRefreshButton');if(!button)return;button.addEventListener('click',forceCitadelRefresh)}


function applyTheme(theme){var nextTheme=theme==="light"?"light":"dark";document.body.setAttribute("data-theme",nextTheme);try{localStorage.setItem("citadel-theme",nextTheme)}catch(error){}document.querySelectorAll("[data-theme-choice]").forEach(function(button){button.classList.toggle("active",button.getAttribute("data-theme-choice")===nextTheme)})}
function initSettingsMenu(){var button=document.querySelector("#settingsButton");var menu=document.querySelector("#settingsMenu");if(!button||!menu)return;var savedTheme="dark";try{savedTheme=localStorage.getItem("citadel-theme")||"dark"}catch(error){}applyTheme(savedTheme);button.addEventListener("click",function(event){event.stopPropagation();var isHidden=menu.hidden;menu.hidden=!isHidden;button.setAttribute("aria-expanded",String(isHidden))});menu.addEventListener("click",function(event){event.stopPropagation();var target=event.target.closest("[data-theme-choice]");if(target)applyTheme(target.getAttribute("data-theme-choice"))});document.addEventListener("click",function(){menu.hidden=true;button.setAttribute("aria-expanded","false")});document.addEventListener("keydown",function(event){if(event.key==="Escape"){menu.hidden=true;button.setAttribute("aria-expanded","false");closeLiensReportsModal()}})}

function renderNavigation(){primaryNav.innerHTML="";pages.forEach(function(page){var group=document.createElement("div");var button=document.createElement("button");var isActive=activePage===page.id||(page.children||[]).some(function(child){return child.id===activePage});button.className="nav-item"+(isActive?" active":"");button.type="button";button.innerHTML='<span class="nav-label">'+escapeHtml(page.label)+'</span>'+(page.children?'<span class="chevron">v</span>':"");button.addEventListener("click",function(){setActivePage(page.id)});group.appendChild(button);if(page.children){var subNav=document.createElement("div");subNav.className="sub-nav";page.children.forEach(function(child){var childButton=document.createElement("button");childButton.className="sub-nav-item"+(activePage===child.id?" active":"");childButton.type="button";childButton.textContent=child.label;childButton.addEventListener("click",function(){setActivePage(child.id)});subNav.appendChild(childButton)});group.appendChild(subNav)}primaryNav.appendChild(group)})}
function renderSubTabs(){var fleet=pages.find(function(page){return page.id==="fleet"});var isFleet=activePage==="fleet"||fleet.children.some(function(child){return child.id===activePage});subTabs.hidden=!isFleet;subTabs.innerHTML="";if(!isFleet)return;[{id:"fleet",label:"Overview"}].concat(fleet.children).forEach(function(child){var button=document.createElement("button");button.className="sub-tab"+(activePage===child.id?" active":"");button.type="button";button.textContent=child.label;button.addEventListener("click",function(){setActivePage(child.id)});subTabs.appendChild(button)})}


function getLienAttentionCount(row){return Number(row.alerts_count||0)+Number(row.followups_count||0)}
function workflowItemIsOpen(item){
  if(!item)return false;
  var active=String(item.active==null?'':item.active).toLowerCase();
  if(active==='false'||active==='0'||active==='no'||active==='inactive')return false;
  return !/completed|closed|resolved|removed|inactive/i.test(String(item.status||''));
}
function workflowRowsForModule(moduleId){
  var source={
    liens:{label:'Liens',alerts:liensData.alerts,followUps:liensData.followUps},
    collections:{label:'Collections',alerts:collectionsData.alerts,followUps:[]},
    registrations:{label:'Registrations',alerts:registrationsSummary.alerts,followUps:registrationsSummary.followUps},
    contractors:{label:'Contractors',alerts:contractorsData.alerts,followUps:contractorsData.followUps},
    reviews:{label:'Reviews',alerts:reviewsData.alerts,followUps:reviewsData.followUps},
    fleet:{label:'Fleet',alerts:fleetData.alerts,followUps:fleetData.followUps}
  }[moduleId];
  if(!source)return [];
  var alertRows=(source.alerts||[]).filter(workflowItemIsOpen).map(function(item){
    return {source:source.label,text:item.alert_text||item.alert_type||'Alert',meta:[item.owner||'Team',item.due_date||item.created_date||'No due date'].join(' - ')};
  });
  var followRows=(source.followUps||[]).filter(workflowItemIsOpen).map(function(item){
    return {source:source.label,text:item.followup_text||item.followup_type||'Follow-up',meta:[item.assigned_to||item.created_by||'Team',item.due_date||item.created_date||'No due date'].join(' - ')};
  });
  return alertRows.concat(followRows);
}
function allOpenWorkflowRows(){
  return ['liens','collections','registrations','contractors','reviews','fleet'].reduce(function(rows,moduleId){
    return rows.concat(workflowRowsForModule(moduleId));
  },[]);
}
function moduleConnectionState(loading,error,updated,hasData){
  if(loading&&!updated&&!hasData)return {key:'loading',label:'Loading live data',live:false};
  if(error&&!updated&&!hasData)return {key:'unavailable',label:'Unavailable',live:false};
  return {key:'live',label:updated?'Updated '+updated:'Live',live:true};
}
function disconnectedCommandModule(id,label){
  return {id:id,label:label,primary:'Not connected',secondary:'No live source is configured',alerts:null,state:'not-connected',statusLabel:'Not connected',live:false};
}
function liveCommandModule(id,label,connection,primary,secondary,alerts,error){
  if(!connection.live){
    return {id:id,label:label,primary:connection.label,secondary:error||'Waiting for a live response',alerts:null,state:connection.key,statusLabel:connection.label,live:false};
  }
  return {id:id,label:label,primary:primary,secondary:secondary,alerts:alerts,state:connection.key,statusLabel:connection.label,live:true};
}
function getCommandCenterModules(){
  var lienRecords=liensData.records||[];
  var contractorRecords=contractorsData.records||[];
  var reviewRecords=reviewsData.records||[];
  var collectionRecords=collectionsData.records||[];
  var fleetVehicles=fleetData.vehicles||[];
  var fleetDrivers=fleetData.drivers||[];
  var registrationMetrics=registrationsSummary.metrics||{};
  var lienState=moduleConnectionState(liensLoading,liensLoadError,liensLastUpdated,lienRecords.length>0);
  var registrationState=moduleConnectionState(registrationsSummaryLoading,registrationsSummaryError,registrationsSummaryUpdated,Object.keys(registrationMetrics).length>0);
  var contractorState=moduleConnectionState(contractorsLoading,contractorsLoadError,contractorsLastUpdated,contractorRecords.length>0);
  var reviewState=moduleConnectionState(reviewsLoading,reviewsLoadError,reviewsLastUpdated,reviewRecords.length>0);
  var collectionState=moduleConnectionState(collectionsLoading,collectionsLoadError,collectionsLastUpdated,collectionRecords.length>0||collectionsLastUpdated);
  var fleetState=moduleConnectionState(fleetLoading,fleetLoadError,fleetLastUpdated,fleetVehicles.length>0||fleetDrivers.length>0||fleetData.sourceRows.length>0);
  var pricingRows=Number(pricingState.total||pricingState.allRows.length||0);
  var pricingLive=pricingState.cacheReady||pricingRows>0;
  var sourceModules=[
    liveCommandModule('liens','Liens',lienState,lienRecords.length+' lien records',moneyLabel(lienRecords.reduce(function(sum,row){return sum+moneyNumber(row.balance)},0))+' exposure',workflowRowsForModule('liens').length,liensLoadError),
    liveCommandModule('collections','Collections',collectionState,collectionRecords.length+' collection jobs',moneyLabel(collectionRecords.reduce(function(sum,row){return sum+moneyNumber(row.amountOutstanding)},0))+' outstanding',workflowRowsForModule('collections').length,collectionsLoadError),
    liveCommandModule('registrations','Registrations',registrationState,Number(registrationMetrics.open_requests||0)+' open / '+Number(registrationMetrics.active_registrations||0)+' active',Number(registrationMetrics.archived_requests||0)+' archived',workflowRowsForModule('registrations').length,registrationsSummaryError),
    liveCommandModule('contractors','Contractors',contractorState,contractorRecords.length+' contractor records',contractorRecords.filter(function(row){return /expired/i.test(row.documents)}).length+' with expired documents',workflowRowsForModule('contractors').length,contractorsLoadError),
    liveCommandModule('reviews','Reviews',reviewState,reviewRecords.length+' review records',reviewRecords.filter(function(row){return Number(row.rating||0)>0&&Number(row.rating)<4}).length+' below 4 stars',workflowRowsForModule('reviews').length,reviewsLoadError),
    liveCommandModule('pricing','Pricing',{key:pricingLive?'live':'unavailable',label:pricingLive?'Snapshot ready':'Pricing snapshot unavailable',live:pricingLive},pricingRows+' pricing rows',(pricingState.states||[]).length+' states represented',null,pricingState.error),
    liveCommandModule('fleet','Fleet',fleetState,fleetVehicles.length+' vehicles / '+fleetDrivers.length+' drivers',fleetVehicles.filter(fleetVehicleServiceDue).length+' service items due',workflowRowsForModule('fleet').length,fleetLoadError)
  ];
  var connected=sourceModules.filter(function(module){return module.live}).length;
  var aggregateAlerts=allOpenWorkflowRows().length;
  var liveRegions=getRegionHealthRows().filter(function(row){return row.score!=null}).length;
  var byId={};
  sourceModules.forEach(function(module){byId[module.id]=module});
  return [
    byId.liens,
    byId.collections,
    byId.registrations,
    byId.contractors,
    disconnectedCommandModule('tasks','Tasks'),
    disconnectedCommandModule('legal','Legal'),
    byId.reviews,
    byId.pricing,
    byId.fleet,
    {id:'region-health',label:'Region Health',primary:liveRegions+' regions with live signals',secondary:'Derived from mapped module records',alerts:aggregateAlerts,state:'derived',statusLabel:'Live derived view',live:true},
    {id:'data-connections',label:'Data Connections',primary:connected+' of '+sourceModules.length+' sources live',secondary:(sourceModules.length-connected)+' unavailable or loading',alerts:null,state:'derived',statusLabel:'Connection summary',live:true},
    {id:'inbox',label:'Inbox',primary:aggregateAlerts+' open workflow items',secondary:'Across connected workspaces',alerts:aggregateAlerts,state:'derived',statusLabel:'Live alert rollup',live:true}
  ];
}
function renderCommandCenter(){
  var modules=getCommandCenterModules();
  var sourceModules=modules.filter(function(module){return ['liens','collections','registrations','contractors','reviews','pricing','fleet'].indexOf(module.id)>-1});
  var connected=sourceModules.filter(function(module){return module.live}).length;
  var selected=modules.find(function(module){return module.id===selectedCommandModule})||modules[0];
  function moduleRow(module){
    var note=getCommandFocusNote(module.id);
    var alertText=module.alerts==null?'No alert workflow':module.alerts+' open alert'+(module.alerts===1?'':'s');
    return '<article class="command-row '+(module.id===selected.id?'is-selected ':'')+(module.live?'is-live':'')+'" data-command-module="'+escapeHtml(module.id)+'"><div class="command-row-summary"><strong>'+escapeHtml(module.label)+'</strong><span>'+escapeHtml(module.primary)+' - '+escapeHtml(module.secondary)+' - '+escapeHtml(alertText)+'</span></div><div class="command-row-focus"><textarea data-command-note="'+escapeHtml(module.id)+'" rows="1" placeholder="Focus note for Carlynn">'+escapeHtml(note)+'</textarea><label class="done-control"><span>Done</span><input type="checkbox" data-command-done="'+escapeHtml(module.id)+'"'+(note?'':' disabled')+'></label></div></article>';
  }
  pagePanel.className='page-panel command-page';
  pagePanel.innerHTML='<div class="panel-header"><div><p class="section-label">Live overview</p><h2>Command Center</h2></div><div class="status-pill"><span></span>'+escapeHtml(connected+' / '+sourceModules.length+' live sources')+'</div></div><p class="command-intro">Every connected workspace shows live values. Unavailable workspaces are labeled clearly and are never filled with placeholder numbers.</p><div class="command-two-column"><section class="command-module-list">'+modules.map(moduleRow).join('')+'</section><aside class="work-card command-summary-panel"><div class="card-heading"><h3>'+escapeHtml(selected.label)+' Alerts</h3><span>'+escapeHtml(selected.statusLabel)+'</span></div>'+renderCommandAlerts(selected.id,selected)+'</aside></div>';
}
function getCommandFocusNote(moduleId){try{return localStorage.getItem(COMMAND_FOCUS_NOTE_PREFIX+moduleId)||""}catch(error){return ""}}
function setCommandFocusNote(moduleId,value){try{localStorage.setItem(COMMAND_FOCUS_NOTE_PREFIX+moduleId,value)}catch(error){}}
function renderCommandAlerts(moduleId,module){
  if(module&&module.state==='not-connected')return '<div class="command-alert-list"><p class="command-empty-alerts">This workspace is not connected to a live source.</p></div>';
  if(module&&!module.live)return '<div class="command-alert-list"><p class="command-empty-alerts">Live data is currently unavailable for this workspace.</p></div>';
  if(moduleId==='pricing'||moduleId==='data-connections')return '<div class="command-alert-list"><p class="command-empty-alerts">This view does not use workflow alerts.</p></div>';
  var rows=(moduleId==='inbox'||moduleId==='region-health'?allOpenWorkflowRows():workflowRowsForModule(moduleId)).slice(0,8);
  if(!rows.length)return '<div class="command-alert-list"><p class="command-empty-alerts">No open alerts.</p></div>';
  return '<div class="command-alert-list">'+rows.map(function(row){return '<article><strong>'+escapeHtml(row.text)+'</strong><span>'+escapeHtml((moduleId==='inbox'||moduleId==='region-health'?row.source+' - ':'')+row.meta)+'</span></article>'}).join('')+'</div>';
}
function bindCommandCenter(){pagePanel.addEventListener("click",function(event){var row=event.target.closest("[data-command-module]");if(!row)return;if(event.target.closest("textarea")||event.target.closest("input"))return;selectedCommandModule=row.getAttribute("data-command-module");renderCommandCenter();bindCommandCenter()});pagePanel.addEventListener("input",function(event){var target=event.target.closest("[data-command-note]");if(!target)return;var moduleId=target.getAttribute("data-command-note");setCommandFocusNote(moduleId,target.value);var row=target.closest(".command-row");var done=row&&row.querySelector("[data-command-done]");if(done)done.disabled=!target.value.trim()});pagePanel.addEventListener("change",function(event){var done=event.target.closest("[data-command-done]");if(!done||!done.checked)return;var moduleId=done.getAttribute("data-command-done");setCommandFocusNote(moduleId,"");selectedCommandModule=moduleId;renderCommandCenter();bindCommandCenter()})}
function isNoPaymentRecord(row){var direct=String(row.no_payment_received||row.noPaymentReceived||"").toLowerCase();if(/^(true|yes|y|1|x|no payment|none)$/i.test(direct))return true;if(/^(false|no|n|0)$/i.test(direct))return false;var paid=moneyNumber(row.payment_received||row.payments_received||row.amount_paid||row.paid_amount||row.total_paid);if(paid>0)return false;var lastPayment=String(row.last_payment_date||row.lastPaymentDate||"").trim();if(lastPayment)return false;return /no payment|no payments|no deposit|missing deposit/i.test([row.status,row.stage,row.note,row.alert,row.payment_status].join(" "))}
function getLienMetricStats(records){records=records||[];var total=records.reduce(function(sum,row){return sum+moneyNumber(row.balance)},0);var openAlerts=records.filter(function(row){return Number(row.alerts_count||0)>0||Number(row.followups_count||0)>0}).length;var noDeposit=records.filter(isNoPaymentRecord).length;var sixty=records.filter(function(row){return Number(row.days||0)>=60}).length;var agency=records.filter(function(row){return /agency/i.test([row.status,row.stage,row.release_status,row.note,row.alert].join(" "))}).length;return [{key:"open_alerts",label:"Open Alerts",value:openAlerts,note:"Alerts + follow-ups"},{key:"active_accounts",label:"Active Accounts",value:records.length,note:"Current source records"},{key:"total_balance",label:"Total Balance",value:moneyLabel(total),note:"Active lien exposure"},{key:"no_deposit",label:"No Deposit",value:noDeposit,note:"Missing deposit"},{key:"sixty_days",label:"60+ Days",value:sixty,note:"Past due aging"},{key:"sent_to_agency",label:"Sent to Agency",value:agency,note:"Escalated accounts"}]}
function getVisibleLienRecords(){
  var records=liensData.records||[];
  if(activeLienMetric==="open_alerts")records=records.filter(function(row){return Number(row.alerts_count||0)>0||Number(row.followups_count||0)>0});
  if(activeLienMetric==="no_deposit")records=records.filter(isNoPaymentRecord);
  if(activeLienMetric==="sixty_days")records=records.filter(function(row){return Number(row.days||0)>=60});
  if(activeLienMetric==="sent_to_agency")records=records.filter(function(row){return /agency/i.test([row.status,row.stage,row.release_status,row.note,row.alert].join(" "))});
  if(lienFilters.status!=="All statuses")records=records.filter(function(row){return String(row.status)===lienFilters.status});
  if(lienFilters.stage!=="All stages")records=records.filter(function(row){return String(row.stage)===lienFilters.stage});
  if(lienFilters.region!=="All regions")records=records.filter(function(row){return String(row.region)===lienFilters.region});
  if(lienFilters.search){var q=lienFilters.search.toLowerCase();records=records.filter(function(row){return [row.jobNumber,row.id,row.customer,row.region,row.status,row.owner,row.balance].join(" ").toLowerCase().indexOf(q)>=0})}
  records=records.slice();
  if(lienFilters.sort==="Highest balance")records.sort(function(a,b){return moneyNumber(b.balance)-moneyNumber(a.balance)});
  if(lienFilters.sort==="Most past due")records.sort(function(a,b){return Number(b.days||0)-Number(a.days||0)});
  if(lienFilters.sort==="Newest update")records.sort(function(a,b){return String(b.latestInvoice||"").localeCompare(String(a.latestInvoice||""))});
  return records
}
function getLienWorkspaceItems(kind,lienId){return (liensData[kind]||[]).filter(function(item){return String(item.lien_id)===String(lienId)}).reverse()}
function renderLienWorkspaceList(items,emptyText,fields){if(!items.length)return '<p class="liens-empty">'+escapeHtml(emptyText)+'</p>';return '<div class="liens-activity-list">'+items.map(function(item){return '<article>'+fields.map(function(field){return field.strong?'<strong>'+escapeHtml(item[field.key]||field.fallback||'')+'</strong>':'<span>'+escapeHtml(item[field.key]||field.fallback||'')+'</span>'}).join('')+'</article>'}).join('')+'</div>'}
function normalizeLienRecord(record){return {id:record.lien_id||record.id,jobNumber:record.job_number||record['Job Number']||record.source_record_id||record.account_name||record.lien_id||record.id,blazeUrl:record.blaze_url||record.job_link||record['Job Link']||record.url||record.record_url||'',customer:record.customer||record.account_name,region:record.region,status:record.status||record.release_status,stage:record.stage||record.priority,balance:record.balance,owner:record.owner,days:record.days_past_due,firstInvoice:record.first_invoice_date,latestInvoice:record.latest_invoice_date,invoiceCount:record.invoice_count,no_payment_received:record.no_payment_received,payment_received:record.payment_received,payments_received:record.payments_received,amount_paid:record.amount_paid,paid_amount:record.paid_amount,total_paid:record.total_paid,last_payment_date:record.last_payment_date,payment_status:record.payment_status,note:record.workflow_note||record.note||'',alert:record.alert_text||record.alert||'',alerts_count:record.alerts_count||0,notes_count:record.notes_count||0,followups_count:record.followups_count||0,release_status:record.release_status}}
function applyLiensPayload(data){liensData.metrics=data.metrics||[];liensData.notes=data.notes||[];liensData.alerts=data.alerts||[];liensData.followUps=data.followUps||[];liensData.records=(data.records||[]).map(normalizeLienRecord);liensData.selectedIndex=0;liensLastUpdated=new Date().toLocaleTimeString([], {hour:"numeric",minute:"2-digit"})}
function saveLiensCache(data){try{localStorage.setItem(LIENS_CACHE_KEY,JSON.stringify({savedAt:Date.now(),data:data}))}catch(error){console.warn("Liens cache save failed",error)}}
function hydrateLiensFromCache(){try{var cached=JSON.parse(localStorage.getItem(LIENS_CACHE_KEY)||"null");if(!cached||!cached.data||!(cached.data.records||[]).length)return false;applyLiensPayload(cached.data);liensLoading=false;liensLoadError="";liensLastUpdated=cached.savedAt?new Date(cached.savedAt).toLocaleTimeString([], {hour:"numeric",minute:"2-digit"}):liensLastUpdated;return true}catch(error){console.warn("Liens cache read failed",error);return false}}

function getLienRegions(){return Array.from(new Set((liensData.records||[]).map(function(row){return row.region}).filter(Boolean))).sort()}
function renderSelectOptions(allLabel,options,selected){return '<option'+(selected===allLabel?' selected':'')+'>'+escapeHtml(allLabel)+'</option>'+options.map(function(value){return '<option'+(selected===value?' selected':'')+'>'+escapeHtml(value)+'</option>'}).join('')}
function renderLiensLoadingPage(){pagePanel.className="page-panel liens-page";pagePanel.innerHTML='<section class="liens-loading-card"><div class="loading-pulse"></div><h3>Loading lien records</h3><p>First load is pulling the latest Blaze report data. After this, Citadel will open this page from a local snapshot while it refreshes quietly.</p></section>'}
function renderLiensPage(){if(liensLoading&&!liensData.records.length){renderLiensLoadingPage();return}var visibleRecords=getVisibleLienRecords();var selected=liensData.records[liensData.selectedIndex]||visibleRecords[0]||liensData.records[0]||{};var metricStats=getLienMetricStats(liensData.records);pagePanel.className="page-panel liens-page";pagePanel.innerHTML=renderModuleStatusLine(liensLoading?"Refreshing...":liensLastUpdated?"Updated "+liensLastUpdated:"")+'<div class="liens-metrics">'+metricStats.map(function(metric){return '<button type="button" class="lien-metric-button '+(activeLienMetric===metric.key?'active':'')+'" data-lien-metric="'+escapeHtml(metric.key)+'"><span>'+escapeHtml(metric.label)+'</span><strong>'+escapeHtml(metric.value)+'</strong><em>'+escapeHtml(metric.note)+'</em></button>'}).join('')+'</div><section class="liens-filter-card"><div><h3>Filters + Sort + Search</h3><p>Refine and find records the same way on every page</p></div><button type="button" data-open-reports="liens">Reports</button><div class="liens-filters"><label>Status<select data-lien-filter="status">'+renderSelectOptions('All statuses',LIEN_STATUS_OPTIONS,lienFilters.status)+'</select></label><label>Stage<select data-lien-filter="stage">'+renderSelectOptions('All stages',LIEN_STAGE_OPTIONS,lienFilters.stage)+'</select></label><label>Region<select data-lien-filter="region">'+renderSelectOptions('All regions',getLienRegions(),lienFilters.region)+'</select></label><label>Sort<select data-lien-filter="sort"><option'+(lienFilters.sort==='Highest balance'?' selected':'')+'>Highest balance</option><option'+(lienFilters.sort==='Most past due'?' selected':'')+'>Most past due</option><option'+(lienFilters.sort==='Newest update'?' selected':'')+'>Newest update</option></select></label><label>Search<input data-lien-filter="search" type="search" placeholder="Search this view" value="'+escapeHtml(lienFilters.search)+'"></label></div></section><div class="liens-workspace"><section class="liens-records"><div class="liens-section-head"><div><h3>Records</h3><p>Review Blaze report data, notes, alerts, and follow-up work.</p></div><strong>'+escapeHtml(visibleRecords.length)+' showing</strong></div><div class="liens-table" role="table"><div class="liens-table-head" role="row"><span>Account</span><span>Customer</span><span>Region</span><span>Status</span><span>Stage</span><span>Balance</span></div>'+visibleRecords.map(function(record){var index=liensData.records.indexOf(record);return '<div class="liens-row'+(index===liensData.selectedIndex?' active':'')+'" data-lien-index="'+index+'" role="row" tabindex="0"><span>'+(record.blazeUrl?'<a class="record-link" href="'+escapeHtml(record.blazeUrl)+'" target="_blank" rel="noopener">'+escapeHtml(record.jobNumber||record.id)+'</a>':'<a class="record-link record-link-disabled" href="#" title="Blaze URL not included in source report yet">'+escapeHtml(record.jobNumber||record.id)+'</a>')+'<em>'+escapeHtml(record.owner)+'</em></span><span>'+escapeHtml(record.customer)+'</span><span>'+escapeHtml(record.region)+'</span><span><mark>'+escapeHtml(record.status)+'</mark></span><span><mark class="stage-'+escapeHtml(String(record.stage||'').toLowerCase())+'">'+escapeHtml(record.stage)+'</mark></span><span><strong>'+escapeHtml(moneyLabel(record.balance))+'</strong></span></div>'}).join('')+'</div></section><aside class="liens-detail"><div class="liens-detail-head"><div><span>Selected record</span><h3>'+escapeHtml(selected.jobNumber||selected.id)+' - '+escapeHtml(selected.customer)+'</h3><p>Liens / '+escapeHtml(selected.stage)+'</p></div></div><div class="liens-detail-grid"><article><span>Region</span><strong>'+escapeHtml(selected.region)+'</strong></article><article><span>Sales Rep</span><strong>'+escapeHtml(selected.owner)+'</strong></article><article><span>Balance</span><strong>'+escapeHtml(moneyLabel(selected.balance))+'</strong></article><article><span>Days Past Due</span><strong>'+escapeHtml(selected.days)+'</strong></article><article><span>First Invoice</span><strong>'+escapeHtml(selected.firstInvoice)+'</strong></article><article><span>Latest Invoice</span><strong>'+escapeHtml(selected.latestInvoice)+'</strong></article><article><span>Invoice Count</span><strong>'+escapeHtml(selected.invoiceCount)+'</strong></article></div><section class="liens-workflow"><div class="card-heading"><h3>Citadel Workflow</h3><span>Protected from source imports</span></div><div class="workspace-status">'+escapeHtml(liensWorkspaceStatus)+'</div><div class="workflow-entry-actions"><button type="button" data-workspace-entry="note">Add Note</button><button type="button" data-workspace-entry="alert">Set Alert</button></div><div class="liens-workspace-feed"><h4>Recent Notes</h4>'+renderLienWorkspaceList(getLienWorkspaceItems('notes',selected.id),'No notes yet.',[{key:'note_text',strong:true},{key:'note_by',fallback:'Team'},{key:'note_date'}])+'<h4>Open Alerts</h4>'+renderLienWorkspaceList(getLienWorkspaceItems('alerts',selected.id),'No alerts yet.',[{key:'alert_text',strong:true},{key:'owner',fallback:'Carlynn'},{key:'due_date'}])+'<h4>Follow-ups</h4>'+renderLienWorkspaceList(getLienWorkspaceItems('followUps',selected.id),'No follow-ups yet.',[{key:'followup_text',strong:true},{key:'assigned_to',fallback:'Carlynn'},{key:'due_date'}])+'</div></section></aside></div>'}
function closeWorkspaceEntryModal(){
  var modal=document.querySelector(".workspace-entry-backdrop");
  if(modal)modal.remove()
}
function workspaceAlertDateAfterDays(value){
  var days=Math.max(0,Number(value)||0);
  var date=new Date();
  date.setDate(date.getDate()+days);
  return [date.getFullYear(),String(date.getMonth()+1).padStart(2,"0"),String(date.getDate()).padStart(2,"0")].join("-")
}
function getWorkspaceEntryConfig(section){
  if(section==="collections"){
    var collection=collectionsData.records[collectionsData.selectedIndex]||{};
    return {id:collection.id,idField:"collection_id",label:[collection.jobNumber,collection.customer].filter(Boolean).join(" - "),notePlaceholder:"Add a protected collection note",noteAction:"saveCollectionNote",alertAction:"saveCollectionAlert",save:saveCollectionWorkspace}
  }
  if(section==="contractors"){
    var contractor=contractorsData.records[contractorsData.selectedIndex]||{};
    return {id:contractor.id,idField:"contractor_id",label:contractor.name,notePlaceholder:"Add a protected contractor note",noteAction:"saveContractorNote",alertAction:"saveContractorAlert",save:saveContractorWorkspace}
  }
  if(section==="reviews"){
    var review=reviewsData.records[reviewsData.selectedIndex]||{};
    return {id:review.id,idField:"review_id",label:[review.name||review.title,review.platform].filter(Boolean).join(" - "),notePlaceholder:"Add a protected review note",noteAction:"saveReviewNote",alertAction:"saveReviewAlert",save:saveReviewWorkspace}
  }
  var lien=liensData.records[liensData.selectedIndex]||{};
  return {id:lien.id,idField:"lien_id",label:(lien.jobNumber||lien.id)+" - "+lien.customer,notePlaceholder:"Add a protected note",noteAction:"saveLienNote",alertAction:"saveLienAlert",save:saveLienWorkspace}
}
function openWorkspaceEntryModal(section,type){
  closeWorkspaceEntryModal();
  var config=getWorkspaceEntryConfig(section);
  if(!config.id)return;
  var isAlert=type==="alert";
  var title=isAlert?"Set Alert":"Add Note";
  var modal=document.createElement("div");
  modal.className="citadel-modal-backdrop workspace-entry-backdrop";
  modal.innerHTML='<section class="workspace-entry-modal" role="dialog" aria-modal="true" aria-label="'+title+'"><div class="modal-head"><div><h3>'+title+'</h3><p>'+escapeHtml(config.label)+'</p></div><button type="button" data-close-workspace-entry aria-label="Close">X</button></div><form class="workspace-entry-form" data-workspace-entry-form="'+type+'"><div class="workspace-entry-body">'+(isAlert?'<label class="workspace-entry-field">Alert note<textarea name="alert_text" rows="4" placeholder="What needs attention?" required></textarea></label><div class="workspace-alert-options"><label class="workspace-alert-option"><input type="radio" name="alert_mode" value="days" checked><span>Alert in</span><input type="number" name="alert_days" min="0" value="7"><span>days</span></label><label class="workspace-alert-option"><input type="radio" name="alert_mode" value="date"><span>On set date</span><input type="date" name="due_date" disabled></label></div>':'<label class="workspace-entry-field">Protected note<textarea name="note_text" rows="5" placeholder="'+escapeHtml(config.notePlaceholder)+'" required></textarea></label>')+'</div><div class="workspace-entry-actions"><button type="button" data-close-workspace-entry>Cancel</button><button type="submit" class="primary">'+(isAlert?"Save Alert":"Add Note")+'</button></div></form></section>';
  var form=modal.querySelector("[data-workspace-entry-form]");
  var onKeydown=function(event){if(event.key==="Escape")close()};
  function close(){
    document.removeEventListener("keydown",onKeydown);
    modal.remove()
  }
  modal.querySelectorAll("[data-close-workspace-entry]").forEach(function(button){button.addEventListener("click",close)});
  modal.addEventListener("click",function(event){if(event.target===modal)close()});
  form.addEventListener("change",function(event){
    if(event.target.name!=="alert_mode")return;
    var useDate=event.target.value==="date";
    form.elements.alert_days.disabled=useDate;
    form.elements.due_date.disabled=!useDate;
    if(useDate)form.elements.due_date.focus()
  });
  form.addEventListener("submit",function(event){
    event.preventDefault();
    var payload={};
    payload[config.idField]=config.id;
    if(isAlert){
      payload.alert_text=form.elements.alert_text.value.trim();
      if(!payload.alert_text){form.elements.alert_text.focus();return}
      var mode=form.elements.alert_mode.value;
      if(mode==="date"){
        payload.due_date=form.elements.due_date.value;
        if(!payload.due_date){form.elements.due_date.focus();return}
      }else{
        payload.due_date=workspaceAlertDateAfterDays(form.elements.alert_days.value)
      }
    }else{
      payload.note_text=form.elements.note_text.value.trim();
      if(!payload.note_text){form.elements.note_text.focus();return}
    }
    close();
    config.save(isAlert?config.alertAction:config.noteAction,payload)
  });
  document.body.appendChild(modal);
  document.addEventListener("keydown",onKeydown);
  modal.querySelector("textarea").focus()
}
function bindLiensPage(){
  if(liensPageEventsBound)return;
  liensPageEventsBound=true;
  pagePanel.addEventListener("click",function(event){
    if(activePage!=="liens")return;
    var reportButton=event.target.closest("[data-open-reports]");
    if(reportButton){openLiensReportsModal();return}
    var entryButton=event.target.closest("[data-workspace-entry]");
    if(entryButton){openWorkspaceEntryModal("liens",entryButton.getAttribute("data-workspace-entry"));return}
    var metricButton=event.target.closest("[data-lien-metric]");
    if(metricButton){activeLienMetric=metricButton.getAttribute("data-lien-metric");liensData.selectedIndex=0;renderLiensPage();return}
    var row=event.target.closest("[data-lien-index]");
    if(!row)return;
    if(event.target.closest("a.record-link:not(.record-link-disabled)"))return;
    liensData.selectedIndex=Number(row.getAttribute("data-lien-index"));
    renderLiensPage()
  });
  pagePanel.addEventListener("change",function(event){
    if(activePage!=="liens")return;
    var field=event.target.closest("select[data-lien-filter]");
    if(!field)return;
    lienFilters[field.getAttribute("data-lien-filter")]=field.value;
    liensData.selectedIndex=0;
    renderLiensPage()
  });
  pagePanel.addEventListener("input",function(event){
    if(activePage!=="liens")return;
    var field=event.target.closest("input[data-lien-filter='search']");
    if(!field)return;
    lienFilters.search=field.value;
    window.clearTimeout(lienSearchTimer);
    lienSearchTimer=window.setTimeout(function(){
      liensData.selectedIndex=0;
      renderLiensPage();
      var search=pagePanel.querySelector("input[data-lien-filter='search']");
      if(search){search.focus();var end=search.value.length;search.setSelectionRange(end,end)}
    },180)
  })
}
function saveLienWorkspace(action,payload){liensWorkspaceStatus="Saving...";if(activePage==="liens")renderContent();var params=Object.keys(payload).map(function(key){return encodeURIComponent(key)+"="+encodeURIComponent(payload[key]||"")}).join("&");return jsonp(CITADEL_API_URL+"?action="+encodeURIComponent(action)+"&"+params).then(function(response){if(!response||!response.ok)throw new Error(response&&response.error?response.error:"Save failed");liensWorkspaceStatus="Saved";return loadLiensData()}).catch(function(error){liensWorkspaceStatus="Save failed";console.warn("Liens workspace save failed",error);if(activePage==="liens")renderContent()})}

function getLienOwners(){return Array.from(new Set((liensData.records||[]).map(function(row){return row.owner}).filter(Boolean))).sort()}
function setQuickLienReport(type){
  activeLienMetric='all';
  lienFilters.status='All statuses';
  lienFilters.stage='All stages';
  lienFilters.region='All regions';
  lienFilters.search='';
  if(type==='open_alerts')activeLienMetric='open_alerts';
  if(type==='sixty_days')activeLienMetric='sixty_days';
  if(type==='no_deposit')activeLienMetric='no_deposit';
  if(type==='sent_to_agency')activeLienMetric='sent_to_agency';
  if(type==='critical')lienFilters.stage='Critical';
  closeLiensReportsModal();
  liensData.selectedIndex=0;
  renderContent();
}
function getReportFilteredLienRecords(){
  var modal=document.querySelector('.citadel-report-modal');
  var base=getVisibleLienRecords();
  if(!modal)return base;
  var region=modal.querySelector('[data-report-filter="region"]').value;
  var owner=modal.querySelector('[data-report-filter="owner"]').value;
  var status=modal.querySelector('[data-report-filter="status"]').value;
  var stage=modal.querySelector('[data-report-filter="stage"]').value;
  var minDays=Number(modal.querySelector('[data-report-filter="minDays"]').value||0);
  var alertFilter=modal.querySelector('[data-report-filter="alertFilter"]').value;
  var search=modal.querySelector('[data-report-filter="search"]').value.toLowerCase();
  var out=base.filter(function(row){
    if(region!=='All regions'&&row.region!==region)return false;
    if(owner!=='All sales reps'&&row.owner!==owner)return false;
    if(status!=='All statuses'&&row.status!==status)return false;
    if(stage!=='All stages'&&row.stage!==stage)return false;
    if(minDays&&Number(row.days||0)<minDays)return false;
    if(alertFilter==='Open alerts'&&(Number(row.alerts_count||0)+Number(row.followups_count||0))<1)return false;
    if(alertFilter==='No alert set'&&(Number(row.alerts_count||0)+Number(row.followups_count||0))>0)return false;
    if(search&&[row.jobNumber,row.id,row.customer,row.region,row.status,row.owner,row.balance].join(' ').toLowerCase().indexOf(search)<0)return false;
    return true;
  });
  var group=modal.querySelector('[data-report-filter="groupBy"]').value;
  if(group==='Region')out.sort(function(a,b){return String(a.region||'').localeCompare(String(b.region||''))});
  if(group==='Sales Rep')out.sort(function(a,b){return String(a.owner||'').localeCompare(String(b.owner||''))});
  if(group==='Stage')out.sort(function(a,b){return String(a.stage||'').localeCompare(String(b.stage||''))});
  return out;
}
function getReportParameters(modal){
  modal=modal||document.querySelector('.citadel-report-modal');
  var read=function(selector,fallback){var el=modal&&modal.querySelector(selector);return el&&el.value?el.value:fallback};
  var metric=(document.querySelector('[data-lien-metric].active span')||{}).textContent||'Current View';
  return {
    report:'Liens',
    view:metric,
    region:read('[data-report-filter="region"]','All regions'),
    salesRep:read('[data-report-filter="owner"]','All sales reps'),
    status:read('[data-report-filter="status"]','All statuses'),
    stage:read('[data-report-filter="stage"]','All stages'),
    minDays:read('[data-report-filter="minDays"]','Any')||'Any',
    alertFilter:read('[data-report-filter="alertFilter"]','All alerts'),
    groupBy:read('[data-report-filter="groupBy"]','No grouping'),
    search:read('[data-report-filter="search"]','')||'None',
    generated:new Date().toLocaleString()
  }
}
function getLienReportRows(records){
  var headers=['Account','Customer','Region','Sales Rep','Status','Stage','Balance','Days Past Due','First Invoice','Latest Invoice','Blaze URL'];
  var rows=(records||[]).map(function(row){return [row.jobNumber||row.id,row.customer,row.region,row.owner,row.status,row.stage,moneyNumber(row.balance),row.days,row.firstInvoice,row.latestInvoice,row.blazeUrl||'']});
  return {headers:headers,rows:rows}
}
function downloadReportBlob(content,type,filename){
  var blob=new Blob([content],{type:type});
  var link=document.createElement('a');
  var href=URL.createObjectURL(blob);
  link.href=href;
  link.download=filename;
  document.body.appendChild(link);
  link.click();
  window.setTimeout(function(){URL.revokeObjectURL(href);link.remove()},1200);
}
function updateReportSummary(){
  var modal=document.querySelector('.citadel-report-modal');
  if(!modal)return;
  var records=getReportFilteredLienRecords();
  var total=records.reduce(function(sum,row){return sum+moneyNumber(row.balance)},0);
  var params=getReportParameters(modal);
  var count=modal.querySelector('[data-report-count]');
  var balance=modal.querySelector('[data-report-balance]');
  var parameters=modal.querySelector('[data-report-parameters]');
  if(count)count.textContent=records.length+' records';
  if(balance)balance.textContent='View total '+moneyLabel(total);
  if(parameters)parameters.innerHTML='<strong>Report parameters</strong><span>View: '+escapeHtml(params.view)+'</span><span>Status: '+escapeHtml(params.status)+'</span><span>Stage: '+escapeHtml(params.stage)+'</span><span>Region: '+escapeHtml(params.region)+'</span><span>Sales Rep: '+escapeHtml(params.salesRep)+'</span><span>Min days: '+escapeHtml(params.minDays)+'</span><span>Alerts: '+escapeHtml(params.alertFilter)+'</span><span>Search: '+escapeHtml(params.search)+'</span>';
}
function exportLienReportCsv(){
  var records=getReportFilteredLienRecords();
  var report=getLienReportRows(records);
  var rows=[report.headers].concat(report.rows);
  var csv='\uFEFF'+rows.map(function(row){return row.map(function(cell){return '"'+String(cell==null?'':cell).replace(/"/g,'""')+'"'}).join(',')}).join('\n');
  downloadReportBlob(csv,'text/csv;charset=utf-8','citadel-liens-report.csv');
}
function exportLienReportExcel(){
  var records=getReportFilteredLienRecords();
  var report=getLienReportRows(records);
  var params=getReportParameters();
  var total=records.reduce(function(sum,row){return sum+moneyNumber(row.balance)},0);
  var paramRows=[['Report',params.report],['Generated',params.generated],['View',params.view],['Status',params.status],['Stage',params.stage],['Region',params.region],['Sales Rep',params.salesRep],['Min Days Past Due',params.minDays],['Alert Filter',params.alertFilter],['Group By',params.groupBy],['Search',params.search],['Record Count',records.length],['View Total',moneyLabel(total)]];
  var html='<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif}h1{font-size:18px;margin:0 0 8px}table{border-collapse:collapse}td,th{border:1px solid #b8c2cc;padding:6px 8px;font-size:12px}th{background:#12375f;color:#fff;text-align:left}.params td:first-child{font-weight:bold;background:#eef3f8}.params{margin-bottom:14px}</style></head><body><h1>Citadel Liens Report</h1><table class="params">'+paramRows.map(function(row){return '<tr><td>'+escapeHtml(row[0])+'</td><td>'+escapeHtml(row[1])+'</td></tr>'}).join('')+'</table><table><thead><tr>'+report.headers.map(function(header){return '<th>'+escapeHtml(header)+'</th>'}).join('')+'</tr></thead><tbody>'+report.rows.map(function(row){return '<tr>'+row.map(function(cell){return '<td>'+escapeHtml(cell)+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></body></html>';
  downloadReportBlob('\uFEFF'+html,'application/vnd.ms-excel;charset=utf-8','citadel-liens-report.xls');
}
function lienPdfText(value,maxLength){
  var text=String(value==null?'':value).replace(/[\r\n]+/g,' ').replace(/[\u2013\u2014]/g,'-');
  if(text.normalize)text=text.normalize('NFKD');
  text=text.replace(/[^\x20-\x7E]/g,'').replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');
  maxLength=maxLength||80;
  return text.length>maxLength?text.slice(0,Math.max(0,maxLength-3))+'...':text;
}
function buildLienReportPdf(records,params){
  var columns=[
    {label:'Account',x:30,max:14,value:function(row){return row.jobNumber||row.id}},
    {label:'Customer',x:118,max:21,value:function(row){return row.customer}},
    {label:'Region',x:250,max:16,value:function(row){return row.region}},
    {label:'Sales Rep',x:352,max:14,value:function(row){return row.owner}},
    {label:'Status',x:440,max:10,value:function(row){return row.status}},
    {label:'Stage',x:505,max:10,value:function(row){return row.stage}},
    {label:'Balance',x:570,max:13,value:function(row){return moneyLabel(row.balance)}},
    {label:'Days',x:646,max:5,value:function(row){return row.days}},
    {label:'First Invoice',x:684,max:15,value:function(row){return row.firstInvoice}},
    {label:'Latest Invoice',x:780,max:15,value:function(row){return row.latestInvoice}},
    {label:'Blaze URL',x:876,max:18,value:function(row){return row.blazeUrl||''}}
  ];
  var rowsPerPage=34;
  var pages=[];
  var index;
  for(index=0;index<records.length;index+=rowsPerPage)pages.push(records.slice(index,index+rowsPerPage));
  if(!pages.length)pages.push([]);
  var total=records.reduce(function(sum,row){return sum+moneyNumber(row.balance)},0);
  var pageStreams=pages.map(function(rows,pageIndex){
    var commands=[];
    var drawText=function(x,y,size,value,bold,max){commands.push('BT /'+(bold?'F2':'F1')+' '+size+' Tf '+x+' '+y+' Td ('+lienPdfText(value,max||120)+') Tj ET')};
    drawText(30,578,16,'Citadel Liens Report',true);
    drawText(934,578,8,'Page '+(pageIndex+1)+' of '+pages.length,false,30);
    var headerY=550;
    if(pageIndex===0){
      drawText(30,562,8,'Generated: '+params.generated+' | View: '+params.view+' | Records: '+records.length+' | Total: '+moneyLabel(total),false,155);
      drawText(30,548,8,'Region: '+params.region+' | Sales Rep: '+params.salesRep+' | Status: '+params.status+' | Stage: '+params.stage,false,155);
      drawText(30,534,8,'Min days: '+params.minDays+' | Alerts: '+params.alertFilter+' | Group: '+params.groupBy+' | Search: '+params.search,false,155);
      headerY=512;
    }
    commands.push('0.82 0.87 0.92 RG 30 '+(headerY-5)+' m 978 '+(headerY-5)+' l S');
    columns.forEach(function(column){drawText(column.x,headerY,7,column.label,true,column.max)});
    rows.forEach(function(row,rowIndex){
      var y=headerY-18-rowIndex*13;
      columns.forEach(function(column){drawText(column.x,y,7,column.value(row)||'',false,column.max)});
      commands.push('0.9 0.92 0.94 RG 30 '+(y-4)+' m 978 '+(y-4)+' l S');
    });
    return commands.join('\n');
  });
  var objects=[null];
  objects[1]='<< /Type /Catalog /Pages 2 0 R >>';
  var pageIds=pageStreams.map(function(_,pageIndex){return 5+pageIndex*2});
  objects[2]='<< /Type /Pages /Kids ['+pageIds.map(function(id){return id+' 0 R'}).join(' ')+'] /Count '+pageIds.length+' >>';
  objects[3]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  objects[4]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';
  pageStreams.forEach(function(stream,pageIndex){
    var pageId=5+pageIndex*2;
    var contentId=pageId+1;
    objects[pageId]='<< /Type /Page /Parent 2 0 R /MediaBox [0 0 1008 612] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents '+contentId+' 0 R >>';
    objects[contentId]='<< /Length '+stream.length+' >>\nstream\n'+stream+'\nendstream';
  });
  var pdf='%PDF-1.4\n%Citadel\n';
  var offsets=[0];
  for(index=1;index<objects.length;index+=1){offsets[index]=pdf.length;pdf+=index+' 0 obj\n'+objects[index]+'\nendobj\n'}
  var xrefOffset=pdf.length;
  pdf+='xref\n0 '+objects.length+'\n0000000000 65535 f \n';
  for(index=1;index<objects.length;index+=1)pdf+=String(offsets[index]).padStart(10,'0')+' 00000 n \n';
  pdf+='trailer\n<< /Size '+objects.length+' /Root 1 0 R >>\nstartxref\n'+xrefOffset+'\n%%EOF';
  return new TextEncoder().encode(pdf);
}
function exportLienReportPdf(){
  var records=getReportFilteredLienRecords();
  downloadReportBlob(buildLienReportPdf(records,getReportParameters()),'application/pdf','citadel-liens-report.pdf');
}
function exportLienReport(){
  var format=(document.querySelector('[data-export-format]')||{}).value||'CSV';
  if(format==='Excel')exportLienReportExcel();else if(format==='PDF')exportLienReportPdf();else exportLienReportCsv();
}

function openLiensReportsModal(){closeLiensReportsModal();var modal=document.createElement("div");modal.className="citadel-modal-backdrop";modal.innerHTML='<section class="citadel-report-modal" role="dialog" aria-modal="true" aria-label="Liens Reports"><div class="modal-head"><div><h3>Liens Reports</h3><p>Build daily lien reports from Blaze data, notes, alerts, and workflow fields.</p></div><button type="button" data-close-modal aria-label="Close reports">x</button></div><div class="report-callout">This report includes source lien records plus protected Citadel notes, alerts, and follow-ups.</div><section class="report-band"><div class="report-band-head"><strong>Quick Reports</strong><span>Common exports</span></div><div class="quick-report-grid"><button data-quick-report="open_alerts">Open Alerts</button><button data-quick-report="sixty_days">60+ Days</button><button data-quick-report="no_deposit">No Deposit</button><button data-quick-report="sent_to_agency">Sent to Agency</button><button data-quick-report="critical">Critical Accounts</button><button data-quick-report="current">Current View</button></div></section><section class="report-custom"><div class="report-band-head"><strong>Custom Report</strong><span>Filters, grouping, and export format</span></div><div class="report-form-grid"><label>Region<select data-report-filter="region">'+renderSelectOptions('All regions',getLienRegions(),'All regions')+'</select></label><label>Sales Rep<select data-report-filter="owner">'+renderSelectOptions('All sales reps',getLienOwners(),'All sales reps')+'</select></label><label>Status<select data-report-filter="status">'+renderSelectOptions('All statuses',LIEN_STATUS_OPTIONS,'All statuses')+'</select></label><label>Stage<select data-report-filter="stage">'+renderSelectOptions('All stages',LIEN_STAGE_OPTIONS,'All stages')+'</select></label><label>Min Days Past Due<input data-report-filter="minDays" placeholder="Any" type="number"></label><label>Alert Filter<select data-report-filter="alertFilter"><option>All alerts</option><option>Open alerts</option><option>No alert set</option></select></label><label>Group By<select data-report-filter="groupBy"><option>No grouping</option><option>Region</option><option>Sales Rep</option><option>Stage</option></select></label><label>Search Text<input data-report-filter="search" placeholder="Name, lien, region"></label></div></section><div class="report-summary-row"><div class="report-parameters" data-report-parameters></div><div class="report-total"><strong data-report-count>'+escapeHtml(getVisibleLienRecords().length)+' records</strong><span>Current Liens view</span><em data-report-balance>View total '+escapeHtml(moneyLabel(getVisibleLienRecords().reduce(function(sum,row){return sum+moneyNumber(row.balance)},0)))+'</em></div></div><div class="modal-actions"><button type="button" data-report-reset>Reset</button><span></span><select data-export-format aria-label="Export format"><option>CSV</option><option>Excel</option><option>PDF</option></select><button type="button" data-close-modal>Cancel</button><button type="button" data-report-export>Export</button></div></section>';modal.addEventListener("click",function(event){var quick=event.target.closest('[data-quick-report]');if(quick){setQuickLienReport(quick.getAttribute('data-quick-report'));return}if(event.target.closest('[data-report-reset]')){closeLiensReportsModal();openLiensReportsModal();return}if(event.target.closest('[data-report-export]')){exportLienReport();return}if(event.target===modal||event.target.closest("[data-close-modal]"))closeLiensReportsModal()});modal.addEventListener('input',updateReportSummary);modal.addEventListener('change',updateReportSummary);document.body.appendChild(modal);updateReportSummary()}
function closeLiensReportsModal(){document.querySelectorAll(".citadel-modal-backdrop").forEach(function(item){item.remove()})}


function normalizeContractorRecord(row){
  return {
    id:String(row.contractor_id||row.id||row.contractor_name||row.Contractor||""),
    name:row.contractor_name||row.Contractor||"",
    phone:row.phone||row.Phone||"",
    email:row.email||row.Email||"",
    region:row.regions_raw||row.Regions||row.region||"",
    risk:row.risk||row.Risk||"",
    documents:row.documents||row.Documents||"Current",
    glExpiry:row.gl_expiry||row["GL Expiry"]||"",
    wcExpiry:row.wc_expiry||row["WC Expiry"]||"",
    nextAction:row.next_action||row["Next Action"]||"",
    address:row.address||row.Address||"",
    workflowNote:row.workflow_note||"",
    notesCount:Number(row.notes_count||0),
    alertsCount:Number(row.alerts_count||0),
    followupsCount:Number(row.followups_count||0)
  }
}
function applyContractorsPayload(data){contractorsData.metrics=data.metrics||[];contractorsData.notes=data.notes||[];contractorsData.alerts=data.alerts||[];contractorsData.followUps=data.followUps||[];contractorsData.records=(data.records||[]).map(normalizeContractorRecord);contractorsData.selectedIndex=0;contractorsLastUpdated=new Date().toLocaleTimeString([], {hour:"numeric",minute:"2-digit"})}
function saveContractorsCache(data){try{localStorage.setItem(CONTRACTORS_CACHE_KEY,JSON.stringify({savedAt:Date.now(),data:data}))}catch(error){console.warn("Contractors cache save failed",error)}}
function hydrateContractorsFromCache(){try{var cached=JSON.parse(localStorage.getItem(CONTRACTORS_CACHE_KEY)||"null");if(!cached||!cached.data||!(cached.data.records||[]).length)return false;applyContractorsPayload(cached.data);contractorsLoading=false;contractorsLoadError="";contractorsLastUpdated=cached.savedAt?new Date(cached.savedAt).toLocaleTimeString([], {hour:"numeric",minute:"2-digit"}):contractorsLastUpdated;return true}catch(error){console.warn("Contractors cache read failed",error);return false}}
function getContractorRegions(){var out=[];(contractorsData.records||[]).forEach(function(row){String(row.region||"").split(',').forEach(function(item){var clean=item.trim();if(clean)out.push(clean)})});return Array.from(new Set(out)).sort()}
function contractorRiskScore(row){var risk=String(row.risk||"");var score=Number((risk.match(/\d+/)||[0])[0]);if(score)return score;if(/expired/i.test(row.documents))return 70;if(/expiring|review/i.test(row.documents))return 50;return 20}
function getContractorMetricStats(records){records=records||[];var expired=records.filter(function(row){return /expired/i.test(row.documents)}).length;var expiring=records.filter(function(row){return /expiring/i.test(row.documents)||daysUntil(row.glExpiry)<=30||daysUntil(row.wcExpiry)<=30}).length;var high=records.filter(function(row){return contractorRiskScore(row)>=70}).length;var openWorkflow=records.reduce(function(sum,row){return sum+Number(row.alertsCount||0)+Number(row.followupsCount||0)},0);return [{key:"alerts",label:"Open Alerts",value:openWorkflow,note:"Alerts + follow-ups"},{key:"total",label:"Contractors",value:records.length,note:"Current report records"},{key:"expired",label:"Expired Docs",value:expired,note:"GL or WC expired"},{key:"expiring",label:"Expiring Soon",value:expiring,note:"Next 30 days"},{key:"high",label:"High Risk",value:high,note:"Needs review"}]}
function daysUntil(dateValue){if(!dateValue)return 9999;var date=new Date(dateValue);if(isNaN(date.getTime()))return 9999;var now=new Date();var start=new Date(now.getFullYear(),now.getMonth(),now.getDate());var end=new Date(date.getFullYear(),date.getMonth(),date.getDate());return Math.floor((end.getTime()-start.getTime())/86400000)}
function getVisibleContractorRecords(){var rows=(contractorsData.records||[]).filter(function(row){if(activeContractorMetric==="expired"&&!/expired/i.test(row.documents))return false;if(activeContractorMetric==="expiring"&&!(/expiring/i.test(row.documents)||(daysUntil(row.glExpiry)<=30&&daysUntil(row.glExpiry)>=0)||(daysUntil(row.wcExpiry)<=30&&daysUntil(row.wcExpiry)>=0)))return false;if(activeContractorMetric==="high"&&contractorRiskScore(row)<70)return false;if(activeContractorMetric==="alerts"&&(Number(row.alertsCount||0)+Number(row.followupsCount||0))<1)return false;if(contractorFilters.documents!=="All documents"&&row.documents!==contractorFilters.documents)return false;if(contractorFilters.risk!=="All risks"&&row.risk!==contractorFilters.risk)return false;if(contractorFilters.region!=="All regions"&&String(row.region||"").indexOf(contractorFilters.region)===-1)return false;var search=contractorFilters.search.trim().toLowerCase();if(search&&[row.name,row.phone,row.email,row.region,row.risk,row.documents,row.nextAction,row.address].join(" ").toLowerCase().indexOf(search)<0)return false;return true});rows=rows.slice();if(contractorFilters.sort==="Highest risk")rows.sort(function(a,b){return contractorRiskScore(b)-contractorRiskScore(a)});if(contractorFilters.sort==="Expiring soon")rows.sort(function(a,b){return Math.min(daysUntil(a.glExpiry),daysUntil(a.wcExpiry))-Math.min(daysUntil(b.glExpiry),daysUntil(b.wcExpiry))});if(contractorFilters.sort==="Name A-Z")rows.sort(function(a,b){return String(a.name||'').localeCompare(String(b.name||''))});return rows}
function getContractorWorkspaceItems(type,id){return (contractorsData[type]||[]).filter(function(item){return String(item.contractor_id)===String(id)})}
function renderContractorsPage(){if(contractorsLoading&&!contractorsData.records.length){renderContractorsLoadingPage();return}var visible=getVisibleContractorRecords();var selected=contractorsData.records[contractorsData.selectedIndex]||visible[0]||contractorsData.records[0]||{};var metrics=getContractorMetricStats(contractorsData.records);pagePanel.className="page-panel contractors-page";pagePanel.innerHTML=renderModuleStatusLine(contractorsLoading?'Refreshing...':contractorsLastUpdated?'Updated '+contractorsLastUpdated:(contractorsLoadError||''))+'<div class="contractors-metrics">'+metrics.map(function(metric){return '<button type="button" class="contractor-metric-button '+(activeContractorMetric===metric.key?'active':'')+'" data-contractor-metric="'+escapeHtml(metric.key)+'"><span>'+escapeHtml(metric.label)+'</span><strong>'+escapeHtml(metric.value)+'</strong><em>'+escapeHtml(metric.note)+'</em></button>'}).join('')+'</div><section class="contractors-filter-card"><div><h3>Filters + Sort + Search</h3><p>Refine contractor records the same way on every page</p></div><button type="button" data-contractor-report>Reports</button><div class="contractors-filters"><label>Documents<select data-contractor-filter="documents">'+renderSelectOptions('All documents',CONTRACTOR_DOCUMENT_OPTIONS,contractorFilters.documents)+'</select></label><label>Risk<select data-contractor-filter="risk">'+renderSelectOptions('All risks',CONTRACTOR_RISK_OPTIONS,contractorFilters.risk)+'</select></label><label>Region<select data-contractor-filter="region">'+renderSelectOptions('All regions',getContractorRegions(),contractorFilters.region)+'</select></label><label>Sort<select data-contractor-filter="sort"><option'+(contractorFilters.sort==='Highest risk'?' selected':'')+'>Highest risk</option><option'+(contractorFilters.sort==='Expiring soon'?' selected':'')+'>Expiring soon</option><option'+(contractorFilters.sort==='Name A-Z'?' selected':'')+'>Name A-Z</option></select></label><label>Search<input data-contractor-filter="search" type="search" placeholder="Search contractors" value="'+escapeHtml(contractorFilters.search)+'"></label></div></section><div class="contractors-workspace"><section class="contractors-records"><div class="contractors-section-head"><div><h3>Records</h3><p>Review contractor compliance, document status, and workflow.</p></div><strong>'+escapeHtml(visible.length)+' showing</strong></div><div class="contractors-table"><div class="contractors-table-head"><span>Contractor</span><span>Regions</span><span>Documents</span><span>Risk</span><span>GL Exp.</span><span>WC Exp.</span></div>'+visible.map(function(record){var index=contractorsData.records.indexOf(record);return '<button type="button" class="contractors-row'+(index===contractorsData.selectedIndex?' active':'')+'" data-contractor-index="'+index+'"><span><strong>'+escapeHtml(record.name)+'</strong><em>'+escapeHtml(record.phone)+'</em></span><span>'+escapeHtml(record.region)+'</span><span><mark>'+escapeHtml(record.documents)+'</mark></span><span><mark class="stage-'+(contractorRiskScore(record)>=70?'critical':contractorRiskScore(record)>=50?'review':'monitor')+'">'+escapeHtml(record.risk)+'</mark></span><span>'+escapeHtml(record.glExpiry)+'</span><span>'+escapeHtml(record.wcExpiry)+'</span></button>'}).join('')+'</div></section><aside class="contractors-detail"><div class="contractors-detail-head"><div><span>Selected contractor</span><h3>'+escapeHtml(selected.name)+'</h3><p>'+escapeHtml(selected.documents)+' / '+escapeHtml(selected.risk)+'</p></div></div><div class="contractors-detail-grid"><article><span>Regions</span><strong>'+escapeHtml(selected.region)+'</strong></article><article><span>Phone</span><strong>'+escapeHtml(selected.phone)+'</strong></article><article><span>Email</span><strong>'+escapeHtml(selected.email)+'</strong></article><article><span>Address</span><strong>'+escapeHtml(selected.address)+'</strong></article><article><span>GL Expiry</span><strong>'+escapeHtml(selected.glExpiry)+'</strong></article><article><span>WC Expiry</span><strong>'+escapeHtml(selected.wcExpiry)+'</strong></article><article><span>Next Action</span><strong>'+escapeHtml(selected.nextAction)+'</strong></article></div><section class="contractors-workflow"><div class="card-heading"><h3>Citadel Workflow</h3><span>Protected from source imports</span></div><div class="workspace-status">'+escapeHtml(contractorWorkspaceStatus)+'</div><div class="workflow-entry-actions"><button type="button" data-workspace-entry="note">Add Note</button><button type="button" data-workspace-entry="alert">Set Alert</button></div><div class="liens-workspace-feed"><h4>Recent Notes</h4>'+renderLienWorkspaceList(getContractorWorkspaceItems('notes',selected.id),'No notes yet.',[{key:'note_text',strong:true},{key:'note_by',fallback:'Team'},{key:'note_date'}])+'<h4>Open Alerts</h4>'+renderLienWorkspaceList(getContractorWorkspaceItems('alerts',selected.id),'No alerts yet.',[{key:'alert_text',strong:true},{key:'owner',fallback:'Carlynn'},{key:'due_date'}])+'<h4>Follow-ups</h4>'+renderLienWorkspaceList(getContractorWorkspaceItems('followUps',selected.id),'No follow-ups yet.',[{key:'followup_text',strong:true},{key:'assigned_to',fallback:'Carlynn'},{key:'due_date'}])+'</div></section></aside></div>'}
function renderContractorsLoadingPage(){pagePanel.className="page-panel contractors-page loading-page";pagePanel.innerHTML='<div class="loading-card"><div class="spinner"></div><h3>Loading contractor records</h3><p>Pulling the clean Blaze contractor report and protected Citadel workflow history.</p></div>'}
function bindContractorsPage(){
  if(contractorsPageEventsBound)return;
  contractorsPageEventsBound=true;
  pagePanel.addEventListener("click",function(event){
    if(activePage!=="contractors")return;
    var entryButton=event.target.closest("[data-workspace-entry]");
    if(entryButton){openWorkspaceEntryModal("contractors",entryButton.getAttribute("data-workspace-entry"));return}
    var metric=event.target.closest("[data-contractor-metric]");
    if(metric){activeContractorMetric=metric.getAttribute("data-contractor-metric")||"total";contractorsData.selectedIndex=0;renderContractorsPage();return}
    if(event.target.closest("[data-contractor-report]")){openContractorReportsModal();return}
    var row=event.target.closest("[data-contractor-index]");
    if(!row)return;
    contractorsData.selectedIndex=Number(row.getAttribute("data-contractor-index"));
    renderContractorsPage()
  });
  pagePanel.addEventListener("change",function(event){
    if(activePage!=="contractors")return;
    var field=event.target.closest("select[data-contractor-filter]");
    if(!field)return;
    contractorFilters[field.getAttribute("data-contractor-filter")]=field.value;
    contractorsData.selectedIndex=0;
    renderContractorsPage()
  });
  pagePanel.addEventListener("input",function(event){
    if(activePage!=="contractors")return;
    var search=event.target.closest("input[data-contractor-filter='search']");
    if(!search)return;
    contractorFilters.search=search.value;
    window.clearTimeout(contractorSearchTimer);
    contractorSearchTimer=window.setTimeout(function(){
      contractorsData.selectedIndex=0;
      renderContractorsPage();
      var next=pagePanel.querySelector("input[data-contractor-filter='search']");
      if(next){next.focus();next.setSelectionRange(next.value.length,next.value.length)}
    },180)
  })
}
function saveContractorWorkspace(action,payload){contractorWorkspaceStatus="Saving...";if(activePage==="contractors")renderContent();var params=Object.keys(payload).map(function(key){return encodeURIComponent(key)+"="+encodeURIComponent(payload[key]||"")}).join("&");return jsonp(CITADEL_API_URL+"?action="+encodeURIComponent(action)+"&"+params).then(function(response){if(!response||!response.ok)throw new Error(response&&response.error?response.error:"Save failed");contractorWorkspaceStatus="Saved";return loadContractorsData()}).catch(function(error){contractorWorkspaceStatus="Save failed";console.warn("Contractors workspace save failed",error);if(activePage==="contractors")renderContent()})}


function buildTableReportPdf(table,title){
  table=table&&table.length?table:[['No records']];
  var headers=table[0];
  var rows=table.slice(1);
  var rowsPerPage=34;
  var pages=[];
  for(var index=0;index<rows.length;index+=rowsPerPage)pages.push(rows.slice(index,index+rowsPerPage));
  if(!pages.length)pages.push([]);
  var margin=30;
  var tableWidth=948;
  var columnWidth=tableWidth/Math.max(headers.length,1);
  var maxChars=Math.max(5,Math.floor(columnWidth/4.3));
  var pageStreams=pages.map(function(pageRows,pageIndex){
    var commands=[];
    function drawText(x,y,size,value,bold,max){commands.push('BT /'+(bold?'F2':'F1')+' '+size+' Tf '+x+' '+y+' Td ('+lienPdfText(value,max||120)+') Tj ET')}
    drawText(margin,578,16,title,true,90);
    drawText(850,578,8,'Page '+(pageIndex+1)+' of '+pages.length,false,30);
    drawText(margin,562,8,'Generated: '+new Date().toLocaleString()+' | Records: '+rows.length,false,150);
    var headerY=536;
    commands.push('0.82 0.87 0.92 RG '+margin+' '+(headerY-5)+' m '+(margin+tableWidth)+' '+(headerY-5)+' l S');
    headers.forEach(function(header,columnIndex){drawText(margin+columnIndex*columnWidth,headerY,7,header,true,maxChars)});
    pageRows.forEach(function(row,rowIndex){var y=headerY-18-rowIndex*13;headers.forEach(function(_,columnIndex){drawText(margin+columnIndex*columnWidth,y,7,row[columnIndex],false,maxChars)});commands.push('0.9 0.92 0.94 RG '+margin+' '+(y-4)+' m '+(margin+tableWidth)+' '+(y-4)+' l S')});
    return commands.join('\n')
  });
  var objects=[null];
  objects[1]='<< /Type /Catalog /Pages 2 0 R >>';
  var pageIds=pageStreams.map(function(_,pageIndex){return 5+pageIndex*2});
  objects[2]='<< /Type /Pages /Kids ['+pageIds.map(function(id){return id+' 0 R'}).join(' ')+'] /Count '+pageIds.length+' >>';
  objects[3]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  objects[4]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';
  pageStreams.forEach(function(stream,pageIndex){var pageId=5+pageIndex*2;var contentId=pageId+1;objects[pageId]='<< /Type /Page /Parent 2 0 R /MediaBox [0 0 1008 612] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents '+contentId+' 0 R >>';objects[contentId]='<< /Length '+stream.length+' >>\nstream\n'+stream+'\nendstream'});
  var pdf='%PDF-1.4\n%Citadel\n';var offsets=[0];
  for(var objectIndex=1;objectIndex<objects.length;objectIndex+=1){offsets[objectIndex]=pdf.length;pdf+=objectIndex+' 0 obj\n'+objects[objectIndex]+'\nendobj\n'}
  var xrefOffset=pdf.length;pdf+='xref\n0 '+objects.length+'\n0000000000 65535 f \n';
  for(objectIndex=1;objectIndex<objects.length;objectIndex+=1)pdf+=String(offsets[objectIndex]).padStart(10,'0')+' 00000 n \n';
  pdf+='trailer\n<< /Size '+objects.length+' /Root 1 0 R >>\nstartxref\n'+xrefOffset+'\n%%EOF';
  return new TextEncoder().encode(pdf)
}
function reportDownloadTable(table,format,filenameBase){
  format=(format||'csv').toLowerCase();
  if(format==='pdf'){downloadReportBlob(buildTableReportPdf(table,filenameBase.replace(/[-_]+/g,' ').replace(/\b\w/g,function(character){return character.toUpperCase()})),'application/pdf',filenameBase+'.pdf');return}
  if(format==='excel'){
    var html='<!doctype html><html><head><meta charset="UTF-8"><style>table{border-collapse:collapse;font-family:Arial,sans-serif}td{border:1px solid #b8c2cc;padding:6px 8px;font-size:12px}tr:first-child td{background:#12375f;color:#fff;font-weight:bold}</style></head><body><table>'+table.map(function(row){return '<tr>'+row.map(function(cell){return '<td>'+escapeHtml(cell==null?'':cell)+'</td>'}).join('')+'</tr>'}).join('')+'</table></body></html>';
    downloadReportBlob('\uFEFF'+html,'application/vnd.ms-excel;charset=utf-8',filenameBase+'.xls');return
  }
  var csv='\uFEFF'+table.map(function(row){return row.map(function(cell){return '"'+String(cell==null?'':cell).replace(/"/g,'""')+'"'}).join(',')}).join('\n');
  downloadReportBlob(csv,'text/csv;charset=utf-8',filenameBase+'.csv')
}
function openWorkspaceReportsModal(title,description,count,onExport){var modal=document.createElement('div');modal.className='citadel-modal-backdrop';modal.innerHTML='<section class="citadel-report-modal" role="dialog" aria-modal="true" aria-label="'+escapeHtml(title)+'"><div class="modal-head"><div><h3>'+escapeHtml(title)+'</h3><p>'+escapeHtml(description)+'</p></div><button type="button" data-close-modal aria-label="Close">x</button></div><div class="report-callout">Choose the report format, then export the current filtered view.</div><div class="report-band"><div class="report-band-head"><strong>Quick Reports</strong><span>Common exports</span></div><div class="quick-report-grid"><button type="button" data-simple-report="current">Current View</button></div></div><div class="report-summary-row"><div class="report-parameters"><strong>Report Parameters</strong><span>Rows included: <b>'+escapeHtml(count)+'</b></span><span>Source: <b>Current filters</b></span></div><div class="report-total"><strong>'+escapeHtml(count)+' records</strong><span>Ready to export</span><em>CSV or Excel</em></div></div><div class="modal-actions"><button type="button" data-close-modal>Cancel</button><span></span><select data-simple-report-format><option value="csv">CSV</option><option value="excel">Excel</option></select><button type="button" data-simple-report-export>Export</button></div></section>';modal.addEventListener('click',function(event){if(event.target===modal||event.target.closest('[data-close-modal]')){closeLiensReportsModal();return}if(event.target.closest('[data-simple-report-export]')||event.target.closest('[data-simple-report]')){var field=modal.querySelector('[data-simple-report-format]');onExport(field?field.value:'csv')}});document.body.appendChild(modal)}
function openStandardReportsModal(){openWorkspaceReportsModal(getPageLabel(activePage)+' Reports','This page report builder is ready for source data wiring.',0,function(){})}

function exportContractorReportCsv(format){var rows=getVisibleContractorRecords();var table=[["Contractor","Phone","Email","Region","Documents","Risk","GL Expiry","WC Expiry","Next Action","Address"]].concat(rows.map(function(row){return [row.name,row.phone,row.email,row.region,row.documents,row.risk,row.glExpiry,row.wcExpiry,row.nextAction,row.address]}));var csv='\uFEFF'+table.map(function(row){return row.map(function(cell){return '"'+String(cell==null?'':cell).replace(/"/g,'""')+'"'}).join(',')}).join('\n');reportDownloadTable(table,format,'citadel-contractors-report')}
function openContractorReportsModal(){var rows=getVisibleContractorRecords();openWorkspaceReportsModal('Contractors Reports','Build contractor exports from the current filtered view.',rows.length,function(format){exportContractorReportCsv(format)})}
function normalizeReviewRecord(record){return {id:record.review_id||'',platform:record.platform||'',name:record.customer||record.name||'',title:record.review_title||record.review_name||'',text:record.review_text||'',rating:record.rating||record.score||'',status:record.status||record.result||'Monitor',date:record.review_date||record.last_updated||'',url:record.review_url||'',notesCount:Number(record.notes_count||0),alertsCount:Number(record.alerts_count||0),followupsCount:Number(record.followups_count||0)}}
function applyReviewsFallbackData(reason){if(reviewsData.records.length)return;reviewsData.records=[
  {id:'REV-DEMO-1',platform:'Google',name:'STL Customer Feedback',title:'Follow up needed',text:'Placeholder review record while the live Reviews sheet connection finishes loading.',rating:'2',status:'Needs Review',date:'2026-07-08',url:'',notesCount:0,alertsCount:0,followupsCount:0},
  {id:'REV-DEMO-2',platform:'Google',name:'MIL Service Review',title:'Low rating trend',text:'Review source sheet is connected, but Citadel did not receive rows fast enough for this page load.',rating:'3',status:'Needs Review',date:'2026-07-08',url:'',notesCount:0,alertsCount:0,followupsCount:0},
  {id:'REV-DEMO-3',platform:'Facebook',name:'IND Customer Feedback',title:'Monitor response',text:'Use this workspace for review notes, alerts, and follow-ups after the sheet response is confirmed.',rating:'4',status:'Monitor',date:'2026-07-08',url:'',notesCount:0,alertsCount:0,followupsCount:0}
];reviewsData.metrics=[{label:'Reviews',value:reviewsData.records.length,note:'Fallback view'},{label:'Needs Review',value:2,note:'1-3 star focus'},{label:'Open Alerts',value:0,note:'Alerts + follow-ups'},{label:'Platforms',value:2,note:'Google / Facebook'}];reviewsLoading=false;reviewsLoadError=reason||'Showing fallback while Reviews sheet responds';reviewsLastUpdated='Fallback view'}

function applyReviewsPayload(data){reviewsData.records=(data.records||[]).map(normalizeReviewRecord);reviewsData.notes=data.notes||[];reviewsData.alerts=data.alerts||[];reviewsData.followUps=data.followUps||[];reviewsData.metrics=data.metrics||[];reviewsLastUpdated=new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})}
function saveReviewsCache(data){try{localStorage.setItem(REVIEWS_CACHE_KEY,JSON.stringify({savedAt:Date.now(),data:data}))}catch(error){console.warn('Reviews cache save failed',error)}}
function hydrateReviewsFromCache(){try{var cached=JSON.parse(localStorage.getItem(REVIEWS_CACHE_KEY)||'null');if(!cached||!cached.data||!(cached.data.records||[]).length)return false;applyReviewsPayload(cached.data);reviewsLoading=false;reviewsLoadError='';reviewsLastUpdated=cached.savedAt?new Date(cached.savedAt).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}):reviewsLastUpdated;return true}catch(error){console.warn('Reviews cache read failed',error);return false}}
function getReviewPlatforms(){return Array.from(new Set(reviewsData.records.map(function(row){return row.platform}).filter(Boolean))).sort()}
function getVisibleReviewRecords(){var rows=reviewsData.records.slice();if(activeReviewMetric==='open_alerts')rows=rows.filter(function(row){return row.alertsCount+row.followupsCount>0});if(activeReviewMetric==='findings')rows=rows.filter(function(row){return /need|finding|low/i.test(row.status)||Number(row.rating)<4});if(reviewFilters.platform!=='All platforms')rows=rows.filter(function(row){return row.platform===reviewFilters.platform});if(reviewFilters.rating!=='All ratings')rows=rows.filter(function(row){return String(row.rating)===reviewFilters.rating});if(reviewFilters.status!=='All statuses')rows=rows.filter(function(row){return row.status===reviewFilters.status});var q=reviewFilters.search.toLowerCase().trim();if(q)rows=rows.filter(function(row){return [row.platform,row.name,row.title,row.text,row.rating,row.status].join(' ').toLowerCase().indexOf(q)>-1});if(reviewFilters.sort==='Lowest rating')rows.sort(function(a,b){return Number(a.rating||0)-Number(b.rating||0)});else if(reviewFilters.sort==='Highest rating')rows.sort(function(a,b){return Number(b.rating||0)-Number(a.rating||0)});else rows.sort(function(a,b){return String(b.date||'').localeCompare(String(a.date||''))});return rows}
function getReviewMetricStats(){var records=reviewsData.records;var open=reviewsData.alerts.length+reviewsData.followUps.length;var low=records.filter(function(row){return Number(row.rating||0)>0&&Number(row.rating)<4}).length;var platforms=getReviewPlatforms().length;return [{key:'open_alerts',label:'Open Alerts',value:open,note:'Alerts + follow-ups'},{key:'all',label:'Reviews',value:records.length,note:'Current records'},{key:'findings',label:'Needs Review',value:low,note:'Below 4 stars'},{key:'platforms',label:'Platforms',value:platforms,note:'Review sources'}]}
function getReviewWorkspaceItems(type,id){return (reviewsData[type]||[]).filter(function(item){return String(item.review_id)===String(id)})}
function renderReviewsPage(){if(reviewsLoading&&!reviewsData.records.length){applyReviewsFallbackData('Reviews sheet is refreshing')}var visible=getVisibleReviewRecords();var selected=reviewsData.records[reviewsData.selectedIndex]||visible[0]||reviewsData.records[0]||{};var metrics=getReviewMetricStats();pagePanel.className='page-panel contractors-page';pagePanel.innerHTML=renderModuleStatusLine(reviewsLoading?'Refreshing...':reviewsLastUpdated?'Updated '+reviewsLastUpdated:(reviewsLoadError||''))+'<div class="contractors-metrics">'+metrics.map(function(metric){return '<button type="button" class="contractor-metric-button '+(activeReviewMetric===metric.key?'active':'')+'" data-review-metric="'+escapeHtml(metric.key)+'"><span>'+escapeHtml(metric.label)+'</span><strong>'+escapeHtml(metric.value)+'</strong><em>'+escapeHtml(metric.note)+'</em></button>'}).join('')+'</div><section class="contractors-filter-card"><div><h3>Filters + Sort + Search</h3><p>Refine review records the same way on every page</p></div><button type="button" data-review-report>Reports</button><div class="contractors-filters"><label>Platform<select data-review-filter="platform">'+renderSelectOptions('All platforms',getReviewPlatforms(),reviewFilters.platform)+'</select></label><label>Rating<select data-review-filter="rating">'+renderSelectOptions('All ratings',['1','2','3','4','5'],reviewFilters.rating)+'</select></label><label>Status<select data-review-filter="status">'+renderSelectOptions('All statuses',['Monitor','Needs Review'],reviewFilters.status)+'</select></label><label>Sort<select data-review-filter="sort"><option'+(reviewFilters.sort==='Newest first'?' selected':'')+'>Newest first</option><option'+(reviewFilters.sort==='Lowest rating'?' selected':'')+'>Lowest rating</option><option'+(reviewFilters.sort==='Highest rating'?' selected':'')+'>Highest rating</option></select></label><label>Search<input data-review-filter="search" type="search" placeholder="Search reviews" value="'+escapeHtml(reviewFilters.search)+'"></label></div></section><div class="contractors-workspace"><section class="contractors-records"><div class="contractors-section-head"><div><h3>Records</h3><p>Review feedback, ratings, notes, alerts, and follow-up work.</p></div><strong>'+escapeHtml(visible.length)+' showing</strong></div><div class="contractors-table"><div class="contractors-table-head"><span>Name</span><span>Platform</span><span>Rating</span><span>Status</span><span>Date</span><span>Alerts</span></div>'+visible.map(function(record){var index=reviewsData.records.indexOf(record);return '<button type="button" class="contractors-row'+(index===reviewsData.selectedIndex?' active':'')+'" data-review-index="'+index+'"><span><strong>'+escapeHtml(record.name||record.title)+'</strong><em>'+escapeHtml(record.title)+'</em></span><span>'+escapeHtml(record.platform)+'</span><span><mark>'+escapeHtml(record.rating)+'</mark></span><span><mark>'+escapeHtml(record.status)+'</mark></span><span>'+escapeHtml(record.date)+'</span><span>'+escapeHtml(record.alertsCount+record.followupsCount)+'</span></button>'}).join('')+'</div></section><aside class="contractors-detail"><div class="contractors-detail-head"><div><span>Selected review</span><h3>'+escapeHtml(selected.name||selected.title)+'</h3><p>'+escapeHtml(selected.platform)+' / '+escapeHtml(selected.rating)+'</p></div></div><div class="contractors-detail-grid"><article><span>Platform</span><strong>'+escapeHtml(selected.platform)+'</strong></article><article><span>Rating</span><strong>'+escapeHtml(selected.rating)+'</strong></article><article><span>Date</span><strong>'+escapeHtml(selected.date)+'</strong></article><article><span>Status</span><strong>'+escapeHtml(selected.status)+'</strong></article><article><span>Review Link</span><strong>'+(selected.url?'<a class="record-link" href="'+escapeHtml(selected.url)+'" target="_blank" rel="noopener">Open review</a>':'')+'</strong></article></div><section class="contractors-workflow"><div class="card-heading"><h3>Citadel Workflow</h3><span>Protected from source imports</span></div><div class="workspace-status">'+escapeHtml(reviewWorkspaceStatus)+'</div><div class="workflow-entry-actions"><button type="button" data-workspace-entry="note">Add Note</button><button type="button" data-workspace-entry="alert">Set Alert</button></div><div class="liens-workspace-feed"><h4>Review Text</h4><p>'+escapeHtml(selected.text||'No review text included.')+'</p><h4>Recent Notes</h4>'+renderLienWorkspaceList(getReviewWorkspaceItems('notes',selected.id),'No notes yet.',[{key:'note_text',strong:true},{key:'note_by',fallback:'Team'},{key:'note_date'}])+'<h4>Open Alerts</h4>'+renderLienWorkspaceList(getReviewWorkspaceItems('alerts',selected.id),'No alerts yet.',[{key:'alert_text',strong:true},{key:'owner',fallback:'Carlynn'},{key:'due_date'}])+'<h4>Follow-ups</h4>'+renderLienWorkspaceList(getReviewWorkspaceItems('followUps',selected.id),'No follow-ups yet.',[{key:'followup_text',strong:true},{key:'assigned_to',fallback:'Carlynn'},{key:'due_date'}])+'</div></section></aside></div>'}
function bindReviewsPage(){
  if(reviewsPageEventsBound)return;
  reviewsPageEventsBound=true;
  pagePanel.addEventListener('click',function(event){
    if(activePage!=='reviews')return;
    var entryButton=event.target.closest('[data-workspace-entry]');
    if(entryButton){openWorkspaceEntryModal('reviews',entryButton.getAttribute('data-workspace-entry'));return}
    var metric=event.target.closest('[data-review-metric]');
    if(metric){activeReviewMetric=metric.getAttribute('data-review-metric')||'all';reviewsData.selectedIndex=0;renderReviewsPage();return}
    if(event.target.closest('[data-review-report]')){openReviewReportsModal();return}
    var row=event.target.closest('[data-review-index]');
    if(row){reviewsData.selectedIndex=Number(row.getAttribute('data-review-index'));renderReviewsPage()}
  });
  pagePanel.addEventListener('change',function(event){
    if(activePage!=='reviews')return;
    var field=event.target.closest('select[data-review-filter]');
    if(!field)return;
    reviewFilters[field.getAttribute('data-review-filter')]=field.value;
    reviewsData.selectedIndex=0;
    renderReviewsPage()
  });
  pagePanel.addEventListener('input',function(event){
    if(activePage!=='reviews')return;
    var search=event.target.closest('input[data-review-filter="search"]');
    if(!search)return;
    reviewFilters.search=search.value;
    window.clearTimeout(reviewSearchTimer);
    reviewSearchTimer=window.setTimeout(function(){
      reviewsData.selectedIndex=0;
      renderReviewsPage();
      var next=pagePanel.querySelector('input[data-review-filter="search"]');
      if(next){next.focus();next.setSelectionRange(next.value.length,next.value.length)}
    },180)
  })
}
function saveReviewWorkspace(action,payload){reviewWorkspaceStatus='Saving...';if(activePage==='reviews')renderReviewsPage();var params=Object.keys(payload).map(function(key){return encodeURIComponent(key)+'='+encodeURIComponent(payload[key]||'')}).join('&');return jsonp(CITADEL_API_URL+'?action='+encodeURIComponent(action)+'&'+params).then(function(response){if(!response||!response.ok)throw new Error(response&&response.error?response.error:'Save failed');reviewWorkspaceStatus='Saved';return loadReviewsData()}).catch(function(){reviewWorkspaceStatus='Save failed';if(activePage==='reviews')renderReviewsPage()})}
function exportReviewReportCsv(format){var rows=getVisibleReviewRecords();var table=[['Name','Platform','Rating','Status','Date','Title','Review Text','URL']].concat(rows.map(function(row){return [row.name,row.platform,row.rating,row.status,row.date,row.title,row.text,row.url]}));var csv='\uFEFF'+table.map(function(row){return row.map(function(cell){return '"'+String(cell==null?'':cell).replace(/"/g,'""')+'"'}).join(',')}).join('\n');reportDownloadTable(table,format,'citadel-reviews-report')}
function openReviewReportsModal(){var rows=getVisibleReviewRecords();openWorkspaceReportsModal('Reviews Reports','Build review exports from the current filtered view.',rows.length,function(format){exportReviewReportCsv(format)})}
function loadReviewsData(){if(!CITADEL_API_URL){applyReviewsFallbackData('Reviews sheet not connected yet');return}if(!reviewsData.records.length)hydrateReviewsFromCache();reviewsLoading=true;reviewsLoadError='';var fallbackTimer=window.setTimeout(function(){if(reviewsLoading&&!reviewsData.records.length){applyReviewsFallbackData('Reviews sheet is still loading');if(activePage==='reviews')renderReviewsPage()}},1200);if(activePage==='reviews')renderReviewsPage();jsonp(CITADEL_API_URL+'?action=getReviews').then(function(response){window.clearTimeout(fallbackTimer);if(!response||!response.ok||!response.data)throw new Error(response&&response.error?response.error:'No reviews data returned');applyReviewsPayload(response.data);saveReviewsCache(response.data);reviewsLoading=false;reviewsLoadError='';if(activePage==='reviews'||activePage==='command-center')renderContent()}).catch(function(error){window.clearTimeout(fallbackTimer);reviewsLoading=false;if(!reviewsData.records.length)applyReviewsFallbackData('Reviews sheet not connected yet');console.warn('Reviews sheet load failed',error);if(activePage==='reviews')renderReviewsPage()})}

function regionMarketCatalog(){return [
  {code:'PHX',label:'Phoenix, AZ',terms:['phx','phoenix','arizona',' az']},
  {code:'STL',label:'St. Louis, MO',terms:['stl','st louis','st. louis','missouri',' mo']},
  {code:'MIL',label:'Milwaukee, WI',terms:['mil','milwaukee','wisconsin',' wi']},
  {code:'CLE',label:'Cleveland, OH',terms:['cle','cleveland','ohio',' oh']},
  {code:'CHI',label:'Chicago, IL',terms:['chi','chicago','illinois',' il']},
  {code:'MIN',label:'Minneapolis, MN',terms:['min','minneapolis','minnesota',' mn']},
  {code:'ABQ',label:'Albuquerque, NM',terms:['abq','albuquerque','new mexico',' nm']},
  {code:'PIT',label:'Pittsburgh, PA',terms:['pit','pittsburg','pittsburgh','pennsylvania',' pa']},
  {code:'IND',label:'Indianapolis, IN',terms:['ind','indianapolis','indiana',' in']},
  {code:'OT',label:'Other',terms:[]}
]}
function normalizeRegionMarket(value){var text=(' '+String(value||'').toLowerCase().replace(/[^a-z0-9]+/g,' ')+' ');var markets=regionMarketCatalog();for(var i=0;i<markets.length;i++){if(markets[i].code==='OT')continue;for(var j=0;j<markets[i].terms.length;j++){var term=' '+markets[i].terms[j].toLowerCase().replace(/[^a-z0-9]+/g,' ')+' ';if(text.indexOf(term)>-1)return markets[i].code}}return 'OT'}
function createRegionHealthMap(){
  var map={};
  regionMarketCatalog().forEach(function(market){
    map[market.code]={
      code:market.code,
      region:market.code,
      label:market.label,
      score:null,
      status:'No live signals',
      action:'No region-tagged records are currently available.',
      liens:0,
      lienExposure:0,
      criticalLiens:0,
      highBalanceLiens:0,
      contractors:0,
      highRiskContractors:0,
      expiredContractors:0,
      registrations:0,
      openRegistrations:0,
      expiredRegistrations:0,
      expiringRegistrations:0,
      fleet:0,
      fleetDue:0,
      alerts:0
    };
  });
  return map;
}
function addRegionWorkflowItems(map,items,lookup,idFields){
  (items||[]).filter(workflowItemIsOpen).forEach(function(item){
    var id='';
    for(var i=0;i<idFields.length;i++){
      if(item[idFields[i]]){id=String(item[idFields[i]]);break;}
    }
    var code=lookup[id]||'OT';
    (map[code]||map.OT).alerts+=1;
  });
}
function registrationRegionValue(record){
  return record.region||record.state||record.received_license_state||'';
}
function getRegionHealthConnections(){
  return {
    liens:moduleConnectionState(liensLoading,liensLoadError,liensLastUpdated,(liensData.records||[]).length>0).live,
    contractors:moduleConnectionState(contractorsLoading,contractorsLoadError,contractorsLastUpdated,(contractorsData.records||[]).length>0).live,
    registrations:moduleConnectionState(registrationsSummaryLoading,registrationsSummaryError,registrationsSummaryUpdated,Object.keys(registrationsSummary.metrics||{}).length>0).live,
    fleet:moduleConnectionState(fleetLoading,fleetLoadError,fleetLastUpdated,(fleetData.vehicles||[]).length>0||(fleetData.drivers||[]).length>0||(fleetData.sourceRows||[]).length>0).live
  };
}
function getRegionHealthRows(){
  var map=createRegionHealthMap();
  var lienRegions={};
  var contractorRegions={};
  var registrationRegions={};
  var fleetRegions={};

  (liensData.records||[]).forEach(function(record){
    var code=normalizeRegionMarket(record.region);
    var row=map[code]||map.OT;
    row.liens+=1;
    row.lienExposure+=moneyNumber(record.balance);
    if(String(record.stage||'').toLowerCase()==='critical')row.criticalLiens+=1;
    if(moneyNumber(record.balance)>=50000)row.highBalanceLiens+=1;
    lienRegions[String(record.id||'')]=code;
  });

  (contractorsData.records||[]).forEach(function(record){
    var recordCodes=[];
    String(record.region||'').split(/[,;]/).forEach(function(region){
      var code=normalizeRegionMarket(region);
      if(recordCodes.indexOf(code)>-1)return;
      recordCodes.push(code);
      var row=map[code]||map.OT;
      row.contractors+=1;
      if(contractorRiskScore(record)>=70)row.highRiskContractors+=1;
      if(/expired/i.test(record.documents))row.expiredContractors+=1;
    });
    contractorRegions[String(record.id||'')]=recordCodes[0]||'OT';
  });

  (registrationsSummary.openRequests||[]).forEach(function(record){
    var code=normalizeRegionMarket(registrationRegionValue(record));
    var row=map[code]||map.OT;
    row.registrations+=1;
    row.openRegistrations+=1;
    registrationRegions[String(record.request_id||record.registration_id||'')]=code;
  });
  (registrationsSummary.activeRegistrations||[]).forEach(function(record){
    var code=normalizeRegionMarket(registrationRegionValue(record));
    var row=map[code]||map.OT;
    row.registrations+=1;
    var expirationDays=daysUntil(record.expiration);
    if(expirationDays<0)row.expiredRegistrations+=1;
    else if(expirationDays<=30)row.expiringRegistrations+=1;
    registrationRegions[String(record.request_id||'')]=code;
    registrationRegions[String(record.registration_id||'')]=code;
  });

  (fleetData.vehicles||[]).forEach(function(record){
    var code=normalizeRegionMarket(record.region||record.deviceGroup);
    var row=map[code]||map.OT;
    row.fleet+=1;
    if(fleetVehicleServiceDue(record))row.fleetDue+=1;
    fleetRegions[String(record.id||'')]=code;
  });
  (fleetData.drivers||[]).forEach(function(record){
    var code=normalizeRegionMarket(record.region);
    var row=map[code]||map.OT;
    row.fleet+=1;
    if(fleetDriverDocsDue(record))row.fleetDue+=1;
    fleetRegions[String(record.id||'')]=code;
  });

  addRegionWorkflowItems(map,liensData.alerts,lienRegions,['lien_id']);
  addRegionWorkflowItems(map,liensData.followUps,lienRegions,['lien_id']);
  addRegionWorkflowItems(map,contractorsData.alerts,contractorRegions,['contractor_id']);
  addRegionWorkflowItems(map,contractorsData.followUps,contractorRegions,['contractor_id']);
  addRegionWorkflowItems(map,registrationsSummary.alerts,registrationRegions,['request_id','registration_id']);
  addRegionWorkflowItems(map,registrationsSummary.followUps,registrationRegions,['request_id','registration_id']);
  addRegionWorkflowItems(map,fleetData.alerts,fleetRegions,['fleet_record_id']);
  addRegionWorkflowItems(map,fleetData.followUps,fleetRegions,['fleet_record_id']);

  Object.keys(map).forEach(function(code){
    var row=map[code];
    var signalCount=row.liens+row.contractors+row.registrations+row.fleet+row.alerts;
    if(!signalCount)return;
    var lienPressure=Math.min(30,row.criticalLiens*5+row.highBalanceLiens*2+Math.max(0,row.liens-20)*0.3);
    var contractorPressure=Math.min(20,row.highRiskContractors*3+row.expiredContractors*2);
    var registrationPressure=Math.min(16,row.openRegistrations*0.5+row.expiredRegistrations*4+row.expiringRegistrations*2);
    var fleetPressure=Math.min(16,row.fleetDue*3);
    var workflowPressure=Math.min(18,row.alerts*2);
    row.score=Math.max(35,Math.round(100-lienPressure-contractorPressure-registrationPressure-fleetPressure-workflowPressure));
    row.status=row.score<62?'Critical':row.score<74?'Watch':row.score<84?'Monitor':'Healthy';
    var pressures=[
      {value:lienPressure,text:'resolve lien exposure'},
      {value:contractorPressure,text:'review contractor compliance'},
      {value:registrationPressure,text:'work registration and renewal items'},
      {value:fleetPressure,text:'address fleet service or driver documents'},
      {value:workflowPressure,text:'close open alerts'}
    ].sort(function(a,b){return b.value-a.value});
    if(row.status==='Critical')row.action='Leadership focus: '+pressures[0].text+'.';
    else if(row.status==='Watch')row.action='Watchlist: '+pressures[0].text+'.';
    else if(row.status==='Monitor')row.action='Monitor live signals and '+pressures[0].text+'.';
    else row.action='Healthy: live signals show no immediate escalation.';
  });

  return regionMarketCatalog().map(function(market){return map[market.code];}).sort(function(a,b){
    if(a.score==null&&b.score==null)return a.region.localeCompare(b.region);
    if(a.score==null)return 1;
    if(b.score==null)return -1;
    return a.score-b.score||a.region.localeCompare(b.region);
  });
}

function normalizeFleetSource(row){return {device:row.device||'',deviceGroup:row.device_group||'',firstName:row.first_name||'',lastName:row.last_name||'',currentDriver:row.current_driver||'',workTime:row.work_time||'',currentActivity:row.current_activity||'',privacyMode:row.in_privacy_mode||'',lastStopAddress:row.last_stop_address||'',lastStopZoneTypes:row.last_stop_zone_types||'',currentOdometer:row.current_odometer||'',currentEngineHours:row.current_engine_hours||'',activeFrom:row.active_from||'',activeTo:row.active_to||'',isArchived:row.is_archived||'',plan:row.plan||'',deviceType:row.device_type||'',firmwareVersion:row.firmware_version||'',serialNo:row.serial_no||'',licensePlate:row.license_plate||'',licenseState:row.license_state||'',vin:row.vin||'',timeZone:row.time_zone||'',deviceComment:row.device_comment||'',downloadStatus:row.download_status||'',lastTrip:row.last_trip||'',lastCommunicationDate:row.last_communication_date||''}}
function normalizeFleetVehicle(row){return {id:row.vehicle_id||row.id||'',unit:row.unit_number||row.unit||row.vehicle_id||'',deviceGroup:row.device_group||'',region:row.region||'',status:row.status||'Active',serviceStatus:row.service_status||'',registrationStatus:row.registration_status||'',vin:row.vin||'',plate:row.plate||'',licenseState:row.license_state||'',make:row.make||'',model:row.model||'',year:row.year||'',assignedDriver:row.assigned_driver||'',currentActivity:row.current_activity||'',lastStopAddress:row.last_stop_address||'',currentOdometer:row.current_odometer||'',currentEngineHours:row.current_engine_hours||'',activeFrom:row.active_from||'',activeTo:row.active_to||'',isArchived:row.is_archived||'',plan:row.plan||'',deviceType:row.device_type||'',firmwareVersion:row.firmware_version||'',serialNo:row.serial_no||'',timeZone:row.time_zone||'',deviceComment:row.device_comment||'',downloadStatus:row.download_status||'',lastTrip:row.last_trip||'',lastCommunicationDate:row.last_communication_date||'',nextServiceDate:row.next_service_date||'',lastUpdated:row.last_updated||''}}
function normalizeFleetDriver(row){return {id:row.driver_id||row.id||'',name:row.driver_name||row.name||'',region:row.region||'',status:row.status||'Active',phone:row.phone||'',email:row.email||'',licenseExpiry:row.license_expiry||'',medicalExpiry:row.medical_card_expiry||'',insuranceExpiry:row.insurance_expiry||'',assignedVehicle:row.assigned_vehicle||'',nextAction:row.next_action||'',lastUpdated:row.last_updated||''}}
function applyFleetPayload(data){fleetData.sourceRows=(data.fleetRecords||[]).map(normalizeFleetSource);fleetData.vehicles=(data.vehicles||[]).map(normalizeFleetVehicle);fleetData.drivers=(data.drivers||[]).map(normalizeFleetDriver);fleetData.notes=data.notes||[];fleetData.alerts=data.alerts||[];fleetData.followUps=data.followUps||[];fleetData.metrics=data.metrics||[];fleetData.selectedFleetIndex=0;fleetData.selectedVehicleIndex=0;fleetData.selectedDriverIndex=0;fleetLastUpdated=new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})}
function saveFleetCache(data){try{localStorage.setItem(FLEET_CACHE_KEY,JSON.stringify({savedAt:Date.now(),data:data}))}catch(error){}}
function hydrateFleetFromCache(){try{var cached=JSON.parse(localStorage.getItem(FLEET_CACHE_KEY)||'null');if(!cached||!cached.data)return false;applyFleetPayload(cached.data);fleetLoading=false;fleetLoadError='';fleetLastUpdated=cached.savedAt?new Date(cached.savedAt).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}):fleetLastUpdated;return true}catch(error){console.warn('Fleet cache read failed',error);return false}}
function fleetOpenWorkflowCount(){return (fleetData.alerts||[]).length+(fleetData.followUps||[]).length}
function fleetVehicleServiceDue(row){return /due|overdue|service/i.test(String(row.serviceStatus||''))||(daysUntil(row.nextServiceDate)<=30&&daysUntil(row.nextServiceDate)>=0)}
function fleetDriverDocsDue(row){return (daysUntil(row.licenseExpiry)<=30&&daysUntil(row.licenseExpiry)>=0)||(daysUntil(row.medicalExpiry)<=30&&daysUntil(row.medicalExpiry)>=0)||(daysUntil(row.insuranceExpiry)<=30&&daysUntil(row.insuranceExpiry)>=0)}
function getFleetMetricStats(){var vehicles=fleetData.vehicles||[];var drivers=fleetData.drivers||[];return [{key:'alerts',label:'Open Alerts',value:fleetOpenWorkflowCount(),note:'Alerts + follow-ups'},{key:'vehicles',label:'Vehicles',value:vehicles.length,note:'Current vehicle records'},{key:'drivers',label:'Drivers',value:drivers.length,note:'Current driver records'},{key:'service',label:'Service Due',value:vehicles.filter(fleetVehicleServiceDue).length,note:'Next 30 days'},{key:'driver-docs',label:'Driver Docs',value:drivers.filter(fleetDriverDocsDue).length,note:'Expiring soon'}]}
function getFleetRegions(mode){var rows=mode==='drivers'?fleetData.drivers:fleetData.vehicles;return Array.from(new Set((rows||[]).map(function(row){return row.region}).filter(Boolean))).sort()}
function getVisibleFleetSourceRows(){var rows=(fleetData.sourceRows||[]).filter(function(row){if(fleetVehicleFilters.status!=='All statuses'&&fleetVehicleFilters.status==='Archived'&&!/true|yes|archived/i.test(String(row.isArchived||'')))return false;if(fleetVehicleFilters.status!=='All statuses'&&fleetVehicleFilters.status!=='Archived'&&fleetVehicleFilters.status!==''&&String(row.currentActivity||'')!==fleetVehicleFilters.status)return false;if(fleetVehicleFilters.region!=='All regions'&&fleetRegionLabelFromSource(row)!==fleetVehicleFilters.region)return false;var q=fleetVehicleFilters.search.trim().toLowerCase();if(q&&[row.device,row.deviceGroup,row.currentDriver,row.currentActivity,row.lastStopAddress,row.licensePlate,row.licenseState,row.vin,row.serialNo,row.deviceType,row.plan,row.deviceComment,row.downloadStatus,row.lastTrip,row.lastCommunicationDate].join(' ').toLowerCase().indexOf(q)<0)return false;return true});rows=rows.slice();if(fleetVehicleFilters.sort==='Region')rows.sort(function(a,b){return fleetRegionLabelFromSource(a).localeCompare(fleetRegionLabelFromSource(b))});else if(fleetVehicleFilters.sort==='Communication')rows.sort(function(a,b){return String(b.lastCommunicationDate||'').localeCompare(String(a.lastCommunicationDate||''))});else rows.sort(function(a,b){return String(a.device||'').localeCompare(String(b.device||''))});return rows}
function fleetRegionLabelFromSource(row){return row.deviceGroup||''}
function getVisibleFleetVehicles(){var rows=(fleetData.vehicles||[]).filter(function(row){if(activeFleetMetric==='service'&&!fleetVehicleServiceDue(row))return false;if(fleetVehicleFilters.status!=='All statuses'&&row.status!==fleetVehicleFilters.status)return false;if(fleetVehicleFilters.service!=='All service'&&row.serviceStatus!==fleetVehicleFilters.service)return false;if(fleetVehicleFilters.region!=='All regions'&&row.region!==fleetVehicleFilters.region)return false;var q=fleetVehicleFilters.search.trim().toLowerCase();if(q&&[row.unit,row.region,row.status,row.serviceStatus,row.registrationStatus,row.vin,row.plate,row.make,row.model,row.assignedDriver].join(' ').toLowerCase().indexOf(q)<0)return false;return true});rows=rows.slice();if(fleetVehicleFilters.sort==='Service due')rows.sort(function(a,b){return daysUntil(a.nextServiceDate)-daysUntil(b.nextServiceDate)});else if(fleetVehicleFilters.sort==='Region')rows.sort(function(a,b){return String(a.region).localeCompare(String(b.region))});else rows.sort(function(a,b){return String(a.unit).localeCompare(String(b.unit))});return rows}
function getVisibleFleetDrivers(){var rows=(fleetData.drivers||[]).filter(function(row){if(activeFleetMetric==='driver-docs'&&!fleetDriverDocsDue(row))return false;if(fleetDriverFilters.status!=='All statuses'&&row.status!==fleetDriverFilters.status)return false;if(fleetDriverFilters.credential==='Expiring soon'&&!fleetDriverDocsDue(row))return false;if(fleetDriverFilters.region!=='All regions'&&row.region!==fleetDriverFilters.region)return false;var q=fleetDriverFilters.search.trim().toLowerCase();if(q&&[row.name,row.region,row.status,row.phone,row.email,row.assignedVehicle,row.nextAction].join(' ').toLowerCase().indexOf(q)<0)return false;return true});rows=rows.slice();if(fleetDriverFilters.sort==='Credential due')rows.sort(function(a,b){return Math.min(daysUntil(a.licenseExpiry),daysUntil(a.medicalExpiry),daysUntil(a.insuranceExpiry))-Math.min(daysUntil(b.licenseExpiry),daysUntil(b.medicalExpiry),daysUntil(b.insuranceExpiry))});else if(fleetDriverFilters.sort==='Region')rows.sort(function(a,b){return String(a.region).localeCompare(String(b.region))});else rows.sort(function(a,b){return String(a.name).localeCompare(String(b.name))});return rows}
function renderFleetPage(){if(fleetLoading&&!fleetData.vehicles.length&&!fleetData.drivers.length&&!fleetData.sourceRows.length){pagePanel.className='page-panel contractors-page loading-page';pagePanel.innerHTML='<div class="loading-card"><div class="spinner"></div><h3>Loading fleet records</h3><p>Pulling Geotab fleet data and protected Citadel workflow history.</p></div>';return}var isOverview=activePage==='fleet';var isDrivers=activePage==='fleet-drivers';var visible=isOverview?getVisibleFleetSourceRows():(isDrivers?getVisibleFleetDrivers():getVisibleFleetVehicles());var selected=isOverview?(fleetData.sourceRows[fleetData.selectedFleetIndex]||visible[0]||{}):(isDrivers?(fleetData.drivers[fleetData.selectedDriverIndex]||visible[0]||{}):(fleetData.vehicles[fleetData.selectedVehicleIndex]||visible[0]||{}));var metrics=getFleetMetricStats();pagePanel.className='page-panel contractors-page';pagePanel.innerHTML=renderModuleStatusLine(fleetLoading?'Refreshing...':fleetLastUpdated?'Updated '+fleetLastUpdated:(fleetLoadError||''))+'<div id="subTabs" class="sub-tabs" hidden></div><div class="contractors-metrics">'+metrics.map(function(metric){return '<button type="button" class="contractor-metric-button '+(activeFleetMetric===metric.key?'active':'')+'" data-fleet-metric="'+escapeHtml(metric.key)+'"><span>'+escapeHtml(metric.label)+'</span><strong>'+escapeHtml(metric.value)+'</strong><em>'+escapeHtml(metric.note)+'</em></button>'}).join('')+'</div>'+renderFleetFilterCard(isDrivers)+'<div class="contractors-workspace"><section class="contractors-records"><div class="contractors-section-head"><div><h3>'+escapeHtml(isOverview?'Geotab Fleet Report':isDrivers?'Drivers':'Vehicles')+'</h3><p>'+escapeHtml(isOverview?'Source report data from Geotab. Compliance updates live in protected workflow fields.':isDrivers?'Compliance-entered driver records and protected workflow.':'Vehicle workspace derived from Geotab report plus protected workflow.')+'</p></div><strong>'+escapeHtml(visible.length)+' showing</strong></div>'+renderFleetTable(visible,isDrivers,isOverview)+'</section><aside class="contractors-detail">'+renderFleetDetail(selected,isDrivers,isOverview)+'</aside></div>';subTabs=document.querySelector('#subTabs');renderSubTabs()}
function renderFleetFilterCard(isDrivers){if(isDrivers){return '<section class="contractors-filter-card"><div><h3>Filters + Sort + Search</h3><p>Refine fleet records the same way on every page</p></div><button type="button" data-fleet-report>Reports</button><div class="contractors-filters"><label>Status<select data-fleet-driver-filter="status">'+renderSelectOptions('All statuses',Array.from(new Set(fleetData.drivers.map(function(row){return row.status}).filter(Boolean))).sort(),fleetDriverFilters.status)+'</select></label><label>Credentials<select data-fleet-driver-filter="credential">'+renderSelectOptions('All credentials',['Expiring soon'],fleetDriverFilters.credential)+'</select></label><label>Region<select data-fleet-driver-filter="region">'+renderSelectOptions('All regions',getFleetRegions('drivers'),fleetDriverFilters.region)+'</select></label><label>Sort<select data-fleet-driver-filter="sort"><option'+(fleetDriverFilters.sort==='Driver A-Z'?' selected':'')+'>Driver A-Z</option><option'+(fleetDriverFilters.sort==='Credential due'?' selected':'')+'>Credential due</option><option'+(fleetDriverFilters.sort==='Region'?' selected':'')+'>Region</option></select></label><label>Search<input data-fleet-driver-filter="search" type="search" placeholder="Search drivers" value="'+escapeHtml(fleetDriverFilters.search)+'"></label></div></section>'}return '<section class="contractors-filter-card"><div><h3>Filters + Sort + Search</h3><p>Refine fleet records the same way on every page</p></div><button type="button" data-fleet-report>Reports</button><div class="contractors-filters"><label>Status<select data-fleet-vehicle-filter="status">'+renderSelectOptions('All statuses',Array.from(new Set(fleetData.vehicles.map(function(row){return row.status}).filter(Boolean))).sort(),fleetVehicleFilters.status)+'</select></label><label>Service<select data-fleet-vehicle-filter="service">'+renderSelectOptions('All service',Array.from(new Set(fleetData.vehicles.map(function(row){return row.serviceStatus}).filter(Boolean))).sort(),fleetVehicleFilters.service)+'</select></label><label>Region<select data-fleet-vehicle-filter="region">'+renderSelectOptions('All regions',getFleetRegions('vehicles'),fleetVehicleFilters.region)+'</select></label><label>Sort<select data-fleet-vehicle-filter="sort"><option'+(fleetVehicleFilters.sort==='Unit A-Z'?' selected':'')+'>Unit A-Z</option><option'+(fleetVehicleFilters.sort==='Service due'?' selected':'')+'>Service due</option><option'+(fleetVehicleFilters.sort==='Region'?' selected':'')+'>Region</option></select></label><label>Search<input data-fleet-vehicle-filter="search" type="search" placeholder="Search vehicles" value="'+escapeHtml(fleetVehicleFilters.search)+'"></label></div></section>'}
function renderFleetTable(rows,isDrivers,isOverview){if(isOverview){return '<div class="contractors-table fleet-source-table"><div class="contractors-table-head"><span>Device</span><span>Group</span><span>Driver</span><span>Activity</span><span>Plate</span><span>Last Communication</span></div>'+rows.map(function(record){var index=fleetData.sourceRows.indexOf(record);return '<button type="button" class="contractors-row'+(index===fleetData.selectedFleetIndex?' active':'')+'" data-fleet-source-index="'+index+'"><span><strong>'+escapeHtml(record.device)+'</strong><em>'+escapeHtml(record.deviceType)+'</em></span><span>'+escapeHtml(record.deviceGroup)+'</span><span>'+escapeHtml(record.currentDriver||[record.firstName,record.lastName].filter(Boolean).join(' '))+'</span><span><mark>'+escapeHtml(record.currentActivity)+'</mark></span><span>'+escapeHtml([record.licensePlate,record.licenseState].filter(Boolean).join(' / '))+'</span><span>'+escapeHtml(record.lastCommunicationDate)+'</span></button>'}).join('')+'</div>'}if(isDrivers){return '<div class="contractors-table"><div class="contractors-table-head"><span>Driver</span><span>Region</span><span>Status</span><span>License Exp.</span><span>Medical Exp.</span><span>Vehicle</span></div>'+rows.map(function(record){var index=fleetData.drivers.indexOf(record);return '<button type="button" class="contractors-row'+(index===fleetData.selectedDriverIndex?' active':'')+'" data-fleet-driver-index="'+index+'"><span><strong>'+escapeHtml(record.name)+'</strong><em>'+escapeHtml(record.phone)+'</em></span><span>'+escapeHtml(record.region)+'</span><span><mark>'+escapeHtml(record.status)+'</mark></span><span>'+escapeHtml(record.licenseExpiry)+'</span><span>'+escapeHtml(record.medicalExpiry)+'</span><span>'+escapeHtml(record.assignedVehicle)+'</span></button>'}).join('')+'</div>'}return '<div class="contractors-table"><div class="contractors-table-head"><span>Unit</span><span>Region</span><span>Status</span><span>Service</span><span>Registration</span><span>Driver</span></div>'+rows.map(function(record){var index=fleetData.vehicles.indexOf(record);return '<button type="button" class="contractors-row'+(index===fleetData.selectedVehicleIndex?' active':'')+'" data-fleet-vehicle-index="'+index+'"><span><strong>'+escapeHtml(record.unit)+'</strong><em>'+escapeHtml([record.year,record.make,record.model].filter(Boolean).join(' '))+'</em></span><span>'+escapeHtml(record.region)+'</span><span><mark>'+escapeHtml(record.status)+'</mark></span><span>'+escapeHtml(record.serviceStatus)+'</span><span>'+escapeHtml(record.registrationStatus)+'</span><span>'+escapeHtml(record.assignedDriver)+'</span></button>'}).join('')+'</div>'}
function renderFleetDetail(selected,isDrivers,isOverview){if(isOverview){return '<div class="contractors-detail-head"><div><span>Selected Geotab record</span><h3>'+escapeHtml(selected.device||'')+'</h3><p>'+escapeHtml(selected.deviceGroup||'')+' / '+escapeHtml(selected.currentActivity||'')+'</p></div></div><div class="contractors-detail-grid"><article><span>Current Driver</span><strong>'+escapeHtml(selected.currentDriver||[selected.firstName,selected.lastName].filter(Boolean).join(' '))+'</strong></article><article><span>License Plate</span><strong>'+escapeHtml([selected.licensePlate,selected.licenseState].filter(Boolean).join(' / '))+'</strong></article><article><span>VIN</span><strong>'+escapeHtml(selected.vin||'')+'</strong></article><article><span>Odometer</span><strong>'+escapeHtml(selected.currentOdometer||'')+'</strong></article><article><span>Engine Hours</span><strong>'+escapeHtml(selected.currentEngineHours||'')+'</strong></article><article><span>Serial No.</span><strong>'+escapeHtml(selected.serialNo||'')+'</strong></article><article><span>Last Stop</span><strong>'+escapeHtml(selected.lastStopAddress||'')+'</strong></article><article><span>Last Communication</span><strong>'+escapeHtml(selected.lastCommunicationDate||'')+'</strong></article><article><span>Download Status</span><strong>'+escapeHtml(selected.downloadStatus||'')+'</strong></article><article><span>Comment</span><strong>'+escapeHtml(selected.deviceComment||'')+'</strong></article></div><section class="contractors-workflow"><div class="card-heading"><h3>Citadel Workflow</h3><span>Protected from source imports</span></div><p class="liens-empty">Use Vehicles or Drivers for protected compliance notes, alerts, and follow-ups.</p></section>'}if(isDrivers){return '<div class="contractors-detail-head"><div><span>Selected driver</span><h3>'+escapeHtml(selected.name||'')+'</h3><p>'+escapeHtml(selected.region||'')+' / '+escapeHtml(selected.status||'')+'</p></div></div><div class="contractors-detail-grid"><article><span>Phone</span><strong>'+escapeHtml(selected.phone||'')+'</strong></article><article><span>Email</span><strong>'+escapeHtml(selected.email||'')+'</strong></article><article><span>License Expiry</span><strong>'+escapeHtml(selected.licenseExpiry||'')+'</strong></article><article><span>Medical Card</span><strong>'+escapeHtml(selected.medicalExpiry||'')+'</strong></article><article><span>Insurance</span><strong>'+escapeHtml(selected.insuranceExpiry||'')+'</strong></article><article><span>Vehicle</span><strong>'+escapeHtml(selected.assignedVehicle||'')+'</strong></article><article><span>Next Action</span><strong>'+escapeHtml(selected.nextAction||'')+'</strong></article></div><section class="contractors-workflow"><div class="card-heading"><h3>Citadel Workflow</h3><span>Protected from source imports</span></div><p class="liens-empty">Fleet notes, alerts, and follow-ups are ready in the sheet and can be wired to saves next.</p></section>'}return '<div class="contractors-detail-head"><div><span>Selected vehicle</span><h3>'+escapeHtml(selected.unit||'')+'</h3><p>'+escapeHtml(selected.region||'')+' / '+escapeHtml(selected.status||'')+'</p></div></div><div class="contractors-detail-grid"><article><span>Service</span><strong>'+escapeHtml(selected.serviceStatus||'')+'</strong></article><article><span>Registration</span><strong>'+escapeHtml(selected.registrationStatus||'')+'</strong></article><article><span>VIN</span><strong>'+escapeHtml(selected.vin||'')+'</strong></article><article><span>Plate</span><strong>'+escapeHtml(selected.plate||'')+'</strong></article><article><span>Vehicle</span><strong>'+escapeHtml([selected.year,selected.make,selected.model].filter(Boolean).join(' '))+'</strong></article><article><span>Driver</span><strong>'+escapeHtml(selected.assignedDriver||'')+'</strong></article><article><span>Next Service</span><strong>'+escapeHtml(selected.nextServiceDate||'')+'</strong></article></div><section class="contractors-workflow"><div class="card-heading"><h3>Citadel Workflow</h3><span>Protected from source imports</span></div><p class="liens-empty">Fleet notes, alerts, and follow-ups are ready in the sheet and can be wired to saves next.</p></section>'}
function bindFleetPage(){if(fleetPageEventsBound)return;fleetPageEventsBound=true;pagePanel.addEventListener('click',function(event){if(activePage!=='fleet'&&activePage!=='fleet-vehicles'&&activePage!=='fleet-drivers')return;var metric=event.target.closest('[data-fleet-metric]');if(metric){activeFleetMetric=metric.getAttribute('data-fleet-metric')||'all';fleetData.selectedVehicleIndex=0;fleetData.selectedDriverIndex=0;renderFleetPage();return}if(event.target.closest('[data-fleet-report]')){openFleetReportsModal();return}var source=event.target.closest('[data-fleet-source-index]');if(source){fleetData.selectedFleetIndex=Number(source.getAttribute('data-fleet-source-index'));renderFleetPage();return}var vehicle=event.target.closest('[data-fleet-vehicle-index]');if(vehicle){fleetData.selectedVehicleIndex=Number(vehicle.getAttribute('data-fleet-vehicle-index'));renderFleetPage();return}var driver=event.target.closest('[data-fleet-driver-index]');if(driver){fleetData.selectedDriverIndex=Number(driver.getAttribute('data-fleet-driver-index'));renderFleetPage()}});pagePanel.addEventListener('change',function(event){if(activePage!=='fleet'&&activePage!=='fleet-vehicles'&&activePage!=='fleet-drivers')return;var vehicle=event.target.closest('select[data-fleet-vehicle-filter]');var driver=event.target.closest('select[data-fleet-driver-filter]');if(vehicle){fleetVehicleFilters[vehicle.getAttribute('data-fleet-vehicle-filter')]=vehicle.value;fleetData.selectedVehicleIndex=0;renderFleetPage()}if(driver){fleetDriverFilters[driver.getAttribute('data-fleet-driver-filter')]=driver.value;fleetData.selectedDriverIndex=0;renderFleetPage()}});pagePanel.addEventListener('input',function(event){if(activePage!=='fleet'&&activePage!=='fleet-vehicles'&&activePage!=='fleet-drivers')return;var vehicle=event.target.closest("input[data-fleet-vehicle-filter='search']");var driver=event.target.closest("input[data-fleet-driver-filter='search']");if(!vehicle&&!driver)return;if(vehicle)fleetVehicleFilters.search=vehicle.value;if(driver)fleetDriverFilters.search=driver.value;window.clearTimeout(fleetSearchTimer);fleetSearchTimer=window.setTimeout(function(){if(vehicle)fleetData.selectedVehicleIndex=0;if(driver)fleetData.selectedDriverIndex=0;renderFleetPage();var next=pagePanel.querySelector(vehicle?"input[data-fleet-vehicle-filter='search']":"input[data-fleet-driver-filter='search']");if(next){next.focus();next.setSelectionRange(next.value.length,next.value.length)}},180)})}
function openFleetReportsModal(){var isDrivers=activePage==='fleet-drivers';var isOverview=activePage==='fleet';var rows=isOverview?getVisibleFleetSourceRows():(isDrivers?getVisibleFleetDrivers():getVisibleFleetVehicles());openWorkspaceReportsModal(isOverview?'Fleet Geotab Reports':isDrivers?'Fleet Driver Reports':'Fleet Vehicle Reports','Export the current filtered Fleet view.',rows.length,function(format){exportFleetReport(format,isDrivers)})}
function exportFleetReport(format,isDrivers){var isOverview=activePage==='fleet';var rows=isOverview?getVisibleFleetSourceRows():(isDrivers?getVisibleFleetDrivers():getVisibleFleetVehicles());var table=isOverview?[['Device','Device Group','First Name','Last Name','Current Driver','Work Time','Current Activity','Privacy Mode','Last Stop Address','Last Stop Zone Types','Current Odometer','Current Engine Hours','Active From','Active To','Archived','Plan','Device Type','Firmware Version','Serial No.','License Plate','License State','VIN','Time Zone','Device Comment','Download Status','Last Trip','Last Communication Date']].concat(rows.map(function(row){return [row.device,row.deviceGroup,row.firstName,row.lastName,row.currentDriver,row.workTime,row.currentActivity,row.privacyMode,row.lastStopAddress,row.lastStopZoneTypes,row.currentOdometer,row.currentEngineHours,row.activeFrom,row.activeTo,row.isArchived,row.plan,row.deviceType,row.firmwareVersion,row.serialNo,row.licensePlate,row.licenseState,row.vin,row.timeZone,row.deviceComment,row.downloadStatus,row.lastTrip,row.lastCommunicationDate]})):isDrivers?[['Driver','Region','Status','Phone','Email','License Expiry','Medical Expiry','Insurance Expiry','Assigned Vehicle','Next Action']].concat(rows.map(function(row){return [row.name,row.region,row.status,row.phone,row.email,row.licenseExpiry,row.medicalExpiry,row.insuranceExpiry,row.assignedVehicle,row.nextAction]})):[['Unit','Region','Status','Service Status','Registration Status','VIN','Plate','Make','Model','Year','Assigned Driver','Next Service Date']].concat(rows.map(function(row){return [row.unit,row.region,row.status,row.serviceStatus,row.registrationStatus,row.vin,row.plate,row.make,row.model,row.year,row.assignedDriver,row.nextServiceDate]}));reportDownloadTable(table,format,isOverview?'citadel-fleet-geotab-report':isDrivers?'citadel-fleet-drivers-report':'citadel-fleet-vehicles-report')}
function loadFleetData(){if(!CITADEL_API_URL){fleetLoading=false;return}if(!fleetData.sourceRows.length&&!fleetData.vehicles.length&&!fleetData.drivers.length)hydrateFleetFromCache();fleetLoading=true;fleetLoadError='';if((activePage==='fleet'||activePage==='fleet-vehicles'||activePage==='fleet-drivers')&&!fleetData.sourceRows.length&&!fleetData.vehicles.length&&!fleetData.drivers.length)renderContent();jsonp(CITADEL_API_URL+'?action=getFleet').then(function(response){if(!response||!response.ok||!response.data)throw new Error(response&&response.error?response.error:'No fleet data returned');applyFleetPayload(response.data);saveFleetCache(response.data);fleetLoading=false;if(activePage==='fleet'||activePage==='fleet-vehicles'||activePage==='fleet-drivers'||activePage==='command-center'||activePage==='region-health')renderContent()}).catch(function(error){fleetLoading=false;fleetLoadError='Fleet sheet not connected yet';console.warn('Fleet sheet load failed',error);if(activePage==='fleet'||activePage==='fleet-vehicles'||activePage==='fleet-drivers')renderContent()})}

function normalizeCollectionRecord(record){
  return {
    id:record.collection_id||record.id,
    lienId:record.lien_id||'',
    region:record.region||'',
    salesRep:record.sales_rep||'',
    jobNumber:record.job_number||record.account_id||'',
    jobLink:record.job_link||'',
    customer:record.customer||'',
    currentStage:record.current_stage||'',
    agingDays:Number(record.aging_days||0),
    sourceBalance:record.source_balance||0,
    paymentsReceived:record.payments_received||0,
    firstInvoice:record.first_invoice_date||'',
    latestInvoice:record.latest_invoice_date||'',
    invoiceCount:record.invoice_count||'',
    agency:record.collection_agency||'',
    sentDate:record.date_sent_to_agency||record.sent_date||'',
    amountOutstanding:record.amount_outstanding||0,
    amountCollected:record.amount_collected||0,
    amountWeReceive:record.amount_we_receive||0,
    dateReceived:record.date_received||'',
    status:record.tracking_status||record.status||'Needs Assignment',
    sourceStatus:record.source_status||'Collection Agency',
    createdAt:record.created_at||'',
    updatedBy:record.updated_by||'',
    lastUpdated:record.last_updated||'',
    notesCount:Number(record.notes_count||0),
    alertsCount:Number(record.alerts_count||0)
  }
}
function normalizeBusinessContact(record){
  return {
    id:record.contact_id||record.id,
    sourceType:'contact',
    contactType:record.contact_type||'Other',
    organizationName:record.organization_name||'',
    contactName:record.contact_name||'',
    jobTitle:record.job_title||'',
    department:record.department||'',
    primaryEmail:record.primary_email||'',
    secondaryEmail:record.secondary_email||'',
    officePhone:record.office_phone||'',
    phoneExtension:record.phone_extension||'',
    mobilePhone:record.mobile_phone||'',
    fax:record.fax||'',
    website:record.website||'',
    preferredContactMethod:record.preferred_contact_method||'',
    businessAddress1:record.business_address_1||'',
    businessAddress2:record.business_address_2||'',
    businessCity:record.business_city||'',
    businessState:record.business_state||'',
    businessZip:record.business_zip||'',
    businessCountry:record.business_country||'',
    mailingSameAsBusiness:record.mailing_same_as_business===true||String(record.mailing_same_as_business).toLowerCase()==='true',
    mailingAddress1:record.mailing_address_1||'',
    mailingAddress2:record.mailing_address_2||'',
    mailingCity:record.mailing_city||'',
    mailingState:record.mailing_state||'',
    mailingZip:record.mailing_zip||'',
    mailingCountry:record.mailing_country||'',
    notes:record.notes||'',
    createdAt:record.created_at||'',
    updatedAt:record.updated_at||''
  }
}
function normalizeCollectionAttorney(record){
  return {
    id:record.attorney_id||record.id,
    sourceType:'attorney',
    contactType:'Attorney',
    organizationName:record.firm_name||record.office_name||'',
    firmName:record.firm_name||'',
    officeName:record.office_name||'',
    contactName:record.attorney_name||'',
    jobTitle:record.job_title||'Attorney',
    department:'Legal',
    barNumber:record.bar_number||'',
    licensedStates:record.licensed_states||'',
    practiceAreas:record.practice_areas||'',
    primaryEmail:record.primary_email||'',
    secondaryEmail:record.secondary_email||'',
    officePhone:record.office_phone||'',
    phoneExtension:record.phone_extension||'',
    mobilePhone:record.mobile_phone||'',
    fax:record.fax||'',
    website:record.website||'',
    preferredContactMethod:record.preferred_contact_method||'',
    businessAddress1:record.business_address_1||'',
    businessAddress2:record.business_address_2||'',
    businessCity:record.business_city||'',
    businessState:record.business_state||'',
    businessZip:record.business_zip||'',
    businessCountry:record.business_country||'',
    mailingSameAsBusiness:record.mailing_same_as_business===true||String(record.mailing_same_as_business).toLowerCase()==='true',
    mailingAddress1:record.mailing_address_1||'',
    mailingAddress2:record.mailing_address_2||'',
    mailingCity:record.mailing_city||'',
    mailingState:record.mailing_state||'',
    mailingZip:record.mailing_zip||'',
    mailingCountry:record.mailing_country||'',
    notes:record.notes||'',
    createdAt:record.created_at||'',
    updatedAt:record.updated_at||''
  }
}
function applyCollectionsPayload(data){
  var contacts=(data.contacts||[]).map(normalizeBusinessContact);
  var attorneys=(data.attorneys||[]).map(normalizeCollectionAttorney);
  collectionsData.records=(data.records||[]).map(normalizeCollectionRecord);
  collectionsData.notes=data.notes||[];
  collectionsData.alerts=data.alerts||[];
  collectionsData.attorneys=attorneys;
  collectionsData.contacts=contacts.concat(attorneys);
  collectionsData.contactLinks=data.contactLinks||[];
  collectionsData.metrics=data.metrics||[];
  collectionsData.selectedIndex=0;
  collectionsData.selectedContactIndex=0;
  collectionsLastUpdated=new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})
}
function saveCollectionsCache(data){try{localStorage.setItem(COLLECTIONS_CACHE_KEY,JSON.stringify({savedAt:Date.now(),data:data}))}catch(error){console.warn('Collections cache save failed',error)}}
function hydrateCollectionsFromCache(){try{var cached=JSON.parse(localStorage.getItem(COLLECTIONS_CACHE_KEY)||'null');if(!cached||!cached.data)return false;applyCollectionsPayload(cached.data);collectionsLoading=false;collectionsLoadError='';collectionsLastUpdated=cached.savedAt?new Date(cached.savedAt).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}):collectionsLastUpdated;return true}catch(error){console.warn('Collections cache read failed',error);return false}}
function loadCollectionsData(){
  if(!CITADEL_API_URL){collectionsLoading=false;collectionsLoadError='Collections sheet not connected yet';return}
  if(!collectionsData.records.length&&!collectionsData.contacts.length)hydrateCollectionsFromCache();
  collectionsLoading=true;
  collectionsLoadError='';
  if(activePage==='collections'&&!collectionsData.records.length&&!collectionsData.contacts.length)renderContent();
  jsonp(CITADEL_API_URL+'?action=getCollections').then(function(response){
    if(!response||!response.ok||!response.data)throw new Error(response&&response.error?response.error:'No collections data returned');
    applyCollectionsPayload(response.data);
    saveCollectionsCache(response.data);
    collectionsLoading=false;
    if(activePage==='collections'||activePage==='command-center')renderContent()
  }).catch(function(error){
    collectionsLoading=false;
    collectionsLoadError='Unable to refresh collection records';
    console.warn('Collections sheet load failed',error);
    if(activePage==='collections'||activePage==='command-center')renderContent()
  })
}
function getCollectionAgencies(){
  var values=(collectionsData.records||[]).map(function(row){return row.agency}).concat((collectionsData.contacts||[]).filter(function(row){return row.contactType==='Collection Agency'}).map(function(row){return row.organizationName})).filter(Boolean);
  return Array.from(new Set(values)).sort()
}
function getCollectionRegions(){return Array.from(new Set((collectionsData.records||[]).map(function(row){return row.region}).filter(Boolean))).sort()}
function getCollectionStages(){return Array.from(new Set((collectionsData.records||[]).map(function(row){return row.currentStage}).filter(Boolean))).sort()}
function getCollectionContactTypes(){return Array.from(new Set((collectionsData.contacts||[]).map(function(row){return row.contactType}).filter(Boolean).concat(['Attorney']))).sort()}
function getCollectionContactStates(){return Array.from(new Set((collectionsData.contacts||[]).map(function(row){return row.businessState}).filter(Boolean))).sort()}
function getCollectionMetricStats(){
  var records=collectionsData.records||[];
  var outstanding=records.reduce(function(sum,row){return sum+moneyNumber(row.amountOutstanding)},0);
  var collected=records.reduce(function(sum,row){return sum+moneyNumber(row.amountCollected)},0);
  var expected=records.reduce(function(sum,row){return sum+moneyNumber(row.amountWeReceive)},0);
  return [
    {key:'open_alerts',label:'Open Alerts',value:(collectionsData.alerts||[]).filter(workflowItemIsOpen).length,note:'Collection follow-up'},
    {key:'accounts',label:'Jobs',value:records.length,note:'Sent to collections'},
    {key:'outstanding',label:'Outstanding',value:moneyLabel(outstanding),note:'Still due'},
    {key:'collected',label:'Collected',value:moneyLabel(collected),note:'Agency recovery'},
    {key:'expected',label:'Expected Receipt',value:moneyLabel(expected),note:'Amount due to Elite'},
    {key:'attorneys',label:'Attorneys',value:(collectionsData.contacts||[]).filter(function(row){return row.contactType==='Attorney'}).length,note:'Protected directory'}
  ]
}
function getVisibleCollectionRecords(){
  var rows=(collectionsData.records||[]).slice();
  if(activeCollectionMetric==='open_alerts')rows=rows.filter(function(row){return row.alertsCount>0});
  if(activeCollectionMetric==='outstanding')rows=rows.filter(function(row){return moneyNumber(row.amountOutstanding)>0});
  if(activeCollectionMetric==='collected')rows=rows.filter(function(row){return moneyNumber(row.amountCollected)>0});
  if(activeCollectionMetric==='expected')rows=rows.filter(function(row){return moneyNumber(row.amountWeReceive)>0});
  if(collectionFilters.agency!=='All agencies')rows=rows.filter(function(row){return row.agency===collectionFilters.agency});
  if(collectionFilters.stage!=='All stages')rows=rows.filter(function(row){return row.currentStage===collectionFilters.stage});
  if(collectionFilters.region!=='All regions')rows=rows.filter(function(row){return row.region===collectionFilters.region});
  var query=collectionFilters.search.trim().toLowerCase();
  if(query)rows=rows.filter(function(row){return [row.jobNumber,row.jobLink,row.customer,row.region,row.salesRep,row.currentStage,row.agency,row.status,row.sentDate,row.dateReceived].join(' ').toLowerCase().indexOf(query)>-1});
  if(collectionFilters.sort==='Highest outstanding')rows.sort(function(a,b){return moneyNumber(b.amountOutstanding)-moneyNumber(a.amountOutstanding)});
  if(collectionFilters.sort==='Highest collected')rows.sort(function(a,b){return moneyNumber(b.amountCollected)-moneyNumber(a.amountCollected)});
  if(collectionFilters.sort==='Highest expected')rows.sort(function(a,b){return moneyNumber(b.amountWeReceive)-moneyNumber(a.amountWeReceive)});
  if(collectionFilters.sort==='Newest sent')rows.sort(function(a,b){return String(b.sentDate).localeCompare(String(a.sentDate))});
  if(collectionFilters.sort==='Oldest aging')rows.sort(function(a,b){return Number(b.agingDays)-Number(a.agingDays)});
  return rows
}
function getVisibleBusinessContacts(){
  var rows=(collectionsData.contacts||[]).slice();
  if(contactFilters.type!=='All contact types')rows=rows.filter(function(row){return row.contactType===contactFilters.type});
  if(contactFilters.state!=='All states')rows=rows.filter(function(row){return row.businessState===contactFilters.state});
  var query=contactFilters.search.trim().toLowerCase();
  if(query)rows=rows.filter(function(row){return [row.contactType,row.organizationName,row.officeName,row.contactName,row.jobTitle,row.barNumber,row.licensedStates,row.practiceAreas,row.primaryEmail,row.secondaryEmail,row.officePhone,row.mobilePhone,row.fax,row.website,row.businessAddress1,row.businessCity,row.businessState,row.businessZip].join(' ').toLowerCase().indexOf(query)>-1});
  if(contactFilters.sort==='Organization A-Z')rows.sort(function(a,b){return String(a.organizationName).localeCompare(String(b.organizationName))});
  if(contactFilters.sort==='Contact A-Z')rows.sort(function(a,b){return String(a.contactName).localeCompare(String(b.contactName))});
  if(contactFilters.sort==='Recently updated')rows.sort(function(a,b){return String(b.updatedAt).localeCompare(String(a.updatedAt))});
  return rows
}
function getCollectionWorkspaceItems(kind,collectionId){return (collectionsData[kind]||[]).filter(function(item){return String(item.collection_id)===String(collectionId)}).slice().reverse()}
function getCollectionLinks(collectionId){return (collectionsData.contactLinks||[]).filter(function(link){return String(link.collection_id)===String(collectionId)&&workflowItemIsOpen(link)})}
function getBusinessContact(contactId){return (collectionsData.contacts||[]).find(function(contact){return String(contact.id)===String(contactId)})}
function formatBusinessAddress(contact,mailing){
  if(!contact)return '';
  if(mailing&&contact.mailingSameAsBusiness)return formatBusinessAddress(contact,false);
  var prefix=mailing?'mailing':'business';
  var lines=[contact[prefix+'Address1'],contact[prefix+'Address2'],[contact[prefix+'City'],contact[prefix+'State'],contact[prefix+'Zip']].filter(Boolean).join(', '),contact[prefix+'Country']].filter(Boolean);
  return lines.join(' / ')
}
function collectionJobLinkHtml(record){
  var url=String(record.jobLink||'').trim();
  if(!/^https?:\/\//i.test(url))return escapeHtml(url||'-');
  return '<a class="collection-job-link" href="'+escapeHtml(url)+'" target="_blank" rel="noopener noreferrer">Open job</a>'
}
function renderCollectionRelatedContacts(record){
  var links=getCollectionLinks(record.id);
  if(!links.length)return '<p class="liens-empty">No contacts or attorneys linked yet.</p>';
  var grouped={};
  links.forEach(function(link){var role=link.relationship||'Other';var contact=getBusinessContact(link.contact_id);if(!contact)return;(grouped[role]||(grouped[role]=[])).push(contact)});
  return '<div class="collection-related-contacts">'+Object.keys(grouped).sort().map(function(role){return '<section><h5>'+escapeHtml(role)+'</h5>'+grouped[role].map(function(contact){return '<article><strong>'+escapeHtml(contact.organizationName||contact.contactName)+'</strong><span>'+escapeHtml([contact.contactName,contact.jobTitle].filter(Boolean).join(' - '))+'</span><span>'+escapeHtml([contact.officePhone,contact.mobilePhone,contact.primaryEmail].filter(Boolean).join(' | '))+'</span></article>'}).join('')+'</section>'}).join('')+'</div>'
}
function renderCollectionFilters(){
  if(collectionView==='contacts')return '<div class="liens-filters collections-contact-filters"><label>Contact Type<select data-contact-filter="type">'+renderSelectOptions('All contact types',getCollectionContactTypes(),contactFilters.type)+'</select></label><label>State<select data-contact-filter="state">'+renderSelectOptions('All states',getCollectionContactStates(),contactFilters.state)+'</select></label><label>Sort<select data-contact-filter="sort"><option'+(contactFilters.sort==='Organization A-Z'?' selected':'')+'>Organization A-Z</option><option'+(contactFilters.sort==='Contact A-Z'?' selected':'')+'>Contact A-Z</option><option'+(contactFilters.sort==='Recently updated'?' selected':'')+'>Recently updated</option></select></label><label>Search<input data-contact-filter="search" type="search" placeholder="Attorney, firm, agency, contact" value="'+escapeHtml(contactFilters.search)+'"></label></div>';
  return '<div class="liens-filters"><label>Agency<select data-collection-filter="agency">'+renderSelectOptions('All agencies',getCollectionAgencies(),collectionFilters.agency)+'</select></label><label>Current Stage<select data-collection-filter="stage">'+renderSelectOptions('All stages',getCollectionStages(),collectionFilters.stage)+'</select></label><label>Region<select data-collection-filter="region">'+renderSelectOptions('All regions',getCollectionRegions(),collectionFilters.region)+'</select></label><label>Sort<select data-collection-filter="sort"><option'+(collectionFilters.sort==='Highest outstanding'?' selected':'')+'>Highest outstanding</option><option'+(collectionFilters.sort==='Highest collected'?' selected':'')+'>Highest collected</option><option'+(collectionFilters.sort==='Highest expected'?' selected':'')+'>Highest expected</option><option'+(collectionFilters.sort==='Newest sent'?' selected':'')+'>Newest sent</option><option'+(collectionFilters.sort==='Oldest aging'?' selected':'')+'>Oldest aging</option></select></label><label>Search<input data-collection-filter="search" type="search" placeholder="Job, customer, rep, agency" value="'+escapeHtml(collectionFilters.search)+'"></label></div>'
}
function renderCollectionAccountsWorkspace(){
  var rows=getVisibleCollectionRecords();
  var current=collectionsData.records[collectionsData.selectedIndex];
  var selected=rows.find(function(record){return current&&record.id===current.id})||rows[0]||null;
  if(selected)collectionsData.selectedIndex=collectionsData.records.indexOf(selected);
  var table='<div class="collections-table" role="table"><div class="collections-table-head" role="row"><span>Job / Customer</span><span>Region / Rep</span><span>Stage / Aging</span><span>Agency / Date</span><span>Outstanding</span><span>We Receive</span></div>'+(rows.length?rows.map(function(record){var index=collectionsData.records.indexOf(record);return '<div class="collections-row'+(index===collectionsData.selectedIndex?' active':'')+'" data-collection-index="'+index+'" role="row" tabindex="0"><span><strong>'+escapeHtml(record.jobNumber||record.id)+'</strong><em>'+escapeHtml(record.customer)+'</em></span><span><strong>'+escapeHtml(record.region||'-')+'</strong><em>'+escapeHtml(record.salesRep||'-')+'</em></span><span><strong>'+escapeHtml(record.currentStage||'-')+'</strong><em>'+escapeHtml(record.agingDays+' days')+'</em></span><span><strong>'+escapeHtml(record.agency||'-')+'</strong><em>'+escapeHtml(record.sentDate||'-')+'</em></span><span>'+escapeHtml(moneyLabel(record.amountOutstanding))+'</span><span>'+escapeHtml(moneyLabel(record.amountWeReceive))+'</span></div>'}).join(''):'<p class="collections-empty-table">No collection jobs match this view.</p>')+'</div>';
  var detail=selected?renderCollectionRecordDetail(selected):'<aside class="liens-detail collections-detail"><div class="collections-empty-detail"><h3>No Collection Agency records</h3><p>Records appear here automatically when their Liens status is set to Collection Agency.</p></div></aside>';
  return '<div class="liens-workspace"><section class="liens-records"><div class="liens-section-head"><div><h3>Collection Jobs</h3><p>Track source job details, agency placement, recovery, and receipt.</p></div><strong>'+escapeHtml(rows.length)+' showing</strong></div>'+table+'</section>'+detail+'</div>'
}

function renderCollectionTrackingInput(label,name,type,value,placeholder){
  var numeric=type==='number';
  return '<label><span>'+escapeHtml(label)+'</span><input data-collection-tracking-field name="'+escapeHtml(name)+'" type="'+escapeHtml(type)+'" value="'+escapeHtml(value)+'"'+(placeholder?' placeholder="'+escapeHtml(placeholder)+'"':'')+(numeric?' min="0" step="0.01" inputmode="decimal"':'')+'></label>'
}

function renderCollectionTrackingForm(selected){
  var agencyOptions=getCollectionAgencies().map(function(value){return '<option value="'+escapeHtml(value)+'">'}).join('');
  return '<form class="collection-tracking-form" data-collection-tracking-form>'+
    '<input type="hidden" name="collection_id" value="'+escapeHtml(selected.id)+'">'+
    '<input type="hidden" name="lien_id" value="'+escapeHtml(selected.lienId)+'">'+
    '<p class="collection-tracking-help">Enter or update these collection details at any time, then save your changes.</p>'+
    '<div class="collection-tracking-form-grid">'+
      '<label><span>Collection Agency</span><input data-collection-tracking-field name="collection_agency" list="collection-agency-options" value="'+escapeHtml(selected.agency)+'" placeholder="Agency name"><datalist id="collection-agency-options">'+agencyOptions+'</datalist></label>'+
      renderCollectionTrackingInput('Date Sent to Agency','date_sent_to_agency','date',selected.sentDate,'')+
      renderCollectionTrackingInput('Amount Outstanding','amount_outstanding','number',selected.amountOutstanding,'0.00')+
      renderCollectionTrackingInput('Amount Collected','amount_collected','number',selected.amountCollected||'','0.00')+
      renderCollectionTrackingInput('Amount We Will Receive','amount_we_receive','number',selected.amountWeReceive||'','0.00')+
      renderCollectionTrackingInput('Date Received','date_received','date',selected.dateReceived,'')+
    '</div>'+
    '<section class="collection-assignment-panel"><div><h4>Assigned Contacts & Attorneys</h4><p>Select one or more saved attorneys, agencies, company, office, or customer contacts.</p></div>'+renderCollectionContactChoices(selected)+'</section>'+
    '<button type="submit" class="collection-save-tracking">Save Tracking Changes</button>'+
  '</form>'
}

function renderCollectionRecordDetail(selected){
  var tracking=renderCollectionTrackingForm(selected);
  return '<aside class="liens-detail collections-detail"><div class="liens-detail-head"><div><span>Selected record</span><h3>'+escapeHtml(selected.jobNumber||selected.id)+' - '+escapeHtml(selected.customer)+'</h3><p>Collections / '+escapeHtml(selected.status)+'</p></div></div><div class="liens-detail-grid"><article><span>Region</span><strong>'+escapeHtml(selected.region||'-')+'</strong></article><article><span>Sales Rep</span><strong>'+escapeHtml(selected.salesRep||'-')+'</strong></article><article><span>Source Balance</span><strong>'+escapeHtml(moneyLabel(selected.sourceBalance))+'</strong></article><article><span>Days Past Due</span><strong>'+escapeHtml(selected.agingDays)+'</strong></article><article><span>Payments</span><strong>'+escapeHtml(moneyLabel(selected.paymentsReceived))+'</strong></article><article><span>Current Stage</span><strong>'+escapeHtml(selected.currentStage||'-')+'</strong></article><article><span>First Invoice</span><strong>'+escapeHtml(selected.firstInvoice||'-')+'</strong></article><article><span>Latest Invoice</span><strong>'+escapeHtml(selected.latestInvoice||'-')+'</strong></article><article><span>Invoice Count</span><strong>'+escapeHtml(selected.invoiceCount||'-')+'</strong></article><article><span>Job Link</span><strong>'+collectionJobLinkHtml(selected)+'</strong></article></div><section class="collection-tracking-panel"><div class="card-heading"><h3>Collection Tracking</h3><span>Protected from Liens imports</span></div><div class="workspace-status">'+escapeHtml(collectionsWorkspaceStatus)+'</div>'+tracking+'</section><section class="collection-contact-panel"><div class="card-heading"><h3>Assigned Directory Records</h3><span>Current selections</span></div>'+renderCollectionRelatedContacts(selected)+'</section><section class="liens-workflow"><div class="card-heading"><h3>Citadel Workflow</h3><span>Protected from source imports</span></div><div class="workflow-entry-actions"><button type="button" data-workspace-entry="note">Add Note</button><button type="button" data-workspace-entry="alert">Set Alert</button></div><div class="liens-workspace-feed"><h4>Recent Notes</h4>'+renderLienWorkspaceList(getCollectionWorkspaceItems('notes',selected.id),'No notes yet.',[{key:'note_text',strong:true},{key:'note_by',fallback:'Team'},{key:'note_date'}])+'<h4>Open Alerts</h4>'+renderLienWorkspaceList(getCollectionWorkspaceItems('alerts',selected.id),'No alerts yet.',[{key:'alert_text',strong:true},{key:'owner',fallback:'Carlynn'},{key:'due_date'}])+'</div></section></aside>'
}
function renderBusinessContactsWorkspace(){
  var rows=getVisibleBusinessContacts();
  var selected=collectionsData.contacts[collectionsData.selectedContactIndex]||rows[0]||collectionsData.contacts[0];
  var table='<div class="business-contacts-table" role="table"><div class="business-contacts-head" role="row"><span>Type</span><span>Organization / Firm</span><span>Contact</span><span>Office Phone</span><span>Email</span><span>Location</span></div>'+(rows.length?rows.map(function(contact){var index=collectionsData.contacts.indexOf(contact);return '<div class="business-contact-row'+(index===collectionsData.selectedContactIndex?' active':'')+'" data-contact-index="'+index+'" role="row" tabindex="0"><span>'+escapeHtml(contact.contactType)+'</span><span>'+escapeHtml(contact.organizationName||'-')+'</span><span><strong>'+escapeHtml(contact.contactName||'-')+'</strong><em>'+escapeHtml(contact.jobTitle)+'</em></span><span>'+escapeHtml(contact.officePhone||contact.mobilePhone||'-')+'</span><span>'+escapeHtml(contact.primaryEmail||'-')+'</span><span>'+escapeHtml([contact.businessCity,contact.businessState].filter(Boolean).join(', ')||'-')+'</span></div>'}).join(''):'<p class="collections-empty-table">No directory contacts match this view.</p>')+'</div>';
  var attorneyDetails=selected&&selected.contactType==='Attorney'?'<article><span>Office Name</span><strong>'+escapeHtml(selected.officeName||'-')+'</strong></article><article><span>Bar Number</span><strong>'+escapeHtml(selected.barNumber||'-')+'</strong></article><article><span>Licensed States</span><strong>'+escapeHtml(selected.licensedStates||'-')+'</strong></article><article><span>Practice Areas</span><strong>'+escapeHtml(selected.practiceAreas||'-')+'</strong></article>':'';
  var detail=selected?'<aside class="liens-detail collections-detail"><div class="liens-detail-head"><div><span>'+escapeHtml(selected.contactType)+'</span><h3>'+escapeHtml(selected.organizationName||selected.contactName)+'</h3><p>'+escapeHtml([selected.contactName,selected.jobTitle,selected.department].filter(Boolean).join(' - '))+'</p></div><button type="button" data-edit-contact>Edit</button></div><div class="liens-detail-grid">'+attorneyDetails+'<article><span>Office Phone</span><strong>'+escapeHtml(selected.officePhone||'-')+(selected.phoneExtension?' ext. '+escapeHtml(selected.phoneExtension):'')+'</strong></article><article><span>Mobile Phone</span><strong>'+escapeHtml(selected.mobilePhone||'-')+'</strong></article><article><span>Primary Email</span><strong>'+escapeHtml(selected.primaryEmail||'-')+'</strong></article><article><span>Secondary Email</span><strong>'+escapeHtml(selected.secondaryEmail||'-')+'</strong></article><article><span>Fax</span><strong>'+escapeHtml(selected.fax||'-')+'</strong></article><article><span>Website</span><strong>'+escapeHtml(selected.website||'-')+'</strong></article><article><span>Preferred Contact</span><strong>'+escapeHtml(selected.preferredContactMethod||'-')+'</strong></article></div><section class="collection-contact-panel"><div class="card-heading"><h3>Address Details</h3><span>Business and mailing</span></div><div class="collection-address-grid"><article><span>Business Address</span><strong>'+escapeHtml(formatBusinessAddress(selected,false)||'-')+'</strong></article><article><span>Mailing Address</span><strong>'+escapeHtml(formatBusinessAddress(selected,true)||'-')+'</strong></article></div>'+(selected.notes?'<div class="collection-contact-notes"><span>Notes</span><p>'+escapeHtml(selected.notes)+'</p></div>':'')+'</section></aside>':'<aside class="liens-detail collections-detail"><div class="collections-empty-detail"><h3>No directory contacts yet</h3><p>Add attorneys, collection agencies, company, office, and customer contacts once, then reuse them on any collection job.</p><button type="button" data-add-contact>Add New Contact</button></div></aside>';
  return '<div class="liens-workspace"><section class="liens-records"><div class="liens-section-head"><div><h3>Business Contacts & Attorneys</h3><p>Attorneys use their own protected sheet tab while remaining searchable here.</p></div><strong>'+escapeHtml(rows.length)+' showing</strong></div>'+table+'</section>'+detail+'</div>'
}
function renderCollectionsPage(){
  if(collectionsLoading&&!collectionsData.records.length&&!collectionsData.contacts.length){pagePanel.className='page-panel liens-page collections-page';pagePanel.innerHTML='<section class="liens-loading-card"><div class="loading-pulse"></div><h3>Loading Collections</h3><p>Connecting to protected collection jobs, contacts, and attorneys.</p></section>';return}
  var metrics=getCollectionMetricStats();
  pagePanel.className='page-panel liens-page collections-page';
  var statusText=collectionsLoading?'Refreshing...':collectionsLoadError?collectionsLoadError:collectionsLastUpdated?'Updated '+collectionsLastUpdated:'Collections ready';
  pagePanel.innerHTML=renderModuleStatusLine(statusText)+'<div class="liens-metrics collections-metrics">'+metrics.map(function(metric){return '<button type="button" class="lien-metric-button '+(activeCollectionMetric===metric.key?'active':'')+'" data-collection-metric="'+escapeHtml(metric.key)+'"><span>'+escapeHtml(metric.label)+'</span><strong>'+escapeHtml(metric.value)+'</strong><em>'+escapeHtml(metric.note)+'</em></button>'}).join('')+'</div><div class="collections-view-tabs"><button type="button" class="'+(collectionView==='accounts'?'active':'')+'" data-collection-view="accounts">Collection Jobs</button><button type="button" class="'+(collectionView==='contacts'?'active':'')+'" data-collection-view="contacts">Business Contacts & Attorneys</button></div><section class="liens-filter-card collections-filter-card"><div><h3>Filters + Sort + Search</h3><p>'+(collectionView==='contacts'?'Find and reuse protected contacts and attorneys across collection jobs.':'Liens records enter this view automatically when their status is Collection Agency.')+'</p></div><div class="collections-filter-actions"><button type="button" data-collection-reports>Reports</button><button type="button" data-add-contact>Add New Contact</button></div>'+renderCollectionFilters()+'</section>'+(collectionView==='contacts'?renderBusinessContactsWorkspace():renderCollectionAccountsWorkspace())
}
function businessContactPayload(contact){
  return contact?{
    contact_id:contact.sourceType==='contact'?contact.id:'',
    attorney_id:contact.sourceType==='attorney'?contact.id:'',
    contact_type:contact.contactType,
    organization_name:contact.organizationName,
    firm_name:contact.firmName||contact.organizationName,
    office_name:contact.officeName||'',
    contact_name:contact.contactName,
    attorney_name:contact.contactName,
    job_title:contact.jobTitle,
    department:contact.department,
    bar_number:contact.barNumber||'',
    licensed_states:contact.licensedStates||'',
    practice_areas:contact.practiceAreas||'',
    primary_email:contact.primaryEmail,
    secondary_email:contact.secondaryEmail,
    office_phone:contact.officePhone,
    phone_extension:contact.phoneExtension,
    mobile_phone:contact.mobilePhone,
    fax:contact.fax,
    website:contact.website,
    preferred_contact_method:contact.preferredContactMethod,
    business_address_1:contact.businessAddress1,
    business_address_2:contact.businessAddress2,
    business_city:contact.businessCity,
    business_state:contact.businessState,
    business_zip:contact.businessZip,
    business_country:contact.businessCountry,
    mailing_same_as_business:contact.mailingSameAsBusiness,
    mailing_address_1:contact.mailingAddress1,
    mailing_address_2:contact.mailingAddress2,
    mailing_city:contact.mailingCity,
    mailing_state:contact.mailingState,
    mailing_zip:contact.mailingZip,
    mailing_country:contact.mailingCountry,
    notes:contact.notes
  }:{}
}
function openBusinessContactModal(contact){
  closeLiensReportsModal();
  var data=businessContactPayload(contact);
  var type=data.contact_type||'Select type';
  var lockedType=contact?'<select data-contact-type-select disabled>'+renderSelectOptions('Select type',['Company','Attorney','Office','Customer','Collection Agency','Other'],type)+'</select><input type="hidden" name="contact_type" value="'+escapeHtml(type)+'">':'<select name="contact_type" data-contact-type-select required>'+renderSelectOptions('Select type',['Company','Attorney','Office','Customer','Collection Agency','Other'],type)+'</select>';
  var modal=document.createElement('div');modal.className='citadel-modal-backdrop';
  modal.innerHTML='<section class="workspace-entry-modal business-contact-modal" role="dialog" aria-modal="true" aria-label="Business Contact"><div class="modal-head"><div><h3>'+(contact?'Edit Directory Contact':'Add New Directory Contact')+'</h3><p>Attorneys are stored on their own protected tab; all other contacts use the business-contact tab.</p></div><button type="button" data-close-modal aria-label="Close">x</button></div><form data-business-contact-form><div class="business-contact-form-grid"><label>Contact Type *'+lockedType+'</label><label>Organization / Firm Name<input name="organization_name" value="'+escapeHtml(data.organization_name||'')+'"></label><label>Contact Name<input name="contact_name" value="'+escapeHtml(data.contact_name||'')+'"></label><label>Job Title<input name="job_title" value="'+escapeHtml(data.job_title||'')+'"></label><label data-attorney-fields hidden>Office Name<input name="office_name" value="'+escapeHtml(data.office_name||'')+'"></label><label data-attorney-fields hidden>Bar Number<input name="bar_number" value="'+escapeHtml(data.bar_number||'')+'"></label><label data-attorney-fields hidden>Licensed States<input name="licensed_states" placeholder="OH, PA, IL" value="'+escapeHtml(data.licensed_states||'')+'"></label><label data-attorney-fields hidden>Practice Areas<input name="practice_areas" placeholder="Collections, construction, litigation" value="'+escapeHtml(data.practice_areas||'')+'"></label><label>Department<input name="department" value="'+escapeHtml(data.department||'')+'"></label><label>Preferred Contact Method<select name="preferred_contact_method">'+renderSelectOptions('Not specified',['Email','Office Phone','Mobile Phone','Mail'],data.preferred_contact_method||'Not specified')+'</select></label><label>Primary Email<input name="primary_email" type="email" value="'+escapeHtml(data.primary_email||'')+'"></label><label>Secondary Email<input name="secondary_email" type="email" value="'+escapeHtml(data.secondary_email||'')+'"></label><label>Office Phone<input name="office_phone" type="tel" value="'+escapeHtml(data.office_phone||'')+'"></label><label>Extension<input name="phone_extension" value="'+escapeHtml(data.phone_extension||'')+'"></label><label>Mobile Phone<input name="mobile_phone" type="tel" value="'+escapeHtml(data.mobile_phone||'')+'"></label><label>Fax<input name="fax" type="tel" value="'+escapeHtml(data.fax||'')+'"></label><label class="contact-website-field">Website<input name="website" type="url" placeholder="https://" value="'+escapeHtml(data.website||'')+'"></label><fieldset><legend>Business Address</legend><label>Address 1<input name="business_address_1" value="'+escapeHtml(data.business_address_1||'')+'"></label><label>Address 2<input name="business_address_2" value="'+escapeHtml(data.business_address_2||'')+'"></label><div><label>City<input name="business_city" value="'+escapeHtml(data.business_city||'')+'"></label><label>State<input name="business_state" maxlength="2" value="'+escapeHtml(data.business_state||'')+'"></label><label>ZIP<input name="business_zip" value="'+escapeHtml(data.business_zip||'')+'"></label></div><label>Country<input name="business_country" value="'+escapeHtml(data.business_country||'')+'"></label></fieldset><fieldset><legend>Mailing Address</legend><label class="mailing-same"><input type="checkbox" name="mailing_same_as_business" '+(data.mailing_same_as_business?'checked':'')+'> Same as business address</label><div data-mailing-fields><label>Address 1<input name="mailing_address_1" value="'+escapeHtml(data.mailing_address_1||'')+'"></label><label>Address 2<input name="mailing_address_2" value="'+escapeHtml(data.mailing_address_2||'')+'"></label><div><label>City<input name="mailing_city" value="'+escapeHtml(data.mailing_city||'')+'"></label><label>State<input name="mailing_state" maxlength="2" value="'+escapeHtml(data.mailing_state||'')+'"></label><label>ZIP<input name="mailing_zip" value="'+escapeHtml(data.mailing_zip||'')+'"></label></div><label>Country<input name="mailing_country" value="'+escapeHtml(data.mailing_country||'')+'"></label></div></fieldset><label class="contact-notes-field">Notes<textarea name="notes" rows="3">'+escapeHtml(data.notes||'')+'</textarea></label></div><div class="workspace-entry-actions"><button type="button" data-close-modal>Cancel</button><button type="submit" class="primary">Save Contact</button></div></form></section>';
  function selectedType(){var select=modal.querySelector('[data-contact-type-select]');return select?select.value:'Select type'}
  function syncAttorneyFields(){var attorney=selectedType()==='Attorney';modal.querySelectorAll('[data-attorney-fields]').forEach(function(field){field.hidden=!attorney})}
  function syncMailing(){var checked=modal.querySelector('[name="mailing_same_as_business"]').checked;modal.querySelectorAll('[data-mailing-fields] input').forEach(function(input){input.disabled=checked})}
  modal.addEventListener('click',function(event){if(event.target===modal||event.target.closest('[data-close-modal]'))closeLiensReportsModal()});
  modal.addEventListener('change',function(event){if(event.target.name==='mailing_same_as_business')syncMailing();if(event.target.matches('[data-contact-type-select]'))syncAttorneyFields()});
  modal.querySelector('[data-business-contact-form]').addEventListener('submit',function(event){
    event.preventDefault();
    var form=event.currentTarget;
    var contactType=form.elements.contact_type.value;
    if(contactType==='Select type'){form.elements.contact_type.focus();return}
    if(!form.elements.organization_name.value.trim()&&!form.elements.contact_name.value.trim()){form.elements.organization_name.setCustomValidity('Enter an organization or contact name.');form.elements.organization_name.reportValidity();form.elements.organization_name.addEventListener('input',function(){this.setCustomValidity('')},{once:true});return}
    if(contactType==='Attorney'&&!form.elements.contact_name.value.trim()){form.elements.contact_name.setCustomValidity('Enter the attorney name.');form.elements.contact_name.reportValidity();form.elements.contact_name.addEventListener('input',function(){this.setCustomValidity('')},{once:true});return}
    var payload={};new FormData(form).forEach(function(value,key){payload[key]=value});
    payload.mailing_same_as_business=form.elements.mailing_same_as_business.checked;
    var action='saveBusinessContact';
    if(contactType==='Attorney'&&(!contact||contact.sourceType==='attorney')){action='saveCollectionAttorney';payload.attorney_id=contact?contact.id:'';payload.firm_name=payload.organization_name;payload.attorney_name=payload.contact_name}
    else if(contact)payload.contact_id=contact.id;
    saveCollectionApiAction(action,payload,contactType==='Attorney'?'Attorney saved':'Contact saved');
    closeLiensReportsModal()
  });
  document.body.appendChild(modal);syncAttorneyFields();syncMailing();modal.querySelector('[data-contact-type-select]').focus()
}
function renderCollectionContactChoices(record){
  if(!collectionsData.contacts.length)return '<p class="collections-contact-empty">No contacts or attorneys have been saved yet. Add them to the directory, then select them on this job.</p>';
  var selected={};if(record)getCollectionLinks(record.id).forEach(function(link){selected[String(link.contact_id)+'|'+String(link.relationship||'Other')]=true});
  var grouped={};collectionsData.contacts.forEach(function(contact){(grouped[contact.contactType]||(grouped[contact.contactType]=[])).push(contact)});
  return '<label class="collection-contact-search">Find a saved contact or attorney<input type="search" data-related-contact-search placeholder="Attorney, firm, agency, company, office, customer..."></label><div class="collection-contact-chooser">'+Object.keys(grouped).sort().map(function(role){return '<fieldset data-contact-choice-group><legend>'+escapeHtml(role)+'</legend>'+grouped[role].map(function(contact){var key=String(contact.id)+'|'+role;var search=[role,contact.organizationName,contact.officeName,contact.contactName,contact.officePhone,contact.primaryEmail,contact.licensedStates].join(' ').toLowerCase();return '<label data-contact-choice-row data-contact-search-text="'+escapeHtml(search)+'"><input type="checkbox" data-related-contact="'+escapeHtml(contact.id)+'" data-contact-relationship="'+escapeHtml(role)+'" '+(selected[key]?'checked':'')+'><span><strong>'+escapeHtml(contact.organizationName||contact.contactName)+'</strong><em>'+escapeHtml([contact.contactName,contact.officePhone,contact.primaryEmail].filter(Boolean).join(' | '))+'</em></span></label>'}).join('')+'</fieldset>'}).join('')+'</div>'
}
function saveCollectionApiAction(action,payload,successMessage){
  collectionsWorkspaceStatus='Saving...';if(activePage==='collections')renderCollectionsPage();
  var params=Object.keys(payload).map(function(key){return encodeURIComponent(key)+'='+encodeURIComponent(payload[key]==null?'':payload[key])}).join('&');
  return jsonp(CITADEL_API_URL+'?action='+encodeURIComponent(action)+'&'+params).then(function(response){if(!response||!response.ok)throw new Error(response&&response.error?response.error:'Save failed');collectionsWorkspaceStatus=successMessage||'Saved';return loadCollectionsData()}).catch(function(error){collectionsWorkspaceStatus='Save failed: '+(error.message||error);console.warn('Collections save failed',error);if(activePage==='collections')renderCollectionsPage()})
}
function saveCollectionWorkspace(action,payload){return saveCollectionApiAction(action,payload,action==='saveCollectionNote'?'Note saved':'Alert saved')}
function bindCollectionsPage(){
  if(collectionsPageEventsBound)return;collectionsPageEventsBound=true;
  pagePanel.addEventListener('click',function(event){
    if(activePage!=='collections')return;
    var metric=event.target.closest('[data-collection-metric]');if(metric){activeCollectionMetric=metric.getAttribute('data-collection-metric');if(activeCollectionMetric==='attorneys'){collectionView='contacts';contactFilters.type='Attorney'}else collectionView='accounts';collectionsData.selectedIndex=0;collectionsData.selectedContactIndex=0;renderCollectionsPage();return}
    var view=event.target.closest('[data-collection-view]');if(view){collectionView=view.getAttribute('data-collection-view');activeCollectionMetric=collectionView==='contacts'?'attorneys':'accounts';if(collectionView==='contacts'&&contactFilters.type==='Attorney')contactFilters.type='All contact types';renderCollectionsPage();return}
    if(event.target.closest('[data-add-contact]')){openBusinessContactModal();return}
    if(event.target.closest('[data-edit-contact]')){openBusinessContactModal(collectionsData.contacts[collectionsData.selectedContactIndex]);return}
    if(event.target.closest('[data-collection-reports]')){openCollectionsReportsModal();return}
    var entry=event.target.closest('[data-workspace-entry]');if(entry){openWorkspaceEntryModal('collections',entry.getAttribute('data-workspace-entry'));return}
    var collectionRow=event.target.closest('[data-collection-index]');if(collectionRow){collectionsData.selectedIndex=Number(collectionRow.getAttribute('data-collection-index'));renderCollectionsPage();return}
    var contactRow=event.target.closest('[data-contact-index]');if(contactRow){collectionsData.selectedContactIndex=Number(contactRow.getAttribute('data-contact-index'));renderCollectionsPage()}
  });
  pagePanel.addEventListener('change',function(event){if(activePage!=='collections')return;var collectionField=event.target.closest('select[data-collection-filter]');var contactField=event.target.closest('select[data-contact-filter]');if(collectionField){collectionFilters[collectionField.getAttribute('data-collection-filter')]=collectionField.value;collectionsData.selectedIndex=0;renderCollectionsPage()}if(contactField){contactFilters[contactField.getAttribute('data-contact-filter')]=contactField.value;collectionsData.selectedContactIndex=0;renderCollectionsPage()}});
  pagePanel.addEventListener('input',function(event){
    if(activePage!=='collections')return;
    var relatedSearch=event.target.closest('[data-related-contact-search]');
    if(relatedSearch){var query=relatedSearch.value.trim().toLowerCase();var form=relatedSearch.closest('[data-collection-tracking-form]');form.querySelectorAll('[data-contact-choice-row]').forEach(function(row){row.hidden=!!query&&String(row.getAttribute('data-contact-search-text')||'').indexOf(query)<0});form.querySelectorAll('[data-contact-choice-group]').forEach(function(group){group.hidden=!Array.from(group.querySelectorAll('[data-contact-choice-row]')).some(function(row){return !row.hidden})});return}
    var collectionSearch=event.target.closest('input[data-collection-filter="search"]');var contactSearch=event.target.closest('input[data-contact-filter="search"]');if(!collectionSearch&&!contactSearch)return;if(collectionSearch)collectionFilters.search=collectionSearch.value;if(contactSearch)contactFilters.search=contactSearch.value;window.clearTimeout(collectionSearchTimer);collectionSearchTimer=window.setTimeout(function(){if(collectionSearch)collectionsData.selectedIndex=0;if(contactSearch)collectionsData.selectedContactIndex=0;renderCollectionsPage();var next=pagePanel.querySelector(collectionSearch?'input[data-collection-filter="search"]':'input[data-contact-filter="search"]');if(next){next.focus();next.setSelectionRange(next.value.length,next.value.length)}},180)
  });
  pagePanel.addEventListener('submit',function(event){
    var form=event.target.closest('[data-collection-tracking-form]');
    if(activePage!=='collections'||!form)return;
    event.preventDefault();
    var payload={};new FormData(form).forEach(function(value,key){payload[key]=value});
    payload.contact_links=JSON.stringify(Array.from(form.querySelectorAll('[data-related-contact]:checked')).map(function(input){return {contact_id:input.getAttribute('data-related-contact'),relationship:input.getAttribute('data-contact-relationship'),is_primary:false}}));
    if(!payload.collection_agency){var agencyInput=form.querySelector('[data-contact-relationship="Collection Agency"]:checked');var agencyContact=agencyInput&&getBusinessContact(agencyInput.getAttribute('data-related-contact'));payload.collection_agency=agencyContact?agencyContact.organizationName:''}
    saveCollectionApiAction('saveCollectionRecord',payload,'Collection tracking saved')
  })
}
function collectionReportRows(modal){
  var contacts=modal.getAttribute('data-collection-report-view')==='contacts';
  var rows=contacts?(collectionsData.contacts||[]).slice():(collectionsData.records||[]).slice();
  function value(name){var field=modal.querySelector('[data-collection-report-filter="'+name+'"]');return field?field.value:''}
  var type=value('type'),state=value('state'),agency=value('agency'),status=value('status'),stage=value('stage'),region=value('region'),search=value('search').toLowerCase(),dateFrom=value('dateFrom'),dateTo=value('dateTo'),alertFilter=value('alertFilter');
  if(contacts)rows=rows.filter(function(row){if(type&&type!=='All contact types'&&row.contactType!==type)return false;if(state&&state!=='All states'&&row.businessState!==state)return false;if(search&&[row.contactType,row.organizationName,row.officeName,row.contactName,row.barNumber,row.licensedStates,row.primaryEmail,row.officePhone,row.businessCity,row.businessState].join(' ').toLowerCase().indexOf(search)<0)return false;return true});
  else rows=rows.filter(function(row){if(agency&&agency!=='All agencies'&&row.agency!==agency)return false;if(status&&status!=='All statuses'&&row.status!==status)return false;if(stage&&stage!=='All stages'&&row.currentStage!==stage)return false;if(region&&region!=='All regions'&&row.region!==region)return false;if(dateFrom&&String(row.sentDate)<dateFrom)return false;if(dateTo&&String(row.sentDate)>dateTo)return false;if(alertFilter==='Open alerts'&&row.alertsCount<1)return false;if(alertFilter==='No alert set'&&row.alertsCount>0)return false;if(search&&[row.jobNumber,row.customer,row.region,row.salesRep,row.currentStage,row.agency,row.status].join(' ').toLowerCase().indexOf(search)<0)return false;return true});
  return rows
}
function updateCollectionsReportSummary(modal){var rows=collectionReportRows(modal);var contacts=modal.getAttribute('data-collection-report-view')==='contacts';var count=modal.querySelector('[data-collection-report-count]');var totals=modal.querySelector('[data-collection-report-totals]');if(count)count.textContent=rows.length+' '+(contacts?'directory entries':'jobs');if(totals)totals.textContent=contacts?rows.filter(function(row){return row.contactType==='Attorney'}).length+' attorneys':moneyLabel(rows.reduce(function(sum,row){return sum+moneyNumber(row.amountOutstanding)},0))+' outstanding | '+moneyLabel(rows.reduce(function(sum,row){return sum+moneyNumber(row.amountCollected)},0))+' collected | '+moneyLabel(rows.reduce(function(sum,row){return sum+moneyNumber(row.amountWeReceive)},0))+' expected'}
function setQuickCollectionsReport(modal,type){
  var contacts=modal.getAttribute('data-collection-report-view')==='contacts';
  modal.querySelectorAll('input').forEach(function(field){field.value=''});
  modal.querySelectorAll('select').forEach(function(field){field.selectedIndex=0});
  if(type==='current'){
    if(contacts){modal.querySelector('[data-collection-report-filter="type"]').value=contactFilters.type;modal.querySelector('[data-collection-report-filter="state"]').value=contactFilters.state;modal.querySelector('[data-collection-report-filter="search"]').value=contactFilters.search}
    else{modal.querySelector('[data-collection-report-filter="agency"]').value=collectionFilters.agency;modal.querySelector('[data-collection-report-filter="stage"]').value=collectionFilters.stage;modal.querySelector('[data-collection-report-filter="region"]').value=collectionFilters.region;modal.querySelector('[data-collection-report-filter="search"]').value=collectionFilters.search}
  }
  if(contacts&&type==='attorneys')modal.querySelector('[data-collection-report-filter="type"]').value='Attorney';
  if(contacts&&type==='agencies')modal.querySelector('[data-collection-report-filter="type"]').value='Collection Agency';
  if(!contacts&&type==='needs')modal.querySelector('[data-collection-report-filter="status"]').value='Needs Assignment';
  if(!contacts&&type==='placed')modal.querySelector('[data-collection-report-filter="status"]').value='Placed';
  if(!contacts&&type==='partial')modal.querySelector('[data-collection-report-filter="status"]').value='Partially Collected';
  if(!contacts&&type==='received')modal.querySelector('[data-collection-report-filter="status"]').value='Received';
  if(!contacts&&type==='alerts')modal.querySelector('[data-collection-report-filter="alertFilter"]').value='Open alerts';
  updateCollectionsReportSummary(modal)
}
function collectionReportTable(rows,contacts){
  return contacts
    ?[['Contact Type','Firm / Organization','Office','Contact / Attorney','Job Title','Bar Number','Licensed States','Practice Areas','Primary Email','Secondary Email','Office Phone','Extension','Mobile Phone','Fax','Website','Preferred Contact','Business Address','Mailing Address','Notes']].concat(rows.map(function(row){return [row.contactType,row.organizationName,row.officeName||'',row.contactName,row.jobTitle,row.barNumber||'',row.licensedStates||'',row.practiceAreas||'',row.primaryEmail,row.secondaryEmail,row.officePhone,row.phoneExtension,row.mobilePhone,row.fax,row.website,row.preferredContactMethod,formatBusinessAddress(row,false),formatBusinessAddress(row,true),row.notes]}))
    :[['Region','Sales Rep','Job Number','Job Link','Customer','Source Status','Current Stage','Aging Days','Source Balance','Payments Received','First Invoice','Latest Invoice','Invoice Count','Collection Agency','Date Sent to Agency','Amount Outstanding','Amount Collected','Amount We Will Receive','Date Received','Tracking Status','Updated By','Last Updated']].concat(rows.map(function(row){return [row.region,row.salesRep,row.jobNumber,row.jobLink,row.customer,row.sourceStatus,row.currentStage,row.agingDays,moneyNumber(row.sourceBalance),moneyNumber(row.paymentsReceived),row.firstInvoice,row.latestInvoice,row.invoiceCount,row.agency,row.sentDate,moneyNumber(row.amountOutstanding),moneyNumber(row.amountCollected),moneyNumber(row.amountWeReceive),row.dateReceived,row.status,row.updatedBy,row.lastUpdated]}))
}
function openCollectionsReportsModal(){
  closeLiensReportsModal();
  var contacts=collectionView==='contacts';
  var modal=document.createElement('div');modal.className='citadel-modal-backdrop';modal.setAttribute('data-collection-report-view',contacts?'contacts':'accounts');
  var quick=contacts?'<button data-collection-quick="all">All Contacts</button><button data-collection-quick="attorneys">Attorneys</button><button data-collection-quick="agencies">Collection Agencies</button><button data-collection-quick="current">Current View</button>':'<button data-collection-quick="alerts">Open Alerts</button><button data-collection-quick="needs">Needs Assignment</button><button data-collection-quick="placed">Placed</button><button data-collection-quick="partial">Partially Collected</button><button data-collection-quick="received">Received</button><button data-collection-quick="current">Current View</button>';
  var filters=contacts?'<label>Contact Type<select data-collection-report-filter="type">'+renderSelectOptions('All contact types',getCollectionContactTypes(),'All contact types')+'</select></label><label>State<select data-collection-report-filter="state">'+renderSelectOptions('All states',getCollectionContactStates(),'All states')+'</select></label><label>Search Text<input data-collection-report-filter="search" placeholder="Attorney, firm, contact, phone, email"></label>':'<label>Agency<select data-collection-report-filter="agency">'+renderSelectOptions('All agencies',getCollectionAgencies(),'All agencies')+'</select></label><label>Tracking Status<select data-collection-report-filter="status">'+renderSelectOptions('All statuses',['Needs Assignment','Placed','Partially Collected','Received'],'All statuses')+'</select></label><label>Current Stage<select data-collection-report-filter="stage">'+renderSelectOptions('All stages',getCollectionStages(),'All stages')+'</select></label><label>Region<select data-collection-report-filter="region">'+renderSelectOptions('All regions',getCollectionRegions(),'All regions')+'</select></label><label>Date Sent From<input data-collection-report-filter="dateFrom" type="date"></label><label>Date Sent To<input data-collection-report-filter="dateTo" type="date"></label><label>Alert Filter<select data-collection-report-filter="alertFilter"><option>All alerts</option><option>Open alerts</option><option>No alert set</option></select></label><label>Search Text<input data-collection-report-filter="search" placeholder="Job, customer, sales rep, agency"></label>';
  modal.innerHTML='<section class="citadel-report-modal" role="dialog" aria-modal="true" aria-label="Collections Reports"><div class="modal-head"><div><h3>Collections Reports</h3><p>'+(contacts?'Export business contacts and the protected attorney directory.':'Report on jobs sent to collections and recovery progress.')+'</p></div><button type="button" data-close-modal aria-label="Close">x</button></div><div class="report-callout">'+(contacts?'Attorney exports include bar, licensed-state, practice-area, firm, address, and communication fields.':'Job exports include source job data, agency placement, recovery, and receipt fields.')+'</div><section class="report-band"><div class="report-band-head"><strong>Quick Reports</strong><span>Common exports</span></div><div class="quick-report-grid">'+quick+'</div></section><section class="report-custom"><div class="report-band-head"><strong>Custom Report</strong><span>Filters and export format</span></div><div class="report-form-grid">'+filters+'</div></section><div class="report-summary-row"><div class="report-parameters"><strong>Report Parameters</strong><span>View: <b>'+(contacts?'Business Contacts & Attorneys':'Collection Jobs')+'</b></span><span>Generated: <b>'+escapeHtml(new Date().toLocaleString())+'</b></span></div><div class="report-total"><strong data-collection-report-count>0</strong><span>Matching records</span><em data-collection-report-totals></em></div></div><div class="modal-actions"><button type="button" data-collection-report-reset>Reset</button><span></span><select data-collection-report-format><option value="csv">CSV</option><option value="excel">Excel</option><option value="pdf">PDF</option></select><button type="button" data-close-modal>Cancel</button><button type="button" data-collection-report-export>Export</button></div></section>';
  modal.addEventListener('click',function(event){var quickButton=event.target.closest('[data-collection-quick]');if(quickButton){setQuickCollectionsReport(modal,quickButton.getAttribute('data-collection-quick'));return}if(event.target.closest('[data-collection-report-reset]')){setQuickCollectionsReport(modal,'all');return}if(event.target.closest('[data-collection-report-export]')){var rows=collectionReportRows(modal);var format=modal.querySelector('[data-collection-report-format]').value;reportDownloadTable(collectionReportTable(rows,contacts),format,contacts?'citadel-collection-directory':'citadel-collection-jobs');return}if(event.target===modal||event.target.closest('[data-close-modal]'))closeLiensReportsModal()});
  modal.addEventListener('input',function(){updateCollectionsReportSummary(modal)});
  modal.addEventListener('change',function(){updateCollectionsReportSummary(modal)});
  document.body.appendChild(modal);updateCollectionsReportSummary(modal)
}

function regionHealthClass(score){
  if(score==null)return 'unavailable';
  return score<62?'critical':score<74?'watch':score<84?'monitor':'healthy';
}
function renderRegionHealthPage(){
  var rows=getRegionHealthRows();
  var connections=getRegionHealthConnections();
  var connectedSources=Object.keys(connections).filter(function(key){return connections[key];}).length;
  var scoredRows=rows.filter(function(row){return row.score!=null;});
  var critical=scoredRows.filter(function(row){return row.score<62;}).length;
  var watch=scoredRows.filter(function(row){return row.score>=62&&row.score<74;}).length;
  var healthy=scoredRows.filter(function(row){return row.score>=84;}).length;
  var avg=scoredRows.length?Math.round(scoredRows.reduce(function(sum,row){return sum+row.score;},0)/scoredRows.length):null;
  var topFocus=scoredRows[0]||rows[0]||{};
  var openAlerts=allOpenWorkflowRows().length;
  pagePanel.className='page-panel region-health-page';
  pagePanel.innerHTML=renderModuleStatusLine(connectedSources+' / 4 mapped sources live - Reviews excluded until a region field is connected')+
    '<section class="region-hero"><div><p class="section-label">Executive scorecard</p><h2>Region Health</h2><p>Live region-tagged signals from Liens, Contractors, Registrations, and Fleet. Sources without a reliable region value are excluded rather than estimated.</p></div><div class="region-score-dial '+regionHealthClass(avg)+'"><strong>'+escapeHtml(avg==null?'--':avg)+'</strong><span>Overall</span></div></section>'+
    '<div class="region-health-metrics"><article><span>Open Alerts</span><strong>'+escapeHtml(openAlerts)+'</strong><em>live alerts + follow-ups</em></article><article><span>Regions</span><strong>'+escapeHtml(scoredRows.length)+'</strong><em>with live signals</em></article><article><span>Healthy</span><strong>'+escapeHtml(healthy)+'</strong><em>operating well</em></article><article><span>Watchlist</span><strong>'+escapeHtml(watch)+'</strong><em>needs follow-up</em></article><article><span>Critical</span><strong>'+escapeHtml(critical)+'</strong><em>leadership focus</em></article></div>'+
    '<div class="region-health-layout"><section class="region-list-panel"><div class="region-panel-head"><div><h3>Region Scores</h3><p>Lowest live score appears first. Empty markets remain clearly marked as unavailable.</p></div><button type="button" data-standard-report>Reports</button></div><div class="region-score-list">'+rows.map(function(row){
      var scoreLabel=row.score==null?'--':row.score;
      var scoreWidth=row.score==null?0:row.score;
      return '<article class="region-score-row '+regionHealthClass(row.score)+'"><div class="region-score-main"><strong>'+escapeHtml(row.region)+'</strong><span>'+escapeHtml(row.status)+' - '+escapeHtml(row.action)+'</span><div class="region-score-bar"><i style="width:'+escapeHtml(scoreWidth)+'%"></i></div></div><div class="region-score-number">'+escapeHtml(scoreLabel)+'</div><div class="region-signal-grid"><span>Liens <b>'+escapeHtml(connections.liens?row.liens:'--')+'</b></span><span>Contractors <b>'+escapeHtml(connections.contractors?row.contractors:'--')+'</b></span><span>Registrations <b>'+escapeHtml(connections.registrations?row.registrations:'--')+'</b></span><span>Fleet <b>'+escapeHtml(connections.fleet?row.fleet:'--')+'</b></span></div></article>';
    }).join('')+'</div></section><aside class="region-focus-panel"><div class="card-heading"><h3>Leadership Focus</h3><span>Live</span></div><h4>'+escapeHtml(topFocus.region||'No region selected')+'</h4><p>'+escapeHtml(topFocus.action||'No live region signals are available.')+'</p><ul class="queue-list"><li><span>Health score</span><strong>'+escapeHtml(topFocus.score==null?'--':topFocus.score)+'</strong></li><li><span>Status</span><strong>'+escapeHtml(topFocus.status||'Unavailable')+'</strong></li><li><span>Open alerts</span><strong>'+escapeHtml(topFocus.alerts||0)+'</strong></li><li><span>Lien exposure</span><strong>'+escapeHtml(moneyLabel(topFocus.lienExposure||0))+'</strong></li><li><span>Registrations</span><strong>'+escapeHtml(topFocus.registrations||0)+'</strong></li><li><span>Fleet records</span><strong>'+escapeHtml(topFocus.fleet||0)+'</strong></li></ul></aside></div>';
}

function renderStandardFilterCard(pageId){var filters=STANDARD_FILTERS[pageId]||STANDARD_FILTERS.tasks;return '<section class="standard-filter-card"><div><h3>Filters + Sort + Search</h3><p>Refine and find records the same way on every page</p></div><button type="button" data-standard-report>Reports</button><div class="standard-filters">'+filters.map(function(item){return '<label>'+escapeHtml(item[0])+'<select>'+renderSelectOptions(item[1],item[2],item[1])+'</select></label>'}).join('')+'<label>Search<input type="search" placeholder="Search this view"></label></div></section>'}

function bindStandardPage(){if(standardPageEventsBound)return;standardPageEventsBound=true;pagePanel.addEventListener("click",function(event){if(activePage==="command-center"||activePage==="liens"||activePage==="contractors")return;var metric=event.target.closest("[data-standard-metric]");if(metric){activeStandardMetric=metric.getAttribute("data-standard-metric")||"";renderStandardContent();return}if(event.target.closest("[data-standard-report]")){openStandardReportsModal();return}})}
function renderStandardContent(){var details=pageDetails[activePage]||pageDetails.tasks;var label=getPageLabel(activePage);pagePanel.className="page-panel standard-page";pagePanel.innerHTML=renderModuleStatusLine('Stable')+'<div id="subTabs" class="sub-tabs" hidden></div><div class="metric-grid">'+([["Open Alerts","0","Alerts + follow-ups"]].concat(details.metrics)).map(function(item){return '<button type="button" class="metric-card standard-metric-button '+(activeStandardMetric===item[0]?'active':'')+'" data-standard-metric="'+escapeHtml(item[0])+'"><div class="metric-label">'+escapeHtml(item[0])+'</div><div class="metric-value">'+escapeHtml(item[1])+'</div><div class="metric-note">'+escapeHtml(item[2])+'</div></button>'}).join('')+'</div>'+renderStandardFilterCard(activePage)+'<div class="content-grid"><article class="work-card"><div class="card-heading"><h3>'+escapeHtml(label)+' Focus</h3><span>'+(activePage.indexOf("fleet")===0?"Fleet":"Today")+'</span></div><p id="focusCopy">'+escapeHtml(details.focus)+'</p></article><article class="work-card compact"><div class="card-heading"><h3>Queue Snapshot</h3><span>Priority</span></div><ul class="queue-list">'+details.queue.map(function(item){return '<li><span>'+escapeHtml(item[0])+'</span><strong>'+escapeHtml(item[1])+'</strong></li>'}).join('')+'</ul></article></div>';subTabs=document.querySelector("#subTabs");renderSubTabs()}

function loadLiensData(){if(!CITADEL_API_URL){liensLoading=false;return}if(!liensData.records.length)hydrateLiensFromCache();liensLoading=true;liensLoadError="";if(activePage==="liens"&&!liensData.records.length)renderContent();jsonp(CITADEL_API_URL+"?action=getLiens").then(function(response){if(!response||!response.ok||!response.data)throw new Error(response&&response.error?response.error:"No liens data returned");applyLiensPayload(response.data);saveLiensCache(response.data);liensLoading=false;if(activePage==="liens"||activePage==="command-center"||activePage==="region-health")renderContent()}).catch(function(error){liensLoading=false;liensLoadError="Unable to refresh lien records";console.warn("Liens sheet load failed",error);if(activePage==="liens"||activePage==="command-center"||activePage==="region-health")renderContent()})}
function jsonp(url){return new Promise(function(resolve,reject){var callback="citadelCallback"+Date.now()+Math.floor(Math.random()*10000);var script=document.createElement("script");var timeout=window.setTimeout(function(){cleanup();reject(new Error("Sheet request timed out"))},45000);function cleanup(){window.clearTimeout(timeout);delete window[callback];if(script.parentNode)script.parentNode.removeChild(script)}window[callback]=function(payload){cleanup();resolve(payload)};script.onerror=function(){cleanup();reject(new Error("Sheet request failed"))};script.src=url+"&callback="+callback;document.head.appendChild(script)})}
function loadContractorsData(){if(!CITADEL_API_URL){contractorsLoading=false;return}if(!contractorsData.records.length)hydrateContractorsFromCache();contractorsLoading=true;contractorsLoadError="";if(activePage==="contractors"&&!contractorsData.records.length)renderContent();jsonp(CITADEL_API_URL+"?action=getContractors").then(function(response){if(!response||!response.ok||!response.data)throw new Error(response&&response.error?response.error:"No contractor data returned");applyContractorsPayload(response.data);saveContractorsCache(response.data);contractorsLoading=false;if(activePage==="contractors"||activePage==="command-center"||activePage==="region-health")renderContent()}).catch(function(error){contractorsLoading=false;contractorsLoadError="Contractors sheet not connected yet";console.warn("Contractors sheet load failed",error);if(activePage==="contractors"||activePage==="command-center"||activePage==="region-health")renderContent()})}

function loadRegistrationsSummary(){
  if(!CITADEL_API_URL){
    registrationsSummaryLoading=false;
    registrationsSummaryError='Registrations sheet not connected yet';
    return;
  }
  registrationsSummaryLoading=true;
  registrationsSummaryError='';
  jsonp(CITADEL_API_URL+'?action=getRegistrations').then(function(response){
    if(!response||!response.ok||!response.data)throw new Error(response&&response.error?response.error:'No registrations data returned');
    var data=response.data;
    registrationsSummary={
      openRequests:Array.isArray(data.openRequests)?data.openRequests:[],
      activeRegistrations:Array.isArray(data.activeRegistrations)?data.activeRegistrations:[],
      archivedRequests:Array.isArray(data.archivedRequests)?data.archivedRequests:[],
      alerts:Array.isArray(data.alerts)?data.alerts:[],
      followUps:Array.isArray(data.followUps)?data.followUps:[],
      metrics:data.metrics||{}
    };
    registrationsSummaryLoading=false;
    registrationsSummaryUpdated=new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
    if(activePage==='command-center'||activePage==='region-health')renderContent();
  }).catch(function(error){
    registrationsSummaryLoading=false;
    registrationsSummaryError=error.message||'Registrations sheet not connected yet';
    console.warn('Registrations summary load failed',error);
    if(activePage==='command-center'||activePage==='region-health')renderContent();
  });
}

function renderRegistrationsModule(){pagePanel.className="page-panel registrations-module-page";pagePanel.innerHTML='<iframe class="registrations-module-frame" title="Registrations workspace" src="./modules/registrations/index.html?v=2.1.2.10"></iframe>'}

function renderContent(){var label=getPageLabel(activePage);pageTitle.textContent=label;if(activePage==="command-center"){renderCommandCenter();bindCommandCenter();return}if(activePage==="region-health"){renderRegionHealthPage();bindStandardPage();return}if(activePage==="liens"){renderLiensPage();bindLiensPage();return}if(activePage==="collections"){renderCollectionsPage();bindCollectionsPage();return}if(activePage==="contractors"){renderContractorsPage();bindContractorsPage();return}if(activePage==="registrations"){renderRegistrationsModule();return}if(activePage==="reviews"){renderReviewsPage();bindReviewsPage();if(!reviewsData.records.length&&!reviewsLoading&&!reviewsLoadError)loadReviewsData();return}if(activePage==="pricing"){renderPricingPage();bindPricingPage();if(!pricingState.rows.length&&!pricingState.loading&&!pricingState.error)loadPricingData();return}if(activePage==="fleet"||activePage==="fleet-vehicles"||activePage==="fleet-drivers"){renderFleetPage();bindFleetPage();if(!fleetData.sourceRows.length&&!fleetData.vehicles.length&&!fleetData.drivers.length&&!fleetLoading&&!fleetLoadError)loadFleetData();return}renderStandardContent();bindStandardPage()}
function setActivePage(pageId){activePage=pageId;renderNavigation();renderContent()}

initSettingsMenu();initForceRefreshButton();checkForCitadelUpdate();hydrateLiensFromCache();hydrateCollectionsFromCache();hydrateContractorsFromCache();hydrateReviewsFromCache();hydrateFleetFromCache();loadPricingStaticData();setActivePage(activePage);loadLiensData();loadCollectionsData();loadContractorsData();loadRegistrationsSummary();loadReviewsData();loadFleetData();

