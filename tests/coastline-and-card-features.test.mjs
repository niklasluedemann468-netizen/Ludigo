import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {parse} from 'csv-parse/sync';
import {loadSearchModule,queryAccommodations,root} from '../audits/search-2026-10-30/harness.mjs';
const {resultFeatureBadges}=loadSearchModule('app/lib/feature-badges.ts');
const {nearbyCoastDistance}=loadSearchModule('app/lib/search/coast-distance.ts');
const {sourceFeatureFacts}=loadSearchModule('app/lib/search/source-features.ts');
const base={id:1,name:'Hotel',is_active:true,accommodation_type:'hotel'};
const tables=rows=>({accommodations:rows,features:[],accommodation_features:[],camping_info_campsites:[],expedia_accommodations:[]});

test('Each card shows at most five known features and promotes the actual search criteria',()=>{
 const item={id:1,name:'Hotel',features:['near_sea','near_beach','dogs_allowed','accessible','pool','wifi','parking','kitchen','sauna','gym']};
 const badges=resultFeatureBadges(item,'feature=sauna&feature=wifi');assert.equal(badges.length,5);assert.equal(badges[0].key,'wifi');assert.equal(badges[1].key,'sauna');
 assert.ok(badges.every(b=>item.features.includes(b.key)));
});
test('Cards without data explicitly show one information icon instead of guessed amenities',()=>{
 const Page=loadSearchModule('app/components/AccommodationPage.tsx').default,noop=()=>{};
 const html=renderToStaticMarkup(React.createElement(Page,{results:[base],query:'Hotel',selectedType:null,adults:2,childrenCount:0,babies:0,checkIn:'2027-07-01',checkOut:'2027-07-08',onQueryChange:noop,onTypeChange:noop,onAdultsChange:noop,onChildrenChange:noop,onBabiesChange:noop,onCheckInChange:noop,onCheckOutChange:noop,onSubmit:noop,onListen:noop,message:'',isSearching:false,isListening:false}));
 assert.match(html,/Ausstattung noch nicht hinterlegt/);assert.match(html,/href="#info"/);assert.doesNotMatch(html,/<span>Pool<\/span>/);
});
test('Structured provider amenities accept explicit aliases, labels and true/false values',()=>{
 const facts=sourceFeatureFacts({amenities:['Swimming Pool',{name:'WLAN',available:true},{key:'dogs_allowed',value:false}],facilities:{barrierefrei:'ja'},raw_data:{'Travel:facilities':'Sauna; Parkplatz'}});
 for(const key of ['pool','wifi','accessible','sauna','parking'])assert.equal(facts.get(key),true,key);
 assert.equal(facts.get('dogs_allowed'),false);
 assert.equal(sourceFeatureFacts({description:'Pool, WLAN, Hunde erlaubt'}).size,0);
 assert.equal(sourceFeatureFacts({amenities:['Pool in der Umgebung','Hotel mit WLAN eventuell']} ).size,0);
});
test('All providers use structured facts and conflicts remain unknown',async()=>{
 const data={...tables([{...base,amenities:['Pool','WLAN'],has_pool:false}]),camping_info_campsites:[{id:2,name:'Camp',amenities:'["Pool","WLAN"]'}],expedia_accommodations:[{...base,id:3,name:'Partner',amenities:{pool:true,wifi:true},affiliate_url:'https://example.invalid/offer'}]};
 const result=await queryAccommodations('feature=pool&feature=wifi',data);
 assert.deepEqual(result.body.accommodations.map(x=>x.name).sort(),['Camp','Partner']);
 const conflict=(await queryAccommodations('',data)).body.accommodations.find(x=>x.name==='Hotel');assert.equal(conflict.feature_states.pool,null);
});
test('Mapped coastline proximity recognises the real Rerik coordinate, not inland Meer names',()=>{
 assert.ok(nearbyCoastDistance(54.11308,11.631)<=1000);
 for(const p of [[52.49524,9.32387],[45.6,10.7],[52.52,13.405],['',11.63],[null,11.63],[90,0]])assert.equal(nearbyCoastDistance(...p),null);
});
test('The actual imported camping feed supplies coastal matches without fabricated facility flags',async()=>{
 const csv=parse(zlib.gunzipSync(fs.readFileSync(`${root}/app/scripts/44063-83063-de_DE-CIV2_Campsites_with_availabilities_DE.csv.gz`)),{columns:true,skip_empty_lines:true});
 const camping=csv.map((row,index)=>({id:index+1,name:row.product_name,latitude:row['Travel:latitude'],longitude:row['Travel:longitude'],rating:row.rating}));
 const result=await queryAccommodations('type=campsite&feature=near_sea&page_size=100',{...tables([]),camping_info_campsites:camping});
 assert.equal(result.body.total,207);assert.ok(result.body.accommodations.some(x=>x.name.includes('Rerik')));
 for(const item of result.body.accommodations){assert.equal(item.feature_states.near_sea,true);assert.ok(item.coast_distance_m<=1000);assert.ok(!item.features.includes('pool'));assert.ok(resultFeatureBadges(item).some(b=>b.label.includes('Küste ca.')));}
});
test('Explicit source data takes precedence over calculated map proximity',async()=>{
 const r=await queryAccommodations('feature=near_sea',tables([{...base,latitude:54.11308,longitude:11.631,near_sea:false}]));assert.equal(r.body.total,0);
});
test('Travel months retain unknown opening information without asserting availability',async()=>{
 const r=await queryAccommodations('month=7',tables([{...base},{...base,id:2,name:'Geschlossen',available_months:[1]}]));
 assert.deepEqual(r.body.accommodations.map(x=>x.name),['Hotel']);assert.equal(r.body.availability.status,'not_checked');
});
test('Missing requested facility data is named explicitly',async()=>{
 const r=await queryAccommodations('feature=pool',tables([base]));assert.equal(r.body.total,0);assert.ok(r.body.missing_features.includes('pool'));assert.ok(r.body.warnings.some(x=>x.includes('Pool')));
});
