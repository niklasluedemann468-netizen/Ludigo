import { readSearchCriteria } from './search/criteria';
import { featurePresentation, searchCriteriaBadges } from './feature-badges';

export const bookingAffiliateUrl = 'https://www.jdoqocy.com/click-101892570-17319656?sid=';

// Verified against Booking's visible search controls on 2026-11-14.
// Only direct equivalents belong here. Preferences and exclusions stay manual.
const bookingFeatures: Record<string, string> = {
  pool: 'hotelfacility=433', wifi: 'hotelfacility=107', parking: 'hotelfacility=2',
  spa: 'hotelfacility=54', restaurant: 'hotelfacility=3', reception_24h: 'hotelfacility=8',
  ev_charging: 'hotelfacility=182', room_service: 'hotelfacility=5',
  kitchen: 'roomfacility=999', air_conditioning: 'roomfacility=11',
  private_bathroom: 'roomfacility=38', balcony: 'roomfacility=17',
  private_pool: 'roomfacility=93', breakfast_included: 'mealplan=1',
};
const bookingTypes: Record<string, string> = { hotel: 'ht_id=204', holiday_apartment: 'ht_id=201', holiday_home: 'ht_id=220' };

export type BookingParty = { adults: number; children: number; babies: number };
export type BookingSearch = { href: string; transferred: string[]; manual: string[]; hasSearch: boolean };

export function bookingSearch(criteria: string, party: BookingParty): BookingSearch {
  const fallback: BookingSearch = { href: bookingAffiliateUrl, transferred: [], manual: [], hasSearch: false };
  if (!criteria) return fallback;
  try {
    const c = readSearchCriteria(new URLSearchParams(criteria));
    const badges = searchCriteriaBadges(criteria);
    const destination = [c.params.get('city'), c.params.get('region'), c.params.get('country')]
      .filter((part, index, all) => part && all.indexOf(part) === index).join(', ');
    if (!destination) return { ...fallback, manual: badges.map(b => b.label) };
    const target = new URL('https://www.booking.com/searchresults.de.html');
    target.searchParams.set('ss', destination);
    target.searchParams.set('selected_currency', c.params.get('currency') ?? 'EUR');
    const transferredKeys = new Set(['destination']);
    const filters = new Set<string>();
    const manual: string[] = [];
    const start = c.params.get('check_in'), end = c.params.get('check_out');
    const today = new Date().toISOString().slice(0, 10);
    if (start && end && start >= today) {
      target.searchParams.set('checkin', start);
      target.searchParams.set('checkout', end);
      transferredKeys.add('dates');
    }
    // No child ages are collected by LÜDIGO. Never invent ages or turn children into adults.
    const total = party.adults + party.children + party.babies;
    const requested = c.number('max_guests') ?? c.number('guests');
    if (!party.children && !party.babies && Number.isInteger(party.adults) && party.adults >= 1 && party.adults <= 30 && (requested === null || requested === total)) {
      target.searchParams.set('group_adults', String(party.adults));
      target.searchParams.set('group_children', '0');
      transferredKeys.add(c.params.has('max_guests') ? 'max_guests' : 'guests');
    } else {
      manual.push('Personenzahl, Kinderalter und Zimmeraufteilung bei Booking.com ergänzen.');
    }
    if (c.type && bookingTypes[c.type]) { filters.add(bookingTypes[c.type]); transferredKeys.add('type'); }
    for (const feature of c.hard) {
      if (bookingFeatures[feature]) {
        filters.add(bookingFeatures[feature]);
        transferredKeys.add(`required-${feature}`);
      }
    }
    const exact = c.number('hotel_stars'), min = c.number('min_hotel_stars'), max = c.number('max_hotel_stars');
    if (exact !== null || min !== null || max !== null) {
      for (let stars = 1; stars <= 5; stars++) {
        if ((exact === null || stars === exact) && (min === null || stars >= min) && (max === null || stars <= max)) filters.add(`class=${stars}`);
      }
      transferredKeys.add('stars');
    }
    if (filters.size) target.searchParams.set('nflt', [...filters].join(';'));
    const href = new URL(bookingAffiliateUrl);
    href.searchParams.set('sid', 'ludigo_search');
    href.searchParams.set('url', target.toString());
    for (const badge of badges) if (!transferredKeys.has(badge.key)) manual.push(badge.label);
    for (const [kind, features] of [['required', c.hard], ['preferred', c.preferred], ['excluded', c.excluded]] as const) {
      for (const feature of features) {
        if (!featurePresentation[feature] && !transferredKeys.has(`${kind}-${feature}`)) manual.push(`${kind === 'excluded' ? 'Ohne: ' : kind === 'preferred' ? 'Wunsch: ' : ''}${feature.replaceAll('_', ' ')}`);
      }
    }
    for (const type of c.excludedTypes) manual.push(`Ausgeschlossene Unterkunftsart: ${type.replaceAll('_', ' ')}`);
    return {
      href: href.toString(), hasSearch: true,
      transferred: badges.filter(b => transferredKeys.has(b.key)).map(b => b.label),
      manual: [...new Set(manual)],
    };
  } catch { return fallback; }
}
