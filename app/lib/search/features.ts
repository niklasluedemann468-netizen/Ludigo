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
export function featureValue(row: Record<string, unknown>, value: string, linked: ReadonlySet<string> = new Set()): boolean | null {
    const key = canonicalFeature(value);
    const columns = featureColumns[key] ?? [key, `has_${key}`];
    const explicit = columns.map(column => row[column]).find(value => typeof value === 'boolean');
    const linkedTrue = featureAliases(key).some(alias => linked.has(alias));
    const childTrue = featureDescendants(key).some(child => featureValue(row, child, linked) === true);
    // Conflicting data cannot confirm either a positive or a negative requirement.
    if (explicit === false && (linkedTrue || childTrue))
        return null;
    if (typeof explicit === 'boolean')
        return explicit;
    return linkedTrue || childTrue ? true : null;
}
