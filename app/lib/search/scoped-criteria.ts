import { accessibilityTerms, termPattern } from './accessibility';
import { canonicalFeature } from './features';

const waterTerms: Record<string, readonly string[]> = {
  near_sea: ['am meer', 'meernähe', 'meernaehe', 'in meernähe', 'an der küste', 'an der kueste', 'nordsee', 'ostsee'],
  seafront: ['direkt am meer', 'direkte meerlage'],
  near_lake: ['am see', 'seenähe', 'seenaehe', 'in seenähe'],
  lakefront: ['direkt am see'],
  near_beach: ['strand', 'strandnähe', 'strandnaehe', 'in strandnähe', 'strandnah'],
  beachfront: ['am strand', 'direkt am strand', 'direkter strandzugang', 'direktem strandzugang'],
  near_water: ['am wasser', 'wassernähe', 'wassernaehe', 'in wassernähe', 'in wassernaehe'],
  near_river: ['am fluss', 'flussnähe', 'flussnaehe', 'in flussnähe'],
};
const terms = { ...accessibilityTerms, ...waterTerms };
const keys = new Set(Object.keys(terms));
type Mention = { feature: string; start: number; end: number };

// Replace broad substring matches with scoped, longest-phrase matches.
export function applyScopedCriteria(params: URLSearchParams, query: string): void {
  const text = query.toLowerCase();
  if (!/\d\s*(?:m\b|meter)/.test(text)) params.delete('max_distance_beach_m');
  for (const key of ['feature', 'must_feature', 'preferred_feature', 'exclude_feature']) {
    const values = params.getAll(key).filter(value => !keys.has(canonicalFeature(value)));
    params.delete(key);
    for (const value of values) params.append(key, value);
  }
  params.delete('accessibility_feature');
  params.delete('near_sea'); params.delete('near_lake');
  params.delete('water_location');
  for (const clause of text.split(/[,;.!?\n]|\b(?:aber|während|waehrend)\b/)) {
    const mentions: Mention[] = [];
    for (const [feature, aliases] of Object.entries(terms)) {
      for (const alias of aliases) {
        const pattern = termPattern(alias);
        const regex = new RegExp(pattern.source, 'giu');
        for (const match of clause.matchAll(regex)) mentions.push({ feature, start: match.index!, end: match.index! + match[0].length });
      }
    }
    // Adjectives can describe the whole property without a following noun.
    for (const match of clause.matchAll(/\bbarrierefrei(?:e[rmns]?)?\b/giu)) mentions.push({ feature: 'accessible', start: match.index!, end: match.index! + match[0].length });
    const selected: Mention[] = [];
    for (const mention of mentions.sort((a, b) => (b.end - b.start) - (a.end - a.start)))
      if (!selected.some(other => mention.start < other.end && mention.end > other.start)) selected.push(mention);
    const signals = [...clause.matchAll(/\b(?:wäre schön|waere schoen|wäre gut|waere gut|gern|gerne|am liebsten|bevorzugt|wenn möglich|wenn moeglich|idealerweise|optional|muss|unbedingt|zwingend|pflicht|brauche|benötige|benoetige)\b/giu)];
    for (const mention of selected) {
      const before = clause.slice(0, mention.start), after = clause.slice(mention.end);
      if (/^\s*(?:(?:ist|sind)\s+)?(?:nicht (?:nötig|noetig|erforderlich)|egal|kein muss)\b/.test(after)) continue;
      const excluded = /\b(?:ohne|kein(?:e[rmns]?)?|nicht(?: mit)?)\s*$/.test(before);
      const distance = (signal: RegExpMatchArray) => Math.max(0, signal.index! - mention.end, mention.start - signal.index! - signal[0].length);
      const signal = [...signals].sort((a, b) => distance(a) - distance(b))[0]?.[0];
      const preferred = signal && !/^(?:muss|unbedingt|zwingend|pflicht|brauche|benötige|benoetige)$/.test(signal);
      params.append(excluded ? 'exclude_feature' : 'feature', mention.feature);
      if (!excluded && preferred) params.append('preferred_feature', mention.feature);
    }
    // A shower is implied by its precise form; it must not become a second hard filter.
    if (selected.some(m => m.feature === 'roll_in_shower')) remove(params, 'shower');
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
