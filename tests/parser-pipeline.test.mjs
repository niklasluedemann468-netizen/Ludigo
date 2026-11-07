import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {parseSearch,queryAccommodations,loadSearchModule,root} from '../audits/search-2026-10-30/harness.mjs';
import {parserCases,parserTables} from '../audits/search-2026-11-07/parser-cases.mjs';
const {readSearchCriteria}=loadSearchModule('app/lib/search/criteria.ts');
const {resultFeatureBadges}=loadSearchModule('app/lib/feature-badges.ts');
const records=[];
const files=['cityParser.ts','dbFeatureMapper.ts','extendedSearchParser.ts','hotelStarsParser.ts','luxuryParser.ts','natureParser.ts','parserUtils.ts','preferenceParser.ts','romanceParser.ts','searchParamCleanup.ts','securityParser.ts','sustainabilityParser.ts'];

for(const item of parserCases)test(`${item.id}: ${item.query}`,async()=>{
 const record={id:item.id,query:item.query,primaryFile:item.file,expectedNames:item.names,passed:false};
 try{
  const parsed=await parseSearch(item.query,{aiStatus:503,traceParsers:true});record.trace=parsed.parserTrace;record.params=parsed.params;assert.ok(parsed.url,parsed.messages.join(' '));
  const p=new URL(parsed.url,'https://test.invalid').searchParams,c=readSearchCriteria(p);
  for(const key of item.hard??[])assert.ok(c.hard.includes(key),`Pflichtfilter fehlt: ${key}`);
  for(const key of item.preferred??[]){assert.ok(c.preferred.includes(key),`Wunsch fehlt: ${key}`);assert.ok(!c.hard.includes(key));}
  for(const key of item.excluded??[])assert.ok(c.excluded.includes(key),`Ausschluss fehlt: ${key}`);
  for(const [key,value] of Object.entries(item.values??{}))assert.equal(p.get(key),value);
  for(const file of files)assert.ok(Object.values(parsed.parserTrace[file]?.functions??{}).some(count=>count>0),`${file} wurde nicht ausgeführt`);
  const result=await queryAccommodations(p.toString(),parserTables);assert.equal(result.status,200);record.actualNames=result.body.accommodations.map(row=>row.name).sort();assert.deepEqual(record.actualNames,item.names);
  assert.equal(result.body.total,item.names.length);assert.equal(result.body.next_page,null);
  for(const row of result.body.accommodations)assert.ok(resultFeatureBadges(row,p.toString()).length<=5);
  record.passed=true;
 }catch(error){record.failure=error.message;throw error;}finally{records.push(record);}
});

for(const source of ['own','camping','expedia'])for(const feature of ['reception_24h','wine_cellar'])test(`${source}: structured proof of ${feature} reaches the shared filter`,async()=>{
 const row={id:11,name:'Bestätigtes Objekt',is_active:true,accommodation_type:'hotel',affiliate_url:'https://example.com/offer',amenities:{[feature]:true}};
 const tables={accommodations:[],camping_info_campsites:[],expedia_accommodations:[],[({own:'accommodations',camping:'camping_info_campsites',expedia:'expedia_accommodations'})[source]]:[row]};
 const result=await queryAccommodations(`feature=${feature}`,tables);assert.equal(result.status,200);assert.equal(result.body.total,1);assert.equal(result.body.accommodations[0].feature_states[feature],true);
});

test('A concrete recognised feature with no evidence remains zero among 1501 objects',async()=>{
 const result=await queryAccommodations('feature=private_cinema',{accommodations:Array.from({length:1501},(_,i)=>({id:i+1,name:`Objekt ${i}`,is_active:true,description:'private_cinema; privates Kino'}))});
 assert.equal(result.body.total,0);assert.deepEqual(result.body.accommodations,[]);assert.equal(result.body.next_page,null);
});
test('Unknown structured features retain conflicting evidence instead of becoming true',async()=>{
 const result=await queryAccommodations('feature=wine_cellar',{accommodations:[{id:1,name:'Widersprüchlich',is_active:true,wine_cellar:true,amenities:{wine_cellar:false}}]});assert.equal(result.body.total,0);
});
test('A fully equipped card still displays at most five confirmed badges',async()=>{
 const result=await queryAccommodations('city=Berlin',parserTables);const row=result.body.accommodations.find(row=>row.name==='A');const badges=resultFeatureBadges(row);assert.equal(badges.length,5);for(const badge of badges)assert.equal(row.feature_states[badge.key],true);
});
test('The shared helper matches complete words and separates place names from criteria',()=>{
 const {containsAnyWholeTerm}=loadSearchModule('app/lib/parsers/parserUtils.ts');assert.equal(containsAnyWholeTerm('Hotel mit Wallbox,',['wallbox']),true);assert.equal(containsAnyWholeTerm('Hotel in Safenwil',['safe']),false);assert.equal(containsAnyWholeTerm('Hotel in Bad Doberan',['bad']),true);
});
test('Location qualifiers stop before criteria and preserve real multipart town names',()=>{
 const {placeIntent}=loadSearchModule('app/lib/search/destinations.ts');
 for(const [query,expected] of [['Hotel in Berlin in der Altstadt','Berlin'],['Hotel in Berlin zwischen 3 und 4 Sternen','Berlin'],['Hotel in Berlin Solarstrom wäre schön','Berlin'],['Hotel in Neustadt in Holstein mit Wallbox','Neustadt in Holstein'],['Hotel in Königstein in der Sächsischen Schweiz mit Wallbox','Königstein in der Sächsischen Schweiz']])assert.equal(placeIntent(query),expected,query);
});

test.after(()=>{
 const hash=createHash('sha256'),visit=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?visit(path.join(dir,e.name)):[path.join(dir,e.name)]);
 for(const file of visit(path.join(root,'app')).filter(file=>/\.(ts|tsx|json)$/.test(file)).sort()){hash.update(path.relative(root,file));hash.update(fs.readFileSync(file));}
 const coverage=Object.fromEntries(files.map(file=>[file,{executedCases:records.filter(row=>Object.values(row.trace?.[file]?.functions??{}).some(n=>n>0)).map(row=>row.id),functions:[...new Set(records.flatMap(row=>Object.keys(row.trace?.[file]?.functions??{})))]}]));
 const summary={date:new Date().toISOString(),sourceCommit:execFileSync('git',['rev-parse','HEAD'],{cwd:root}).toString().trim(),appSourceSha256:hash.digest('hex'),cases:records.length,passed:records.filter(row=>row.passed).length,failed:records.filter(row=>!row.passed).length,files:files.length,executedFiles:Object.values(coverage).filter(row=>row.executedCases.length).length};
 fs.writeFileSync(path.join(root,'audits/search-2026-11-07/parser-results.json'),JSON.stringify({summary,coverage,cases:records},null,2)+'\n');
});
