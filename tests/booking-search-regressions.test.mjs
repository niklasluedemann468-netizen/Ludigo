import test from 'node:test';
import assert from 'node:assert/strict';
import {parseSearch,queryAccommodations,loadSearchModule} from '../audits/search-2026-10-30/harness.mjs';
const {bookingSearch,bookingAffiliateUrl}=loadSearchModule('app/lib/booking-search.ts');
const {readSearchCriteria}=loadSearchModule('app/lib/search/criteria.ts');
const {searchCriteriaBadges}=loadSearchModule('app/lib/feature-badges.ts');
const party={adults:2,children:0,babies:0};
const base='city=Berlin&country=Deutschland&type=hotel&guests=2&check_in=2027-07-01&check_out=2027-07-08';
const target=result=>new URL(new URL(result.href).searchParams.get('url'));

for(const place of ['Spanien','Spanien mit Küche','Spanien ohne Pool','Spanien mit WLAN'])test(`Spain must not request a spa: ${place}`,async()=>{
  const parsed=await parseSearch(`Ferienwohnung in ${place}`,{aiStatus:503});
  assert.ok(parsed.url);const c=readSearchCriteria(new URLSearchParams(new URL(parsed.url,'https://test.invalid').search));
  assert.equal(c.params.get('country'),'Spanien');assert.ok(!c.hard.includes('spa'));assert.ok(!c.excluded.includes('spa'));
});
for(const place of ['Hamburg','Augsburg','Regensburg'])test(`City name does not request a castle: ${place}`,async()=>{
  const parsed=await parseSearch(`Hotel in ${place} mit Parkplatz`,{aiStatus:503});
  assert.ok(!parsed.beforeCleanup?.includes('historic_castle'));
  assert.ok(!parsed.messages.some(message=>message.includes('besondere Wünsche')));
});
for(const query of ['Hotel in Berlin mit Spa','Hotel in Berlin mit Spabereich','Hotel in Berlin mit Spa Bereich'])test(`Actual spa requirements remain: ${query}`,async()=>{
  const parsed=await parseSearch(query,{aiStatus:503});assert.ok(parsed.params.feature?.includes('spa'));
});
test('A genuine castle request remains recognised',async()=>{
  const parsed=await parseSearch('Übernachten in einer Burg in Berlin',{aiStatus:503});assert.ok(parsed.beforeCleanup?.includes('historic_castle'));
});
for(const query of ['Hotel in Berlin mit 5 Sternen','Hotel in Berlin zwischen 4 und 5 Sternen','Hotel in Berlin mit Pool und WLAN zwischen 4 und 5 Sternen'])test(`Resolved stars do not trigger an unsupported-wish warning: ${query}`,async()=>{
  const parsed=await parseSearch(query,{aiStatus:503});assert.ok(parsed.url);assert.ok(!parsed.messages.some(message=>message.includes('besondere Wünsche')));
  assert.ok(['hotel_stars','min_hotel_stars','max_hotel_stars'].some(key=>parsed.params[key]));
});
test('Booking keeps CJ attribution and forwards only the resolved destination and dates',()=>{
  const result=bookingSearch(base,party),cj=new URL(result.href),booking=target(result);
  assert.equal(cj.hostname,'www.jdoqocy.com');assert.equal(cj.pathname,'/click-101892570-17319656');assert.equal(cj.searchParams.get('sid'),'ludigo_search');
  assert.equal(booking.origin,'https://www.booking.com');assert.equal(booking.searchParams.get('ss'),'Berlin, Deutschland');assert.equal(booking.searchParams.get('checkin'),'2027-07-01');assert.equal(booking.searchParams.get('checkout'),'2027-07-08');
  assert.equal(booking.searchParams.get('group_adults'),'2');assert.equal(booking.searchParams.get('group_children'),'0');assert.equal(booking.searchParams.get('selected_currency'),'EUR');
});
for(const [feature,filter] of Object.entries({pool:'hotelfacility=433',wifi:'hotelfacility=107',parking:'hotelfacility=2',spa:'hotelfacility=54',restaurant:'hotelfacility=3',reception_24h:'hotelfacility=8',ev_charging:'hotelfacility=182',room_service:'hotelfacility=5',kitchen:'roomfacility=999',air_conditioning:'roomfacility=11',private_bathroom:'roomfacility=38',balcony:'roomfacility=17',private_pool:'roomfacility=93',breakfast_included:'mealplan=1'}))test(`Booking supports explicit ${feature} requirements`,()=>{
  const result=bookingSearch(`${base}&feature=${feature}`,party);assert.ok(target(result).searchParams.get('nflt').split(';').includes(filter));assert.ok(result.transferred.length>0);
});
test('Preferences do not silently become mandatory Booking filters',()=>{
  const result=bookingSearch(`${base}&feature=wifi&preferred_feature=wifi&feature=pool`,party),filters=target(result).searchParams.get('nflt');
  assert.ok(!filters.includes('hotelfacility=107'));assert.ok(filters.includes('hotelfacility=433'));assert.ok(result.manual.includes('WLAN · Wunsch'));
});
test('Dogs, accessibility, exclusions, budget and review requirements remain visible and manual',()=>{
  const result=bookingSearch(`${base}&feature=dogs_allowed&feature=accessible&exclude_feature=pool&max_price_per_night=150&min_review_score=8`,party),filters=target(result).searchParams.get('nflt');
  assert.equal(filters,'ht_id=204');
  for(const text of ['Hunde erlaubt','Barrierefrei','Ohne: Pool','Bis 150','Bewertung ab 8'])assert.ok(result.manual.some(value=>value.includes(text)),text);
});
test('Four-to-five-star Booking selection uses the same bounds as LÜDIGO',()=>{
  const result=bookingSearch(`${base}&min_hotel_stars=4&max_hotel_stars=5`,party);assert.equal(target(result).searchParams.get('nflt'),'ht_id=204;class=4;class=5');assert.ok(result.transferred.includes('4–5 Sterne'));
});
test('Legacy price and total-budget keys are also disclosed as manual filters',()=>{
  const result=bookingSearch(`${base}&min_price=50&max_price=100&total_budget=700`,party);
  for(const text of ['Ab 50','Bis 100','Gesamt bis 700'])assert.ok(result.manual.some(value=>value.includes(text)),text);
});
test('Apartment searches retain property type rather than turning into hotels',()=>{
  const result=bookingSearch(base.replace('type=hotel','type=holiday_apartment'),party);assert.equal(target(result).searchParams.get('nflt'),'ht_id=201');
});
test('Unknown child ages and counts from free text are never invented',()=>{
  for(const [criteria,group] of [[base,{adults:2,children:1,babies:1}],[`${base}&max_guests=4`,party]]){
    const result=bookingSearch(criteria,group),p=target(result).searchParams;assert.ok(!p.has('group_adults'));assert.ok(!p.has('age'));assert.ok(result.manual.some(value=>value.includes('Kinderalter')));
  }
});
test('No location, invalid criteria and stale criteria use a safe general link',()=>{
  for(const criteria of ['', 'redirect=https://evil.invalid','city=Berlin&check_in=2027-07-08&check_out=2027-07-01'])assert.equal(bookingSearch(criteria,party).href,bookingAffiliateUrl);
  const unlocated=bookingSearch('feature=pool',party);assert.equal(unlocated.href,bookingAffiliateUrl);assert.ok(unlocated.manual.includes('Pool'));
  const past=bookingSearch('city=Berlin&check_in=2020-01-01&check_out=2020-01-02',party);assert.ok(!target(past).searchParams.has('checkin'));assert.ok(past.manual.some(value=>value.includes('2020')));
});
test('Search summaries expose stars, guest capacity, dates and destination',()=>{
  const badges=searchCriteriaBadges(`${base}&max_guests=4&min_hotel_stars=4`);
  for(const text of ['Berlin, Deutschland','Hotel','Platz für 4 Personen','Mindestens 4 Sterne','01.07.2027 – 08.07.2027'])assert.ok(badges.some(b=>b.label===text),text);
});
test('Spain kitchen search filters real source facts and admits no unproven amenities',async()=>{
  const parsed=await parseSearch('Ferienwohnung in Spanien mit Küche',{aiStatus:503});assert.ok(parsed.url);
  const rows=[{id:1,name:'Küche bestätigt',country:'Spanien',accommodation_type:'holiday_apartment',is_active:true,kitchen:true},{id:2,name:'Unbekannt',country:'Spanien',accommodation_type:'holiday_apartment',is_active:true},{id:3,name:'Falsches Land',country:'Italien',accommodation_type:'holiday_apartment',is_active:true,kitchen:true}];
  const result=await queryAccommodations(new URL(parsed.url,'https://test.invalid').searchParams.toString(),{accommodations:rows});assert.equal(result.status,200);assert.deepEqual(result.body.accommodations.map(row=>row.name),['Küche bestätigt']);
});
