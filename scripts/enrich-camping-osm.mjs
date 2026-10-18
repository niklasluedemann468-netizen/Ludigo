
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs/promises";

nextEnv.loadEnvConfig(process.cwd());

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

const OVERPASS_URL =
  "https://overpass-api.de/api/interpreter";

// Nur Testmodus – keine Datenbankänderungen.
const APPLY = false;

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function distanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const rad = (x) => (x * Math.PI) / 180;

  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) *
      Math.cos(rad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
}

function amenitiesFromTags(tags) {
  const yes = (key) =>
    ["yes", "true", "designated", "1"].includes(
      String(tags[key] ?? "").toLowerCase()
    );

  return {
    has_wifi:
      yes("internet_access") ||
      ["wlan", "wifi"].includes(tags.internet_access)
        ? true
        : null,

    has_pool: yes("swimming_pool") ? true : null,
    has_parking: yes("parking") ? true : null,
    has_restaurant: yes("restaurant") ? true : null,
    dogs_allowed: yes("dog") ? true : null,
    family_friendly: yes("family_friendly") ? true : null,
    accessible: yes("wheelchair") ? true : null
  };
}

// Alle Campingplätze aus Supabase laden.
const campsites = [];

for (let from = 0; ; from += 1000) {
  const { data, error } = await supabase
    .from("camping_info_campsites")
    .select(`
      id,
      name,
      latitude,
      longitude
    `)
    .order("id")
    .range(from, from + 999);

  if (error) throw error;

  campsites.push(...(data ?? []));

  if ((data ?? []).length < 1000) break;
}

console.log("Campingplätze geladen:", campsites.length);

// Länderweise abrufen statt einzeln.
// Zunächst Deutschland, Österreich, Italien usw.
const countries = [
  "Deutschland",
  "Österreich",
  "Italien",
  "Frankreich",
  "Schweiz",
  "Niederlande",
  "Dänemark",
  "Kroatien",
  "Spanien",
  "Slowenien",
  "Polen"
];

const osmElements = [];

for (const country of countries) {
  console.log("Lade OSM-Campingplätze:", country);

  const query = `
    [out:json][timeout:60];
    area["name"="${country}"]["boundary"="administrative"]
      ->.searchArea;
    nwr["tourism"="camp_site"](area.searchArea);
    out center tags;
  `;

  try {
    const response = await fetch(OVERPASS_URL, {
      method: "POST",
      body: new URLSearchParams({ data: query }),
      signal: AbortSignal.timeout(90000)
    });

    if (!response.ok) {
      console.log("HTTP-Fehler:", response.status);
      continue;
    }

    const json = await response.json();

    osmElements.push(...(json.elements ?? []));

    console.log(
      "Geladen:",
      json.elements?.length ?? 0
    );
  } catch (error) {
    console.log("Fehler:", error.message);
  }

  await sleep(5000);
}

console.log("OSM-Datensätze:", osmElements.length);

// Lokal abgleichen.
const results = [];

for (const camp of campsites) {
  const lat = Number(camp.latitude);
  const lon = Number(camp.longitude);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    (lat === 0 && lon === 0)
  ) {
    continue;
  }

  const matches = osmElements.filter((osm) => {
    const osmLat = osm.lat ?? osm.center?.lat;
    const osmLon = osm.lon ?? osm.center?.lon;

    if (
      !Number.isFinite(osmLat) ||
      !Number.isFinite(osmLon)
    ) {
      return false;
    }

    return (
      normalize(osm.tags?.name) === normalize(camp.name) &&
      distanceMeters(lat, lon, osmLat, osmLon) < 300
    );
  });

  if (matches.length !== 1) continue;

  const match = matches[0];

  results.push({
    id: camp.id,
    name: camp.name,
    osm_id: match.id,
    amenities: amenitiesFromTags(match.tags ?? {})
  });
}

await fs.writeFile(
  "camping-osm-ergebnisse.json",
  JSON.stringify(results, null, 2),
  "utf8"
);

console.log("==============================");
console.log("FERTIG");
console.log("Campingplätze:", campsites.length);
console.log("OSM-Datensätze:", osmElements.length);
console.log("Eindeutige Treffer:", results.length);
console.log("Keine Supabase-Daten verändert.");
