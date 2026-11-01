import { accessibilityTerms } from './accessibility';
import { normalizeSemanticText } from '../searchTextNormalizer';
import { commonPreferenceTerms, qualifyFeatures } from './preference-signals';
import { canonicalFeature } from './features';

const waterTerms: Record<string, readonly string[]> = {
  near_sea: ['am meer', 'meernähe', 'meernaehe', 'in meernähe', 'an der küste', 'an der kueste', 'nordsee', 'ostsee', 'meernah', 'meernahe', 'küstennähe', 'kuestennaehe', 'in küstennähe', 'in kuestennaehe'],
  seafront: ['direkt am meer', 'direkte meerlage'],
  near_lake: ['am see', 'seenähe', 'seenaehe', 'in seenähe'],
  lakefront: ['direkt am see'],
  near_beach: ['strand', 'strandnähe', 'strandnaehe', 'in strandnähe', 'strandnah'],
  beachfront: ['am strand', 'direkt am strand', 'direkter strandzugang', 'direktem strandzugang'],
  near_water: ['am wasser', 'wassernähe', 'wassernaehe', 'in wassernähe', 'in wassernaehe'],
  near_river: ['am fluss', 'flussnähe', 'flussnaehe', 'in flussnähe'],
};
const terms = { ...accessibilityTerms, ...waterTerms, private_bathroom: ['eigenes bad','eigenem bad','eigenen bad','eigenes badezimmer','eigenem badezimmer','privates bad','privatem bad','privates badezimmer','privatem badezimmer'] };
const keys = new Set(Object.keys(terms));

// Replace broad substring matches with scoped, longest-phrase matches.
export function applyScopedCriteria(params: URLSearchParams, query: string): void {
  const text = normalizeSemanticText(query);
  const allTerms={...commonPreferenceTerms,...terms};
  const mentions=qualifyFeatures(text,allTerms);
  for(const key of ['preferred_feature','must_feature']){
    const values=params.getAll(key).filter(value=>!(canonicalFeature(value) in allTerms));params.delete(key);for(const value of values)params.append(key,value);
  }
  if (!/\d\s*(?:m\b|meter)/.test(text)) params.delete('max_distance_beach_m');
  for (const key of ['feature', 'must_feature', 'preferred_feature', 'exclude_feature']) {
    const values = params.getAll(key).filter(value => !keys.has(canonicalFeature(value)));
    params.delete(key);
    for (const value of values) params.append(key, value);
  }
  params.delete('accessibility_feature');
  params.delete('near_sea'); params.delete('near_lake');
  params.delete('water_location');
  for(const mention of mentions){if(mention.ignored||mention.excluded)continue;if(mention.preferred)params.append('preferred_feature',mention.feature);if(mention.must)params.append('must_feature',mention.feature);}
  for(const mention of mentions){
    if(mention.ignored){remove(params,mention.feature);continue;}
    if(!keys.has(mention.feature))continue;
    params.append(mention.excluded?'exclude_feature':'feature',mention.feature);
    if(mention.feature==='roll_in_shower')remove(params,'shower');
  }
  // Renting a bicycle does not prove or require a cycling activity on the property.
  if (/\b(?:fahrradverleih|radverleih|fahrradverleihs)\b/.test(text) && !/\b(?:radfahren|radtour|radurlaub|radwege|cycling)\b/.test(text)) remove(params, 'cycling');
  const optionalTerms: Record<string, string> = { pool: 'pool', sauna: 'sauna', wlan: 'wifi', wifi: 'wifi', parkplatz: 'parking', balkon: 'balcony', frühstück: 'breakfast' };
  for (const [term, feature] of Object.entries(optionalTerms))
    if (new RegExp(`\\b${term}\\s+(?:(?:ist|sind)\\s+)?(?:kein muss|nicht (?:nötig|noetig|erforderlich)|egal)\\b`, 'iu').test(text)) remove(params, feature);
}
function remove(params: URLSearchParams, feature: string): void {
  for (const key of ['feature', 'must_feature', 'preferred_feature']) {
    const values = params.getAll(key).filter(value => value !== feature);
    params.delete(key); for (const value of values) params.append(key, value);
  }
}
