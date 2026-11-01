import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {combinationCases} from './criteria-cases.mjs';
import {parseSearch,loadSearchModule,root} from '../search-2026-10-30/harness.mjs';
const {readSearchCriteria}=loadSearchModule('app/lib/search/criteria.ts');
const {resultFeatureBadges,searchCriteriaBadges}=loadSearchModule('app/lib/feature-badges.ts');
const output=process.argv[2];if(!output)throw Error('Ausgabepfad für den Live-Prüfbericht fehlt.');
const records=new Array(combinationCases.length);let next=0;
async function worker(){while(next<combinationCases.length){
 const index=next++,item=combinationCases[index],record={id:item.id,query:item.query,ok:false};records[index]=record;
 try{
  const parsed=await parseSearch(item.query,{aiStatus:503});assert.ok(parsed.url,parsed.messages.join(' '));
  const params=new URL(parsed.url,'https://test.invalid').searchParams;params.set('page_size','100');const c=readSearchCriteria(params);record.params=Object.fromEntries([...new Set(params.keys())].map(key=>[key,params.getAll(key)]));
  assert.equal(c.type,item.type);for(const key of item.hard)assert.ok(c.hard.includes(key),`Pflichtfilter ${key}`);for(const key of item.preferred){assert.ok(c.preferred.includes(key));assert.ok(!c.hard.includes(key));}for(const key of item.excluded)assert.ok(c.excluded.includes(key));for(const [key,value] of Object.entries(item.values))assert.equal(params.get(key),value,key);
  if(params.has('max_price_per_night'))assert.ok(searchCriteriaBadges(params.toString()).some(b=>b.label==='Bis 40 € / Nacht'));
  const response=await fetch(`https://www.ludigo-travel.com/api/accommodations?${params}`,{headers:{accept:'application/json'},signal:AbortSignal.timeout(30000)});record.httpStatus=response.status;assert.ok(response.ok,`HTTP ${response.status}`);const data=await response.json();assert.ok(Array.isArray(data.accommodations));
  record.total=data.total;record.loaded=data.accommodations.length;record.warnings=data.warnings??[];record.missingFeatures=data.missing_features??[];
  for(const row of data.accommodations){
   if(c.type)assert.equal(row.accommodation_type,c.type);for(const key of c.hard)assert.equal(row.feature_states?.[key],true,key);for(const key of c.excluded)assert.equal(row.feature_states?.[key],false,key);
   for(const key of ['city','country','region'])if(params.has(key))assert.equal(row[key]?.toLocaleLowerCase('de-DE'),params.get(key).toLocaleLowerCase('de-DE'),key);
   if(params.has('max_price_per_night')){assert.ok(row.price_min!==null&&row.price_min<=Number(params.get('max_price_per_night')));assert.equal(row.currency,params.get('currency')??'EUR');}
   if(params.has('max_guests'))assert.ok(row.max_guests>=Number(params.get('max_guests')));assert.ok(resultFeatureBadges(row,params.toString()).length<=5);
  }
  record.status=data.total?'matches':'no_matching_data';record.ok=true;
 }catch(error){record.status='failed';record.error=error.message;}
 finally{if((index+1)%10===0)console.log(`${index+1}/100 geprüft`);}
}}
await Promise.all([worker(),worker(),worker()]);
const summary={date:new Date().toISOString(),sourceCommit:execFileSync('git',['rev-parse','HEAD'],{cwd:root}).toString().trim(),endpoint:'https://www.ludigo-travel.com/api/accommodations',combinations:records.length,httpRequests:records.filter(r=>r.httpStatus!==undefined).length,technicalPassed:records.filter(r=>r.ok).length,technicalFailed:records.filter(r=>!r.ok).length,withMatches:records.filter(r=>r.status==='matches').length,withoutMatchingData:records.filter(r=>r.status==='no_matching_data').length};
fs.writeFileSync(output,JSON.stringify({summary,cases:records},null,2)+'\n');console.log(JSON.stringify(summary));if(summary.technicalFailed)process.exitCode=1;
