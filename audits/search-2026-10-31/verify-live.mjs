import fs from 'node:fs';
import assert from 'node:assert/strict';
import {wildCases} from './wild-cases.mjs';
import {parseSearch,loadSearchModule} from '../search-2026-10-30/harness.mjs';
const {readSearchCriteria}=loadSearchModule('app/lib/search/criteria.ts');
const {resultFeatureBadges}=loadSearchModule('app/lib/feature-badges.ts');
const output=process.argv[2];
if(!output)throw Error('Ausgabepfad für den Live-Prüfbericht fehlt.');
const records=new Array(wildCases.length);let next=0;
async function worker(){
 while(next<wildCases.length){
  const index=next++,item=wildCases[index],record={id:item.id,query:item.query,ok:false};records[index]=record;
  try{
   const parsed=await parseSearch(item.query,{aiStatus:503});
   if(item.error){assert.equal(parsed.url,undefined);assert.match(parsed.messages.join(' '),item.error);record.status='validation_rejected';record.message=parsed.messages.at(-1);record.ok=true;continue;}
   assert.ok(parsed.url,parsed.messages.join(' '));const params=new URL(parsed.url,'https://test.invalid').searchParams;params.set('page_size','100');
   const c=readSearchCriteria(params);
   const response=await fetch(`https://www.ludigo-travel.com/api/accommodations?${params}`,{headers:{accept:'application/json'},signal:AbortSignal.timeout(30000)});
   record.httpStatus=response.status;assert.ok(response.ok,`HTTP ${response.status}`);const data=await response.json();
   assert.ok(Array.isArray(data.accommodations));record.total=data.total;record.loaded=data.accommodations.length;record.warnings=data.warnings??[];record.missingFeatures=data.missing_features??[];
   for(const row of data.accommodations){
    if(c.type)assert.equal(row.accommodation_type,c.type);
    for(const key of c.hard)assert.equal(row.feature_states?.[key],true,`Pflichtmerkmal ${key}`);
    for(const key of c.excluded)assert.equal(row.feature_states?.[key],false,`Ausschluss ${key}`);
    for(const key of ['city','country','region'])if(params.has(key))assert.equal(row[key]?.toLocaleLowerCase('de-DE'),params.get(key).toLocaleLowerCase('de-DE'),key);
    assert.ok(resultFeatureBadges(row,params.toString()).length<=5);
    if(params.has('max_guests'))assert.ok(row.max_guests>=Number(params.get('max_guests')));
    if(params.has('max_price_per_night'))assert.ok(row.price_min!==null&&row.price_min<=Number(params.get('max_price_per_night')));
    if(params.has('min_price_per_night'))assert.ok(row.price_min!==null&&row.price_min>=Number(params.get('min_price_per_night')));
   }
   if(['W01','W02'].includes(item.id))assert.ok(data.total>0,'Die gemeldete Meer-Suche bleibt leer.');
   record.status=data.total?'matches':'no_matching_data';record.ok=true;
  }catch(error){record.status='failed';record.error=error.message;}
  finally{if((index+1)%10===0)console.log(`${index+1}/50 geprüft`);}
 }
}
await Promise.all([worker(),worker(),worker()]);
const summary={date:new Date().toISOString(),endpoint:'https://www.ludigo-travel.com/api/accommodations',combinations:records.length,httpRequests:records.filter(r=>r.httpStatus!==undefined).length,passed:records.filter(r=>r.ok).length,failed:records.filter(r=>!r.ok).length,withMatches:records.filter(r=>r.status==='matches').length,withoutMatchingData:records.filter(r=>r.status==='no_matching_data').length,expectedRejections:records.filter(r=>r.status==='validation_rejected').length};
fs.writeFileSync(output,JSON.stringify({summary,cases:records},null,2)+'\n');console.log(JSON.stringify(summary));if(summary.failed)process.exitCode=1;
