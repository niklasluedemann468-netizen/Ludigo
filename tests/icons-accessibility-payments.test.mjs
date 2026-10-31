import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseSearch, queryAccommodations, loadSearchModule } from '../audits/search-2026-10-30/harness.mjs';
const { resultFeatureBadges, searchCriteriaBadges, featurePresentation } = loadSearchModule('app/lib/feature-badges.ts');
const { knownFeatures } = loadSearchModule('app/lib/search/catalog.ts');
const { canonicalFeature } = loadSearchModule('app/lib/search/features.ts');
const { readPaymentOffers, stripePaymentUrl } = loadSearchModule('app/lib/travel-payments.ts');
const features = r => r.params.feature ?? [];
const params = r => new URL(r.url, 'https://test.invalid').searchParams;

for (const [suffix, expected, unwanted] of [
  ['barrierefrei', 'accessible', 'wheelchair_accessible'],
  ['rollstuhlgerecht', 'wheelchair_accessible', 'accessible_bathroom'],
  ['mit barrierefreiem Bad', 'accessible_bathroom', 'accessible'],
  ['mit rollstuhlgerechtem Bad', 'accessible_bathroom', 'wheelchair_accessible'],
  ['mit stufenlosem Zugang', 'step_free_access', 'accessible'],
  ['mit bodengleicher Dusche', 'roll_in_shower', 'step_free_access'],
  ['mit ebenerdiger Dusche', 'roll_in_shower', 'step_free_access'],
  ['mit Rollstuhlverleih', 'wheelchair_available', 'wheelchair_accessible'],
  ['mit Behindertenparkplatz', 'accessible_parking', 'accessible'],
  ['mit breiten Türen', 'wide_doors', 'wheelchair_accessible'],
  ['mit Duschsitz', 'shower_seat', 'accessible'],
  ['ohne Barrieren', 'accessible', 'wheelchair_accessible'],
  ['in Wassernähe', 'near_water', 'near_sea'],
  ['am Wasser', 'near_water', 'near_sea'],
  ['am Fluss', 'near_river', 'near_lake'],
  ['direkt am Strand', 'beachfront', 'near_sea'],
  ['mit Fahrradverleih', 'bike_rental', 'cycling'],
]) test(`Searchbox preserves scoped requirement: ${suffix}`, async () => {
  const r = await parseSearch(`Hotel in Berlin ${suffix}`, { aiStatus: 503 });
  assert.ok(r.url, r.messages.join(' ')); assert.equal(params(r).get('city'), 'Berlin');
  assert.ok(features(r).includes(expected), JSON.stringify(r.params));
  assert.ok(!features(r).includes(unwanted), JSON.stringify(r.params));
});

test('Specific optional accessibility and water wishes do not become mandatory parent requirements', async () => {
  for (const [phrase, feature] of [['barrierefrei', 'accessible'], ['mit bodengleicher Dusche', 'roll_in_shower'], ['direkt am Strand', 'beachfront']]) {
    const r = await parseSearch(`Hotel in Berlin ${phrase} wäre schön`, { aiStatus: 503 });
    assert.ok(params(r).getAll('preferred_feature').includes(feature));
    const { readSearchCriteria } = loadSearchModule('app/lib/search/criteria.ts');
    assert.equal(readSearchCriteria(params(r)).hard.length, 0);
  }
});
test('No elevator requests a confirmed absence; not necessary is not a hidden requirement', async () => {
  const r = await parseSearch('Hotel in Berlin ohne Aufzug', { aiStatus: 503 });
  assert.ok(params(r).getAll('exclude_feature').includes('elevator')); assert.ok(!features(r).includes('elevator'));
  for (const q of ['Hotel in Berlin Pool ist kein Muss', 'Hotel in Berlin barrierefrei nicht nötig']) {
    const parsed = await parseSearch(q, { aiStatus: 503 }); assert.ok(parsed.url); assert.equal(features(parsed).length, 0);
  }
});

const own = (id, name, fields = {}) => ({ id, name, is_active: true, city: 'Berlin', country: 'Deutschland', accommodation_type: 'hotel', ...fields });
const data = { accommodations: [own(1, 'Rollstuhl', { wheelchair_accessible: true }), own(2, 'Allgemein', { accessible: true }), own(3, 'Bad', { accessible_bathroom: true }), own(4, 'Unbekannt'), own(5, 'Nicht geeignet', { wheelchair_accessible: false, accessible: false })], features: [], accommodation_features: [], camping_info_campsites: [], expedia_accommodations: [] };
const names = response => response.body.accommodations.map(item => item.name).sort();
test('Real API distinguishes general access, wheelchair suitability and accessible bathrooms', async () => {
  assert.deepEqual(names(await queryAccommodations('feature=accessible', data)), ['Allgemein', 'Rollstuhl']);
  assert.deepEqual(names(await queryAccommodations('feature=wheelchair_accessible', data)), ['Rollstuhl']);
  assert.deepEqual(names(await queryAccommodations('feature=accessible_bathroom', data)), ['Bad']);
  assert.deepEqual(names(await queryAccommodations('exclude_feature=accessible', data)), ['Nicht geeignet']);
});
test('The complete Searchbox-to-API pipeline requires the actual requested accessibility detail', async () => {
  const r = await parseSearch('Hotel in Berlin mit barrierefreiem Bad', { aiStatus: 503 });
  assert.deepEqual(names(await queryAccommodations(params(r).toString(), data)), ['Bad']);
});
test('All sources expose confirmed specific badges even without requesting the feature', async () => {
  const r = await queryAccommodations('', { ...data, accommodations: [own(1, 'Eigene Unterkunft', { beachfront: true, roll_in_shower: true, has_wifi: false, wifi: true })], camping_info_campsites: [{ id: 2, name: 'Camping', near_water: true }], expedia_accommodations: [own(3, 'Partnerhotel', { affiliate_url: 'https://example.com/offer', sauna: true })] });
  const ownItem = r.body.accommodations.find(item => item.id === 1);
  assert.equal(ownItem.feature_states.beachfront, true); assert.equal(ownItem.feature_states.roll_in_shower, true);
  assert.equal(ownItem.feature_states.wifi, null); assert.ok(!resultFeatureBadges(ownItem).some(item => item.key === 'wifi'));
  assert.ok(r.body.accommodations.some(item => item.features.includes('near_water')));
  assert.ok(r.body.accommodations.some(item => item.features.includes('sauna')));
});
test('Water proximity accepts confirmed sea, lake, beach or river, without inventing a sea', async () => {
  const r = await queryAccommodations('feature=near_water', { ...data, accommodations: [own(1, 'Meer', { near_sea: true }), own(2, 'Fluss', { near_river: true }), own(3, 'Unbekannt')] });
  assert.deepEqual(names(r), ['Fluss', 'Meer']);
  assert.equal(r.body.accommodations.find(item => item.name === 'Fluss').feature_states.near_sea, null);
});
test('Icons cover every validated criterion and confirmed facts override stale fields', () => {
  for (const key of knownFeatures) assert.ok(featurePresentation[canonicalFeature(key)], key);
  const item = { id: 1, name: 'Hotel', accessible: true, features: ['accessible'], feature_states: { accessible: null, beachfront: true, private_pool: true, pool: true } };
  const badges = resultFeatureBadges(item);
  assert.ok(badges.some(item => item.key === 'beachfront' && item.icon === 'beach'));
  assert.ok(badges.some(item => item.key === 'private_pool'));
  assert.ok(!badges.some(item => item.key === 'accessible' || item.key === 'pool'));
  const criteria = searchCriteriaBadges('feature=near_water&preferred_feature=near_water&exclude_feature=elevator');
  assert.ok(criteria.some(item => item.kind === 'preferred' && item.label.includes('Wunsch')));
  assert.ok(criteria.some(item => item.kind === 'excluded' && item.label.startsWith('Ohne:')));
});
test('Rendered cards show labelled icons and all icon references have a sprite definition', () => {
  const { IconSprite } = loadSearchModule('app/components/LudigoChrome.tsx');
  const sprite = renderToStaticMarkup(React.createElement(IconSprite));
  for (const { icon } of Object.values(featurePresentation)) assert.ok(sprite.includes(`id="${icon}"`), icon);
  const Component = loadSearchModule('app/components/AccommodationPage.tsx').default;
  const noop = () => {};
  const html = renderToStaticMarkup(React.createElement(Component, { results: [{ id: 1, name: 'Testunterkunft', feature_states: { beachfront: true, wheelchair_accessible: true, sauna: true } }], query: 'Am Strand', selectedType: null, searchCriteria: 'feature=beachfront', adults: 2, childrenCount: 0, babies: 0, checkIn: '2027-07-01', checkOut: '2027-07-08', onQueryChange: noop, onTypeChange: noop, onAdultsChange: noop, onChildrenChange: noop, onBabiesChange: noop, onCheckInChange: noop, onCheckOutChange: noop, onSubmit: noop, onListen: noop, message: '', isSearching: false, isListening: false }));
  assert.match(html, /href="#beach"/); assert.match(html, /Direkt am Strand/); assert.match(html, /Rollstuhlgerecht/); assert.match(html, /Sauna/);
  assert.match(html, /aria-describedby="search-hint search-status"/); assert.match(html, /aria-label="Erkannte Suchkriterien"/);
});

const offer = { id: 'bus-angebot', world: 'bus', title: 'Eigene Reise', description: 'Termin und Leistungen', url: 'https://buy.stripe.com/a1B2c3D4e5' };
test('Payment integration accepts real offer configurations for all three travel worlds', () => {
  const offers = readPaymentOffers(JSON.stringify(['bus', 'bike', 'surprise'].map(world => ({ ...offer, id: world, world }))));
  assert.equal(offers.length, 3); assert.ok(offers.every(item => item.url.startsWith('https://buy.stripe.com/')));
});
test('Payment integration rejects executable, spoofed or externally redirected links', () => {
  for (const url of ['javascript:alert(1)', 'http://buy.stripe.com/a1B2c3', 'https://buy.stripe.com.evil.example/a1B2c3', 'https://evil.example/a1B2c3', 'https://user:pass@buy.stripe.com/a1B2c3', 'https://buy.stripe.com:444/a1B2c3', 'https://buy.stripe.com/a1B2c3?redirect=https://evil.example', 'https://buy.stripe.com/a1B2c3#anything', 'https://buy.stripe.com/']) assert.equal(stripePaymentUrl(url), null, url);
});
test('Test payment offers require explicit test mode and carry a visible test flag', () => {
  const raw = JSON.stringify([{ ...offer, url: 'https://buy.stripe.com/test_a1B2c3' }]);
  assert.equal(readPaymentOffers(raw).length, 0);
  assert.equal(readPaymentOffers(raw, true)[0].test, true);
});
test('Missing, malformed, duplicate or incomplete payment configurations fail closed', () => {
  for (const raw of [undefined, 'invalid', '{}', JSON.stringify([{ ...offer, world: 'unknown' }]), JSON.stringify([{ ...offer, title: '' }]), JSON.stringify([{ ...offer, description: '' }])]) assert.equal(readPaymentOffers(raw).length, 0);
  assert.equal(readPaymentOffers(JSON.stringify([offer, offer])).length, 1);
});
test('The actual booking section filters its world and renders truthful empty and test states', () => {
  const render = (env, world) => {
    const Section = loadSearchModule('app/components/TravelBookingSection.tsx', { process: { env } }).default;
    return renderToStaticMarkup(React.createElement(Section, { world }));
  };
  const empty = render({}, 'bus'); assert.match(empty, /Neue Reisetermine/); assert.doesNotMatch(empty, /buy\.stripe\.com/);
  const raw = JSON.stringify([{ ...offer, title: 'Busangebot' }, { ...offer, id: 'bike', world: 'bike', title: 'Radangebot' }]);
  const html = render({ LUDIGO_TRAVEL_PAYMENT_LINKS: raw }, 'bus');
  assert.match(html, /Busangebot/); assert.doesNotMatch(html, /Radangebot/); assert.match(html, /Angebot und Zahlung öffnen/);
  const preview = render({ LUDIGO_TRAVEL_PAYMENT_LINKS: JSON.stringify([{ ...offer, url: 'https://buy.stripe.com/test_a1B2c3' }]), LUDIGO_PAYMENTS_TEST_MODE: 'true' }, 'bus');
  assert.match(preview, /keine echte Reisebuchung/); assert.match(preview, /Testzahlung öffnen/);
});
test('Favorites persist under the existing key and tolerate unavailable storage', () => {
  const stored = new Map(), events = [];
  const globals = { window: { dispatchEvent: event => events.push(event.type) }, Event: class { constructor(type) { this.type = type; } }, localStorage: { setItem: (key, value) => stored.set(key, value) } };
  const { writeFavorites } = loadSearchModule('app/lib/favorites-store.ts', globals);
  assert.equal(writeFavorites([{ id: 1, name: 'Favorit' }]), true); assert.equal(JSON.parse(stored.get('ludigo-favorites-v1'))[0].name, 'Favorit');
  globals.localStorage.setItem = () => { throw Error('Storage unavailable'); };
  assert.equal(writeFavorites([{ id: 2, name: 'Sitzungsfavorit' }]), false); assert.equal(events.length, 2);
});
test('Activating offers updates travel-world actions and removes contradictory planning-only statements', () => {
  const Page = loadSearchModule('app/components/TravelWorldPage.tsx', { process: { env: { LUDIGO_TRAVEL_PAYMENT_LINKS: JSON.stringify([offer]) } } }).default;
  const html = renderToStaticMarkup(React.createElement(Page, { world: 'bus' }));
  assert.match(html, /href="#buchen">Reiseangebote ansehen/);
  assert.match(html, /Ja\. Im Buchungsbereich/);
  assert.doesNotMatch(html, /Nein\. Bustouren für Senioren ist eine Reisewelt in Planung/);
});
