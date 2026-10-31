import { createClient } from '@/utils/supabase/server';
import { getCampingSupabase } from '@/app/lib/camping-supabase';
import type { SearchResult } from '../../lib/accommodation-types';
import { readSearchCriteria, type SearchCriteria } from '../../lib/search/criteria';
import { canonicalFeature, featureAliases, featureColumns, featureValue } from '../../lib/search/features';
import { knownFeatures } from '../../lib/search/catalog';
import { sourceFeatureFacts } from '../../lib/search/source-features';
import { nearbyCoastDistance } from '../../lib/search/coast-distance';
import { featurePresentation } from '../../lib/feature-badges';
import {sortAccommodations} from '../../lib/accommodation-view';
import type {SortOption} from '../../lib/accommodation-types';
type Row = Record<string, unknown>;
type PageBuilder = () => {
    range(from: number, to: number): PromiseLike<{
        data: unknown[] | null;
        error: unknown;
    }>;
};
const pageSize = 1000, maxPages = 500, maxRows = 50000;
const number = (value: unknown): number | null => typeof value === 'number' || (typeof value === 'string' && value.trim() !== '') ? (Number.isFinite(Number(value)) && Number(value) >= 0 ? Number(value) : null) : null;
const string = (value: unknown): string | null => typeof value === 'string' && value.trim() ? value.trim() : null;
const warningsForSource: Record<string, string> = { accommodations: 'Die eigenen Unterkunftsdaten konnten nicht vollständig geladen werden.', camping_info_campsites: 'Die Campingdaten konnten nicht vollständig geladen werden.', expedia_accommodations: 'Die importierten Hoteldaten konnten nicht vollständig geladen werden.', features: 'Ein Teil der Ausstattungsdaten konnte nicht geladen werden.', accommodation_features: 'Ein Teil der Ausstattungsdaten konnte nicht geladen werden.' };
async function scan(build: PageBuilder, table: string, warnings: Set<string>): Promise<Row[]> {
    const rows: Row[] = [];
    let offset = 0;
    for (let page = 0; page < maxPages; page++) {
        const result = await build().range(offset, offset + pageSize - 1);
        if (result.error) {
            warnings.add(warningsForSource[table]);
            return rows;
        }
        const data = (result.data ?? []).filter((row): row is Row => Boolean(row) && typeof row === 'object' && !Array.isArray(row));
        if (!result.data?.length)
            return rows;
        rows.push(...data);
        offset += result.data.length;
        if (rows.length >= maxRows)
            break;
    }
    warnings.add('Die Datenmenge ist sehr groß. Bitte grenze das Reiseziel weiter ein; die Ergebnisliste ist möglicherweise unvollständig.');
    return rows;
}
const plain = (value: unknown) => String(value ?? '').trim().toLocaleLowerCase('de-DE').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
function geoMatches(row: Row, c: SearchCriteria): boolean {
    return ['country', 'region', 'city'].every(key => !c.params.has(key) || plain(row[key]) === plain(c.params.get(key)));
}
function explicitNumberMatches(value: unknown, exact: number | null, min: number | null, max: number | null): boolean {
    if (exact === null && min === null && max === null)
        return true;
    const current = number(value);
    return current !== null && (exact === null || current === exact) && (min === null || current >= min) && (max === null || current <= max);
}
function normalize(row: Row, source: 'own' | 'camping' | 'expedia', linked: ReadonlySet<string>, wanted: string[]): SearchResult | null {
    const id = number(row.id), name = string(row.name);
    if (id === null || !Number.isSafeInteger(id) || !name)
        return null;
    const facts=sourceFeatureFacts(row);
    const coastDistance=featureValue(row,'near_sea',linked,facts)===null && !facts.has('near_sea') && !linked.has('near_sea') && !facts.has('seafront') && !linked.has('seafront') ? nearbyCoastDistance(row.latitude,row.longitude) : null;
    if(coastDistance!==null)facts.set('near_sea',true);
    const states: Record<string, boolean | null> = {};
    for (const key of new Set([...knownFeatures, ...wanted, ...linked]))
        states[canonicalFeature(key)] = featureValue(row, key, linked, facts);
    const rating = number(source === 'camping' ? row.rating : row.review_score);
    const scale = number(row.review_scale) ?? (source === 'camping' ? 5 : 10);
    const reviewScale = scale === 5 ? 5 : 10;
    const validRating = rating !== null && rating <= reviewScale ? rating : null;
    const fields: SearchResult = {
        id: source === 'camping' ? -id : source === 'expedia' ? -1000000000 - id : id,
        name, city: string(row.city), region: string(row.region), country: string(row.country),
        accommodation_type: source === 'camping' ? 'campsite' : string(row.accommodation_type),
        description: string(row.description), image_url: string(row.image_url),
        affiliate_url: string(row.affiliate_url), booking_url: string(row.booking_url), website_url: string(row.website_url),
        price_min: number(row.price_min), price_max: number(row.price_max), partner_price: source === 'camping' ? number(row.price) : null,
        currency: string(row.currency), review_score: validRating, review_scale: reviewScale, review_normalized: validRating === null ? null : validRating / reviewScale * 10,
        review_count: number(row.review_count), hotel_stars: number(row.hotel_stars), max_guests: number(row.max_guests), apartment_bedrooms: number(row.apartment_bedrooms),
        is_featured: row.is_featured === true, provider_name: source === 'camping' ? 'camping.info' : source === 'expedia' ? 'Expedia' : string(row.provider_name),
        feature_states: states, features: Object.keys(states).filter(key => states[key] === true), coast_distance_m:coastDistance,
        available_months: Array.isArray(row.available_months) ? row.available_months.map(Number).filter(value => Number.isInteger(value) && value >= 1 && value <= 12) : null,
    };
    // Keep badges and the search filter on the same confirmed feature data.
    for (const [feature, columns] of Object.entries(featureColumns)) {
        const column = columns[0];
        if (['has_pool', 'has_wifi', 'has_parking', 'has_restaurant', 'has_breakfast', 'has_air_conditioning', 'near_sea', 'near_lake', 'near_mountains', 'dogs_allowed', 'family_friendly', 'accessible', 'quiet_place', 'apartment_has_kitchen', 'apartment_has_washing_machine'].includes(column))
            Object.assign(fields, { [column]: states[feature] });
    }
    return fields;
}
function matches(item: SearchResult, c: SearchCriteria): boolean {
    if (!geoMatches(item as unknown as Row, c))
        return false;
    if (c.type && item.accommodation_type !== c.type)
        return false;
    if (c.excludedTypes.includes(item.accommodation_type ?? ''))
        return false;
    if (c.hard.some(key => item.feature_states?.[key] !== true) || c.excluded.some(key => item.feature_states?.[key] !== false))
        return false;
    if (c.number('max_guests') !== null && (item.max_guests === null || item.max_guests === undefined || item.max_guests < c.number('max_guests')!))
        return false;
    const month = c.number('month');
    if (month !== null && item.available_months !== null && item.available_months !== undefined && !item.available_months.includes(month))
        return false;
    if (!explicitNumberMatches(item.hotel_stars, c.number('hotel_stars'), c.number('min_hotel_stars'), c.number('max_hotel_stars')))
        return false;
    if (!explicitNumberMatches(item.apartment_bedrooms, c.number('bedrooms'), c.number('min_bedrooms'), c.number('max_bedrooms')))
        return false;
    const scale = c.number('review_scale') ?? (c.type === 'campsite' ? 5 : 10);
    const convert = (key: string) => c.number(key) === null ? null : c.number(key)! / scale * 10;
    if (!explicitNumberMatches(item.review_normalized, convert('review_score'), convert('min_review_score'), convert('max_review_score')))
        return false;
    const nights = c.number('nights'), maxTotal = c.number('max_total_price') ?? c.number('total_budget');
    const minTotal = c.number('min_total_price');
    const minPrices = [c.number('min_price_per_night'), c.number('min_price'), nights && minTotal !== null ? minTotal / nights : null].filter((x): x is number => x !== null);
    const maxPrices = [c.number('max_price_per_night'), c.number('max_price'), nights && maxTotal !== null ? maxTotal / nights : null].filter((x): x is number => x !== null);
    if ((minTotal !== null || maxTotal !== null) && !nights)
        return false;
    if (minPrices.length || maxPrices.length) {
        if (item.currency !== (c.params.get('currency') ?? 'EUR'))
            return false;
        if (!explicitNumberMatches(item.price_min, null, minPrices.length ? Math.max(...minPrices) : null, maxPrices.length ? Math.min(...maxPrices) : null))
            return false;
    }
    return true;
}
function rank(item: SearchResult, c: SearchCriteria): number {
    const preferred = c.preferred.filter(key => item.feature_states?.[key] === true).length;
    const capacity = c.number('max_guests'), maxPrice = c.number('max_price_per_night') ?? c.number('max_price');
    return preferred * 12 + (item.is_featured ? 20 : 0) + (item.review_normalized ?? 0) * 3 + (item.hotel_stars ?? 0) * 0.5 +
        (capacity !== null && item.max_guests !== null && item.max_guests !== undefined ? Math.max(0, 10 - (item.max_guests - capacity)) : 0) +
        (maxPrice && item.price_min !== null && item.price_min !== undefined ? Math.max(0, 1 - item.price_min / maxPrice) * 10 : 0);
}
export async function GET(request: Request) {
    let c: SearchCriteria;
    try {
        c = readSearchCriteria(new URL(request.url).searchParams);
    }
    catch (error) {
        return Response.json({ error: error instanceof Error ? error.message : 'Ungültige Suchkriterien.' }, { status: 400 });
    }
    const warnings = new Set<string>(), all: SearchResult[] = [];
    const requested = [...new Set([...c.hard, ...c.excluded, ...c.preferred])];
    let known = new Set(Object.keys(featureColumns));
    const sourceStates: Record<string, string> = {};
    try {
        const supabase = await createClient();
        const ownRows = await scan(() => supabase.from('accommodations').select('*').eq('is_active', true).order('id', { ascending: true }), 'accommodations', warnings);
        const relevant = ownRows.filter(row => geoMatches(row, c) && (!c.type || row.accommodation_type === c.type));
        const lookup = [...new Set([...requested, ...knownFeatures].flatMap(featureAliases))];
        const featureRows = await scan(() => supabase.from('features').select('id,key').in('key', lookup).order('id', { ascending: true }), 'features', warnings);
        const keyById = new Map(featureRows.map(row => [Number(row.id), canonicalFeature(String(row.key))]));
        known = new Set([...known, ...keyById.values()]);
        const linked = new Map<number, Set<string>>();
        if (featureRows.length)
            for (let start = 0; start < relevant.length; start += 150) {
                const ids = relevant.slice(start, start + 150).map(row => Number(row.id));
                const links = await scan(() => supabase.from('accommodation_features').select('accommodation_id,feature_id').in('accommodation_id', ids).in('feature_id', [...keyById.keys()]).order('accommodation_id', { ascending: true }).order('feature_id', { ascending: true }), 'accommodation_features', warnings);
                for (const link of links) {
                    const id = Number(link.accommodation_id), key = keyById.get(Number(link.feature_id));
                    if (key) {
                        if (!linked.has(id))
                            linked.set(id, new Set());
                        linked.get(id)!.add(key);
                    }
                }
            }
        for (const row of relevant) {
            const item = normalize(row, 'own', linked.get(Number(row.id)) ?? new Set(), requested);
            if (item)
                all.push(item);
        }
        sourceStates.own = warnings.has(warningsForSource.accommodations) ? 'partial' : 'loaded';
    }
    catch {
        warnings.add(warningsForSource.accommodations);
        sourceStates.own = 'unavailable';
    }
    await Promise.all([
        (async () => {
            if (c.type && c.type !== 'campsite' || c.excludedTypes.includes('campsite'))
                return;
            try {
                const client = getCampingSupabase();
                const rows = await scan(() => client.from('camping_info_campsites').select('*').order('id', { ascending: true }), 'camping_info_campsites', warnings);
                for (const row of rows) {
                    if (!geoMatches(row, c))
                        continue;
                    const item = normalize(row, 'camping', new Set(), requested);
                    if (item)
                        all.push(item);
                }
                sourceStates.camping = warnings.has(warningsForSource.camping_info_campsites) ? 'partial' : 'loaded';
            }
            catch {
                warnings.add(warningsForSource.camping_info_campsites);
                sourceStates.camping = 'unavailable';
            }
        })(),
        (async () => {
            if (c.type && c.type !== 'hotel' || c.excludedTypes.includes('hotel'))
                return;
            try {
                const client = getCampingSupabase();
                const rows = await scan(() => client.from('expedia_accommodations').select('*').eq('is_active', true).eq('accommodation_type', 'hotel').order('id', { ascending: true }), 'expedia_accommodations', warnings);
                for (const row of rows) {
                    if (!geoMatches(row, c) || !string(row.affiliate_url))
                        continue;
                    const item = normalize(row, 'expedia', new Set(), requested);
                    if (item)
                        all.push(item);
                }
                sourceStates.expedia = warnings.has(warningsForSource.expedia_accommodations) ? 'partial' : 'loaded';
            }
            catch {
                warnings.add(warningsForSource.expedia_accommodations);
                sourceStates.expedia = 'unavailable';
            }
        })(),
    ]);
    // Each source proves its own facts. Missing relation rows in one source never stop the others.
    for (const item of all)
        for (const [key, value] of Object.entries(item.feature_states ?? {}))
            if (value !== null)
                known.add(key);
    const missing = c.hard.filter(key => !known.has(key) || !all.some(item=>typeof item.feature_states?.[key]==='boolean'));
    if(missing.length)warnings.add(`Für diese Pflichtmerkmale fehlen im passenden Datenbestand bestätigte Angaben: ${missing.map(key=>featurePresentation[key]?.label??'besonderes Ausstattungsmerkmal').join(', ')}.`);
    const candidates = missing.length ? [] : all.filter(item => matches(item, c));
    candidates.sort((a, b) => rank(b, c) - rank(a, c) || (a.provider_name ?? '').localeCompare(b.provider_name ?? '') || a.id - b.id);
    if (!candidates.length && all.length && (c.hard.length || c.excluded.length || c.number('max_guests') !== null || c.number('month') !== null || c.number('max_price_per_night') !== null || c.number('max_total_price') !== null))
        warnings.add('Nicht alle Unterkünfte enthalten bestätigte Angaben zu deinen Pflichtkriterien. Unbekannte Angaben erfüllen keine Pflichtfilter.');
    const page=c.number('page')??1,limit=c.number('page_size')??60;
    const sorted=sortAccommodations(candidates,(c.params.get('sort')??'best') as SortOption);
    return Response.json({ accommodations: sorted.slice((page-1)*limit,page*limit),total:sorted.length,next_page:page*limit<sorted.length?page+1:null,missing_features: missing, warnings: [...warnings], sources: sourceStates, availability: { status: 'not_checked', check_in: c.params.get('check_in'), check_out: c.params.get('check_out'), nights: c.number('nights') } });
}
