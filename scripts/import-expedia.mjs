import nextEnv from '@next/env';
import { createClient } from '@supabase/supabase-js';
import XLSX from 'xlsx';
import fs from 'node:fs';

nextEnv.loadEnvConfig(process.cwd());
const file = process.argv.find(a => a.endsWith('.xlsx')) ?? 'data/LISTE AFFILATE.xlsx';
const apply = process.argv.includes('--apply');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL oder SUPABASE_SECRET_KEY fehlt in .env.local');
if (!fs.existsSync(file)) throw new Error(`Excel-Datei fehlt: ${file}`);
const wb = XLSX.readFile(file);
const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {defval: ''});
const clean = v => String(v ?? '').trim();
const num = v => clean(v) !== '' && Number.isFinite(Number(v)) ? Number(v) : null;
const validUrl = (v, allowed) => {try {const u=new URL(clean(v));return u.protocol==='https:' && allowed.some(h => u.hostname===h || u.hostname.endsWith('.'+h));}catch{return false;}};
const entries=[]; const skipped=[];
for (const r of rows) {
 const id=clean(r.id), name=clean(r.name), affiliate=clean(r.affiliate_url);
 if (!id || !name || !validUrl(affiliate,['expedia.com','expedia.de'])) {skipped.push({id,name,reason:'ID, Name oder gültiger Expedia-Affiliate-Link fehlt'});continue;}
 const type=clean(r.accommodation_type);
 if (type !== 'hotel') {skipped.push({id,name,reason:'Kein bestätigter Typ hotel'});continue;}
 entries.push({excel_id:id,name,accommodation_type:type,country:clean(r.country)||null,region:clean(r.region)||null,city:clean(r.city)||null,source_url:validUrl(r.source_url,['expedia.de','expedia.com'])?clean(r.source_url):null,affiliate_url:affiliate,review_score:num(r.review_score),hotel_stars:num(r.hotel_stars),status:clean(r.status)||null,is_active:true,updated_at:new Date().toISOString()});
}
console.log(`Excel-Zeilen: ${rows.length} | Importbereit: ${entries.length} | Übersprungen: ${skipped.length}`);
console.table(entries.slice(0,10).map(x=>({id:x.excel_id,name:x.name,affiliate:x.affiliate_url})));
if (!apply) {console.log('Vorschau: Keine Datenbankänderung. Für Import --apply anhängen.');process.exit(0);}
const supabase=createClient(url,key,{auth:{persistSession:false}});
for (let i=0;i<entries.length;i+=100) {
 const {error}=await supabase.from('expedia_accommodations').upsert(entries.slice(i,i+100),{onConflict:'excel_id'});
 if (error) throw new Error(error.message);
}
console.log(`Erfolgreich importiert/aktualisiert: ${entries.length}.`);
