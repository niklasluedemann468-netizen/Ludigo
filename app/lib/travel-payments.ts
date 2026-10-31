import type { WorldKey } from './world-content';

export type PaymentOffer = { id: string; world: WorldKey; title: string; description: string; url: string; test: boolean };
export const paymentWorlds: { key: WorldKey; title: string; icon: string; href: string }[] = [
  { key: 'bus', title: 'Busreisen', icon: 'bus', href: '/bustouren-senioren' },
  { key: 'bike', title: 'Fahrradtouren', icon: 'bike', href: '/bike' },
  { key: 'surprise', title: 'Überraschungsreisen', icon: 'spark', href: '/surprise' },
];

// Only hosted Stripe Payment Links are accepted. No customer or card data is handled here.
export function stripePaymentUrl(value: unknown, allowTest = false): { url: string; test: boolean } | null {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.hostname !== 'buy.stripe.com' || url.port || url.username || url.password || url.search || url.hash) return null;
    if (!/^\/(?:test_)?[a-zA-Z0-9]{6,100}$/.test(url.pathname)) return null;
    const test = url.pathname.startsWith('/test_');
    return test && !allowTest ? null : { url: url.href, test };
  } catch { return null; }
}

export function readPaymentOffers(raw: string | undefined, allowTest = false): PaymentOffer[] {
  if (!raw) return [];
  try {
    const values: unknown = JSON.parse(raw);
    if (!Array.isArray(values) || values.length > 50) return [];
    const offers: PaymentOffer[] = [], seen = new Set<string>();
    for (const value of values) {
      if (!value || typeof value !== 'object') continue;
      const item = value as Record<string, unknown>, link = stripePaymentUrl(item.url, allowTest);
      if (!link || typeof item.id !== 'string' || !/^[a-z0-9][a-z0-9-]{0,59}$/.test(item.id) || seen.has(item.id)) continue;
      if (!paymentWorlds.some(world => world.key === item.world) || typeof item.title !== 'string' || !item.title.trim() || item.title.length > 120) continue;
      if (typeof item.description !== 'string' || !item.description.trim() || item.description.length > 600) continue;
      seen.add(item.id);
      offers.push({ id: item.id, world: item.world as WorldKey, title: item.title.trim(), description: item.description.trim(), ...link });
    }
    return offers;
  } catch { return []; }
}

export function configuredPaymentOffers(): PaymentOffer[] {
  return readPaymentOffers(process.env.LUDIGO_TRAVEL_PAYMENT_LINKS, process.env.LUDIGO_PAYMENTS_TEST_MODE === 'true');
}
