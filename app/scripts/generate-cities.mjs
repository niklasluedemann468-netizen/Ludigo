import fs from "node:fs";
import path from "node:path";
import AdmZip from "adm-zip";

const SOURCE_URL =
  "https://download.geonames.org/export/dump/cities15000.zip";

const OUTPUT_FILE = path.resolve("app/data/cities.ts");

// Erstmal 5.000 wichtige Städte.
// Kann später problemlos auf z. B. 10.000 oder 20.000 erhöht werden.
const MAX_CITIES = 5000;

console.log("Lade GeoNames-Städtedaten herunter...");

const response = await fetch(SOURCE_URL);

if (!response.ok) {
  throw new Error(
    `GeoNames konnte nicht geladen werden: ${response.status}`
  );
}

const zipBuffer = Buffer.from(await response.arrayBuffer());

console.log("Entpacke cities15000.zip...");

const zip = new AdmZip(zipBuffer);
const entry = zip.getEntry("cities15000.txt");

if (!entry) {
  throw new Error("cities15000.txt wurde im ZIP nicht gefunden.");
}

const text = entry.getData().toString("utf8");

const countryNames = new Intl.DisplayNames(["de"], {
  type: "region",
});

function clean(value) {
  return value.trim();
}

function normalizeAlias(alias) {
  return alias
    .trim()
    .replace(/\s+/g, " ");
}

const allowedShortCities = new Set([
  "rom",
  "ulm",
  "kos",
  "pau",
  "ely",
  "rye",
]);

const blockedAliases = new Set([
  // Deutsch
  "ein",
  "eine",
  "einer",
  "einem",
  "einen",
  "der",
  "die",
  "das",
  "den",
  "dem",
  "des",
  "und",
  "oder",
  "mit",
  "ohne",
  "für",
  "fuer",
  "von",
  "vom",
  "zum",
  "zur",
  "auf",
  "aus",
  "bei",
  "am",
  "im",
  "in",
  "an",
  "ist",
  "sind",
  "nach",
  "vor",

  // Englische häufige Wörter
  "the",
  "and",
  "with",
  "without",
  "for",
  "from",
  "near",
  "at",
  "to",
  "of",
  "in",
  "on",

  // Unterkunft
  "hotel",
  "hostel",
  "villa",
  "haus",
  "home",
  "zimmer",
  "apartment",
  "apartments",
  "ferienwohnung",
  "camp",
  "camping",
  "campsite",

  // Reise / Umgebung
  "urlaub",
  "reise",
  "reisen",
  "meer",
  "see",
  "strand",
  "beach",
  "lake",
  "berg",
  "berge",
  "mountain",
  "mountains",

  // Ausstattung
  "pool",
  "wifi",
  "wlan",
  "parking",
  "parkplatz",
  "sauna",

  // Allgemeine Ortsbegriffe
  "city",
  "town",
  "village",
]);

function isUsefulAlias(alias) {
  if (!alias || typeof alias !== "string") {
    return false;
  }

  const normalized = alias
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

  if (!normalized) {
    return false;
  }

  // Sehr lange Alias-Bezeichnungen sind für unsere
  // natürliche Reisesuche meistens nicht sinnvoll.
  if (normalized.length > 80) {
    return false;
  }

  // Kurze Begriffe verursachen besonders viele Fehlmatches.
  // Bekannte echte kurze Städtenamen erlauben wir gezielt.
  if (
    normalized.length < 4 &&
    !allowedShortCities.has(normalized)
  ) {
    return false;
  }

  // Reine Zahlen sind keine sinnvollen Städtenamen.
  if (/^\d+$/.test(normalized)) {
    return false;
  }

  // Alias muss mindestens einen Buchstaben enthalten.
  if (!/\p{L}/u.test(normalized)) {
    return false;
  }

  // URLs, E-Mail-artige Werte usw. ausschließen.
  if (
    normalized.includes("http://") ||
    normalized.includes("https://") ||
    normalized.includes("www.") ||
    normalized.includes("@")
  ) {
    return false;
  }

  // Häufige Wörter dürfen niemals als Stadt-Alias
  // interpretiert werden.
  if (blockedAliases.has(normalized)) {
    return false;
  }

  return true;
}

const cities = text
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    const columns = line.split("\t");

    const name = clean(columns[1] ?? "");
    const asciiName = clean(columns[2] ?? "");
    const alternateNames = clean(columns[3] ?? "");
    const countryCode = clean(columns[8] ?? "");
    const population = Number(columns[14] ?? 0);

    const country =
      countryNames.of(countryCode) || countryCode;

const aliases = new Set();

const officialName = normalizeAlias(name).toLowerCase();
const officialAsciiName = normalizeAlias(asciiName).toLowerCase();

// Offizieller Name bekommt immer höchste Priorität.
if (officialName) {
  aliases.add(officialName);
}

// ASCII-Schreibweise ebenfalls behalten,
// z. B. "munchen" zusätzlich zu "münchen".
if (
  officialAsciiName &&
  officialAsciiName !== officialName
) {
  aliases.add(officialAsciiName);
}

// Alternative GeoNames-Bezeichnungen separat sammeln.
const usefulAlternateNames = alternateNames
  .split(",")
  .map((alias) => normalizeAlias(alias).toLowerCase())
  .filter((alias) => {
    if (!isUsefulAlias(alias)) {
      return false;
    }

    // Bereits vorhandene Namen nicht erneut übernehmen.
    if (aliases.has(alias)) {
      return false;
    }

    return true;
  });

// Kürzere, praktikable Schreibweisen bevorzugen.
// Extrem lange oder exotische Alternativnamen landen
// dadurch nicht so schnell in unserer Suchdatei.
usefulAlternateNames.sort((a, b) => {
  const wordDifference =
    a.split(" ").length - b.split(" ").length;

  if (wordDifference !== 0) {
    return wordDifference;
  }

  return a.length - b.length;
});

// Maximal 10 zusätzliche Alternativnamen pro Stadt.
// Zusammen mit offiziellem Namen und ASCII-Name
// bleiben die Daten überschaubar.
for (const alias of usefulAlternateNames.slice(0, 10)) {
  aliases.add(alias);
}

const aliasList = [...aliases];

    return {
      name,
      country,
      aliases: aliasList,
      population,
    };
  })
  .filter((city) => city.name && city.country)
  .sort((a, b) => b.population - a.population)
  .slice(0, MAX_CITIES);

const output = `export type CityEntry = {
  name: string;
  country: string;
  aliases: string[];
};

export const cities: CityEntry[] = ${JSON.stringify(
  cities.map(({ name, country, aliases }) => ({
    name,
    country,
    aliases,
  })),
  null,
  2
)};
`;

fs.mkdirSync(path.dirname(OUTPUT_FILE), {
  recursive: true,
});

fs.writeFileSync(OUTPUT_FILE, output, "utf8");

console.log("");
console.log(`Fertig: ${cities.length} Städte erzeugt.`);
console.log(`Datei: ${OUTPUT_FILE}`);