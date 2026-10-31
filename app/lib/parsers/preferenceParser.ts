// Associate each qualifier with the nearest mentioned feature in its clause.
export function parsePreferences(text: string, params: URLSearchParams) {
    const terms: Record<string, string[]> = { wifi: ['wlan', 'wifi'], pool: ['pool', 'schwimmbad'], sauna: ['sauna'], parking: ['parkplatz', 'parken'], breakfast: ['frühstück', 'fruehstueck'], dogs_allowed: ['hund erlaubt', 'hunde erlaubt', 'hundefreundlich', 'mit hund'], near_sea: ['am meer', 'meernähe', 'meernaehe'], near_lake: ['am see', 'seenähe', 'seenaehe'], near_mountains: ['in den bergen', 'bergnähe'], city_center: ['stadtzentrum', 'innenstadt', 'im zentrum'], old_town: ['altstadt'], near_airport: ['flughafen', 'airport'], near_train_station: ['bahnhof'], near_attractions: ['sehenswürdigkeiten', 'sehenswuerdigkeiten'], rural: ['ländlich', 'laendlich'], nature: ['natur'], kitchen: ['küche', 'kueche'], balcony: ['balkon'], washing_machine: ['waschmaschine'], air_conditioning: ['klimaanlage'] };
    const must = /\b(?:muss|unbedingt|zwingend|auf jeden fall|(?:ist\s+)?pflicht|brauche|benötige|benoetige)\b/gi;
    const preferred = /\b(?:wäre schön|waere schoen|wäre gut|waere gut|am liebsten|gern|gerne|bevorzugt|wenn möglich|wenn moeglich|idealerweise)\b/gi;
    for (const clause of text.split(/[,;.!?\n]|\b(?:aber|während|waehrend)\b/)) {
        const signals = [...Array.from(clause.matchAll(must), m => ({ index: m.index!, length: m[0].length, key: 'must_feature' })), ...Array.from(clause.matchAll(preferred), m => ({ index: m.index!, length: m[0].length, key: 'preferred_feature' }))];
        for (const [feature, aliases] of Object.entries(terms)) {
            for (const alias of aliases) {
                const index = clause.indexOf(alias);
                if (index < 0 || !signals.length)
                    continue;
                const distance = (signal: typeof signals[number]) => Math.max(0, signal.index - index - alias.length, index - signal.index - signal.length);
                const signal = [...signals].sort((a, b) => distance(a) - distance(b) || Number(b.key === 'must_feature') - Number(a.key === 'must_feature'))[0];
                params.append(signal.key, feature);
                break;
            }
        }
    }
}
