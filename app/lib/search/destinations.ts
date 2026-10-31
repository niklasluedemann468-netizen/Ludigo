import { cities } from '../../data/cities';
import { locations } from '../../data/locations';
export type Destination = {
    city: string | null;
    region: string | null;
    country: string | null;
};
const plain = (value: string) => value.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').trim().replace(/\s+/g, ' ');
function whole(query: string, value: string): boolean {
    const escaped = plain(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return escaped.length >= 3 && new RegExp(`(^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`).test(plain(query));
}
export function placeIntent(query: string): string | null {
    const match = query.match(/\b(?:in|nach|bei|auf)\s+(?!(?:der|dem|den|einem|einer|einen|die|das|wassernähe|wassernaehe|strandnähe|strandnaehe|meernähe|meernaehe|seenähe|seenaehe)\b)([^\d,;.!?]+?)(?=\s+(?:\d|mit|ohne|für|fuer|bis|ab|am|im|vom|und|bewertung|mindestens|maximal|in(?=\s+(?:wasser|strand|meer|see|fluss))|muss|unbedingt|strandnah\w*|wassernähe|wassernaehe|direkt|barrierefrei\w*|barrierefreiheit|rollstuhl\w*|behinderten\w*|stufenlos\w*|pool|wlan|wifi|sauna)\b|[,;.!?]|$)/i);
    const value = match?.[1].trim();
    return value && value.length <= 120 ? value : null;
}
export function placeResolved(params: URLSearchParams, target: string): boolean {
    const wanted = plain(target);
    if (['city', 'region', 'country'].some(key => params.has(key) && plain(params.get(key)!) === wanted))
        return true;
    if (cities.some(city => city.name === params.get('city') && city.aliases.some(alias => plain(alias) === wanted)))
        return true;
    return locations.some(location => (location.type === 'country' ? location.country === params.get('country') : location.name === params.get('region')) && location.aliases.some(alias => plain(alias) === wanted));
}
export function resolveDestination(query: string, rows: Destination[]): {
    destination: Destination | null;
    ambiguous: boolean;
} {
    const target = placeIntent(query);
    const candidates = rows.filter(row => row.city && (target ? plain(row.city) === plain(target) : whole(query, row.city)));
    if (candidates.length) {
        const longest = Math.max(...candidates.map(row => row.city!.length));
        let matches = candidates.filter(row => row.city!.length === longest);
        const countries = matches.filter(row => row.country && whole(query, row.country));
        if (countries.length)
            matches = countries;
        const regions = matches.filter(row => row.region && whole(query, row.region));
        if (regions.length)
            matches = regions;
        if (new Set(matches.map(row => plain(row.country ?? ''))).size > 1)
            return { destination: null, ambiguous: true };
        const row = matches[0];
        return { destination: { city: row.city, country: row.country, region: new Set(matches.map(row => plain(row.region ?? ''))).size === 1 ? row.region : null }, ambiguous: false };
    }
    // With an explicit unknown town, a known enclosing region must not replace that town.
    for (const key of ['region', 'country'] as const) {
        const matches = rows.filter(row => row[key] && (target ? plain(row[key]!) === plain(target) : whole(query, row[key]!)));
        if (!matches.length)
            continue;
        const longest = Math.max(...matches.map(row => row[key]!.length));
        const best = matches.filter(row => row[key]!.length === longest);
        if (new Set(best.map(row => plain(row.country ?? ''))).size > 1)
            return { destination: null, ambiguous: true };
        return { destination: { city: null, region: key === 'region' ? best[0].region : null, country: best[0].country }, ambiguous: false };
    }
    return { destination: null, ambiguous: false };
}
