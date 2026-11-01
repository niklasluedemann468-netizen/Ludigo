import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {combinationCases,combinationTables} from '../audits/search-2026-11-01/criteria-cases.mjs';
import {parseSearch,queryAccommodations,loadSearchModule,root} from '../audits/search-2026-10-30/harness.mjs';
const {readSearchCriteria}=loadSearchModule('app/lib/search/criteria.ts');
const {searchCriteriaBadges}=loadSearchModule('app/lib/feature-badges.ts');
const records=[];
assert.equal(combinationCases.length,100);assert.equal(new Set(combinationCases.map(c=>c.query)).size,100);
for(const item of combinationCases)test(`${item.id}: ${item.query}`,async()=>{
 const record={id:item.id,query:item.query,expectedNames:item.names,passed:false};
 try{
  const parsed=await parseSearch(item.query,{aiStatus:503});record.params=parsed.params;assert.ok(parsed.url,parsed.messages.join(' '));
  const p=new URL(parsed.url,'https://test.invalid').searchParams,c=readSearchCriteria(p);
  assert.equal(c.type,item.type);
  for(const key of item.hard)assert.ok(c.hard.includes(key),`Pflichtfilter fehlt: ${key}`);
  for(const key of item.preferred){assert.ok(c.preferred.includes(key),`Wunsch fehlt: ${key}`);assert.ok(!c.hard.includes(key),`Wunsch wurde Pflicht: ${key}`);}
  for(const key of item.excluded)assert.ok(c.excluded.includes(key),`Ausschluss fehlt: ${key}`);
  for(const [key,value] of Object.entries(item.values))assert.equal(p.get(key),value,key);
  if(p.has('max_price_per_night'))assert.ok(searchCriteriaBadges(p.toString()).some(b=>b.label==='Bis 40 € / Nacht'),'Die erkannte Preisgrenze fehlt in der Oberfläche');
  if(item.id==='K023')assert.equal(parsed.aiCalls,0,'Lokal erkannte Meer-/Preiskriterien benötigen keinen KI-Aufruf');
  const response=await queryAccommodations(p.toString(),combinationTables);assert.equal(response.status,200);record.actualNames=response.body.accommodations.map(r=>r.name).sort();assert.deepEqual(record.actualNames,item.names);record.passed=true;
 }catch(error){record.failure=error.message;throw error;}finally{records.push(record);}
});
test.after(()=>{
 const hash=crypto.createHash('sha256');const visit=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?visit(path.join(dir,e.name)):[path.join(dir,e.name)]);
 for(const file of visit(path.join(root,'app')).filter(file=>/\.(ts|tsx|json)$/.test(file)).sort()){hash.update(path.relative(root,file));hash.update(fs.readFileSync(file));}
 const summary={date:'2026-11-01',sourceCommit:execFileSync('git',['rev-parse','HEAD'],{cwd:root}).toString().trim(),appSourceSha256:hash.digest('hex'),total:records.length,passed:records.filter(r=>r.passed).length,failed:records.filter(r=>!r.passed).length,method:'100 unterschiedliche Mehrfachanfragen: wirkliche Searchbox und GET-Route; nur Datenbank/KI an den externen Grenzen simuliert; unabhängige erwartete Ergebnismengen.'};
 fs.writeFileSync(path.join(root,'audits/search-2026-11-01/criteria-results.json'),JSON.stringify({summary,cases:records},null,2)+'\n');
});
