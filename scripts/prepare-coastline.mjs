import fs from 'node:fs';
import crypto from 'node:crypto';
import { deflateRawSync } from 'node:zlib';
const input = process.argv[2];
if (!input) throw Error('Pfad zur Natural-Earth-Coastline-GeoJSON fehlt.');
const bytes = fs.readFileSync(input), data = JSON.parse(bytes.toString());
const bounds = [-25, 25, 40, 73], segments = [];
for (const feature of data.features) {
  if (feature.properties.featurecla !== 'Coastline') continue;
  const lines = feature.geometry.type === 'LineString' ? [feature.geometry.coordinates] : feature.geometry.type === 'MultiLineString' ? feature.geometry.coordinates : [];
  for (const line of lines) for (let i = 1; i < line.length; i++) {
    const [ax, ay] = line[i - 1], [bx, by] = line[i];
    if (Math.max(ax, bx) < bounds[0] || Math.min(ax, bx) > bounds[2] || Math.max(ay, by) < bounds[1] || Math.min(ay, by) > bounds[3]) continue;
    segments.push([ax, ay, bx, by]);
  }
}
const packed = Buffer.alloc(segments.length * 16);
segments.forEach((segment, id) => segment.forEach((value, axis) => packed.writeInt32LE(Math.round(value * 1e6), id * 16 + axis * 4)));
const output = { source: 'Natural Earth ne_10m_coastline', url: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_coastline.geojson', sha256: crypto.createHash('sha256').update(bytes).digest('hex'), license: 'public domain', bounds, encoding: 'deflate-int32le-1e6', segmentCount: segments.length, data: deflateRawSync(packed, { level: 9 }).toString('base64') };
fs.writeFileSync('app/data/coastline-europe.json', JSON.stringify(output));
console.log(JSON.stringify({ segments: segments.length, bytes: fs.statSync('app/data/coastline-europe.json').size, sha256: output.sha256 }));
