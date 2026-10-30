import test from 'node:test';
import assert from 'node:assert/strict';
import {displayPrice,readFavorites,safeOfferUrl,sortAccommodations,usableNumber} from '../app/lib/accommodation-view.ts';
const item=(id,extra={})=>({id,name:`Unterkunft ${id}`,...extra});
test('Unconfirmed partner feed values are never displayed as nightly prices',()=>{
 const price=displayPrice(item(1,{partner_price:17.5,currency:'EUR'}));
 assert.match(price.label,/Partners/);assert.match(price.note,/Preisbasis nicht bestätigt/);assert.doesNotMatch(price.label,/Nacht/);
});
test('Missing catalogue prices sort last in both directions, regardless of partner price',()=>{
 const input=[item(1,{partner_price:1}),item(2,{price_min:80}),item(3,{price_min:25}),item(4,{price_min:null})];
 assert.deepEqual(sortAccommodations(input,'price_asc').map(x=>x.id),[3,2,1,4]);
 assert.deepEqual(sortAccommodations(input,'price_desc').map(x=>x.id),[2,3,1,4]);
 assert.deepEqual(input.map(x=>x.id),[1,2,3,4]);
});
test('Server ranking is retained for best matches; missing ratings stay last',()=>{
 const input=[item(1),item(2,{review_score:4.5}),item(3,{review_score:3.2})];
 assert.deepEqual(sortAccommodations(input,'best'),input);
 assert.deepEqual(sortAccommodations(input,'rating').map(x=>x.id),[2,3,1]);
});
test('Invalid or absent numeric values are not treated as free offers',()=>{
 for(const value of [null,undefined,'', ' ',false,Infinity,NaN,-1])assert.equal(usableNumber(value),null);
 assert.equal(usableNumber(0),0);assert.equal(displayPrice(item(1)).value,null);
});
test('Affiliate links retain their destination; executable URLs are rejected',()=>{
 const url='https://www.awin1.com/pclick.php?p=45622913901&a=3108837&m=44063';
 assert.equal(safeOfferUrl(url),url);assert.equal(safeOfferUrl('javascript:alert(1)'),null);assert.equal(safeOfferUrl('/unknown'),null);
});
test('Saved favorites tolerate malformed storage and deduplicate by listing ID',()=>{
 assert.deepEqual(readFavorites('invalid'),[]);assert.deepEqual(readFavorites('{}'),[]);
 const favorites=readFavorites(JSON.stringify([item(-1),item(-1,{name:'Updated'}),{id:'bad',name:'bad'},{id:2},null]));
 assert.equal(favorites.length,1);assert.equal(favorites[0].name,'Updated');
});
