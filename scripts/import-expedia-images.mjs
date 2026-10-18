import nextEnv from '@next/env';
import { createClient } from '@supabase/supabase-js';
import XLSX from 'xlsx';
import fs from 'node:fs';

nextEnv.loadEnvConfig(process.cwd());
const file = process.argv.find(a => a.toLowerCase().endsWith('.xlsx')) ?? 'data/LISTE AFFILATE.xlsx';
const apply = process.argv.includes('--apply');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
if (!url || !key) throw new Error('Supabase-Umgebungsvariablen fehlen.');
if (!fs.existsSync(file)) throw new Error(`Excel-Datei fehlt: ${file}`);
const wb = XLSX.readFile(file);
const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
const clean = v => String(v ?? '').trim();
const selected = [];
for (const [index, r] of rows.entries()) {
  const excel_id = clean(r.id);
  const image_url = clean(r.image_url);
  if (!/^\/hotels\/[1-7]\.jpg$/.test(image_url)) continue;
  if (!excel_id) throw new Error(`Excel-Zeile ${index + 2}: ID fehlt`);
  const localPath = `public${image_url}`;
  if (!fs.existsSync(localPath)) throw new Error(`Bilddatei fehlt: ${localPath}`);
  selected.push({ excel_id, image_url, name: clean(r.name) });
}
if (selected.length !== 7 || new Set(selected.map(x => x.image_url)).size !== 7 || new Set(selected.map(x => x.excel_id)).size !== 7) {
  throw new Error(`Erwartet: 7 eindeutige Hotels und 7 Bilder. Gefunden: ${selected.length}.`);
}
console.table(selected);
if (!apply) {
  console.log('Vorschau erfolgreich. Keine Datenbankänderung. Für Import --apply anhängen.');
  process.exit(0);
}
const supabase = createClient(url, key, { auth: { persistSession: false } });
for (const item of selected) {
  const { data, error } = await supabase.from('expedia_accommodations')
    .update({ image_url: item.image_url })
    .eq('excel_id', item.excel_id)
    .select('excel_id,image_url');
  if (error) throw new Error(`Hotel ${item.excel_id}: ${error.message}`);
  if (!data || data.length !== 1) throw new Error(`Hotel ${item.excel_id}: erwartet 1 aktualisierten Datensatz, erhalten ${data?.length ?? 0}`);
}
console.log('7 Hotelbilder erfolgreich in Supabase aktualisiert.');
