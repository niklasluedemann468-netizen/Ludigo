
import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;
import { createClient } from "@supabase/supabase-js";
import { parse } from "csv-parse/sync";
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";

loadEnvConfig(process.cwd());

const filePath = process.argv[2];

if (!filePath) {
  console.error("Bitte den Pfad zur CSV.gz-Datei angeben.");
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !secretKey) {
  throw new Error("Supabase-URL oder Secret Key fehlt.");
}

const supabase = createClient(supabaseUrl, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const numberOrNull = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const result = Number(value);
  return Number.isFinite(result) ? result : null;
};

const input = readFileSync(filePath);
const csvText = filePath.endsWith(".gz")
  ? gunzipSync(input).toString("utf8")
  : input.toString("utf8");

const records = parse(csvText, {
  columns: true,
  skip_empty_lines: true,
  bom: true,
});

const campsites = records
  .filter((r) => r.aw_product_id && r.aw_deep_link)
  .map((r) => ({
    aw_product_id: r.aw_product_id,
    merchant_product_id: r.merchant_product_id || null,
    name: r.product_name || r["Travel:hotel_name"] || null,
    description: r.description || null,
    image_url: r.merchant_image_url || r.aw_image_url || null,
    affiliate_url: r.aw_deep_link,
    merchant_url: r.merchant_deep_link || null,
    location: r["Travel:location"] || null,
    address: r["Travel:hotel_address"] || null,
    city: r["Travel:destination_city"] || null,
    region: r["Travel:destination_region"] || null,
    country: r["Travel:destination_country"] || null,
    latitude: numberOrNull(r["Travel:latitude"]),
    longitude: numberOrNull(r["Travel:longitude"]),
    price: numberOrNull(r.search_price),
    currency: r.currency || null,
    rating: numberOrNull(r.rating || r.average_rating),
    review_count: numberOrNull(r.reviews),
    availability: r["Travel:availability"] || null,
    duration: numberOrNull(r["Travel:duration"]),
    raw_data: r,
    updated_at: new Date().toISOString(),
  }));

console.log(`${campsites.length} Campingplatz-Einträge gefunden.`);

for (let i = 0; i < campsites.length; i += 100) {
  const batch = campsites.slice(i, i + 100);

  const { error } = await supabase
    .from("camping_info_campsites")
    .upsert(batch, { onConflict: "aw_product_id" });

  if (error) {
    console.error("Importfehler:", error.message);
    process.exit(1);
  }

  console.log(`${Math.min(i + 100, campsites.length)} importiert`);
}

console.log("Campingplatz-Import abgeschlossen!");
