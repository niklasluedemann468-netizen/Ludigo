import test from 'node:test';
import assert from 'node:assert/strict';
import {parseSearch,queryAccommodations,createSearchController,createAiEndpoint} from '../audits/search-2026-10-30/harness.mjs';

const largeData={camping_info_campsites:Array.from({length:1501},(_,index)=>({id:index+1,name:`Camping ${index+1}`,country:'Deutschland',dogs_allowed:false,near_sea:true})),accommodations:[],expedia_accommodations:[]};
const submit=controller=>controller.render().onSubmit({preventDefault(){}});
const assertEmpty=controller=>{const ui=controller.render();assert.equal(ui.results.length,0);assert.equal(ui.totalCount,0);assert.equal(ui.hasMore,false);return ui;};

for(const sort of ['best','rating','price_asc','price_desc'])test(`No match stays zero among 1501 entries with sort ${sort}`,async()=>{
 const r=await queryAccommodations(`type=campsite&feature=dogs_allowed&sort=${sort}`,largeData);
 assert.equal(r.status,200);assert.deepEqual(r.body.accommodations,[]);assert.equal(r.body.total,0);assert.equal(r.body.next_page,null);
});

test('A new no-match search clears 1501 previous matches and keeps its filters when sorting',async()=>{
 const controller=createSearchController('Camping',async url=>{
  assert.ok(url.startsWith('/api/accommodations?'));
  const r=await queryAccommodations(url.split('?')[1],largeData);return Response.json(r.body,{status:r.status});
 });
 await submit(controller);assert.equal(controller.render().totalCount,1501);assert.equal(controller.render().hasMore,true);
 controller.render().onQueryChange('Camping mit Hund');await submit(controller);assertEmpty(controller);
 for(const sort of ['rating','price_asc','price_desc']){await controller.render().onSortChange(sort);assertEmpty(controller);}
 const count=controller.calls.length;await controller.render().onLoadMore();assert.equal(controller.calls.length,count);
 for(const url of controller.calls.slice(1))assert.ok(new URL(url,'https://test.invalid').searchParams.getAll('feature').includes('dogs_allowed'));
});

test('Old cards, count and pagination are cleared before a new asynchronous request finishes',async()=>{
 let complete;
 const controller=createSearchController('Hotel in Berlin',async()=>complete?await new Promise(resolve=>{complete=resolve;}):Response.json({accommodations:[{id:1,name:'Alter Treffer'}],total:1501,next_page:2}));
 await submit(controller);assert.equal(controller.render().totalCount,1501);
 complete=true;controller.render().onQueryChange('Hotel in Berlin mit Hund');const pending=submit(controller);
 assertEmpty(controller);assert.equal(controller.render().isSearching,true);
 complete(Response.json({accommodations:[],total:0,next_page:null}));await pending;assertEmpty(controller);
});

test('An empty submission resets the complete prior result state',async()=>{
 const controller=createSearchController('Hotel in Berlin',async()=>Response.json({accommodations:[{id:1,name:'Alter Treffer'}],total:1501,next_page:2}));
 await submit(controller);controller.render().onQueryChange('');assertEmpty(controller);await submit(controller);const ui=assertEmpty(controller);assert.equal(ui.searchCriteria,'');
});

test('Changed form travelers do not make an unrecognised text a valid general search',async()=>{
 const r=await parseSearch('Pinguinobservatorium',{type:'campsite',guestsChanged:true,aiStatus:503});assert.equal(r.url,undefined);assert.ok(r.messages.some(x=>/0 Treffer/.test(x)));
});

for(const lateError of [false,true])test(`A late older search ${lateError?'failure':'success'} cannot replace a newer zero result`,async()=>{
 let resolveOld,rejectOld,first=true;
 const controller=createSearchController('Camping am Meer',async()=>{
  if(first){first=false;return new Promise((resolve,reject)=>{resolveOld=resolve;rejectOld=reject;});}
  return Response.json({accommodations:[],total:0,next_page:null});
 });
 const old=submit(controller);controller.render().onQueryChange('Camping am Meer mit Hund');await submit(controller);assertEmpty(controller);
 if(lateError)rejectOld(new Error('Alter Serverfehler'));else resolveOld(Response.json({accommodations:[{id:1,name:'Alter allgemeiner Treffer'}],total:1501,next_page:2}));
 await old;const ui=assertEmpty(controller);assert.match(ui.searchCriteria,/dogs_allowed/);assert.doesNotMatch(ui.message,/Alter Serverfehler/);assert.equal(ui.isSearching,false);
});

test('A late page cannot append old entries to a newer zero-result search',async()=>{
 let resolvePage;
 const controller=createSearchController('Hotel in Berlin',async url=>{
  const p=new URL(url,'https://test.invalid').searchParams;
  if(p.get('page')==='2')return new Promise(resolve=>{resolvePage=resolve;});
  return p.getAll('feature').includes('dogs_allowed')?Response.json({accommodations:[],total:0,next_page:null}):Response.json({accommodations:[{id:1,name:'Voriger Treffer'}],total:1501,next_page:2});
 });
 await submit(controller);const pending=controller.render().onLoadMore();controller.render().onQueryChange('Hotel in Berlin mit Hund');await submit(controller);assertEmpty(controller);
 resolvePage(Response.json({accommodations:[{id:2,name:'Alte Folgeseite'}],total:1501,next_page:3}));await pending;assertEmpty(controller);
});

for(const type of ['campsite','hotel','holiday_apartment'])for(const aiStatus of [200,503])test(`A ${type} tab cannot turn an unrecognised query into an unfiltered list (${aiStatus})`,async()=>{
 const r=await parseSearch('Pinguinobservatorium',{type,aiStatus});assert.equal(r.aiCalls,1);assert.equal(r.url,undefined);assert.ok(r.messages.some(x=>/0 Treffer/.test(x)));
});

test('An AI answer repeating only the already recognised type cannot discard the unknown extra requirement',async()=>{
 const r=await parseSearch('Hotel mit Pinguinobservatorium',{criteria:{accommodation_type:'hotel',features:[]}});
 assert.equal(r.aiCalls,1);assert.equal(r.url,undefined);
});

test('A valid additional AI feature is enforced and a missing feature still produces zero',async()=>{
 const parsed=await parseSearch('Hotel mit Dampfstube',{criteria:{accommodation_type:'hotel',features:['sauna']}});assert.equal(parsed.aiCalls,1);assert.ok(parsed.url);
 const r=await queryAccommodations(parsed.url.split('?')[1],{accommodations:[{id:1,name:'Hotel ohne bestätigte Sauna',is_active:true,accommodation_type:'hotel'}]});
 assert.equal(r.body.total,0);assert.deepEqual(r.body.accommodations,[]);
});

test('A selected tab with a locally recognised city still permits the real filtered search',async()=>{
 const r=await parseSearch('Berlin',{type:'hotel',aiStatus:503});assert.equal(r.aiCalls,0);assert.ok(r.url);assert.equal(new URL(r.url,'https://test.invalid').searchParams.get('city'),'Berlin');
});

test('An ambiguous AI response clears earlier results and never requests a general list',async()=>{
 const controller=createSearchController('Hotel in Berlin',async url=>url==='/api/search'?Response.json({criteria:{},needs_clarification:true}):Response.json({accommodations:[{id:1,name:'Alter Treffer'}],total:1501,next_page:2}));
 await submit(controller);controller.render().onQueryChange('Pinguinobservatorium');await submit(controller);const ui=assertEmpty(controller);assert.match(ui.message,/mehrdeutig/);assert.equal(controller.calls.filter(url=>url.startsWith('/api/accommodations?')).length,1);
});

for(const [detail,code] of [[{code:'insufficient_quota',status:429},'AI_QUOTA_EXCEEDED'],[{status:401},'AI_AUTHENTICATION_FAILED'],[{status:404},'AI_MODEL_UNAVAILABLE'],[{name:'APIConnectionTimeoutError'},'AI_TIMEOUT'],[{},'AI_UPSTREAM_UNAVAILABLE']])test(`The AI endpoint reports ${code} without exposing provider secrets`,async()=>{
 const endpoint=createAiEndpoint({error:{...detail,message:'private-provider-detail'}});
 const response=await endpoint.POST(new Request('https://test.invalid/api/search',{method:'POST',body:JSON.stringify({query:'Reiseidee'})}));
 assert.equal(response.status,503);const body=await response.json();assert.equal(body.code,code);assert.ok(!JSON.stringify(body).includes('private-provider-detail'));
});
