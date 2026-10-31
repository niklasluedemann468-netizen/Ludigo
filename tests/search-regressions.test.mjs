import test from 'node:test';
import assert from 'node:assert/strict';
import {parseSearch,queryAccommodations,loadSearchModule,createAiEndpoint,createSearchController} from '../audits/search-2026-10-30/harness.mjs';
import {tables} from '../audits/search-2026-10-30/fixtures.mjs';
const params=r=>new URL(r.url,'https://audit.invalid').searchParams;
const names=r=>r.body.accommodations.map(x=>x.name);
const {mergeAiCriteria}=loadSearchModule('app/lib/search/ai-criteria.ts');
const {featureValue}=loadSearchModule('app/lib/search/features.ts');
const {sortAccommodations}=loadSearchModule('app/lib/accommodation-view.ts');

// These cases exercise external behavior and cross-source invariants, not parser implementation details.
test('All sources obey the same requested city',async()=>{
 const r=await queryAccommodations('city=Berlin',tables);
 assert.ok(r.body.accommodations.length>=2);
 assert.ok(r.body.accommodations.every(x=>x.city==='Berlin'));
});
test('A confirmed column or relation proves a feature and populates its result badge',async()=>{
 const r=await queryAccommodations('type=hotel&feature=pool',{...tables,accommodations:tables.accommodations.map(x=>({...x,has_pool:null}))});
 const own=r.body.accommodations.find(x=>x.name==='Eigenes Hotel Berlin');
 assert.ok(own);assert.equal(own.has_pool,true);assert.equal(own.feature_states.pool,true);
});
test('Conflicting feature facts do not prove a positive or negative requirement',()=>{
 assert.equal(featureValue({has_pool:false},'pool',new Set(['pool'])),null);
 assert.equal(featureValue({has_pool:false,private_pool:true},'pool'),null);
 assert.equal(featureValue({private_pool:true},'pool'),true);
 assert.equal(featureValue({has_pool:true},'private_pool'),null);
});
test('A negative filter requires confirmed absence rather than missing data',async()=>{
 const data={...tables,camping_info_campsites:[...tables.camping_info_campsites,{id:12,name:'Unknown pool',country:'Deutschland',has_pool:null}]};
 const r=await queryAccommodations('type=campsite&exclude_feature=pool',data);
 assert.deepEqual(names(r),['Feed Berlin ohne Ausstattung']);
});
test('A failed feature catalogue does not hide confirmed partner facts',async()=>{
 const r=await queryAccommodations('type=campsite&feature=dogs_allowed',tables,{errors:{features:'Simulated catalogue outage'}});
 assert.ok(names(r).includes('Feed München mit Ausstattung'));assert.ok(r.body.warnings.length);
});
test('Default traveler context permits hotel discovery, while explicit capacity is enforced',async()=>{
 const data={...tables,expedia_accommodations:tables.expedia_accommodations.map(x=>({...x,max_guests:null}))};
 assert.ok(names(await queryAccommodations('type=hotel&guests=2',data)).includes('Expedia Hotel Berlin'));
 assert.ok(!names(await queryAccommodations('type=hotel&max_guests=2',data)).includes('Expedia Hotel Berlin'));
 const local=params(await parseSearch('Hotel in Berlin',{aiStatus:503}));
 assert.equal(local.get('guests'),'2');assert.equal(local.has('max_guests'),false);
});
test('Explicitly changing travelers to two still requests confirmed capacity',async()=>{
 const r=params(await parseSearch('Hotel in Berlin',{guestsChanged:true,aiStatus:503}));assert.equal(r.get('max_guests'),'2');
});
test('Late pages and provider row limits cannot silently truncate a search at 2000 records',async()=>{
 const data={...tables,accommodations:[],camping_info_campsites:Array.from({length:2501},(_,i)=>({...tables.camping_info_campsites[0],id:i+1,name:`Camp ${i+1}`}))};
 const r=await queryAccommodations('type=campsite',data,{defaultLimit:100});
 assert.equal(r.body.total,2501);assert.equal(r.body.next_page,2);assert.equal(r.body.accommodations.length,60);
 const late=await queryAccommodations('type=campsite&page=26&page_size=100',data,{defaultLimit:100});assert.equal(late.body.accommodations.length,1);assert.equal(late.body.next_page,null);assert.ok(late.body.accommodations[0].id);
});
test('Duplicate relation rows cannot count as two different required features',async()=>{
 const r=await queryAccommodations('type=hotel&feature=pool&feature=sauna',{...tables,accommodations:tables.accommodations.map(x=>({...x,has_pool:null})),accommodation_features:[{accommodation_id:1,feature_id:1},{accommodation_id:1,feature_id:1}]});
 assert.ok(!names(r).includes('Eigenes Hotel Berlin'));
});
test('Best matches rank all providers together using a common review scale',async()=>{
 const r=await queryAccommodations('',{...tables,accommodations:tables.accommodations.filter(x=>x.id===1),expedia_accommodations:[]});
 assert.equal(r.body.accommodations[0].name,'Feed München mit Ausstattung');
 const sorted=sortAccommodations([{id:1,name:'Hotel',review_score:8,review_scale:10},{id:2,name:'Camp',review_score:4.5,review_scale:5}],'rating');
 assert.equal(sorted[0].id,2);
});
test('Server sorting is applied to the full result set before pagination',async()=>{
 const r=await queryAccommodations('sort=rating&page_size=1',tables);assert.equal(r.body.accommodations[0].name,'Feed München mit Ausstattung');assert.ok(r.body.total>1);assert.equal(r.body.next_page,2);
 assert.equal((await queryAccommodations('page_size=1000',tables)).status,400);
});
test('The real search controller loads successive pages and sorts the entire source',async()=>{
 const data={...tables,expedia_accommodations:[],accommodations:Array.from({length:125},(_,i)=>({...tables.accommodations[0],id:i+1,price_min:200-i}))};
 const controller=createSearchController('Hotel in Berlin',async url=>{const r=await queryAccommodations(url.split('?')[1],data);return Response.json(r.body,{status:r.status});});
 await controller.render().onSubmit({preventDefault(){}});
 let ui=controller.render();assert.equal(ui.results.length,60);assert.equal(ui.totalCount,125);assert.equal(ui.hasMore,true);
 await ui.onLoadMore();ui=controller.render();assert.equal(ui.results.length,120);
 await ui.onSortChange('price_asc');ui=controller.render();assert.equal(ui.results.length,60);assert.equal(ui.results[0].price_min,76);assert.equal(ui.sortOption,'price_asc');
 await ui.onLoadMore();ui=controller.render();assert.equal(ui.results.length,120);assert.equal(new Set(ui.results.map(x=>x.id)).size,120);
 await ui.onLoadMore();ui=controller.render();assert.equal(ui.results.length,125);assert.equal(ui.hasMore,false);
});
test('A failed extra page keeps existing results, while a new invalid search clears stale paging',async()=>{
 let fail=false;
 const data={...tables,expedia_accommodations:[],accommodations:Array.from({length:65},(_,i)=>({...tables.accommodations[0],id:i+1}))};
 const controller=createSearchController('Hotel in Berlin',async url=>{if(fail)return Response.json({error:'Vorübergehend nicht verfügbar'},{status:503});const r=await queryAccommodations(url.split('?')[1],data);return Response.json(r.body,{status:r.status});});
 await controller.render().onSubmit({preventDefault(){}});fail=true;
 await controller.render().onLoadMore();let ui=controller.render();assert.equal(ui.results.length,60);assert.equal(ui.isSearching,false);assert.match(ui.message,/nicht verfügbar/);
 ui.onQueryChange('Hotel vom 31. Februar bis 5. März');await controller.render().onSubmit({preventDefault(){}});ui=controller.render();assert.equal(ui.results.length,0);assert.equal(ui.hasMore,false);assert.equal(ui.totalCount,0);
});
test('Unknown partner prices cannot satisfy a nightly or total budget',async()=>{
 const r=await queryAccommodations('type=campsite&max_total_price=100&nights=7',tables);
 assert.equal(r.body.accommodations.length,0);
});
test('Requests reject malformed numbers, impossible dates and contradictory constraints',async()=>{
 for(const query of ['max_guests=NaN','max_guests=-2','month=13','min_price_per_night=100&max_price_per_night=50','check_in=2027-02-31&check_out=2027-03-05','check_in=2027-07-01','check_in=2027-07-01&check_out=2027-07-08&nights=3','feature=pool&exclude_feature=pool','total_budget=700','review_scale=6','hotel_stars=8','unexpected_filter=true']) {
  const r=await queryAccommodations(query,tables);assert.equal(r.status,400,query);assert.equal(r.calls.length,0,query);
 }
});
test('Dates are valid context and are never advertised as confirmed availability',async()=>{
 const r=await queryAccommodations('check_in=2027-07-01&check_out=2027-07-08',tables);
 assert.equal(r.body.availability.status,'not_checked');assert.equal(r.body.availability.nights,7);
});
test('Amounts keep decimal precision and total budgets use the final dates',async()=>{
 for(const [query,expected] of [['Hotel bis 99,50 Euro pro Nacht',99.5],['Hotel bis 1.200 Euro pro Nacht',1200],['Hotel Budget 700 Euro',100],['Hotel bis 100 Euro pro Person und Nacht',200]]){
  const r=params(await parseSearch(query,{aiStatus:503}));assert.equal(Number(r.get('max_price_per_night')),expected,query);
 }
});
test('Three nights update the departure; explicit years survive and invalid dates stop the search',async()=>{
 let r=params(await parseSearch('Hotel für 3 Nächte',{aiStatus:503}));assert.equal(r.get('check_out'),'2027-07-04');
 r=params(await parseSearch('Hotel vom 01.06.2027 bis 08.06.2027',{aiStatus:503}));assert.equal(r.get('check_in'),'2027-06-01');
 const bad=await parseSearch('Hotel vom 31. Februar bis 5. März',{aiStatus:503});assert.equal(bad.url,undefined);assert.ok(bad.messages.some(x=>/gültig/.test(x)));
});
test('Place names do not introduce mountains, lakes or accidental travel months',async()=>{
 for(const [query,forbidden] of [['Hotel in Heidelberg','near_mountains'],['Hotel an der Nordsee','near_lake']])assert.ok(!params(await parseSearch(query,{aiStatus:503})).getAll('feature').includes(forbidden));
 const mailand=await parseSearch('Hotel in Mailand',{aiStatus:503});assert.ok(!mailand.params.month);if(!mailand.url)assert.ok(mailand.messages.some(x=>/Reiseziel/.test(x)));
});
test('Named and ISO date ranges preserve their explicit years across New Year',async()=>{
 for(const [query,start,end] of [
  ['Hotel vom 12. bis 19. Juli 2028','2028-07-12','2028-07-19'],
  ['Hotel vom 12. Juli 2028 bis 19. Juli 2028','2028-07-12','2028-07-19'],
  ['Hotel vom 28. Dezember 2027 bis 4. Januar 2028','2027-12-28','2028-01-04'],
  ['Hotel 2027-07-01 bis 2027-07-08','2027-07-01','2027-07-08'],
 ]){const p=params(await parseSearch(query,{aiStatus:503}));assert.equal(p.get('check_in'),start,query);assert.equal(p.get('check_out'),end,query);}
 const conflict=await parseSearch('Hotel vom 01.07.2027 bis 08.07.2027 für 3 Nächte',{aiStatus:503});assert.equal(conflict.url,undefined);assert.ok(conflict.messages.some(x=>/Dauer/.test(x)));
});
test('An explicit review scale applies consistently across sources',async()=>{
 const p=params(await parseSearch('Hotel Bewertung mindestens 4,5 von 5',{aiStatus:503}));assert.equal(p.get('review_scale'),'5');
 const r=await queryAccommodations('min_review_score=4.5&review_scale=5',tables);
 assert.ok(names(r).includes('Feed München mit Ausstattung'));assert.ok(!names(r).includes('Eigenes Hotel Berlin'));
 assert.equal((await queryAccommodations('type=campsite&min_review_score=8',tables)).status,400);
});
test('Review upper bounds, exact scores and intervals reach the API',async()=>{
 for(const [query,key,expected] of [['Hotel Bewertung maximal 8','max_review_score','8'],['Hotel Bewertung genau 8','review_score','8'],['Hotel Bewertung zwischen 7 und 9','max_review_score','9']]){
  const p=params(await parseSearch(query,{aiStatus:503}));assert.equal(p.get(key),expected,query);
 }
 const p=params(await parseSearch('Hotel bis 0 Euro pro Nacht',{aiStatus:503}));assert.equal(p.get('max_price_per_night'),'0');
});
test('Recognised unsupported details remain visible instead of disappearing silently',async()=>{
 for(const query of ['Hotel nachhaltig','Hotel glutenfreies Frühstück','Hotel mit mindestens 80 Quadratmetern']){
  const r=await parseSearch(query,{aiStatus:503});assert.ok(r.messages.some(x=>/nicht unterstützt/.test(x)),query);
 }
});
test('City and airport location features are preserved without inventing a sea requirement for every beach',async()=>{
 assert.ok(params(await parseSearch('Hotel im Stadtzentrum',{aiStatus:503})).getAll('feature').includes('city_center'));
 assert.ok(params(await parseSearch('Hotel nahe Flughafen',{aiStatus:503})).getAll('feature').includes('near_airport'));
 const beach=params(await parseSearch('Camping direkt am Strand',{aiStatus:503}));assert.ok(beach.getAll('feature').includes('beachfront'));assert.ok(!beach.getAll('feature').includes('near_sea'));
 const optional=params(await parseSearch('Hotel nahe Flughafen wäre schön, WLAN muss sein',{aiStatus:503}));assert.ok(optional.getAll('preferred_feature').includes('near_airport'));assert.ok(!optional.getAll('must_feature').includes('near_airport'));
});
test('Specific facility requirements remain specific and optional private pools stay optional',async()=>{
 for(const [query,key] of [['Hotel mit privater Sauna','private_sauna'],['Hotel mit bewachtem Parkplatz','guarded_parking']])assert.ok(params(await parseSearch(query,{aiStatus:503})).getAll('feature').includes(key),query);
 const optional=params(await parseSearch('Hotel ein privater Pool wäre schön',{aiStatus:503}));assert.ok(optional.getAll('preferred_feature').includes('private_pool'));
});
test('Optional criteria remain local to each clause in either word order',async()=>{
 for(const query of ['Hotel WLAN muss sein, Pool wäre schön','Hotel Pool wäre schön, WLAN muss sein','Hotel mit Pool wäre schön und WLAN muss sein']){
  const r=params(await parseSearch(query,{aiStatus:503}));assert.ok(r.getAll('must_feature').includes('wifi'),query);assert.ok(!r.getAll('must_feature').includes('pool'),query);assert.ok(r.getAll('preferred_feature').includes('pool'),query);
 }
});
test('General accessibility does not require wheelchair-specific suitability',async()=>{
 const r=params(await parseSearch('Hotel barrierefrei',{aiStatus:503}));assert.ok(r.getAll('feature').includes('accessible'));assert.ok(!r.getAll('feature').includes('wheelchair_accessible'));
});
test('AI output cannot override local geography or inject unknown keys and invalid values',()=>{
 const p=new URLSearchParams('city=Berlin&country=Deutschland&type=hotel');
 mergeAiCriteria(p,{country:'Italien',city:'Rom',guests:-5,month:25,nights:Infinity,features:['not_a_real_feature','wifi',null,{}]},'hotel');
 assert.equal(p.get('country'),'Deutschland');assert.equal(p.get('city'),'Berlin');assert.equal(p.has('max_guests'),false);assert.equal(p.has('month'),false);assert.deepEqual(p.getAll('feature'),['wifi']);
});
test('One optional fallback is used for an unrecognised query and known searches use none',async()=>{
 const known=await parseSearch('Hotel in Berlin',{criteria:{features:['pool']}});assert.equal(known.aiCalls,0);
 const unknown=await parseSearch('Überrasche mich',{criteria:{city:'Berlin',country:'Deutschland',accommodation_type:'hotel',features:['not_a_real_feature','wifi']}});assert.equal(unknown.aiCalls,1);assert.ok(!params(unknown).getAll('feature').includes('not_a_real_feature'));
});
test('An unresolved destination is not replaced with unrelated generic results',async()=>{
 const unavailable=await parseSearch('Hotel in Lazise',{aiStatus:503});assert.equal(unavailable.url,undefined);assert.ok(unavailable.messages.some(x=>/Reiseziel/.test(x)));
 const resolved=params(await parseSearch('Hotel in Lazise',{criteria:{city:'Lazise',country:'Italien'}}));assert.equal(resolved.get('city'),'Lazise');
 const mountains=params(await parseSearch('Hotel in den Bergen',{aiStatus:503}));assert.ok(mountains.getAll('feature').includes('near_mountains'));
});
test('The AI endpoint validates input before spending an API request',async()=>{
 const endpoint=createAiEndpoint();
 for(const body of [{query:''},{query:123},{query:'x'.repeat(3001)}]){const r=await endpoint.POST(new Request('https://audit.invalid/api/search',{method:'POST',body:JSON.stringify(body)}));assert.equal(r.status,400);}
 assert.equal(endpoint.calls.length,0);
 const invalid=await endpoint.POST(new Request('https://audit.invalid/api/search',{method:'POST',body:'bad json'}));assert.equal(invalid.status,400);
});
test('Missing credentials and failed or incomplete model responses degrade cleanly',async()=>{
 for(const options of [{noKey:true},{error:true},{response:{status:'incomplete',output_text:'{}'}},{response:{status:'completed',output_text:'not json'}}]){
  const endpoint=createAiEndpoint(options);const r=await endpoint.POST(new Request('https://audit.invalid/api/search',{method:'POST',body:JSON.stringify({query:'Reiseidee'})}));assert.equal(r.status,503);
 }
});
test('The AI endpoint enforces a schema, bounds latency and sanitizes its result',async()=>{
 const endpoint=createAiEndpoint({criteria:{city:'Berlin',guests:-1,features:['wifi','made_up']}});
 const r=await endpoint.POST(new Request('https://audit.invalid/api/search',{method:'POST',body:JSON.stringify({query:'Reiseidee'})}));
 assert.equal(r.status,200);const {criteria}=await r.json();assert.equal(criteria.guests,null);assert.deepEqual(criteria.features,['wifi']);
 assert.equal(endpoint.calls[1].request.text.format.strict,true);assert.equal(endpoint.calls[0].config.maxRetries,0);assert.equal(endpoint.calls[0].config.timeout,8000);
});
test('Repeated AI requests receive an explicit rate limit response',async()=>{
 const endpoint=createAiEndpoint();let response;
 for(let i=0;i<21;i++)response=await endpoint.POST(new Request('https://audit.invalid/api/search',{method:'POST',headers:{'x-forwarded-for':'192.0.2.1'},body:JSON.stringify({query:'Reiseidee'})}));
 assert.equal(response.status,429);assert.equal(response.headers.get('retry-after'),'60');
});
