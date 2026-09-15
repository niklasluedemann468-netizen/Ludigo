// =========================================================
// ZENTRALE SUCHTEXT-NORMALISIERUNG
// =========================================================

// =========================================================
// ZENTRALE SUCHTEXT-NORMALISIERUNG
// =========================================================

function normalizeForComparison(value: string): string {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss");
}



// Berechnet, wie viele Zeichen sich zwei Wörter unterscheiden.
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}


// =========================================================
// Prüft, ob ein Wort sicher genug korrigiert werden kann.
// =========================================================

function findClosestWord(
  word: string,
  vocabulary: string[]
): string {
  // Sehr kurze Wörter korrigieren wir nicht automatisch.
  // Dadurch verhindern wir z. B. falsche Änderungen bei
  // "am", "im", "in", "mit", "see" usw.
  if (word.length < 5) {
    return word;
  }

  let bestMatch = word;
  let bestDistance = Infinity;
  let secondBestDistance = Infinity;

  for (const candidate of vocabulary) {
    const distance = levenshteinDistance(
  normalizeForComparison(word),
  normalizeForComparison(candidate)
);

    if (distance < bestDistance) {
  secondBestDistance = bestDistance;
  bestDistance = distance;
  bestMatch = candidate;
} else if (distance < secondBestDistance) {
  secondBestDistance = distance;
}
  }

  // Sicherheitsgrenze:
  // 5–7 Zeichen  -> maximal 1 Fehler
  // ab 8 Zeichen -> maximal 2 Fehler

  const comparisonLength = normalizeForComparison(word).length;

const maxDistance =
  comparisonLength >= 8 ? 2 : 1;

  if (
  bestDistance <= maxDistance &&
  bestDistance < secondBestDistance
) {
  return bestMatch;
}

  return word;
}

const canonicalTerms: Record<string, string> = {
  privatpool: "privater pool",
  innenpool: "innen pool",
  außenpool: "außen pool",
  meernähe: "nähe meer",
  seenähe: "nähe see",
  strandnähe: "nähe strand",
  küchenzeile: "küchenzeile",
  allinclusive: "all inclusive",
};

// =========================================================
// START-WÖRTERBUCH
//
// Das bauen wir im nächsten Schritt umfassend aus.
// =========================================================

const searchVocabulary = [
  // Unterkunftsarten
  "hotel",
  "hostel",
  "resort",
  "villa",
  "ferienhaus",
  "ferienwohnung",
  "apartment",
  "appartement",
  "bungalow",
  "chalet",
  "hütte",
  "ferienhütte",
  "pension",
  "gästehaus",
  "bedandbreakfast",
  "campingplatz",
  "glamping",
  "mobilheim",

  // Ausstattung
  "pool",
  "privatpool",
  "innenpool",
  "außenpool",
  "sauna",
  "whirlpool",
  "wellness",
  "spa",
  "fitnessraum",
  "fitnessstudio",
  "parkplatz",
  "garage",
  "wlan",
  "wifi",
  "balkon",
  "terrasse",
  "garten",
  "küche",
  "küchenzeile",
  "waschmaschine",
  "geschirrspüler",
  "grill",
  "fernseher",
  "kamin",
  "klimaanlage",
  "aufzug",

  // Verpflegung
  "frühstück",
  "halbpension",
  "vollpension",
  "allinclusive",
  "selbstverpflegung",

  // Lage
  "strand",
  "strandnähe",
  "strandlage",
  "meer",
  "meernähe",
  "meerblick",
  "see",
  "seenähe",
  "seeblick",
  "berge",
  "bergregion",
  "bergblick",
  "stadtzentrum",
  "innenstadt",
  "altstadt",
  "ländlich",
  "natur",
  "ruhig",
  "zentral",
  "abgelegen",
  "flughafen",
  "bahnhof",

  // Reisegruppen
  "familie",
  "familien",
  "kinder",
  "baby",
  "babys",
  "paar",
  "pärchen",
  "gruppe",
  "freunde",
  "senioren",
  "geschäftsreise",
  "haustiere",
  "hunde",

  // Qualität
  "luxus",
  "luxuriös",
  "modern",
  "romantisch",
  "authentisch",
  "boutique",
  "günstig",
  "preiswert",
  "bewertung",
  "bewertungen",

  // Häufige Reisebegriffe
  "nacht",
  "nächte",
  "woche",
  "wochen",
  "wochenende",
  "urlaub",
  "reise",

  // Länder / häufige Ziele
  "deutschland",
  "österreich",
  "schweiz",
  "spanien",
  "italien",
  "frankreich",
  "portugal",
  "griechenland",
  "kroatien",
  "niederlande",
  "mallorca",
  "ibiza",
  "teneriffa",
  "gran canaria",
];


// =========================================================
// HAUPTFUNKTION
// =========================================================

export function normalizeSearchText(
  value: string
): string {
  const cleanedText = value
    .toLowerCase()
    .replace(/[.,!?;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleanedText.split(" ");

  const correctedWords = words.map((word) =>
  findClosestWord(
    word,
    searchVocabulary
  )
);

const canonicalWords = correctedWords.map(
  (word) => canonicalTerms[word] ?? word
);

console.log("NORMALISIERTER TEXT:", canonicalWords.join(" "));
return canonicalWords.join(" ");
}