import { knownFeatures } from './catalog';
import { canonicalFeature, featureAliases, featureColumns } from './features';
import { featurePresentation } from '../feature-badges';
const plain = (value: string) => value.toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
const labels = new Map<string,string>();
for (const key of knownFeatures) for (const label of [...featureAliases(key), featurePresentation[key]?.label ?? key]) labels.set(plain(label), canonicalFeature(key));
for (const [label,key] of Object.entries({swimming_pool:'pool',free_wifi:'wifi',kostenloses_wlan:'wifi',wireless_internet:'wifi',pets_welcome:'pets_allowed',wheelchair_access:'wheelchair_accessible'})) labels.set(label,key);
function bool(value: unknown): boolean | null {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number' && [0,1].includes(value)) return value === 1;
  if (typeof value !== 'string') return null;
  const text = value.trim().toLowerCase();
  return ['true','yes','ja','1','available','included'].includes(text) ? true : ['false','no','nein','0','unavailable'].includes(text) ? false : null;
}
// Parse structured amenity lists/flags only. Marketing descriptions are never read.
export function sourceFeatureFacts(row: Record<string,unknown>): Map<string,boolean|null> {
  const facts = new Map<string,boolean|null>();
  const add = (label: string, value: boolean) => {
    const key = labels.get(plain(label)); if (!key) return;
    facts.set(key, facts.has(key) && facts.get(key) !== value ? null : value);
  };
  const entry = (value: unknown): void => {
    if (typeof value === 'string') {
      const negative = value.match(/^(?:ohne|kein(?:e|en|er|es)?|no|without)\s+(.+)$/iu);
      add(negative ? negative[1] : value, !negative); return;
    }
    if (!value || typeof value !== 'object' || Array.isArray(value)) return;
    const object = value as Record<string,unknown>;
    const name = object.key ?? object.name ?? object.label;
    if (typeof name === 'string') {
      const explicit = object.available ?? object.enabled ?? object.value;
      const state = explicit === undefined ? true : bool(explicit);
      if (state !== null) add(name,state);
    } else for (const [key,raw] of Object.entries(object).slice(0,200)) { const state = bool(raw); if (state !== null) add(key,state); }
  };
  const list = (input: unknown): void => {
    if (typeof input === 'string') {
      if (input.length > 20000) return;
      if (/^\s*[\[{]/.test(input)) { try { list(JSON.parse(input)); } catch { /* Invalid structured data is unknown. */ } return; }
      for (const item of input.split(/[,;|]/).slice(0,200)) entry(item.trim());
    } else if (Array.isArray(input)) input.slice(0,200).forEach(entry); else entry(input);
  };
  for (const key of knownFeatures) for (const column of new Set([...(featureColumns[key] ?? []), ...featureAliases(key).flatMap(alias=>[alias,`has_${alias}`])])) {
    const state = bool(row[column]); if (state !== null) add(key,state);
  }
  for (const field of ['amenities','facilities','features','equipment']) list(row[field]);
  const raw = row.raw_data;
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) for (const field of ['amenities','facilities','features','equipment','Travel:facilities']) list((raw as Record<string,unknown>)[field]);
  return facts;
}
