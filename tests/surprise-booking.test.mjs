import test from 'node:test';
import assert from 'node:assert/strict';
import {loadSearchModule} from '../audits/search-2026-10-30/harness.mjs';
const {surpriseBookingSearch}=loadSearchModule('app/lib/surprise-booking.ts');
const {bookingAffiliateUrl}=loadSearchModule('app/lib/booking-search.ts');
const request={departure:'Hamburg',startDate:'2027-07-01',endDate:'2027-07-08',travelers:4,budget:'1200',preferences:['Wellness','Natur']};

test('Surprise never substitutes the departure for the hidden destination',()=>{
  const r=surpriseBookingSearch(request);assert.equal(r.href,bookingAffiliateUrl);assert.equal(r.hasSearch,false);assert.ok(!r.href.includes('Hamburg'));
  assert.ok(r.manual.some(x=>x.includes('4 Personen')));assert.ok(r.manual.some(x=>x.includes('1200')||x.includes('1.200')));
});
test('An explicitly chosen destination uses the same affiliate search with the actual overnight dates',()=>{
  const r=surpriseBookingSearch(request,'Berlin'),cj=new URL(r.href),p=new URL(cj.searchParams.get('url')).searchParams;
  assert.equal(cj.pathname,'/click-101892570-17319656');assert.equal(p.get('ss'),'Berlin');assert.equal(p.get('checkin'),'2027-07-01');assert.equal(p.get('checkout'),'2027-07-08');
  assert.ok(!p.has('group_adults'));assert.ok(!p.has('group_children'));assert.ok(!p.has('age'));assert.ok(!r.href.includes('Hamburg'));
});
test('A whole-trip budget and themes are never fabricated as confirmed Booking filters',()=>{
  const r=surpriseBookingSearch(request,'Berlin'),p=new URL(new URL(r.href).searchParams.get('url')).searchParams;
  assert.ok(!p.has('nflt'));assert.ok(!p.has('price'));assert.ok(r.manual.some(x=>x.includes('Wellness, Natur')));assert.ok(r.manual.some(x=>x.includes('kein automatischer Unterkunftspreisfilter')));
});
test('A day trip never becomes an invalid zero-night booking search',()=>{
  const r=surpriseBookingSearch({...request,endDate:request.startDate},'Berlin'),p=new URL(new URL(r.href).searchParams.get('url')).searchParams;
  assert.ok(!p.has('checkin'));assert.ok(!p.has('checkout'));assert.ok(r.manual.some(x=>x.includes('mindestens einer Übernachtung')));
});
test('Invalid or absent destination keeps the safe general affiliate link',()=>{
  assert.equal(surpriseBookingSearch(null).href,bookingAffiliateUrl);
  assert.equal(surpriseBookingSearch(request,'a'.repeat(121)).href,bookingAffiliateUrl);
  assert.equal(surpriseBookingSearch(request,'Berlin\u0000').href,bookingAffiliateUrl);
});
