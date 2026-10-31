import { createClient } from '@/utils/supabase/server';
import { getCampingSupabase } from '@/app/lib/camping-supabase';
import { placeIntent, type Destination } from './destinations';
type Query = () => {
    range(from: number, to: number): PromiseLike<{
        data: unknown[] | null;
        error: unknown;
    }>;
};
const text = (value: unknown) => typeof value === 'string' && value.trim() ? value.trim() : null;
async function read(build: Query): Promise<Destination[]> {
    const rows: Destination[] = [];
    let offset = 0;
    for (let page = 0; page < 50; page++) {
        const result = await build().range(offset, offset + 999);
        if (result.error || !result.data?.length)
            break;
        for (const value of result.data) {
            if (!value || typeof value !== 'object')
                continue;
            const row = value as Record<string, unknown>;
            rows.push({ city: text(row.city), region: text(row.region), country: text(row.country) });
        }
        offset += result.data.length;
    }
    return rows;
}
export async function destinationData(query: string): Promise<Destination[]> {
    const target = placeIntent(query), pattern = target?.replace(/[\\%_]/g, '\\$&');
    for (const field of (target ? ['city', 'region', 'country'] as const : [null] as const)) {
        const results = await Promise.allSettled([
            (async () => { const client = await createClient(); return read(() => { let q = client.from('accommodations').select('id,city,region,country').eq('is_active', true).order('id', { ascending: true }); return field && pattern ? q.ilike(field, pattern) : q; }); })(),
            (async () => { const client = getCampingSupabase(); return read(() => { let q = client.from('camping_info_campsites').select('id,city,region,country').order('id', { ascending: true }); return field && pattern ? q.ilike(field, pattern) : q; }); })(),
            (async () => { const client = getCampingSupabase(); return read(() => { let q = client.from('expedia_accommodations').select('id,city,region,country').eq('is_active', true).order('id', { ascending: true }); return field && pattern ? q.ilike(field, pattern) : q; }); })(),
        ]);
        const rows = results.flatMap(result => result.status === 'fulfilled' ? result.value : []);
        if (rows.length)
            return rows;
    }
    return [];
}
