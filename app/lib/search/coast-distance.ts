// Server-side only: offline map data never goes into the search UI bundle.
import coastline from '../../data/coastline-europe.json';
import { inflateRawSync } from 'node:zlib';
import { Buffer } from 'node:buffer';
const packed = inflateRawSync(Buffer.from(coastline.data, 'base64'));
const segment = (id: number) => [0, 4, 8, 12].map(axis => packed.readInt32LE(id * 16 + axis) / 1e6);
const cell = 0.25, index = new Map<string, number[]>();
for (let i = 0; i < coastline.segmentCount; i++) {
  const [ax, ay, bx, by] = segment(i);
  for (let x = Math.floor(Math.min(ax, bx) / cell); x <= Math.floor(Math.max(ax, bx) / cell); x++)
    for (let y = Math.floor(Math.min(ay, by) / cell); y <= Math.floor(Math.max(ay, by) / cell); y++) {
      const key = `${x},${y}`;
      if (!index.has(key)) index.set(key, []);
      index.get(key)!.push(i);
    }
}
export function nearbyCoastDistance(latitude: unknown, longitude: unknown): number | null {
  const numeric = (value: unknown) => (typeof value === 'number' || typeof value === 'string' && value.trim()) && Number.isFinite(Number(value)) ? Number(value) : null;
  const lat = numeric(latitude), lon = numeric(longitude);
  if (lat === null || lon === null || lat < coastline.bounds[1] || lat > coastline.bounds[3] || lon < coastline.bounds[0] || lon > coastline.bounds[2]) return null;
  const cx = Math.floor(lon / cell), cy = Math.floor(lat / cell), candidates = new Set<number>();
  for (let x = cx - 1; x <= cx + 1; x++) for (let y = cy - 1; y <= cy + 1; y++) for (const id of index.get(`${x},${y}`) ?? []) candidates.add(id);
  const sx = 111195 * Math.cos(lat * Math.PI / 180), sy = 111195;
  let best = Infinity;
  for (const id of candidates) {
    const [aLon, aLat, bLon, bLat] = segment(id);
    const ax = (aLon - lon) * sx, ay = (aLat - lat) * sy, dx = (bLon - aLon) * sx, dy = (bLat - aLat) * sy;
    const t = Math.max(0, Math.min(1, -(ax * dx + ay * dy) / (dx * dx + dy * dy || 1)));
    best = Math.min(best, Math.hypot(ax + t * dx, ay + t * dy));
  }
  // This is approximate proximity to a mapped coastline, not a beach/access guarantee.
  return best <= 1000 ? Math.round(best) : null;
}
