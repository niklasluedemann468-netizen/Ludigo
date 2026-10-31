import { canonicalFeature, featureDescendants, featureAncestors } from './features';
export const accommodationTypes = new Set(['hotel', 'campsite', 'holiday_apartment', 'holiday_home', 'villa', 'hostel', 'guesthouse', 'bed_and_breakfast', 'resort', 'chalet', 'cabin', 'bungalow']);
export const apiKeys = new Set([
    'type', 'country', 'region', 'city', 'month', 'year', 'nights', 'check_in', 'check_out', 'guests', 'max_guests', 'currency',
    'min_price', 'max_price', 'min_price_per_night', 'max_price_per_night', 'min_total_price', 'max_total_price', 'total_budget',
    'review_score', 'min_review_score', 'max_review_score', 'review_scale', 'hotel_stars', 'min_hotel_stars', 'max_hotel_stars',
    'bedrooms', 'min_bedrooms', 'max_bedrooms', 'feature', 'must_feature', 'preferred_feature', 'exclude_feature', 'exclude_accommodation_type',
    'near_sea', 'near_lake', 'near_mountains', 'dogs_allowed', 'has_pool',
    'page','page_size','sort',
]);
const numericLimits: Record<string, [
    number,
    number,
    boolean?
]> = {
    page:[1,1000000,true],page_size:[1,100,true],
    month: [1, 12, true], year: [2000, 2200, true], nights: [1, 3650, true], guests: [1, 1000, true], max_guests: [1, 1000, true],
    min_price: [0, 10000000], max_price: [0, 10000000], min_price_per_night: [0, 10000000], max_price_per_night: [0, 10000000],
    min_total_price: [0, 100000000], max_total_price: [0, 100000000], total_budget: [0, 100000000],
    review_score: [0, 10], min_review_score: [0, 10], max_review_score: [0, 10], review_scale: [5, 10],
    hotel_stars: [1, 5, true], min_hotel_stars: [1, 5, true], max_hotel_stars: [1, 5, true],
    bedrooms: [0, 100, true], min_bedrooms: [0, 100, true], max_bedrooms: [0, 100, true],
};
const listKeys = new Set(['feature', 'must_feature', 'preferred_feature', 'exclude_feature', 'exclude_accommodation_type']);
export function validIsoDate(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
        return false;
    if (Number(value.slice(0, 4)) < 2000 || Number(value.slice(0, 4)) > 2200)
        return false;
    const date = new Date(`${value}T12:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function dateNights(start: string, end: string): number { return Math.round((Date.parse(end) - Date.parse(start)) / 86400000); }
export function addNights(start: string, nights: number): string {
    const date = new Date(`${start}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + nights);
    return date.toISOString().slice(0, 10);
}
export function validateSearchParams(input: URLSearchParams): URLSearchParams {
    const params = new URLSearchParams(input);
    if ([...params].length > 150)
        throw new Error('Zu viele Suchkriterien. Bitte vereinfache deine Suche.');
    for (const [key, value] of params) {
        if (!apiKeys.has(key))
            throw new Error('Ein Suchfilter wird noch nicht unterstützt. Bitte vereinfache deine Suche.');
        if (!listKeys.has(key) && params.getAll(key).length > 1)
            throw new Error('Widersprüchliche Suchwerte. Bitte prüfe deine Eingabe.');
        if (key in numericLimits) {
            const number = Number(value), [min, max, integer] = numericLimits[key];
            if (!value.trim() || !Number.isFinite(number) || number < min || number > max || (integer && !Number.isInteger(number)))
                throw new Error('Ein Zahlenwert liegt außerhalb des gültigen Bereichs.');
            if (key === 'review_scale' && ![5, 10].includes(number))
                throw new Error('Bewertungen müssen sich auf 5 oder 10 Punkte beziehen.');
        }
        else if (['country', 'region', 'city'].includes(key)) {
            if (!value.trim() || value.length > 120 || /[\x00-\x1f]/.test(value))
                throw new Error('Bitte gib einen gültigen Ort ein.');
        }
        else if (key === 'type' || key === 'exclude_accommodation_type') {
            if (!accommodationTypes.has(value))
                throw new Error('Diese Unterkunftsart wird noch nicht unterstützt.');
        }
        else if (listKeys.has(key)) {
            if (!/^[a-z][a-z0-9_]{0,63}$/.test(value))
                throw new Error('Ein Unterkunftsmerkmal ist ungültig.');
        }
        else if (key === 'check_in' || key === 'check_out') {
            if (!validIsoDate(value))
                throw new Error('Bitte gib ein gültiges Kalenderdatum ein.');
        }
        else if (key === 'currency') {
            if (!/^[A-Z]{3}$/.test(value))
                throw new Error('Bitte gib eine gültige Währung ein.');
        }
        else if (key==='sort') {if(!['best','rating','price_asc','price_desc'].includes(value))throw new Error('Diese Sortierung wird nicht unterstützt.');}
        else if (value !== 'true' && value !== 'false')
            throw new Error('Ein Ja-/Nein-Filter ist ungültig.');
    }
    for (const [minKey, maxKey] of [['min_price_per_night', 'max_price_per_night'], ['min_price', 'max_price'], ['min_total_price', 'max_total_price'], ['min_review_score', 'max_review_score'], ['min_hotel_stars', 'max_hotel_stars'], ['min_bedrooms', 'max_bedrooms']]) {
        if (params.has(minKey) && params.has(maxKey) && Number(params.get(minKey)) > Number(params.get(maxKey)))
            throw new Error('Die Untergrenze darf nicht über der Obergrenze liegen.');
    }
    const reviewScale = Number(params.get('review_scale') ?? (params.get('type') === 'campsite' ? 5 : 10));
    if (['review_score', 'min_review_score', 'max_review_score'].some(key => params.has(key) && Number(params.get(key)) > reviewScale))
        throw new Error('Die Bewertung liegt über der angegebenen Punkteskala.');
    const start = params.get('check_in'), end = params.get('check_out');
    if (Boolean(start) !== Boolean(end))
        throw new Error('Bitte gib Anreise und Abreise an.');
    if (start && end) {
        const nights = dateNights(start, end);
        if (nights < 1 || nights > 3650)
            throw new Error('Bitte wähle eine Abreise nach der Anreise.');
        if (params.has('nights') && Number(params.get('nights')) !== nights)
            throw new Error('Reisedaten und Anzahl der Nächte passen nicht zusammen.');
        params.set('nights', String(nights));
    }
    if (['min_total_price', 'max_total_price', 'total_budget'].some(key => params.has(key)) && !params.has('nights'))
        throw new Error('Für ein Gesamtbudget wird eine Reisedauer benötigt.');
    for (const key of listKeys) {
        const values = [...new Set(params.getAll(key).map(value => key === 'exclude_accommodation_type' ? value : canonicalFeature(value)))];
        params.delete(key);
        for (const value of values)
            params.append(key, value);
    }
    const excluded = new Set(params.getAll('exclude_feature'));
    const preferred = params.getAll('preferred_feature'), must = params.getAll('must_feature');
    for (const feature of params.getAll('feature'))
        if (!must.includes(feature) && featureAncestors(feature).some(parent => preferred.includes(parent) && !must.includes(parent)) && !preferred.includes(feature))
            params.append('preferred_feature', feature);
    if (params.getAll('must_feature').some(value => excluded.has(value)))
        throw new Error('Ein Merkmal ist gleichzeitig Pflicht und ausgeschlossen. Bitte präzisiere deine Suche.');
    if (params.has('type') && params.getAll('exclude_accommodation_type').includes(params.get('type')!))
        throw new Error('Die gewählte Unterkunftsart ist im Suchtext ausgeschlossen. Bitte passe den Tab oder den Text an.');
    return params;
}
export type SearchCriteria = {
    params: URLSearchParams;
    type: string | null;
    hard: string[];
    preferred: string[];
    excluded: string[];
    excludedTypes: string[];
    number: (key: string) => number | null;
};
export function readSearchCriteria(input: URLSearchParams): SearchCriteria {
    const params = validateSearchParams(input), preferred = params.getAll('preferred_feature'), excluded = params.getAll('exclude_feature');
    const must = params.getAll('must_feature');
    const hard = new Set([...params.getAll('feature').filter(key => !preferred.includes(key) || must.includes(key)), ...must]);
    for (const [param, feature] of Object.entries({ near_sea: 'near_sea', near_lake: 'near_lake', near_mountains: 'near_mountains', dogs_allowed: 'dogs_allowed', has_pool: 'pool' })) {
        if (params.get(param) === 'true')
            hard.add(feature);
        if (params.get(param) === 'false')
            excluded.push(feature);
    }
    if ([...hard].some(key => excluded.includes(key)))
        throw new Error('Ein Pflichtmerkmal ist gleichzeitig ausgeschlossen. Bitte präzisiere deine Suche.');
    return { params, type: params.get('type'), hard: [...hard], preferred, excluded: [...new Set(excluded)], excludedTypes: params.getAll('exclude_accommodation_type'), number: key => params.has(key) ? Number(params.get(key)) : null };
}
export type FormContext = {
    checkIn: string;
    checkOut: string;
    guests: number;
    requireCapacity: boolean;
    selectedType: string | null;
};
function explicitDateRange(text: string): [
    string,
    string
] | null {
    const iso = (year: number, month: number, day: number) => `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const direct = text.match(/\b(\d{4}-\d{2}-\d{2})\s*(?:bis|[-–])\s*(\d{4}-\d{2}-\d{2})\b/);
    if (direct)
        return [direct[1], direct[2]];
    const build = (day: number, month: number, year: number | undefined, endDay: number, endMonth: number, endYear: number | undefined): [
        string,
        string
    ] => {
        let startYear = year ?? (endYear === undefined ? new Date().getFullYear() : endYear - (endMonth < month ? 1 : 0));
        if (year === undefined && endYear === undefined && new Date(`${iso(startYear, month, day)}T23:59:59Z`).getTime() < Date.now())
            startYear++;
        return [iso(startYear, month, day), iso(endYear ?? startYear + (endMonth < month ? 1 : 0), endMonth, endDay)];
    };
    const numeric = text.match(/\b(\d{1,2})\.(\d{1,2})\.?(\d{4})?\s*(?:bis|[-–])\s*(\d{1,2})\.(\d{1,2})\.?(\d{4})?\b/);
    if (numeric)
        return build(Number(numeric[1]), Number(numeric[2]), numeric[3] ? Number(numeric[3]) : undefined, Number(numeric[4]), Number(numeric[5]), numeric[6] ? Number(numeric[6]) : undefined);
    const months: Record<string, number> = { januar: 1, january: 1, februar: 2, february: 2, märz: 3, maerz: 3, march: 3, april: 4, mai: 5, may: 5, juni: 6, june: 6, juli: 7, july: 7, august: 8, september: 9, oktober: 10, october: 10, november: 11, dezember: 12, december: 12 };
    const month = '(' + Object.keys(months).join('|') + ')';
    const full = text.match(new RegExp(`\\b(\\d{1,2})\\.?\\s*${month}\\s*(\\d{4})?\\s*(?:bis|[-–])\\s*(\\d{1,2})\\.?\\s*${month}\\s*(\\d{4})?\\b`, 'i'));
    if (full)
        return build(Number(full[1]), months[full[2]], full[3] ? Number(full[3]) : undefined, Number(full[4]), months[full[5]], full[6] ? Number(full[6]) : undefined);
    const same = text.match(new RegExp(`\\b(\\d{1,2})\\.?\\s*(?:bis|[-–])\\s*(\\d{1,2})\\.?\\s*${month}\\s*(\\d{4})?\\b`, 'i'));
    return same ? build(Number(same[1]), months[same[3]], same[4] ? Number(same[4]) : undefined, Number(same[2]), months[same[3]], same[4] ? Number(same[4]) : undefined) : null;
}
export function finishLocalCriteria(input: URLSearchParams, query: string, form: FormContext): {
    params: URLSearchParams;
    warnings: string[];
} {
    const params = new URLSearchParams(input), warnings: string[] = [];
    const text = query.toLowerCase();
    if (query.trim().length > 3000)
        throw new Error('Bitte beschränke deinen Suchtext auf 3.000 Zeichen.');
    if (form.selectedType) {
        if (params.has('type') && params.get('type') !== form.selectedType)
            warnings.push('Die im Tab gewählte Unterkunftsart wird verwendet.');
        params.set('type', form.selectedType);
    }
    const negativeTerms: Record<string, string> = { pool: 'pool', schwimmbad: 'pool', wlan: 'wifi', wifi: 'wifi', hund: 'dogs_allowed', hunde: 'dogs_allowed', haustiere: 'pets_allowed', frühstück: 'breakfast', fruehstueck: 'breakfast', sauna: 'sauna' };
    if (/\bbewacht(?:e[rmns]?)?\s+parkplatz\b/.test(text))
        params.append('feature', 'guarded_parking');
    for (const [term, feature] of Object.entries(negativeTerms))
        if (new RegExp(`\\b(?:ohne|kein(?:e|en)?|nicht\\s+mit)\\s+${term}\\b`, 'i').test(text))
            params.append('exclude_feature', feature);
    const blocked = new Set(params.getAll('exclude_feature').flatMap(value => [canonicalFeature(value), ...featureDescendants(value)]));
    for (const key of ['feature', 'preferred_feature']) {
        const remaining = params.getAll(key).filter(value => !blocked.has(canonicalFeature(value)));
        params.delete(key);
        for (const value of remaining)
            params.append(key, value);
    }
    params.set('guests', String(form.guests));
    if (!params.has('max_guests') && form.requireCapacity)
        params.set('max_guests', String(form.guests));
    // Preserve full years in numeric ranges. The legacy date parser did not accept them.
    const range = explicitDateRange(text);
    if (range) {
        params.set('check_in', range[0]);
        params.set('check_out', range[1]);
    }
    const parsedStart = params.get('check_in'), parsedEnd = params.get('check_out'), parsedNights = params.get('nights');
    let start = parsedStart ?? form.checkIn, end = parsedEnd ?? form.checkOut;
    if (!parsedStart && params.has('month')) {
        const month = Number(params.get('month'));
        const requestedYear = params.get('year') ?? String(new Date().getFullYear() + (month < new Date().getMonth() + 1 ? 1 : 0));
        if (start.slice(0, 7) !== `${requestedYear}-${String(month).padStart(2, '0')}`)
            start = `${requestedYear}-${String(month).padStart(2, '0')}-01`;
        end = validIsoDate(start) ? addNights(start, Number(parsedNights) || dateNights(form.checkIn, form.checkOut)) : end;
        params.set('year', requestedYear);
    }
    else if (!parsedStart && parsedNights && validIsoDate(start))
        end = addNights(start, Number(parsedNights));
    if (!validIsoDate(start) || !validIsoDate(end))
        throw new Error('Bitte gib ein gültiges Kalenderdatum ein.');
    const nights = dateNights(start, end);
    const mentionedNights = text.match(/\b(\d+)\s*(?:nächte|naechte|nights)\b/);
    if (range && mentionedNights && Number(mentionedNights[1]) !== nights)
        throw new Error('Die genannte Dauer passt nicht zum Datum.');
    params.set('check_in', start);
    params.set('check_out', end);
    params.set('nights', String(nights));
    // Date ranges determine the month, rather than an unrelated substring such as “Mailand”.
    if (parsedStart || range) {
        params.set('year', start.slice(0, 4));
        params.set('month', String(Number(start.slice(5, 7))));
    }
    const review = text.match(/\b(?:bewertung|score)\D{0,30}(\d+(?:[.,]\d+)?)\s*(?:\/|von)\s*(5|10)\b/);
    if (review) {
        params.set('review_scale', review[2]);
        if (!params.has('min_review_score'))
            params.set('min_review_score', review[1].replace(',', '.'));
    }
    const scoreNumber = '(\\d+(?:[.,]\\d+)?)';
    const scoreRange = text.match(new RegExp(`\\b(?:bewertung|score)\\s+(?:zwischen\\s+)?${scoreNumber}\\s*(?:bis|und|[-–])\\s*${scoreNumber}\\b`));
    const scoreMax = text.match(new RegExp(`\\b(?:bewertung|score)\\s+(?:maximal|höchstens|hoechstens|bis|max)\\s*${scoreNumber}\\b`));
    const scoreExact = text.match(new RegExp(`\\b(?:bewertung|score)\\s+genau\\s*${scoreNumber}\\b`));
    if (scoreRange) {
        params.set('min_review_score', scoreRange[1].replace(',', '.'));
        params.set('max_review_score', scoreRange[2].replace(',', '.'));
    }
    if (scoreMax) {
        params.delete('min_review_score');
        params.set('max_review_score', scoreMax[1].replace(',', '.'));
    }
    if (scoreExact) {
        params.delete('min_review_score');
        params.set('review_score', scoreExact[1].replace(',', '.'));
    }
    if (/(?:pro|je|die)\s+(?:nacht|übernachtung|uebernachtung)/.test(text) && !/\b(?:insgesamt|gesamtbudget|gesamtpreis)\b/.test(text)) {
        params.delete('max_total_price');
        params.delete('min_total_price');
        params.delete('total_budget');
    }
    const zeroPrice = text.match(/\b(?:bis|maximal|höchstens|hoechstens|max)\s+0(?:[.,]0{1,2})?\s*(?:euro|€)\s*((?:pro|je|die)\s+nacht)?/);
    if (zeroPrice)
        params.set(zeroPrice[1] ? 'max_price_per_night' : 'max_total_price', '0');
    const totalRaw = params.get('max_total_price') ?? params.get('total_budget');
    const total = Number(totalRaw);
    if (totalRaw !== null && nights > 0 && Number.isFinite(total) && total >= 0)
        params.set('max_price_per_night', String(Math.min(Number(params.get('max_price_per_night') ?? Infinity), Math.floor(total / nights * 100) / 100)));
    if (params.has('min_total_price') && nights > 0)
        params.set('min_price_per_night', String(Math.max(Number(params.get('min_price_per_night') ?? 0), Math.ceil(Number(params.get('min_total_price')) / nights * 100) / 100)));
    // A per-person nightly amount is not a total budget for the whole trip.
    const perPerson = text.match(/(\d+(?:[.,]\d{1,2})?)\s*(?:€|euro)\s*(?:pro|je)\s*person\s*(?:und|pro|je)?\s*(?:nacht|übernachtung)/);
    if (perPerson) {
        params.set('max_price_per_night', String(Number(perPerson[1].replace(',', '.')) * Number(params.get('max_guests') ?? form.guests)));
        params.delete('max_total_price');
        params.delete('total_budget');
    }
    if ([...params.keys()].some(key => /price|budget/.test(key)))
        params.set('currency', 'EUR');
    // Turn recognised but unsupported semantic details into a visible limitation.
    const retainedFeatures = new Set([...params.getAll('feature'), ...params.getAll('must_feature'), ...params.getAll('preferred_feature')]);
    const contextual = new Set(['stars', 'min_stars', 'price_approximate', 'duration_days', 'ignore_preference', 'guest_type']);
    let unsupported = false;
    for (const key of [...new Set(params.keys())])
        if (!apiKeys.has(key)) {
            if (!contextual.has(key) && params.getAll(key).some(value => !retainedFeatures.has(canonicalFeature(value))))
                unsupported = true;
            params.delete(key);
        }
    if (unsupported)
        warnings.push('Einige besondere Wünsche werden noch nicht unterstützt und konnten nicht vollständig geprüft werden. Bitte prüfe sie zusätzlich beim Anbieter.');
    return { params: validateSearchParams(params), warnings };
}
