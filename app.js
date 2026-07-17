var CITADEL_VERSION="2.1.2";
var CITADEL_API_URL="https://script.google.com/macros/s/AKfycbzKIMMrIFdmS3xKUHzSzwR-Y-Z4FebDLBod1OWmORqDC-_J9pXH2azFVrONruv1djvIhw/exec";
var PAYMENT_IMPORT_SHEET_URL="https://docs.google.com/spreadsheets/d/1peF6ujpJGi_vugM7hanoL06KLNUC_tarAOoW2dW6QfQ/edit#gid=261509484";
var LIEN_REPORTS_FOLDER_URL="https://drive.google.com/drive/folders/1XcllT_u0WP7H5Cr9zvw9G6NNcOUTYcTH";
var COMMAND_FOCUS_NOTE_PREFIX="citadel_command_focus_note_";
var selectedCommandModule="liens";
var liensWorkspaceStatus="";
var activeLienMetric="all";
var lienFilters={status:"All statuses",stage:"All stages",region:"All regions",sort:"Highest balance",search:""};
var lienSearchTimer=null;
var liensPageEventsBound=false;
var LIEN_STATUS_OPTIONS=["Attorney","Attorney - Customer","Attorney - Elite","Bankruptcy","Collection Agency","Foreclosure","Lien","Lien Released","Paid In Full with Lien","Small Claims","Receivable"];
var LIEN_STAGE_OPTIONS=["Monitor","Review","High","Critical"];
var pages=[{id:"command-center",label:"Command Center"},{id:"region-health",label:"Region Health"},{id:"data-connections",label:"Data Connections"},{id:"inbox",label:"Inbox"},{id:"tasks",label:"Tasks"},{id:"legal",label:"Legal"},{id:"reviews",label:"Reviews"},{id:"pricing",label:"Pricing"},{id:"fleet",label:"Fleet",children:[{id:"fleet-vehicles",label:"Vehicles"},{id:"fleet-drivers",label:"Drivers"}]},{id:"contractors",label:"Contractors"},{id:"registrations",label:"Registrations"},{id:"liens",label:"Liens"},{id:"suppliers",label:"Suppliers"},{id:"collections",label:"Collections"}];


var LIENS_CACHE_KEY="citadel_liens_cache_v1";
var liensData={metrics:[],notes:[],alerts:[],followUps:[],importStatus:null,selectedIndex:0,records:[]};
var lienPaymentHistoryCache={};
var paymentImportRunning=false;
var lienImportRunning=false;
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
var collectionsData={records:[],notes:[],alerts:[],contacts:[],attorneys:[],metrics:[],selectedIndex:0,selectedContactIndex:0};
var collectionsLoading=!!CITADEL_API_URL;
var collectionsLoadError="";
var collectionsLastUpdated="";
var collectionsWorkspaceStatus="";
var collectionsPageEventsBound=false;
var activeCollectionMetric="accounts";
var collectionView="accounts";
var collectionFilters={attorney:"All collection agencies",stage:"All stages",region:"All regions",sort:"Highest outstanding",search:""};
var contactFilters={type:"All contact types",state:"All states",sort:"Organization A-Z",search:""};
var collectionSearchTimer=null;

var SUPPLIERS_CACHE_KEY='citadel_suppliers_cache_v1';
var suppliersData={records:[],contacts:[],documents:[],notes:[],alerts:[],audit:[],metrics:[],selectedIndex:0};
var suppliersLoading=!!CITADEL_API_URL;
var suppliersLoadError='';
var suppliersLastUpdated='';
var supplierWorkspaceStatus='';
var suppliersPageEventsBound=false;
var activeSupplierMetric='all';
var supplierFilters={supplier:'All suppliers',agreement:'All agreements',region:'All regions',sort:'Supplier A-Z',search:''};
var supplierSearchTimer=null;

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
function pricingReportMatches(row,options){if(options.state&&options.state!=='All states'&&String(row.state||'')!==options.state)return false;if(options.supplier&&options.supplier!=='All suppli…67111 tokens truncated…adel-modal-backdrop';
  modal.innerHTML='<section class="workspace-entry-modal business-contact-modal supplier-contact-modal" role="dialog" aria-modal="true" aria-label="Supplier Contact"><div class="modal-head"><div><h3>'+(contact.contact_id?'Edit Supplier Contact':'Add Supplier Contact')+'</h3><p>'+escapeHtml(selected.name||'Supplier')+'</p></div><button type="button" data-close-modal aria-label="Close">x</button></div><form data-supplier-contact-form><input type="hidden" name="supplier_id" value="'+escapeHtml(selected.id||contact.supplier_id||'')+'"><input type="hidden" name="contact_id" value="'+escapeHtml(contact.contact_id||'')+'"><div class="business-contact-form-grid"><label>Role<select name="role_type">'+supplierModalSelect('Select role',['Branch Manager','Branch Representative','Regional Sales Manager','Accounting','Orders','Credit Department','Other'],contact.role_type||'Select role')+'</select></label><label>Contact Name<input name="contact_name" value="'+escapeHtml(contact.contact_name||'')+'"></label><label>Title / Department<input name="title_department" value="'+escapeHtml(contact.title_department||'')+'"></label><label>Email<input name="email" type="email" value="'+escapeHtml(contact.email||'')+'"></label><label>Secondary Email<input name="secondary_email" type="email" value="'+escapeHtml(contact.secondary_email||'')+'"></label><label>Office Phone<input name="office_phone" value="'+escapeHtml(contact.office_phone||'')+'"></label><label>Secondary Phone<input name="secondary_phone" value="'+escapeHtml(contact.secondary_phone||'')+'"></label><label>Extension<input name="extension" value="'+escapeHtml(contact.extension||'')+'"></label><label>Fax<input name="fax" value="'+escapeHtml(contact.fax||'')+'"></label><label>Branch Number<input name="branch_number" value="'+escapeHtml(contact.branch_number||selected.branchNumber||'')+'"></label><label>Region<input name="region" value="'+escapeHtml(contact.region||selected.region||'')+'"></label><label>Preferred Contact<select name="preferred_contact_method">'+supplierModalSelect('Not set',['Email','Phone','Secondary Phone','Mail'],contact.preferred_contact_method||'Not set')+'</select></label><label class="contact-notes-field">Notes<textarea name="notes" rows="4">'+escapeHtml(contact.notes||'')+'</textarea></label><input type="hidden" name="active" value="true"></div><div class="workspace-entry-actions"><button type="button" data-close-modal>Cancel</button><button type="submit" class="primary">Save Contact</button></div></form></section>';
  modal.addEventListener('click',function(event){if(event.target===modal||event.target.closest('[data-close-modal]'))closeLiensReportsModal()});
  modal.querySelector('[data-supplier-contact-form]').addEventListener('submit',function(event){event.preventDefault();var payload=supplierFormPayload(event.currentTarget);if(!payload.contact_name&&!payload.email){event.currentTarget.elements.contact_name.focus();return}closeLiensReportsModal();saveSupplierWorkspace('saveSupplierContact',payload)});
  document.body.appendChild(modal)
}
function openSupplierDocumentModal(documentRow){
  closeLiensReportsModal();
  var selected=suppliersData.records[suppliersData.selectedIndex]||{};documentRow=documentRow||{};
  var modal=document.createElement('div');modal.className='citadel-modal-backdrop';
  modal.innerHTML='<section class="workspace-entry-modal business-contact-modal supplier-document-modal" role="dialog" aria-modal="true" aria-label="Supplier Document"><div class="modal-head"><div><h3>'+(documentRow.document_id?'Edit Supplier Document':'Add Supplier Document')+'</h3><p>'+escapeHtml(selected.name||'Supplier')+'</p></div><button type="button" data-close-modal aria-label="Close">x</button></div><form data-supplier-document-form><input type="hidden" name="supplier_id" value="'+escapeHtml(selected.id||documentRow.supplier_id||'')+'"><input type="hidden" name="document_id" value="'+escapeHtml(documentRow.document_id||'')+'"><div class="business-contact-form-grid"><label>Document Type *<select name="document_type" required>'+supplierModalSelect('Select type',['Signed Agreement','W-9','Tax Exemption','Resale Certificate','Vendor Application','Certificate of Insurance','Credit Application','Pricing Agreement','Other'],documentRow.document_type||'Select type')+'</select></label><label>Status<select name="status">'+supplierModalSelect('Not Verified',['On File','Pending','Expired','Not Required','Not Verified'],documentRow.status||'Not Verified')+'</select></label><label>Issue Date<input name="issue_date" type="date" value="'+escapeHtml(documentRow.issue_date||'')+'"></label><label>Expiration Date<input name="expiration_date" type="date" value="'+escapeHtml(documentRow.expiration_date||'')+'"></label><label>Renewal Date<input name="renewal_date" type="date" value="'+escapeHtml(documentRow.renewal_date||'')+'"></label><label>Document Link<input name="document_url" type="url" placeholder="https://" value="'+escapeHtml(documentRow.document_url||'')+'"></label><label class="contact-notes-field">Notes<textarea name="notes" rows="4">'+escapeHtml(documentRow.notes||'')+'</textarea></label><input type="hidden" name="active" value="true"></div><div class="workspace-entry-actions"><button type="button" data-close-modal>Cancel</button><button type="submit" class="primary">Save Document</button></div></form></section>';
  modal.addEventListener('click',function(event){if(event.target===modal||event.target.closest('[data-close-modal]'))closeLiensReportsModal()});
  modal.querySelector('[data-supplier-document-form]').addEventListener('submit',function(event){event.preventDefault();var payload=supplierFormPayload(event.currentTarget);if(payload.document_type==='Select type'){event.currentTarget.elements.document_type.focus();return}closeLiensReportsModal();saveSupplierWorkspace('saveSupplierDocument',payload)});
  document.body.appendChild(modal)
}
function saveSupplierWorkspace(action,payload){
  supplierWorkspaceStatus='Saving...';if(activePage==='suppliers')renderContent();
  var params=Object.keys(payload).map(function(key){return encodeURIComponent(key)+'='+encodeURIComponent(payload[key]||'')}).join('&');
  return jsonp(CITADEL_API_URL+'?action='+encodeURIComponent(action)+'&'+params).then(function(response){
    if(!response||!response.ok)throw new Error(response&&response.error?response.error:'Save failed');
    supplierWorkspaceStatus='Saved';return loadSuppliersData()
  }).catch(function(error){supplierWorkspaceStatus='Save failed';console.warn('Supplier workspace save failed',error);if(activePage==='suppliers')renderContent()})
}
function supplierReportQuickRows(type){
  var rows=(suppliersData.records||[]).slice();
  if(type==='current')return getVisibleSupplierRecords();
  if(type==='open_alerts')return rows.filter(function(row){return row.alertsCount>0});
  if(type==='agreements')return rows.filter(supplierAgreementMissing);
  if(type==='renewals')return rows.filter(supplierRenewalDue);
  if(type==='compliance')return rows.filter(supplierComplianceDue);
  if(type==='credit')return rows.filter(supplierCreditReview);
  return rows
}
function supplierReportFilteredRows(modal){
  var quick=modal.getAttribute('data-active-quick-report')||'current';
  if(quick!=='custom')return supplierReportQuickRows(quick);
  var rows=(suppliersData.records||[]).slice();
  var value=function(key){var field=modal.querySelector('[data-supplier-report-filter="'+key+'"]');return field?field.value:''};
  var region=value('region'),status=value('status'),agreement=value('agreement'),compliance=value('compliance'),credit=value('credit'),type=value('type'),search=value('search').toLowerCase().trim();
  if(region&&region!=='All regions')rows=rows.filter(function(row){return row.region===region});
  if(status&&status!=='All statuses')rows=rows.filter(function(row){return row.status===status});
  if(agreement&&agreement!=='All agreements')rows=agreement==='Needs agreement'?rows.filter(supplierAgreementMissing):rows.filter(function(row){return row.agreementStatus===agreement});
  if(compliance&&compliance!=='All compliance')rows=rows.filter(function(row){return row.complianceStatus===compliance});
  if(credit&&credit!=='All credit statuses')rows=rows.filter(function(row){return row.creditStatus===credit});
  if(type&&type!=='All types')rows=rows.filter(function(row){return row.type===type});
  if(search)rows=rows.filter(function(row){return [row.name,row.code,row.accountNumber,row.region,row.type,row.paymentTerms].join(' ').toLowerCase().indexOf(search)>-1});
  return rows
}
function supplierReportTable(rows){
  return [['Supplier','Code','Type','Region','Account Number','Branch','Agreement','Agreement Expiration','Renewal Date','Payment Terms','Current Balance','Credit Limit','Credit Status','Compliance','Insurance Expiration','Contacts','Open Alerts']].concat(rows.map(function(row){return [row.name,row.code,row.type,row.region,row.accountNumber,row.branchNumber,row.agreementStatus,row.agreementExpiration,row.renewalDate,row.paymentTerms,row.currentBalance,row.creditLimit,row.creditStatus,row.complianceStatus,row.insuranceExpiration,row.contactsCount,row.alertsCount]}))
}
function updateSupplierReportSummary(){
  var modal=document.querySelector('.citadel-report-modal[aria-label="Suppliers Reports"]');if(!modal)return;
  var rows=supplierReportFilteredRows(modal);var quick=modal.getAttribute('data-active-quick-report')||'current';
  var labels={current:'Current View',open_alerts:'Open Alerts',agreements:'Missing Agreements',renewals:'90 Day Renewals',compliance:'Compliance Review',credit:'Credit Review',custom:'Custom Report'};
  var count=modal.querySelector('[data-supplier-report-count]');if(count)count.textContent=rows.length+' records';
  var parameters=modal.querySelector('[data-supplier-report-parameters]');if(parameters)parameters.innerHTML='<strong>Report parameters</strong><span>View: '+escapeHtml(labels[quick]||'Custom Report')+'</span><span>Region: '+escapeHtml((modal.querySelector('[data-supplier-report-filter="region"]')||{}).value||'All regions')+'</span><span>Search: '+escapeHtml((modal.querySelector('[data-supplier-report-filter="search"]')||{}).value||'None')+'</span>';
  modal.querySelectorAll('[data-quick-supplier-report]').forEach(function(button){var active=button.getAttribute('data-quick-supplier-report')===quick;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))})
}
function openSupplierReportsModal(){
  closeLiensReportsModal();
  var modal=document.createElement('div');modal.className='citadel-modal-backdrop';
  modal.innerHTML='<section class="citadel-report-modal" role="dialog" aria-modal="true" aria-label="Suppliers Reports" data-active-quick-report="current"><div class="modal-head"><div><h3>Suppliers Reports</h3><p>Build supplier contact, agreement, credit, terms, renewal, and compliance reports.</p></div><button type="button" data-close-modal aria-label="Close reports">x</button></div><div class="report-callout">Supplier account controls are protected in Citadel; payment activity remains in accounting.</div><section class="report-band"><div class="report-band-head"><strong>Quick Reports</strong><span>Common exports</span></div><div class="quick-report-grid"><button type="button" data-quick-supplier-report="open_alerts">Open Alerts</button><button type="button" data-quick-supplier-report="agreements">Missing Agreements</button><button type="button" data-quick-supplier-report="renewals">90 Day Renewals</button><button type="button" data-quick-supplier-report="compliance">Compliance Review</button><button type="button" data-quick-supplier-report="credit">Credit Review</button><button type="button" class="active" data-quick-supplier-report="current" aria-pressed="true">Current View</button></div></section><section class="report-custom"><div class="report-band-head"><strong>Custom Report</strong><span>Filters and export format</span></div><div class="report-form-grid"><label>Region<select data-supplier-report-filter="region">'+renderSelectOptions('All regions',getSupplierRegions(),'All regions')+'</select></label><label>Status<select data-supplier-report-filter="status">'+renderSelectOptions('All statuses',getSupplierStatuses(),'All statuses')+'</select></label><label>Agreement<select data-supplier-report-filter="agreement">'+renderSelectOptions('All agreements',['Signed','Needs agreement','Pending','Expired','Not Required','Not Verified'],'All agreements')+'</select></label><label>Compliance<select data-supplier-report-filter="compliance">'+renderSelectOptions('All compliance',['Current','Needs Review','Missing Documents','Expired','Not Required'],'All compliance')+'</select></label><label>Credit Status<select data-supplier-report-filter="credit">'+renderSelectOptions('All credit statuses',['Good Standing','Review','Credit Hold','COD','Not Verified'],'All credit statuses')+'</select></label><label>Supplier Type<select data-supplier-report-filter="type">'+renderSelectOptions('All types',getSupplierTypes(),'All types')+'</select></label><label>Search Text<input data-supplier-report-filter="search" placeholder="Supplier, account, region"></label></div></section><div class="report-summary-row"><div class="report-parameters" data-supplier-report-parameters></div><div class="report-total"><strong data-supplier-report-count>'+escapeHtml(getVisibleSupplierRecords().length)+' records</strong><span>Supplier account view</span><em>Contacts, terms, agreements, credit, and compliance</em></div></div><div class="modal-actions"><button type="button" data-supplier-report-reset>Reset</button><span></span><select data-supplier-export-format aria-label="Export format"><option>CSV</option><option>Excel</option><option>PDF</option></select><button type="button" data-close-modal>Cancel</button><button type="button" data-supplier-report-export>Export</button></div></section>';
  modal.addEventListener('click',function(event){var quick=event.target.closest('[data-quick-supplier-report]');if(quick){modal.querySelector('.citadel-report-modal').setAttribute('data-active-quick-report',quick.getAttribute('data-quick-supplier-report'));updateSupplierReportSummary();return}if(event.target.closest('[data-supplier-report-reset]')){modal.querySelector('.citadel-report-modal').setAttribute('data-active-quick-report','current');modal.querySelectorAll('[data-supplier-report-filter]').forEach(function(field){if(field.tagName==='SELECT')field.selectedIndex=0;else field.value=''});updateSupplierReportSummary();return}if(event.target.closest('[data-supplier-report-export]')){var rows=supplierReportFilteredRows(modal);var format=modal.querySelector('[data-supplier-export-format]').value;reportDownloadTable(supplierReportTable(rows),format,'citadel-suppliers-report');return}if(event.target===modal||event.target.closest('[data-close-modal]'))closeLiensReportsModal()});
  modal.addEventListener('input',function(event){if(event.target.closest('[data-supplier-report-filter]')){modal.querySelector('.citadel-report-modal').setAttribute('data-active-quick-report','custom');updateSupplierReportSummary()}});
  modal.addEventListener('change',function(event){if(event.target.closest('[data-supplier-report-filter]')){modal.querySelector('.citadel-report-modal').setAttribute('data-active-quick-report','custom');updateSupplierReportSummary()}});
  document.body.appendChild(modal);updateSupplierReportSummary()
}
function bindSuppliersPage(){
  if(suppliersPageEventsBound)return;suppliersPageEventsBound=true;
  pagePanel.addEventListener('click',function(event){
    if(activePage!=='suppliers')return;
    var entry=event.target.closest('[data-workspace-entry]');if(entry){openWorkspaceEntryModal('suppliers',entry.getAttribute('data-workspace-entry'));return}
    var metric=event.target.closest('[data-supplier-metric]');if(metric){activeSupplierMetric=metric.getAttribute('data-supplier-metric')||'all';suppliersData.selectedIndex=0;renderSuppliersPage();return}
    if(event.target.closest('[data-supplier-reports]')){openSupplierReportsModal();return}
    if(event.target.closest('[data-add-supplier]')){openSupplierAccountModal();return}
    if(event.target.closest('[data-edit-supplier]')){openSupplierAccountModal(suppliersData.records[suppliersData.selectedIndex]||{});return}
    if(event.target.closest('[data-add-supplier-contact]')){openSupplierContactModal();return}
    if(event.target.closest('[data-add-supplier-document]')){openSupplierDocumentModal();return}
    var contactButton=event.target.closest('[data-edit-supplier-contact]');if(contactButton){openSupplierContactModal(suppliersData.contacts[Number(contactButton.getAttribute('data-edit-supplier-contact'))]||{});return}
    var documentButton=event.target.closest('[data-edit-supplier-document]');if(documentButton){openSupplierDocumentModal(suppliersData.documents[Number(documentButton.getAttribute('data-edit-supplier-document'))]||{});return}
    var row=event.target.closest('[data-supplier-index]');if(!row)return;suppliersData.selectedIndex=Number(row.getAttribute('data-supplier-index'));renderSuppliersPage()
  });
  pagePanel.addEventListener('change',function(event){if(activePage!=='suppliers')return;var field=event.target.closest('select[data-supplier-filter]');if(!field)return;supplierFilters[field.getAttribute('data-supplier-filter')]=field.value;suppliersData.selectedIndex=0;renderSuppliersPage()});
  pagePanel.addEventListener('input',function(event){if(activePage!=='suppliers')return;var search=event.target.closest('input[data-supplier-filter="search"]');if(!search)return;supplierFilters.search=search.value;window.clearTimeout(supplierSearchTimer);supplierSearchTimer=window.setTimeout(function(){suppliersData.selectedIndex=0;renderSuppliersPage();var next=pagePanel.querySelector('input[data-supplier-filter="search"]');if(next){next.focus();next.setSelectionRange(next.value.length,next.value.length)}},180)})
}

function renderRegistrationsModule(){pagePanel.className="page-panel registrations-module-page";pagePanel.innerHTML='<iframe class="registrations-module-frame" title="Registrations workspace" src="./modules/registrations/index.html?v=2.1.2.10"></iframe>'}

function renderContent(){var label=getPageLabel(activePage);pageTitle.textContent=label;if(activePage==="command-center"){renderCommandCenter();bindCommandCenter();return}if(activePage==="region-health"){renderRegionHealthPage();bindStandardPage();return}if(activePage==="liens"){renderLiensPage();bindLiensPage();return}if(activePage==="collections"){renderCollectionsPage();bindCollectionsPage();return}if(activePage==="suppliers"){renderSuppliersPage();bindSuppliersPage();return}if(activePage==="contractors"){renderContractorsPage();bindContractorsPage();return}if(activePage==="registrations"){renderRegistrationsModule();return}if(activePage==="reviews"){renderReviewsPage();bindReviewsPage();if(!reviewsData.records.length&&!reviewsLoading&&!reviewsLoadError)loadReviewsData();return}if(activePage==="pricing"){renderPricingPage();bindPricingPage();if(!pricingState.rows.length&&!pricingState.loading&&!pricingState.error)loadPricingData();return}if(activePage==="fleet"||activePage==="fleet-vehicles"||activePage==="fleet-drivers"){renderFleetPage();bindFleetPage();if(!fleetData.sourceRows.length&&!fleetData.vehicles.length&&!fleetData.drivers.length&&!fleetLoading&&!fleetLoadError)loadFleetData();return}renderStandardContent();bindStandardPage()}
function setActivePage(pageId){activePage=pageId;renderNavigation();renderContent()}

initSettingsMenu();initForceRefreshButton();checkForCitadelUpdate();hydrateLiensFromCache();hydrateCollectionsFromCache();hydrateSuppliersFromCache();hydrateContractorsFromCache();hydrateReviewsFromCache();hydrateFleetFromCache();loadPricingStaticData();setActivePage(activePage);loadLiensData();loadCollectionsData();loadSuppliersData();loadContractorsData();loadRegistrationsSummary();loadReviewsData();loadFleetData();
