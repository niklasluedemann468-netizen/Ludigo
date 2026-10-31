import type { SearchResult } from './accommodation-types';
import { canonicalFeature, featureAncestors, featureValue } from './search/features';
import { readSearchCriteria } from './search/criteria';

export type FeatureBadge = { key: string; icon: string; label: string; kind?: 'required' | 'preferred' | 'excluded' };
const groups: [string, Record<string, string>][] = [
  ['beach', { near_sea: 'Meernähe', seafront: 'Direkt am Meer', near_beach: 'Strandnähe', beachfront: 'Direkt am Strand', near_water: 'Wassernähe', accessible_beach: 'Barrierefreier Strandzugang' }],
  ['lake', { near_lake: 'Seenähe', lakefront: 'Direkt am See' }],
  ['water', { near_river: 'Flussnähe', canoeing: 'Kanufahren', fishing: 'Angeln', diving: 'Tauchen', snorkeling: 'Schnorcheln', windsurfing: 'Windsurfen' }],
  ['eye', { sea_view: 'Meerblick', lake_view: 'Seeblick', mountain_view: 'Bergblick' }],
  ['mountains', { near_mountains: 'Bergnähe', hiking: 'Wandern', skiing: 'Skifahren', ski_in_ski_out: 'Direkt an der Piste' }],
  ['city', { city_center: 'Im Stadtzentrum', old_town: 'In der Altstadt', near_attractions: 'Sehenswürdigkeiten in der Nähe' }],
  ['paw', { dogs_allowed: 'Hunde erlaubt', pets_allowed: 'Haustiere erlaubt', cats_allowed: 'Katzen erlaubt', assistance_dog_allowed: 'Assistenzhund erlaubt' }],
  ['family', { family_friendly: 'Familienfreundlich', kids_allowed: 'Kinder willkommen', family_rooms: 'Familienzimmer', baby_cot: 'Babybett', high_chair: 'Hochstuhl', playground: 'Spielplatz', games_room: 'Spielzimmer', babysitting: 'Kinderbetreuung', extra_bed: 'Zustellbett' }],
  ['accessible', { accessible: 'Barrierefrei', wheelchair_accessible: 'Rollstuhlgerecht', wheelchair_available: 'Rollstuhlverleih', wheelchair_ramp: 'Rollstuhlrampe', walker_friendly: 'Für Rollator geeignet', mobility_scooter_friendly: 'Für Elektromobil geeignet', accessible_common_areas: 'Barrierefreie Gemeinschaftsbereiche', accessible_bed_height: 'Geeignete Betthöhe', low_controls: 'Niedrige Bedienelemente', wide_doors: 'Breite Türen', wide_corridors: 'Breite Flure', automatic_doors: 'Automatische Türen' }],
  ['steps', { step_free_access: 'Stufenloser Zugang' }],
  ['bathroom', { accessible_bathroom: 'Barrierefreies Bad', roll_in_shower: 'Bodengleiche Dusche', shower_seat: 'Duschsitz', grab_rails: 'Haltegriffe', raised_toilet: 'Erhöhte Toilette', low_sink: 'Unterfahrbares Waschbecken', accessible_bathtub: 'Barrierefreie Badewanne', private_bathroom: 'Eigenes Bad', shower: 'Dusche', bathtub: 'Badewanne' }],
  ['elevator', { elevator: 'Aufzug', wheelchair_elevator: 'Rollstuhlgerechter Aufzug' }],
  ['hearing', { hearing_loop: 'Induktionsschleife', visual_alarm: 'Optischer Alarm', sign_language_support: 'Gebärdensprache' }],
  ['eye', { braille_signage: 'Beschilderung in Braille', tactile_guidance: 'Taktiles Leitsystem' }],
  ['leaf', { quiet_place: 'Ruhige Lage', nature: 'In der Natur', rural: 'Ländliche Lage', non_smoking: 'Nichtraucherunterkunft', allergy_friendly: 'Allergikerfreundlich', adults_only: 'Nur für Erwachsene' }],
  ['pool', { pool: 'Pool', private_pool: 'Privater Pool', indoor_pool: 'Innenpool', outdoor_pool: 'Außenpool', heated_pool: 'Beheizter Pool', infinity_pool: 'Infinity-Pool', rooftop_pool: 'Dachpool', accessible_pool: 'Pool mit barrierefreiem Zugang' }],
  ['wifi', { wifi: 'WLAN', fast_wifi: 'Schnelles WLAN', high_speed_internet: 'Schnelles Internet', work_friendly: 'Für Arbeiten geeignet' }],
  ['parking', { parking: 'Parkplatz', private_parking: 'Privater Parkplatz', free_parking: 'Kostenloser Parkplatz', garage: 'Garage', private_garage: 'Private Garage', accessible_parking: 'Behindertenparkplatz', parking_near_entrance: 'Parkplatz am Eingang' }],
  ['shield', { guarded_parking: 'Bewachter Parkplatz', gated_parking: 'Abgeschlossener Parkplatz', secure_underground_parking: 'Gesicherte Tiefgarage', gated_property: 'Abgeschlossenes Gelände' }],
  ['kitchen', { kitchen: 'Küche', full_kitchen: 'Voll ausgestattete Küche', kitchenette: 'Küchenzeile', self_catering: 'Selbstverpflegung', fridge: 'Kühlschrank', microwave: 'Mikrowelle', dishwasher: 'Geschirrspüler', bbq: 'Grill' }],
  ['laundry', { washing_machine: 'Waschmaschine', laundry_service: 'Wäscheservice' }],
  ['coffee', { breakfast: 'Frühstück', breakfast_included: 'Frühstück inklusive' }],
  ['restaurant', { restaurant: 'Restaurant', bar: 'Bar', half_board: 'Halbpension', full_board: 'Vollpension', all_inclusive: 'All Inclusive', ultra_all_inclusive: 'Ultra All Inclusive' }],
  ['snowflake', { air_conditioning: 'Klimaanlage' }],
  ['spa', { sauna: 'Sauna', private_sauna: 'Private Sauna', spa: 'Wellnessbereich', private_spa: 'Privater Wellnessbereich', massage: 'Massage', hot_tub: 'Whirlpool' }],
  ['fitness', { gym: 'Fitnessraum', private_gym: 'Privater Fitnessraum', tennis: 'Tennis', golf: 'Golf', mini_golf: 'Minigolf', horse_riding: 'Reiten' }],
  ['bike', { cycling: 'Radfahren', bike_rental: 'Fahrradverleih' }],
  ['balcony', { balcony: 'Balkon', private_balcony: 'Privater Balkon', sunny_balcony: 'Sonniger Balkon', terrace: 'Terrasse', private_terrace: 'Private Terrasse', sunny_terrace: 'Sonnige Terrasse', covered_terrace: 'Überdachte Terrasse', garden: 'Garten', private_garden: 'Privater Garten' }],
  ['bed', { double_bed: 'Doppelbett', adjustable_bed: 'Verstellbares Bett', separate_bedrooms: 'Getrennte Schlafzimmer', soundproof: 'Schallisolierung' }],
  ['home', { private_entrance: 'Eigener Eingang', self_check_in: 'Selbstständiger Check-in', tv: 'Fernseher', smart_tv: 'Smart-TV', fireplace: 'Kamin', long_stay: 'Längerer Aufenthalt', smoking_area: 'Raucherbereich' }],
  ['transport', { near_airport: 'Flughafennähe', near_train_station: 'Bahnhofsnähe', airport_shuttle: 'Flughafentransfer', car_rental: 'Mietwagen' }],
  ['compass', { reception_24h: '24-Stunden-Rezeption', luggage_storage: 'Gepäckaufbewahrung', mobility_device_charging: 'Laden von Mobilitätshilfen' }],
];
export const featurePresentation: Record<string, { icon: string; label: string }> = Object.fromEntries(groups.flatMap(([icon, labels]) => Object.entries(labels).map(([key, label]) => [key, { icon, label }])));

export function resultFeatureBadges(item: SearchResult): FeatureBadge[] {
  const confirmed = Object.keys(featurePresentation).filter(key => {
    if (item.feature_states && Object.hasOwn(item.feature_states, key)) return item.feature_states[key] === true;
    return item.features?.map(canonicalFeature).includes(key) || featureValue(item as unknown as Record<string, unknown>, key) === true;
  });
  const redundant = new Set(confirmed.flatMap(featureAncestors));
  return confirmed.filter(key => !redundant.has(key)).map(key => ({ key, ...featurePresentation[key] }));
}

export function searchCriteriaBadges(value: string): FeatureBadge[] {
  if (!value) return [];
  try {
    const c = readSearchCriteria(new URLSearchParams(value)), badges: FeatureBadge[] = [];
    for (const [kind, values] of [['required', c.hard], ['preferred', c.preferred], ['excluded', c.excluded]] as const) {
      const distinct = [...new Set(values)];
      for (const key of distinct.filter(key => !distinct.some(other => other !== key && featureAncestors(other).includes(key)))) {
        const info = featurePresentation[key];
        if (info) badges.push({ key: `${kind}-${key}`, icon: info.icon, kind, label: kind === 'preferred' ? `${info.label} · Wunsch` : kind === 'excluded' ? `Ohne: ${info.label}` : info.label });
      }
    }
    return badges;
  } catch { return []; }
}
