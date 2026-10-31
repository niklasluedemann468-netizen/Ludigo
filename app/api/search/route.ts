import OpenAI from 'openai';
import { knownFeatures } from '../../lib/search/catalog';
import { accommodationTypes } from '../../lib/search/criteria';
import { mergeAiCriteria } from '../../lib/search/ai-criteria';
// An instance-local guard complements the hosting provider's traffic limits.
const requests = new Map<string, {
    start: number;
    count: number;
}>();
function allowed(request: Request): boolean {
    const now = Date.now(), key = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
    for (const [id, entry] of requests)
        if (now - entry.start > 60000)
            requests.delete(id);
    if (!requests.has(key)) {
        if (requests.size >= 2000)
            return false;
        requests.set(key, { start: now, count: 0 });
    }
    const entry = requests.get(key)!;
    entry.count++;
    return entry.count <= 20;
}
const nullableNumber = (min: number, max: number, integer = false) => ({ type: [integer ? 'integer' : 'number', 'null'], minimum: min, maximum: max });
const properties = {
    country: { type: ['string', 'null'], maxLength: 120 }, region: { type: ['string', 'null'], maxLength: 120 }, city: { type: ['string', 'null'], maxLength: 120 },
    month: nullableNumber(1, 12, true), nights: nullableNumber(1, 3650, true), guests: nullableNumber(1, 1000, true),
    total_budget: nullableNumber(0, 100000000), max_price_per_night: nullableNumber(0, 10000000),
    accommodation_type: { type: ['string', 'null'], enum: [...accommodationTypes, null] },
    features: { type: 'array', items: { type: 'string', enum: [...knownFeatures] }, maxItems: 40 },
};
export async function POST(request: Request) {
    let query: unknown;
    try {
        if (Number(request.headers.get('content-length')) > 20000)
            return Response.json({ error: 'Der Suchtext ist zu lang.' }, { status: 413 });
        const body = await request.json();
        query = body?.query;
    }
    catch {
        return Response.json({ error: 'Bitte sende einen gültigen Suchtext.' }, { status: 400 });
    }
    if (typeof query !== 'string' || !query.trim() || query.length > 3000)
        return Response.json({ error: 'Bitte gib einen Suchtext mit höchstens 3.000 Zeichen ein.' }, { status: 400 });
    if (!allowed(request))
        return Response.json({ error: 'Bitte warte kurz, bevor du erneut suchst.' }, { status: 429, headers: { 'Retry-After': '60' } });
    if (!process.env.OPENAI_API_KEY)
        return Response.json({ error: 'Die ergänzende Textauswertung ist gerade nicht verfügbar.' }, { status: 503 });
    try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 8000, maxRetries: 0 });
        const response = await openai.responses.create({
            model: process.env.OPENAI_SEARCH_MODEL || 'gpt-4.1-mini',
            max_output_tokens: 1000,
            text: { format: { type: 'json_schema', name: 'travel_criteria', strict: true, schema: { type: 'object', additionalProperties: false, properties, required: Object.keys(properties) } } },
            input: [{ role: 'system', content: 'Extrahiere ausschließlich ausdrücklich genannte Reisekriterien. Erfinde keine Orte oder Merkmale. Nicht genannte Werte sind null. Länder und Orte mit den deutschen gebräuchlichen Namen. features enthält ausschließlich positiv verlangte Pflichtmerkmale; keine verneinten, unwichtigen oder nur optionalen Wünsche. Nutze nur die vorgegebenen Keys. 600 Euro insgesamt ist total_budget; 100 Euro pro Nacht ist max_price_per_night. Antworte als JSON.' }, { role: 'user', content: query.trim() }],
        });
        if (response.status !== 'completed' || !response.output_text)
            throw new Error('Incomplete response');
        const raw: unknown = JSON.parse(response.output_text), params = new URLSearchParams();
        mergeAiCriteria(params, raw, null);
        const criteria = { country: params.get('country'), region: params.get('region'), city: params.get('city'), month: params.has('month') ? Number(params.get('month')) : null, nights: params.has('nights') ? Number(params.get('nights')) : null, guests: params.has('max_guests') ? Number(params.get('max_guests')) : null, total_budget: params.has('max_total_price') ? Number(params.get('max_total_price')) : null, max_price_per_night: params.has('max_price_per_night') ? Number(params.get('max_price_per_night')) : null, accommodation_type: params.get('type'), features: params.getAll('feature') };
        return Response.json({ criteria });
    }
    catch {
        return Response.json({ error: 'Die ergänzende Textauswertung ist gerade nicht verfügbar.' }, { status: 503 });
    }
}
