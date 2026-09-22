"use client";

import { useState } from "react";
import { cities } from "./data/cities";
import { locations } from "./data/locations";
import { boardTypes } from "./data/boardTypes";
import { guestTypes } from "./data/guestTypes";
import { normalizeSearchText } from "./lib/searchTextNormalizer";
import { parseNatureSearch } from "./lib/parsers/natureParser";
import { parseCitySearch } from "./lib/parsers/cityParser";
import { parseRomanceSearch } from "./lib/parsers/romanceParser";
import { parseLuxurySearch } from "./lib/parsers/luxuryParser";
import { parseSustainabilitySearch } from "./lib/parsers/sustainabilityParser";
import { parseSecuritySearch } from "./lib/parsers/securityParser";
import { parseExtendedSearch } from "./lib/parsers/extendedSearchParser";
import { cleanupSearchParams } from "./lib/parsers/searchParamCleanup";
import { mapSearchParamsToDbFeatures } from "./lib/parsers/dbFeatureMapper";
import { parseHotelStars } from "./lib/parsers/hotelStarsParser";
import { parsePreferences } from "./lib/parsers/preferenceParser";


type SearchResult = {
  id: number;

  name: string;
  slug?: string | null;

  city?: string | null;
  region?: string | null;
  country?: string | null;

  accommodation_type?: string | null;

  description?: string | null;
  image_url?: string | null;

  price_min?: number | null;
  price_max?: number | null;
  currency?: string | null;

pool?: boolean;
wifi?: boolean;
apartment_has_kitchen?: boolean;
apartment_has_washing_machine?: boolean;
parking?: boolean;
breakfast?: boolean;
restaurant?: boolean;
air_conditioning?: boolean;
kitchen?: boolean;
washing_machine?: boolean;

  review_score?: number | null;
  review_count?: number | null;

  hotel_stars?: number | null;

  max_guests?: number | null;
  apartment_bedrooms?: number | null;

  near_sea?: boolean | null;
  near_lake?: boolean | null;
  near_mountains?: boolean | null;

  dogs_allowed?: boolean | null;
  family_friendly?: boolean | null;
  accessible?: boolean | null;
  quiet_place?: boolean | null;
  
  has_pool?: boolean | null;
  has_wifi?: boolean | null;
  has_parking?: boolean | null;
  has_restaurant?: boolean | null;
  has_breakfast?: boolean | null;
  has_air_conditioning?: boolean | null;

  is_featured?: boolean | null;

  provider_name?: string | null;

  affiliate_url?: string | null;
  booking_url?: string | null;
  website_url?: string | null;
};

function containsWholeTerm(text: string, term: string): boolean {
  const normalizedText = text
    .toLowerCase()
    .replace(/[ä]/g, "ae")
    .replace(/[ö]/g, "oe")
    .replace(/[ü]/g, "ue")
    .replace(/[ß]/g, "ss");

  const normalizedTerm = term
    .toLowerCase()
    .replace(/[ä]/g, "ae")
    .replace(/[ö]/g, "oe")
    .replace(/[ü]/g, "ue")
    .replace(/[ß]/g, "ss");

  const escapedTerm = normalizedTerm.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const regex = new RegExp(
    `(^|[^a-z0-9])${escapedTerm}(?=$|[^a-z0-9])`,
    "i"
  );

  return regex.test(normalizedText);
}

export default function SearchBox() {
  const [selectedAccommodationType, setSelectedAccommodationType] =
  useState<"campsite" | "holiday_apartment" | "hotel" | null>(null);
  const [showGuests, setShowGuests] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [babies, setBabies] = useState(0);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [message, setMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const formatDateForInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

  

const today = new Date();
const twoWeeksLater = new Date();
twoWeeksLater.setDate(today.getDate() + 14);

const [checkIn, setCheckIn] = useState(() => formatDateForInput(today));
const [checkOut, setCheckOut] = useState(() => formatDateForInput(twoWeeksLater));
  const [sortOption, setSortOption] = useState<
  "best" | "price_asc" | "price_desc" | "rating"
>("best");

  function startListening() {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    setMessage("Spracherkennung wird in diesem Browser nicht unterstützt.");
    return;
  }
  const recognition = new SpeechRecognition();

  recognition.lang = "de-DE";
  recognition.interimResults = false;
  recognition.continuous = false;
  recognition.onstart = () => {
  setIsListening(true);
  setMessage("Ich höre zu...");
};
  recognition.onresult = (event: any) => {
  const spokenText = event.results[0][0].transcript;

  setQuery(spokenText);
  setMessage("Sprache erkannt.");
}; 
  recognition.onend = () => {
  setIsListening(false);
};
recognition.start();
}
const campingSynonyms = {
  camping_tent: [
    "zelt",
    "zelten",
    "zeltplatz",
    "campingzelt",
    "dachzelt",
  ],
  camping_caravan: [
    "wohnwagen",
    "caravan",
    "campinganhänger",
    "campinganhaenger",
  ],
  camping_motorhome: [
    "wohnmobil",
    "reisemobil",
    "motorhome",
  ],
  camping_campervan: [
    "camper",
    "campervan",
    "campingbus",
    "van",
  ],
  camping_mobile_home: [
    "mobilheim",
    "mobile home",
  ],
  camping_glamping: [
    "glamping",
    "luxuscamping",
    "safarizelt",
  ],
  camping_bungalow: [
    "bungalow",
    "campingbungalow",
    "camping-bungalow",
  ],
  camping_lodge: [
    "lodge",
    "camping lodge",
    "camping-lodge",
  ],
  camping_rooftop_tent: [
    "dachzelt",
    "roof tent",
    "rooftop tent",
  ],
};

const accommodationTypeSynonyms = {
  hotel: [
    "hotel",
    "strandhotel",
    "stadthotel",
    "familienhotel",
    "wellnesshotel",
    "aparthotel",
  ],

  holiday_apartment: [
    "ferienwohnung",
    "ferien wohnung",
    "fewo",
    "apartment",
    "ferienapartment",
    "ferienwohnung",
  ],

  holiday_home: [
    "ferienhaus",
    "ferien häuschen",
    "ferienhäuschen",
    "ferienhaeuschen",
    "ferienhauschen",
  ],

  villa: [
    "villa",
    "ferienvilla",
  ],

  hostel: [
    "hostel",
    "jugendherberge",
  ],

  guesthouse: [
    "pension",
    "gästehaus",
    "gaestehaus",
    "guesthouse",
  ],

  bed_and_breakfast: [
    "bed and breakfast",
    "bed & breakfast",
    "b&b",
  ],

  resort: [
    "resort",
    "ferienresort",
    "ferienanlage",
  ],

  chalet: [
    "chalet",
    "ferienchalet",
  ],

  cabin: [
    "hütte",
    "huette",
    "berghütte",
    "berghuette",
    "ferienhütte",
    "ferienhuette",
  ],

  bungalow: [
    "bungalow",
    "ferienbungalow",
  ],
};

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSearching(true);
    const params = new URLSearchParams();

    if (selectedAccommodationType) {
  params.set("type", selectedAccommodationType);
}
    
    try {
  const aiResponse = await fetch("/api/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (aiResponse.ok) {
  const aiData = await aiResponse.json();
  const criteria = aiData.criteria;

  if (criteria?.country) {
  params.set("country", criteria.country);
}

if (criteria?.region) {
  params.set("region", criteria.region);
}

if (criteria?.city) {
  params.set("city", criteria.city);
}

  if (criteria?.guests) {
    params.set("max_guests", String(criteria.guests));
  }

  if (criteria?.month) {
    params.set("month", String(criteria.month));
  }

  if (criteria?.accommodation_type && !selectedAccommodationType) {
  params.set("type", criteria.accommodation_type);
}

  if (criteria?.max_price_per_night) {
    params.set("max_price", String(criteria.max_price_per_night));
  }

  if (
    criteria?.total_budget &&
    criteria?.nights &&
    Number(criteria.nights) > 0
  ) {
    const maxPricePerNight = Math.floor(
      Number(criteria.total_budget) / Number(criteria.nights)
    );

    params.set("max_price", String(maxPricePerNight));
  }

  if (Array.isArray(criteria?.features)) {
    for (const feature of criteria.features) {
      params.append("feature", feature);
    }
  }
}
} catch (error) {
  console.log("KI momentan nicht verfügbar:", error);
}

    const text = query.trim().toLowerCase();

    if (!text) {
      setMessage("Bitte beschreibe kurz deine Reisewünsche.");
      setResults([]);
      return;
    }
    
    const normalizedText = normalizeSearchText(text);

for (const guestType of guestTypes) {
  const matched = guestType.aliases.some((alias) => {
    const escapedAlias = alias.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const regex = new RegExp(
      `(^|\\s)${escapedAlias}(?=\\s|$)`,
      "i"
    );

    return regex.test(normalizedText);
  });

  if (matched) {
    params.append("guest_type", guestType.key);
  }
}

  const blockedCityAliases = new Set([
  "gerne",
]);

const matchedCity = cities.find((city) =>
  city.aliases.some((alias) => {
    const cleanAlias = alias.trim().toLowerCase();

    if (cleanAlias.length < 4) {
      return false;
    }

    if (blockedCityAliases.has(cleanAlias)) {
      return false;
    }

    return containsWholeTerm(normalizedText, cleanAlias);
  })
);

for (const boardType of boardTypes) {
  const matched = boardType.aliases.some((alias) => {
    const escapedAlias = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(^|\\s)${escapedAlias}(?=\\s|$)`, "i");

    return regex.test(normalizedText);
  });

  if (matched) {
    params.append("feature", boardType.feature);
  }
}

if (matchedCity) {
  params.set("city", matchedCity.name);

  if (!params.has("country")) {
    params.set("country", matchedCity.country);
  }
}

const matchedLocation = locations.find((location) =>
  location.aliases.some((alias) => {
    const escapedAlias = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(^|\\s)${escapedAlias}(?=\\s|$)`, "i");

    return regex.test(normalizedText);
  })
);

if (matchedLocation) {
  if (matchedLocation.type === "country") {
    params.set("country", matchedLocation.country);
  }

  if (matchedLocation.type === "region") {
    params.set("region", matchedLocation.name);

    if (!params.has("country")) {
      params.set("country", matchedLocation.country);
    }
  }
}

const isCampingSearch = Object.values(campingSynonyms)
  .flat()
  .some((term) => normalizedText.includes(term.toLowerCase()));

if (isCampingSearch && !selectedAccommodationType) {
  params.set("type", "campsite");
}

for (const [featureKey, synonyms] of Object.entries(campingSynonyms)) {
  const matched = synonyms.some((term) =>
    normalizedText.includes(term.toLowerCase())
  );

  if (matched) {
    params.append("feature", featureKey);
  }
}

for (const [typeKey, synonyms] of Object.entries(accommodationTypeSynonyms)) {
  const matched = synonyms.some((term) =>
    normalizedText.includes(term.toLowerCase())
  );

  if (matched && !isCampingSearch) {
    params.set("type", typeKey);
    break;
  }
}

    setMessage("Suche läuft...");

   const numberWords: Record<string, number> = {
  ein: 1,
  eine: 1,
  einen: 1,
  einer: 1,
  einem: 1,
  eins: 1,
  zwei: 2,
  drei: 3,
  vier: 4,
  fünf: 5,
  fuenf: 5,
  sechs: 6,
  sieben: 7,
  acht: 8,
  neun: 9,
  zehn: 10,
  elf: 11,
  zwölf: 12,
  zwoelf: 12,
  dreizehn: 13,
  vierzehn: 14,
  fünfzehn: 15,
  fuenfzehn: 15,
  sechzehn: 16,
  siebzehn: 17,
  achtzehn: 18,
  neunzehn: 19,
  zwanzig: 20,
};

const numberPattern =
  "(?:\\d+|ein|eine|einen|einer|einem|eins|zwei|drei|vier|fünf|fuenf|sechs|sieben|acht|neun|zehn|elf|zwölf|zwoelf|dreizehn|vierzehn|fünfzehn|fuenfzehn|sechzehn|siebzehn|achtzehn|neunzehn|zwanzig)";

function parseGuestNumber(value: string): number {
  const normalized = value.toLowerCase();

  if (/^\d+$/.test(normalized)) {
    return Number(normalized);
  }

  return numberWords[normalized] ?? 0;
}

// ---------------------------------------------------------
// Erwachsene
// ---------------------------------------------------------

const adultsMatch = text.match(
  new RegExp(
    `(${numberPattern})\\s*(?:erwachsene|erwachsener|erwachsenen|erwachsenden|erwachenden|erwachsne|adult|adults)`,
    "i"
  )
);



// ---------------------------------------------------------
// Kinder
// ---------------------------------------------------------

const childrenMatch = text.match(
  new RegExp(
    `(${numberPattern})\\s*(?:kind|kinder|kindern|kindes|children|child|kids)\\b`,
    "i"
  )
);

// ---------------------------------------------------------
// Babys
// ---------------------------------------------------------

const babiesMatch = text.match(
  new RegExp(
    `${numberPattern}\\s*(babys|baby|säuglinge|saeuglinge|säugling|saeugling|infants|infant)`,
    "i"
  )
);

// ---------------------------------------------------------
// Allgemeine Personenzahl
// z. B. "5 Personen" oder "sechs Gäste"
// ---------------------------------------------------------

const personsMatch = text.match(
  new RegExp(
    `(${numberPattern})\\s*(?:personen|person|gäste|gaeste|leute|persons|people|guests)\\b`,
    "i"
  )
);

// ---------------------------------------------------------
// Umgangssprachlich:
// "zu zweit", "zu viert", "zu fünft" usw.
// ---------------------------------------------------------

const informalGuestsMatch = text.match(
  /\bzu\s+(zweit|dritt|viert|fünft|fuenft|sechst|siebt|acht|neunt|zehnt)\b/i
);

const informalGuestNumbers: Record<string, number> = {
  zweit: 2,
  dritt: 3,
  viert: 4,
  fünft: 5,
  fuenft: 5,
  sechst: 6,
  siebt: 7,
  acht: 8,
  neunt: 9,
  zehnt: 10,
};

// ---------------------------------------------------------
// Gesamtzahl berechnen
// ---------------------------------------------------------

let totalGuests = 0;

if (adultsMatch) {
  totalGuests += parseGuestNumber(adultsMatch[1]);
}

if (childrenMatch) {
  totalGuests += parseGuestNumber(childrenMatch[1]);
}

if (babiesMatch) {
  totalGuests += parseGuestNumber(babiesMatch[1]);
}

// ---------------------------------------------------------
// max_guests setzen
//
// Priorität:
// 1. Erwachsene/Kinder/Babys zusammengerechnet
// 2. direkte Personenzahl
// 3. "zu zweit / zu fünft / ..."
// ---------------------------------------------------------

if (totalGuests > 0) {
  params.set("max_guests", totalGuests.toString());
} else if (personsMatch) {
  const persons = parseGuestNumber(personsMatch[1]);

  if (persons > 0) {
    params.set("max_guests", persons.toString());
  }
} else if (informalGuestsMatch) {
  const informalKey = informalGuestsMatch[1].toLowerCase();
  const informalNumber = informalGuestNumbers[informalKey];

  if (informalNumber) {
    params.set("max_guests", informalNumber.toString());
  }
}

const childAgeMatches = [
  ...text.matchAll(
    /\b(\d{1,2})\s*(?:jahre|jahr|jährig|jaehrig|years?|yrs?)\b/gi
  ),
];

const childAges = childAgeMatches
  .map((match) => Number(match[1]))
  .filter((age) => age >= 0 && age <= 17);

if (childAges.length > 0) {
  for (const age of childAges) {
    params.append("child_age", age.toString());
  }
}

const naturalChildAges: number[] = [];

// "meine Kinder sind 4 und 7"
// "Kinder sind 5 und 9"
const childrenAreMatch = text.match(
  /\b(?:meine\s+)?kinder\s+(?:sind|haben)\s+(\d{1,2})\s+(?:und|,)\s+(\d{1,2})\b/i
);

if (childrenAreMatch) {
  naturalChildAges.push(
    Number(childrenAreMatch[1]),
    Number(childrenAreMatch[2])
  );
}

// "Kinder im Alter von 5 und 9"
const childrenAgeRangeMatch = text.match(
  /\bkinder\s+im\s+alter\s+von\s+(\d{1,2})\s+(?:und|,)\s+(\d{1,2})\b/i
);

if (childrenAgeRangeMatch) {
  naturalChildAges.push(
    Number(childrenAgeRangeMatch[1]),
    Number(childrenAgeRangeMatch[2])
  );
}

// "ein 6-jähriges Kind"
// "ein 6 jaehriges Kind"
// "mit einem 8-jährigen Kind"
const singleChildAgeMatches = [
  ...text.matchAll(
    /\b(\d{1,2})[\s-]*(?:jähriges|jaehriges|jähriger|jaehriger|jährigem|jaehrigem|jährige|jaehrige)\s+(?:kind|junge|mädchen|maedchen)\b/gi
  ),
];

for (const match of singleChildAgeMatches) {
  naturalChildAges.push(Number(match[1]));
}

// "Teenager mit 15"
// "Teenager 15 Jahre"
const teenagerAgeMatches = [
  ...text.matchAll(
    /\b(?:teenager|jugendlicher|jugendliche)\s+(?:mit\s+)?(\d{1,2})(?:\s*jahre?)?\b/gi
  ),
];

for (const match of teenagerAgeMatches) {
  naturalChildAges.push(Number(match[1]));
}

// "Baby 8 Monate"
// "Baby mit 8 Monaten"
// "8 Monate altes Baby"
const babyMonthMatches = [
  ...text.matchAll(
    /\b(?:baby\s+(?:mit\s+)?(\d{1,2})\s*monaten?|(\d{1,2})\s*monate?\s+altes?\s+baby)\b/gi
  ),
];

for (const match of babyMonthMatches) {
  const months = Number(match[1] ?? match[2]);

  if (months >= 0 && months <= 35) {
    params.append("baby_age_months", months.toString());
  }
}

// Nur sinnvolle Kinderalter übernehmen
for (const age of naturalChildAges) {
  if (age >= 0 && age <= 17) {
    const ageString = age.toString();

    // Doppelungen vermeiden, falls z. B.
    // "6-jähriges Kind" schon vom ersten Block erkannt wurde.
    if (!params.getAll("child_age").includes(ageString)) {
      params.append("child_age", ageString);
    }
  }
}

// =========================================================
// ZIMMER, BETTEN, BÄDER & WOHNFLÄCHE
// =========================================================

// ---------------------------------------------------------
// Schlafzimmer
// Beispiele:
// "2 Schlafzimmer"
// "mindestens 3 Schlafzimmer"
// "ab 2 Schlafzimmer"
// "maximal 4 Schlafzimmer"
// ---------------------------------------------------------

const minBedroomsMatch = normalizedText.match(
  /(?:mindestens|minimum|min\.?|ab)\s*(\d+)\s*(?:schlafzimmer|schlafräume|schlafraeume)/
);

const maxBedroomsMatch = normalizedText.match(
  /(?:maximal|höchstens|hoechstens|max\.?|bis zu)\s*(\d+)\s*(?:schlafzimmer|schlafräume|schlafraeume)/
);

const exactBedroomsMatch = normalizedText.match(
  /(?:^|\s)(\d+)\s*(?:schlafzimmer|schlafräume|schlafraeume)(?=\s|$)/
);

if (minBedroomsMatch) {
  params.set("min_bedrooms", minBedroomsMatch[1]);
}

if (maxBedroomsMatch) {
  params.set("max_bedrooms", maxBedroomsMatch[1]);
}

if (
  exactBedroomsMatch &&
  !minBedroomsMatch &&
  !maxBedroomsMatch
) {
  params.set("min_bedrooms", exactBedroomsMatch[1]);
}


// ---------------------------------------------------------
// Betten
// Beispiele:
// "3 Betten"
// "mindestens 4 Betten"
// "maximal 6 Betten"
// ---------------------------------------------------------

const minBedsMatch = normalizedText.match(
  /(?:mindestens|minimum|min\.?|ab)\s*(\d+)\s*(?:bett|betten|schlafplätze|schlafplaetze)/
);

const maxBedsMatch = normalizedText.match(
  /(?:maximal|höchstens|hoechstens|max\.?|bis zu)\s*(\d+)\s*(?:bett|betten|schlafplätze|schlafplaetze)/
);

const exactBedsMatch = normalizedText.match(
  /(?:^|\s)(\d+)\s*(?:bett|betten|schlafplätze|schlafplaetze)(?=\s|$)/
);

if (minBedsMatch) {
  params.set("min_beds", minBedsMatch[1]);
}

if (maxBedsMatch) {
  params.set("max_beds", maxBedsMatch[1]);
}

if (
  exactBedsMatch &&
  !minBedsMatch &&
  !maxBedsMatch
) {
  params.set("min_beds", exactBedsMatch[1]);
}


// ---------------------------------------------------------
// Badezimmer
// Beispiele:
// "2 Badezimmer"
// "mindestens 2 Bäder"
// "maximal 3 Badezimmer"
// ---------------------------------------------------------

const minBathroomsMatch = normalizedText.match(
  /(?:mindestens|minimum|min\.?|ab)\s*(\d+)\s*(?:bad|bäder|baeder|badezimmer|badezimmern)/
);

const maxBathroomsMatch = normalizedText.match(
  /(?:maximal|höchstens|hoechstens|max\.?|bis zu)\s*(\d+)\s*(?:bad|bäder|baeder|badezimmer|badezimmern)/
);

const exactBathroomsMatch = normalizedText.match(
  /(?:^|\s)(\d+)\s*(?:bad|bäder|baeder|badezimmer|badezimmern)(?=\s|$)/
);

if (minBathroomsMatch) {
  params.set("min_bathrooms", minBathroomsMatch[1]);
}

if (maxBathroomsMatch) {
  params.set("max_bathrooms", maxBathroomsMatch[1]);
}

if (
  exactBathroomsMatch &&
  !minBathroomsMatch &&
  !maxBathroomsMatch
) {
  params.set("min_bathrooms", exactBathroomsMatch[1]);
}


// ---------------------------------------------------------
// Zimmer allgemein
// Beispiele:
// "3 Zimmer"
// "mindestens 4 Zimmer"
// "maximal 5 Zimmer"
// ---------------------------------------------------------

const minRoomsMatch = normalizedText.match(
  /(?:mindestens|minimum|min\.?|ab)\s*(\d+)\s*(?:zimmer|räume|raeume)/
);

const maxRoomsMatch = normalizedText.match(
  /(?:maximal|höchstens|hoechstens|max\.?|bis zu)\s*(\d+)\s*(?:zimmer|räume|raeume)/
);

const exactRoomsMatch = normalizedText.match(
  /(?:^|\s)(\d+)\s*(?:zimmer|räume|raeume)(?=\s|$)/
);

if (
  minRoomsMatch &&
  !normalizedText.includes("schlafzimmer")
) {
  params.set("min_rooms", minRoomsMatch[1]);
}

if (
  maxRoomsMatch &&
  !normalizedText.includes("schlafzimmer")
) {
  params.set("max_rooms", maxRoomsMatch[1]);
}

if (
  exactRoomsMatch &&
  !minRoomsMatch &&
  !maxRoomsMatch &&
  !normalizedText.includes("schlafzimmer")
) {
  params.set("min_rooms", exactRoomsMatch[1]);
}


// ---------------------------------------------------------
// Wohnfläche / Größe
// Beispiele:
// "mindestens 80 m²"
// "ab 60 qm"
// "maximal 120 m2"
// "80 Quadratmeter"
// "zwischen 60 und 100 qm"
// ---------------------------------------------------------

const areaRangeMatch = normalizedText.match(
  /(?:zwischen|von)\s*(\d+(?:[.,]\d+)?)\s*(?:und|bis|-)\s*(\d+(?:[.,]\d+)?)\s*(?:m²|m2|qm|quadratmeter)/
);

const minAreaMatch = normalizedText.match(
  /(?:mindestens|minimum|min\.?|ab|größer als|groesser als)\s*(\d+(?:[.,]\d+)?)\s*(?:m²|m2|qm|quadratmeter)/
);

const maxAreaMatch = normalizedText.match(
  /(?:maximal|höchstens|hoechstens|max\.?|bis zu|kleiner als)\s*(\d+(?:[.,]\d+)?)\s*(?:m²|m2|qm|quadratmeter)/
);

const exactAreaMatch = normalizedText.match(
  /(?:^|\s)(\d+(?:[.,]\d+)?)\s*(?:m²|m2|qm|quadratmeter)(?=\s|$)/
);

if (areaRangeMatch) {
  const minArea = areaRangeMatch[1].replace(",", ".");
  const maxArea = areaRangeMatch[2].replace(",", ".");

  params.set("min_area_sqm", minArea);
  params.set("max_area_sqm", maxArea);
} else {
  if (minAreaMatch) {
    params.set(
      "min_area_sqm",
      minAreaMatch[1].replace(",", ".")
    );
  }

  if (maxAreaMatch) {
    params.set(
      "max_area_sqm",
      maxAreaMatch[1].replace(",", ".")
    );
  }

  if (
    exactAreaMatch &&
    !minAreaMatch &&
    !maxAreaMatch
  ) {
    params.set(
      "min_area_sqm",
      exactAreaMatch[1].replace(",", ".")
    );
  }
}


// ---------------------------------------------------------
// Bettarten
// ---------------------------------------------------------

if (
  normalizedText.includes("doppelbett") ||
  normalizedText.includes("doppelbetten") ||
  normalizedText.includes("double bed")
) {
  params.append("bed_type", "double_bed");
}

if (
  normalizedText.includes("einzelbett") ||
  normalizedText.includes("einzelbetten") ||
  normalizedText.includes("single bed")
) {
  params.append("bed_type", "single_bed");
}

if (
  normalizedText.includes("queen size") ||
  normalizedText.includes("queensize") ||
  normalizedText.includes("queen-size")
) {
  params.append("bed_type", "queen_bed");
}

if (
  normalizedText.includes("king size") ||
  normalizedText.includes("kingsize") ||
  normalizedText.includes("king-size")
) {
  params.append("bed_type", "king_bed");
}

if (
  normalizedText.includes("hochbett") ||
  normalizedText.includes("hochbetten") ||
  normalizedText.includes("stockbett") ||
  normalizedText.includes("stockbetten") ||
  normalizedText.includes("etagenbett") ||
  normalizedText.includes("etagenbetten")
) {
  params.append("bed_type", "bunk_bed");
}

if (
  normalizedText.includes("schlafsofa") ||
  normalizedText.includes("schlafcouch") ||
  normalizedText.includes("sofabett")
) {
  params.append("bed_type", "sofa_bed");
}


// ---------------------------------------------------------
// Zusätzliche Raumwünsche
// ---------------------------------------------------------

if (
  normalizedText.includes("eigenes bad") ||
  normalizedText.includes("privates bad") ||
  normalizedText.includes("eigenes badezimmer") ||
  normalizedText.includes("privates badezimmer")
) {
  params.append("room_feature", "private_bathroom");
}

if (
  normalizedText.includes("separates schlafzimmer") ||
  normalizedText.includes("separate schlafzimmer")
) {
  params.append("room_feature", "separate_bedroom");
}

if (
  normalizedText.includes("wohnzimmer") ||
  normalizedText.includes("separates wohnzimmer")
) {
  params.append("room_feature", "living_room");
}

if (
  normalizedText.includes("esszimmer") ||
  normalizedText.includes("essbereich")
) {
  params.append("room_feature", "dining_area");
}

if (
  normalizedText.includes("arbeitszimmer") ||
  normalizedText.includes("arbeitsbereich") ||
  normalizedText.includes("schreibtisch")
) {
  params.append("room_feature", "workspace");
}


// ---------------------------------------------------------
// Größen-Präferenzen ohne konkrete Quadratmeter
// ---------------------------------------------------------

if (
  normalizedText.includes("geräumig") ||
  normalizedText.includes("geraeumig") ||
  normalizedText.includes("viel platz") ||
  normalizedText.includes("große unterkunft") ||
  normalizedText.includes("grosse unterkunft")
) {
  params.append("size_preference", "spacious");
}

if (
  normalizedText.includes("klein und gemütlich") ||
  normalizedText.includes("klein und gemuetlich") ||
  normalizedText.includes("kompakt")
) {
  params.append("size_preference", "compact");
}

// =========================================================
// FAMILIEN, KINDER & BABYS
// =========================================================


// ---------------------------------------------------------
// Allgemeine Familienfreundlichkeit
// ---------------------------------------------------------

if (
  normalizedText.includes("familienfreundlich") ||
  normalizedText.includes("familien freundlich") ||
  normalizedText.includes("kinderfreundlich") ||
  normalizedText.includes("kinder freundlich") ||
  normalizedText.includes("für familien geeignet") ||
  normalizedText.includes("fuer familien geeignet") ||
  normalizedText.includes("für kinder geeignet") ||
  normalizedText.includes("fuer kinder geeignet") ||
  normalizedText.includes("familienunterkunft") ||
  normalizedText.includes("familienhotel")
) {
  params.append("family_preference", "family_friendly");
}


// ---------------------------------------------------------
// Babyfreundliche Unterkunft
// ---------------------------------------------------------

if (
  normalizedText.includes("babyfreundlich") ||
  normalizedText.includes("baby freundlich") ||
  normalizedText.includes("für babys geeignet") ||
  normalizedText.includes("fuer babys geeignet") ||
  normalizedText.includes("mit baby geeignet") ||
  normalizedText.includes("babygerecht")
) {
  params.append("family_preference", "baby_friendly");
}


// ---------------------------------------------------------
// Familienzimmer
// ---------------------------------------------------------

if (
  normalizedText.includes("familienzimmer") ||
  normalizedText.includes("family room") ||
  normalizedText.includes("zimmer für familien") ||
  normalizedText.includes("zimmer fuer familien")
) {
  params.append("family_feature", "family_room");
}


// ---------------------------------------------------------
// Verbundene Zimmer / Zimmer mit Verbindungstür
// ---------------------------------------------------------

if (
  normalizedText.includes("verbundene zimmer") ||
  normalizedText.includes("verbindungszimmer") ||
  normalizedText.includes("zimmer mit verbindungstür") ||
  normalizedText.includes("zimmer mit verbindungstuer") ||
  normalizedText.includes("connecting rooms") ||
  normalizedText.includes("nebeneinanderliegende zimmer") ||
  normalizedText.includes("nebeneinander liegende zimmer")
) {
  params.append("family_feature", "connecting_rooms");
}


// ---------------------------------------------------------
// Babybett / Kinderbett
// ---------------------------------------------------------

if (
  normalizedText.includes("babybett") ||
  normalizedText.includes("baby bett") ||
  normalizedText.includes("kinderbett") ||
  normalizedText.includes("gitterbett") ||
  normalizedText.includes("reisebett") ||
  normalizedText.includes("reise bett") ||
  normalizedText.includes("baby crib") ||
  normalizedText.includes("crib") ||
  normalizedText.includes("cot")
) {
  params.append("family_feature", "baby_cot");
}


// Anzahl Babybetten
// Beispiele:
// "2 Babybetten"
// "mindestens 2 Kinderbetten"

const minBabyBedsMatch = normalizedText.match(
  /(?:mindestens|minimum|min\.?|ab)\s*(\d+)\s*(?:babybetten|babybett|kinderbetten|kinderbett|gitterbetten|gitterbett|reisebetten|reisebett)/
);

const exactBabyBedsMatch = normalizedText.match(
  /(?:^|\s)(\d+)\s*(?:babybetten|babybett|kinderbetten|kinderbett|gitterbetten|gitterbett|reisebetten|reisebett)(?=\s|$)/
);

if (minBabyBedsMatch) {
  params.set("min_baby_cots", minBabyBedsMatch[1]);
}

if (
  exactBabyBedsMatch &&
  !minBabyBedsMatch
) {
  params.set("min_baby_cots", exactBabyBedsMatch[1]);
}


// ---------------------------------------------------------
// Hochstuhl
// ---------------------------------------------------------

if (
  normalizedText.includes("hochstuhl") ||
  normalizedText.includes("kinderhochstuhl") ||
  normalizedText.includes("kinder hochstuhl") ||
  normalizedText.includes("babyhochstuhl") ||
  normalizedText.includes("baby hochstuhl") ||
  normalizedText.includes("high chair")
) {
  params.append("family_feature", "high_chair");
}


// ---------------------------------------------------------
// Wickelmöglichkeit / Wickeltisch
// ---------------------------------------------------------

if (
  normalizedText.includes("wickeltisch") ||
  normalizedText.includes("wickelkommode") ||
  normalizedText.includes("wickelstation") ||
  normalizedText.includes("wickelmöglichkeit") ||
  normalizedText.includes("wickelmoeglichkeit") ||
  normalizedText.includes("baby changing") ||
  normalizedText.includes("changing table")
) {
  params.append("family_feature", "changing_table");
}


// ---------------------------------------------------------
// Babybadewanne
// ---------------------------------------------------------

if (
  normalizedText.includes("babybadewanne") ||
  normalizedText.includes("baby badewanne") ||
  normalizedText.includes("kinderbadewanne") ||
  normalizedText.includes("baby bath")
) {
  params.append("family_feature", "baby_bathtub");
}


// ---------------------------------------------------------
// Flaschenwärmer
// ---------------------------------------------------------

if (
  normalizedText.includes("flaschenwärmer") ||
  normalizedText.includes("flaschenwaermer") ||
  normalizedText.includes("babyflaschenwärmer") ||
  normalizedText.includes("babyflaschenwaermer") ||
  normalizedText.includes("bottle warmer")
) {
  params.append("family_feature", "bottle_warmer");
}


// ---------------------------------------------------------
// Sterilisator
// ---------------------------------------------------------

if (
  normalizedText.includes("sterilisator") ||
  normalizedText.includes("flaschensterilisator") ||
  normalizedText.includes("babyflaschen sterilisator") ||
  normalizedText.includes("bottle sterilizer")
) {
  params.append("family_feature", "bottle_sterilizer");
}


// ---------------------------------------------------------
// Babynahrung / Möglichkeit Babynahrung zuzubereiten
// ---------------------------------------------------------

if (
  normalizedText.includes("babynahrung") ||
  normalizedText.includes("babybrei") ||
  normalizedText.includes("baby brei") ||
  normalizedText.includes("babyküche") ||
  normalizedText.includes("babykueche") ||
  normalizedText.includes("babynahrung zubereiten")
) {
  params.append("family_feature", "baby_food_facilities");
}


// ---------------------------------------------------------
// Kindersicherung / kindersichere Unterkunft
// ---------------------------------------------------------

if (
  normalizedText.includes("kindersicher") ||
  normalizedText.includes("kindergesichert") ||
  normalizedText.includes("kinder gesichert") ||
  normalizedText.includes("babysicher") ||
  normalizedText.includes("baby sicher") ||
  normalizedText.includes("childproof") ||
  normalizedText.includes("child proof")
) {
  params.append("family_feature", "childproof");
}


// ---------------------------------------------------------
// Steckdosensicherung
// ---------------------------------------------------------

if (
  normalizedText.includes("steckdosensicherung") ||
  normalizedText.includes("steckdosen gesichert") ||
  normalizedText.includes("steckdosenschutz") ||
  normalizedText.includes("kindersichere steckdosen")
) {
  params.append("family_feature", "socket_safety");
}


// ---------------------------------------------------------
// Treppenschutzgitter
// ---------------------------------------------------------

if (
  normalizedText.includes("treppenschutzgitter") ||
  normalizedText.includes("treppengitter") ||
  normalizedText.includes("schutzgitter an der treppe") ||
  normalizedText.includes("babygitter") ||
  normalizedText.includes("baby gate") ||
  normalizedText.includes("stair gate")
) {
  params.append("family_feature", "stair_gate");
}


// ---------------------------------------------------------
// Fenster- / Balkonsicherung
// ---------------------------------------------------------

if (
  normalizedText.includes("fenstersicherung") ||
  normalizedText.includes("fenster kindersicher") ||
  normalizedText.includes("balkonsicherung") ||
  normalizedText.includes("balkon kindersicher") ||
  normalizedText.includes("kindersicherer balkon")
) {
  params.append("family_feature", "window_balcony_safety");
}


// ---------------------------------------------------------
// Pool mit Kindersicherung
// ---------------------------------------------------------

if (
  normalizedText.includes("pool kindersicher") ||
  normalizedText.includes("kindersicherer pool") ||
  normalizedText.includes("pool mit kindersicherung") ||
  normalizedText.includes("eingezäunter pool") ||
  normalizedText.includes("eingezaeunter pool") ||
  normalizedText.includes("poolzaun") ||
  normalizedText.includes("pool zaun")
) {
  params.append("family_feature", "child_safe_pool");
}


// ---------------------------------------------------------
// Spielplatz
// ---------------------------------------------------------

if (
  normalizedText.includes("spielplatz") ||
  normalizedText.includes("kinderspielplatz") ||
  normalizedText.includes("kinder spielplatz") ||
  normalizedText.includes("playground")
) {
  params.append("family_feature", "playground");
}


// ---------------------------------------------------------
// Indoor-Spielbereich / Spielzimmer
// ---------------------------------------------------------

if (
  normalizedText.includes("spielzimmer") ||
  normalizedText.includes("kinderspielzimmer") ||
  normalizedText.includes("indoor spielplatz") ||
  normalizedText.includes("indoor-spielplatz") ||
  normalizedText.includes("indoorspielplatz") ||
  normalizedText.includes("indoor spielbereich") ||
  normalizedText.includes("spielbereich innen")
) {
  params.append("family_feature", "indoor_play_area");
}


// ---------------------------------------------------------
// Kinderspielbereich allgemein
// ---------------------------------------------------------

if (
  normalizedText.includes("kinderspielbereich") ||
  normalizedText.includes("kinder spielbereich") ||
  normalizedText.includes("spielbereich für kinder") ||
  normalizedText.includes("spielbereich fuer kinder")
) {
  params.append("family_feature", "children_play_area");
}


// ---------------------------------------------------------
// Kinderclub / Kids Club
// ---------------------------------------------------------

if (
  normalizedText.includes("kinderclub") ||
  normalizedText.includes("kinder club") ||
  normalizedText.includes("kids club") ||
  normalizedText.includes("kidsclub") ||
  normalizedText.includes("miniclub") ||
  normalizedText.includes("mini club")
) {
  params.append("family_feature", "kids_club");
}


// ---------------------------------------------------------
// Kinderanimation
// ---------------------------------------------------------

if (
  normalizedText.includes("kinderanimation") ||
  normalizedText.includes("kinder animation") ||
  normalizedText.includes("animation für kinder") ||
  normalizedText.includes("animation fuer kinder") ||
  normalizedText.includes("kinderprogramm") ||
  normalizedText.includes("kinder programm")
) {
  params.append("family_feature", "kids_entertainment");
}


// ---------------------------------------------------------
// Kinderbetreuung
// ---------------------------------------------------------

if (
  normalizedText.includes("kinderbetreuung") ||
  normalizedText.includes("kinder betreuung") ||
  normalizedText.includes("betreuung für kinder") ||
  normalizedText.includes("betreuung fuer kinder") ||
  normalizedText.includes("childcare")
) {
  params.append("family_feature", "childcare");
}


// ---------------------------------------------------------
// Babysitter
// ---------------------------------------------------------

if (
  normalizedText.includes("babysitter") ||
  normalizedText.includes("babysitting") ||
  normalizedText.includes("babysitter service") ||
  normalizedText.includes("babysitterservice")
) {
  params.append("family_feature", "babysitting");
}


// ---------------------------------------------------------
// Kinderpool
// ---------------------------------------------------------

if (
  normalizedText.includes("kinderpool") ||
  normalizedText.includes("kinder pool") ||
  normalizedText.includes("kinderbecken") ||
  normalizedText.includes("kinder becken") ||
  normalizedText.includes("babybecken") ||
  normalizedText.includes("baby becken") ||
  normalizedText.includes("planschbecken") ||
  normalizedText.includes("kids pool") ||
  normalizedText.includes("children's pool")
) {
  params.append("family_feature", "children_pool");
}


// ---------------------------------------------------------
// Wasserrutsche / Wasserpark
// ---------------------------------------------------------

if (
  normalizedText.includes("wasserrutsche") ||
  normalizedText.includes("wasserrutschen") ||
  normalizedText.includes("wasserpark") ||
  normalizedText.includes("aquapark") ||
  normalizedText.includes("aqua park") ||
  normalizedText.includes("water slide") ||
  normalizedText.includes("waterpark")
) {
  params.append("family_feature", "water_park");
}


// ---------------------------------------------------------
// Kinderfreundlicher Strand / flaches Wasser
// ---------------------------------------------------------

if (
  normalizedText.includes("kinderfreundlicher strand") ||
  normalizedText.includes("familienfreundlicher strand") ||
  normalizedText.includes("flach abfallender strand") ||
  normalizedText.includes("flach abfallendes wasser") ||
  normalizedText.includes("flaches wasser") ||
  normalizedText.includes("seichtes wasser")
) {
  params.append("family_feature", "child_friendly_beach");
}


// ---------------------------------------------------------
// Sandstrand
// ---------------------------------------------------------

if (
  normalizedText.includes("sandstrand") ||
  normalizedText.includes("sand strand") ||
  normalizedText.includes("sandiger strand")
) {
  params.append("family_feature", "sandy_beach");
}


// ---------------------------------------------------------
// Kinderstühle / Kindermöbel
// ---------------------------------------------------------

if (
  normalizedText.includes("kindermöbel") ||
  normalizedText.includes("kindermoebel") ||
  normalizedText.includes("kindertisch") ||
  normalizedText.includes("kinderstuhl") ||
  normalizedText.includes("kinderstühle") ||
  normalizedText.includes("kinderstuehle")
) {
  params.append("family_feature", "children_furniture");
}


// ---------------------------------------------------------
// Spielzeug
// ---------------------------------------------------------

if (
  normalizedText.includes("spielzeug") ||
  normalizedText.includes("kinderspielzeug") ||
  normalizedText.includes("babyspielzeug") ||
  normalizedText.includes("spielzeug für kinder") ||
  normalizedText.includes("spielzeug fuer kinder")
) {
  params.append("family_feature", "toys");
}


// ---------------------------------------------------------
// Bücher / Spiele für Kinder
// ---------------------------------------------------------

if (
  normalizedText.includes("kinderbücher") ||
  normalizedText.includes("kinderbuecher") ||
  normalizedText.includes("bücher für kinder") ||
  normalizedText.includes("buecher fuer kinder") ||
  normalizedText.includes("brettspiele") ||
  normalizedText.includes("gesellschaftsspiele") ||
  normalizedText.includes("spiele für kinder") ||
  normalizedText.includes("spiele fuer kinder")
) {
  params.append("family_feature", "children_books_games");
}


// ---------------------------------------------------------
// Spielekonsole
// ---------------------------------------------------------

if (
  normalizedText.includes("spielekonsole") ||
  normalizedText.includes("spielkonsole") ||
  normalizedText.includes("playstation") ||
  normalizedText.includes("xbox") ||
  normalizedText.includes("nintendo switch")
) {
  params.append("family_feature", "game_console");
}


// ---------------------------------------------------------
// Babyphone
// ---------------------------------------------------------

if (
  normalizedText.includes("babyphone") ||
  normalizedText.includes("baby monitor") ||
  normalizedText.includes("babymonitor")
) {
  params.append("family_feature", "baby_monitor");
}


// ---------------------------------------------------------
// Nachtlicht
// ---------------------------------------------------------

if (
  normalizedText.includes("nachtlicht") ||
  normalizedText.includes("baby nachtlicht") ||
  normalizedText.includes("kinder nachtlicht")
) {
  params.append("family_feature", "night_light");
}


// ---------------------------------------------------------
// Waschmöglichkeit für Familien
// ---------------------------------------------------------

if (
  normalizedText.includes("waschmöglichkeit für kinder") ||
  normalizedText.includes("waschmoeglichkeit fuer kinder") ||
  normalizedText.includes("wäsche für babys") ||
  normalizedText.includes("waesche fuer babys")
) {
  params.append("family_feature", "family_laundry");
}


// ---------------------------------------------------------
// Kinderwagen
// ---------------------------------------------------------

if (
  normalizedText.includes("kinderwagen") ||
  normalizedText.includes("buggy") ||
  normalizedText.includes("buggy verleih") ||
  normalizedText.includes("kinderwagen verleih") ||
  normalizedText.includes("kinderwagenverleih")
) {
  params.append("family_feature", "stroller");
}


// ---------------------------------------------------------
// Kinderwagenfreundlich
// ---------------------------------------------------------

if (
  normalizedText.includes("kinderwagenfreundlich") ||
  normalizedText.includes("mit kinderwagen geeignet") ||
  normalizedText.includes("für kinderwagen geeignet") ||
  normalizedText.includes("fuer kinderwagen geeignet")
) {
  params.append("family_feature", "stroller_friendly");
}


// ---------------------------------------------------------
// Kinderwagen-Abstellmöglichkeit
// ---------------------------------------------------------

if (
  normalizedText.includes("kinderwagen abstellen") ||
  normalizedText.includes("kinderwagenstellplatz") ||
  normalizedText.includes("kinderwagen stellplatz") ||
  normalizedText.includes("kinderwagenraum")
) {
  params.append("family_feature", "stroller_storage");
}


// ---------------------------------------------------------
// Kinderfahrräder / Fahrradanhänger
// ---------------------------------------------------------

if (
  normalizedText.includes("kinderfahrrad") ||
  normalizedText.includes("kinderfahrräder") ||
  normalizedText.includes("kinderfahrraeder") ||
  normalizedText.includes("fahrradanhänger") ||
  normalizedText.includes("fahrradanhaenger") ||
  normalizedText.includes("kinderanhänger") ||
  normalizedText.includes("kinderanhaenger")
) {
  params.append("family_feature", "children_bikes");
}


// ---------------------------------------------------------
// Kinder-Fahrradsitz
// ---------------------------------------------------------

if (
  normalizedText.includes("kinderfahrradsitz") ||
  normalizedText.includes("fahrrad kindersitz") ||
  normalizedText.includes("fahrradkindersitz")
) {
  params.append("family_feature", "child_bike_seat");
}


// ---------------------------------------------------------
// Aufzug / wenige Treppen mit Kindern
// ---------------------------------------------------------

if (
  normalizedText.includes("keine treppen mit kindern") ||
  normalizedText.includes("wenig treppen") ||
  normalizedText.includes("leicht mit kinderwagen erreichbar")
) {
  params.append("family_feature", "easy_family_access");
}


// ---------------------------------------------------------
// Erdgeschoss bevorzugt
// ---------------------------------------------------------

if (
  normalizedText.includes("erdgeschoss mit kindern") ||
  normalizedText.includes("erdgeschoss für familie") ||
  normalizedText.includes("erdgeschoss fuer familie")
) {
  params.append("family_preference", "ground_floor");
}


// ---------------------------------------------------------
// Eingezäunter Garten / Grundstück
// ---------------------------------------------------------

if (
  normalizedText.includes("eingezäunter garten") ||
  normalizedText.includes("eingezaeunter garten") ||
  normalizedText.includes("umzäunter garten") ||
  normalizedText.includes("umzaeunter garten") ||
  normalizedText.includes("eingezäuntes grundstück") ||
  normalizedText.includes("eingezaeuntes grundstück") ||
  normalizedText.includes("eingezaeuntes grundstueck")
) {
  params.append("family_feature", "fenced_garden");
}


// ---------------------------------------------------------
// Kinder-Menü / Kinderessen
// ---------------------------------------------------------

if (
  normalizedText.includes("kindermenü") ||
  normalizedText.includes("kindermenue") ||
  normalizedText.includes("kinder menü") ||
  normalizedText.includes("kinder menue") ||
  normalizedText.includes("kinderessen") ||
  normalizedText.includes("essen für kinder") ||
  normalizedText.includes("essen fuer kinder")
) {
  params.append("family_feature", "kids_menu");
}


// ---------------------------------------------------------
// Babynahrung im Restaurant / Hotel
// ---------------------------------------------------------

if (
  normalizedText.includes("babyessen") ||
  normalizedText.includes("babymenü") ||
  normalizedText.includes("babymenue") ||
  normalizedText.includes("baby menü") ||
  normalizedText.includes("baby menue")
) {
  params.append("family_feature", "baby_menu");
}


// ---------------------------------------------------------
// Kostenloser Aufenthalt für Kinder
// ---------------------------------------------------------

if (
  normalizedText.includes("kinder kostenlos") ||
  normalizedText.includes("kinder übernachten kostenlos") ||
  normalizedText.includes("kinder uebernachten kostenlos") ||
  normalizedText.includes("kostenlos für kinder") ||
  normalizedText.includes("kostenlos fuer kinder")
) {
  params.append("family_preference", "children_stay_free");
}


// ---------------------------------------------------------
// Babys kostenlos
// ---------------------------------------------------------

if (
  normalizedText.includes("baby kostenlos") ||
  normalizedText.includes("babys kostenlos") ||
  normalizedText.includes("kostenlos für babys") ||
  normalizedText.includes("kostenlos fuer babys")
) {
  params.append("family_preference", "babies_stay_free");
}


// ---------------------------------------------------------
// Ruhig für Familien / familiengeeignete Umgebung
// ---------------------------------------------------------

if (
  normalizedText.includes("ruhig für kinder") ||
  normalizedText.includes("ruhig fuer kinder") ||
  normalizedText.includes("ruhig für familien") ||
  normalizedText.includes("ruhig fuer familien") ||
  normalizedText.includes("familiengerechte lage")
) {
  params.append("family_preference", "quiet_for_families");
}


// ---------------------------------------------------------
// Nähe zu Familienattraktionen
// ---------------------------------------------------------

if (
  normalizedText.includes("nähe freizeitpark") ||
  normalizedText.includes("naehe freizeitpark") ||
  normalizedText.includes("nahe freizeitpark") ||
  normalizedText.includes("freizeitpark in der nähe") ||
  normalizedText.includes("freizeitpark in der naehe")
) {
  params.append("family_location", "near_theme_park");
}

if (
  normalizedText.includes("nähe zoo") ||
  normalizedText.includes("naehe zoo") ||
  normalizedText.includes("nahe zoo") ||
  normalizedText.includes("zoo in der nähe") ||
  normalizedText.includes("zoo in der naehe")
) {
  params.append("family_location", "near_zoo");
}

if (
  normalizedText.includes("nähe aquapark") ||
  normalizedText.includes("naehe aquapark") ||
  normalizedText.includes("nahe aquapark") ||
  normalizedText.includes("wasserpark in der nähe") ||
  normalizedText.includes("wasserpark in der naehe")
) {
  params.append("family_location", "near_water_park");
}


// ---------------------------------------------------------
// Altersbezogene Wünsche
// ---------------------------------------------------------

if (
  normalizedText.includes("mit kleinkind") ||
  normalizedText.includes("mit kleinkindern") ||
  normalizedText.includes("für kleinkinder") ||
  normalizedText.includes("fuer kleinkinder")
) {
  params.append("family_preference", "toddler_friendly");
}

if (
  normalizedText.includes("mit schulkind") ||
  normalizedText.includes("mit schulkindern") ||
  normalizedText.includes("für schulkinder") ||
  normalizedText.includes("fuer schulkinder")
) {
  params.append("family_preference", "school_child_friendly");
}

if (
  normalizedText.includes("mit teenager") ||
  normalizedText.includes("mit teenagern") ||
  normalizedText.includes("für teenager") ||
  normalizedText.includes("fuer teenager") ||
  normalizedText.includes("für jugendliche") ||
  normalizedText.includes("fuer jugendliche")
) {
  params.append("family_preference", "teen_friendly");
}


// ---------------------------------------------------------
// Gewünschtes Mindestalter / Höchstalter der Kinder
// Beispiele:
// "für Kinder ab 6 Jahren"
// "für Kinder bis 12 Jahre"
// ---------------------------------------------------------

const familyChildMinAgeMatch = normalizedText.match(
  /(?:kinder|kind)\s*(?:ab|mindestens)\s*(\d{1,2})\s*(?:jahr|jahre|jahren)/
);

const familyChildMaxAgeMatch = normalizedText.match(
  /(?:kinder|kind)\s*(?:bis|maximal|höchstens|hoechstens)\s*(\d{1,2})\s*(?:jahr|jahre|jahren)/
);

if (familyChildMinAgeMatch) {
  params.set("child_min_age", familyChildMinAgeMatch[1]);
}

if (familyChildMaxAgeMatch) {
  params.set("child_max_age", familyChildMaxAgeMatch[1]);
}


// ---------------------------------------------------------
// Familienurlaub / Reiseart
// ---------------------------------------------------------

if (
  normalizedText.includes("familienurlaub") ||
  normalizedText.includes("urlaub mit kindern") ||
  normalizedText.includes("urlaub mit familie") ||
  normalizedText.includes("reise mit kindern")
) {
  params.append("trip_style", "family_trip");
}


// ---------------------------------------------------------
// Alleinerziehend
// ---------------------------------------------------------

if (
  normalizedText.includes("alleinerziehend") ||
  normalizedText.includes("alleinerziehende") ||
  normalizedText.includes("allein mit kind") ||
  normalizedText.includes("allein mit kindern")
) {
  params.append("family_preference", "single_parent_friendly");
}


// ---------------------------------------------------------
// Mehrgenerationen-Familie
// ---------------------------------------------------------

if (
  normalizedText.includes("mehrgenerationen") ||
  normalizedText.includes("mehrgenerationenurlaub") ||
  normalizedText.includes("großeltern und kinder") ||
  normalizedText.includes("grosseltern und kinder") ||
  normalizedText.includes("mit großeltern") ||
  normalizedText.includes("mit grosseltern")
) {
  params.append("family_preference", "multi_generation");
}

// =========================================================
// BARRIEREFREIHEIT & BESONDERE BEDÜRFNISSE
// =========================================================


// ---------------------------------------------------------
// Allgemein barrierefrei / rollstuhlgerecht
// ---------------------------------------------------------

if (
  normalizedText.includes("barrierefrei") ||
  normalizedText.includes("barrierefreie") ||
  normalizedText.includes("barrierefreies") ||
  normalizedText.includes("rollstuhlgerecht") ||
  normalizedText.includes("rollstuhlgeeignet") ||
  normalizedText.includes("für rollstuhl geeignet") ||
  normalizedText.includes("fuer rollstuhl geeignet") ||
  normalizedText.includes("behindertengerecht") ||
  normalizedText.includes("behindertenfreundlich") ||
  normalizedText.includes("accessible")
) {
  params.append("accessibility_feature", "wheelchair_accessible");
}


// ---------------------------------------------------------
// Stufenlos / ebenerdig
// ---------------------------------------------------------

if (
  normalizedText.includes("stufenlos") ||
  normalizedText.includes("ohne stufen") ||
  normalizedText.includes("keine stufen") ||
  normalizedText.includes("ebenerdig") ||
  normalizedText.includes("ebenerdiger zugang") ||
  normalizedText.includes("stufenloser zugang") ||
  normalizedText.includes("step free") ||
  normalizedText.includes("step-free")
) {
  params.append("accessibility_feature", "step_free_access");
}


// ---------------------------------------------------------
// Aufzug
// ---------------------------------------------------------

if (
  normalizedText.includes("aufzug") ||
  normalizedText.includes("fahrstuhl") ||
  normalizedText.includes("lift")
) {
  params.append("accessibility_feature", "elevator");
}


// ---------------------------------------------------------
// Rollstuhlgerechter Aufzug
// ---------------------------------------------------------

if (
  normalizedText.includes("rollstuhlgerechter aufzug") ||
  normalizedText.includes("großer aufzug") ||
  normalizedText.includes("grosser aufzug") ||
  normalizedText.includes("breiter aufzug") ||
  normalizedText.includes("aufzug für rollstuhl") ||
  normalizedText.includes("aufzug fuer rollstuhl")
) {
  params.append("accessibility_feature", "wheelchair_elevator");
}


// ---------------------------------------------------------
// Breite Türen
// ---------------------------------------------------------

if (
  normalizedText.includes("breite türen") ||
  normalizedText.includes("breite tueren") ||
  normalizedText.includes("breite tür") ||
  normalizedText.includes("breite tuer") ||
  normalizedText.includes("rollstuhlgerechte türen") ||
  normalizedText.includes("rollstuhlgerechte tueren") ||
  normalizedText.includes("wide doors") ||
  normalizedText.includes("wide doorway")
) {
  params.append("accessibility_feature", "wide_doors");
}


// ---------------------------------------------------------
// Breite Flure
// ---------------------------------------------------------

if (
  normalizedText.includes("breite flure") ||
  normalizedText.includes("breiter flur") ||
  normalizedText.includes("rollstuhlgerechte flure") ||
  normalizedText.includes("viel platz für rollstuhl") ||
  normalizedText.includes("viel platz fuer rollstuhl")
) {
  params.append("accessibility_feature", "wide_corridors");
}


// ---------------------------------------------------------
// Barrierefreies Badezimmer
// ---------------------------------------------------------

if (
  normalizedText.includes("barrierefreies bad") ||
  normalizedText.includes("barrierefreies badezimmer") ||
  normalizedText.includes("rollstuhlgerechtes bad") ||
  normalizedText.includes("rollstuhlgerechtes badezimmer") ||
  normalizedText.includes("behindertengerechtes bad") ||
  normalizedText.includes("accessible bathroom")
) {
  params.append("accessibility_feature", "accessible_bathroom");
}


// ---------------------------------------------------------
// Bodengleiche Dusche
// ---------------------------------------------------------

if (
  normalizedText.includes("bodengleiche dusche") ||
  normalizedText.includes("ebenerdige dusche") ||
  normalizedText.includes("stufenlose dusche") ||
  normalizedText.includes("dusche ohne stufe") ||
  normalizedText.includes("walk in dusche") ||
  normalizedText.includes("walk-in dusche") ||
  normalizedText.includes("walk in shower")
) {
  params.append("accessibility_feature", "roll_in_shower");
}


// ---------------------------------------------------------
// Duschsitz
// ---------------------------------------------------------

if (
  normalizedText.includes("duschsitz") ||
  normalizedText.includes("dusche mit sitz") ||
  normalizedText.includes("sitz in der dusche") ||
  normalizedText.includes("duschstuhl") ||
  normalizedText.includes("shower seat")
) {
  params.append("accessibility_feature", "shower_seat");
}


// ---------------------------------------------------------
// Haltegriffe
// ---------------------------------------------------------

if (
  normalizedText.includes("haltegriffe") ||
  normalizedText.includes("haltegriff") ||
  normalizedText.includes("griffe im bad") ||
  normalizedText.includes("stützgriffe") ||
  normalizedText.includes("stuetzgriffe") ||
  normalizedText.includes("grab bars")
) {
  params.append("accessibility_feature", "grab_bars");
}


// ---------------------------------------------------------
// Erhöhte Toilette
// ---------------------------------------------------------

if (
  normalizedText.includes("erhöhte toilette") ||
  normalizedText.includes("erhoehte toilette") ||
  normalizedText.includes("erhöhtes wc") ||
  normalizedText.includes("erhoehtes wc") ||
  normalizedText.includes("raised toilet")
) {
  params.append("accessibility_feature", "raised_toilet");
}


// ---------------------------------------------------------
// Niedriges Waschbecken
// ---------------------------------------------------------

if (
  normalizedText.includes("unterfahrbares waschbecken") ||
  normalizedText.includes("niedriges waschbecken") ||
  normalizedText.includes("rollstuhlgerechtes waschbecken") ||
  normalizedText.includes("accessible sink")
) {
  params.append("accessibility_feature", "accessible_sink");
}


// ---------------------------------------------------------
// Badewanne mit Einstiegshilfe
// ---------------------------------------------------------

if (
  normalizedText.includes("badewanne mit einstiegshilfe") ||
  normalizedText.includes("badewannenlift") ||
  normalizedText.includes("wannenlift") ||
  normalizedText.includes("badewannen griff") ||
  normalizedText.includes("badewannengriff")
) {
  params.append("accessibility_feature", "accessible_bathtub");
}


// ---------------------------------------------------------
// Pflegebett / höhenverstellbares Bett
// ---------------------------------------------------------

if (
  normalizedText.includes("pflegebett") ||
  normalizedText.includes("höhenverstellbares bett") ||
  normalizedText.includes("hoehenverstellbares bett") ||
  normalizedText.includes("elektrisches bett") ||
  normalizedText.includes("verstellbares bett")
) {
  params.append("accessibility_feature", "adjustable_bed");
}


// ---------------------------------------------------------
// Bett mit guter Einstiegshöhe
// ---------------------------------------------------------

if (
  normalizedText.includes("erhöhtes bett") ||
  normalizedText.includes("erhoehtes bett") ||
  normalizedText.includes("hohes bett") ||
  normalizedText.includes("leichter betteinstieg")
) {
  params.append("accessibility_feature", "accessible_bed_height");
}


// ---------------------------------------------------------
// Rollstuhl verfügbar
// ---------------------------------------------------------

if (
  normalizedText.includes("rollstuhl verfügbar") ||
  normalizedText.includes("rollstuhl verfuegbar") ||
  normalizedText.includes("rollstuhlverleih") ||
  normalizedText.includes("rollstuhl verleih")
) {
  params.append("accessibility_feature", "wheelchair_available");
}


// ---------------------------------------------------------
// Behindertenparkplatz
// ---------------------------------------------------------

if (
  normalizedText.includes("behindertenparkplatz") ||
  normalizedText.includes("barrierefreier parkplatz") ||
  normalizedText.includes("rollstuhlparkplatz") ||
  normalizedText.includes("accessible parking")
) {
  params.append("accessibility_feature", "accessible_parking");
}


// ---------------------------------------------------------
// Parkplatz direkt am Eingang
// ---------------------------------------------------------

if (
  normalizedText.includes("parkplatz am eingang") ||
  normalizedText.includes("parkplatz direkt am eingang") ||
  normalizedText.includes("kurzer weg vom parkplatz") ||
  normalizedText.includes("parkplatz nahe eingang")
) {
  params.append("accessibility_feature", "parking_near_entrance");
}


// ---------------------------------------------------------
// Rampe
// ---------------------------------------------------------

if (
  normalizedText.includes("rampe") ||
  normalizedText.includes("rollstuhlrampe") ||
  normalizedText.includes("rollstuhl rampe") ||
  normalizedText.includes("zugangsrampe")
) {
  params.append("accessibility_feature", "wheelchair_ramp");
}


// ---------------------------------------------------------
// Automatische Türen
// ---------------------------------------------------------

if (
  normalizedText.includes("automatische tür") ||
  normalizedText.includes("automatische tuer") ||
  normalizedText.includes("automatische türen") ||
  normalizedText.includes("automatische tueren")
) {
  params.append("accessibility_feature", "automatic_doors");
}


// ---------------------------------------------------------
// Niedrige Bedienelemente
// ---------------------------------------------------------

if (
  normalizedText.includes("niedrige schalter") ||
  normalizedText.includes("niedrige lichtschalter") ||
  normalizedText.includes("niedrige bedienelemente") ||
  normalizedText.includes("schalter in rollstuhlhöhe") ||
  normalizedText.includes("schalter in rollstuhlhoehe")
) {
  params.append("accessibility_feature", "low_controls");
}


// ---------------------------------------------------------
// Sehbehinderung / blindengerecht
// ---------------------------------------------------------

if (
  normalizedText.includes("blindengerecht") ||
  normalizedText.includes("für blinde geeignet") ||
  normalizedText.includes("fuer blinde geeignet") ||
  normalizedText.includes("sehbehindertengerecht") ||
  normalizedText.includes("für sehbehinderte") ||
  normalizedText.includes("fuer sehbehinderte")
) {
  params.append("accessibility_preference", "visual_impairment_friendly");
}


// ---------------------------------------------------------
// Braille
// ---------------------------------------------------------

if (
  normalizedText.includes("braille") ||
  normalizedText.includes("blindenschrift") ||
  normalizedText.includes("beschriftung in braille")
) {
  params.append("accessibility_feature", "braille_signage");
}


// ---------------------------------------------------------
// Taktile Orientierung
// ---------------------------------------------------------

if (
  normalizedText.includes("taktile führung") ||
  normalizedText.includes("taktile fuehrung") ||
  normalizedText.includes("taktile orientierung") ||
  normalizedText.includes("bodenleitsystem") ||
  normalizedText.includes("blindenleitsystem")
) {
  params.append("accessibility_feature", "tactile_guidance");
}


// ---------------------------------------------------------
// Hörbehinderung / gehörlosengerecht
// ---------------------------------------------------------

if (
  normalizedText.includes("gehörlosengerecht") ||
  normalizedText.includes("gehoerlosengerecht") ||
  normalizedText.includes("hörbehindertengerecht") ||
  normalizedText.includes("hoerbehindertengerecht") ||
  normalizedText.includes("für gehörlose") ||
  normalizedText.includes("fuer gehoerlose") ||
  normalizedText.includes("für hörbehinderte") ||
  normalizedText.includes("fuer hoerbehinderte")
) {
  params.append("accessibility_preference", "hearing_impairment_friendly");
}


// ---------------------------------------------------------
// Visueller Alarm / Lichtsignal
// ---------------------------------------------------------

if (
  normalizedText.includes("visueller alarm") ||
  normalizedText.includes("lichtsignal") ||
  normalizedText.includes("lichtalarm") ||
  normalizedText.includes("blinkender alarm") ||
  normalizedText.includes("visual alarm")
) {
  params.append("accessibility_feature", "visual_alarm");
}


// ---------------------------------------------------------
// Hörschleife
// ---------------------------------------------------------

if (
  normalizedText.includes("hörschleife") ||
  normalizedText.includes("hoerschleife") ||
  normalizedText.includes("induktionsschleife") ||
  normalizedText.includes("hearing loop")
) {
  params.append("accessibility_feature", "hearing_loop");
}


// ---------------------------------------------------------
// Gebärdensprache
// ---------------------------------------------------------

if (
  normalizedText.includes("gebärdensprache") ||
  normalizedText.includes("gebaerdensprache") ||
  normalizedText.includes("personal mit gebärdensprache") ||
  normalizedText.includes("personal mit gebaerdensprache") ||
  normalizedText.includes("sign language")
) {
  params.append("accessibility_feature", "sign_language_support");
}


// ---------------------------------------------------------
// Assistenzhund / Blindenhund
// ---------------------------------------------------------

if (
  normalizedText.includes("assistenzhund") ||
  normalizedText.includes("assistenzhunde") ||
  normalizedText.includes("blindenhund") ||
  normalizedText.includes("blindenhunde") ||
  normalizedText.includes("service dog") ||
  normalizedText.includes("führungshund") ||
  normalizedText.includes("fuehrungshund")
) {
  params.append("accessibility_feature", "assistance_dog_allowed");
}


// ---------------------------------------------------------
// Mobilitätseinschränkung
// ---------------------------------------------------------

if (
  normalizedText.includes("mobilitätseingeschränkt") ||
  normalizedText.includes("mobilitaetseingeschraenkt") ||
  normalizedText.includes("eingeschränkte mobilität") ||
  normalizedText.includes("eingeschraenkte mobilitaet") ||
  normalizedText.includes("gehbehindert") ||
  normalizedText.includes("gehbehinderung")
) {
  params.append("accessibility_preference", "reduced_mobility");
}


// ---------------------------------------------------------
// Seniorengerecht
// ---------------------------------------------------------

if (
  normalizedText.includes("seniorengerecht") ||
  normalizedText.includes("seniorenfreundlich") ||
  normalizedText.includes("für senioren geeignet") ||
  normalizedText.includes("fuer senioren geeignet") ||
  normalizedText.includes("altersgerecht")
) {
  params.append("accessibility_preference", "senior_friendly");
}


// ---------------------------------------------------------
// Kurze Wege
// ---------------------------------------------------------

if (
  normalizedText.includes("kurze wege") ||
  normalizedText.includes("kurzer weg zum zimmer") ||
  normalizedText.includes("kurzer weg zum restaurant") ||
  normalizedText.includes("alles nah beieinander")
) {
  params.append("accessibility_preference", "short_walking_distances");
}


// ---------------------------------------------------------
// Keine Treppen
// ---------------------------------------------------------

if (
  normalizedText.includes("keine treppen") ||
  normalizedText.includes("ohne treppen") ||
  normalizedText.includes("treppen vermeiden")
) {
  params.append("accessibility_preference", "no_stairs");
}


// ---------------------------------------------------------
// Erdgeschoss
// ---------------------------------------------------------

if (
  normalizedText.includes("erdgeschoss") ||
  normalizedText.includes("zimmer im erdgeschoss") ||
  normalizedText.includes("wohnung im erdgeschoss")
) {
  params.append("accessibility_preference", "ground_floor");
}


// ---------------------------------------------------------
// Medizinische / Pflege-Unterstützung
// ---------------------------------------------------------

if (
  normalizedText.includes("pflegeservice") ||
  normalizedText.includes("pflege service") ||
  normalizedText.includes("pflegeunterstützung") ||
  normalizedText.includes("pflegeunterstuetzung")
) {
  params.append("special_support", "care_support");
}

if (
  normalizedText.includes("arzt im hotel") ||
  normalizedText.includes("arzt vor ort") ||
  normalizedText.includes("ärztliche betreuung") ||
  normalizedText.includes("aerztliche betreuung") ||
  normalizedText.includes("medizinische betreuung")
) {
  params.append("special_support", "medical_support");
}


// ---------------------------------------------------------
// Nähe Krankenhaus / Arzt / Apotheke
// ---------------------------------------------------------

if (
  normalizedText.includes("krankenhaus in der nähe") ||
  normalizedText.includes("krankenhaus in der naehe") ||
  normalizedText.includes("nähe krankenhaus") ||
  normalizedText.includes("naehe krankenhaus")
) {
  params.append("accessibility_location", "near_hospital");
}

if (
  normalizedText.includes("arzt in der nähe") ||
  normalizedText.includes("arzt in der naehe") ||
  normalizedText.includes("nähe arzt") ||
  normalizedText.includes("naehe arzt")
) {
  params.append("accessibility_location", "near_doctor");
}

if (
  normalizedText.includes("apotheke in der nähe") ||
  normalizedText.includes("apotheke in der naehe") ||
  normalizedText.includes("nähe apotheke") ||
  normalizedText.includes("naehe apotheke")
) {
  params.append("accessibility_location", "near_pharmacy");
}


// ---------------------------------------------------------
// Allergikerfreundlich
// ---------------------------------------------------------

if (
  normalizedText.includes("allergikerfreundlich") ||
  normalizedText.includes("für allergiker") ||
  normalizedText.includes("fuer allergiker") ||
  normalizedText.includes("allergiker geeignet")
) {
  params.append("special_need", "allergy_friendly");
}


// ---------------------------------------------------------
// Hypoallergenes Zimmer
// ---------------------------------------------------------

if (
  normalizedText.includes("hypoallergen") ||
  normalizedText.includes("hypoallergenes zimmer") ||
  normalizedText.includes("allergikerzimmer") ||
  normalizedText.includes("allergiker zimmer")
) {
  params.append("special_need", "hypoallergenic_room");
}


// ---------------------------------------------------------
// Teppichfrei
// ---------------------------------------------------------

if (
  normalizedText.includes("teppichfrei") ||
  normalizedText.includes("ohne teppich") ||
  normalizedText.includes("kein teppich") ||
  normalizedText.includes("teppichlos")
) {
  params.append("special_need", "carpet_free");
}


// ---------------------------------------------------------
// Rauchfrei
// ---------------------------------------------------------

if (
  normalizedText.includes("rauchfrei") ||
  normalizedText.includes("nichtraucher") ||
  normalizedText.includes("nicht raucher") ||
  normalizedText.includes("rauchfreies zimmer") ||
  normalizedText.includes("nichtraucherzimmer")
) {
  params.append("special_need", "non_smoking");
}


// ---------------------------------------------------------
// Duftstoffarm / duftstofffrei
// ---------------------------------------------------------

if (
  normalizedText.includes("duftstofffrei") ||
  normalizedText.includes("ohne duftstoffe") ||
  normalizedText.includes("parfümfrei") ||
  normalizedText.includes("parfuemfrei")
) {
  params.append("special_need", "fragrance_free");
}


// ---------------------------------------------------------
// Ruhige Unterkunft bei sensorischer Empfindlichkeit
// ---------------------------------------------------------

if (
  normalizedText.includes("reizarm") ||
  normalizedText.includes("reizarme unterkunft") ||
  normalizedText.includes("sensorisch ruhig") ||
  normalizedText.includes("wenig reize")
) {
  params.append("special_need", "low_sensory_environment");
}


// ---------------------------------------------------------
// Ruhiges Zimmer
// ---------------------------------------------------------

if (
  normalizedText.includes("ruhiges zimmer") ||
  normalizedText.includes("besonders ruhiges zimmer") ||
  normalizedText.includes("zimmer weit weg vom aufzug")
) {
  params.append("special_need", "quiet_room");
}


// ---------------------------------------------------------
// Glutenfrei
// ---------------------------------------------------------

if (
  normalizedText.includes("glutenfrei") ||
  normalizedText.includes("glutenfreies essen") ||
  normalizedText.includes("glutenfreie verpflegung")
) {
  params.append("dietary_need", "gluten_free");
}


// ---------------------------------------------------------
// Laktosefrei
// ---------------------------------------------------------

if (
  normalizedText.includes("laktosefrei") ||
  normalizedText.includes("lactosefrei") ||
  normalizedText.includes("laktosefreies essen")
) {
  params.append("dietary_need", "lactose_free");
}


// ---------------------------------------------------------
// Vegetarisch
// ---------------------------------------------------------

if (
  normalizedText.includes("vegetarisch") ||
  normalizedText.includes("vegetarisches essen") ||
  normalizedText.includes("vegetarische optionen")
) {
  params.append("dietary_need", "vegetarian");
}


// ---------------------------------------------------------
// Vegan
// ---------------------------------------------------------

if (
  normalizedText.includes("vegan") ||
  normalizedText.includes("veganes essen") ||
  normalizedText.includes("vegane optionen")
) {
  params.append("dietary_need", "vegan");
}


// ---------------------------------------------------------
// Lebensmittelallergien
// ---------------------------------------------------------

if (
  normalizedText.includes("lebensmittelallergie") ||
  normalizedText.includes("lebensmittelallergien") ||
  normalizedText.includes("nahrungsmittelallergie") ||
  normalizedText.includes("nahrungsmittelallergien")
) {
  params.append("dietary_need", "food_allergy_support");
}


// ---------------------------------------------------------
// Pflege-/Hilfsmittel unterbringen
// ---------------------------------------------------------

if (
  normalizedText.includes("platz für rollator") ||
  normalizedText.includes("platz fuer rollator") ||
  normalizedText.includes("rollator geeignet")
) {
  params.append("accessibility_feature", "walker_friendly");
}

if (
  normalizedText.includes("platz für mobilitätsroller") ||
  normalizedText.includes("platz fuer mobilitaetsroller") ||
  normalizedText.includes("mobility scooter")
) {
  params.append("accessibility_feature", "mobility_scooter_friendly");
}


// ---------------------------------------------------------
// Ladestation für elektrischen Rollstuhl
// ---------------------------------------------------------

if (
  normalizedText.includes("rollstuhl laden") ||
  normalizedText.includes("elektrischen rollstuhl laden") ||
  normalizedText.includes("ladestation für rollstuhl") ||
  normalizedText.includes("ladestation fuer rollstuhl") ||
  normalizedText.includes("mobility scooter laden")
) {
  params.append("accessibility_feature", "mobility_device_charging");
}


// ---------------------------------------------------------
// Barrierefreier Strandzugang
// ---------------------------------------------------------

if (
  normalizedText.includes("barrierefreier strand") ||
  normalizedText.includes("barrierefreier strandzugang") ||
  normalizedText.includes("rollstuhlgerechter strand") ||
  normalizedText.includes("strandrollstuhl")
) {
  params.append("accessibility_feature", "accessible_beach");
}


// ---------------------------------------------------------
// Barrierefreier Pool
// ---------------------------------------------------------

if (
  normalizedText.includes("barrierefreier pool") ||
  normalizedText.includes("rollstuhlgerechter pool") ||
  normalizedText.includes("poollift") ||
  normalizedText.includes("pool lift") ||
  normalizedText.includes("pool mit rampe")
) {
  params.append("accessibility_feature", "accessible_pool");
}


// ---------------------------------------------------------
// Barrierefreie öffentliche Bereiche
// ---------------------------------------------------------

if (
  normalizedText.includes("barrierefreie gemeinschaftsbereiche") ||
  normalizedText.includes("barrierefreie öffentliche bereiche") ||
  normalizedText.includes("barrierefreie oeffentliche bereiche") ||
  normalizedText.includes("barrierefreies restaurant") ||
  normalizedText.includes("barrierefreie lobby")
) {
  params.append("accessibility_feature", "accessible_common_areas");
}

// =========================================================
// HAUSTIERE & URLAUB MIT HUND / KATZE
// =========================================================


// ---------------------------------------------------------
// Haustiere allgemein erlaubt
// ---------------------------------------------------------

if (
  normalizedText.includes("haustiere erlaubt") ||
  normalizedText.includes("haustier erlaubt") ||
  normalizedText.includes("tiere erlaubt") ||
  normalizedText.includes("tier erlaubt") ||
  normalizedText.includes("pet friendly") ||
  normalizedText.includes("pet-friendly") ||
  normalizedText.includes("haustierfreundlich") ||
  normalizedText.includes("tierfreundlich")
) {
  params.append("pet_feature", "pets_allowed");
}


// ---------------------------------------------------------
// Hunde erlaubt
// ---------------------------------------------------------

if (
  normalizedText.includes("hunde erlaubt") ||
  normalizedText.includes("hund erlaubt") ||
  normalizedText.includes("mit hund") ||
  normalizedText.includes("hund willkommen") ||
  normalizedText.includes("hundefreundlich") ||
  normalizedText.includes("dog friendly") ||
  normalizedText.includes("dog-friendly")
) {
  params.append("pet_feature", "dogs_allowed");
}


// ---------------------------------------------------------
// Katzen erlaubt
// ---------------------------------------------------------

if (
  normalizedText.includes("katzen erlaubt") ||
  normalizedText.includes("katze erlaubt") ||
  normalizedText.includes("mit katze") ||
  normalizedText.includes("katzen willkommen") ||
  normalizedText.includes("katzenfreundlich") ||
  normalizedText.includes("cat friendly") ||
  normalizedText.includes("cat-friendly")
) {
  params.append("pet_feature", "cats_allowed");
}


// ---------------------------------------------------------
// Mehrere Haustiere erlaubt
// ---------------------------------------------------------

if (
  normalizedText.includes("mehrere haustiere") ||
  normalizedText.includes("mehrere hunde") ||
  normalizedText.includes("mehrere katzen") ||
  normalizedText.includes("zwei hunde") ||
  normalizedText.includes("2 hunde") ||
  normalizedText.includes("mehr als ein hund") ||
  normalizedText.includes("mehr als ein haustier")
) {
  params.append("pet_preference", "multiple_pets_allowed");
}


// ---------------------------------------------------------
// Anzahl Hunde / Haustiere
// Beispiele:
// "2 Hunde"
// "mindestens 2 Hunde"
// "maximal 3 Hunde"
// ---------------------------------------------------------

const minDogsMatch = normalizedText.match(
  /(?:mindestens|minimum|min\.?|ab)\s*(\d+)\s*(?:hund|hunde|hunden)/
);

const maxDogsMatch = normalizedText.match(
  /(?:maximal|höchstens|hoechstens|max\.?|bis zu)\s*(\d+)\s*(?:hund|hunde|hunden)/
);

const exactDogsMatch = normalizedText.match(
  /(?:^|\s)(\d+)\s*(?:hund|hunde|hunden)(?=\s|$)/
);

if (minDogsMatch) {
  params.set("min_dogs", minDogsMatch[1]);
}

if (maxDogsMatch) {
  params.set("max_dogs", maxDogsMatch[1]);
}

if (
  exactDogsMatch &&
  !minDogsMatch &&
  !maxDogsMatch
) {
  params.set("min_dogs", exactDogsMatch[1]);
}


const minPetsMatch = normalizedText.match(
  /(?:mindestens|minimum|min\.?|ab)\s*(\d+)\s*(?:haustier|haustiere|haustieren|tiere|tieren)/
);

const maxPetsMatch = normalizedText.match(
  /(?:maximal|höchstens|hoechstens|max\.?|bis zu)\s*(\d+)\s*(?:haustier|haustiere|haustieren|tiere|tieren)/
);

if (minPetsMatch) {
  params.set("min_pets", minPetsMatch[1]);
}

if (maxPetsMatch) {
  params.set("max_pets", maxPetsMatch[1]);
}


// ---------------------------------------------------------
// Kleine Hunde
// ---------------------------------------------------------

if (
  normalizedText.includes("kleiner hund") ||
  normalizedText.includes("kleine hunde") ||
  normalizedText.includes("kleinhund") ||
  normalizedText.includes("kleinhunde") ||
  normalizedText.includes("kleine hunderasse") ||
  normalizedText.includes("small dog")
) {
  params.append("pet_size", "small");
}


// ---------------------------------------------------------
// Mittelgroße Hunde
// ---------------------------------------------------------

if (
  normalizedText.includes("mittelgroßer hund") ||
  normalizedText.includes("mittelgrosser hund") ||
  normalizedText.includes("mittelgroße hunde") ||
  normalizedText.includes("mittelgrosse hunde") ||
  normalizedText.includes("mittelgroße hunderasse") ||
  normalizedText.includes("mittelgrosse hunderasse") ||
  normalizedText.includes("medium dog")
) {
  params.append("pet_size", "medium");
}


// ---------------------------------------------------------
// Große Hunde
// ---------------------------------------------------------

if (
  normalizedText.includes("großer hund") ||
  normalizedText.includes("grosser hund") ||
  normalizedText.includes("große hunde") ||
  normalizedText.includes("grosse hunde") ||
  normalizedText.includes("große hunderasse") ||
  normalizedText.includes("grosse hunderasse") ||
  normalizedText.includes("large dog")
) {
  params.append("pet_size", "large");
}


// ---------------------------------------------------------
// Keine Größenbeschränkung
// ---------------------------------------------------------

if (
  normalizedText.includes("hunde jeder größe") ||
  normalizedText.includes("hunde jeder groesse") ||
  normalizedText.includes("keine größenbeschränkung") ||
  normalizedText.includes("keine groessenbeschraenkung") ||
  normalizedText.includes("große hunde erlaubt") ||
  normalizedText.includes("grosse hunde erlaubt")
) {
  params.append("pet_preference", "no_size_limit");
}


// ---------------------------------------------------------
// Haustiere kostenlos
// ---------------------------------------------------------

if (
  normalizedText.includes("haustiere kostenlos") ||
  normalizedText.includes("hund kostenlos") ||
  normalizedText.includes("hunde kostenlos") ||
  normalizedText.includes("katzen kostenlos") ||
  normalizedText.includes("keine haustiergebühr") ||
  normalizedText.includes("keine haustiergebuehr") ||
  normalizedText.includes("ohne haustiergebühr") ||
  normalizedText.includes("ohne haustiergebuehr")
) {
  params.append("pet_preference", "pets_stay_free");
}


// ---------------------------------------------------------
// Haustiergebühr akzeptiert / vorhanden
// ---------------------------------------------------------

if (
  normalizedText.includes("haustiergebühr") ||
  normalizedText.includes("haustiergebuehr") ||
  normalizedText.includes("hundegebühr") ||
  normalizedText.includes("hundegebuehr") ||
  normalizedText.includes("pet fee")
) {
  params.append("pet_feature", "pet_fee");
}


// ---------------------------------------------------------
// Max. Haustiergebühr
// Beispiele:
// "maximal 20 euro für den hund"
// "haustiergebühr bis 15 €"
// ---------------------------------------------------------

const maxPetFeeMatch = normalizedText.match(
  /(?:haustiergebühr|haustiergebuehr|hundegebühr|hundegebuehr|pet fee)(?:\s*(?:maximal|höchstens|hoechstens|bis zu|max\.?))?\s*(\d+(?:[.,]\d{1,2})?)\s*(?:€|euro)/
);

const maxPetFeeReverseMatch = normalizedText.match(
  /(?:maximal|höchstens|hoechstens|bis zu|max\.?)\s*(\d+(?:[.,]\d{1,2})?)\s*(?:€|euro)\s*(?:für|fuer)?\s*(?:den\s*)?(?:hund|haustier|hunde|haustiere)/
);

const petFeeValue =
  maxPetFeeMatch?.[1] ??
  maxPetFeeReverseMatch?.[1];

if (petFeeValue) {
  params.set(
    "max_pet_fee",
    petFeeValue.replace(",", ".")
  );
}


// ---------------------------------------------------------
// Eingezäunter Garten / Grundstück
// ---------------------------------------------------------

if (
  normalizedText.includes("eingezäunter garten") ||
  normalizedText.includes("eingezaeunter garten") ||
  normalizedText.includes("umzäunter garten") ||
  normalizedText.includes("umzaeunter garten") ||
  normalizedText.includes("eingezäuntes grundstück") ||
  normalizedText.includes("eingezaeuntes grundstück") ||
  normalizedText.includes("eingezaeuntes grundstueck") ||
  normalizedText.includes("sicherer garten für hund") ||
  normalizedText.includes("sicherer garten fuer hund")
) {
  params.append("pet_feature", "fenced_garden");
}


// ---------------------------------------------------------
// Privater Garten für Hund
// ---------------------------------------------------------

if (
  normalizedText.includes("privater garten für hund") ||
  normalizedText.includes("privater garten fuer hund") ||
  normalizedText.includes("eigener garten mit hund") ||
  normalizedText.includes("eigener garten für hund") ||
  normalizedText.includes("eigener garten fuer hund")
) {
  params.append("pet_feature", "private_pet_garden");
}


// ---------------------------------------------------------
// Hundeauslauf / Freilauffläche
// ---------------------------------------------------------

if (
  normalizedText.includes("hundeauslauf") ||
  normalizedText.includes("hunde auslauf") ||
  normalizedText.includes("freilauffläche") ||
  normalizedText.includes("freilaufflaeche") ||
  normalizedText.includes("auslauffläche für hunde") ||
  normalizedText.includes("auslaufflaeche fuer hunde") ||
  normalizedText.includes("hundefreilauf")
) {
  params.append("pet_feature", "dog_run");
}


// ---------------------------------------------------------
// Hundewiese
// ---------------------------------------------------------

if (
  normalizedText.includes("hundewiese") ||
  normalizedText.includes("hunde wiese") ||
  normalizedText.includes("wiese für hunde") ||
  normalizedText.includes("wiese fuer hunde")
) {
  params.append("pet_feature", "dog_meadow");
}


// ---------------------------------------------------------
// Hundestrand
// ---------------------------------------------------------

if (
  normalizedText.includes("hundestrand") ||
  normalizedText.includes("hunde strand") ||
  normalizedText.includes("strand für hunde") ||
  normalizedText.includes("strand fuer hunde") ||
  normalizedText.includes("dog beach")
) {
  params.append("pet_location", "near_dog_beach");
}


// ---------------------------------------------------------
// Hundestrand direkt / nah
// ---------------------------------------------------------

if (
  normalizedText.includes("hundestrand in der nähe") ||
  normalizedText.includes("hundestrand in der naehe") ||
  normalizedText.includes("nah am hundestrand") ||
  normalizedText.includes("nahe hundestrand")
) {
  params.append("pet_location", "near_dog_beach");
}


// ---------------------------------------------------------
// Wanderwege / Spazierwege für Hunde
// ---------------------------------------------------------

if (
  normalizedText.includes("wanderwege mit hund") ||
  normalizedText.includes("wanderwege für hunde") ||
  normalizedText.includes("wanderwege fuer hunde") ||
  normalizedText.includes("spazierwege mit hund") ||
  normalizedText.includes("spazierwege für hunde") ||
  normalizedText.includes("spazierwege fuer hunde") ||
  normalizedText.includes("gassiwege")
) {
  params.append("pet_location", "near_dog_walking_routes");
}


// ---------------------------------------------------------
// Wald / Natur für Hund
// ---------------------------------------------------------

if (
  normalizedText.includes("wald für hund") ||
  normalizedText.includes("wald fuer hund") ||
  normalizedText.includes("wald in der nähe für hund") ||
  normalizedText.includes("wald in der naehe fuer hund") ||
  normalizedText.includes("natur mit hund") ||
  normalizedText.includes("viel natur für hund") ||
  normalizedText.includes("viel natur fuer hund")
) {
  params.append("pet_location", "near_nature_for_pets");
}


// ---------------------------------------------------------
// Futternapf / Wassernapf
// ---------------------------------------------------------

if (
  normalizedText.includes("futternapf") ||
  normalizedText.includes("futternäpfe") ||
  normalizedText.includes("futter naepfe") ||
  normalizedText.includes("wassernapf") ||
  normalizedText.includes("wassernäpfe") ||
  normalizedText.includes("wassernaepfe") ||
  normalizedText.includes("hundenapf") ||
  normalizedText.includes("hundenäpfe") ||
  normalizedText.includes("hundenaepfe") ||
  normalizedText.includes("näpfe für hunde") ||
  normalizedText.includes("naepfe fuer hunde")
) {
  params.append("pet_feature", "pet_bowls");
}


// ---------------------------------------------------------
// Hundebett / Haustierbett
// ---------------------------------------------------------

if (
  normalizedText.includes("hundebett") ||
  normalizedText.includes("hunde bett") ||
  normalizedText.includes("haustierbett") ||
  normalizedText.includes("pet bed")
) {
  params.append("pet_feature", "pet_bed");
}


// ---------------------------------------------------------
// Hundedecke
// ---------------------------------------------------------

if (
  normalizedText.includes("hundedecke") ||
  normalizedText.includes("hunde decke") ||
  normalizedText.includes("decke für hund") ||
  normalizedText.includes("decke fuer hund")
) {
  params.append("pet_feature", "pet_blanket");
}


// ---------------------------------------------------------
// Hundedusche / Waschstation
// ---------------------------------------------------------

if (
  normalizedText.includes("hundedusche") ||
  normalizedText.includes("hunde dusche") ||
  normalizedText.includes("hundewaschplatz") ||
  normalizedText.includes("hunde waschplatz") ||
  normalizedText.includes("waschstation für hunde") ||
  normalizedText.includes("waschstation fuer hunde") ||
  normalizedText.includes("dog shower")
) {
  params.append("pet_feature", "dog_wash_station");
}


// ---------------------------------------------------------
// Handtücher für Hunde
// ---------------------------------------------------------

if (
  normalizedText.includes("handtücher für hunde") ||
  normalizedText.includes("handtuecher fuer hunde") ||
  normalizedText.includes("hundehandtücher") ||
  normalizedText.includes("hundehandtuecher")
) {
  params.append("pet_feature", "pet_towels");
}


// ---------------------------------------------------------
// Hundekotbeutel
// ---------------------------------------------------------

if (
  normalizedText.includes("hundekotbeutel") ||
  normalizedText.includes("kotbeutel") ||
  normalizedText.includes("beutel für hundekot") ||
  normalizedText.includes("beutel fuer hundekot")
) {
  params.append("pet_feature", "dog_waste_bags");
}


// ---------------------------------------------------------
// Hunde-Futter vorhanden
// ---------------------------------------------------------

if (
  normalizedText.includes("hundefutter") ||
  normalizedText.includes("hunde futter") ||
  normalizedText.includes("futter für hunde") ||
  normalizedText.includes("futter fuer hunde")
) {
  params.append("pet_feature", "dog_food_available");
}


// ---------------------------------------------------------
// Kühlschrank für Tierfutter / BARF
// ---------------------------------------------------------

if (
  normalizedText.includes("barf") ||
  normalizedText.includes("barf geeignet") ||
  normalizedText.includes("kühlschrank für hundefutter") ||
  normalizedText.includes("kuehlschrank fuer hundefutter") ||
  normalizedText.includes("gefrierfach für hundefutter") ||
  normalizedText.includes("gefrierfach fuer hundefutter")
) {
  params.append("pet_feature", "raw_pet_food_storage");
}


// ---------------------------------------------------------
// Hundesitting
// ---------------------------------------------------------

if (
  normalizedText.includes("hundesitter") ||
  normalizedText.includes("hundesitting") ||
  normalizedText.includes("dogsitter") ||
  normalizedText.includes("dog sitter") ||
  normalizedText.includes("betreuung für hund") ||
  normalizedText.includes("betreuung fuer hund")
) {
  params.append("pet_service", "dog_sitting");
}


// ---------------------------------------------------------
// Hundebetreuung / Tagesbetreuung
// ---------------------------------------------------------

if (
  normalizedText.includes("hundebetreuung") ||
  normalizedText.includes("hunde betreuung") ||
  normalizedText.includes("hundetagesstätte") ||
  normalizedText.includes("hundetagesstaette") ||
  normalizedText.includes("dog daycare")
) {
  params.append("pet_service", "dog_daycare");
}


// ---------------------------------------------------------
// Tierarzt in der Nähe
// ---------------------------------------------------------

if (
  normalizedText.includes("tierarzt in der nähe") ||
  normalizedText.includes("tierarzt in der naehe") ||
  normalizedText.includes("nähe tierarzt") ||
  normalizedText.includes("naehe tierarzt") ||
  normalizedText.includes("tierklinik in der nähe") ||
  normalizedText.includes("tierklinik in der naehe")
) {
  params.append("pet_location", "near_vet");
}


// ---------------------------------------------------------
// Tierbedarf / Zoohandlung in der Nähe
// ---------------------------------------------------------

if (
  normalizedText.includes("zoohandlung in der nähe") ||
  normalizedText.includes("zoohandlung in der naehe") ||
  normalizedText.includes("tierbedarf in der nähe") ||
  normalizedText.includes("tierbedarf in der naehe") ||
  normalizedText.includes("tierladen in der nähe") ||
  normalizedText.includes("tierladen in der naehe")
) {
  params.append("pet_location", "near_pet_store");
}


// ---------------------------------------------------------
// Hunde im Restaurant erlaubt
// ---------------------------------------------------------

if (
  normalizedText.includes("hund im restaurant erlaubt") ||
  normalizedText.includes("hunde im restaurant erlaubt") ||
  normalizedText.includes("hund darf ins restaurant") ||
  normalizedText.includes("hunde dürfen ins restaurant") ||
  normalizedText.includes("hunde duerfen ins restaurant")
) {
  params.append("pet_feature", "dogs_allowed_in_restaurant");
}


// ---------------------------------------------------------
// Hunde am Pool erlaubt
// ---------------------------------------------------------

if (
  normalizedText.includes("hund am pool erlaubt") ||
  normalizedText.includes("hunde am pool erlaubt") ||
  normalizedText.includes("hund darf an den pool") ||
  normalizedText.includes("hunde dürfen an den pool") ||
  normalizedText.includes("hunde duerfen an den pool")
) {
  params.append("pet_feature", "dogs_allowed_pool_area");
}


// ---------------------------------------------------------
// Hunde auf Terrasse / Balkon erlaubt
// ---------------------------------------------------------

if (
  normalizedText.includes("hund auf terrasse erlaubt") ||
  normalizedText.includes("hunde auf terrasse erlaubt") ||
  normalizedText.includes("hund auf balkon erlaubt") ||
  normalizedText.includes("hunde auf balkon erlaubt")
) {
  params.append("pet_feature", "pets_allowed_outdoor_area");
}


// ---------------------------------------------------------
// Haustier darf allein im Zimmer bleiben
// ---------------------------------------------------------

if (
  normalizedText.includes("hund darf allein bleiben") ||
  normalizedText.includes("hund darf alleine bleiben") ||
  normalizedText.includes("haustier darf allein bleiben") ||
  normalizedText.includes("haustier darf alleine bleiben") ||
  normalizedText.includes("hund allein im zimmer")
) {
  params.append("pet_preference", "pet_can_stay_alone");
}


// ---------------------------------------------------------
// Keine Haustiere gewünscht
// ---------------------------------------------------------

if (
  normalizedText.includes("keine haustiere") ||
  normalizedText.includes("ohne haustiere") ||
  normalizedText.includes("haustierfreie unterkunft") ||
  normalizedText.includes("tierfreie unterkunft") ||
  normalizedText.includes("keine hunde") ||
  normalizedText.includes("ohne hunde")
) {
  params.append("pet_preference", "pet_free_property");
}


// ---------------------------------------------------------
// Allergiker: Unterkunft ohne Haustiere
// ---------------------------------------------------------

if (
  normalizedText.includes("keine tiere wegen allergie") ||
  normalizedText.includes("keine haustiere wegen allergie") ||
  normalizedText.includes("tierhaarallergie") ||
  normalizedText.includes("tierhaar allergie")
) {
  params.append("pet_preference", "pet_free_for_allergy");
}


// ---------------------------------------------------------
// Urlaub mit Hund als Reiseart
// ---------------------------------------------------------

if (
  normalizedText.includes("urlaub mit hund") ||
  normalizedText.includes("reise mit hund") ||
  normalizedText.includes("ferien mit hund") ||
  normalizedText.includes("hundeurlaub")
) {
  params.append("trip_style", "dog_trip");
}


// ---------------------------------------------------------
// Urlaub mit Haustier
// ---------------------------------------------------------

if (
  normalizedText.includes("urlaub mit haustier") ||
  normalizedText.includes("urlaub mit haustieren") ||
  normalizedText.includes("reise mit haustier") ||
  normalizedText.includes("reise mit haustieren")
) {
  params.append("trip_style", "pet_trip");
}

// =========================================================
// MOBILITÄT, ANREISE & VERKEHR
// =========================================================


// ---------------------------------------------------------
// Parkplatz allgemein
// ---------------------------------------------------------

if (
  normalizedText.includes("parkplatz") ||
  normalizedText.includes("parkplätze") ||
  normalizedText.includes("parkplaetze") ||
  normalizedText.includes("stellplatz") ||
  normalizedText.includes("stellplätze") ||
  normalizedText.includes("stellplaetze") ||
  normalizedText.includes("parking")
) {
  params.append("transport_feature", "parking");
}


// ---------------------------------------------------------
// Kostenloser Parkplatz
// ---------------------------------------------------------

if (
  normalizedText.includes("kostenloser parkplatz") ||
  normalizedText.includes("kostenlose parkplätze") ||
  normalizedText.includes("kostenlose parkplaetze") ||
  normalizedText.includes("gratis parkplatz") ||
  normalizedText.includes("gratis parken") ||
  normalizedText.includes("kostenlos parken") ||
  normalizedText.includes("parkplatz inklusive")
) {
  params.append("transport_feature", "free_parking");
}


// ---------------------------------------------------------
// Privater Parkplatz
// ---------------------------------------------------------

if (
  normalizedText.includes("privater parkplatz") ||
  normalizedText.includes("private parkplätze") ||
  normalizedText.includes("private parkplaetze") ||
  normalizedText.includes("eigener parkplatz") ||
  normalizedText.includes("eigener stellplatz")
) {
  params.append("transport_feature", "private_parking");
}


// ---------------------------------------------------------
// Parkplatz direkt an der Unterkunft
// ---------------------------------------------------------

if (
  normalizedText.includes("parkplatz an der unterkunft") ||
  normalizedText.includes("parkplatz direkt an der unterkunft") ||
  normalizedText.includes("parkplatz am haus") ||
  normalizedText.includes("stellplatz am haus") ||
  normalizedText.includes("parken direkt am haus") ||
  normalizedText.includes("parkplatz vor der tür") ||
  normalizedText.includes("parkplatz vor der tuer")
) {
  params.append("transport_feature", "parking_on_site");
}


// ---------------------------------------------------------
// Reservierter Parkplatz
// ---------------------------------------------------------

if (
  normalizedText.includes("reservierter parkplatz") ||
  normalizedText.includes("reservierter stellplatz") ||
  normalizedText.includes("fester parkplatz") ||
  normalizedText.includes("eigener reservierter parkplatz")
) {
  params.append("transport_feature", "reserved_parking");
}


// ---------------------------------------------------------
// Überdachter Parkplatz
// ---------------------------------------------------------

if (
  normalizedText.includes("überdachter parkplatz") ||
  normalizedText.includes("ueberdachter parkplatz") ||
  normalizedText.includes("überdachter stellplatz") ||
  normalizedText.includes("ueberdachter stellplatz") ||
  normalizedText.includes("carport")
) {
  params.append("transport_feature", "covered_parking");
}


// ---------------------------------------------------------
// Garage
// ---------------------------------------------------------

if (
  normalizedText.includes("garage") ||
  normalizedText.includes("tiefgarage") ||
  normalizedText.includes("parkgarage")
) {
  params.append("transport_feature", "garage");
}


// ---------------------------------------------------------
// Kostenlose Garage
// ---------------------------------------------------------

if (
  normalizedText.includes("kostenlose garage") ||
  normalizedText.includes("garage kostenlos") ||
  normalizedText.includes("kostenlose tiefgarage")
) {
  params.append("transport_feature", "free_garage");
}


// ---------------------------------------------------------
// Gesicherter Parkplatz
// ---------------------------------------------------------

if (
  normalizedText.includes("gesicherter parkplatz") ||
  normalizedText.includes("bewachter parkplatz") ||
  normalizedText.includes("abgeschlossener parkplatz") ||
  normalizedText.includes("sicherer parkplatz") ||
  normalizedText.includes("videoüberwachter parkplatz") ||
  normalizedText.includes("videoueberwachter parkplatz")
) {
  params.append("transport_feature", "secure_parking");
}


// ---------------------------------------------------------
// Parkplatz für großes Fahrzeug
// ---------------------------------------------------------

if (
  normalizedText.includes("parkplatz für großes auto") ||
  normalizedText.includes("parkplatz fuer grosses auto") ||
  normalizedText.includes("großer parkplatz") ||
  normalizedText.includes("grosser parkplatz") ||
  normalizedText.includes("großer stellplatz") ||
  normalizedText.includes("grosser stellplatz") ||
  normalizedText.includes("suv parkplatz")
) {
  params.append("transport_feature", "large_vehicle_parking");
}


// ---------------------------------------------------------
// Motorradparkplatz
// ---------------------------------------------------------

if (
  normalizedText.includes("motorradparkplatz") ||
  normalizedText.includes("motorrad parkplatz") ||
  normalizedText.includes("stellplatz für motorrad") ||
  normalizedText.includes("stellplatz fuer motorrad")
) {
  params.append("transport_feature", "motorcycle_parking");
}


// ---------------------------------------------------------
// Fahrradstellplatz
// ---------------------------------------------------------

if (
  normalizedText.includes("fahrradstellplatz") ||
  normalizedText.includes("fahrradstellplätze") ||
  normalizedText.includes("fahrradstellplaetze") ||
  normalizedText.includes("fahrradparkplatz") ||
  normalizedText.includes("fahrrad abstellen")
) {
  params.append("transport_feature", "bicycle_parking");
}


// ---------------------------------------------------------
// Abschließbarer Fahrradraum
// ---------------------------------------------------------

if (
  normalizedText.includes("abschließbarer fahrradraum") ||
  normalizedText.includes("abschliessbarer fahrradraum") ||
  normalizedText.includes("abschließbarer fahrradkeller") ||
  normalizedText.includes("abschliessbarer fahrradkeller") ||
  normalizedText.includes("sicherer fahrradraum") ||
  normalizedText.includes("fahrradgarage")
) {
  params.append("transport_feature", "secure_bicycle_storage");
}


// ---------------------------------------------------------
// E-Auto Ladestation
// ---------------------------------------------------------

if (
  normalizedText.includes("e auto ladestation") ||
  normalizedText.includes("e-auto ladestation") ||
  normalizedText.includes("elektroauto ladestation") ||
  normalizedText.includes("ladestation für elektroauto") ||
  normalizedText.includes("ladestation fuer elektroauto") ||
  normalizedText.includes("ladesäule") ||
  normalizedText.includes("ladesaeule") ||
  normalizedText.includes("wallbox") ||
  normalizedText.includes("ev charger") ||
  normalizedText.includes("ev charging")
) {
  params.append("transport_feature", "ev_charging");
}


// ---------------------------------------------------------
// Private Wallbox
// ---------------------------------------------------------

if (
  normalizedText.includes("private wallbox") ||
  normalizedText.includes("eigene wallbox") ||
  normalizedText.includes("wallbox an der unterkunft") ||
  normalizedText.includes("private ladestation")
) {
  params.append("transport_feature", "private_ev_charger");
}


// ---------------------------------------------------------
// E-Bike Ladestation
// ---------------------------------------------------------

if (
  normalizedText.includes("e bike ladestation") ||
  normalizedText.includes("e-bike ladestation") ||
  normalizedText.includes("ebike ladestation") ||
  normalizedText.includes("e bike laden") ||
  normalizedText.includes("e-bike laden") ||
  normalizedText.includes("fahrradakku laden")
) {
  params.append("transport_feature", "ebike_charging");
}


// ---------------------------------------------------------
// Fahrradverleih
// ---------------------------------------------------------

if (
  normalizedText.includes("fahrradverleih") ||
  normalizedText.includes("fahrrad verleih") ||
  normalizedText.includes("fahrräder mieten") ||
  normalizedText.includes("fahrraeder mieten") ||
  normalizedText.includes("leihfahrrad") ||
  normalizedText.includes("leihfahrräder") ||
  normalizedText.includes("leihfahrraeder") ||
  normalizedText.includes("bike rental")
) {
  params.append("transport_service", "bicycle_rental");
}


// ---------------------------------------------------------
// E-Bike Verleih
// ---------------------------------------------------------

if (
  normalizedText.includes("e bike verleih") ||
  normalizedText.includes("e-bike verleih") ||
  normalizedText.includes("ebike verleih") ||
  normalizedText.includes("e bikes mieten") ||
  normalizedText.includes("e-bikes mieten") ||
  normalizedText.includes("ebikes mieten")
) {
  params.append("transport_service", "ebike_rental");
}


// ---------------------------------------------------------
// Autovermietung / Mietwagen
// ---------------------------------------------------------

if (
  normalizedText.includes("mietwagen") ||
  normalizedText.includes("auto mieten") ||
  normalizedText.includes("autovermietung") ||
  normalizedText.includes("mietauto") ||
  normalizedText.includes("car rental")
) {
  params.append("transport_service", "car_rental");
}


// ---------------------------------------------------------
// Mietwagen direkt an Unterkunft
// ---------------------------------------------------------

if (
  normalizedText.includes("mietwagen an der unterkunft") ||
  normalizedText.includes("autovermietung im hotel") ||
  normalizedText.includes("mietwagen im hotel") ||
  normalizedText.includes("mietwagen vor ort")
) {
  params.append("transport_service", "car_rental_on_site");
}


// ---------------------------------------------------------
// Roller / Scooter Verleih
// ---------------------------------------------------------

if (
  normalizedText.includes("rollerverleih") ||
  normalizedText.includes("roller verleih") ||
  normalizedText.includes("roller mieten") ||
  normalizedText.includes("scooter verleih") ||
  normalizedText.includes("scooter mieten")
) {
  params.append("transport_service", "scooter_rental");
}


// ---------------------------------------------------------
// Motorradverleih
// ---------------------------------------------------------

if (
  normalizedText.includes("motorradverleih") ||
  normalizedText.includes("motorrad verleih") ||
  normalizedText.includes("motorrad mieten")
) {
  params.append("transport_service", "motorcycle_rental");
}


// ---------------------------------------------------------
// Flughafen in der Nähe
// ---------------------------------------------------------

if (
  normalizedText.includes("flughafen in der nähe") ||
  normalizedText.includes("flughafen in der naehe") ||
  normalizedText.includes("nah am flughafen") ||
  normalizedText.includes("nahe flughafen") ||
  normalizedText.includes("nähe flughafen") ||
  normalizedText.includes("naehe flughafen")
) {
  params.append("transport_location", "near_airport");
}


// ---------------------------------------------------------
// Bahnhof in der Nähe
// ---------------------------------------------------------

if (
  normalizedText.includes("bahnhof in der nähe") ||
  normalizedText.includes("bahnhof in der naehe") ||
  normalizedText.includes("nah am bahnhof") ||
  normalizedText.includes("nahe bahnhof") ||
  normalizedText.includes("nähe bahnhof") ||
  normalizedText.includes("naehe bahnhof")
) {
  params.append("transport_location", "near_train_station");
}


// ---------------------------------------------------------
// Bushaltestelle in der Nähe
// ---------------------------------------------------------

if (
  normalizedText.includes("bushaltestelle in der nähe") ||
  normalizedText.includes("bushaltestelle in der naehe") ||
  normalizedText.includes("bus in der nähe") ||
  normalizedText.includes("bus in der naehe") ||
  normalizedText.includes("nah an bushaltestelle")
) {
  params.append("transport_location", "near_bus_stop");
}


// ---------------------------------------------------------
// U-Bahn / Metro in der Nähe
// ---------------------------------------------------------

if (
  normalizedText.includes("u bahn in der nähe") ||
  normalizedText.includes("u-bahn in der nähe") ||
  normalizedText.includes("u bahn in der naehe") ||
  normalizedText.includes("metro in der nähe") ||
  normalizedText.includes("metro in der naehe") ||
  normalizedText.includes("nah an der metro")
) {
  params.append("transport_location", "near_metro");
}


// ---------------------------------------------------------
// Straßenbahn in der Nähe
// ---------------------------------------------------------

if (
  normalizedText.includes("straßenbahn in der nähe") ||
  normalizedText.includes("strassenbahn in der naehe") ||
  normalizedText.includes("tram in der nähe") ||
  normalizedText.includes("tram in der naehe")
) {
  params.append("transport_location", "near_tram");
}


// ---------------------------------------------------------
// Öffentliche Verkehrsmittel allgemein
// ---------------------------------------------------------

if (
  normalizedText.includes("öffentliche verkehrsmittel") ||
  normalizedText.includes("oeffentliche verkehrsmittel") ||
  normalizedText.includes("öffentlicher nahverkehr") ||
  normalizedText.includes("oeffentlicher nahverkehr") ||
  normalizedText.includes("gute öpnv anbindung") ||
  normalizedText.includes("gute oepnv anbindung") ||
  normalizedText.includes("gute verkehrsanbindung")
) {
  params.append("transport_preference", "good_public_transport");
}


// ---------------------------------------------------------
// Ohne Auto gut erreichbar
// ---------------------------------------------------------

if (
  normalizedText.includes("ohne auto erreichbar") ||
  normalizedText.includes("ohne auto gut erreichbar") ||
  normalizedText.includes("kein auto nötig") ||
  normalizedText.includes("kein auto noetig") ||
  normalizedText.includes("kein mietwagen nötig") ||
  normalizedText.includes("kein mietwagen noetig") ||
  normalizedText.includes("autofrei erreichbar")
) {
  params.append("transport_preference", "car_not_needed");
}


// ---------------------------------------------------------
// Auto empfohlen
// ---------------------------------------------------------

if (
  normalizedText.includes("auto empfohlen") ||
  normalizedText.includes("mietwagen empfohlen") ||
  normalizedText.includes("auto notwendig") ||
  normalizedText.includes("auto erforderlich")
) {
  params.append("transport_preference", "car_recommended");
}


// ---------------------------------------------------------
// Flughafen-Shuttle
// ---------------------------------------------------------

if (
  normalizedText.includes("flughafenshuttle") ||
  normalizedText.includes("flughafen shuttle") ||
  normalizedText.includes("airport shuttle") ||
  normalizedText.includes("shuttle zum flughafen") ||
  normalizedText.includes("shuttle vom flughafen")
) {
  params.append("transport_service", "airport_shuttle");
}


// ---------------------------------------------------------
// Kostenloser Flughafen-Shuttle
// ---------------------------------------------------------

if (
  normalizedText.includes("kostenloser flughafenshuttle") ||
  normalizedText.includes("kostenloser flughafen shuttle") ||
  normalizedText.includes("gratis flughafenshuttle") ||
  normalizedText.includes("kostenloser airport shuttle")
) {
  params.append("transport_service", "free_airport_shuttle");
}


// ---------------------------------------------------------
// Bahnhof-Shuttle
// ---------------------------------------------------------

if (
  normalizedText.includes("bahnhofshuttle") ||
  normalizedText.includes("bahnhof shuttle") ||
  normalizedText.includes("shuttle zum bahnhof") ||
  normalizedText.includes("shuttle vom bahnhof") ||
  normalizedText.includes("abholung vom bahnhof")
) {
  params.append("transport_service", "train_station_shuttle");
}


// ---------------------------------------------------------
// Allgemeiner Transfer
// ---------------------------------------------------------

if (
  normalizedText.includes("transfer service") ||
  normalizedText.includes("transferservice") ||
  normalizedText.includes("transfer zur unterkunft") ||
  normalizedText.includes("abholservice") ||
  normalizedText.includes("abholung vom flughafen")
) {
  params.append("transport_service", "transfer_service");
}


// ---------------------------------------------------------
// Privater Transfer
// ---------------------------------------------------------

if (
  normalizedText.includes("privater transfer") ||
  normalizedText.includes("private transfer") ||
  normalizedText.includes("privattransfer") ||
  normalizedText.includes("privater fahrer")
) {
  params.append("transport_service", "private_transfer");
}


// ---------------------------------------------------------
// Taxi verfügbar
// ---------------------------------------------------------

if (
  normalizedText.includes("taxi verfügbar") ||
  normalizedText.includes("taxi verfuegbar") ||
  normalizedText.includes("taxi service") ||
  normalizedText.includes("taxiservice") ||
  normalizedText.includes("taxi bestellen")
) {
  params.append("transport_service", "taxi_service");
}


// ---------------------------------------------------------
// Entfernung zum Flughafen
// Beispiele:
// "maximal 10 km vom Flughafen"
// "höchstens 20 km zum Flughafen"
// ---------------------------------------------------------

const transportAirportDistanceMatch = normalizedText.match(
  /(?:maximal|höchstens|hoechstens|max\.?|bis zu)\s*(\d+(?:[.,]\d+)?)\s*(km|kilometer|m|meter)\s*(?:vom|zum|bis zum|entfernt vom)?\s*flughafen/
);

if (transportAirportDistanceMatch) {
  const value = Number(
    transportAirportDistanceMatch[1].replace(",", ".")
  );

  const unit = transportAirportDistanceMatch[2];

  const meters =
    unit === "km" || unit === "kilometer"
      ? Math.round(value * 1000)
      : Math.round(value);

  params.set("max_distance_airport_m", String(meters));
}


// ---------------------------------------------------------
// Entfernung zum Bahnhof
// ---------------------------------------------------------

const transportTrainDistanceMatch = normalizedText.match(
  /(?:maximal|höchstens|hoechstens|max\.?|bis zu)\s*(\d+(?:[.,]\d+)?)\s*(km|kilometer|m|meter)\s*(?:vom|zum|bis zum|entfernt vom)?\s*bahnhof/
);

if (transportTrainDistanceMatch) {
  const value = Number(
    transportTrainDistanceMatch[1].replace(",", ".")
  );

  const unit = transportTrainDistanceMatch[2];

  const meters =
    unit === "km" || unit === "kilometer"
      ? Math.round(value * 1000)
      : Math.round(value);

  params.set("max_distance_train_station_m", String(meters));
}


// ---------------------------------------------------------
// Entfernung zur Bushaltestelle
// ---------------------------------------------------------

const transportBusDistanceMatch = normalizedText.match(
  /(?:maximal|höchstens|hoechstens|max\.?|bis zu)\s*(\d+(?:[.,]\d+)?)\s*(km|kilometer|m|meter)\s*(?:von|vom|zur|zum|bis zur|entfernt von)?\s*(?:bushaltestelle|bus)/
);

if (transportBusDistanceMatch) {
  const value = Number(
    transportBusDistanceMatch[1].replace(",", ".")
  );

  const unit = transportBusDistanceMatch[2];

  const meters =
    unit === "km" || unit === "kilometer"
      ? Math.round(value * 1000)
      : Math.round(value);

  params.set("max_distance_bus_stop_m", String(meters));
}


// ---------------------------------------------------------
// Entfernung zu U-Bahn / Metro
// ---------------------------------------------------------

const transportMetroDistanceMatch = normalizedText.match(
  /(?:maximal|höchstens|hoechstens|max\.?|bis zu)\s*(\d+(?:[.,]\d+)?)\s*(km|kilometer|m|meter)\s*(?:von|vom|zur|zum|bis zur|entfernt von)?\s*(?:u bahn|u-bahn|metro)/
);

if (transportMetroDistanceMatch) {
  const value = Number(
    transportMetroDistanceMatch[1].replace(",", ".")
  );

  const unit = transportMetroDistanceMatch[2];

  const meters =
    unit === "km" || unit === "kilometer"
      ? Math.round(value * 1000)
      : Math.round(value);

  params.set("max_distance_metro_m", String(meters));
}


// ---------------------------------------------------------
// Entfernung zu Straßenbahn / Tram
// ---------------------------------------------------------

const transportTramDistanceMatch = normalizedText.match(
  /(?:maximal|höchstens|hoechstens|max\.?|bis zu)\s*(\d+(?:[.,]\d+)?)\s*(km|kilometer|m|meter)\s*(?:von|vom|zur|zum|bis zur|entfernt von)?\s*(?:straßenbahn|strassenbahn|tram)/
);

if (transportTramDistanceMatch) {
  const value = Number(
    transportTramDistanceMatch[1].replace(",", ".")
  );

  const unit = transportTramDistanceMatch[2];

  const meters =
    unit === "km" || unit === "kilometer"
      ? Math.round(value * 1000)
      : Math.round(value);

  params.set("max_distance_tram_m", String(meters));
}


// ---------------------------------------------------------
// Fußläufig zum Bahnhof
// ---------------------------------------------------------

if (
  normalizedText.includes("bahnhof fußläufig") ||
  normalizedText.includes("bahnhof fussläufig") ||
  normalizedText.includes("bahnhof fusslaeufig") ||
  normalizedText.includes("zu fuß zum bahnhof") ||
  normalizedText.includes("zu fuss zum bahnhof") ||
  normalizedText.includes("bahnhof zu fuß erreichbar") ||
  normalizedText.includes("bahnhof zu fuss erreichbar")
) {
  params.append("transport_preference", "train_station_walkable");
}


// ---------------------------------------------------------
// Fußläufig zu öffentlichen Verkehrsmitteln
// ---------------------------------------------------------

if (
  normalizedText.includes("öffentliche verkehrsmittel fußläufig") ||
  normalizedText.includes("oeffentliche verkehrsmittel fusslaeufig") ||
  normalizedText.includes("bus fußläufig") ||
  normalizedText.includes("bus fusslaeufig") ||
  normalizedText.includes("metro fußläufig") ||
  normalizedText.includes("metro fusslaeufig")
) {
  params.append("transport_preference", "public_transport_walkable");
}


// ---------------------------------------------------------
// Gute Autobahnanbindung
// ---------------------------------------------------------

if (
  normalizedText.includes("autobahn in der nähe") ||
  normalizedText.includes("autobahn in der naehe") ||
  normalizedText.includes("nah an der autobahn") ||
  normalizedText.includes("gute autobahnanbindung") ||
  normalizedText.includes("schnell an der autobahn")
) {
  params.append("transport_preference", "near_highway");
}


// ---------------------------------------------------------
// Fähre / Hafen
// ---------------------------------------------------------

if (
  normalizedText.includes("hafen in der nähe") ||
  normalizedText.includes("hafen in der naehe") ||
  normalizedText.includes("nah am hafen") ||
  normalizedText.includes("fährhafen in der nähe") ||
  normalizedText.includes("faehrhafen in der naehe") ||
  normalizedText.includes("fähre in der nähe") ||
  normalizedText.includes("faehre in der naehe")
) {
  params.append("transport_location", "near_port");
}


// ---------------------------------------------------------
// Shuttle zum Strand
// ---------------------------------------------------------

if (
  normalizedText.includes("strandshuttle") ||
  normalizedText.includes("strand shuttle") ||
  normalizedText.includes("shuttle zum strand") ||
  normalizedText.includes("shuttlebus zum strand")
) {
  params.append("transport_service", "beach_shuttle");
}


// ---------------------------------------------------------
// Shuttle ins Zentrum
// ---------------------------------------------------------

if (
  normalizedText.includes("shuttle ins zentrum") ||
  normalizedText.includes("shuttle zur innenstadt") ||
  normalizedText.includes("shuttle in die stadt") ||
  normalizedText.includes("city shuttle")
) {
  params.append("transport_service", "city_shuttle");
}


// ---------------------------------------------------------
// Gepäckaufbewahrung bei früher/später Anreise
// ---------------------------------------------------------

if (
  normalizedText.includes("gepäckaufbewahrung") ||
  normalizedText.includes("gepaeckaufbewahrung") ||
  normalizedText.includes("gepäck lagern") ||
  normalizedText.includes("gepaeck lagern") ||
  normalizedText.includes("koffer aufbewahren") ||
  normalizedText.includes("luggage storage")
) {
  params.append("arrival_feature", "luggage_storage");
}


// ---------------------------------------------------------
// Früher Check-in
// ---------------------------------------------------------

if (
  normalizedText.includes("früher check in") ||
  normalizedText.includes("frueher check in") ||
  normalizedText.includes("früher check-in") ||
  normalizedText.includes("frueher check-in") ||
  normalizedText.includes("early check in") ||
  normalizedText.includes("early check-in")
) {
  params.append("arrival_feature", "early_check_in");
}


// ---------------------------------------------------------
// Später Check-in
// ---------------------------------------------------------

if (
  normalizedText.includes("später check in") ||
  normalizedText.includes("spaeter check in") ||
  normalizedText.includes("später check-in") ||
  normalizedText.includes("spaeter check-in") ||
  normalizedText.includes("late check in") ||
  normalizedText.includes("late check-in")
) {
  params.append("arrival_feature", "late_check_in");
}


// ---------------------------------------------------------
// 24-Stunden Check-in
// ---------------------------------------------------------

if (
  normalizedText.includes("24 stunden check in") ||
  normalizedText.includes("24 stunden check-in") ||
  normalizedText.includes("24h check in") ||
  normalizedText.includes("24h check-in") ||
  normalizedText.includes("check in rund um die uhr") ||
  normalizedText.includes("check-in rund um die uhr")
) {
  params.append("arrival_feature", "24h_check_in");
}


// ---------------------------------------------------------
// Self Check-in
// ---------------------------------------------------------

if (
  normalizedText.includes("self check in") ||
  normalizedText.includes("self check-in") ||
  normalizedText.includes("selbst check in") ||
  normalizedText.includes("kontaktloser check in") ||
  normalizedText.includes("kontaktloser check-in") ||
  normalizedText.includes("schlüsseltresor") ||
  normalizedText.includes("schluesseltresor") ||
  normalizedText.includes("keybox")
) {
  params.append("arrival_feature", "self_check_in");
}


// ---------------------------------------------------------
// 24-Stunden Rezeption
// ---------------------------------------------------------

if (
  normalizedText.includes("24 stunden rezeption") ||
  normalizedText.includes("24h rezeption") ||
  normalizedText.includes("rezeption rund um die uhr") ||
  normalizedText.includes("24 hour reception")
) {
  params.append("arrival_feature", "24h_reception");
}


// ---------------------------------------------------------
// Anreise mit Zug
// ---------------------------------------------------------

if (
  normalizedText.includes("anreise mit zug") ||
  normalizedText.includes("anreise mit dem zug") ||
  normalizedText.includes("reise mit zug") ||
  normalizedText.includes("reise mit dem zug")
) {
  params.append("arrival_mode", "train");
}


// ---------------------------------------------------------
// Anreise mit Auto
// ---------------------------------------------------------

if (
  normalizedText.includes("anreise mit auto") ||
  normalizedText.includes("anreise mit dem auto") ||
  normalizedText.includes("reise mit auto") ||
  normalizedText.includes("reise mit dem auto")
) {
  params.append("arrival_mode", "car");
}


// ---------------------------------------------------------
// Anreise mit Flugzeug
// ---------------------------------------------------------

if (
  normalizedText.includes("anreise mit flugzeug") ||
  normalizedText.includes("anreise mit dem flugzeug") ||
  normalizedText.includes("reise mit flugzeug") ||
  normalizedText.includes("ich fliege") ||
  normalizedText.includes("flugreise")
) {
  params.append("arrival_mode", "plane");
}


// ---------------------------------------------------------
// Anreise mit Fahrrad
// ---------------------------------------------------------

if (
  normalizedText.includes("anreise mit fahrrad") ||
  normalizedText.includes("anreise mit dem fahrrad") ||
  normalizedText.includes("reise mit fahrrad") ||
  normalizedText.includes("radreise") ||
  normalizedText.includes("fahrradurlaub")
) {
  params.append("arrival_mode", "bicycle");
}


// ---------------------------------------------------------
// Anreise mit Motorrad
// ---------------------------------------------------------

if (
  normalizedText.includes("anreise mit motorrad") ||
  normalizedText.includes("anreise mit dem motorrad") ||
  normalizedText.includes("motorradreise") ||
  normalizedText.includes("motorradurlaub")
) {
  params.append("arrival_mode", "motorcycle");
}


// ---------------------------------------------------------
// Anreise mit Fähre
// ---------------------------------------------------------

if (
  normalizedText.includes("anreise mit fähre") ||
  normalizedText.includes("anreise mit faehre") ||
  normalizedText.includes("anreise mit der fähre") ||
  normalizedText.includes("anreise mit der faehre") ||
  normalizedText.includes("reise mit fähre") ||
  normalizedText.includes("reise mit faehre")
) {
  params.append("arrival_mode", "ferry");
}


// ---------------------------------------------------------
// Gute Lage für Radurlaub
// ---------------------------------------------------------

if (
  normalizedText.includes("radurlaub") ||
  normalizedText.includes("fahrradurlaub") ||
  normalizedText.includes("urlaub mit fahrrad") ||
  normalizedText.includes("urlaub mit dem fahrrad")
) {
  params.append("trip_style", "cycling_trip");
}


// ---------------------------------------------------------
// Gute Lage für Motorradreise
// ---------------------------------------------------------

if (
  normalizedText.includes("motorradurlaub") ||
  normalizedText.includes("motorradreise") ||
  normalizedText.includes("urlaub mit motorrad") ||
  normalizedText.includes("urlaub mit dem motorrad")
) {
  params.append("trip_style", "motorcycle_trip");
}

// =========================================================
// WELLNESS, SPORT & FREIZEITAKTIVITÄTEN
// =========================================================


// ---------------------------------------------------------
// WELLNESS ALLGEMEIN
// ---------------------------------------------------------

if (
  normalizedText.includes("wellness") ||
  normalizedText.includes("wellnessbereich") ||
  normalizedText.includes("wellness bereich") ||
  normalizedText.includes("wellnesshotel")
) {
  params.append("wellness_feature", "wellness");
}

if (
  normalizedText.includes("spa") ||
  normalizedText.includes("spa bereich") ||
  normalizedText.includes("spabereich")
) {
  params.append("wellness_feature", "spa");
}


// ---------------------------------------------------------
// Sauna
// ---------------------------------------------------------

if (
  normalizedText.includes("sauna") ||
  normalizedText.includes("saunabereich")
) {
  params.append("wellness_feature", "sauna");
}


// ---------------------------------------------------------
// Private Sauna
// ---------------------------------------------------------

if (
  normalizedText.includes("private sauna") ||
  normalizedText.includes("privater sauna") ||
  normalizedText.includes("eigene sauna") ||
  normalizedText.includes("sauna zur alleinigen nutzung")
) {
  params.append("wellness_feature", "private_sauna");
}


// ---------------------------------------------------------
// Dampfbad
// ---------------------------------------------------------

if (
  normalizedText.includes("dampfbad") ||
  normalizedText.includes("dampfsauna") ||
  normalizedText.includes("steam room")
) {
  params.append("wellness_feature", "steam_room");
}


// ---------------------------------------------------------
// Whirlpool / Jacuzzi
// ---------------------------------------------------------

if (
  normalizedText.includes("whirlpool") ||
  normalizedText.includes("jacuzzi") ||
  normalizedText.includes("hot tub") ||
  normalizedText.includes("sprudelbad")
) {
  params.append("wellness_feature", "hot_tub");
}


// ---------------------------------------------------------
// Privater Whirlpool
// ---------------------------------------------------------

if (
  normalizedText.includes("privater whirlpool") ||
  normalizedText.includes("private whirlpool") ||
  normalizedText.includes("eigener whirlpool") ||
  normalizedText.includes("privater jacuzzi") ||
  normalizedText.includes("eigener jacuzzi") ||
  normalizedText.includes("private hot tub")
) {
  params.append("wellness_feature", "private_hot_tub");
}


// ---------------------------------------------------------
// Massage
// ---------------------------------------------------------

if (
  normalizedText.includes("massage") ||
  normalizedText.includes("massagen") ||
  normalizedText.includes("massageangebot") ||
  normalizedText.includes("massageservice")
) {
  params.append("wellness_service", "massage");
}


// ---------------------------------------------------------
// Paarmassage
// ---------------------------------------------------------

if (
  normalizedText.includes("paarmassage") ||
  normalizedText.includes("paar massage") ||
  normalizedText.includes("massage für paare") ||
  normalizedText.includes("massage fuer paare")
) {
  params.append("wellness_service", "couples_massage");
}


// ---------------------------------------------------------
// Kosmetik / Beauty
// ---------------------------------------------------------

if (
  normalizedText.includes("kosmetikbehandlung") ||
  normalizedText.includes("kosmetikbehandlungen") ||
  normalizedText.includes("beautybehandlung") ||
  normalizedText.includes("beauty behandlung") ||
  normalizedText.includes("beauty center") ||
  normalizedText.includes("beautycenter")
) {
  params.append("wellness_service", "beauty_treatments");
}


// ---------------------------------------------------------
// Wellnessbehandlungen
// ---------------------------------------------------------

if (
  normalizedText.includes("wellnessbehandlung") ||
  normalizedText.includes("wellnessbehandlungen") ||
  normalizedText.includes("spa behandlung") ||
  normalizedText.includes("spa behandlungen")
) {
  params.append("wellness_service", "spa_treatments");
}


// ---------------------------------------------------------
// Ruheraum
// ---------------------------------------------------------

if (
  normalizedText.includes("ruheraum") ||
  normalizedText.includes("ruhebereich") ||
  normalizedText.includes("relaxbereich") ||
  normalizedText.includes("relaxation area")
) {
  params.append("wellness_feature", "relaxation_area");
}


// ---------------------------------------------------------
// Solarium
// ---------------------------------------------------------

if (
  normalizedText.includes("solarium") ||
  normalizedText.includes("sonnenbank")
) {
  params.append("wellness_feature", "solarium");
}


// ---------------------------------------------------------
// Thermalbad / Thermalquelle
// ---------------------------------------------------------

if (
  normalizedText.includes("thermalbad") ||
  normalizedText.includes("thermalbecken") ||
  normalizedText.includes("thermalquelle") ||
  normalizedText.includes("thermalwasser")
) {
  params.append("wellness_feature", "thermal_bath");
}


// ---------------------------------------------------------
// Pool allgemein
// ---------------------------------------------------------

if (
  containsWholeTerm(normalizedText, "pool") ||
  normalizedText.includes("swimmingpool") ||
  normalizedText.includes("schwimmbad") ||
  normalizedText.includes("schwimmbecken")
) {
  params.append("leisure_feature", "pool");
}


// ---------------------------------------------------------
// Innenpool
// ---------------------------------------------------------

if (
  normalizedText.includes("innenpool") ||
  normalizedText.includes("innen pool") ||
  normalizedText.includes("indoor pool") ||
  normalizedText.includes("hallenbad")
) {
  params.append("leisure_feature", "indoor_pool");
}


// ---------------------------------------------------------
// Außenpool
// ---------------------------------------------------------

if (
  normalizedText.includes("außenpool") ||
  normalizedText.includes("aussenpool") ||
  normalizedText.includes("außen pool") ||
  normalizedText.includes("aussen pool") ||
  normalizedText.includes("outdoor pool") ||
  normalizedText.includes("freibad")
) {
  params.append("leisure_feature", "outdoor_pool");
}


// ---------------------------------------------------------
// Privater Pool
// ---------------------------------------------------------

if (
  normalizedText.includes("privater pool") ||
  normalizedText.includes("private pool") ||
  normalizedText.includes("eigener pool") ||
  normalizedText.includes("pool zur alleinigen nutzung")
) {
  params.append("leisure_feature", "private_pool");
}


// ---------------------------------------------------------
// Beheizter Pool
// ---------------------------------------------------------

if (
  normalizedText.includes("beheizter pool") ||
  normalizedText.includes("beheiztes schwimmbad") ||
  normalizedText.includes("beheiztes schwimmbecken") ||
  normalizedText.includes("heated pool")
) {
  params.append("leisure_feature", "heated_pool");
}


// ---------------------------------------------------------
// Infinity Pool
// ---------------------------------------------------------

if (
  normalizedText.includes("infinity pool") ||
  normalizedText.includes("infinitypool") ||
  normalizedText.includes("unendlichkeitsbecken")
) {
  params.append("leisure_feature", "infinity_pool");
}


// ---------------------------------------------------------
// Dachpool / Rooftop Pool
// ---------------------------------------------------------

if (
  normalizedText.includes("dachpool") ||
  normalizedText.includes("rooftop pool") ||
  normalizedText.includes("pool auf dem dach")
) {
  params.append("leisure_feature", "rooftop_pool");
}


// ---------------------------------------------------------
// Fitness
// ---------------------------------------------------------

if (
  normalizedText.includes("fitnessstudio") ||
  normalizedText.includes("fitnessraum") ||
  normalizedText.includes("fitness center") ||
  normalizedText.includes("fitnesscenter") ||
  containsWholeTerm(normalizedText, "gym")
) {
  params.append("sport_feature", "fitness_center");
}


// ---------------------------------------------------------
// Personal Trainer
// ---------------------------------------------------------

if (
  normalizedText.includes("personal trainer") ||
  normalizedText.includes("personal training") ||
  normalizedText.includes("fitnesstrainer")
) {
  params.append("sport_service", "personal_trainer");
}


// ---------------------------------------------------------
// Yoga
// ---------------------------------------------------------

if (
  containsWholeTerm(normalizedText, "yoga") ||
  normalizedText.includes("yogakurs") ||
  normalizedText.includes("yoga kurs") ||
  normalizedText.includes("yogastudio")
) {
  params.append("activity", "yoga");
}


// ---------------------------------------------------------
// Pilates
// ---------------------------------------------------------

if (
  normalizedText.includes("pilates") ||
  normalizedText.includes("pilateskurs")
) {
  params.append("activity", "pilates");
}


// ---------------------------------------------------------
// Tennis
// ---------------------------------------------------------

if (
  normalizedText.includes("tennisplatz") ||
  normalizedText.includes("tennisplätze") ||
  normalizedText.includes("tennisplaetze") ||
  containsWholeTerm(normalizedText, "tennis")
) {
  params.append("activity", "tennis");
}


// ---------------------------------------------------------
// Tischtennis
// ---------------------------------------------------------

if (
  normalizedText.includes("tischtennis") ||
  normalizedText.includes("tischtennisplatte") ||
  normalizedText.includes("ping pong") ||
  normalizedText.includes("pingpong")
) {
  params.append("activity", "table_tennis");
}


// ---------------------------------------------------------
// Badminton
// ---------------------------------------------------------

if (
  normalizedText.includes("badminton") ||
  normalizedText.includes("badmintonplatz")
) {
  params.append("activity", "badminton");
}


// ---------------------------------------------------------
// Squash
// ---------------------------------------------------------

if (
  normalizedText.includes("squash") ||
  normalizedText.includes("squashplatz")
) {
  params.append("activity", "squash");
}


// ---------------------------------------------------------
// Basketball
// ---------------------------------------------------------

if (
  normalizedText.includes("basketball") ||
  normalizedText.includes("basketballplatz")
) {
  params.append("activity", "basketball");
}


// ---------------------------------------------------------
// Volleyball
// ---------------------------------------------------------

if (
  normalizedText.includes("volleyball") ||
  normalizedText.includes("volleyballplatz")
) {
  params.append("activity", "volleyball");
}


// ---------------------------------------------------------
// Beachvolleyball
// ---------------------------------------------------------

if (
  normalizedText.includes("beachvolleyball") ||
  normalizedText.includes("beach volleyball")
) {
  params.append("activity", "beach_volleyball");
}


// ---------------------------------------------------------
// Fußball
// ---------------------------------------------------------

if (
  normalizedText.includes("fußballplatz") ||
  normalizedText.includes("fussballplatz") ||
  normalizedText.includes("fußball spielen") ||
  normalizedText.includes("fussball spielen")
) {
  params.append("activity", "football");
}


// ---------------------------------------------------------
// Golf
// ---------------------------------------------------------

if (
  normalizedText.includes("golfplatz") ||
  normalizedText.includes("golf spielen") ||
  normalizedText.includes("golfurlaub")
) {
  params.append("activity", "golf");
}


// ---------------------------------------------------------
// Golfplatz in der Nähe
// ---------------------------------------------------------

if (
  normalizedText.includes("golfplatz in der nähe") ||
  normalizedText.includes("golfplatz in der naehe") ||
  normalizedText.includes("nah am golfplatz") ||
  normalizedText.includes("nähe golfplatz") ||
  normalizedText.includes("naehe golfplatz")
) {
  params.append("activity_location", "near_golf_course");
}


// ---------------------------------------------------------
// Minigolf
// ---------------------------------------------------------

if (
  normalizedText.includes("minigolf") ||
  normalizedText.includes("minigolfplatz")
) {
  params.append("activity", "mini_golf");
}


// ---------------------------------------------------------
// Wandern
// ---------------------------------------------------------

if (
  normalizedText.includes("wandern") ||
  normalizedText.includes("wanderurlaub") ||
  normalizedText.includes("wanderwege") ||
  normalizedText.includes("wanderweg")
) {
  params.append("activity", "hiking");
}


// ---------------------------------------------------------
// Wanderwege direkt an Unterkunft
// ---------------------------------------------------------

if (
  normalizedText.includes("wanderwege direkt") ||
  normalizedText.includes("wanderweg direkt") ||
  normalizedText.includes("wanderweg vor der tür") ||
  normalizedText.includes("wanderweg vor der tuer") ||
  normalizedText.includes("direkt am wanderweg")
) {
  params.append("activity_location", "hiking_trails_on_site");
}


// ---------------------------------------------------------
// Radfahren
// ---------------------------------------------------------

if (
  normalizedText.includes("radfahren") ||
  normalizedText.includes("fahrradfahren") ||
  normalizedText.includes("radtouren") ||
  normalizedText.includes("radtour")
) {
  params.append("activity", "cycling");
}


// ---------------------------------------------------------
// Mountainbike
// ---------------------------------------------------------

if (
  normalizedText.includes("mountainbike") ||
  normalizedText.includes("mountainbiken") ||
  normalizedText.includes("mtb") ||
  normalizedText.includes("mountainbike trails")
) {
  params.append("activity", "mountain_biking");
}


// ---------------------------------------------------------
// Reiten
// ---------------------------------------------------------

if (
  normalizedText.includes("reiten") ||
  normalizedText.includes("reiturlaub") ||
  normalizedText.includes("reiterhof") ||
  normalizedText.includes("pferde")
) {
  params.append("activity", "horse_riding");
}


// ---------------------------------------------------------
// Reitmöglichkeiten in der Nähe
// ---------------------------------------------------------

if (
  normalizedText.includes("reiten in der nähe") ||
  normalizedText.includes("reiten in der naehe") ||
  normalizedText.includes("reiterhof in der nähe") ||
  normalizedText.includes("reiterhof in der naehe")
) {
  params.append("activity_location", "near_horse_riding");
}


// ---------------------------------------------------------
// Skifahren
// ---------------------------------------------------------

if (
  normalizedText.includes("skifahren") ||
  normalizedText.includes("skiurlaub") ||
  normalizedText.includes("skigebiet") ||
  normalizedText.includes("skipiste")
) {
  params.append("activity", "skiing");
}


// ---------------------------------------------------------
// Ski-in / Ski-out
// ---------------------------------------------------------

if (
  normalizedText.includes("ski in ski out") ||
  normalizedText.includes("ski-in ski-out") ||
  normalizedText.includes("ski in ski-out") ||
  normalizedText.includes("direkt an der skipiste") ||
  normalizedText.includes("direkt an der piste")
) {
  params.append("activity_feature", "ski_in_ski_out");
}


// ---------------------------------------------------------
// Skiaufbewahrung
// ---------------------------------------------------------

if (
  normalizedText.includes("skiaufbewahrung") ||
  normalizedText.includes("skiraum") ||
  normalizedText.includes("ski raum") ||
  normalizedText.includes("skikeller")
) {
  params.append("activity_feature", "ski_storage");
}


// ---------------------------------------------------------
// Skiverleih
// ---------------------------------------------------------

if (
  normalizedText.includes("skiverleih") ||
  normalizedText.includes("ski verleih") ||
  normalizedText.includes("ski mieten")
) {
  params.append("activity_service", "ski_rental");
}


// ---------------------------------------------------------
// Skischule
// ---------------------------------------------------------

if (
  normalizedText.includes("skischule") ||
  normalizedText.includes("ski schule") ||
  normalizedText.includes("skikurs")
) {
  params.append("activity_service", "ski_school");
}


// ---------------------------------------------------------
// Langlauf
// ---------------------------------------------------------

if (
  normalizedText.includes("langlauf") ||
  normalizedText.includes("langlaufen") ||
  normalizedText.includes("langlaufloipe") ||
  normalizedText.includes("loipe")
) {
  params.append("activity", "cross_country_skiing");
}


// ---------------------------------------------------------
// Snowboard
// ---------------------------------------------------------

if (
  normalizedText.includes("snowboard") ||
  normalizedText.includes("snowboarden")
) {
  params.append("activity", "snowboarding");
}


// ---------------------------------------------------------
// Rodeln
// ---------------------------------------------------------

if (
  normalizedText.includes("rodeln") ||
  normalizedText.includes("rodelbahn") ||
  normalizedText.includes("schlittenfahren")
) {
  params.append("activity", "sledding");
}


// ---------------------------------------------------------
// Wassersport allgemein
// ---------------------------------------------------------

if (
  normalizedText.includes("wassersport") ||
  normalizedText.includes("wassersportmöglichkeiten") ||
  normalizedText.includes("wassersportmoeglichkeiten")
) {
  params.append("activity", "water_sports");
}


// ---------------------------------------------------------
// Schwimmen
// ---------------------------------------------------------

if (
  normalizedText.includes("schwimmen") ||
  normalizedText.includes("schwimmurlaub")
) {
  params.append("activity", "swimming");
}


// ---------------------------------------------------------
// Schnorcheln
// ---------------------------------------------------------

if (
  normalizedText.includes("schnorcheln") ||
  normalizedText.includes("schnorchelausflug") ||
  normalizedText.includes("schnorchelausflüge") ||
  normalizedText.includes("schnorchelausfluege")
) {
  params.append("activity", "snorkeling");
}


// ---------------------------------------------------------
// Tauchen
// ---------------------------------------------------------

if (
  normalizedText.includes("tauchen") ||
  normalizedText.includes("tauchschule") ||
  normalizedText.includes("tauchkurs") ||
  normalizedText.includes("tauchbasis")
) {
  params.append("activity", "diving");
}


// ---------------------------------------------------------
// Tauchschule / Tauchzentrum
// ---------------------------------------------------------

if (
  normalizedText.includes("tauchschule") ||
  normalizedText.includes("tauchzentrum") ||
  normalizedText.includes("tauchbasis")
) {
  params.append("activity_service", "diving_center");
}


// ---------------------------------------------------------
// Surfen
// ---------------------------------------------------------

if (
  normalizedText.includes("surfen") ||
  normalizedText.includes("surfkurs") ||
  normalizedText.includes("surfschule")
) {
  params.append("activity", "surfing");
}


// ---------------------------------------------------------
// Windsurfen
// ---------------------------------------------------------

if (
  normalizedText.includes("windsurfen") ||
  normalizedText.includes("windsurfing")
) {
  params.append("activity", "windsurfing");
}


// ---------------------------------------------------------
// Kitesurfen
// ---------------------------------------------------------

if (
  normalizedText.includes("kitesurfen") ||
  normalizedText.includes("kitesurfing") ||
  normalizedText.includes("kite surfen")
) {
  params.append("activity", "kitesurfing");
}


// ---------------------------------------------------------
// Stand-up-Paddling
// ---------------------------------------------------------

if (
  normalizedText.includes("stand up paddling") ||
  normalizedText.includes("stand-up-paddling") ||
  normalizedText.includes("standup paddling") ||
  normalizedText.includes("sup")
) {
  params.append("activity", "stand_up_paddling");
}


// ---------------------------------------------------------
// Kajak
// ---------------------------------------------------------

if (
  normalizedText.includes("kajak") ||
  normalizedText.includes("kajakfahren") ||
  normalizedText.includes("kajakverleih")
) {
  params.append("activity", "kayaking");
}


// ---------------------------------------------------------
// Kanu
// ---------------------------------------------------------

if (
  normalizedText.includes("kanu") ||
  normalizedText.includes("kanufahren") ||
  normalizedText.includes("kanuverleih")
) {
  params.append("activity", "canoeing");
}


// ---------------------------------------------------------
// Segeln
// ---------------------------------------------------------

if (
  normalizedText.includes("segeln") ||
  normalizedText.includes("segelschule") ||
  normalizedText.includes("segelkurs")
) {
  params.append("activity", "sailing");
}


// ---------------------------------------------------------
// Bootfahren
// ---------------------------------------------------------

if (
  normalizedText.includes("bootfahren") ||
  normalizedText.includes("boot fahren") ||
  normalizedText.includes("bootsausflug") ||
  normalizedText.includes("bootsausflüge") ||
  normalizedText.includes("bootsausfluege")
) {
  params.append("activity", "boating");
}


// ---------------------------------------------------------
// Bootsverleih
// ---------------------------------------------------------

if (
  normalizedText.includes("bootsverleih") ||
  normalizedText.includes("boot verleih") ||
  normalizedText.includes("boot mieten")
) {
  params.append("activity_service", "boat_rental");
}


// ---------------------------------------------------------
// Angeln
// ---------------------------------------------------------

if (
  normalizedText.includes("angeln") ||
  normalizedText.includes("angelurlaub") ||
  normalizedText.includes("angelmöglichkeit") ||
  normalizedText.includes("angelmoeglichkeit")
) {
  params.append("activity", "fishing");
}


// ---------------------------------------------------------
// Klettern
// ---------------------------------------------------------

if (
  normalizedText.includes("klettern") ||
  normalizedText.includes("kletterurlaub") ||
  normalizedText.includes("klettergebiet")
) {
  params.append("activity", "climbing");
}


// ---------------------------------------------------------
// Kletterhalle
// ---------------------------------------------------------

if (
  normalizedText.includes("kletterhalle") ||
  normalizedText.includes("indoor klettern")
) {
  params.append("activity", "indoor_climbing");
}


// ---------------------------------------------------------
// Klettersteig
// ---------------------------------------------------------

if (
  normalizedText.includes("klettersteig") ||
  normalizedText.includes("via ferrata")
) {
  params.append("activity", "via_ferrata");
}


// ---------------------------------------------------------
// Paragliding
// ---------------------------------------------------------

if (
  normalizedText.includes("paragliding") ||
  normalizedText.includes("gleitschirm") ||
  normalizedText.includes("gleitschirmfliegen")
) {
  params.append("activity", "paragliding");
}


// ---------------------------------------------------------
// Bowling
// ---------------------------------------------------------

if (
  normalizedText.includes("bowling") ||
  normalizedText.includes("bowlingbahn")
) {
  params.append("activity", "bowling");
}


// ---------------------------------------------------------
// Billard
// ---------------------------------------------------------

if (
  normalizedText.includes("billard") ||
  normalizedText.includes("billardtisch")
) {
  params.append("activity", "billiards");
}


// ---------------------------------------------------------
// Darts
// ---------------------------------------------------------

if (
  normalizedText.includes("darts") ||
  normalizedText.includes("dart") ||
  normalizedText.includes("dartscheibe")
) {
  params.append("activity", "darts");
}


// ---------------------------------------------------------
// Spielzimmer
// ---------------------------------------------------------

if (
  normalizedText.includes("spielzimmer") ||
  normalizedText.includes("spielezimmer") ||
  normalizedText.includes("game room") ||
  normalizedText.includes("games room")
) {
  params.append("leisure_feature", "games_room");
}


// ---------------------------------------------------------
// Kino / Heimkino
// ---------------------------------------------------------

if (
  normalizedText.includes("heimkino") ||
  normalizedText.includes("privates kino") ||
  normalizedText.includes("kinoraum") ||
  normalizedText.includes("cinema room")
) {
  params.append("leisure_feature", "cinema_room");
}


// ---------------------------------------------------------
// Bibliothek / Leseraum
// ---------------------------------------------------------

if (
  normalizedText.includes("bibliothek") ||
  normalizedText.includes("leseraum") ||
  normalizedText.includes("bücherzimmer") ||
  normalizedText.includes("buecherzimmer")
) {
  params.append("leisure_feature", "library");
}


// ---------------------------------------------------------
// Abendunterhaltung
// ---------------------------------------------------------

if (
  normalizedText.includes("abendunterhaltung") ||
  normalizedText.includes("abendprogramm") ||
  normalizedText.includes("unterhaltungsprogramm am abend") ||
  normalizedText.includes("evening entertainment")
) {
  params.append("entertainment_feature", "evening_entertainment");
}


// ---------------------------------------------------------
// Live-Musik
// ---------------------------------------------------------

if (
  normalizedText.includes("live musik") ||
  normalizedText.includes("live-musik") ||
  normalizedText.includes("livemusik") ||
  normalizedText.includes("live band")
) {
  params.append("entertainment_feature", "live_music");
}


// ---------------------------------------------------------
// Shows
// ---------------------------------------------------------

if (
  normalizedText.includes("shows") ||
  normalizedText.includes("abendshows") ||
  normalizedText.includes("unterhaltungsshows")
) {
  params.append("entertainment_feature", "shows");
}


// ---------------------------------------------------------
// Nachtclub / Disco
// ---------------------------------------------------------

if (
  normalizedText.includes("nachtclub") ||
  normalizedText.includes("nightclub") ||
  normalizedText.includes("disco") ||
  normalizedText.includes("diskothek")
) {
  params.append("entertainment_feature", "nightclub");
}


// ---------------------------------------------------------
// Animation
// ---------------------------------------------------------

if (
  normalizedText.includes("animation") ||
  normalizedText.includes("animationsprogramm") ||
  normalizedText.includes("animationsteam")
) {
  params.append("entertainment_feature", "animation");
}


// ---------------------------------------------------------
// Ausflüge / Touren
// ---------------------------------------------------------

if (
  normalizedText.includes("ausflüge") ||
  normalizedText.includes("ausfluege") ||
  normalizedText.includes("geführte touren") ||
  normalizedText.includes("gefuehrte touren") ||
  normalizedText.includes("touren buchen") ||
  normalizedText.includes("ausflugsprogramm")
) {
  params.append("activity_service", "organized_tours");
}


// ---------------------------------------------------------
// Stadtführungen
// ---------------------------------------------------------

if (
  normalizedText.includes("stadtführung") ||
  normalizedText.includes("stadtfuehrung") ||
  normalizedText.includes("stadtführungen") ||
  normalizedText.includes("stadtfuehrungen") ||
  normalizedText.includes("city tour")
) {
  params.append("activity_service", "city_tours");
}


// ---------------------------------------------------------
// Kochkurs
// ---------------------------------------------------------

if (
  normalizedText.includes("kochkurs") ||
  normalizedText.includes("kochkurse") ||
  normalizedText.includes("cooking class")
) {
  params.append("activity", "cooking_class");
}


// ---------------------------------------------------------
// Weinprobe
// ---------------------------------------------------------

if (
  normalizedText.includes("weinprobe") ||
  normalizedText.includes("weinverkostung") ||
  normalizedText.includes("wine tasting")
) {
  params.append("activity", "wine_tasting");
}


// ---------------------------------------------------------
// Freizeitpark in der Nähe
// ---------------------------------------------------------

if (
  normalizedText.includes("freizeitpark in der nähe") ||
  normalizedText.includes("freizeitpark in der naehe") ||
  normalizedText.includes("nah am freizeitpark")
) {
  params.append("activity_location", "near_theme_park");
}


// ---------------------------------------------------------
// Wasserpark in der Nähe
// ---------------------------------------------------------

if (
  normalizedText.includes("wasserpark in der nähe") ||
  normalizedText.includes("wasserpark in der naehe") ||
  normalizedText.includes("aquapark in der nähe") ||
  normalizedText.includes("aquapark in der naehe")
) {
  params.append("activity_location", "near_water_park");
}


// ---------------------------------------------------------
// Sehenswürdigkeiten in der Nähe
// ---------------------------------------------------------

if (
  normalizedText.includes("sehenswürdigkeiten in der nähe") ||
  normalizedText.includes("sehenswuerdigkeiten in der naehe") ||
  normalizedText.includes("nah an sehenswürdigkeiten") ||
  normalizedText.includes("nah an sehenswuerdigkeiten")
) {
  params.append("activity_location", "near_attractions");
}


// ---------------------------------------------------------
// Sporturlaub allgemein
// ---------------------------------------------------------

if (
  normalizedText.includes("sporturlaub") ||
  normalizedText.includes("aktiver urlaub") ||
  normalizedText.includes("aktivurlaub")
) {
  params.append("trip_style", "active_trip");
}


// ---------------------------------------------------------
// Wellnessurlaub
// ---------------------------------------------------------

if (
  normalizedText.includes("wellnessurlaub") ||
  normalizedText.includes("wellness urlaub") ||
  normalizedText.includes("spa urlaub")
) {
  params.append("trip_style", "wellness_trip");
}


// ---------------------------------------------------------
// Skiurlaub
// ---------------------------------------------------------

if (
  normalizedText.includes("skiurlaub") ||
  normalizedText.includes("ski urlaub")
) {
  params.append("trip_style", "ski_trip");
}


// ---------------------------------------------------------
// Wanderurlaub
// ---------------------------------------------------------

if (
  normalizedText.includes("wanderurlaub") ||
  normalizedText.includes("wander urlaub")
) {
  params.append("trip_style", "hiking_trip");
}


// ---------------------------------------------------------
// Tauchurlaub
// ---------------------------------------------------------

if (
  normalizedText.includes("tauchurlaub") ||
  normalizedText.includes("tauch urlaub")
) {
  params.append("trip_style", "diving_trip");
}


// ---------------------------------------------------------
// Surfurlaub
// ---------------------------------------------------------

if (
  normalizedText.includes("surfurlaub") ||
  normalizedText.includes("surf urlaub")
) {
  params.append("trip_style", "surf_trip");
}


// ---------------------------------------------------------
// Golfurlaub
// ---------------------------------------------------------

if (
  normalizedText.includes("golfurlaub") ||
  normalizedText.includes("golf urlaub")
) {
  params.append("trip_style", "golf_trip");
}

// =========================================================
// BUSINESS, ARBEIT & DIGITALE AUSSTATTUNG
// =========================================================


// ---------------------------------------------------------
// Geschäftsreise allgemein
// ---------------------------------------------------------

if (
  normalizedText.includes("geschäftsreise") ||
  normalizedText.includes("geschaeftsreise") ||
  normalizedText.includes("geschäftlich unterwegs") ||
  normalizedText.includes("geschaeftlich unterwegs") ||
  normalizedText.includes("businessreise") ||
  normalizedText.includes("business trip")
) {
  params.append("trip_style", "business_trip");
}


// ---------------------------------------------------------
// Unterkunft für Geschäftsreisende
// ---------------------------------------------------------

if (
  normalizedText.includes("für geschäftsreisende") ||
  normalizedText.includes("fuer geschaeftsreisende") ||
  normalizedText.includes("businessfreundlich") ||
  normalizedText.includes("business hotel") ||
  normalizedText.includes("businesshotel")
) {
  params.append("business_preference", "business_friendly");
}


// ---------------------------------------------------------
// Arbeiten im Urlaub / Workation
// ---------------------------------------------------------

if (
  normalizedText.includes("workation") ||
  normalizedText.includes("arbeiten im urlaub") ||
  normalizedText.includes("urlaub und arbeiten") ||
  normalizedText.includes("arbeit und urlaub") ||
  normalizedText.includes("remote arbeiten im urlaub") ||
  normalizedText.includes("remote work")
) {
  params.append("trip_style", "workation");
}


// ---------------------------------------------------------
// Remote Work
// ---------------------------------------------------------

if (
  normalizedText.includes("remote work") ||
  normalizedText.includes("remote arbeiten") ||
  normalizedText.includes("remote arbeiten können") ||
  normalizedText.includes("remote arbeiten koennen") ||
  normalizedText.includes("ortsunabhängig arbeiten") ||
  normalizedText.includes("ortsunabhaengig arbeiten")
) {
  params.append("business_preference", "remote_work_friendly");
}


// ---------------------------------------------------------
// Homeoffice geeignet
// ---------------------------------------------------------

if (
  normalizedText.includes("homeoffice") ||
  normalizedText.includes("home office") ||
  normalizedText.includes("homeoffice geeignet") ||
  normalizedText.includes("für homeoffice") ||
  normalizedText.includes("fuer homeoffice")
) {
  params.append("business_preference", "home_office_friendly");
}


// ---------------------------------------------------------
// Digital Nomad
// ---------------------------------------------------------

if (
  normalizedText.includes("digital nomad") ||
  normalizedText.includes("digitaler nomade") ||
  normalizedText.includes("digitale nomaden") ||
  normalizedText.includes("für digitale nomaden") ||
  normalizedText.includes("fuer digitale nomaden")
) {
  params.append("business_preference", "digital_nomad_friendly");
}


// ---------------------------------------------------------
// WLAN allgemein
// ---------------------------------------------------------

if (
  containsWholeTerm(normalizedText, "wlan") ||
  containsWholeTerm(normalizedText, "wifi") ||
  normalizedText.includes("wi fi") ||
  normalizedText.includes("internet")
) {
  params.append("digital_feature", "wifi");
}


// ---------------------------------------------------------
// Kostenloses WLAN
// ---------------------------------------------------------

if (
  normalizedText.includes("kostenloses wlan") ||
  normalizedText.includes("kostenloses wifi") ||
  normalizedText.includes("kostenfreies wlan") ||
  normalizedText.includes("gratis wlan") ||
  normalizedText.includes("gratis wifi") ||
  normalizedText.includes("free wifi")
) {
  params.append("digital_feature", "free_wifi");
}


// ---------------------------------------------------------
// Schnelles WLAN
// ---------------------------------------------------------

if (
  normalizedText.includes("schnelles wlan") ||
  normalizedText.includes("schnelles wifi") ||
  normalizedText.includes("schnelles internet") ||
  normalizedText.includes("high speed internet") ||
  normalizedText.includes("high speed wifi") ||
  normalizedText.includes("highspeed internet") ||
  normalizedText.includes("highspeed wlan")
) {
  params.append("digital_feature", "high_speed_wifi");
}


// ---------------------------------------------------------
// Stabiles / zuverlässiges Internet
// ---------------------------------------------------------

if (
  normalizedText.includes("stabiles wlan") ||
  normalizedText.includes("stabiles wifi") ||
  normalizedText.includes("stabiles internet") ||
  normalizedText.includes("zuverlässiges wlan") ||
  normalizedText.includes("zuverlaessiges wlan") ||
  normalizedText.includes("zuverlässiges internet") ||
  normalizedText.includes("zuverlaessiges internet") ||
  normalizedText.includes("gute internetverbindung")
) {
  params.append("digital_feature", "reliable_internet");
}


// ---------------------------------------------------------
// Glasfaser
// ---------------------------------------------------------

if (
  normalizedText.includes("glasfaser") ||
  normalizedText.includes("glasfaseranschluss") ||
  normalizedText.includes("glasfaser internet") ||
  normalizedText.includes("fiber internet") ||
  normalizedText.includes("fibre internet")
) {
  params.append("digital_feature", "fiber_internet");
}


// ---------------------------------------------------------
// LAN / Ethernet
// ---------------------------------------------------------

if (
  normalizedText.includes("lan anschluss") ||
  normalizedText.includes("lan-anschluss") ||
  normalizedText.includes("ethernet") ||
  normalizedText.includes("netzwerkanschluss") ||
  normalizedText.includes("kabelgebundenes internet")
) {
  params.append("digital_feature", "ethernet");
}


// ---------------------------------------------------------
// Mindest-Internetgeschwindigkeit
// Beispiele:
// "mindestens 100 mbit"
// "wlan mit 250 mbps"
// ---------------------------------------------------------

const minInternetSpeedMatch = normalizedText.match(
  /(?:mindestens|min\.?|ab|mit)\s*(\d+(?:[.,]\d+)?)\s*(?:mbit\/?s?|mbps|mbit)/
);

if (minInternetSpeedMatch) {
  params.set(
    "min_internet_speed_mbps",
    minInternetSpeedMatch[1].replace(",", ".")
  );
}


// ---------------------------------------------------------
// Gigabit-Internet
// ---------------------------------------------------------

if (
  normalizedText.includes("gigabit internet") ||
  normalizedText.includes("gigabit wlan") ||
  normalizedText.includes("1 gbit") ||
  normalizedText.includes("1000 mbit")
) {
  params.append("digital_feature", "gigabit_internet");
}


// ---------------------------------------------------------
// Guter Mobilfunkempfang
// ---------------------------------------------------------

if (
  normalizedText.includes("guter mobilfunkempfang") ||
  normalizedText.includes("guter handyempfang") ||
  normalizedText.includes("gutes mobilfunknetz") ||
  normalizedText.includes("guter empfang")
) {
  params.append("digital_feature", "good_mobile_signal");
}


// ---------------------------------------------------------
// 5G
// ---------------------------------------------------------

if (
  containsWholeTerm(normalizedText, "5g") ||
  normalizedText.includes("5g empfang") ||
  normalizedText.includes("5g netz")
) {
  params.append("digital_feature", "5g_available");
}


// ---------------------------------------------------------
// Arbeitsplatz allgemein
// ---------------------------------------------------------

if (
  normalizedText.includes("arbeitsplatz") ||
  normalizedText.includes("arbeitsbereich") ||
  normalizedText.includes("platz zum arbeiten") ||
  normalizedText.includes("arbeitsmöglichkeit") ||
  normalizedText.includes("arbeitsmoeglichkeit")
) {
  params.append("workspace_feature", "workspace");
}


// ---------------------------------------------------------
// Schreibtisch
// ---------------------------------------------------------

if (
  normalizedText.includes("schreibtisch") ||
  normalizedText.includes("arbeitstisch") ||
  normalizedText.includes("desk")
) {
  params.append("workspace_feature", "desk");
}


// ---------------------------------------------------------
// Großer Schreibtisch
// ---------------------------------------------------------

if (
  normalizedText.includes("großer schreibtisch") ||
  normalizedText.includes("grosser schreibtisch") ||
  normalizedText.includes("großer arbeitstisch") ||
  normalizedText.includes("grosser arbeitstisch") ||
  normalizedText.includes("geräumiger schreibtisch") ||
  normalizedText.includes("geraeumiger schreibtisch")
) {
  params.append("workspace_feature", "large_desk");
}


// ---------------------------------------------------------
// Ergonomischer Arbeitsplatz
// ---------------------------------------------------------

if (
  normalizedText.includes("ergonomischer arbeitsplatz") ||
  normalizedText.includes("ergonomischer schreibtisch") ||
  normalizedText.includes("ergonomisch arbeiten")
) {
  params.append("workspace_feature", "ergonomic_workspace");
}


// ---------------------------------------------------------
// Bürostuhl
// ---------------------------------------------------------

if (
  normalizedText.includes("bürostuhl") ||
  normalizedText.includes("buerostuhl") ||
  normalizedText.includes("schreibtischstuhl") ||
  normalizedText.includes("office chair")
) {
  params.append("workspace_feature", "office_chair");
}


// ---------------------------------------------------------
// Ergonomischer Bürostuhl
// ---------------------------------------------------------

if (
  normalizedText.includes("ergonomischer bürostuhl") ||
  normalizedText.includes("ergonomischer buerostuhl") ||
  normalizedText.includes("ergonomischer schreibtischstuhl")
) {
  params.append("workspace_feature", "ergonomic_chair");
}


// ---------------------------------------------------------
// Separates Arbeitszimmer
// ---------------------------------------------------------

if (
  normalizedText.includes("arbeitszimmer") ||
  normalizedText.includes("separates arbeitszimmer") ||
  normalizedText.includes("eigenes arbeitszimmer") ||
  normalizedText.includes("büro im zimmer") ||
  normalizedText.includes("buero im zimmer") ||
  normalizedText.includes("homeoffice zimmer")
) {
  params.append("workspace_feature", "private_office");
}


// ---------------------------------------------------------
// Ruhiger Arbeitsplatz
// ---------------------------------------------------------

if (
  normalizedText.includes("ruhiger arbeitsplatz") ||
  normalizedText.includes("ruhig arbeiten") ||
  normalizedText.includes("ungestört arbeiten") ||
  normalizedText.includes("ungestoert arbeiten") ||
  normalizedText.includes("ruhiges arbeiten")
) {
  params.append("workspace_feature", "quiet_workspace");
}


// ---------------------------------------------------------
// Schallisolierter Arbeitsbereich
// ---------------------------------------------------------

if (
  normalizedText.includes("schallisolierter arbeitsplatz") ||
  normalizedText.includes("schallisoliertes arbeitszimmer") ||
  normalizedText.includes("schallgedämmter arbeitsplatz") ||
  normalizedText.includes("schallgedaemmter arbeitsplatz")
) {
  params.append("workspace_feature", "soundproof_workspace");
}


// ---------------------------------------------------------
// Coworking
// ---------------------------------------------------------

if (
  normalizedText.includes("coworking") ||
  normalizedText.includes("co working") ||
  normalizedText.includes("coworking space") ||
  normalizedText.includes("coworking-space") ||
  normalizedText.includes("coworkingbereich")
) {
  params.append("business_feature", "coworking_space");
}


// ---------------------------------------------------------
// Coworking in der Nähe
// ---------------------------------------------------------

if (
  normalizedText.includes("coworking in der nähe") ||
  normalizedText.includes("coworking in der naehe") ||
  normalizedText.includes("coworking space in der nähe") ||
  normalizedText.includes("coworking space in der naehe") ||
  normalizedText.includes("nah am coworking")
) {
  params.append("business_location", "near_coworking_space");
}


// ---------------------------------------------------------
// Business Center
// ---------------------------------------------------------

if (
  normalizedText.includes("business center") ||
  normalizedText.includes("businesscenter") ||
  normalizedText.includes("business centre") ||
  normalizedText.includes("geschäftszentrum") ||
  normalizedText.includes("geschaeftszentrum")
) {
  params.append("business_feature", "business_center");
}


// ---------------------------------------------------------
// Besprechungsraum / Meetingraum
// ---------------------------------------------------------

if (
  normalizedText.includes("meetingraum") ||
  normalizedText.includes("meeting room") ||
  normalizedText.includes("besprechungsraum") ||
  normalizedText.includes("besprechungsräume") ||
  normalizedText.includes("besprechungsraeume") ||
  normalizedText.includes("sitzungsraum")
) {
  params.append("business_feature", "meeting_room");
}


// ---------------------------------------------------------
// Konferenzraum
// ---------------------------------------------------------

if (
  normalizedText.includes("konferenzraum") ||
  normalizedText.includes("konferenzräume") ||
  normalizedText.includes("konferenzraeume") ||
  normalizedText.includes("conference room")
) {
  params.append("business_feature", "conference_room");
}


// ---------------------------------------------------------
// Tagungsräume
// ---------------------------------------------------------

if (
  normalizedText.includes("tagungsraum") ||
  normalizedText.includes("tagungsräume") ||
  normalizedText.includes("tagungsraeume") ||
  normalizedText.includes("tagungsmöglichkeiten") ||
  normalizedText.includes("tagungsmoeglichkeiten")
) {
  params.append("business_feature", "conference_facilities");
}


// ---------------------------------------------------------
// Videokonferenz geeignet
// ---------------------------------------------------------

if (
  normalizedText.includes("videokonferenz") ||
  normalizedText.includes("video konferenz") ||
  normalizedText.includes("zoom meeting") ||
  normalizedText.includes("teams meeting") ||
  normalizedText.includes("online meeting") ||
  normalizedText.includes("video call")
) {
  params.append("business_feature", "video_conferencing");
}


// ---------------------------------------------------------
// Webcam
// ---------------------------------------------------------

if (
  normalizedText.includes("webcam") ||
  normalizedText.includes("web kamera")
) {
  params.append("digital_feature", "webcam");
}


// ---------------------------------------------------------
// Externer Monitor
// ---------------------------------------------------------

if (
  normalizedText.includes("externer monitor") ||
  normalizedText.includes("externer bildschirm") ||
  normalizedText.includes("zweiter monitor") ||
  normalizedText.includes("zweiter bildschirm") ||
  normalizedText.includes("computer monitor")
) {
  params.append("workspace_feature", "external_monitor");
}


// ---------------------------------------------------------
// Mehrere Monitore
// ---------------------------------------------------------

if (
  normalizedText.includes("mehrere monitore") ||
  normalizedText.includes("zwei monitore") ||
  normalizedText.includes("2 monitore") ||
  normalizedText.includes("dual monitor") ||
  normalizedText.includes("dual screen")
) {
  params.append("workspace_feature", "multiple_monitors");
}


// ---------------------------------------------------------
// Tastatur / Maus
// ---------------------------------------------------------

if (
  normalizedText.includes("tastatur und maus") ||
  normalizedText.includes("tastatur") ||
  normalizedText.includes("computermaus") ||
  normalizedText.includes("keyboard and mouse")
) {
  params.append("workspace_feature", "keyboard_mouse");
}


// ---------------------------------------------------------
// Drucker
// ---------------------------------------------------------

if (
  normalizedText.includes("drucker") ||
  normalizedText.includes("druckmöglichkeit") ||
  normalizedText.includes("druckmoeglichkeit") ||
  normalizedText.includes("printing service") ||
  normalizedText.includes("printer")
) {
  params.append("business_feature", "printer");
}


// ---------------------------------------------------------
// Scanner
// ---------------------------------------------------------

if (
  normalizedText.includes("scanner") ||
  normalizedText.includes("scanservice") ||
  normalizedText.includes("dokumente scannen")
) {
  params.append("business_feature", "scanner");
}


// ---------------------------------------------------------
// Kopierer
// ---------------------------------------------------------

if (
  normalizedText.includes("kopierer") ||
  normalizedText.includes("kopiergerät") ||
  normalizedText.includes("kopiergeraet") ||
  normalizedText.includes("kopierservice")
) {
  params.append("business_feature", "copier");
}


// ---------------------------------------------------------
// Fax
// ---------------------------------------------------------

if (
  normalizedText.includes("fax") ||
  normalizedText.includes("faxgerät") ||
  normalizedText.includes("faxgeraet") ||
  normalizedText.includes("faxservice")
) {
  params.append("business_feature", "fax");
}


// ---------------------------------------------------------
// Telefon im Zimmer
// ---------------------------------------------------------

if (
  normalizedText.includes("telefon im zimmer") ||
  normalizedText.includes("festnetztelefon") ||
  normalizedText.includes("zimmertelefon")
) {
  params.append("business_feature", "room_phone");
}


// ---------------------------------------------------------
// Steckdosen am Arbeitsplatz
// ---------------------------------------------------------

if (
  normalizedText.includes("steckdose am schreibtisch") ||
  normalizedText.includes("steckdosen am schreibtisch") ||
  normalizedText.includes("steckdose am arbeitsplatz") ||
  normalizedText.includes("steckdosen am arbeitsplatz")
) {
  params.append("workspace_feature", "desk_power_outlets");
}


// ---------------------------------------------------------
// USB-Anschlüsse
// ---------------------------------------------------------

if (
  normalizedText.includes("usb anschluss") ||
  normalizedText.includes("usb anschlüsse") ||
  normalizedText.includes("usb anschluesse") ||
  normalizedText.includes("usb steckdose") ||
  normalizedText.includes("usb ports")
) {
  params.append("digital_feature", "usb_ports");
}


// ---------------------------------------------------------
// USB-C
// ---------------------------------------------------------

if (
  normalizedText.includes("usb c") ||
  normalizedText.includes("usb-c") ||
  normalizedText.includes("usb c anschluss") ||
  normalizedText.includes("usb-c anschluss")
) {
  params.append("digital_feature", "usb_c");
}


// ---------------------------------------------------------
// Laptop-Safe
// ---------------------------------------------------------

if (
  normalizedText.includes("laptop safe") ||
  normalizedText.includes("laptopsafe") ||
  normalizedText.includes("laptop-safe") ||
  normalizedText.includes("safe für laptop") ||
  normalizedText.includes("safe fuer laptop")
) {
  params.append("business_feature", "laptop_safe");
}


// ---------------------------------------------------------
// Laptop-Arbeitsplatz
// ---------------------------------------------------------

if (
  normalizedText.includes("laptop arbeitsplatz") ||
  normalizedText.includes("laptop-arbeitsplatz") ||
  normalizedText.includes("platz für laptop") ||
  normalizedText.includes("platz fuer laptop")
) {
  params.append("workspace_feature", "laptop_workspace");
}


// ---------------------------------------------------------
// Smart TV
// ---------------------------------------------------------

if (
  normalizedText.includes("smart tv") ||
  normalizedText.includes("smart-tv") ||
  normalizedText.includes("smarttv")
) {
  params.append("digital_feature", "smart_tv");
}


// ---------------------------------------------------------
// Streaming
// ---------------------------------------------------------

if (
  normalizedText.includes("streaming") ||
  normalizedText.includes("streamingdienste") ||
  normalizedText.includes("streaming dienste") ||
  normalizedText.includes("netflix") ||
  normalizedText.includes("chromecast")
) {
  params.append("digital_feature", "streaming");
}


// ---------------------------------------------------------
// Bluetooth Lautsprecher
// ---------------------------------------------------------

if (
  normalizedText.includes("bluetooth lautsprecher") ||
  normalizedText.includes("bluetooth speaker") ||
  normalizedText.includes("bluetooth box")
) {
  params.append("digital_feature", "bluetooth_speaker");
}


// ---------------------------------------------------------
// Smart Home
// ---------------------------------------------------------

if (
  normalizedText.includes("smart home") ||
  normalizedText.includes("smarthome") ||
  normalizedText.includes("smarte unterkunft")
) {
  params.append("digital_feature", "smart_home");
}


// ---------------------------------------------------------
// Klimaanlage am Arbeitsplatz
// ---------------------------------------------------------

if (
  normalizedText.includes("klimatisierter arbeitsplatz") ||
  normalizedText.includes("klimatisiertes arbeitszimmer") ||
  normalizedText.includes("klimaanlage im arbeitszimmer") ||
  normalizedText.includes("klimaanlage beim schreibtisch")
) {
  params.append("workspace_feature", "air_conditioned_workspace");
}


// ---------------------------------------------------------
// Gute Beleuchtung zum Arbeiten
// ---------------------------------------------------------

if (
  normalizedText.includes("gute arbeitsbeleuchtung") ||
  normalizedText.includes("gute beleuchtung zum arbeiten") ||
  normalizedText.includes("schreibtischlampe") ||
  normalizedText.includes("arbeitslampe")
) {
  params.append("workspace_feature", "good_work_lighting");
}


// ---------------------------------------------------------
// Tageslicht am Arbeitsplatz
// ---------------------------------------------------------

if (
  normalizedText.includes("tageslicht am arbeitsplatz") ||
  normalizedText.includes("tageslicht im arbeitszimmer") ||
  normalizedText.includes("heller arbeitsplatz")
) {
  params.append("workspace_feature", "natural_light_workspace");
}


// ---------------------------------------------------------
// 24h nutzbarer Arbeitsbereich
// ---------------------------------------------------------

if (
  normalizedText.includes("24 stunden coworking") ||
  normalizedText.includes("24h coworking") ||
  normalizedText.includes("arbeitsbereich rund um die uhr") ||
  normalizedText.includes("24 stunden arbeitsbereich")
) {
  params.append("business_feature", "24h_workspace");
}


// ---------------------------------------------------------
// Langzeitaufenthalt
// ---------------------------------------------------------

if (
  normalizedText.includes("langzeitaufenthalt") ||
  normalizedText.includes("langzeit aufenthalt") ||
  normalizedText.includes("längerer aufenthalt") ||
  normalizedText.includes("laengerer aufenthalt") ||
  normalizedText.includes("long stay") ||
  normalizedText.includes("longstay")
) {
  params.append("stay_preference", "long_stay");
}


// ---------------------------------------------------------
// Monatlicher Aufenthalt
// ---------------------------------------------------------

if (
  normalizedText.includes("für einen monat") ||
  normalizedText.includes("fuer einen monat") ||
  normalizedText.includes("einen monat bleiben") ||
  normalizedText.includes("monatsaufenthalt") ||
  normalizedText.includes("monatlich mieten")
) {
  params.append("stay_preference", "monthly_stay");
}


// ---------------------------------------------------------
// Mehrmonatiger Aufenthalt
// ---------------------------------------------------------

if (
  normalizedText.includes("mehrere monate") ||
  normalizedText.includes("für mehrere monate") ||
  normalizedText.includes("fuer mehrere monate") ||
  normalizedText.includes("mehrmonatiger aufenthalt")
) {
  params.append("stay_preference", "multi_month_stay");
}


// ---------------------------------------------------------
// Langzeitrabatt
// ---------------------------------------------------------

if (
  normalizedText.includes("langzeitrabatt") ||
  normalizedText.includes("langzeit rabatt") ||
  normalizedText.includes("monatsrabatt") ||
  normalizedText.includes("rabatt bei langem aufenthalt") ||
  normalizedText.includes("long stay discount")
) {
  params.append("stay_preference", "long_stay_discount");
}


// ---------------------------------------------------------
// Wochenrabatt
// ---------------------------------------------------------

if (
  normalizedText.includes("wochenrabatt") ||
  normalizedText.includes("wochen rabatt") ||
  normalizedText.includes("rabatt für eine woche") ||
  normalizedText.includes("rabatt fuer eine woche")
) {
  params.append("stay_preference", "weekly_discount");
}


// ---------------------------------------------------------
// Rechnung für Geschäftsreise
// ---------------------------------------------------------

if (
  normalizedText.includes("rechnung für firma") ||
  normalizedText.includes("rechnung fuer firma") ||
  normalizedText.includes("firmenrechnung") ||
  normalizedText.includes("geschäftsrechnung") ||
  normalizedText.includes("geschaeftsrechnung") ||
  normalizedText.includes("rechnung für geschäftsreise") ||
  normalizedText.includes("rechnung fuer geschaeftsreise")
) {
  params.append("business_service", "business_invoice");
}


// ---------------------------------------------------------
// Rechnung mit Firmenanschrift
// ---------------------------------------------------------

if (
  normalizedText.includes("rechnung mit firmenanschrift") ||
  normalizedText.includes("rechnung auf firma") ||
  normalizedText.includes("rechnung auf die firma") ||
  normalizedText.includes("firmenanschrift auf rechnung")
) {
  params.append("business_service", "company_invoice");
}


// ---------------------------------------------------------
// Express Check-in / Check-out
// ---------------------------------------------------------

if (
  normalizedText.includes("express check in") ||
  normalizedText.includes("express check-in") ||
  normalizedText.includes("express check out") ||
  normalizedText.includes("express check-out") ||
  normalizedText.includes("express checkin") ||
  normalizedText.includes("express checkout")
) {
  params.append("business_service", "express_check_in_out");
}


// ---------------------------------------------------------
// Frühes Frühstück für Geschäftsreisende
// ---------------------------------------------------------

if (
  normalizedText.includes("frühes frühstück") ||
  normalizedText.includes("fruehes fruehstueck") ||
  normalizedText.includes("frühstück früh morgens") ||
  normalizedText.includes("fruehstueck frueh morgens") ||
  normalizedText.includes("early breakfast")
) {
  params.append("business_service", "early_breakfast");
}


// ---------------------------------------------------------
// Frühstück zum Mitnehmen
// ---------------------------------------------------------

if (
  normalizedText.includes("frühstück zum mitnehmen") ||
  normalizedText.includes("fruehstueck zum mitnehmen") ||
  normalizedText.includes("frühstück to go") ||
  normalizedText.includes("fruehstueck to go") ||
  normalizedText.includes("breakfast to go")
) {
  params.append("business_service", "breakfast_to_go");
}


// ---------------------------------------------------------
// Bügelservice
// ---------------------------------------------------------

if (
  normalizedText.includes("bügelservice") ||
  normalizedText.includes("buegelservice") ||
  normalizedText.includes("bügeln lassen") ||
  normalizedText.includes("buegeln lassen")
) {
  params.append("business_service", "ironing_service");
}


// ---------------------------------------------------------
// Wäscheservice
// ---------------------------------------------------------

if (
  normalizedText.includes("wäscheservice") ||
  normalizedText.includes("waescheservice") ||
  normalizedText.includes("wäscherei") ||
  normalizedText.includes("waescherei") ||
  normalizedText.includes("laundry service")
) {
  params.append("business_service", "laundry_service");
}


// ---------------------------------------------------------
// Chemische Reinigung
// ---------------------------------------------------------

if (
  normalizedText.includes("chemische reinigung") ||
  normalizedText.includes("textilreinigung") ||
  normalizedText.includes("dry cleaning")
) {
  params.append("business_service", "dry_cleaning");
}


// ---------------------------------------------------------
// Ruhiges Zimmer für Geschäftsreise
// ---------------------------------------------------------

if (
  normalizedText.includes("ruhiges zimmer zum arbeiten") ||
  normalizedText.includes("ruhiges zimmer für arbeit") ||
  normalizedText.includes("ruhiges zimmer fuer arbeit") ||
  normalizedText.includes("ruhiges businesszimmer")
) {
  params.append("business_preference", "quiet_business_room");
}


// ---------------------------------------------------------
// Schallisoliertes Zimmer
// ---------------------------------------------------------

if (
  normalizedText.includes("schallisoliertes zimmer") ||
  normalizedText.includes("schallgedämmtes zimmer") ||
  normalizedText.includes("schallgedaemmtes zimmer") ||
  normalizedText.includes("soundproof room")
) {
  params.append("business_preference", "soundproof_room");
}


// ---------------------------------------------------------
// Zentrale Lage für Geschäftsreise
// ---------------------------------------------------------

if (
  normalizedText.includes("zentral für geschäftsreise") ||
  normalizedText.includes("zentral fuer geschaeftsreise") ||
  normalizedText.includes("zentrale lage für geschäftsreisende") ||
  normalizedText.includes("zentrale lage fuer geschaeftsreisende")
) {
  params.append("business_location", "central_for_business");
}


// ---------------------------------------------------------
// Nähe Messe
// ---------------------------------------------------------

if (
  normalizedText.includes("messe in der nähe") ||
  normalizedText.includes("messe in der naehe") ||
  normalizedText.includes("nah an der messe") ||
  normalizedText.includes("nähe messe") ||
  normalizedText.includes("naehe messe") ||
  normalizedText.includes("messegelände in der nähe") ||
  normalizedText.includes("messegelände in der naehe") ||
  normalizedText.includes("messegelände in der naehe") ||
  normalizedText.includes("messe in laufnähe") ||
  normalizedText.includes("messe in laufnaehe")
) {
  params.append("business_location", "near_exhibition_center");
}


// ---------------------------------------------------------
// Nähe Kongresszentrum
// ---------------------------------------------------------

if (
  normalizedText.includes("kongresszentrum in der nähe") ||
  normalizedText.includes("kongresszentrum in der naehe") ||
  normalizedText.includes("conference center in der nähe") ||
  normalizedText.includes("conference center in der naehe") ||
  normalizedText.includes("nah am kongresszentrum")
) {
  params.append("business_location", "near_convention_center");
}


// ---------------------------------------------------------
// Nähe Büroviertel / Geschäftsviertel
// ---------------------------------------------------------

if (
  normalizedText.includes("geschäftsviertel") ||
  normalizedText.includes("geschaeftsviertel") ||
  normalizedText.includes("business district") ||
  normalizedText.includes("büroviertel") ||
  normalizedText.includes("bueroviertel")
) {
  params.append("business_location", "near_business_district");
}


// ---------------------------------------------------------
// Nähe Arbeitsplatz / Firma
// ---------------------------------------------------------

if (
  normalizedText.includes("nah zur arbeit") ||
  normalizedText.includes("nähe arbeitsplatz") ||
  normalizedText.includes("naehe arbeitsplatz") ||
  normalizedText.includes("nah zur firma") ||
  normalizedText.includes("nähe firma") ||
  normalizedText.includes("naehe firma")
) {
  params.append("business_location", "near_workplace");
}


// ---------------------------------------------------------
// Business-Aufenthalt insgesamt
// ---------------------------------------------------------

if (
  normalizedText.includes("geschäftlicher aufenthalt") ||
  normalizedText.includes("geschaeftlicher aufenthalt") ||
  normalizedText.includes("beruflicher aufenthalt") ||
  normalizedText.includes("dienstreise")
) {
  params.append("trip_style", "business_trip");
}

parseNatureSearch(normalizedText, params);
parseCitySearch(normalizedText, params);
parseRomanceSearch(normalizedText, params);
parseLuxurySearch(normalizedText, params);
parseHotelStars(normalizedText, params);
parseSustainabilitySearch(normalizedText, params);
parseSecuritySearch(normalizedText, params);
parseExtendedSearch(normalizedText, params);



// =========================================================
// REISEDAUER – umfassende lokale Erkennung
// =========================================================

const durationNumberWords: Record<string, number> = {
  null: 0,

  ein: 1,
  eine: 1,
  einen: 1,
  einem: 1,
  einer: 1,
  eins: 1,

  zwei: 2,
  drei: 3,
  vier: 4,
  fünf: 5,
  fuenf: 5,
  sechs: 6,
  sieben: 7,
  acht: 8,
  neun: 9,
  zehn: 10,
  elf: 11,
  zwölf: 12,
  zwoelf: 12,
  dreizehn: 13,
  vierzehn: 14,
  fünfzehn: 15,
  fuenfzehn: 15,
  sechzehn: 16,
  siebzehn: 17,
  achtzehn: 18,
  neunzehn: 19,
  zwanzig: 20,

  einundzwanzig: 21,
  zweiundzwanzig: 22,
  dreiundzwanzig: 23,
  vierundzwanzig: 24,
  fünfundzwanzig: 25,
  fuenfundzwanzig: 25,
  sechsundzwanzig: 26,
  siebenundzwanzig: 27,
  achtundzwanzig: 28,
  neunundzwanzig: 29,

  dreißig: 30,
  dreissig: 30,
  einunddreißig: 31,
  einunddreissig: 31,

  vierzig: 40,
  fünfzig: 50,
  fuenfzig: 50,
  sechzig: 60,
  siebzig: 70,
  achtzig: 80,
  neunzig: 90,
  hundert: 100,
};

const ordinalDurationWords: Record<string, number> = {
  zweit: 2,
  dritt: 3,
  viert: 4,
  fünft: 5,
  fuenft: 5,
  sechst: 6,
  siebt: 7,
  acht: 8,
  neunt: 9,
  zehnt: 10,
};

function parseDurationNumber(value: string): number {
  const normalized = value
    .toLowerCase()
    .trim()
    .replace(/[.,]/g, "");

  if (/^\d+$/.test(normalized)) {
    return Number(normalized);
  }

  return durationNumberWords[normalized] ?? 0;
}

const durationNumberPattern =
  "(\\d+|ein|eine|einen|einem|einer|eins|zwei|drei|vier|fünf|fuenf|sechs|sieben|acht|neun|zehn|elf|zwölf|zwoelf|dreizehn|vierzehn|fünfzehn|fuenfzehn|sechzehn|siebzehn|achtzehn|neunzehn|zwanzig|einundzwanzig|zweiundzwanzig|dreiundzwanzig|vierundzwanzig|fünfundzwanzig|fuenfundzwanzig|sechsundzwanzig|siebenundzwanzig|achtundzwanzig|neunundzwanzig|dreißig|dreissig|einunddreißig|einunddreissig|vierzig|fünfzig|fuenfzig|sechzig|siebzig|achtzig|neunzig|hundert)";

// ---------------------------------------------------------
// 1. NÄCHTE / ÜBERNACHTUNGEN
// ---------------------------------------------------------

const durationNightsMatch = text.match(
  new RegExp(
    `${durationNumberPattern}\\s*(?:nächte|naechte|nacht|übernachtungen|uebernachtungen|übernachtung|uebernachtung|nights?|night)`,
    "i"
  )
);

if (durationNightsMatch) {
  const nights = parseDurationNumber(durationNightsMatch[1]);

  if (nights > 0 && nights <= 365) {
    params.set("nights", nights.toString());
  }
}

// ---------------------------------------------------------
// 2. WOCHEN + TAGE KOMBINIEREN
// z. B. "2 Wochen und 3 Tage"
// ---------------------------------------------------------

if (!params.has("nights")) {
  const weeksAndDaysMatch = text.match(
    new RegExp(
      `${durationNumberPattern}\\s*(?:wochen|woche)\\s*(?:und|plus|\\+)\\s*${durationNumberPattern}\\s*(?:tage|tag)`,
      "i"
    )
  );

  if (weeksAndDaysMatch) {
    const weeks = parseDurationNumber(weeksAndDaysMatch[1]);
    const days = parseDurationNumber(weeksAndDaysMatch[2]);

    const totalDays = weeks * 7 + days;

    if (totalDays > 0 && totalDays <= 365) {
      params.set("duration_days", String(totalDays));
    }
  }
}

// ---------------------------------------------------------
// 3. WOCHEN
// ---------------------------------------------------------

const weeksMatch = text.match(
  new RegExp(
    `${durationNumberPattern}\\s*(?:wochen|woche|weeks?|week)`,
    "i"
  )
);

if (!params.has("nights") && weeksMatch) {
  const weeks = parseDurationNumber(weeksMatch[1]);

  if (weeks > 0 && weeks <= 52) {
    params.set("nights", String(weeks * 7));
  }
}

// ---------------------------------------------------------
// 4. HALBE / EINEINHALB WOCHEN
// ---------------------------------------------------------

if (!params.has("nights")) {
  const oneAndHalfWeeks =
    /\b(?:eineinhalb|anderthalb|1[,.]5)\s*(?:wochen|woche)\b/i.test(text);

  if (oneAndHalfWeeks) {
    params.set("nights", "10");
  }
}



// ---------------------------------------------------------
// 5. TAGE
// ---------------------------------------------------------

const daysMatch = text.match(
  new RegExp(
    `${durationNumberPattern}\\s*(?:tage|tag|days?|day)`,
    "i"
  )
);

if (
  !params.has("nights") &&
  !params.has("duration_days") &&
  daysMatch
) {
  const days = parseDurationNumber(daysMatch[1]);

  if (days > 0 && days <= 365) {
    params.set("duration_days", days.toString());
  }
}

// ---------------------------------------------------------
// 6. "X TAGE LANG"
// ---------------------------------------------------------

if (
  !params.has("nights") &&
  !params.has("duration_days")
) {
  const daysLongMatch = text.match(
    new RegExp(
      `${durationNumberPattern}\\s*(?:tage|tag)\\s*(?:lang|lange)`,
      "i"
    )
  );

  if (daysLongMatch) {
    const days = parseDurationNumber(daysLongMatch[1]);

    if (days > 0 && days <= 365) {
      params.set("duration_days", days.toString());
    }
  }
}

// ---------------------------------------------------------
// 7. WOCHENENDE
// ---------------------------------------------------------

if (
  !params.has("nights") &&
  !params.has("duration_days")
) {
  const weekendMentioned =
    containsWholeTerm(text, "wochenende") ||
    text.includes("weekend");

  if (weekendMentioned) {
    params.set("nights", "2");
  }
}

// ---------------------------------------------------------
// 8. VERLÄNGERTES WOCHENENDE
// ---------------------------------------------------------

if (
  !params.has("nights") &&
  !params.has("duration_days")
) {
  const longWeekend =
    text.includes("verlängertes wochenende") ||
    text.includes("verlaengertes wochenende") ||
    text.includes("langes wochenende") ||
    text.includes("long weekend");

  if (longWeekend) {
    params.set("nights", "3");
  }
}

// ---------------------------------------------------------
// 9. KURZTRIP / KURZURLAUB
// ---------------------------------------------------------

if (
  !params.has("nights") &&
  !params.has("duration_days")
) {
  const shortTrip =
    text.includes("kurztrip") ||
    text.includes("kurzurlaub") ||
    text.includes("kurzreise") ||
    text.includes("short trip") ||
    text.includes("city break");

  if (shortTrip) {
    params.set("nights", "3");
  }
}

// ---------------------------------------------------------
// 10. EINE WOCHE / EIN PAAR TAGE
// ---------------------------------------------------------

if (
  !params.has("nights") &&
  !params.has("duration_days")
) {
  if (
    text.includes("eine woche") ||
    text.includes("für eine woche") ||
    text.includes("fuer eine woche")
  ) {
    params.set("nights", "7");
  }
}

if (
  !params.has("nights") &&
  !params.has("duration_days")
) {
  if (
    text.includes("ein paar tage") ||
    text.includes("paar tage") ||
    text.includes("few days")
  ) {
    params.set("duration_days", "3");
  }
}

// ---------------------------------------------------------
// 11. MONAT / MONATE
// ---------------------------------------------------------

const monthsDurationMatch = text.match(
  new RegExp(
    `${durationNumberPattern}\\s*(?:monate|monat|months?|month)`,
    "i"
  )
);

if (
  !params.has("nights") &&
  !params.has("duration_days") &&
  monthsDurationMatch
) {
  const months = parseDurationNumber(monthsDurationMatch[1]);

  if (months > 0 && months <= 12) {
    params.set("duration_months", String(months));
  }
}

// ---------------------------------------------------------
// 12. EIN MONAT
// ---------------------------------------------------------

if (
  !params.has("nights") &&
  !params.has("duration_days") &&
  !params.has("duration_months")
) {
  if (
    text.includes("einen monat") ||
    text.includes("ein monat") ||
    text.includes("einen ganzen monat") ||
    text.includes("one month")
  ) {
    params.set("duration_months", "1");
  }
}

// ---------------------------------------------------------
// 13. HALBER MONAT
// ---------------------------------------------------------

if (
  !params.has("nights") &&
  !params.has("duration_days") &&
  !params.has("duration_months")
) {
  if (
    text.includes("halber monat") ||
    text.includes("einen halben monat") ||
    text.includes("halbmonat")
  ) {
    params.set("duration_days", "15");
  }
}

// ---------------------------------------------------------
// 14. ZWEI / DREI WOCHENENDEN NICHT ALS DAUER INTERPRETIEREN
// ---------------------------------------------------------
// Absichtlich kein Parser dafür.
// Solche Formulierungen sind meist wiederkehrende Reisen,
// kein einzelner Aufenthalt.

// ---------------------------------------------------------
// 15. "ZU ZWEIT" NICHT MIT DAUER VERWECHSELN
// ---------------------------------------------------------
// Die Gäste-Erkennung läuft separat.

// ---------------------------------------------------------
// 16. "ÜBER NACHT" / "EINE NACHT"
// ---------------------------------------------------------

if (
  !params.has("nights") &&
  (
    text.includes("über nacht") ||
    text.includes("ueber nacht") ||
    text.includes("nur eine nacht") ||
    text.includes("eine nacht bleiben")
  )
) {
  params.set("nights", "1");
}

// ---------------------------------------------------------
// 17. WOCHENENDE MIT AN-/ABREISETAG
// ---------------------------------------------------------
// Konkrete Datumsangaben werden später stärker gewichtet
// als diese Dauerannahmen.

// ---------------------------------------------------------
// 18. DURATION PRIORITY
// ---------------------------------------------------------
//
// Reihenfolge:
// 1. explizite Nächte
// 2. Wochen
// 3. Wochen + Tage
// 4. Tage
// 5. Wochenende / Kurztrip
// 6. Monate
//
// Konkrete Check-in-/Check-out-Daten werden später
// die Dauer automatisch präzisieren.

// =========================================================
// KONKRETE DATUMSBEREICHE
// z. B.
// "vom 12. bis 19. Juli"
// "12.07. bis 19.07."
// "vom 12. Juli bis 19. Juli"
// =========================================================

const monthMap: Record<string, number> = {
  januar: 1,
  january: 1,

  februar: 2,
  february: 2,

  märz: 3,
  maerz: 3,
  march: 3,

  april: 4,

  mai: 5,
  may: 5,

  juni: 6,
  june: 6,

  juli: 7,
  july: 7,

  august: 8,

  september: 9,

  oktober: 10,
  october: 10,

  november: 11,

  dezember: 12,
  december: 12,
};

function padDatePart(value: number): string {
  return value.toString().padStart(2, "0");
}

function buildIsoDate(
  year: number,
  month: number,
  day: number
): string {
  return `${year}-${padDatePart(month)}-${padDatePart(day)}`;
}

// ---------------------------------------------------------
// 1. "vom 12. bis 19. Juli"
// ---------------------------------------------------------

const sameMonthRangeMatch = text.match(
  /\b(?:vom\s+)?(\d{1,2})\.?\s*(?:bis|-)\s*(\d{1,2})\.?\s*(januar|februar|märz|maerz|april|mai|juni|juli|august|september|oktober|november|dezember|january|february|march|may|june|july|october|december)\b/i
);

if (sameMonthRangeMatch) {
  const startDay = Number(sameMonthRangeMatch[1]);
  const endDay = Number(sameMonthRangeMatch[2]);
  const monthName = sameMonthRangeMatch[3].toLowerCase();
  const month = monthMap[monthName];

  if (month) {
    const now = new Date();
    let year = now.getFullYear();

    const startDateCandidate = new Date(
      year,
      month - 1,
      startDay
    );

    // Falls der Zeitraum im aktuellen Jahr bereits vorbei ist,
    // nehmen wir automatisch das nächste Jahr.
    if (startDateCandidate < now) {
      year += 1;
    }

    const checkIn = buildIsoDate(
      year,
      month,
      startDay
    );

    const checkOut = buildIsoDate(
      year,
      month,
      endDay
    );

    params.set("check_in", checkIn);
    params.set("check_out", checkOut);

    const diffMs =
      new Date(checkOut).getTime() -
      new Date(checkIn).getTime();

    const calculatedNights = Math.round(
      diffMs / (1000 * 60 * 60 * 24)
    );

    if (calculatedNights > 0) {
      params.set(
        "nights",
        calculatedNights.toString()
      );

      params.delete("duration_days");
    }
  }
}

// ---------------------------------------------------------
// 2. "vom 12. Juli bis 19. Juli"
// ---------------------------------------------------------

const fullMonthRangeMatch = text.match(
  /\b(?:vom\s+)?(\d{1,2})\.?\s*(januar|februar|märz|maerz|april|mai|juni|juli|august|september|oktober|november|dezember|january|february|march|may|june|july|october|december)\s*(?:bis|-)\s*(\d{1,2})\.?\s*(januar|februar|märz|maerz|april|mai|juni|juli|august|september|oktober|november|dezember|january|february|march|may|june|july|october|december)\b/i
);

if (
  !params.has("check_in") &&
  fullMonthRangeMatch
) {
  const startDay = Number(fullMonthRangeMatch[1]);
  const startMonth =
    monthMap[fullMonthRangeMatch[2].toLowerCase()];

  const endDay = Number(fullMonthRangeMatch[3]);
  const endMonth =
    monthMap[fullMonthRangeMatch[4].toLowerCase()];

  if (startMonth && endMonth) {
    const now = new Date();
    let startYear = now.getFullYear();
    let endYear = startYear;

    const startCandidate = new Date(
      startYear,
      startMonth - 1,
      startDay
    );

    if (startCandidate < now) {
      startYear += 1;
      endYear = startYear;
    }

    if (endMonth < startMonth) {
      endYear += 1;
    }

    const checkIn = buildIsoDate(
      startYear,
      startMonth,
      startDay
    );

    const checkOut = buildIsoDate(
      endYear,
      endMonth,
      endDay
    );

    params.set("check_in", checkIn);
    params.set("check_out", checkOut);

    const diffMs =
      new Date(checkOut).getTime() -
      new Date(checkIn).getTime();

    const calculatedNights = Math.round(
      diffMs / (1000 * 60 * 60 * 24)
    );

    if (calculatedNights > 0) {
      params.set(
        "nights",
        calculatedNights.toString()
      );

      params.delete("duration_days");
    }
  }
}

// ---------------------------------------------------------
// 3. Numerisch:
// "12.07. bis 19.07."
// "12.07 - 19.07"
// ---------------------------------------------------------

const numericDateRangeMatch = text.match(
  /\b(\d{1,2})\.(\d{1,2})\.?\s*(?:bis|-)\s*(\d{1,2})\.(\d{1,2})\.?\b/
);

if (
  !params.has("check_in") &&
  numericDateRangeMatch
) {
  const startDay = Number(numericDateRangeMatch[1]);
  const startMonth = Number(numericDateRangeMatch[2]);

  const endDay = Number(numericDateRangeMatch[3]);
  const endMonth = Number(numericDateRangeMatch[4]);

  if (
    startMonth >= 1 &&
    startMonth <= 12 &&
    endMonth >= 1 &&
    endMonth <= 12
  ) {
    const now = new Date();

    let startYear = now.getFullYear();
    let endYear = startYear;

    const startCandidate = new Date(
      startYear,
      startMonth - 1,
      startDay
    );

    if (startCandidate < now) {
      startYear += 1;
      endYear = startYear;
    }

    if (endMonth < startMonth) {
      endYear += 1;
    }

    const checkIn = buildIsoDate(
      startYear,
      startMonth,
      startDay
    );

    const checkOut = buildIsoDate(
      endYear,
      endMonth,
      endDay
    );

    params.set("check_in", checkIn);
    params.set("check_out", checkOut);

    const diffMs =
      new Date(checkOut).getTime() -
      new Date(checkIn).getTime();

    const calculatedNights = Math.round(
      diffMs / (1000 * 60 * 60 * 24)
    );

    if (calculatedNights > 0) {
      params.set(
        "nights",
        calculatedNights.toString()
      );

      params.delete("duration_days");
    }
  }
}

// =========================================================
// MONATSANGABEN
// z. B. "im August", "im Juli 2027"
// =========================================================

const monthOnlyMatch = text.match(
  /\b(?:im|in\s+den|für\s+den)?\s*(januar|februar|märz|maerz|april|mai|juni|juli|august|september|oktober|november|dezember|january|february|march|may|june|july|october|december)(?:\s+(\d{4}))?\b/i
);

if (
  !params.has("check_in") &&
  monthOnlyMatch
) {
  const monthName = monthOnlyMatch[1].toLowerCase();
  const monthNumber = monthMap[monthName];

  if (monthNumber) {
    const now = new Date();

    let year = monthOnlyMatch[2]
      ? Number(monthOnlyMatch[2])
      : now.getFullYear();

    if (!monthOnlyMatch[2]) {
      const currentMonth = now.getMonth() + 1;

      if (monthNumber < currentMonth) {
        year += 1;
      }
    }

    params.set("month", monthNumber.toString());
    params.set("year", year.toString());
  }
}

// =========================================================
// MONATSPHASEN
// z. B. "Anfang September", "Mitte Oktober", "Ende Mai"
// =========================================================

const monthPhaseMatch = text.match(
  /\b(anfang|mitte|ende)\s+(?:des\s+)?(januar|februar|märz|maerz|april|mai|juni|juli|august|september|oktober|november|dezember|january|february|march|may|june|july|october|december)(?:\s+(\d{4}))?\b/i
);

if (
  !params.has("check_in") &&
  monthPhaseMatch
) {
  const phase = monthPhaseMatch[1].toLowerCase();
  const monthName = monthPhaseMatch[2].toLowerCase();
  const monthNumber = monthMap[monthName];

  if (monthNumber) {
    const now = new Date();

    let year = monthPhaseMatch[3]
      ? Number(monthPhaseMatch[3])
      : now.getFullYear();

    if (!monthPhaseMatch[3]) {
      const currentMonth = now.getMonth() + 1;

      if (monthNumber < currentMonth) {
        year += 1;
      }
    }

    params.set("month", monthNumber.toString());
    params.set("year", year.toString());
    params.set("month_phase", phase);
  }
}

// =========================================================
// RELATIVE REISEDATEN – GESAMTBLOCK
//
// Beispiele:
// "heute"
// "ab morgen"
// "übermorgen"
// "dieses Wochenende"
// "kommendes Wochenende"
// "nächstes Wochenende"
// "übernächstes Wochenende"
// "nächste Woche"
// "übernächste Woche"
// "nächsten Monat"
// "übernächsten Monat"
// "Anfang nächsten Monats"
// "Mitte nächsten Monats"
// "Ende nächsten Monats"
// "in 3 Tagen"
// "in zwei Wochen"
// "nächsten Freitag"
// "kommenden Samstag"
// =========================================================


// ---------------------------------------------------------
// Hilfsfunktionen
// ---------------------------------------------------------

const relativeToday = new Date();

relativeToday.setHours(0, 0, 0, 0);


const relativeAddDays = (
  date: Date,
  days: number
) => {
  const result = new Date(date);

  result.setDate(result.getDate() + days);

  return result;
};


const relativeToIso = (date: Date) => {
  return buildIsoDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
};


const relativeSetDateRange = (
  checkInDate: Date,
  checkOutDate: Date
) => {
  const checkIn = relativeToIso(checkInDate);
  const checkOut = relativeToIso(checkOutDate);

  const diffMs =
    checkOutDate.getTime() -
    checkInDate.getTime();

  const calculatedNights = Math.round(
    diffMs / (1000 * 60 * 60 * 24)
  );

  params.set("check_in", checkIn);
  params.set("check_out", checkOut);

  if (calculatedNights > 0) {
    params.set(
      "nights",
      calculatedNights.toString()
    );
  }

  // Genaues Datum ist stärker als grobe Zeitangaben.
  params.delete("month");
  params.delete("year");
  params.delete("month_phase");
  params.delete("duration_days");
};


const relativeSetCheckIn = (
  checkInDate: Date
) => {
  params.set(
    "check_in",
    relativeToIso(checkInDate)
  );

  params.delete("month");
  params.delete("year");
  params.delete("month_phase");
};


// =========================================================
// 1. HEUTE / MORGEN / ÜBERMORGEN
// =========================================================

if (!params.has("check_in")) {

  const relativeSimpleDayMatch = normalizedText.match(
    /\b(?:ab\s+)?(heute|morgen|übermorgen|uebermorgen)\b/i
  );

  if (relativeSimpleDayMatch) {

    const relativeWord =
      relativeSimpleDayMatch[1].toLowerCase();

    let relativeDaysAhead = 0;

    if (relativeWord === "morgen") {
      relativeDaysAhead = 1;
    }

    if (
      relativeWord === "übermorgen" ||
      relativeWord === "uebermorgen"
    ) {
      relativeDaysAhead = 2;
    }

    const relativeArrival =
      relativeAddDays(
        relativeToday,
        relativeDaysAhead
      );

    relativeSetCheckIn(relativeArrival);
  }
}


// =========================================================
// 2. WOCHENENDE
//
// Standard:
// Freitag → Sonntag
// = 2 Nächte
// =========================================================

if (!params.has("check_in")) {

  const relativeWeekendMatch = normalizedText.match(
    /\b(dieses|diesem|kommendes|kommenden|naechstes|nächstes|uebernaechstes|übernächstes)\s+wochenende\b/i
  );

  if (relativeWeekendMatch) {

    const relativeWeekendType =
      relativeWeekendMatch[1].toLowerCase();

    const currentWeekday =
      relativeToday.getDay();

    // JavaScript:
    // Sonntag = 0
    // Montag = 1
    // ...
    // Freitag = 5
    // Samstag = 6

    let relativeDaysUntilFriday =
      (5 - currentWeekday + 7) % 7;


    // -----------------------------------------------------
    // "dieses / kommendes Wochenende"
    // -----------------------------------------------------

    if (
      relativeWeekendType === "dieses" ||
      relativeWeekendType === "diesem" ||
      relativeWeekendType === "kommendes" ||
      relativeWeekendType === "kommenden"
    ) {

      // Wenn heute Samstag ist:
      // Samstag → Sonntag = 1 Nacht

      if (currentWeekday === 6) {

        const checkInDate =
          new Date(relativeToday);

        const checkOutDate =
          relativeAddDays(
            relativeToday,
            1
          );

        relativeSetDateRange(
          checkInDate,
          checkOutDate
        );

      } else {

        // Wenn Freitag:
        // heute starten.

        if (relativeDaysUntilFriday === 0) {
          relativeDaysUntilFriday = 0;
        }

        // Sonntag:
        // Das laufende Wochenende ist praktisch vorbei.
        // Deshalb kommenden Freitag nehmen.

        if (currentWeekday === 0) {
          relativeDaysUntilFriday = 5;
        }

        const checkInDate =
          relativeAddDays(
            relativeToday,
            relativeDaysUntilFriday
          );

        const checkOutDate =
          relativeAddDays(
            checkInDate,
            2
          );

        relativeSetDateRange(
          checkInDate,
          checkOutDate
        );
      }
    }


    // -----------------------------------------------------
    // "nächstes Wochenende"
    // = nächster zukünftiger Freitag
    // -----------------------------------------------------

    if (
      relativeWeekendType === "nächstes" ||
      relativeWeekendType === "naechstes"
    ) {

      if (relativeDaysUntilFriday === 0) {
        relativeDaysUntilFriday = 7;
      }

      const checkInDate =
        relativeAddDays(
          relativeToday,
          relativeDaysUntilFriday
        );

      const checkOutDate =
        relativeAddDays(
          checkInDate,
          2
        );

      relativeSetDateRange(
        checkInDate,
        checkOutDate
      );
    }


    // -----------------------------------------------------
    // "übernächstes Wochenende"
    // -----------------------------------------------------

    if (
      relativeWeekendType === "übernächstes" ||
      relativeWeekendType === "uebernaechstes"
    ) {

      if (relativeDaysUntilFriday === 0) {
        relativeDaysUntilFriday = 7;
      }

      relativeDaysUntilFriday += 7;

      const checkInDate =
        relativeAddDays(
          relativeToday,
          relativeDaysUntilFriday
        );

      const checkOutDate =
        relativeAddDays(
          checkInDate,
          2
        );

      relativeSetDateRange(
        checkInDate,
        checkOutDate
      );
    }
  }
}


// =========================================================
// 3. NÄCHSTE / ÜBERNÄCHSTE WOCHE
//
// Montag → Montag
// = 7 Nächte
// =========================================================

if (!params.has("check_in")) {

  const relativeWeekMatch = normalizedText.match(
    /\b(naechste|nächste|kommende|uebernaechste|übernächste)\s+woche\b/i
  );

  if (relativeWeekMatch) {

    const relativeWeekType =
      relativeWeekMatch[1].toLowerCase();

    const currentWeekday =
      relativeToday.getDay();

    // Montag = 1
    let daysUntilNextMonday =
      (8 - currentWeekday) % 7;

    if (daysUntilNextMonday === 0) {
      daysUntilNextMonday = 7;
    }

    if (
      relativeWeekType === "übernächste" ||
      relativeWeekType === "uebernaechste"
    ) {
      daysUntilNextMonday += 7;
    }

    const checkInDate =
      relativeAddDays(
        relativeToday,
        daysUntilNextMonday
      );

    const checkOutDate =
      relativeAddDays(
        checkInDate,
        7
      );

    relativeSetDateRange(
      checkInDate,
      checkOutDate
    );
  }
}


// =========================================================
// 4. NÄCHSTER / ÜBERNÄCHSTER MONAT
// =========================================================

if (!params.has("check_in")) {

  const relativeMonthMatch =
    normalizedText.match(
      /\b(naechsten|nächsten|kommenden|uebernaechsten|übernächsten)\s+monat\b/i
    );

  if (relativeMonthMatch) {

    const relativeMonthType =
      relativeMonthMatch[1].toLowerCase();

    let monthsAhead = 1;

    if (
      relativeMonthType === "übernächsten" ||
      relativeMonthType === "uebernaechsten"
    ) {
      monthsAhead = 2;
    }

    const targetMonthDate =
      new Date(
        relativeToday.getFullYear(),
        relativeToday.getMonth() + monthsAhead,
        1
      );

    params.set(
      "month",
      (targetMonthDate.getMonth() + 1).toString()
    );

    params.set(
      "year",
      targetMonthDate
        .getFullYear()
        .toString()
    );
  }
}


// =========================================================
// 5. ANFANG / MITTE / ENDE NÄCHSTEN MONATS
//
// z. B.
// "Anfang nächsten Monats"
// "Mitte nächsten Monat"
// "Ende übernächsten Monats"
// =========================================================

if (!params.has("check_in")) {

  const relativeMonthPhaseMatch =
    normalizedText.match(
      /\b(anfang|mitte|ende)\s+(?:des\s+)?(naechsten|nächsten|kommenden|uebernaechsten|übernächsten)\s+monats?\b/i
    );

  if (relativeMonthPhaseMatch) {

    const phase =
      relativeMonthPhaseMatch[1].toLowerCase();

    const relativeMonthType =
      relativeMonthPhaseMatch[2].toLowerCase();

    let monthsAhead = 1;

    if (
      relativeMonthType === "übernächsten" ||
      relativeMonthType === "uebernaechsten"
    ) {
      monthsAhead = 2;
    }

    const targetMonthDate =
      new Date(
        relativeToday.getFullYear(),
        relativeToday.getMonth() + monthsAhead,
        1
      );

    params.set(
      "month",
      (
        targetMonthDate.getMonth() + 1
      ).toString()
    );

    params.set(
      "year",
      targetMonthDate
        .getFullYear()
        .toString()
    );

    params.set(
      "month_phase",
      phase
    );
  }
}


// =========================================================
// 6. "IN X TAGEN"
//
// Beispiele:
// "in 3 Tagen"
// "in drei Tagen"
// "in einer Woche" läuft NICHT hier hinein
// =========================================================

if (!params.has("check_in")) {

  const relativeDaysMatch =
    normalizedText.match(
      new RegExp(
        `\\bin\\s+(${durationNumberPattern})\\s+tagen?\\b`,
        "i"
      )
    );

  if (relativeDaysMatch) {

    const daysAhead =
      parseDurationNumber(
        relativeDaysMatch[1]
      );

    if (
      daysAhead > 0 &&
      daysAhead <= 365
    ) {

      const checkInDate =
        relativeAddDays(
          relativeToday,
          daysAhead
        );

      relativeSetCheckIn(
        checkInDate
      );

      // "in drei Tagen" beschreibt den Beginn,
      // nicht eine Reisedauer.
      params.delete("duration_days");
    }
  }
}


// =========================================================
// 7. "IN X WOCHEN"
//
// Beispiele:
// "in zwei Wochen"
// "in 3 Wochen"
//
// ACHTUNG:
// "für zwei Wochen" bleibt weiterhin eine Reisedauer.
// =========================================================

if (!params.has("check_in")) {

  const relativeWeeksMatch =
    normalizedText.match(
      new RegExp(
        `\\bin\\s+(${durationNumberPattern})\\s+wochen?\\b`,
        "i"
      )
    );

  if (relativeWeeksMatch) {

    const weeksAhead =
      parseDurationNumber(
        relativeWeeksMatch[1]
      );

    if (
      weeksAhead > 0 &&
      weeksAhead <= 52
    ) {

      const checkInDate =
        relativeAddDays(
          relativeToday,
          weeksAhead * 7
        );

      relativeSetCheckIn(
        checkInDate
      );

      // "in zwei Wochen" = Reisebeginn,
      // nicht automatisch 14 Nächte.
      params.delete("duration_days");
      params.delete("nights");
    }
  }
}


// =========================================================
// 8. NÄCHSTER WOCHENTAG
//
// Beispiele:
// "nächsten Montag"
// "kommenden Freitag"
// "nächsten Samstag"
// =========================================================

if (!params.has("check_in")) {

  const relativeWeekdayMatch =
    normalizedText.match(
      /\b(?:naechsten|nächsten|kommenden)\s+(montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag)\b/i
    );

  if (relativeWeekdayMatch) {

    const weekdayMap: Record<string, number> = {
      sonntag: 0,
      montag: 1,
      dienstag: 2,
      mittwoch: 3,
      donnerstag: 4,
      freitag: 5,
      samstag: 6,
    };

    const targetWeekday =
      weekdayMap[
        relativeWeekdayMatch[1].toLowerCase()
      ];

    const currentWeekday =
      relativeToday.getDay();

    let daysAhead =
      (
        targetWeekday -
        currentWeekday +
        7
      ) % 7;

    // "nächsten Montag" soll immer
    // in der Zukunft liegen.
    if (daysAhead === 0) {
      daysAhead = 7;
    }

    const checkInDate =
      relativeAddDays(
        relativeToday,
        daysAhead
      );

    relativeSetCheckIn(
      checkInDate
    );
  }
}

// =========================================================
// FERIEN & FEIERTAGE – GESAMTBLOCK
//
// Erkennt u. a.:
// Weihnachten / Weihnachtszeit / Weihnachtsferien
// Silvester / Neujahr
// Ostern / Osterwochenende / Osterferien
// Pfingsten / Pfingstferien
// Christi Himmelfahrt / Himmelfahrt
// Fronleichnam
// Tag der Deutschen Einheit
// Sommerferien
// Herbstferien
// Winterferien
// Frühjahrsferien
//
// WICHTIG:
// Schulferien bekommen zunächst season/holiday-Parameter.
// Die exakten Termine werden später anhand von
// Land + Region/Bundesland + Jahr aufgelöst.
// =========================================================


// ---------------------------------------------------------
// Hilfsfunktion: Osterdatum nach gregorianischem Kalender
// ---------------------------------------------------------

const calculateEasterSunday = (year: number): Date => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);

  const h =
    (19 * a + b - d - g + 15) % 30;

  const i = Math.floor(c / 4);
  const k = c % 4;

  const l =
    (32 + 2 * e + 2 * i - h - k) % 7;

  const m =
    Math.floor((a + 11 * h + 22 * l) / 451);

  const month =
    Math.floor(
      (h + l - 7 * m + 114) / 31
    );

  const day =
    ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
};


// ---------------------------------------------------------
// Hilfsfunktion:
// nächstes sinnvolles Jahr für einen Feiertag bestimmen
// ---------------------------------------------------------

const getUpcomingHolidayYear = (
  month: number,
  day: number
) => {
  const now = new Date();

  let year = now.getFullYear();

  const candidate = new Date(
    year,
    month - 1,
    day
  );

  candidate.setHours(23, 59, 59, 999);

  if (candidate < now) {
    year += 1;
  }

  return year;
};


// =========================================================
// 1. WEIHNACHTEN
//
// Standard-Reisezeit:
// 23. Dezember → 27. Dezember
// =========================================================

if (!params.has("check_in")) {
  const christmasMatch = normalizedText.match(
    /\b(?:über|ueber|zu|an|um|für|fuer)?\s*(weihnachten|weihnachtstage|weihnachtszeit)\b/i
  );

  if (christmasMatch) {
    const year =
      getUpcomingHolidayYear(12, 24);

    const checkInDate =
      new Date(year, 11, 23);

    const checkOutDate =
      new Date(year, 11, 27);

    relativeSetDateRange(
      checkInDate,
      checkOutDate
    );

    params.set("holiday", "christmas");
  }
}


// =========================================================
// 2. SILVESTER / NEUJAHR
//
// Standard:
// 30. Dezember → 2. Januar
// =========================================================

if (!params.has("check_in")) {
  const newYearMatch = normalizedText.match(
    /\b(?:über|ueber|zu|an|um|für|fuer)?\s*(silvester|neujahr|jahreswechsel)\b/i
  );

  if (newYearMatch) {
    const year =
      getUpcomingHolidayYear(12, 31);

    const checkInDate =
      new Date(year, 11, 30);

    const checkOutDate =
      new Date(year + 1, 0, 2);

    relativeSetDateRange(
      checkInDate,
      checkOutDate
    );

    params.set("holiday", "new_year");
  }
}


// =========================================================
// 3. OSTERN / OSTERWOCHENENDE
//
// Karfreitag → Ostermontag
// Check-out Dienstag
// = 4 Nächte
// =========================================================

if (!params.has("check_in")) {
  const easterMatch = normalizedText.match(
    /\b(?:über|ueber|zu|an|für|fuer)?\s*(ostern|osterwochenende|ostertage)\b/i
  );

  if (easterMatch) {
    const now = new Date();

    let year = now.getFullYear();

    let easterSunday =
      calculateEasterSunday(year);

    // Dienstag nach Ostern als Ende des Reisezeitraums
    let easterEnd =
      relativeAddDays(easterSunday, 2);

    if (easterEnd < relativeToday) {
      year += 1;

      easterSunday =
        calculateEasterSunday(year);
    }

    // Karfreitag
    const checkInDate =
      relativeAddDays(
        easterSunday,
        -2
      );

    // Dienstag nach Ostermontag
    const checkOutDate =
      relativeAddDays(
        easterSunday,
        2
      );

    relativeSetDateRange(
      checkInDate,
      checkOutDate
    );

    params.set("holiday", "easter");
  }
}


// =========================================================
// 4. PFINGSTEN
//
// Pfingstsamstag → Dienstag
// = 3 Nächte
// =========================================================

if (!params.has("check_in")) {
  const pentecostMatch = normalizedText.match(
    /\b(?:über|ueber|zu|an|für|fuer)?\s*(pfingsten|pfingstwochenende|pfingsttage)\b/i
  );

  if (pentecostMatch) {
    const now = new Date();

    let year = now.getFullYear();

    let easterSunday =
      calculateEasterSunday(year);

    let pentecostSunday =
      relativeAddDays(
        easterSunday,
        49
      );

    if (
      relativeAddDays(
        pentecostSunday,
        2
      ) < relativeToday
    ) {
      year += 1;

      easterSunday =
        calculateEasterSunday(year);

      pentecostSunday =
        relativeAddDays(
          easterSunday,
          49
        );
    }

    // Samstag vor Pfingstsonntag
    const checkInDate =
      relativeAddDays(
        pentecostSunday,
        -1
      );

    // Dienstag nach Pfingstmontag
    const checkOutDate =
      relativeAddDays(
        pentecostSunday,
        2
      );

    relativeSetDateRange(
      checkInDate,
      checkOutDate
    );

    params.set("holiday", "pentecost");
  }
}


// =========================================================
// 5. CHRISTI HIMMELFAHRT
//
// Donnerstag → Sonntag
// = typisches langes Wochenende
// =========================================================

if (!params.has("check_in")) {
  const ascensionMatch = normalizedText.match(
    /\b(?:christi\s+)?himmelfahrt\b/i
  );

  if (ascensionMatch) {
    let year =
      relativeToday.getFullYear();

    let easterSunday =
      calculateEasterSunday(year);

    let ascension =
      relativeAddDays(
        easterSunday,
        39
      );

    if (ascension < relativeToday) {
      year += 1;

      easterSunday =
        calculateEasterSunday(year);

      ascension =
        relativeAddDays(
          easterSunday,
          39
        );
    }

    const checkInDate =
      new Date(ascension);

    const checkOutDate =
      relativeAddDays(
        ascension,
        3
      );

    relativeSetDateRange(
      checkInDate,
      checkOutDate
    );

    params.set(
      "holiday",
      "ascension"
    );
  }
}


// =========================================================
// 6. FRONLEICHNAM
//
// Donnerstag → Sonntag
// =========================================================

if (!params.has("check_in")) {
  const corpusChristiMatch =
    normalizedText.match(
      /\bfronleichnam\b/i
    );

  if (corpusChristiMatch) {
    let year =
      relativeToday.getFullYear();

    let easterSunday =
      calculateEasterSunday(year);

    let corpusChristi =
      relativeAddDays(
        easterSunday,
        60
      );

    if (corpusChristi < relativeToday) {
      year += 1;

      easterSunday =
        calculateEasterSunday(year);

      corpusChristi =
        relativeAddDays(
          easterSunday,
          60
        );
    }

    const checkInDate =
      new Date(corpusChristi);

    const checkOutDate =
      relativeAddDays(
        corpusChristi,
        3
      );

    relativeSetDateRange(
      checkInDate,
      checkOutDate
    );

    params.set(
      "holiday",
      "corpus_christi"
    );
  }
}


// =========================================================
// 7. TAG DER DEUTSCHEN EINHEIT
//
// 3. Oktober
// Hier setzen wir zunächst den Feiertag,
// aber erfinden keine Aufenthaltsdauer.
// =========================================================

if (!params.has("check_in")) {
  const unityDayMatch =
    normalizedText.match(
      /\b(?:tag\s+der\s+deutschen\s+einheit|deutsche[nr]?\s+einheit)\b/i
    );

  if (unityDayMatch) {
    const year =
      getUpcomingHolidayYear(10, 3);

    const holidayDate =
      new Date(year, 9, 3);

    relativeSetCheckIn(
      holidayDate
    );

    params.set(
      "holiday",
      "german_unity_day"
    );
  }
}


// =========================================================
// 8. SCHULFERIEN
//
// Noch KEINE erfundenen konkreten Daten.
//
// Später können wir anhand von:
// - Land
// - Bundesland / Region
// - Jahr
// die tatsächlichen Ferientermine bestimmen.
// =========================================================

const schoolHolidayTypes = [
  {
    key: "summer_holidays",
    aliases: [
      "sommerferien",
      "sommer ferien",
    ],
  },

  {
    key: "autumn_holidays",
    aliases: [
      "herbstferien",
      "herbst ferien",
    ],
  },

  {
    key: "winter_holidays",
    aliases: [
      "winterferien",
      "winter ferien",
    ],
  },

  {
    key: "easter_holidays",
    aliases: [
      "osterferien",
      "oster ferien",
    ],
  },

  {
    key: "christmas_holidays",
    aliases: [
      "weihnachtsferien",
      "weihnachts ferien",
    ],
  },

  {
    key: "pentecost_holidays",
    aliases: [
      "pfingstferien",
      "pfingst ferien",
    ],
  },

  {
    key: "spring_holidays",
    aliases: [
      "frühjahrsferien",
      "fruehjahrsferien",
      "frühlingsferien",
      "fruehlingsferien",
      "frühjahrs ferien",
      "fruehjahrs ferien",
    ],
  },
];


for (
  const schoolHoliday
  of schoolHolidayTypes
) {
  const matched =
    schoolHoliday.aliases.some(
      (alias) =>
        containsWholeTerm(
          normalizedText,
          alias
        )
    );

  if (matched) {
    params.set(
      "school_holiday",
      schoolHoliday.key
    );
  }
}

// =========================================================
// BEWERTUNG & QUALITÄT – GESAMTBLOCK
//
// Erkennt u. a.:
// "mindestens 4 Sterne"
// "4-Sterne-Hotel"
// "ab 8,5 Bewertung"
// "Bewertung mindestens 9"
// "sehr gut bewertet"
// "hervorragend bewertet"
// "luxuriös"
// "Luxushotel"
// "günstig"
// "preiswert"
// "gutes Preis-Leistungs-Verhältnis"
// =========================================================


// =========================================================
// 1. STERNE-KATEGORIE
//
// Beispiele:
// "mindestens 4 Sterne"
// "ab 4 Sterne"
// "4 Sterne"
// "4-Sterne-Hotel"
// =========================================================

const starRatingMatch = normalizedText.match(
  /\b(?:(mindestens|ab|minimum|min\.?)\s*)?([1-5])\s*(?:-| )?\s*sterne?\b/i
);

if (starRatingMatch) {
  const stars = Number(starRatingMatch[2]);

  if (stars >= 1 && stars <= 5) {
    const modifier =
      starRatingMatch[1]?.toLowerCase();

    if (modifier) {
      params.set(
        "min_stars",
        stars.toString()
      );
    } else {
      params.set(
        "stars",
        stars.toString()
      );
    }
  }
}


// =========================================================
// 2. BEWERTUNGSSCORE – MINDESTWERT
//
// Beispiele:
// "Bewertung ab 8,5"
// "mindestens 9 Punkte"
// "Score mindestens 8"
// "ab 8 bewertet"
// =========================================================

// ============================================================
// MINDESTBEWERTUNG
// Erkennt nur Zahlen, wenn ein echter Bewertungskontext
// unmittelbar vorhanden ist.
// Beispiele:
// "Bewertung ab 8,5"
// "Bewertung von mindestens 9"
// "Score mindestens 8"
// "Bewertung 8 oder besser"
// "mindestens 8 Punkte"
// "ab 8 bewertet"
// ============================================================
const minReviewScoreMatch = normalizedText.match(
  /(?:bewertung|score|bewertungsscore|gästebewertung|gaestebewertung)\s*(?:von\s*)?(?:mindestens|mind\.?|ab)?\s*(\d{1,2}(?:[.,]\d|\s+\d)?)|(?:mindestens|mind\.?|ab)\s*(\d{1,2}(?:[.,]\d|\s+\d)?)\s*(?:punkte?|bewertung)|(\d{1,2}(?:[.,]\d|\s+\d)?)\s*(?:punkte?)\s*(?:oder\s+besser)?/i
);

if (minReviewScoreMatch) {
  const rawReviewScore =
    minReviewScoreMatch[1] ??
    minReviewScoreMatch[2] ??
    minReviewScoreMatch[3];

  const normalizedReviewScore = rawReviewScore
    .trim()
    .replace(",", ".")
    .replace(/\s+/, ".");

  const reviewScore = Number(normalizedReviewScore);

  if (
    Number.isFinite(reviewScore) &&
    reviewScore >= 1 &&
    reviewScore <= 10
  ) {
    params.set(
      "min_review_score",
      reviewScore.toString()
    );
  }
}


// =========================================================
// 3. BEWERTUNGSSCORE – DIREKT
//
// Beispiele:
// "Bewertung 8,5"
// "Score 9"
// "8,7 Punkte"
//
// Wird nur genutzt, wenn noch kein Mindestwert gesetzt wurde.
// =========================================================

if (!params.has("min_review_score")) {
  const directReviewScoreMatch = normalizedText.match(
    /\b(?:bewertung|score|bewertungsscore|gäste?bewertung|gaeste?bewertung)?\s*(\d{1,2}(?:[.,]\d)?)\s*(?:punkte?|von\s*10)\b/i
  );

  if (directReviewScoreMatch) {
    const reviewScore = Number(
      directReviewScoreMatch[1].replace(",", ".")
    );

    if (
      reviewScore >= 1 &&
      reviewScore <= 10
    ) {
      params.set(
        "min_review_score",
        reviewScore.toString()
      );
    }
  }
}


// =========================================================
// 4. VERBALE BEWERTUNGSWÜNSCHE
//
// Diese sind Ranking-Wünsche,
// keine harten Filter.
// =========================================================

const reviewQualityPreferences = [
  {
    key: "excellent_reviews",
    aliases: [
      "hervorragend bewertet",
      "exzellent bewertet",
      "außergewöhnlich bewertet",
      "aussergewöhnlich bewertet",
      "aussergewoehnlich bewertet",
      "top bewertet",
      "bestbewertet",
      "beste bewertungen",
      "sehr hohe bewertung",
    ],
  },

  {
    key: "very_good_reviews",
    aliases: [
      "sehr gut bewertet",
      "sehr gut bewertetes hotel",
      "sehr gut bewertete unterkunft",
      "sehr gut bewertete hotels",
      "sehr gut bewertete unterkünfte",
      "sehr gute bewertungen",
      "gut bewertet",
      "gut bewertetes hotel",
      "gut bewertete unterkunft",
      "gute bewertungen",
      "gästefavorit",
      "gaestefavorit",
      "beliebt bei gästen",
      "beliebt bei gaesten",
    ],
  },
];

for (
  const reviewPreference
  of reviewQualityPreferences
) {
  const matched =
    reviewPreference.aliases.some(
      (alias) =>
        containsWholeTerm(
          normalizedText,
          alias
        )
    );

  if (matched) {
    params.append(
      "quality_preference",
      reviewPreference.key
    );
  }
}


// =========================================================
// 5. LUXUS / GEHOBENER STANDARD
// =========================================================

const luxuryAliases = [
  "luxus",
  "luxuriös",
  "luxurioes",
  "luxushotel",
  "luxus hotel",
  "luxusunterkunft",
  "gehoben",
  "gehobener standard",
  "hochwertig",
  "premium",
  "exklusiv",
  "exklusive unterkunft",
  "high end",
];

const luxuryMatched =
  luxuryAliases.some(
    (alias) =>
      containsWholeTerm(
        normalizedText,
        alias
      )
  );

if (luxuryMatched) {
  params.append(
    "quality_preference",
    "luxury"
  );
}


// =========================================================
// 6. GÜNSTIG / PREISWERT
//
// Ranking-Wunsch.
// Budgetfilter bleiben davon unabhängig.
// =========================================================

const budgetQualityAliases = [
  "günstig",
  "guenstig",
  "preiswert",
  "billig",
  "erschwinglich",
  "bezahlbar",
  "budgetfreundlich",
  "budget freundlich",
  "low budget",
];

const budgetQualityMatched =
  budgetQualityAliases.some(
    (alias) =>
      containsWholeTerm(
        normalizedText,
        alias
      )
  );

if (budgetQualityMatched) {
  params.append(
    "quality_preference",
    "budget"
  );
}


// =========================================================
// 7. PREIS-LEISTUNG
// =========================================================

const valueForMoneyAliases = [
  "gutes preis leistungs verhältnis",
  "gutes preis leistungsverhältnis",
  "gutes preis-leistungs-verhältnis",
  "gute preis leistung",
  "gute preis-leistung",
  "bestes preis leistungs verhältnis",
  "bestes preis-leistungs-verhältnis",
  "gutes preisleistungsverhältnis",
  "gute preisleistung",
  "value for money",
];

const valueForMoneyMatched =
  valueForMoneyAliases.some(
    (alias) =>
      containsWholeTerm(
        normalizedText,
        alias
      )
  );

if (valueForMoneyMatched) {
  params.append(
    "quality_preference",
    "value_for_money"
  );
}


// =========================================================
// 8. RUHIG / BESONDERS / CHARME
//
// Ebenfalls Ranking-Wünsche.
// =========================================================

const specialQualityPreferences = [
  {
    key: "quiet",
    aliases: [
      "ruhig",
      "ruhige unterkunft",
      "ruhige lage",
      "abgelegen",
      "abseits vom trubel",
    ],
  },

  {
    key: "romantic",
    aliases: [
      "romantisch",
      "romantische unterkunft",
      "für paare",
      "fuer paare",
      "romantikurlaub",
    ],
  },

  {
    key: "boutique",
    aliases: [
      "boutique",
      "boutique hotel",
      "boutiquehotel",
      "individuell",
      "kleines feines hotel",
    ],
  },

  {
    key: "authentic",
    aliases: [
      "authentisch",
      "landestypisch",
      "typisch regional",
      "traditionell",
    ],
  },

  {
    key: "modern",
    aliases: [
      "modern",
      "stylisch",
      "design hotel",
      "designhotel",
      "zeitgemäß",
      "zeitgemaess",
    ],
  },
];

for (
  const preference
  of specialQualityPreferences
) {
  const matched =
    preference.aliases.some(
      (alias) =>
        containsWholeTerm(
          normalizedText,
          alias
        )
    );

  if (matched) {
    params.append(
      "quality_preference",
      preference.key
    );
  }
}

// =========================================================
// LAGE & UMGEBUNG – GESAMTBLOCK
//
// Erkennt u. a.:
// "direkt am Strand"
// "nah am Meer"
// "Meerblick"
// "am See"
// "in den Bergen"
// "an der Skipiste"
// "im Stadtzentrum"
// "in der Altstadt"
// "ruhige Lage"
// "ländlich"
// "nahe Flughafen"
// "nahe Bahnhof"
// "200 m vom Strand"
// "maximal 1 km zum Zentrum"
// =========================================================


// =========================================================
// 1. HARTE LAGE-FEATURES
// =========================================================

const locationFeatureGroups = [
  {
    key: "beachfront",
    aliases: [
      "direkt am strand",
      "strandlage",
      "strand direkt",
      "am strand",
      "direkte strandlage",
    ],
  },

  {
    key: "near_beach",
    aliases: [
      "strandnah",
      "nah am strand",
      "nähe strand",
      "naehe strand",
      "in strandnähe",
      "in strandnaehe",
    ],
  },

  {
    key: "near_sea",
    aliases: [
      "nah am meer",
      "meernähe",
      "meernaehe",
      "in meeresnähe",
      "in meeresnaehe",
      "am meer",
      "küste",
      "kueste",
      "küstenlage",
      "kuestenlage",
    ],
  },

  {
    key: "sea_view",
    aliases: [
      "meerblick",
      "blick aufs meer",
      "blick auf das meer",
      "meersicht",
      "ocean view",
      "seaview",
    ],
  },

  {
    key: "near_lake",
    aliases: [
      "am see",
      "nah am see",
      "seenähe",
      "seenaehe",
      "in seenähe",
      "in seenaehe",
    ],
  },

  {
    key: "lake_view",
    aliases: [
      "seeblick",
      "blick auf den see",
      "blick zum see",
    ],
  },

  {
    key: "mountain_location",
    aliases: [
      "in den bergen",
      "bergregion",
      "berggebiet",
      "bergurlaub",
      "alpenlage",
    ],
  },

  {
    key: "mountain_view",
    aliases: [
      "bergblick",
      "blick auf die berge",
      "panoramablick auf die berge",
    ],
  },

  {
    key: "ski_in_ski_out",
    aliases: [
      "direkt an der skipiste",
      "an der skipiste",
      "ski in ski out",
      "ski-in ski-out",
      "pistennah",
    ],
  },

  {
    key: "city_center",
    aliases: [
      "im stadtzentrum",
      "im zentrum",
      "zentral gelegen",
      "zentrale lage",
      "innenstadt",
      "downtown",
    ],
  },

  {
    key: "old_town",
    aliases: [
      "in der altstadt",
      "altstadtlage",
      "historisches zentrum",
      "historische altstadt",
    ],
  },

  {
    key: "rural",
    aliases: [
      "ländlich",
      "laendlich",
      "auf dem land",
      "landlage",
      "ländliche lage",
      "laendliche lage",
      "abgelegen auf dem land",
    ],
  },

  {
    key: "nature",
    aliases: [
      "in der natur",
      "naturnah",
      "naturverbunden",
      "mitten in der natur",
      "naturgebiet",
    ],
  },

  {
    key: "near_airport",
    aliases: [
      "nahe flughafen",
      "nah am flughafen",
      "in flughafennähe",
      "in flughafennaehe",
      "flughafennah",
    ],
  },

  {
    key: "near_train_station",
    aliases: [
      "nahe bahnhof",
      "nah am bahnhof",
      "in bahnhofsnähe",
      "in bahnhofsnaehe",
      "bahnhofsnah",
    ],
  },

  {
    key: "near_attractions",
    aliases: [
      "nahe sehenswürdigkeiten",
      "nahe sehenswuerdigkeiten",
      "bei sehenswürdigkeiten",
      "bei sehenswuerdigkeiten",
      "zentral zu sehenswürdigkeiten",
      "zentral zu sehenswuerdigkeiten",
    ],
  },
];

for (const locationFeature of locationFeatureGroups) {
  const matched = locationFeature.aliases.some((alias) =>
    containsWholeTerm(normalizedText, alias)
  );

  if (matched) {
    params.append(
      "location_feature",
      locationFeature.key
    );
  }
}


// =========================================================
// 2. LAGE-RANKING-WÜNSCHE
//
// Keine harten Filter, sondern Präferenzen.
// =========================================================

const locationPreferences = [
  {
    key: "quiet_location",
    aliases: [
  "ruhig",
  "ruhige",
  "ruhiger",
  "ruhiges",
  "ruhigen",
  "ruhige lage",
  "ruhig gelegen",
  "sehr ruhig",
  "abseits vom trubel",
  "wenig verkehr",
],
  },

  {
    key: "central_location",
    aliases: [
      "zentral",
      "sehr zentral",
      "zentral gelegen",
      "gute zentrale lage",
    ],
  },

  {
    key: "scenic_location",
    aliases: [
      "schöne lage",
      "schoene lage",
      "traumhafte lage",
      "tolle aussicht",
      "panoramalage",
      "aussichtsreich",
    ],
  },

  {
    key: "remote_location",
    aliases: [
      "abgelegen",
      "einsam",
      "abgeschieden",
      "weit weg vom trubel",
    ],
  },
];

for (const locationPreference of locationPreferences) {
  const matched = locationPreference.aliases.some((alias) =>
    containsWholeTerm(normalizedText, alias)
  );

  if (matched) {
    params.append(
      "location_preference",
      locationPreference.key
    );
  }
}


// =========================================================
// 3. KONKRETE ENTFERNUNGEN
//
// Beispiele:
// "200 m vom Strand"
// "500 Meter zum Zentrum"
// "1 km vom Bahnhof"
// "maximal 2 km zum Meer"
// =========================================================

const distanceMatch = normalizedText.match(
  /\b(?:(maximal|max\.?|höchstens|hoechstens|bis)\s*)?(\d+(?:[.,]\d+)?)\s*(m|meter|km|kilometer)\s*(?:vom|von|zum|zur|bis zum|bis zur)\s*(strand|meer|see|zentrum|stadtzentrum|altstadt|flughafen|bahnhof|skipiste|sehenswürdigkeiten|sehenswuerdigkeiten)\b/i
);

if (distanceMatch) {
  const value = Number(
    distanceMatch[2].replace(",", ".")
  );

  const unit = distanceMatch[3].toLowerCase();
  const targetRaw = distanceMatch[4].toLowerCase();

  if (value > 0) {
    let distanceMeters = value;

    if (
      unit === "km" ||
      unit === "kilometer"
    ) {
      distanceMeters = value * 1000;
    }

    const distanceTargetMap: Record<string, string> = {
      strand: "beach",
      meer: "sea",
      see: "lake",
      zentrum: "city_center",
      stadtzentrum: "city_center",
      altstadt: "old_town",
      flughafen: "airport",
      bahnhof: "train_station",
      skipiste: "ski_slope",
      sehenswürdigkeiten: "attractions",
      sehenswuerdigkeiten: "attractions",
    };

    const target =
      distanceTargetMap[targetRaw];

    if (target) {
      params.set(
        `max_distance_${target}_m`,
        Math.round(distanceMeters).toString()
      );
    }
  }
}


// =========================================================
// 4. "DIREKT" = SEHR KURZE DISTANZ
//
// Falls jemand z. B. "direkt am Meer" sagt,
// setzen wir zusätzlich eine kleine Distanz.
// =========================================================

if (
  containsWholeTerm(
    normalizedText,
    "direkt am meer"
  )
) {
  params.set(
    "max_distance_sea_m",
    "100"
  );
}

if (
  containsWholeTerm(
    normalizedText,
    "direkt am strand"
  )
) {
  params.set(
    "max_distance_beach_m",
    "100"
  );
}

if (
  containsWholeTerm(
    normalizedText,
    "direkt an der skipiste"
  )
) {
  params.set(
    "max_distance_ski_slope_m",
    "100"
  );
}

// =========================================================
// BUDGET / PREIS – GESAMTBLOCK
//
// Erkennt u. a.:
// "bis 120 Euro pro Nacht"
// "maximal 800 Euro"
// "unter 1000 Euro"
// "zwischen 500 und 900 Euro"
// "von 80 bis 120 Euro pro Nacht"
// "ungefähr 700 Euro"
// "ca. 150 Euro die Nacht"
// "Budget 1200 Euro"
// "nicht mehr als 100 Euro pro Nacht"
// =========================================================


// ---------------------------------------------------------
// Hilfsfunktionen
// ---------------------------------------------------------

const parseMoneyValue = (value: string): number => {
  const normalized = value
    .replace(/\./g, "")
    .replace(/,/g, ".")
    .trim();

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
};


const moneyPattern =
  "(\\d{1,3}(?:\\.\\d{3})*(?:,\\d{1,2})?|\\d+(?:,\\d{1,2})?)";


const perNightPattern =
  "(?:pro\\s+nacht|je\\s+nacht|die\\s+nacht|je\\s+übernachtung|pro\\s+übernachtung|pro\\s+uebernachtung)";


// =========================================================
// 1. PREISBEREICH PRO NACHT
//
// "zwischen 80 und 120 Euro pro Nacht"
// "von 80 bis 120 Euro je Nacht"
// =========================================================

const nightlyRangeMatch = normalizedText.match(
  new RegExp(
    `\\b(?:zwischen\\s+|von\\s+)?${moneyPattern}\\s*(?:€|euro)?\\s*(?:und|bis|-)\\s*${moneyPattern}\\s*(?:€|euro)?\\s*${perNightPattern}\\b`,
    "i"
  )
);

if (nightlyRangeMatch) {
  const minNightly =
    parseMoneyValue(nightlyRangeMatch[1]);

  const maxNightly =
    parseMoneyValue(nightlyRangeMatch[2]);

  if (minNightly > 0) {
    params.set(
      "min_price_per_night",
      minNightly.toString()
    );
  }

  if (maxNightly > 0) {
    params.set(
      "max_price_per_night",
      maxNightly.toString()
    );
  }
}


// =========================================================
// 2. GESAMTPREIS-BEREICH
//
// "zwischen 500 und 900 Euro"
// "von 1000 bis 1500 Euro"
// =========================================================

if (
  !params.has("min_price_per_night") &&
  !params.has("max_price_per_night")
) {
  const totalRangeMatch = normalizedText.match(
    new RegExp(
      `\\b(?:zwischen\\s+|von\\s+)?${moneyPattern}\\s*(?:€|euro)?\\s*(?:und|bis|-)\\s*${moneyPattern}\\s*(?:€|euro)\\b`,
      "i"
    )
  );

  if (totalRangeMatch) {
    const minTotal =
      parseMoneyValue(totalRangeMatch[1]);

    const maxTotal =
      parseMoneyValue(totalRangeMatch[2]);

    if (minTotal > 0) {
      params.set(
        "min_total_price",
        minTotal.toString()
      );
    }

    if (maxTotal > 0) {
      params.set(
        "max_total_price",
        maxTotal.toString()
      );
    }
  }
}


// =========================================================
// 3. MAXIMALER PREIS PRO NACHT
//
// "bis 120 Euro pro Nacht"
// "maximal 150 Euro die Nacht"
// "unter 100 Euro pro Nacht"
// "nicht mehr als 90 Euro je Nacht"
// =========================================================

if (!params.has("max_price_per_night")) {
  const maxNightlyMatch = normalizedText.match(
    new RegExp(
      `\\b(?:bis|maximal|max\\.?|höchstens|hoechstens|unter|weniger\\s+als|nicht\\s+mehr\\s+als)\\s*${moneyPattern}\\s*(?:€|euro)\\s*${perNightPattern}\\b`,
      "i"
    )
  );

  if (maxNightlyMatch) {
    const value =
      parseMoneyValue(maxNightlyMatch[1]);

    if (value > 0) {
      params.set(
        "max_price_per_night",
        value.toString()
      );
    }
  }
}


// =========================================================
// 4. MINDESTPREIS PRO NACHT
//
// "ab 80 Euro pro Nacht"
// "mindestens 100 Euro je Nacht"
// =========================================================

if (!params.has("min_price_per_night")) {
  const minNightlyMatch = normalizedText.match(
    new RegExp(
      `\\b(?:ab|mindestens|min\\.?)\\s*${moneyPattern}\\s*(?:€|euro)\\s*${perNightPattern}\\b`,
      "i"
    )
  );

  if (minNightlyMatch) {
    const value =
      parseMoneyValue(minNightlyMatch[1]);

    if (value > 0) {
      params.set(
        "min_price_per_night",
        value.toString()
      );
    }
  }
}

// =========================================================
// 7. UNGEFÄHRES GESAMTBUDGET
//
// "ca. 1200 Euro"
// "ungefähr 800 Euro"
// =========================================================

if (
  !params.has("min_total_price") &&
  !params.has("max_total_price") &&
  !params.has("min_price_per_night") &&
  !params.has("max_price_per_night")
) {
const approxTotalMatch = text.match(
  /(?:ca\.?|circa|ungefähr|ungefaehr|etwa|rund)\s*(\d+(?:[.,]\d{1,2})?)\s*(?:€|euro)/i
);

  if (approxTotalMatch) {
    const value =
      parseMoneyValue(
        approxTotalMatch[1]
      );

    if (value > 0) {
      const tolerance = 0.15;

      const minValue = Math.round(
        value * (1 - tolerance)
      );

      const maxValue = Math.round(
        value * (1 + tolerance)
      );

      params.set(
        "min_total_price",
        minValue.toString()
      );

      params.set(
        "max_total_price",
        maxValue.toString()
      );

      params.set(
        "price_approximate",
        "true"
      );
    }
  }
}

// =========================================================
// 5. MAXIMALES GESAMTBUDGET
//
// "maximal 1200 Euro"
// "bis 1500 Euro"
// "unter 1000 Euro"
// "Budget bis 2000 Euro"
// =========================================================

if (
  !params.has("max_total_price") &&
  !params.has("max_price_per_night") &&
  !/\b(?:ca\.?|circa|ungefähr|ungefaehr|etwa|rund)\b/i.test(normalizedText)
) {
  const maxTotalMatch = normalizedText.match(
    new RegExp(
      `\\b(?:budget\\s*(?:von|bis)?\\s*)?(?:bis|maximal|max\\.?|höchstens|hoechstens|unter|weniger\\s+als|nicht\\s+mehr\\s+als)?\\s*${moneyPattern}\\s*(?:€|euro)\\b`,
      "i"
    )
  );

  if (maxTotalMatch) {
    const value =
      parseMoneyValue(maxTotalMatch[1]);

    if (value > 0) {
      params.set(
        "max_total_price",
        value.toString()
      );
    }
  }
}


// =========================================================
// 6. UNGEFÄHRER PREIS PRO NACHT
//
// "ca. 120 Euro pro Nacht"
// "ungefähr 150 Euro die Nacht"
// =========================================================

if (
  !params.has("min_price_per_night") &&
  !params.has("max_price_per_night")
) {
  const approxNightlyMatch =
    normalizedText.match(
      new RegExp(
        `\\b(?:ca\\.?|circa|ungefähr|ungefaehr|etwa|rund)\\s*${moneyPattern}\\s*(?:€|euro)\\s*${perNightPattern}\\b`,
        "i"
      )
    );

  if (approxNightlyMatch) {
    const value =
      parseMoneyValue(
        approxNightlyMatch[1]
      );

    if (value > 0) {
      const tolerance = 0.15;

      const minValue = Math.round(
        value * (1 - tolerance)
      );

      const maxValue = Math.round(
        value * (1 + tolerance)
      );

      params.set(
        "min_price_per_night",
        minValue.toString()
      );

      params.set(
        "max_price_per_night",
        maxValue.toString()
      );

      params.set(
        "price_approximate",
        "true"
      );
    }
  }
}


// =========================================================
// 8. DIREKTER PREIS PRO NACHT
//
// "120 Euro pro Nacht"
// "150 Euro die Nacht"
//
// Ohne "bis", "ab", "ca." usw.
// =========================================================

if (
  !params.has("min_price_per_night") &&
  !params.has("max_price_per_night")
) {
  const directNightlyMatch =
    normalizedText.match(
      new RegExp(
        `\\b${moneyPattern}\\s*(?:€|euro)\\s*${perNightPattern}\\b`,
        "i"
      )
    );

  if (directNightlyMatch) {
    const value =
      parseMoneyValue(
        directNightlyMatch[1]
      );

    if (value > 0) {
      params.set(
        "max_price_per_night",
        value.toString()
      );
    }
  }
}


// =========================================================
// 9. GESAMTBUDGET + NÄCHTE
//
// Wenn ein Gesamtbudget UND nights bekannt sind,
// berechnen wir zusätzlich einen maximalen Preis pro Nacht.
//
// Beispiel:
// 700 Euro für 7 Nächte
// => max_total_price=700
// => max_price_per_night=100
// =========================================================

if (
  params.has("max_total_price") &&
  params.has("nights") &&
  !params.has("max_price_per_night")
) {
  const totalBudget =
    Number(
      params.get("max_total_price")
    );

  const nights =
    Number(
      params.get("nights")
    );

  if (
    totalBudget > 0 &&
    nights > 0
  ) {
    const calculatedNightlyBudget =
      Math.floor(
        totalBudget / nights
      );

    if (calculatedNightlyBudget > 0) {
      params.set(
        "max_price_per_night",
        calculatedNightlyBudget.toString()
      );
    }
  }
}


for (const [monthName, monthNumber] of Object.entries(monthMap)) {
  if (text.includes(monthName)) {
    params.set("month", monthNumber.toString());
    break;
  }
}

    if (text.includes("hotel")) {
      params.set("type", "hotel");
    }

    if (
      text.includes("ferienwohnung") ||
      text.includes("apartment") ||
      text.includes("wohnung")
    ) {
      params.set("type", "holiday_apartment");
    }

    if (
      text.includes("camping") ||
      text.includes("campingplatz") ||
      text.includes("wohnmobil")
    ) {
      params.set("type", "campsite");
    }

    if (
  text.includes("meer") ||
  text.includes("strand") ||
  text.includes("küste") ||
  text.includes("kueste")
) {
  params.append("feature", "near_sea");
}

    if (
  text.includes("see") ||
  text.includes("seeufer")
) {
  params.append("feature", "near_lake");
}

    if (
  text.includes("berg") ||
  text.includes("berge") ||
  text.includes("gebirge") ||
  text.includes("alpen")
) {
  params.append("feature", "near_mountains");
}

    if (
  text.includes("hund") ||
  text.includes("hunde") ||
  text.includes("haustier") ||
  text.includes("haustiere")
) {
  params.append("feature", "dogs_allowed");
}

const wantsPrivatePool =
  text.includes("privater pool") ||
  text.includes("privatem pool") ||
  text.includes("privaten pool") ||
  text.includes("eigener pool") ||
  text.includes("eigenem pool") ||
  text.includes("eigenen pool");

if (
  !wantsPrivatePool &&
  (text.includes("pool") || text.includes("schwimmbad"))
) {
  params.append("feature", "pool");
}


if (
  text.includes("wlan") ||
  text.includes("wifi") ||
  text.includes("internet")
) {
  params.append("feature", "wifi");
}

if (
  text.includes("parkplatz") ||
  text.includes("parken")
) {
  params.append("feature", "parking");
}

if (text.includes("kostenloser parkplatz")) {
  params.append("feature", "free_parking");
}

if (text.includes("garage")) {
  params.append("feature", "garage");
}

if (
  text.includes("klimaanlage") ||
  text.includes("klimatisiert") ||
  text.includes("air conditioning")
) {
  params.append("feature", "air_conditioning");
}
if (text.includes("balkon")) {
  params.append("feature", "balcony");
}

if (text.includes("terrasse")) {
  params.append("feature", "terrace");
}

if (text.includes("garten")) {
  params.append("feature", "garden");
}

if (
  text.includes("küche") ||
  text.includes("kueche")
) {
  params.append("feature", "kitchen");
}

if (
  text.includes("küchenzeile") ||
  text.includes("kuechenzeile") ||
  text.includes("kochnische")
) {
  params.append("feature", "kitchenette");
}

if (
  text.includes("waschmaschine") ||
  text.includes("wäsche waschen")
) {
  params.append("feature", "washing_machine");
}

if (
  text.includes("geschirrspüler") ||
  text.includes("geschirrspueler") ||
  text.includes("spülmaschine") ||
  text.includes("spuelmaschine")
) {
  params.append("feature", "dishwasher");
}

if (
  text.includes("kühlschrank") ||
  text.includes("kuehlschrank")
) {
  params.append("feature", "fridge");
}

if (text.includes("mikrowelle")) {
  params.append("feature", "microwave");
}

if (
  text.includes("grill") ||
  text.includes("grillen")
) {
  params.append("feature", "bbq");
}

if (
  /\bfernseher\b/i.test(text) ||
  /\bfernsehen\b/i.test(text) ||
  /\bfernsehgerät\b/i.test(text) ||
  /\bfernsehgeraet\b/i.test(text) ||
  /\btv\b/i.test(text) ||
  /\bsmart[\s-]?tv\b/i.test(text) ||
  /\bflachbild[\s-]?tv\b/i.test(text) ||
  /\bsat[\s-]?tv\b/i.test(text) ||
  /\bkabel[\s-]?tv\b/i.test(text)
) {
  params.append("feature", "tv");
}

if (text.includes("kamin")) {
  params.append("feature", "fireplace");
}
if (text.includes("innenpool")) {
  params.append("feature", "indoor_pool");
}

if (
  text.includes("außenpool") ||
  text.includes("aussenpool")
) {
  params.append("feature", "outdoor_pool");
}

if (
  normalizedText.includes("privater pool") ||
  normalizedText.includes("privatem pool") ||
  normalizedText.includes("privaten pool") ||
  normalizedText.includes("eigener pool") ||
  normalizedText.includes("eigenem pool") ||
  normalizedText.includes("eigenen pool")
) {
  params.append("feature", "private_pool");
}

if (
  text.includes("whirlpool") ||
  text.includes("hot tub") ||
  text.includes("jacuzzi")
) {
  params.append("feature", "hot_tub");
}

if (text.includes("sauna")) {
  params.append("feature", "sauna");
}

if (
  containsWholeTerm(text, "spa") ||
  text.includes("wellness")
) {
  params.append("feature", "spa");
}

if (text.includes("massage")) {
  params.append("feature", "massage");
}

if (
  text.includes("fitnessstudio") ||
  text.includes("fitnessraum") ||
  containsWholeTerm(text, "gym")
) {
  params.append("feature", "gym");
}
// Familie & Kinder
if (
  text.includes("familienfreundlich") ||
  text.includes("für familien") ||
  text.includes("fuer familien")
) {
  params.append("feature", "family_friendly");
}

if (text.includes("familienzimmer")) {
  params.append("feature", "family_rooms");
}

if (
  text.includes("kinder erlaubt") ||
  text.includes("mit kind") ||
  text.includes("mit kindern")
) {
  params.append("feature", "kids_allowed");
}

if (
  text.includes("spielplatz") ||
  text.includes("kinderspielplatz")
) {
  params.append("feature", "playground");
}

if (
  text.includes("spielzimmer") ||
  text.includes("kinderzimmer")
) {
  params.append("feature", "games_room");
}

if (
  text.includes("babysitting") ||
  text.includes("kinderbetreuung")
) {
  params.append("feature", "babysitting");
}

if (text.includes("hochstuhl")) {
  params.append("feature", "high_chair");
}

// Haustiere
if (
  text.includes("haustier") ||
  text.includes("haustiere")
) {
  params.append("feature", "pets_allowed");
}

// Barrierefreiheit
if (
  text.includes("barrierefrei") ||
  text.includes("barrierefreiheit")
) {
  params.append("feature", "accessible");
}

if (
  text.includes("rollstuhl") ||
  text.includes("rollstuhlgerecht")
) {
  params.append("feature", "wheelchair_accessible");
}

if (
  text.includes("barrierefreies bad") ||
  text.includes("behindertengerechtes bad")
) {
  params.append("feature", "accessible_bathroom");
}

if (
  text.includes("haltegriff") ||
  text.includes("haltegriffe")
) {
  params.append("feature", "grab_rails");
}

if (
  text.includes("niedriges waschbecken") ||
  text.includes("unterfahrbares waschbecken")
) {
  params.append("feature", "low_sink");
}
// Aktivitäten & Urlaubstyp
if (
  text.includes("wandern") ||
  text.includes("wanderurlaub")
) {
  params.append("feature", "hiking");
}

if (
  text.includes("radfahren") ||
  text.includes("fahrrad") ||
  text.includes("radtour")
) {
  params.append("feature", "cycling");
}

if (
  text.includes("ski") ||
  text.includes("skifahren") ||
  text.includes("skiurlaub")
) {
  params.append("feature", "skiing");
}

if (
  text.includes("golf") ||
  text.includes("golfplatz")
) {
  params.append("feature", "golf");
}

if (
  text.includes("tennis") ||
  text.includes("tennisplatz")
) {
  params.append("feature", "tennis");
}

if (
  text.includes("angeln") ||
  text.includes("fischen")
) {
  params.append("feature", "fishing");
}

if (
  text.includes("tauchen") ||
  text.includes("tauchurlaub")
) {
  params.append("feature", "diving");
}

if (
  text.includes("schnorcheln") ||
  text.includes("schnorchel")
) {
  params.append("feature", "snorkeling");
}

if (
  text.includes("windsurfen") ||
  text.includes("windsurfing")
) {
  params.append("feature", "windsurfing");
}

if (
  text.includes("kanu") ||
  text.includes("kanufahren") ||
  text.includes("kajak")
) {
  params.append("feature", "canoeing");
}

if (
  text.includes("reiten") ||
  text.includes("reiturlaub") ||
  text.includes("pferde")
) {
  params.append("feature", "horse_riding");
}

if (
  text.includes("minigolf") ||
  text.includes("mini golf")
) {
  params.append("feature", "mini_golf");
}
// Service & Anreise
if (
  text.includes("24 stunden rezeption") ||
  text.includes("24-stunden-rezeption") ||
  text.includes("rund um die uhr rezeption")
) {
  params.append("feature", "reception_24h");
}

if (
  text.includes("flughafentransfer") ||
  text.includes("airport shuttle") ||
  text.includes("shuttle vom flughafen")
) {
  params.append("feature", "airport_shuttle");
}

if (
  text.includes("gepäckaufbewahrung") ||
  text.includes("gepaeckaufbewahrung") ||
  text.includes("koffer aufbewahren")
) {
  params.append("feature", "luggage_storage");
}

if (
  text.includes("autovermietung") ||
  text.includes("mietwagen")
) {
  params.append("feature", "car_rental");
}

if (
  text.includes("fahrradverleih") ||
  text.includes("fahrräder mieten") ||
  text.includes("fahrrad mieten")
) {
  params.append("feature", "bike_rental");
}

if (
  text.includes("wäscheservice") ||
  text.includes("waescheservice") ||
  text.includes("wäsche service")
) {
  params.append("feature", "laundry_service");
}
// Zimmerwünsche & Spezialwünsche
if (
  text.includes("nichtraucher") ||
  text.includes("rauchfrei")
) {
  params.append("feature", "non_smoking");
}

if (
  text.includes("schallisoliert") ||
  text.includes("ruhiges zimmer")
) {
  params.append("feature", "soundproof");
}

if (
  text.includes("allergikerfreundlich") ||
  text.includes("allergiker")
) {
  params.append("feature", "allergy_friendly");
}

if (
  text.includes("eigenes bad") ||
  text.includes("privates bad") ||
  text.includes("eigenes badezimmer")
) {
  params.append("feature", "private_bathroom");
}

if (text.includes("badewanne")) {
  params.append("feature", "bathtub");
}

if (text.includes("dusche")) {
  params.append("feature", "shower");
}

if (
  text.includes("zustellbett") ||
  text.includes("extra bett")
) {
  params.append("feature", "extra_bed");
}

if (
  text.includes("babybett") ||
  text.includes("kinderbett")
) {
  params.append("feature", "baby_cot");
}

if (
  text.includes("doppelbett") ||
  text.includes("double bed")
) {
  params.append("feature", "double_bed");
}

if (
  text.includes("separate schlafzimmer") ||
  text.includes("mehrere schlafzimmer")
) {
  params.append("feature", "separate_bedrooms");
}

if (
  text.includes("nur erwachsene") ||
  text.includes("adults only")
) {
  params.append("feature", "adults_only");
}

if (
  text.includes("raucherbereich") ||
  text.includes("rauchen erlaubt")
) {
  params.append("feature", "smoking_area");
}

if (
  text.includes("arbeiten") ||
  text.includes("homeoffice") ||
  text.includes("arbeitsplatz")
) {
  params.append("feature", "work_friendly");
}

if (
  text.includes("langzeitaufenthalt") ||
  text.includes("länger bleiben") ||
  text.includes("laenger bleiben")
) {
  params.append("feature", "long_stay");
}

if (
  text.includes("privater eingang") ||
  text.includes("eigener eingang")
) {
  params.append("feature", "private_entrance");
}

parsePreferences(normalizedText, params);

if (
  text.includes("self check-in") ||
  text.includes("self check in") ||
  text.includes("selbst einchecken")
) {
  params.append("feature", "self_check_in");
}

// ============================================================
// OPENAI-FALLBACK
// Nur verwenden, wenn der lokale Parser kaum etwas erkannt hat.
// Bereits vorhandene lokale Werte werden NICHT überschrieben.
// ============================================================

const meaningfulLocalParams = [
  "country",
  "region",
  "city",
  "type",
  "month",
  "nights",
  "max_guests",
  "max_price_per_night",
  "min_price_per_night",
  "min_review_score",
  "hotel_stars",
  "min_hotel_stars",
  "max_hotel_stars",
  "feature",
  "must_feature",
  "preferred_feature",
];

// ============================================================
// ENTSCHEIDEN, OB OPENAI HELFEN SOLL
// ============================================================

const recognizedLocalKeys =
  meaningfulLocalParams.filter((key) =>
    params.has(key)
  );

const recognizedLocalCount =
  recognizedLocalKeys.length;

// Einfache Suchanfragen brauchen keine KI.
// Bei längeren/freier formulierten Anfragen darf OpenAI
// ergänzend prüfen, wenn lokal nur wenig erkannt wurde.

const wordCount =
  normalizedText
    .split(/\s+/)
    .filter(Boolean)
    .length;

const isComplexQuery =
  wordCount >= 8;

const localParserUnderstoodLittle =
  recognizedLocalCount <= 1;

const shouldUseOpenAI =
  recognizedLocalCount === 0 ||
  (
    isComplexQuery &&
    localParserUnderstoodLittle
  );

console.log(
  "PARSER-STATUS:",
  {
    recognizedLocalKeys,
    recognizedLocalCount,
    wordCount,
    shouldUseOpenAI,
  }
);

if (shouldUseOpenAI) {
  try {
    console.log("OPENAI-FALLBACK WIRD VERWENDET");

    const aiResponse = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    });

    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      const criteria = aiData?.criteria;

      if (criteria) {
        const setIfMissing = (
  key: string,
  value: unknown
) => {
  // Leere KI-Werte ignorieren
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return;
  }

  // Lokaler Parser hat Vorrang
  if (params.has(key)) {
    console.log(
      `KI-WERT IGNORIERT (${key}):`,
      value,
      "Lokaler Wert:",
      params.getAll(key)
    );

    return;
  }

  params.set(
    key,
    String(value)
  );

  console.log(
    `KI-WERT ERGÄNZT (${key}):`,
    value
  );
};

        setIfMissing(
          "country",
          criteria.country
        );

        setIfMissing(
          "region",
          criteria.region
        );

        setIfMissing(
          "city",
          criteria.city
        );

        setIfMissing(
          "month",
          criteria.month
        );

        setIfMissing(
          "nights",
          criteria.nights
        );

        setIfMissing(
          "max_guests",
          criteria.guests
        );

        setIfMissing(
          "max_price_per_night",
          criteria.max_price_per_night
        );

        setIfMissing(
          "total_budget",
          criteria.total_budget
        );

        setIfMissing(
          "type",
          criteria.accommodation_type
        );

        // ============================================================
// OPENAI-FEATURES ABSICHERN
// Nur bekannte Feature-Keys übernehmen.
// ============================================================

const allowedAiFeatures = new Set([
  "near_sea",
  "near_beach",
  "beachfront",
  "near_lake",
  "near_mountains",
  "city_center",
  "quiet_place",
  "dogs_allowed",
  "pets_allowed",
  "family_friendly",
  "accessible",
  "wheelchair_accessible",

  "wifi",
  "parking",
  "free_parking",
  "garage",
  "air_conditioning",

  "balcony",
  "terrace",
  "garden",
  "kitchen",
  "washing_machine",

  "pool",
  "indoor_pool",
  "outdoor_pool",
  "private_pool",
  "hot_tub",
  "sauna",
  "spa",
  "gym",

  "breakfast",
  "breakfast_included",
  "half_board",
  "full_board",
  "all_inclusive",
  "ultra_all_inclusive",
  "self_catering",

  "restaurant",
  "bar",

  "hiking",
  "cycling",
  "skiing",
  "golf",
  "tennis",
  "diving",
  "snorkeling",
  "windsurfing",

  "non_smoking",
  "private_bathroom",
  "bathtub",
  "shower",
  "baby_cot",
  "self_check_in",
]);

if (Array.isArray(criteria.features)) {
  const existingFeatures =
    new Set(params.getAll("feature"));

  for (const rawFeature of criteria.features) {
    if (typeof rawFeature !== "string") {
      continue;
    }

    const feature =
      rawFeature.trim().toLowerCase();

    if (!allowedAiFeatures.has(feature)) {
      console.warn(
        "UNBEKANNTES KI-FEATURE IGNORIERT:",
        feature
      );

      continue;
    }

    if (existingFeatures.has(feature)) {
      continue;
    }

    params.append(
      "feature",
      feature
    );

    existingFeatures.add(feature);

    console.log(
      "KI-FEATURE ERGÄNZT:",
      feature
    );
  }
}

        console.log(
          "OPENAI-FALLBACK ERGEBNIS:",
          params.toString()
        );
      }
    } else {
      console.warn(
        "OpenAI-Fallback fehlgeschlagen:",
        aiResponse.status
      );
    }
  } catch (error) {
    console.error(
      "OpenAI-Fallback Fehler:",
      error
    );
  }
}

console.log("VOR CLEANUP:", params.toString());

cleanupSearchParams(params);

// Semantische Parser-Werte auf echte DB-Features abbilden
mapSearchParamsToDbFeatures(params);

// Sicherheitshalber nach dem Mapping noch einmal bereinigen
cleanupSearchParams(params);

// ============================================================
// MVP: NUR API-RELEVANTE SUCHPARAMETER WEITERGEBEN
// ============================================================

const allowedApiParams = new Set([
  // Ort
  "country",
  "region",
  "city",

  // Unterkunft
  "type",

  // Reisezeit
  "month",
  "nights",
  "check_in",
  "check_out",

  // Gäste
  "max_guests",

  // Preis
  "min_price",
  "max_price",
  "min_price_per_night",
  "max_price_per_night",
  "min_total_price",
  "max_total_price",
  "total_budget",

  // Qualität
  "min_review_score",
  "hotel_stars",
  "min_hotel_stars",
  "max_hotel_stars",

  // Unterkunftsdaten
  "min_bedrooms",
  "max_bedrooms",

  // Features
  "feature",
  "must_feature",
  "preferred_feature",

  // Bereits direkt DB-gestützte Eigenschaften
  "near_sea",
  "near_lake",
  "near_mountains",
  "dogs_allowed",
  "has_pool",
]);

for (const key of [...params.keys()]) {
  if (!allowedApiParams.has(key)) {
    console.log(
      "SEMANTISCHER PARAMETER NICHT AN API GESENDET:",
      key
    );

    params.delete(key);
  }
}

console.log("SUCHPARAMETER:", params.toString());

const response = await fetch(
  `/api/accommodations?${params.toString()}`
);

const data = await response.json();

if (!response.ok) {
  setMessage(
    data.error ?? "Bei der Suche ist ein Fehler aufgetreten."
  );
  setResults([]);
  setIsSearching(false);
  return;
}

setIsSearching(false);
setResults(data.accommodations ?? []);

setResults(data.accommodations ?? []);

setTimeout(() => {
  document
    .getElementById("ergebnisse")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
}, 200);

if ((data.accommodations ?? []).length === 0) {
  setMessage("Keine passende Unterkunft gefunden.");
} else {
  setMessage(`${data.accommodations.length} passende Unterkunft(en) gefunden.`);
}

    if ((data.accommodations ?? []).length === 0) {
      setMessage("Keine passende Unterkunft gefunden.");
    } else {
      setMessage(`${data.accommodations.length} passende Unterkunft(en) gefunden.`);
    }
  }

  const sortedResults = [...results].sort((a, b) => {
  if (sortOption === "price_asc") {
    const priceA =
      a.price_min !== null &&
      a.price_min !== undefined
        ? Number(a.price_min)
        : Number.POSITIVE_INFINITY;

    const priceB =
      b.price_min !== null &&
      b.price_min !== undefined
        ? Number(b.price_min)
        : Number.POSITIVE_INFINITY;

    return priceA - priceB;
  }

  if (sortOption === "price_desc") {
    const priceA =
      a.price_min !== null &&
      a.price_min !== undefined
        ? Number(a.price_min)
        : Number.NEGATIVE_INFINITY;

    const priceB =
      b.price_min !== null &&
      b.price_min !== undefined
        ? Number(b.price_min)
        : Number.NEGATIVE_INFINITY;

    return priceB - priceA;
  }

  if (sortOption === "rating") {
    const ratingA =
      a.review_score !== null &&
      a.review_score !== undefined
        ? Number(a.review_score)
        : 0;

    const ratingB =
      b.review_score !== null &&
      b.review_score !== undefined
        ? Number(b.review_score)
        : 0;

    return ratingB - ratingA;
  }

  return 0;
});

  return (
    <section style={{ width: "100%", maxWidth: "none", margin: "0 auto", padding: "0px 0px 80px", boxSizing: "border-box" }}>
    {/* ============================================================
    LÜDIGO HEADER
============================================================ */}

<div
  style={{
    position: "relative",
    width: "100%",
  }}
>

<header
  className="site-header"
  style={{
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  zIndex: 20,

  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "24px",

  padding: "8px 6vw",
  marginBottom: "0",
  boxSizing: "border-box",

  background: "transparent",
  color: "#ffffff",
}}
>
  {/* Logo */}
  <a
    href="#suche"
    style={{
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
    }}
  >
    <img
  src="/images/ludigo-logo-transparent.png"
  alt="LÜDIGO – Urlaub auf deine Art"
  style={{
    width: "260px",
    maxWidth: "48vw",
    height: "auto",
    display: "block",
    objectFit: "contain",
    filter: "drop-shadow(0 3px 10px rgba(255,255,255,0.45))",
  }}
/>
  </a>

  {/* Navigation */}
  <nav
  className="site-nav"
  style={{
    display: "flex",
    alignItems: "center",
    gap: "18px",

    padding: "8px 14px",

    background: "rgba(8, 47, 79, 0.32)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",

    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "16px",

    color: "#ffffff",
    fontSize: "12px",
    fontWeight: 600,

    boxShadow: "0 5px 18px rgba(0,0,0,0.12)",
  }}
>
  <a
    href="#suche"
    style={{
      color: "inherit",
      textDecoration: "none",
      whiteSpace: "nowrap",
    }}
  >
    Suche
  </a>

  <a
    href="#ergebnisse"
    style={{
      color: "inherit",
      textDecoration: "none",
      whiteSpace: "nowrap",
    }}
  >
    Unterkünfte
  </a>

  <a
    href="#so-funktionierts"
    style={{
      color: "inherit",
      textDecoration: "none",
      whiteSpace: "nowrap",
    }}
  >
    So funktioniert&apos;s
  </a>

  <a
    href="#ueber-luedigo"
    style={{
      color: "inherit",
      textDecoration: "none",
      whiteSpace: "nowrap",
    }}
  >
    Über LÜDIGO
  </a>

  <span
    style={{
      padding: "5px 9px",
      borderRadius: "999px",
      background: "#13b7d8",
      color: "#ffffff",
      fontSize: "10px",
      fontWeight: 800,
      letterSpacing: "0.08em",
    }}
  >
    BETA
  </span>
</nav>
</header>

{/* ============================================================
    LÜDIGO HERO
============================================================ */}

<div
  style={{
    position: "relative",
    width: "100vw",
    marginLeft: "calc(50% - 50vw)",
    marginRight: "calc(50% - 50vw)",
    minHeight: "310px",
    marginBottom: "0",
    padding: "70px 6vw 65px",
    borderRadius: "0",
    overflow: "hidden",

    display: "flex",
    flexDirection: "column",
    justifyContent: "center",

    backgroundImage:
      "linear-gradient(90deg, rgba(3,24,48,0.84) 0%, rgba(3,24,48,0.58) 42%, rgba(0,0,0,0.12) 72%, rgba(0,0,0,0.05) 100%), url('/images/ludigo-hero-new.png')",

    backgroundSize: "cover",
    backgroundPosition: "center 48%",
    backgroundRepeat: "no-repeat",

    boxShadow:
      "0 24px 70px rgba(0,0,0,0.32)",
  }}
>
{/* Weicher Übergang vom Hero zum Suchbereich */}
<div
  style={{
    position: "absolute",
    left: 0,
    right: 0,
    bottom: "-1px",
    height: "95px",
    zIndex: 3,
    pointerEvents: "none",
    overflow: "hidden",
  }}
>
  {/* weicher Lichtverlauf */}
<div
  style={{
    position: "absolute",
    left: 0,
    right: 0,
    bottom: "-1px",
    height: "95px",
    zIndex: 2,
    pointerEvents: "none",
    background:
      "linear-gradient(to bottom, rgba(210,242,249,0) 0%, rgba(190,235,245,0.18) 28%, rgba(165,226,240,0.48) 58%, rgba(142,221,236,0.82) 82%, #8eddec 100%)",
  }}
/>

  {/* geschwungene blaue Fläche */}
<div
  style={{
    position: "absolute",
    left: "-5%",
    bottom: "-55px",
    width: "110%",
    height: "105px",

    background: "linear-gradient(90deg, #0788d1 0%, #32b9df 50%, #0788d1 100%)",

    borderRadius: "50% 50% 0 0 / 55% 55% 0 0",
    transform: "rotate(-1.2deg)",

    boxShadow: "0 -8px 30px rgba(7, 136, 209, 0.10)",
  }}
  />
</div>

  <div
    style={{
  position: "relative",
  zIndex: 2,
  maxWidth: "650px",
  marginLeft: "2vw",
  marginTop: "30px",
}}
  >
    <div
      style={{
        marginBottom: "14px",
        fontSize: "13px",
        fontWeight: 800,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "#54d7df",
      }}
    >
      Urlaub auf deine Art.
    </div>

    <h1
      style={{
        margin: 0,
        fontSize: "clamp(36px, 4.8vw, 58px)",
        lineHeight: 1.03,
        letterSpacing: "-0.045em",
        maxWidth: "760px",
        color: "#ffffff",
        textShadow:
          "0 3px 24px rgba(0,0,0,0.38)",
      }}
    >
      Beschreibe deine Reise.
      <br />
      Wir finden die passende{" "}
      <span
        style={{
          color: "#27c6d4",
        }}
      >
        Unterkunft.
      </span>
    </h1>

    <p
      style={{
        margin: "22px 0 0",
        maxWidth: "680px",
        fontSize: "18px",
        lineHeight: 1.6,
        color: "#ffffff",
        opacity: 0.92,
        textShadow:
          "0 2px 12px rgba(0,0,0,0.45)",
      }}
    >
      Kein kompliziertes Filtermenü. Sag einfach,
      wohin du möchtest, mit wem du reist und was
      dir bei deiner Unterkunft wichtig ist.
    </p>
  </div>
</div>
</div>

      <form
      id="suche"
  onSubmit={handleSubmit}
  style={{
    width: "100%",
    margin: "15px 0 0",
    padding: "0",
    position: "relative",
    zIndex: 10,
  }}
>
  <div
  className="main-search-grid"
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr auto",
    gridTemplateAreas: `
      "destination destination destination"
      "dates guests button"
    `,
    alignItems: "stretch",
    width: "min(1180px, calc(100% - 48px))",
    margin: "0 auto",
    background:
  "linear-gradient(135deg, rgba(240, 251, 255, 0.92) 0%, rgba(219, 245, 252, 0.92) 52%, rgba(232, 250, 247, 0.94) 100%)",
borderRadius: "24px",
boxShadow:
  "0 18px 48px rgba(8, 47, 79, 0.12), inset 0 1px 0 rgba(255,255,255,0.65)",
overflow: "visible",
border: "1px solid rgba(7, 136, 209, 0.16)",
backdropFilter: "blur(14px)",
WebkitBackdropFilter: "blur(14px)",
  }}
>
   {/* REISEZIEL */}
<div
  style={{
    gridArea: "destination",
    margin: "10px 10px 0 10px",
    padding: "12px 16px",
    border: "1px solid rgba(7, 136, 209, 0.22)",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.88), rgba(239,250,255,0.72))",
    boxSizing: "border-box",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.8), 0 8px 20px rgba(8,47,79,0.06)",
  }}
>
  <div
    style={{
      fontSize: "12px",
      fontWeight: 800,
      color: "#0b6f9b",
      marginBottom: "6px",
      letterSpacing: "0.02em",
    }}
  >
    📍 Reiseziel
  </div>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      minHeight: "38px",
    }}
  >
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder={isListening ? "Höre zu …" : "Wohin soll es gehen?"}
      style={{
        flex: 1,
        minWidth: 0,
        border: "none",
        outline: "none",
        background: "transparent",
        color: "#25384a",
        fontSize: "15px",
        fontWeight: 500,
      }}
    />

    <button
      type="button"
      onClick={startListening}
      title="Sprachsuche starten"
      style={{
        width: "38px",
        height: "38px",
        flexShrink: 0,
        borderRadius: "50%",
        border: "1px solid rgba(7, 136, 209, 0.20)",
        background: isListening
          ? "linear-gradient(135deg, #0788d1, #1ba6df)"
          : "rgba(255,255,255,0.82)",
        color: isListening ? "#ffffff" : "#0877a9",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "16px",
        boxShadow: "0 4px 12px rgba(8,47,79,0.08)",
      }}
    >
      🎤
    </button>
  </div>
</div>

    {/* ============================================================
        REISEZEITRAUM
    ============================================================ */}
    <div
  style={{
    gridArea: "dates",
    margin: "10px 8px 10px 10px",
    padding: "14px 18px",
    border: "2px solid #0788d1",
    borderRadius: "16px",
    background: "#ffffff",
    boxSizing: "border-box",
  }}
>
      <div
        style={{
          fontSize: "13px",
          fontWeight: 700,
          color: "#082f4f",
          marginBottom: "8px",
        }}
      >
        🗓️ Reisezeitraum
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <input
          type="date"
          value={checkIn}
          min={formatDateForInput(today)}
          onChange={(e) => setCheckIn(e.target.value)}
          style={{
            width: "50%",
            border: "none",
            outline: "none",
            background: "transparent",
            color: "#25384a",
            fontSize: "13px",
            cursor: "pointer",
          }}
        />

        <span
          style={{
            color: "#9aa5ad",
            fontSize: "13px",
          }}
        >
          –
        </span>

        <input
          type="date"
          value={checkOut}
          min={checkIn || undefined}
          onChange={(e) => setCheckOut(e.target.value)}
          style={{
            width: "50%",
            border: "none",
            outline: "none",
            background: "transparent",
            color: "#25384a",
            fontSize: "13px",
            cursor: "pointer",
          }}
        />
      </div>
    </div>

    {/* ============================================================
        REISENDE
    ============================================================ */}
    <div
      style={{
  gridArea: "guests",
  position: "relative",
  margin: "10px 8px",
  padding: "14px 18px",
  border: "2px solid #0788d1",
  borderRadius: "16px",
  background: "#ffffff",
  boxSizing: "border-box",
  cursor: "pointer",
}}
      onClick={() => setShowGuests((prev) => !prev)}
    >
      <div
        style={{
          fontSize: "13px",
          fontWeight: 700,
          color: "#082f4f",
          marginBottom: "5px",
        }}
      >
        👥 Reisende
      </div>

      <div
        style={{
          fontSize: "15px",
          color: "#25384a",
          whiteSpace: "nowrap",
        }}
      >
        {adults} {adults === 1 ? "Erwachsener" : "Erwachsene"}
        {children > 0
          ? ` · ${children} ${children === 1 ? "Kind" : "Kinder"}`
          : ""}
        {babies > 0
          ? ` · ${babies} ${babies === 1 ? "Baby" : "Babys"}`
          : ""}
      </div>

      {showGuests && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: "78px",
            right: 0,
            zIndex: 50,
            width: "300px",
            padding: "18px",
            borderRadius: "18px",
            background: "#ffffff",
            boxShadow: "0 16px 40px rgba(8, 47, 79, 0.18)",
            border: "1px solid #e5eaee",
          }}
        >
          {/* Erwachsene */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: "#082f4f" }}>
                Erwachsene
              </div>
              <div style={{ fontSize: "13px", color: "#7a8791" }}>
                ab 18 Jahren
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setAdults((value) => Math.max(1, value - 1))
                }
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  border: "1px solid #ccd5db",
                  background: "#ffffff",
                  cursor: "pointer",
                }}
              >
                −
              </button>

              <strong>{adults}</strong>

              <button
                type="button"
                onClick={() => setAdults((value) => value + 1)}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  border: "1px solid #ccd5db",
                  background: "#ffffff",
                  cursor: "pointer",
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Kinder */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: "#082f4f" }}>
                Kinder
              </div>
              <div style={{ fontSize: "13px", color: "#7a8791" }}>
                2 bis 17 Jahre
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setChildren((value) => Math.max(0, value - 1))
                }
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  border: "1px solid #ccd5db",
                  background: "#ffffff",
                  cursor: "pointer",
                }}
              >
                −
              </button>

              <strong>{children}</strong>

              <button
                type="button"
                onClick={() => setChildren((value) => value + 1)}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  border: "1px solid #ccd5db",
                  background: "#ffffff",
                  cursor: "pointer",
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Babys */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: "#082f4f" }}>
                Babys
              </div>
              <div style={{ fontSize: "13px", color: "#7a8791" }}>
                unter 2 Jahren
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setBabies((value) => Math.max(0, value - 1))
                }
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  border: "1px solid #ccd5db",
                  background: "#ffffff",
                  cursor: "pointer",
                }}
              >
                −
              </button>

              <strong>{babies}</strong>

              <button
                type="button"
                onClick={() => setBabies((value) => value + 1)}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  border: "1px solid #ccd5db",
                  background: "#ffffff",
                  cursor: "pointer",
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Fertig */}
          <div
            style={{
              marginTop: "18px",
              paddingTop: "14px",
              borderTop: "1px solid #e5eaee",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={() => setShowGuests(false)}
              style={{
                border: "none",
                borderRadius: "10px",
                padding: "10px 18px",
                background: "#0788d1",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Fertig
            </button>
          </div>
        </div>
      )}
    </div>

    {/* ============================================================
        SUCHBUTTON
    ============================================================ */}
    <div
      style={{
        gridArea: "button",
        padding: "10px",
        display: "flex",
        alignItems: "stretch",
      }}
    >
      <button
        type="submit"
        style={{
          border: "none",
          borderRadius: "14px",
          padding: "0 28px",
          minHeight: "58px",
          background: "#0788d1",
          color: "#ffffff",
          fontSize: "16px",
          fontWeight: 700,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        🔍 Unterkunft finden
      </button>
    </div>
  </div>
</form>

{isSearching && (
  <div
    style={{
      width: "min(1180px, calc(100% - 48px))",
      margin: "12px auto 0",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "7px",
        color: "#315466",
        fontSize: "13px",
        fontWeight: 700,
      }}
    >
      <span>Passende Unterkünfte werden gesucht …</span>
      <span>✈️</span>
    </div>

    <div
      className="search-loading-track"
      style={{
        width: "100%",
        height: "6px",
        overflow: "hidden",
        borderRadius: "999px",
        background: "rgba(19, 183, 216, 0.16)",
      }}
    >
      <div className="search-loading-bar" />
    </div>
  </div>
)}

{selectedAccommodationType && (
  <div
    style={{
      width: "min(1180px, calc(100% - 48px))",
      margin: "12px auto 0",
      display: "flex",
      justifyContent: "flex-start",
    }}
  >
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 12px",
        borderRadius: "999px",
        background: "#ffffff",
        border: "1px solid rgba(19, 183, 216, 0.28)",
        boxShadow: "0 8px 22px rgba(8, 47, 79, 0.08)",
        color: "#082f4f",
        fontSize: "13px",
        fontWeight: 700,
      }}
    >
      <span>
        {selectedAccommodationType === "campsite" && "🏕️ Camping ausgewählt"}
        {selectedAccommodationType === "holiday_apartment" &&
          "🏡 Ferienwohnung ausgewählt"}
        {selectedAccommodationType === "hotel" && "🏨 Hotel ausgewählt"}
      </span>

      <button
        type="button"
        onClick={() => setSelectedAccommodationType(null)}
        aria-label="Unterkunftsart entfernen"
        style={{
          border: "none",
          background: "transparent",
          color: "#6b7f8d",
          fontSize: "18px",
          lineHeight: 1,
          cursor: "pointer",
          padding: "0",
        }}
      >
        ×
      </button>
    </div>
  </div>
)}

{/* Vorteile unter der Suche */}
<div
className="mobile-benefits"
  style={{
    width: "min(1180px, calc(100% - 48px))",
    margin: "24px auto 34px",
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "20px",
  }}
>
  <div style={{ textAlign: "center" }}>
    <div
      style={{
        width: "58px",
        height: "58px",
        margin: "0 auto 12px",
        borderRadius: "50%",
        background: "rgba(7, 136, 209, 0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "26px",
      }}
    >
      🏠
    </div>
    <div
      style={{
        fontSize: "17px",
        fontWeight: 800,
        color: "#082f4f",
        marginBottom: "4px",
      }}
    >
      Viele Unterkünfte
    </div>
    <div
      style={{
        fontSize: "14px",
        color: "#5f7382",
      }}
    >
      Weltweit entdecken
    </div>
  </div>

  <div style={{ textAlign: "center" }}>
    <div
      style={{
        width: "58px",
        height: "58px",
        margin: "0 auto 12px",
        borderRadius: "50%",
        background: "rgba(40, 180, 120, 0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "26px",
      }}
    >
      🛡️
    </div>
    <div
      style={{
        fontSize: "17px",
        fontWeight: 800,
        color: "#082f4f",
        marginBottom: "4px",
      }}
    >
      Sicher buchen
    </div>
    <div
      style={{
        fontSize: "14px",
        color: "#5f7382",
      }}
    >
      Vertrauenswürdige Anbieter
    </div>
  </div>

  <div style={{ textAlign: "center" }}>
    <div
      style={{
        width: "58px",
        height: "58px",
        margin: "0 auto 12px",
        borderRadius: "50%",
        background: "rgba(255, 180, 40, 0.16)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "26px",
      }}
    >
      🏷️
    </div>
    <div
      style={{
        fontSize: "17px",
        fontWeight: 800,
        color: "#082f4f",
        marginBottom: "4px",
      }}
    >
      Beste Preise
    </div>
    <div
      style={{
        fontSize: "14px",
        color: "#5f7382",
      }}
    >
      Ohne Zusatzkosten
    </div>
  </div>

  <div style={{ textAlign: "center" }}>
    <div
      style={{
        width: "58px",
        height: "58px",
        margin: "0 auto 12px",
        borderRadius: "50%",
        background: "rgba(255, 90, 120, 0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "26px",
      }}
    >
      ❤️
    </div>
    <div
      style={{
        fontSize: "17px",
        fontWeight: 800,
        color: "#082f4f",
        marginBottom: "4px",
      }}
    >
      Individuelle Suche
    </div>
    <div
      style={{
        fontSize: "14px",
        color: "#5f7382",
      }}
    >
      Auf deine Wünsche abgestimmt
    </div>
  </div>
</div>

{/* Überschrift Unterkunftsarten */}
<div
  style={{
    width: "min(1180px, calc(100% - 48px))",
    margin: "46px auto 8px",
    textAlign: "center",
  }}
>
  <div
    style={{
      fontSize: "13px",
      fontWeight: 800,
      letterSpacing: "1.8px",
      textTransform: "uppercase",
      color: "#0788d1",
      marginBottom: "8px",
    }}
  >
    URLAUB AUF DEINE ART
  </div>

  <h2
    style={{
      margin: 0,
      color: "#082f4f",
      fontSize: "clamp(27px, 3vw, 38px)",
      fontWeight: 800,
      lineHeight: 1.15,
      letterSpacing: "-0.5px",
    }}
  >
    Wie möchtest du deinen Urlaub genießen?
  </h2>

  <p
    style={{
      margin: "10px auto 0",
      maxWidth: "620px",
      color: "#657986",
      fontSize: "15px",
      lineHeight: 1.6,
    }}
  >
    Wähle deine bevorzugte Unterkunftsart und entdecke passende
    Reiseziele für deinen nächsten Urlaub.
  </p>
</div>

{/* ============================================================
    UNTERKUNFT-KATEGORIEN
============================================================ */}
<div className="category-cards">

  {/* CAMPING */}
  <button
  type="button"
  className={`category-card category-card-camping ${
    selectedAccommodationType === "campsite" ? "category-card-selected" : ""
  }`}
  onClick={() => {
  setSelectedAccommodationType("campsite");

  setTimeout(() => {
    document
      .getElementById("suche")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 100);
}}
>
    <div className="category-card-overlay" />

    <div className="category-card-content">
      <div className="category-card-icon">⛺</div>

      <div>
        <h3>Camping</h3>
        <p>
          Freiheit erleben.
          <br />
          Mitten in der Natur.
        </p>
      </div>

      <div className="category-card-arrow">→</div>
    </div>
  </button>

  {/* FERIENWOHNUNGEN */}
  <button
  type="button"
  className={`category-card category-card-apartment ${
    selectedAccommodationType === "holiday_apartment"
      ? "category-card-selected"
      : ""
  }`}
  onClick={() => {
  setSelectedAccommodationType("holiday_apartment");

  setTimeout(() => {
    document
      .getElementById("suche")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 100);
}}
>
    <div className="category-card-overlay" />

    <div className="category-card-content">
      <div className="category-card-icon">⌂</div>

      <div>
        <h3>Ferienwohnungen</h3>
        <p>
          Dein Zuhause
          <br />
          auf Zeit.
        </p>
      </div>

      <div className="category-card-arrow">→</div>
    </div>
  </button>

  {/* HOTELS */}
  <button
  type="button"
  className={`category-card category-card-hotel ${
    selectedAccommodationType === "hotel"
      ? "category-card-selected"
      : ""
  }`}
  onClick={() => {
  setSelectedAccommodationType("hotel");

  setTimeout(() => {
    document
      .getElementById("suche")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 100);
}}
>
    <div className="category-card-overlay" />

    <div className="category-card-content">
      <div className="category-card-icon">▰</div>

      <div>
        <h3>Hotels</h3>
        <p>
          Komfort genießen.
          <br />
          Einfach ankommen.
        </p>
      </div>

      <div className="category-card-arrow">→</div>
    </div>
  </button>

</div>

{/* SO EINFACH GEHT'S */}
<section
id="so-funktionierts"
  style={{
    width: "min(1180px, calc(100% - 48px))",
    margin: "56px auto 72px",
    padding: "44px 32px",
    borderRadius: "28px",
    background: "rgba(255, 255, 255, 0.82)",
    border: "1px solid rgba(8, 47, 79, 0.08)",
    boxShadow: "0 18px 50px rgba(8, 47, 79, 0.08)",
    backdropFilter: "blur(10px)",
  }}
>
  <div
    style={{
      textAlign: "center",
      marginBottom: "34px",
    }}
  >
    <div
      style={{
        fontSize: "13px",
        fontWeight: 800,
        letterSpacing: "1.8px",
        textTransform: "uppercase",
        color: "#0788d1",
        marginBottom: "8px",
      }}
    >
      SO EINFACH GEHT&apos;S
    </div>

    <h2
      style={{
        margin: 0,
        color: "#082f4f",
        fontSize: "clamp(28px, 3vw, 38px)",
        fontWeight: 800,
        lineHeight: 1.15,
      }}
    >
      Deine passende Unterkunft in 3 Schritten
    </h2>

    <p
      style={{
        margin: "10px auto 0",
        maxWidth: "650px",
        color: "#657986",
        fontSize: "15px",
        lineHeight: 1.6,
      }}
    >
      Einfach beschreiben, passende Treffer entdecken und das beste Angebot
      auswählen.
    </p>
  </div>

  <div
    className="steps-grid"
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: "22px",
    }}
  >
    {/* Schritt 1 */}
    <div
      style={{
        padding: "28px 24px",
        borderRadius: "22px",
        background: "#ffffff",
        border: "1px solid rgba(7, 136, 209, 0.10)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "54px",
          height: "54px",
          margin: "0 auto 16px",
          borderRadius: "50%",
          background: "rgba(7, 136, 209, 0.12)",
          color: "#0788d1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          fontWeight: 800,
        }}
      >
        1
      </div>

      <div
        style={{
          fontSize: "19px",
          fontWeight: 800,
          color: "#082f4f",
          marginBottom: "8px",
        }}
      >
        Reise beschreiben
      </div>

      <div
        style={{
          fontSize: "14px",
          color: "#657986",
          lineHeight: 1.6,
        }}
      >
        Sag einfach, wohin du möchtest, mit wem du reist und was dir wichtig
        ist.
      </div>
    </div>

    {/* Schritt 2 */}
    <div
      style={{
        padding: "28px 24px",
        borderRadius: "22px",
        background: "#ffffff",
        border: "1px solid rgba(7, 136, 209, 0.10)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "54px",
          height: "54px",
          margin: "0 auto 16px",
          borderRadius: "50%",
          background: "rgba(46, 196, 182, 0.14)",
          color: "#159a91",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          fontWeight: 800,
        }}
      >
        2
      </div>

      <div
        style={{
          fontSize: "19px",
          fontWeight: 800,
          color: "#082f4f",
          marginBottom: "8px",
        }}
      >
        Passende Treffer finden
      </div>

      <div
        style={{
          fontSize: "14px",
          color: "#657986",
          lineHeight: 1.6,
        }}
      >
        LÜDIGO gleicht deine Wünsche mit passenden Unterkünften und Merkmalen
        ab.
      </div>
    </div>

    {/* Schritt 3 */}
    <div
      style={{
        padding: "28px 24px",
        borderRadius: "22px",
        background: "#ffffff",
        border: "1px solid rgba(7, 136, 209, 0.10)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "54px",
          height: "54px",
          margin: "0 auto 16px",
          borderRadius: "50%",
          background: "rgba(255, 180, 40, 0.16)",
          color: "#c78600",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          fontWeight: 800,
        }}
      >
        3
      </div>

      <div
        style={{
          fontSize: "19px",
          fontWeight: 800,
          color: "#082f4f",
          marginBottom: "8px",
        }}
      >
        Angebot auswählen
      </div>

      <div
        style={{
          fontSize: "14px",
          color: "#657986",
          lineHeight: 1.6,
        }}
      >
        Vergleiche die passenden Unterkünfte und öffne das Angebot, das zu dir
        passt.
      </div>
    </div>
  </div>
</section>

      {message && (
  <div
    style={{
  width: "min(1180px, calc(100% - 48px))",
  margin: "28px auto 8px",
  padding: "14px 18px",
  borderRadius: "16px",
  border: "2px solid #0788d1",
  background: "#ffffff",
  color: "#082f4f",
  fontSize: "15px",
  lineHeight: 1.5,
  boxSizing: "border-box",
}}
  >
    {message}
  </div>
)}

{results.length > 0 && (
  <div
    id="ergebnisse"
    style={{
      width: "calc(100% - 64px)",
      maxWidth: "1180px",
      margin: "28px auto 60px",
      padding: "0 16px",
      boxSizing: "border-box",
    }}
  >
    {/* KOPFBEREICH SUCHERGEBNISSE */}
    <div
    id="ergebnisse"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: "24px",
        flexWrap: "wrap",
        marginBottom: "16px",
      }}
    >
      {/* Überschrift links */}
      <div>
        <p
          style={{
            margin: "0 0 6px",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#526575",
          }}
        >
          Suchergebnisse
        </p>

        <h2
          style={{
            margin: 0,
            fontSize: "28px",
            lineHeight: 1.2,
            color: "#082f4f",
          }}
        >
          Passende Unterkünfte
        </h2>
      </div>

      {/* Treffer + Sortierung rechts */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "8px",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            color: "#526575",
          }}
        >
          {results.length} {results.length === 1 ? "Treffer" : "Treffer"}
        </div>

        <select
          value={sortOption}
          onChange={(event) =>
            setSortOption(
              event.target.value as
                | "best"
                | "price_asc"
                | "price_desc"
                | "rating"
            )
          }
          style={{
            background: "#082f4f",
            color: "#ffffff",
            border: "1px solid #082f4f",
            borderRadius: "12px",
            padding: "10px 14px",
            fontSize: "14px",
            cursor: "pointer",
            minWidth: "165px",
          }}
        >
          <option value="best">Beste Treffer</option>
          <option value="price_asc">Preis: niedrig zuerst</option>
          <option value="price_desc">Preis: hoch zuerst</option>
          <option value="rating">Bewertung: beste zuerst</option>
        </select>
      </div>
    </div>

    {sortedResults.map((item) => {
  const offerUrl =
    item.affiliate_url ||
    item.booking_url ||
    item.website_url;

  const currencySymbol =
    item.currency === "EUR"
      ? "€"
      : item.currency || "€";

  const locationText = [
    item.city,
    item.region,
    item.country,
  ]
    .filter(Boolean)
    .join(" · ");

  const stars =
    typeof item.hotel_stars === "number"
      ? Math.max(
          0,
          Math.min(5, item.hotel_stars)
        )
      : 0;

  const hasPrice =
    item.price_min !== null &&
    item.price_min !== undefined;

  const hasMaxPrice =
    item.price_max !== null &&
    item.price_max !== undefined;

  const hasReviewScore =
    item.review_score !== null &&
    item.review_score !== undefined;

  const featureLabels: string[] = [];

// Wichtigste Ausstattung zuerst
if (item.has_wifi) {
  featureLabels.push("📶 WLAN");
}

if (item.has_pool) {
  featureLabels.push("🏊 Pool");
}

if (item.has_parking) {
  featureLabels.push("🅿️ Parkplatz");
}

if (item.has_breakfast) {
  featureLabels.push("☕ Frühstück");
}

if (item.has_restaurant) {
  featureLabels.push("🍽️ Restaurant");
}

if (item.apartment_has_kitchen) {
  featureLabels.push("🍳 Küche");
}

if (item.has_air_conditioning) {
  featureLabels.push("❄️ Klimaanlage");
}

if (item.dogs_allowed) {
  featureLabels.push("🐕 Hunde erlaubt");
}

if (item.family_friendly) {
  featureLabels.push("👨‍👩‍👧 Familienfreundlich");
}

if (item.accessible) {
  featureLabels.push("♿ Barrierefrei");
}

if (item.apartment_has_washing_machine) {
  featureLabels.push("🧺 Waschmaschine");
}

if (item.near_sea) {
  featureLabels.push("🌊 Am Meer");
}

if (item.near_lake) {
  featureLabels.push("🏞️ Am See");
}

if (item.near_mountains) {
  featureLabels.push("⛰️ Berge");
}

if (item.quiet_place) {
  featureLabels.push("🌿 Ruhige Lage");
}

if (item.family_friendly) {
  featureLabels.push("👨‍👩‍👧 Familienfreundlich");
}

if (item.dogs_allowed) {
  featureLabels.push("🐕 Hunde erlaubt");
}

if (item.accessible) {
  featureLabels.push("♿ Barrierefrei");
}

  const visibleFeatures =
    featureLabels.slice(0, 5);

const sortedResults = [...results].sort((a, b) => {
  if (sortOption === "price_asc") {
    const priceA =
      a.price_min !== null &&
      a.price_min !== undefined
        ? Number(a.price_min)
        : Number.POSITIVE_INFINITY;

    const priceB =
      b.price_min !== null &&
      b.price_min !== undefined
        ? Number(b.price_min)
        : Number.POSITIVE_INFINITY;

    return priceA - priceB;
  }

  if (sortOption === "price_desc") {
    const priceA =
      a.price_min !== null &&
      a.price_min !== undefined
        ? Number(a.price_min)
        : Number.NEGATIVE_INFINITY;

    const priceB =
      b.price_min !== null &&
      b.price_min !== undefined
        ? Number(b.price_min)
        : Number.NEGATIVE_INFINITY;

    return priceB - priceA;
  }

  if (sortOption === "rating") {
    const ratingA =
      a.review_score !== null &&
      a.review_score !== undefined
        ? Number(a.review_score)
        : 0;

    const ratingB =
      b.review_score !== null &&
      b.review_score !== undefined
        ? Number(b.review_score)
        : 0;

    return ratingB - ratingA;
  }

  // "best"
  // Die Reihenfolge kommt bereits vom Server-Ranking.
  return 0;
});

  return (
    <article
      key={item.id}
      className="accommodation-card"
      style={{
  display: "grid",
  gridTemplateColumns: "190px 1fr",
  width: "100%",
  maxWidth: "1080px",
  minHeight: "190px",
  marginTop: "14px",
  marginLeft: "28px",
  gap: "0",
  border: "1px solid rgba(8, 47, 79, 0.12)",
  borderRadius: "20px",
  overflow: "hidden",
  background: "rgba(255, 255, 255, 0.88)",
  boxShadow: "0 10px 30px rgba(8, 47, 79, 0.10)",
}}
    >
      {/* ===================================================== */}
      {/* BILD */}
      {/* ===================================================== */}

      <div
      className="accommodation-card-image"
        style={{
  minHeight: "165px",
  height: "165px",
  background: "#eef7fc",
  position: "relative",
  overflow: "hidden",
}}
      >
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            loading="lazy"
            style={{
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
}}
          />
        ) : (
          <div
  className="accommodation-card-content"
  style={{
    minHeight: "190px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "16px",
    textAlign: "center",
    background:
      "linear-gradient(145deg, rgba(225,245,255,0.95), rgba(203,235,250,0.95))",
    color: "#526575",
  }}
>
  <div
    style={{
      width: "46px",
      height: "46px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(255,255,255,0.85)",
      fontSize: "22px",
      boxShadow: "0 4px 12px rgba(8,47,79,0.08)",
    }}
  >
    🏡
  </div>

  <div
    style={{
      fontSize: "13px",
      lineHeight: 1.4,
      fontWeight: 600,
    }}
  >
    Noch kein Bild
    <br />
    verfügbar
  </div>
</div>
        )}

        {item.is_featured && (
          <div
            style={{
              position: "absolute",
              top: "14px",
              left: "14px",
              padding: "6px 10px",
              borderRadius: "999px",
              background: "rgba(0, 0, 0, 0.75)",
              color: "white",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            Empfehlung
          </div>
        )}
      </div>

      {/* ===================================================== */}
      {/* INHALT */}
      {/* ===================================================== */}

      <div
        className="accommodation-card-content"
        style={{
          padding: "14px 18px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <div>
          {/* Unterkunftstyp + Sterne */}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              marginBottom: "8px",
            }}
          >
           

            
          </div>

          {/* Name */}

<div
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    marginBottom: "10px",
    padding: "6px 11px",
    borderRadius: "999px",
    background: "rgba(19, 183, 216, 0.12)",
    border: "1px solid rgba(19, 183, 216, 0.24)",
    color: "#087ca8",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "0.02em",
  }}
>
  {(() => {
  const type = item.accommodation_type ?? "";

  const campingTypes = [
    "campsite",
    "camping",
    "glamping",
    "mobile_home",
    "motorhome",
    "campervan",
  ];

  const hotelTypes = [
    "hotel",
    "resort",
    "hostel",
    "guesthouse",
    "bed_and_breakfast",
    "b_and_b",
    "bnb",
    "pension",
  ];

  const apartmentTypes = [
    "holiday_apartment",
    "holiday_home",
    "villa",
    "chalet",
    "cabin",
    "bungalow",
    "apartment",
    "ferienwohnung",
    "ferienhaus",
  ];

  let label = "🏡 Ferienwohnung";
  let background = "rgba(19, 183, 216, 0.12)";
  let border = "1px solid rgba(19, 183, 216, 0.26)";
  let color = "#087ca8";

  if (campingTypes.includes(type)) {
    label = "🏕️ Campingplatz";
    background = "rgba(47, 158, 92, 0.12)";
    border = "1px solid rgba(47, 158, 92, 0.28)";
    color = "#247a48";
  } else if (hotelTypes.includes(type)) {
    label = "🏨 Hotel";
    background = "rgba(7, 136, 209, 0.12)";
    border = "1px solid rgba(7, 136, 209, 0.27)";
    color = "#076fa8";
  } else if (apartmentTypes.includes(type)) {
    label = "🏡 Ferienwohnung";
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        marginBottom: "10px",
        padding: "6px 11px",
        borderRadius: "999px",
        background,
        border,
        color,
        fontSize: "12px",
        fontWeight: 800,
        letterSpacing: "0.02em",
      }}
    >
      {label}
    </div>
  );
})()}
{stars > 0 && (
              <span
                aria-label={`${stars} Sterne`}
                style={{
                  letterSpacing: "2px",
                  fontSize: "15px",
                }}
              >
                {"★".repeat(stars)}
              </span>
            )}

</div>

<h2
  style={{
    margin: "0 0 6px 0",
    fontSize: "24px",
    lineHeight: 1.2,
    fontWeight: 750,
    color: "#082f4f",
    letterSpacing: "-0.02em",
  }}
>
  {item.name}
</h2>

          {/* Ort */}

         {locationText && (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "6px",
      marginBottom: "12px",
      color: "#526575",
      fontSize: "14px",
      lineHeight: 1.4,
    }}
  >
    <span
      style={{
        fontSize: "14px",
        flexShrink: 0,
      }}
    >
      📍
    </span>

    <span>{locationText}</span>
  </div>
)}

          {/* Bewertung */}

          {hasReviewScore && (
           <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  }}
>
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "46px",
      height: "38px",
      padding: "0 10px",
      borderRadius: "10px",
      background: "#0788d1",
      color: "#ffffff",
      fontSize: "15px",
      fontWeight: 800,
      boxShadow: "0 4px 12px rgba(7, 136, 209, 0.20)",
    }}
  >
    {Number(item.review_score).toFixed(1)}
  </span>

  <div>
    <div
      style={{
        fontSize: "15px",
        fontWeight: 700,
        color: "#082f4f",
      }}
    >
      {Number(item.review_score) >= 9
        ? "Hervorragend"
        : Number(item.review_score) >= 8
        ? "Sehr gut"
        : Number(item.review_score) >= 7
        ? "Gut"
        : "Bewertet"}
    </div>

    <div
      style={{
        marginTop: "2px",
        fontSize: "12px",
        color: "#71808c",
      }}
    >
      Gästebewertung
    </div>
  </div>
</div>
          )}

          {/* Features */}

          {visibleFeatures.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              {visibleFeatures.map((feature, index) => (
  <span
    key={`${feature}-${index}`}
    className="feature-badge"
  >
    {feature}
  </span>
))}
            </div>
          )}

          {/* Unterkunftsdaten */}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              fontSize: "14px",
              opacity: 0.8,
            }}
          >
            {item.max_guests && (
              <span>
                bis {item.max_guests} Gäste
              </span>
            )}

            {item.apartment_bedrooms && (
              <span>
                {item.apartment_bedrooms}{" "}
                Schlafzimmer
              </span>
            )}
          </div>

          {/* Beschreibung */}

          {item.description && (
            <p
              style={{
                marginTop: "16px",
                marginBottom: 0,
                lineHeight: 1.6,
                opacity: 0.8,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {item.description}
            </p>
          )}
        </div>

{/* AUSSTATTUNG */}
<div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "7px",
    marginTop: "6px",
    marginBottom: "16px",
  }}
>
  
</div>

        {/* ===================================================== */}
        {/* PREIS + BUTTON */}
        {/* ===================================================== */}

        <div
          style={{
            borderTop: "1px solid #2b2b2b",
            paddingTop: "18px",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "18px",
            flexWrap: "wrap",
          }}
        >
          <div>
  {hasPrice ? (
    <>
      <div
        style={{
          fontSize: "12px",
          fontWeight: 700,
          color: "#71808c",
          marginBottom: "4px",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        Preis ab
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "6px",
        }}
      >
        <span
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "#082f4f",
            lineHeight: 1,
          }}
        >
          {item.price_min} {currencySymbol}
        </span>

        <span
          style={{
            fontSize: "13px",
            color: "#71808c",
          }}
        >
          / Nacht
        </span>
      </div>

      {hasMaxPrice &&
        item.price_max !== item.price_min && (
          <div
            style={{
              marginTop: "5px",
              fontSize: "12px",
              color: "#71808c",
            }}
          >
            bis {item.price_max} {currencySymbol}
          </div>
        )}
    </>
  ) : (
    <div
      style={{
        fontSize: "14px",
        color: "#71808c",
      }}
    >
      Preis beim Anbieter prüfen
    </div>
  )}
</div>

          {offerUrl ? (
  <a
    href={offerUrl}
    target="_blank"
    rel="noopener noreferrer sponsored"
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "46px",
      padding: "0 22px",
      borderRadius: "12px",
      background: "#0788d1",
      color: "#ffffff",
      textDecoration: "none",
      fontWeight: 800,
      fontSize: "14px",
      whiteSpace: "nowrap",
      boxShadow: "0 6px 16px rgba(7, 136, 209, 0.22)",
    }}
  >
    Zum Angebot →
  </a>
) : (
  <button
    type="button"
    disabled
    style={{
      minHeight: "46px",
      padding: "0 22px",
      borderRadius: "12px",
      border: "1px solid rgba(8, 47, 79, 0.12)",
      background: "#eef4f7",
      color: "#7a8791",
      fontWeight: 700,
      fontSize: "14px",
      cursor: "not-allowed",
      whiteSpace: "nowrap",
    }}
  >
    Angebot folgt
  </button>
)}
        </div>

        {/* Anbieterhinweis */}

        {item.provider_name && (
          <div
            style={{
              fontSize: "12px",
              opacity: 0.55,
            }}
          >
            Angebot von {item.provider_name}
          </div>
        )}
      </div>
    </article>
        );
         })}
    </div>
  )}

  {/* ÜBER LÜDIGO */}
<section
  id="ueber-luedigo"
  style={{
    width: "min(1180px, calc(100% - 48px))",
    margin: "72px auto 56px",
    padding: "48px 42px",
    borderRadius: "28px",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.90) 0%, rgba(224,247,253,0.88) 100%)",
    border: "1px solid rgba(7, 136, 209, 0.12)",
    boxShadow: "0 18px 50px rgba(8, 47, 79, 0.09)",
  }}
>
  <div
    style={{
      maxWidth: "760px",
      margin: "0 auto",
      textAlign: "center",
    }}
  >
    <div
      style={{
        fontSize: "13px",
        fontWeight: 800,
        letterSpacing: "1.8px",
        color: "#0788d1",
        marginBottom: "10px",
      }}
    >
      ÜBER LÜDIGO
    </div>

    <h2
      style={{
        margin: "0",
        color: "#082f4f",
        fontSize: "clamp(28px, 3vw, 40px)",
        fontWeight: 800,
        lineHeight: 1.15,
      }}
    >
      Urlaub suchen, wie Menschen wirklich denken.
    </h2>

    <p
      style={{
        margin: "16px auto 0",
        maxWidth: "680px",
        color: "#5f7382",
        fontSize: "15px",
        lineHeight: 1.7,
      }}
    >
      Statt dich durch unzählige Filter zu klicken, beschreibst du LÜDIGO
      einfach deine Reisewünsche. Reiseziel, Unterkunft, Budget und besondere
      Wünsche werden gemeinsam berücksichtigt.
    </p>
  </div>

  <div
    style={{
      margin: "30px auto",
      maxWidth: "820px",
      padding: "20px 24px",
      borderRadius: "18px",
      background: "rgba(255,255,255,0.78)",
      border: "1px solid rgba(7,136,209,0.12)",
      color: "#315466",
      fontSize: "15px",
      fontStyle: "italic",
      lineHeight: 1.6,
      textAlign: "center",
    }}
  >
    „Ich suche im August eine ruhige Ferienwohnung am Meer für 4 Personen,
    mit Hund und maximal 180 € pro Nacht.“
  </div>

  <div
    className="search-benefits-grid"
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: "20px",
      marginTop: "30px",
    }}
  >
    <div style={{ textAlign: "center", padding: "18px" }}>
      <div style={{ fontSize: "30px", marginBottom: "10px" }}>💬</div>
      <div
        style={{
          color: "#082f4f",
          fontSize: "17px",
          fontWeight: 800,
          marginBottom: "6px",
        }}
      >
        Natürlich suchen
      </div>
      <div style={{ color: "#657986", fontSize: "14px", lineHeight: 1.5 }}>
        Beschreibe deine Reise einfach mit deinen eigenen Worten.
      </div>
    </div>

    <div style={{ textAlign: "center", padding: "18px" }}>
      <div style={{ fontSize: "30px", marginBottom: "10px" }}>🎯</div>
      <div
        style={{
          color: "#082f4f",
          fontSize: "17px",
          fontWeight: 800,
          marginBottom: "6px",
        }}
      >
        Passender finden
      </div>
      <div style={{ color: "#657986", fontSize: "14px", lineHeight: 1.5 }}>
        Wichtige Wünsche werden gemeinsam statt einzeln betrachtet.
      </div>
    </div>

    <div style={{ textAlign: "center", padding: "18px" }}>
      <div style={{ fontSize: "30px", marginBottom: "10px" }}>✨</div>
      <div
        style={{
          color: "#082f4f",
          fontSize: "17px",
          fontWeight: 800,
          marginBottom: "6px",
        }}
      >
        Einfach vergleichen
      </div>
      <div style={{ color: "#657986", fontSize: "14px", lineHeight: 1.5 }}>
        Relevante Unterkünfte übersichtlich entdecken und vergleichen.
      </div>
    </div>
  </div>
</section>

  <footer
  style={{
    marginTop: "80px",
    background: "#082f4f",
    color: "#ffffff",
    padding: "52px 24px 24px",
  }}
>
  <div
    style={{
      width: "100%",
      maxWidth: "1180px",
      margin: "0 auto",
    }}
  >
    {/* OBERER FOOTERBEREICH */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: "40px",
        paddingBottom: "36px",
      }}
    >
      {/* MARKE */}
      <div
        style={{
          maxWidth: "420px",
        }}
      >
        <img
  src="/images/ludigo-logo.png"
  alt="LÜDIGO – Urlaub auf deine Art"
  style={{
    width: "220px",
    maxWidth: "100%",
    height: "auto",
    display: "block",
    objectFit: "contain",
    marginBottom: "18px",
    filter: "drop-shadow(0 2px 8px rgba(255,255,255,0.18))",
  }}
/>

        <p
          style={{
            margin: 0,
            fontSize: "14px",
            lineHeight: 1.7,
            opacity: 0.72,
          }}
        >
          Finde passende Unterkünfte mit einer einfachen Beschreibung
          deiner Reise – ohne komplizierte Filtermenüs.
        </p>
      </div>

      {/* LINKS */}
      <div>
        <div
          style={{
            fontSize: "13px",
            fontWeight: 700,
            marginBottom: "16px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Informationen
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            fontSize: "14px",
          }}
        >
          <a
            href="/impressum"
            style={{
              color: "inherit",
              textDecoration: "none",
              opacity: 0.75,
            }}
          >
            Impressum
          </a>

          <a
            href="/datenschutz"
            style={{
              color: "inherit",
              textDecoration: "none",
              opacity: 0.75,
            }}
          >
            Datenschutz
          </a>

          <a
            href="/partner"
            style={{
              color: "inherit",
              textDecoration: "none",
              opacity: 0.75,
            }}
          >
            Partner
          </a>
        </div>
      </div>
    </div>

    {/* AFFILIATE-HINWEIS */}
    <div
      style={{
        padding: "20px 0",
        borderTop: "1px solid rgba(255,255,255,0.12)",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
        fontSize: "12px",
        lineHeight: 1.7,
        opacity: 0.58,
      }}
    >
      Einige Links zu Unterkünften können Affiliate-Links sein.
      Wenn über einen solchen Link eine Buchung erfolgt, können wir
      eine Provision erhalten. Für dich entstehen dadurch keine
      zusätzlichen Kosten.
    </div>

    {/* UNTERE ZEILE */}
    <div
      style={{
        paddingTop: "22px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
        fontSize: "12px",
        opacity: 0.55,
      }}
    >
      <div>
        © {new Date().getFullYear()} LÜDIGO
      </div>

      <div>
        Urlaub auf deine Art.
      </div>
    </div>
  </div>
</footer>

<style jsx>{`
  .accommodation-card {
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      border-color 0.2s ease;
  }

.feature-badge {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(7, 136, 209, 0.18);
  color: #0b5f86;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(8, 47, 79, 0.06);
}

.category-card {
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    filter 0.25s ease;
  will-change: transform;
}

.category-card:hover {
  transform: translateY(-6px) scale(1.015);
  box-shadow: 0 18px 40px rgba(8, 47, 79, 0.22);
  filter: brightness(1.03);
}

.category-card:active {
  transform: translateY(-2px) scale(1.005);
}

  .category-card-selected {
  border: 3px solid #0788d1 !important;
  transform: translateY(-4px);
  box-shadow: 0 16px 38px rgba(7, 136, 209, 0.28);
}

.category-cards {
  position: relative;
  z-index: 10;

  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;

  width: min(1180px, calc(100% - 48px));

  margin: 28px auto 56px;
}

.category-card {
  position: relative;
  min-height: 220px;
  border: none;
  border-radius: 24px;
  overflow: hidden;
  padding: 0;
  cursor: pointer;
  text-align: left;
  background-size: cover;
  background-position: center;
  box-shadow: 0 16px 40px rgba(8, 47, 79, 0.16);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 22px 48px rgba(8, 47, 79, 0.22);
}

.category-card-selected {
  outline: 3px solid #13b7d8;
  outline-offset: 3px;
  transform: translateY(-4px);
  box-shadow:
    0 0 0 4px rgba(19, 183, 216, 0.14),
    0 22px 48px rgba(8, 47, 79, 0.22);
}

.category-card-camping {
  background-image: url("/images/camping-card.jpg");
  background-position: left center;
}

.category-card-apartment {
  background-image: url("/images/apartment-card.jpg");
  background-position: center center;
}

.category-card-hotel {
  background-image: url("/images/hotel-card.jpg");
  background-position: right center;
}

.category-card-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      180deg,
      rgba(4, 24, 42, 0.10) 0%,
      rgba(4, 24, 42, 0.78) 100%
    );
}

.category-card-content {
  position: relative;
  z-index: 2;
  min-height: 220px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: #ffffff;
}

.category-card-icon {
  position: absolute;
  top: 18px;
  left: 18px;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.94);
  color: #082f4f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
}

.search-loading-bar {
  width: 35%;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #0788d1, #13b7d8);
  animation: ludigo-search-loading 1.1s ease-in-out infinite;
}

@keyframes ludigo-search-loading {
  0% {
    transform: translateX(-110%);
  }

  100% {
    transform: translateX(320%);
  }
}

.category-card h3 {
  margin: 0 0 8px;
  font-size: 27px;
  line-height: 1.05;
}

.category-card p {
  margin: 0;
  font-size: 16px;
  line-height: 1.45;
  opacity: 0.94;
}

.category-card-arrow {
  position: absolute;
  right: 18px;
  bottom: 18px;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #ffffff;
  color: #082f4f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
}

@media (max-width: 760px) {
  .category-cards {
    grid-template-columns: 1fr;
    width: calc(100% - 32px);
    gap: 16px;
    margin-top: 22px;
  }

  .category-card {
    min-height: 200px;
  }

  .category-card-content {
    min-height: 200px;
  }
}

  .accommodation-card:hover {
    transform: translateY(-4px);
    border-color: #3d3d3d !important;
    box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28) !important;
  }

  form button,
  .accommodation-card a {
    transition:
      transform 0.15s ease,
      opacity 0.15s ease,
      background 0.15s ease;
  }

  form button:hover,
  .accommodation-card a:hover {
    transform: translateY(-1px);
    opacity: 0.92;
  }

  form button:active,
  .accommodation-card a:active {
    transform: translateY(0);
  }

  @media (max-width: 760px) {
    /* dein vorhandener Mobile-Code bleibt hier */
  }

  @media (max-width: 760px) {
    .accommodation-card {
      grid-template-columns: 1fr !important;
    }

    .accommodation-card-image {
      min-height: 220px !important;
    }

    .accommodation-card-content {
      padding: 18px !important;
    }

  .site-header {
  align-items: flex-start !important;
  margin-bottom: 48px !important;
}

.site-nav {
  gap: 12px !important;
}

.site-nav a {
  display: none;
}
  form {
  padding: 18px !important;
}

textarea {
  min-height: 150px !important;
  font-size: 16px !important;
  padding: 18px !important;
}

form > div {
  width: 100%;
}

form button {
  width: 100%;
}
  section {
  padding: 24px 16px 56px !important;
}

h1 {
  font-size: 40px !important;
  line-height: 1.08 !important;
}

#suche {
  margin-bottom: 28px !important;
}

#suche p {
  font-size: 16px !important;
})}


`}</style>

  </section>
);
}