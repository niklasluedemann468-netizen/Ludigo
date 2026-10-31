import { accessibilityTerms } from './accessibility';
export const featureColumns: Record<string, readonly string[]> = {
    pool: ['has_pool', 'pool'], wifi: ['has_wifi', 'wifi'],
    parking: ['has_parking', 'parking'], restaurant: ['has_restaurant', 'restaurant'],
    breakfast: ['has_breakfast', 'breakfast'], air_conditioning: ['has_air_conditioning', 'air_conditioning'],
    kitchen: ['apartment_has_kitchen', 'kitchen'], washing_machine: ['apartment_has_washing_machine', 'washing_machine'],
    near_sea: ['near_sea'], near_lake: ['near_lake'], near_mountains: ['near_mountains'],
    dogs_allowed: ['dogs_allowed'], pets_allowed: ['pets_allowed', 'pets'],
    family_friendly: ['family_friendly'], accessible: ['accessible'],
    wheelchair_accessible: ['wheelchair_accessible'], quiet_place: ['quiet_place'],
    free_parking: ['free_parking'], city_center: ['city_center'], near_airport: ['near_airport'],
};
const aliases: Record<string, string> = { wlan: 'wifi', pets: 'pets_allowed', pet_friendly: 'pets_allowed', dogs: 'dogs_allowed', dog_friendly: 'dogs_allowed', cats: 'cats_allowed', wellness: 'spa', fitness: 'gym', fitness_room: 'gym', fitness_center: 'gym', mountain_location: 'near_mountains' };
const children: Record<string, string[]> = {
    pool: ['private_pool', 'indoor_pool', 'outdoor_pool', 'heated_pool', 'infinity_pool', 'rooftop_pool'],
    parking: ['free_parking', 'private_parking', 'garage'],
    breakfast: ['breakfast_included'], accessible: ['wheelchair_accessible'],
    sauna: ['private_sauna'], spa: ['private_spa'], gym: ['private_gym'], wifi: ['fast_wifi', 'high_speed_internet'],
    balcony: ['private_balcony', 'sunny_balcony'], terrace: ['private_terrace', 'sunny_terrace', 'covered_terrace'], garden: ['private_garden'],
    garage: ['private_garage'], near_beach: ['beachfront'], near_sea: ['seafront'], near_lake: ['lakefront'], tv: ['smart_tv'], kitchen: ['full_kitchen', 'kitchenette'],
};
Object.assign(aliases, { grab_bars: 'grab_rails', accessible_sink: 'low_sink', bicycle_rental: 'bike_rental' });
Object.assign(children, { near_water: ['near_sea', 'near_lake', 'near_river', 'near_beach'], elevator: ['wheelchair_elevator'], shower: ['roll_in_shower'], parking: [...children.parking, 'accessible_parking', 'parking_near_entrance'], pool: [...children.pool, 'accessible_pool'] });
for (const key of [...Object.keys(accessibilityTerms), 'near_water', 'near_river', 'near_beach', 'beachfront', 'seafront', 'lakefront'])
    if (!(key in featureColumns)) featureColumns[key] = [key, `has_${key}`];
children.parking.push('guarded_parking', 'gated_parking', 'secure_underground_parking');
export const featureVocabulary = [...new Set([...Object.keys(featureColumns), ...Object.keys(children), ...Object.values(children).flat()])];
export function canonicalFeature(value: string): string { return aliases[value] ?? value; }
export function featureAliases(value: string): string[] {
    const canonical = canonicalFeature(value);
    return [canonical, ...Object.keys(aliases).filter(key => aliases[key] === canonical)];
}
export function featureDescendants(value: string): string[] { return children[canonicalFeature(value)] ?? []; }
export function featureAncestors(value: string): string[] {
    const target = canonicalFeature(value);
    const contains = (parent: string, seen = new Set<string>()): boolean => {
        if (seen.has(parent))
            return false;
        seen.add(parent);
        return featureDescendants(parent).some(child => child === target || contains(child, new Set(seen)));
    };
    return Object.keys(children).filter(parent => parent !== target && contains(parent));
}
export function featureValue(row: Record<string, unknown>, value: string, linked: ReadonlySet<string> = new Set(), source: ReadonlyMap<string,boolean|null> = new Map()): boolean | null {
    const key = canonicalFeature(value);
    const columns = [...new Set([...(featureColumns[key] ?? [key, `has_${key}`]), ...featureAliases(key).flatMap(alias => [alias, `has_${alias}`])])];
    const facts = columns.map(column => row[column]).filter(value => typeof value === 'boolean');
    if (source.has(key)) { const value=source.get(key); if(typeof value!=='boolean')return null; facts.push(value); }
    if (facts.includes(true) && facts.includes(false)) return null;
    const explicit = facts[0];
    const linkedTrue = featureAliases(key).some(alias => linked.has(alias));
    const childTrue = featureDescendants(key).some(child => featureValue(row, child, linked, source) === true);
    // Conflicting data cannot confirm either a positive or a negative requirement.
    if (explicit === false && (linkedTrue || childTrue))
        return null;
    if (typeof explicit === 'boolean')
        return explicit;
    return linkedTrue || childTrue ? true : null;
}
