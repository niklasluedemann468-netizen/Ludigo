import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {wildCases,wildTables} from '../audits/search-2026-10-31/wild-cases.mjs';
import {parseSearch,queryAccommodations,loadSearchModule,root} from '../audits/search-2026-10-30/harness.mjs';
const {readSearchCriteria}=loadSearchModule('app/lib/search/criteria.ts');
const records=[];
assert.equal(wildCases.length,50);
for(const item of wildCases) test(`${item.id}: ${item.query}`,async()=>{
 const record={id:item.id,query:item.query,expectedNames:item.names??null,expectedValidationError:Boolean(item.error),passed:false};
 try {
  const parsed=await parseSearch(item.query,{aiStatus:503});record.params=parsed.params;
  if(item.error){assert.equal(parsed.url,undefined);assert.match(parsed.messages.join(' '),item.error);record.message=parsed.messages.at(-1);}
  else {
   assert.ok(parsed.url,parsed.messages.join(' '));
   const p=new URL(parsed.url,'https://test.invalid').searchParams,c=readSearchCriteria(p);
   for(const key of item.hard??[])assert.ok(c.hard.includes(key),`Pflichtfilter fehlt: ${key}`);
   for(const key of item.preferred??[]){assert.ok(c.preferred.includes(key),`Wunsch fehlt: ${key}`);assert.ok(!c.hard.includes(key),`Wunsch ist Pflicht: ${key}`);}
   for(const key of item.excluded??[])assert.ok(c.excluded.includes(key),`Ausschluss fehlt: ${key}`);
   for(const key of item.absent??[])assert.ok(!c.hard.includes(key),`Zusätzlicher Pflichtfilter: ${key}`);
   if(item.type)assert.equal(p.get('type'),item.type);
   for(const [key,value] of Object.entries(item.values??{}))assert.equal(p.get(key),value,key);
   const response=await queryAccommodations(p.toString(),wildTables);assert.equal(response.status,200);
   record.actualNames=response.body.accommodations.map(row=>row.name).sort();record.total=response.body.total;
   assert.deepEqual(record.actualNames,[...item.names].sort());
  }
  record.passed=true;
 }catch(error){record.failure=error.message;throw error;}finally{records.push(record);}
});
test.after(()=>{
 const hash=crypto.createHash('sha256');
 const visit=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?visit(path.join(dir,entry.name)):[path.join(dir,entry.name)]);
 for(const file of visit(path.join(root,'app')).filter(file=>/\.(ts|tsx|json)$/.test(file)).sort()){hash.update(path.relative(root,file));hash.update(fs.readFileSync(file));}
 const summary={date:'2026-10-31',sourceCommit:execFileSync('git',['rev-parse','HEAD'],{cwd:root}).toString().trim(),appSourceSha256:hash.digest('hex'),total:records.length,passed:records.filter(r=>r.passed).length,failed:records.filter(r=>!r.passed).length,method:'Wirkliche Searchbox → validierte Kriterien → wirkliche GET-Route; Datenbank/KI nur an externen Grenzen simuliert. 46 Ergebnisprüfungen und 4 erwartete Validierungsablehnungen.'};
 fs.writeFileSync(path.join(root,'audits/search-2026-10-31/wild-results.json'),JSON.stringify({summary,cases:records},null,2)+'\n');
});
