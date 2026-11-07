import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {parserCases} from './parser-cases.mjs';
import {combinationCases} from '../search-2026-11-01/criteria-cases.mjs';
import {parseSearch,loadSearchModule,root} from '../search-2026-10-30/harness.mjs';
const {readSearchCriteria}=loadSearchModule('app/lib/search/criteria.ts');
const {resultFeatureBadges}=loadSearchModule('app/lib/feature-badges.ts');
const output=process.argv[2];if(!output)throw Error('Ausgabepfad fehlt.');
const cases=[...combinationCases,...parserCases.map(item=>({...item,type:'hotel'}))],records=new Array(cases.length);let next=0;
async function worker(){while(next<cases.length){
 const index=next++,item=cases[index],record={id:item.id,query:item.query,ok:false};records[index]=record;
 try{
  const parsed=await parseSearch(item.query,{aiStatus:503});assert.ok(parsed.url,parsed.messages.join(' '));
  const p=new URL(parsed.url,'https://test.invalid').searchParams;p.set('page_size','100');const c=readSearchCriteria(p);record.params=Object.fromEntries([...new Set(p.keys())].map(key=>[key,p.getAll(key)]));
  assert.equal(c.type,item.type??null);for(const key of item.hard??[])assert.ok(c.hard.includes(key),key);for(const key of item.preferred??[]){assert.ok(c.preferred.includes(key),key);assert.ok(!c.hard.includes(key),key);}for(const key of item.excluded??[])assert.ok(c.excluded.includes(key),key);for(const [key,value] of Object.entries(item.values??{}))assert.equal(p.get(key),value,key);
  const response=await fetch(`https://www.ludigo-travel.com/api/accommodations?${p}`,{headers:{accept:'application/json'},signal:AbortSignal.timeout(30000)});record.httpStatus=response.status;assert.ok(response.ok,`HTTP ${response.status}`);const data=await response.json();assert.ok(Array.isArray(data.accommodations));record.total=data.total;record.loaded=data.accommodations.length;record.warnings=data.warnings??[];
  for(const row of data.accommodations){
   if(c.type)assert.equal(row.accommodation_type,c.type);for(const key of c.hard)assert.equal(row.feature_states?.[key],true,key);for(const key of c.excluded)assert.equal(row.feature_states?.[key],false,key);
   for(const key of ['city','region','country'])if(p.has(key))assert.equal(row[key]?.toLocaleLowerCase('de-DE'),p.get(key).toLocaleLowerCase('de-DE'),key);
   if(p.has('max_price_per_night')){assert.ok(row.price_min!==null&&row.price_min<=Number(p.get('max_price_per_night')));assert.equal(row.currency,p.get('currency')??'EUR');}
   if(p.has('max_guests'))assert.ok(row.max_guests>=Number(p.get('max_guests')));
   if(p.has('min_hotel_stars'))assert.ok(row.hotel_stars>=Number(p.get('min_hotel_stars')));if(p.has('max_hotel_stars'))assert.ok(row.hotel_stars!==null&&row.hotel_stars<=Number(p.get('max_hotel_stars')));
   assert.ok(resultFeatureBadges(row,p.toString()).length<=5);
  }
  if(data.total===0){assert.equal(data.accommodations.length,0);assert.equal(data.next_page,null);}
  record.status=data.total?'matches':'no_matching_data';record.ok=true;
 }catch(error){record.status='failed';record.error=error.message;}
 finally{if((index+1)%10===0)console.log(`${index+1}/${cases.length} geprüft`);}
}}
await Promise.all([worker(),worker(),worker()]);
const summary={date:new Date().toISOString(),sourceCommit:execFileSync('git',['rev-parse','HEAD'],{cwd:root}).toString().trim(),endpoint:'https://www.ludigo-travel.com/api/accommodations',total:records.length,httpRequests:records.filter(row=>row.httpStatus!==undefined).length,passed:records.filter(row=>row.ok).length,failed:records.filter(row=>!row.ok).length,withMatches:records.filter(row=>row.status==='matches').length,withoutMatchingData:records.filter(row=>row.status==='no_matching_data').length};
fs.writeFileSync(output,JSON.stringify({summary,cases:records},null,2)+'\n');console.log(JSON.stringify(summary));if(summary.failed)process.exitCode=1;
