import { knownFeatures } from './catalog';
import { accommodationTypes } from './criteria';
import { canonicalFeature } from './features';
export function mergeAiCriteria(params: URLSearchParams, raw: unknown, selectedType: string | null) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw))
        return;
    const criteria = raw as Record<string, unknown>;
    for (const key of ['country', 'region', 'city']) {
        const value = criteria[key];
        // A known city/country pair is authoritative over inferred geography.
        if (!params.has(key) && !(key === 'country' && params.has('city')) && typeof value === 'string' && value.trim() && value.length <= 120)
            params.set(key, value.trim());
    }
    const numbers: Record<string, [
        string,
        number,
        number,
        boolean?
    ]> = { month: ['month', 1, 12, true], nights: ['nights', 1, 3650, true], guests: ['max_guests', 1, 1000, true], max_price_per_night: ['max_price_per_night', 0, 10000000], total_budget: ['max_total_price', 0, 100000000] };
    for (const [key, [target, min, max, integer]] of Object.entries(numbers)) {
        const value = criteria[key];
        if (typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max && (!integer || Number.isInteger(value)) && !params.has(target))
            params.set(target, String(value));
    }
    if (!selectedType && !params.has('type') && typeof criteria.accommodation_type === 'string' && accommodationTypes.has(criteria.accommodation_type))
        params.set('type', criteria.accommodation_type);
    if (Array.isArray(criteria.features))
        for (const rawFeature of criteria.features.slice(0, 40)) {
            if (typeof rawFeature !== 'string')
                continue;
            const feature = canonicalFeature(rawFeature.trim().toLowerCase());
            if (knownFeatures.has(feature) && !params.getAll('feature').includes(feature) && !params.getAll('exclude_feature').map(canonicalFeature).includes(feature))
                params.append('feature', feature);
        }
}
