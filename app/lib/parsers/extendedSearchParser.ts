import { containsAnyWholeTerm } from "./parserUtils";

type SearchParams = URLSearchParams;

function includesAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term));
}

function appendIfAny(
  text: string,
  params: SearchParams,
  key: string,
  value: string,
  terms: string[]
) {
  if (includesAny(text, terms)) {
    params.append(key, value);
  }
}

function parseNumber(value: string): number | null {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}


// =========================================================
// 1. EVENTS, FEIERN & GRUPPENANLÄSSE
// =========================================================

function parseEvents(
  normalizedText: string,
  params: SearchParams
) {
  appendIfAny(
    normalizedText,
    params,
    "trip_style",
    "event_trip",
    [
      "eventreise",
      "event reise",
      "veranstaltungsreise",
      "reise für eine veranstaltung",
      "reise fuer eine veranstaltung",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_type",
    "wedding",
    [
      "hochzeit",
      "hochzeitsreise mit gästen",
      "hochzeitsreise mit gaesten",
      "hochzeitsfeier",
      "heiraten",
      "wedding",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_type",
    "wedding_reception",
    [
      "hochzeitsfeier",
      "hochzeitsempfang",
      "hochzeitslocation",
      "hochzeits veranstaltung",
      "wedding reception",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_feature",
    "wedding_venue",
    [
      "hochzeitslocation",
      "hochzeits venue",
      "hochzeitsvenue",
      "wedding venue",
      "location zum heiraten",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_type",
    "birthday",
    [
      "geburtstag",
      "geburtstagsfeier",
      "geburtstag feiern",
      "birthday",
      "birthday party",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_type",
    "anniversary",
    [
      "jubiläum",
      "jubilaeum",
      "jahrestag",
      "hochzeitstag",
      "anniversary",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_type",
    "engagement",
    [
      "verlobungsfeier",
      "verlobung feiern",
      "engagement party",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_type",
    "bachelor_party",
    [
      "junggesellenabschied",
      "jga",
      "bachelor party",
      "stag party",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_type",
    "bachelorette_party",
    [
      "junggesellinnenabschied",
      "jga für frauen",
      "jga fuer frauen",
      "bachelorette party",
      "hen party",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_type",
    "family_celebration",
    [
      "familienfeier",
      "familienfest",
      "familientreffen",
      "familien treffen",
      "family celebration",
      "family reunion",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_type",
    "reunion",
    [
      "wiedersehen",
      "klassentreffen",
      "vereinstreffen",
      "gruppen wiedersehen",
      "reunion",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_type",
    "corporate_event",
    [
      "firmenevent",
      "firmenveranstaltung",
      "betriebsausflug",
      "team event",
      "teamevent",
      "corporate event",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_type",
    "retreat",
    [
      "retreat",
      "gruppenretreat",
      "yoga retreat",
      "wellness retreat",
      "team retreat",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_type",
    "seminar",
    [
      "seminar",
      "seminargruppe",
      "seminarreise",
      "workshop gruppe",
      "workshopreise",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_feature",
    "event_room",
    [
      "veranstaltungsraum",
      "eventraum",
      "event raum",
      "feierraum",
      "veranstaltungssaal",
      "event room",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_feature",
    "banquet_hall",
    [
      "festsaal",
      "bankettsaal",
      "ballsaal",
      "banquet hall",
      "ballroom",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_feature",
    "party_allowed",
    [
      "partys erlaubt",
      "party erlaubt",
      "feiern erlaubt",
      "veranstaltungen erlaubt",
      "events erlaubt",
      "parties allowed",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_feature",
    "music_allowed",
    [
      "musik erlaubt",
      "laute musik erlaubt",
      "musikveranstaltung erlaubt",
      "music allowed",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_feature",
    "dance_floor",
    [
      "tanzfläche",
      "tanzflaeche",
      "dance floor",
      "platz zum tanzen",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_feature",
    "dj_equipment",
    [
      "dj anlage",
      "dj equipment",
      "dj ausstattung",
      "dj technik",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_feature",
    "sound_system",
    [
      "musikanlage",
      "soundsystem",
      "sound system",
      "lautsprecheranlage",
      "beschallungsanlage",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_feature",
    "microphone",
    [
      "mikrofon",
      "mikrofone",
      "microphone",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_feature",
    "stage",
    [
      "bühne",
      "buehne",
      "eventbühne",
      "eventbuehne",
      "stage",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_feature",
    "projector",
    [
      "beamer",
      "projektor",
      "projector",
      "leinwand",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_service",
    "catering",
    [
      "catering",
      "cateringservice",
      "catering service",
      "event catering",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_service",
    "event_planning",
    [
      "eventplanung",
      "event planung",
      "veranstaltungsplanung",
      "event planner",
      "eventplanung vor ort",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_service",
    "wedding_planner",
    [
      "hochzeitsplaner",
      "hochzeitsplanerin",
      "wedding planner",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_service",
    "decoration",
    [
      "dekoration",
      "eventdekoration",
      "hochzeitsdekoration",
      "deko service",
      "decoration service",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_service",
    "photographer",
    [
      "fotograf",
      "fotografin",
      "hochzeitsfotograf",
      "eventfotograf",
      "photographer",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_feature",
    "large_dining_table",
    [
      "großer esstisch",
      "grosser esstisch",
      "große tafel",
      "grosse tafel",
      "langer esstisch",
      "large dining table",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_feature",
    "group_accommodation",
    [
      "gruppenunterkunft",
      "unterkunft für gruppe",
      "unterkunft fuer gruppe",
      "für große gruppen",
      "fuer grosse gruppen",
      "group accommodation",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "event_feature",
    "multiple_units",
    [
      "mehrere apartments",
      "mehrere appartements",
      "mehrere ferienwohnungen",
      "mehrere häuser",
      "mehrere haeuser",
      "mehrere unterkünfte",
      "mehrere unterkuenfte",
    ]
  );

  const hasEventContext =
  params.has("event_type") ||
  params.has("event_feature") ||
  params.has("event_service");

if (hasEventContext) {
  const eventGuestsMatch = normalizedText.match(
    /(?:für|fuer|mit)\s*(\d+)\s*(?:gäste|gaeste|personen|leute|teilnehmer)/i
  );

  if (eventGuestsMatch) {
    const guests = Number(eventGuestsMatch[1]);

    if (Number.isFinite(guests) && guests > 0) {
      params.set("event_min_capacity", String(guests));
    }
  }
}
}

// =========================================================
// 2. LANGZEITAUFENTHALT, MONATSMIETE & TEMPORÄRES WOHNEN
// =========================================================

function parseLongStay(
  normalizedText: string,
  params: SearchParams
) {
  appendIfAny(
    normalizedText,
    params,
    "stay_type",
    "long_stay",
    [
      "langzeitaufenthalt",
      "langzeit aufenthalt",
      "längerer aufenthalt",
      "laengerer aufenthalt",
      "long stay",
      "longstay",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "stay_type",
    "temporary_living",
    [
      "wohnen auf zeit",
      "temporäres wohnen",
      "temporaeres wohnen",
      "zeitwohnen",
      "temporary housing",
      "temporary living",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "stay_type",
    "monthly_rental",
    [
      "monatsmiete",
      "monatlich mieten",
      "für einen monat mieten",
      "fuer einen monat mieten",
      "monthly rental",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "stay_type",
    "extended_stay",
    [
      "extended stay",
      "extended-stay",
      "mehrere wochen bleiben",
      "mehrere monate bleiben",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "long_stay_feature",
    "weekly_rate",
    [
      "wochenpreis",
      "wochenrate",
      "wochenrabatt",
      "weekly rate",
      "weekly discount",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "long_stay_feature",
    "monthly_rate",
    [
      "monatspreis",
      "monatsrate",
      "monatsrabatt",
      "monthly rate",
      "monthly discount",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "long_stay_feature",
    "long_stay_discount",
    [
      "langzeitrabatt",
      "rabatt bei langzeitaufenthalt",
      "rabatt für lange aufenthalte",
      "rabatt fuer lange aufenthalte",
      "long stay discount",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "long_stay_feature",
    "full_kitchen",
    [
      "voll ausgestattete küche",
      "voll ausgestattete kueche",
      "komplette küche",
      "komplette kueche",
      "full kitchen",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "long_stay_feature",
    "washing_machine",
    [
      "eigene waschmaschine",
      "waschmaschine",
      "washing machine",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "long_stay_feature",
    "dryer",
    [
      "trockner",
      "wäschetrockner",
      "waeschetrockner",
      "dryer",
      "tumble dryer",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "long_stay_feature",
    "laundry_room",
    [
      "waschküche",
      "waschkueche",
      "waschraum",
      "laundry room",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "long_stay_feature",
    "storage",
    [
      "viel stauraum",
      "abstellraum",
      "lagerraum",
      "storage room",
      "storage space",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "long_stay_feature",
    "wardrobe",
    [
      "großer kleiderschrank",
      "grosser kleiderschrank",
      "viel kleiderschrank",
      "large wardrobe",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "long_stay_feature",
    "mailbox",
    [
      "briefkasten",
      "eigener briefkasten",
      "mailbox",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "long_stay_feature",
    "registration_possible",
    [
      "anmeldung möglich",
      "anmeldung moeglich",
      "wohnsitz anmelden",
      "meldeadresse",
      "registration possible",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "long_stay_feature",
    "workspace",
    [
      "arbeitsplatz für längeren aufenthalt",
      "arbeitsplatz fuer laengeren aufenthalt",
      "homeoffice möglich",
      "homeoffice moeglich",
      "workspace",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "long_stay_feature",
    "high_speed_internet",
    [
      "stabiles internet",
      "schnelles internet",
      "schnelles wlan",
      "high speed internet",
      "high-speed internet",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "long_stay_service",
    "regular_cleaning",
    [
      "regelmäßige reinigung",
      "regelmaessige reinigung",
      "wöchentliche reinigung",
      "woechentliche reinigung",
      "regular cleaning",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "long_stay_service",
    "linen_service",
    [
      "bettwäsche service",
      "bettwaesche service",
      "bettwäschewechsel",
      "bettwaeschewechsel",
      "linen service",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "long_stay_preference",
    "residential_feeling",
    [
      "wie zuhause",
      "wohnlich",
      "zum wohnen geeignet",
      "für längeres wohnen",
      "fuer laengeres wohnen",
      "home away from home",
    ]
  );

  const monthMatch = normalizedText.match(
    /(?:für|fuer)?\s*(\d+)\s*(?:monat|monate|monaten)/i
  );

  if (monthMatch) {
    const months = Number(monthMatch[1]);

    if (Number.isFinite(months) && months > 0) {
      params.append("stay_months", String(months));
      params.append("stay_type", "long_stay");
    }
  }
}


// =========================================================
// 3. BESONDERE ERLEBNISSE & AUSSERGEWÖHNLICHE UNTERKÜNFTE
// =========================================================

function parseUniqueStays(
  normalizedText: string,
  params: SearchParams
) {
  appendIfAny(
    normalizedText,
    params,
    "unique_stay_preference",
    "unique",
    [
      "außergewöhnliche unterkunft",
      "aussergewoehnliche unterkunft",
      "besondere unterkunft",
      "ungewöhnliche unterkunft",
      "ungewoehnliche unterkunft",
      "einzigartige unterkunft",
      "unique stay",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "treehouse",
    [
      "baumhaus",
      "treehouse",
      "tree house",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "tiny_house",
    [
      "tiny house",
      "tinyhouse",
      "minihaus",
      "kleinsthaus",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "houseboat",
    [
      "hausboot",
      "houseboat",
      "wohnboot",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "boat",
    [
      "übernachten auf einem boot",
      "uebernachten auf einem boot",
      "bootsunterkunft",
      "boat stay",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "yacht",
    [
      "übernachten auf einer yacht",
      "uebernachten auf einer yacht",
      "yacht unterkunft",
      "yacht stay",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "lighthouse",
    [
      "leuchtturm",
      "leuchtturmhotel",
      "im leuchtturm",
      "lighthouse stay",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "windmill",
    [
      "windmühle",
      "windmuehle",
      "übernachten in einer windmühle",
      "uebernachten in einer windmuehle",
      "windmill stay",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "watermill",
    [
      "wassermühle",
      "wassermuehle",
      "watermill",
      "water mill",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "cave",
    [
      "höhlenhotel",
      "hoehlenhotel",
      "höhlenunterkunft",
      "hoehlenunterkunft",
      "höhle",
      "hoehle",
      "cave hotel",
      "cave stay",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "igloo",
    [
      "iglu",
      "igloo",
      "iglu hotel",
      "igloo hotel",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "ice_hotel",
    [
      "eishotel",
      "ice hotel",
      "hotel aus eis",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "glass_igloo",
    [
      "glasiglu",
      "glas iglu",
      "glass igloo",
      "glaskuppel",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "dome",
    [
      "kuppelzelt",
      "geodätische kuppel",
      "geodaetische kuppel",
      "glamping dome",
      "geodesic dome",
      "dome stay",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "bubble_tent",
    [
      "bubble tent",
      "bubble hotel",
      "blasenhotel",
      "transparentes zelt",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "safari_tent",
    [
      "safarizelt",
      "safari zelt",
      "safari tent",
    ]
  );

  if (
  containsAnyWholeTerm(normalizedText, [
    "jurte",
    "yurt",
    "ger",
  ])
) {
  params.append("unique_stay_type", "yurt");
}

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "teepee",
    [
      "tipi",
      "teepee",
      "tepee",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "shepherd_hut",
    [
      "schäferwagen",
      "schaeferwagen",
      "shepherd hut",
      "shepherds hut",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "wagon",
    [
      "bauwagen",
      "zirkuswagen",
      "wohnwagen feststehend",
      "wagon stay",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "railway_carriage",
    [
      "zugwaggon",
      "zugwagon",
      "eisenbahnwaggon",
      "train carriage",
      "railway carriage",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "airplane",
    [
      "flugzeughotel",
      "übernachten im flugzeug",
      "uebernachten im flugzeug",
      "airplane hotel",
      "plane stay",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "bus",
    [
      "bus hotel",
      "übernachten im bus",
      "uebernachten im bus",
      "converted bus",
      "bus stay",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "container",
    [
      "containerhaus",
      "container hotel",
      "containerunterkunft",
      "shipping container",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "castle",
    [
      "schlosshotel",
      "übernachten im schloss",
      "uebernachten im schloss",
      "castle stay",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "monastery",
    [
      "klosterhotel",
      "im kloster übernachten",
      "im kloster uebernachten",
      "klosterunterkunft",
      "monastery stay",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "church",
    [
      "kirche als unterkunft",
      "umgebaute kirche",
      "church conversion",
      "church stay",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "farm",
    [
      "bauernhofurlaub",
      "bauernhof",
      "urlaub auf dem bauernhof",
      "farm stay",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "vineyard",
    [
      "weingut",
      "übernachten im weingut",
      "uebernachten im weingut",
      "weinberg unterkunft",
      "vineyard stay",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "desert_camp",
    [
      "wüstencamp",
      "wuestencamp",
      "wüstenzelt",
      "wuestenzelt",
      "desert camp",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "floating_house",
    [
      "schwimmendes haus",
      "floating house",
      "floating home",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "underwater_hotel",
    [
      "unterwasserhotel",
      "unterwasser hotel",
      "underwater hotel",
      "unterwasserzimmer",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_type",
    "overwater_bungalow",
    [
      "overwater bungalow",
      "wasserbungalow",
      "bungalow über dem wasser",
      "bungalow ueber dem wasser",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_feature",
    "stargazing",
    [
      "sterne beobachten",
      "sternenhimmel",
      "stargazing",
      "blick auf den sternenhimmel",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "unique_stay_feature",
    "northern_lights",
    [
      "nordlichter",
      "polarlichter",
      "aurora borealis",
      "northern lights",
    ]
  );
}


// =========================================================
// 4. KLIMA, WETTER & SAISONWÜNSCHE
// =========================================================

function parseClimate(
  normalizedText: string,
  params: SearchParams
) {
  appendIfAny(
    normalizedText,
    params,
    "climate_preference",
    "warm",
    [
      "warmes wetter",
      "warm",
      "möglichst warm",
      "moeglichst warm",
      "warm climate",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "climate_preference",
    "hot",
    [
      "heiß",
      "heiss",
      "sehr warm",
      "heiße region",
      "heisse region",
      "hot climate",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "climate_preference",
    "mild",
    [
      "mildes klima",
      "milde temperaturen",
      "nicht zu heiß",
      "nicht zu heiss",
      "mild climate",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "climate_preference",
    "cool",
    [
      "kühles klima",
      "kuehles klima",
      "kühl",
      "kuehl",
      "cool climate",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "climate_preference",
    "dry",
    [
      "trockenes klima",
      "wenig regen",
      "regenarm",
      "trocken",
      "dry climate",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "climate_preference",
    "sunny",
    [
      "viel sonne",
      "sonnig",
      "sonnensicher",
      "viele sonnenstunden",
      "sunny",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "climate_preference",
    "winter_sun",
    [
      "wintersonne",
      "sonne im winter",
      "warmer winterurlaub",
      "winter sun",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "climate_preference",
    "snow_reliable",
    [
      "schneesicher",
      "schneesichere region",
      "garantiert schnee",
      "snow reliable",
      "snow sure",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "climate_preference",
    "snowy",
    [
      "viel schnee",
      "verschneit",
      "winterlandschaft",
      "snowy",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "season_preference",
    "spring",
    [
      "frühlingsurlaub",
      "fruehlingsurlaub",
      "im frühling",
      "im fruehling",
      "spring holiday",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "season_preference",
    "summer",
    [
      "sommerurlaub",
      "im sommer",
      "summer holiday",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "season_preference",
    "autumn",
    [
      "herbsturlaub",
      "im herbst",
      "autumn holiday",
      "fall vacation",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "season_preference",
    "winter",
    [
      "winterurlaub",
      "im winter",
      "winter holiday",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "climate_feature",
    "air_conditioning",
    [
      "klimaanlage",
      "klimatisiert",
      "air conditioning",
      "aircondition",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "climate_feature",
    "ceiling_fan",
    [
      "deckenventilator",
      "ventilator an der decke",
      "ceiling fan",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "climate_feature",
    "heating",
    [
      "heizung",
      "gut beheizt",
      "heizbare räume",
      "heizbare raeume",
      "heating",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "climate_feature",
    "underfloor_heating",
    [
      "fußbodenheizung",
      "fussbodenheizung",
      "underfloor heating",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "climate_feature",
    "fireplace",
    [
      "kamin",
      "offener kamin",
      "fireplace",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "climate_feature",
    "heated_pool",
    [
      "beheizter pool",
      "beheiztes schwimmbecken",
      "heated pool",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "climate_feature",
    "indoor_pool",
    [
      "innenpool",
      "hallenbad",
      "indoor pool",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "climate_feature",
    "shade",
    [
      "viel schatten",
      "schattiger garten",
      "schattige terrasse",
      "schattige plätze",
      "schattige plaetze",
      "shade",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "climate_feature",
    "sunny_balcony",
    [
      "sonniger balkon",
      "sonnenbalkon",
      "sunny balcony",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "climate_feature",
    "sunny_terrace",
    [
      "sonnige terrasse",
      "sonnenterrasse",
      "sunny terrace",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "climate_feature",
    "covered_terrace",
    [
      "überdachte terrasse",
      "ueberdachte terrasse",
      "covered terrace",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "climate_feature",
    "wind_protected",
    [
      "windgeschützt",
      "windgeschuetzt",
      "windstille terrasse",
      "wind protected",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "climate_feature",
    "rain_protected",
    [
      "regengeschützt",
      "regengeschuetzt",
      "überdachter außenbereich",
      "ueberdachter aussenbereich",
      "rain protected",
    ]
  );
}


// =========================================================
// 5. RUHE, LÄRM & SCHLAFKOMFORT
// =========================================================

function parseSleepComfort(
  normalizedText: string,
  params: SearchParams
) {
  appendIfAny(
    normalizedText,
    params,
    "sleep_preference",
    "quiet",
    [
      "ruhige unterkunft",
      "ruhiges hotel",
      "sehr ruhig",
      "ruhige nacht",
      "quiet accommodation",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "sleep_preference",
    "very_quiet",
    [
      "absolute ruhe",
      "besonders ruhig",
      "extrem ruhig",
      "kein lärm",
      "kein laerm",
      "very quiet",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "sleep_preference",
    "quiet_room",
    [
      "ruhiges zimmer",
      "zimmer zur ruhigen seite",
      "quiet room",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "sleep_feature",
    "soundproof_rooms",
    [
      "schallisoliert",
      "schallisolierte zimmer",
      "schallschutz",
      "soundproof",
      "soundproof rooms",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "sleep_feature",
    "soundproof_windows",
    [
      "schallschutzfenster",
      "schallisolierte fenster",
      "soundproof windows",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "sleep_feature",
    "blackout_curtains",
    [
      "verdunkelungsvorhänge",
      "verdunkelungsvorhaenge",
      "verdunklungsvorhänge",
      "verdunklungsvorhaenge",
      "blackout curtains",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "sleep_feature",
    "blackout_blinds",
    [
      "verdunkelungsrollo",
      "verdunkelungsrollläden",
      "verdunkelungsrolllaeden",
      "blackout blinds",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "sleep_feature",
    "comfortable_bed",
    [
      "bequemes bett",
      "komfortables bett",
      "sehr gutes bett",
      "comfortable bed",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "sleep_feature",
    "premium_mattress",
    [
      "hochwertige matratze",
      "premium matratze",
      "luxusmatratze",
      "premium mattress",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "sleep_feature",
    "firm_mattress",
    [
      "harte matratze",
      "feste matratze",
      "firm mattress",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "sleep_feature",
    "soft_mattress",
    [
      "weiche matratze",
      "soft mattress",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "sleep_feature",
    "orthopedic_mattress",
    [
      "orthopädische matratze",
      "orthopaedische matratze",
      "orthopedic mattress",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "sleep_feature",
    "king_bed",
    [
      "king size bett",
      "king-size-bett",
      "kingsize bett",
      "king bed",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "sleep_feature",
    "queen_bed",
    [
      "queen size bett",
      "queen-size-bett",
      "queensize bett",
      "queen bed",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "sleep_feature",
    "extra_long_bed",
    [
      "extra langes bett",
      "überlanges bett",
      "ueberlanges bett",
      "extra long bed",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "sleep_feature",
    "pillow_menu",
    [
      "kissenmenü",
      "kissenmenue",
      "kissenauswahl",
      "pillow menu",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "sleep_feature",
    "memory_foam_pillow",
    [
      "memory foam kissen",
      "visco kissen",
      "viskokissen",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "sleep_feature",
    "hypoallergenic_bedding",
    [
      "allergiker bettwäsche",
      "allergiker bettwaesche",
      "hypoallergene bettwäsche",
      "hypoallergene bettwaesche",
      "hypoallergenic bedding",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "sleep_feature",
    "air_purifier",
    [
      "luftreiniger",
      "air purifier",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "sleep_feature",
    "mosquito_net",
    [
      "moskitonetz",
      "mückennetz",
      "mueckennetz",
      "mosquito net",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "sleep_feature",
    "quiet_air_conditioning",
    [
      "leise klimaanlage",
      "geräuscharme klimaanlage",
      "geraeuscharme klimaanlage",
      "quiet air conditioning",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "sleep_location",
    "away_from_street",
    [
      "nicht an der hauptstraße",
      "nicht an der hauptstrasse",
      "weg von der straße",
      "weg von der strasse",
      "away from main road",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "sleep_location",
    "away_from_nightlife",
    [
      "weg vom nachtleben",
      "nicht bei clubs",
      "nicht bei bars",
      "away from nightlife",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "sleep_location",
    "no_traffic_noise",
    [
      "kein verkehrslärm",
      "kein verkehrslaerm",
      "ohne straßenlärm",
      "ohne strassenlaerm",
      "no traffic noise",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "sleep_location",
    "no_aircraft_noise",
    [
      "kein fluglärm",
      "kein fluglaerm",
      "ohne fluglärm",
      "ohne fluglaerm",
      "no aircraft noise",
    ]
  );
}


// =========================================================
// 6. AUSSTATTUNG & KOMFORT ERWEITERT
// =========================================================

function parseExtendedAmenities(
  normalizedText: string,
  params: SearchParams
) {
  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "coffee_machine",
    [
      "kaffeemaschine",
      "coffee machine",
      "kaffeeautomat",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "espresso_machine",
    [
      "espressomaschine",
      "espresso machine",
      "nespressomaschine",
      "nespresso",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "kettle",
    [
      "wasserkocher",
      "kettle",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "microwave",
    [
      "mikrowelle",
      "microwave",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "oven",
    [
      "backofen",
      "ofen in der küche",
      "ofen in der kueche",
      "oven",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "stove",
    [
      "herd",
      "kochfeld",
      "ceranfeld",
      "induktionsfeld",
      "stove",
      "cooktop",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "refrigerator",
    [
      "kühlschrank",
      "kuehlschrank",
      "refrigerator",
      "fridge",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "freezer",
    [
      "gefrierschrank",
      "gefrierfach",
      "freezer",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "dishwasher",
    [
      "geschirrspüler",
      "geschirrspueler",
      "spülmaschine",
      "spuelmaschine",
      "dishwasher",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "washing_machine",
    [
      "waschmaschine",
      "washing machine",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "dryer",
    [
      "wäschetrockner",
      "waeschetrockner",
      "trockner",
      "dryer",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "iron",
    [
      "bügeleisen",
      "buegeleisen",
      "iron",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "ironing_board",
    [
      "bügelbrett",
      "buegelbrett",
      "ironing board",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "hair_dryer",
    [
      "föhn",
      "foehn",
      "haartrockner",
      "hair dryer",
      "hairdryer",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "smart_tv",
    [
      "smart tv",
      "smart-tv",
      "internet tv",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "streaming",
    [
      "netflix",
      "streaming",
      "streamingdienste",
      "streaming services",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "bluetooth_speaker",
    [
      "bluetooth lautsprecher",
      "bluetooth speaker",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "usb_charging",
    [
      "usb anschluss",
      "usb anschlüsse",
      "usb anschluesse",
      "usb charging",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "usb_c_charging",
    [
      "usb c",
      "usb-c",
      "usb c anschluss",
      "usb-c anschluss",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "wireless_charging",
    [
      "kabelloses laden",
      "wireless charging",
      "induktives laden",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "multiple_power_outlets",
    [
      "viele steckdosen",
      "steckdosen am bett",
      "mehrere steckdosen",
      "multiple power outlets",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "desk",
    [
      "schreibtisch",
      "desk",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "comfortable_chair",
    [
      "bequemer stuhl",
      "komfortabler stuhl",
      "comfortable chair",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "sofa",
    [
      "sofa",
      "couch",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "sofa_bed",
    [
      "schlafsofa",
      "sofabett",
      "sofa bed",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "dining_area",
    [
      "essbereich",
      "essecke",
      "dining area",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "wardrobe",
    [
      "kleiderschrank",
      "wardrobe",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "walk_in_closet",
    [
      "ankleidezimmer",
      "begehbarer kleiderschrank",
      "walk in closet",
      "walk-in closet",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "safe",
    [
      "safe",
      "tresor",
      "zimmersafe",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "full_length_mirror",
    [
      "ganzkörperspiegel",
      "ganzkoerperspiegel",
      "großer spiegel",
      "grosser spiegel",
      "full length mirror",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "bathrobe",
    [
      "bademantel",
      "bademäntel",
      "bademaentel",
      "bathrobe",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "slippers",
    [
      "hausschuhe",
      "badeschuhe",
      "slippers",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "premium_toiletries",
    [
      "hochwertige pflegeprodukte",
      "luxus pflegeprodukte",
      "premium toiletries",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "rain_shower",
    [
      "regendusche",
      "rain shower",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "bathtub",
    [
      "badewanne",
      "bathtub",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "freestanding_bathtub",
    [
      "freistehende badewanne",
      "freestanding bathtub",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "double_sink",
    [
      "doppelwaschbecken",
      "zwei waschbecken",
      "double sink",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "separate_toilet",
    [
      "separate toilette",
      "separates wc",
      "separate toilet",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "private_entrance",
    [
      "privater eingang",
      "eigener eingang",
      "separater eingang",
      "private entrance",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "balcony",
    [
      "balkon",
      "balcony",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "terrace",
    [
      "terrasse",
      "terrace",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "private_garden",
    [
      "privater garten",
      "eigener garten",
      "private garden",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "outdoor_furniture",
    [
      "gartenmöbel",
      "gartenmoebel",
      "terrassenmöbel",
      "terrassenmoebel",
      "outdoor furniture",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "sun_loungers",
    [
      "sonnenliegen",
      "liegestühle",
      "liegestuehle",
      "sun loungers",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "hammock",
    [
      "hängematte",
      "haengematte",
      "hammock",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "amenity",
    "bbq",
    [
      "grill",
      "grillmöglichkeit",
      "grillmoeglichkeit",
      "barbecue",
      "bbq",
    ]
  );
}


// =========================================================
// 7. SERVICE & HOTELKOMFORT ERWEITERT
// =========================================================

function parseHotelServices(
  normalizedText: string,
  params: SearchParams
) {
  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "reception_24h",
    [
      "24h rezeption",
      "24 stunden rezeption",
      "24/7 rezeption",
      "24 hour reception",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "concierge",
    [
      "concierge",
      "concierge service",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "room_service",
    [
      "zimmerservice",
      "room service",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "room_service_24h",
    [
      "24h zimmerservice",
      "24 stunden zimmerservice",
      "24/7 room service",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "daily_housekeeping",
    [
      "tägliche reinigung",
      "taegliche reinigung",
      "tägliches housekeeping",
      "taegliches housekeeping",
      "daily housekeeping",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "cleaning_on_request",
    [
      "reinigung auf wunsch",
      "zimmerreinigung auf wunsch",
      "cleaning on request",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "laundry_service",
    [
      "wäscheservice",
      "waescheservice",
      "wäschedienst",
      "waeschedienst",
      "laundry service",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "dry_cleaning",
    [
      "reinigung von kleidung",
      "chemische reinigung",
      "dry cleaning",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "ironing_service",
    [
      "bügelservice",
      "buegelservice",
      "ironing service",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "luggage_storage",
    [
      "gepäckaufbewahrung",
      "gepaeckaufbewahrung",
      "koffer aufbewahren",
      "luggage storage",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "porter",
    [
      "gepäckträger",
      "gepaecktraeger",
      "portier für gepäck",
      "portier fuer gepaeck",
      "porter service",
      "bellboy",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "wake_up_service",
    [
      "weckservice",
      "weckruf",
      "wake up service",
      "wake-up service",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "airport_shuttle",
    [
      "flughafenshuttle",
      "flughafen shuttle",
      "airport shuttle",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "train_station_shuttle",
    [
      "bahnhof shuttle",
      "bahnhofshuttle",
      "train station shuttle",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "private_transfer",
    [
      "privater transfer",
      "privattransfer",
      "private transfer",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "car_rental",
    [
      "mietwagenservice",
      "autovermietung",
      "mietwagen vor ort",
      "car rental",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "bike_rental",
    [
      "fahrradverleih",
      "fahrrad mieten",
      "bike rental",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "valet_parking",
    [
      "valet parking",
      "parkservice",
      "wagenmeister",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "breakfast_in_room",
    [
      "frühstück im zimmer",
      "fruehstueck im zimmer",
      "breakfast in room",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "grocery_delivery",
    [
      "lebensmittellieferung",
      "einkaufsservice",
      "lebensmittel geliefert",
      "grocery delivery",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "personal_shopper",
    [
      "einkaufsservice persönlich",
      "einkaufsservice persoenlich",
      "personal shopper",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "babysitting",
    [
      "babysitter",
      "babysitting",
      "kinderbetreuung",
      "childcare",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "pet_sitting",
    [
      "hundebetreuung",
      "haustierbetreuung",
      "pet sitting",
      "dog sitting",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "tour_desk",
    [
      "ausflugsschalter",
      "tourenschalter",
      "tour desk",
      "ausflüge buchen",
      "ausfluege buchen",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "ticket_service",
    [
      "ticketservice",
      "tickets buchen",
      "ticket service",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "currency_exchange",
    [
      "geldwechsel",
      "währungswechsel",
      "waehrungswechsel",
      "currency exchange",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "multilingual_staff",
    [
      "mehrsprachiges personal",
      "deutschsprachiges personal",
      "englischsprachiges personal",
      "multilingual staff",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "express_check_in",
    [
      "express check in",
      "express check-in",
      "schneller check in",
      "schneller check-in",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "self_check_in",
    [
      "self check in",
      "self check-in",
      "selbst einchecken",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "contactless_check_in",
    [
      "kontaktloser check in",
      "kontaktloser check-in",
      "contactless check-in",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "early_check_in",
    [
      "early check in",
      "early check-in",
      "früher check in",
      "frueher check in",
      "früh einchecken",
      "frueh einchecken",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "hotel_service",
    "late_check_out",
    [
      "late check out",
      "late check-out",
      "später check out",
      "spaeter check out",
      "spät auschecken",
      "spaet auschecken",
    ]
  );
}


// =========================================================
// 8. BUCHUNGSBEDINGUNGEN & FLEXIBILITÄT
// =========================================================

function parseBookingFlexibility(
  normalizedText: string,
  params: SearchParams
) {
  appendIfAny(
    normalizedText,
    params,
    "booking_preference",
    "free_cancellation",
    [
      "kostenlose stornierung",
      "kostenfrei stornierbar",
      "gratis stornierung",
      "free cancellation",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "booking_preference",
    "flexible_cancellation",
    [
      "flexibel stornierbar",
      "flexible stornierung",
      "flexible cancellation",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "booking_preference",
    "no_prepayment",
    [
      "keine vorauszahlung",
      "ohne vorauszahlung",
      "keine anzahlung",
      "ohne anzahlung",
      "no prepayment",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "booking_preference",
    "pay_at_property",
    [
      "vor ort bezahlen",
      "zahlung vor ort",
      "erst im hotel bezahlen",
      "pay at property",
      "pay at hotel",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "booking_preference",
    "pay_later",
    [
      "später bezahlen",
      "spaeter bezahlen",
      "erst später bezahlen",
      "erst spaeter bezahlen",
      "pay later",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "booking_preference",
    "refundable",
    [
      "erstattbar",
      "rückerstattbar",
      "rueckerstattbar",
      "refundable",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "booking_preference",
    "last_minute",
    [
      "last minute",
      "last-minute",
      "kurzfristig buchbar",
      "spontan buchbar",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "booking_preference",
    "same_day_booking",
    [
      "heute noch buchbar",
      "buchung am gleichen tag",
      "same day booking",
      "same-day booking",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "booking_preference",
    "instant_booking",
    [
      "sofort buchbar",
      "sofortbuchung",
      "instant booking",
      "instant book",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "booking_preference",
    "instant_confirmation",
    [
      "sofortige bestätigung",
      "sofortige bestaetigung",
      "direkte bestätigung",
      "direkte bestaetigung",
      "instant confirmation",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "booking_preference",
    "flexible_dates",
    [
      "flexible daten",
      "datum flexibel",
      "reisezeit flexibel",
      "zeitlich flexibel",
      "flexible dates",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "booking_preference",
    "flexible_arrival",
    [
      "flexible anreise",
      "flexibler anreisetag",
      "flexible arrival",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "booking_preference",
    "flexible_departure",
    [
      "flexible abreise",
      "flexibler abreisetag",
      "flexible departure",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "booking_preference",
    "no_minimum_stay",
    [
      "kein mindestaufenthalt",
      "keine mindestnächte",
      "keine mindestnaechte",
      "no minimum stay",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "booking_preference",
    "one_night_possible",
    [
      "eine nacht möglich",
      "eine nacht moeglich",
      "nur eine nacht",
      "1 nacht möglich",
      "1 nacht moeglich",
      "one night stay",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "booking_preference",
    "long_stay_allowed",
    [
      "langzeitaufenthalt möglich",
      "langzeitaufenthalt moeglich",
      "lange aufenthalte möglich",
      "lange aufenthalte moeglich",
      "long stay allowed",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "booking_preference",
    "invoice_available",
    [
      "rechnung möglich",
      "rechnung moeglich",
      "rechnung erhältlich",
      "rechnung erhaeltlich",
      "invoice available",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "booking_preference",
    "business_invoice",
    [
      "firmenrechnung",
      "rechnung für firma",
      "rechnung fuer firma",
      "business invoice",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "booking_preference",
    "deposit_not_required",
    [
      "keine kaution",
      "ohne kaution",
      "no deposit",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "booking_preference",
    "low_deposit",
    [
      "niedrige kaution",
      "geringe kaution",
      "low deposit",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "booking_preference",
    "credit_card_not_required",
    [
      "keine kreditkarte erforderlich",
      "ohne kreditkarte buchbar",
      "no credit card required",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "booking_preference",
    "change_booking_possible",
    [
      "umbuchung möglich",
      "umbuchung moeglich",
      "kostenlos umbuchen",
      "buchung ändern",
      "buchung aendern",
      "change booking",
    ]
  );

  appendIfAny(
    normalizedText,
    params,
    "booking_preference",
    "price_match",
    [
      "bestpreisgarantie",
      "preisgarantie",
      "price match",
      "best price guarantee",
    ]
  );
}


// =========================================================
// 9. NEGATIVE WÜNSCHE & AUSSCHLÜSSE
// =========================================================

function parseExclusions(
  normalizedText: string,
  params: SearchParams
) {
  const excludeAccommodation = (
    value: string,
    terms: string[]
  ) => {
    if (includesAny(normalizedText, terms)) {
      params.append("exclude_accommodation_type", value);
    }
  };

  const excludeFeature = (
    value: string,
    terms: string[]
  ) => {
    if (includesAny(normalizedText, terms)) {
      params.append("exclude_feature", value);
    }
  };

  const excludeLocation = (
    value: string,
    terms: string[]
  ) => {
    if (includesAny(normalizedText, terms)) {
      params.append("exclude_location_preference", value);
    }
  };


  // ---------------------------------------------------------
  // UNTERKUNFTSARTEN AUSSCHLIESSEN
  // ---------------------------------------------------------

  excludeAccommodation("hotel", [
    "kein hotel",
    "keine hotels",
    "nicht im hotel",
    "kein klassisches hotel",
    "ohne hotel",
  ]);

  excludeAccommodation("hostel", [
    "kein hostel",
    "keine hostels",
    "nicht im hostel",
    "ohne hostel",
  ]);

  excludeAccommodation("resort", [
    "kein resort",
    "keine resorts",
    "nicht im resort",
    "ohne resort",
  ]);

  excludeAccommodation("holiday_apartment", [
    "keine ferienwohnung",
    "keine ferienwohnungen",
    "keine ferienwohnung bitte",
    "nicht in einer ferienwohnung",
    "ohne ferienwohnung",
  ]);

  excludeAccommodation("apartment", [
    "kein apartment",
    "keine apartments",
    "kein appartement",
    "keine appartements",
  ]);

  excludeAccommodation("holiday_home", [
    "kein ferienhaus",
    "keine ferienhäuser",
    "keine ferienhaeuser",
    "ohne ferienhaus",
  ]);

  excludeAccommodation("villa", [
    "keine villa",
    "keine villen",
    "nicht in einer villa",
  ]);

  excludeAccommodation("campsite", [
    "kein camping",
    "kein campingplatz",
    "keine campingplätze",
    "keine campingplaetze",
    "nicht campen",
  ]);

  excludeAccommodation("glamping", [
    "kein glamping",
    "nicht glampen",
    "keine glamping unterkunft",
  ]);

  excludeAccommodation("guesthouse", [
    "keine pension",
    "kein gästehaus",
    "kein gaestehaus",
    "keine pensionen",
  ]);

  excludeAccommodation("bed_and_breakfast", [
    "kein bed and breakfast",
    "kein b&b",
    "kein b und b",
  ]);

  excludeAccommodation("bungalow", [
    "kein bungalow",
    "keine bungalows",
  ]);

  excludeAccommodation("chalet", [
    "kein chalet",
    "keine chalets",
  ]);

  excludeAccommodation("cabin", [
    "keine hütte",
    "keine huette",
    "keine hütte bitte",
    "keine huette bitte",
  ]);


  // ---------------------------------------------------------
  // GEMEINSCHAFTSBEREICHE / PRIVATSPHÄRE
  // ---------------------------------------------------------

  excludeFeature("shared_bathroom", [
    "kein gemeinschaftsbad",
    "kein gemeinsames bad",
    "kein geteiltes bad",
    "bad nicht teilen",
    "ohne gemeinschaftsbad",
  ]);

  excludeFeature("shared_kitchen", [
    "keine gemeinschaftsküche",
    "keine gemeinschaftskueche",
    "keine gemeinsame küche",
    "keine gemeinsame kueche",
    "küche nicht teilen",
    "kueche nicht teilen",
  ]);

  excludeFeature("shared_room", [
    "kein gemeinschaftszimmer",
    "kein mehrbettzimmer",
    "kein schlafsaal",
    "kein dorm",
    "kein dormitory",
  ]);

  excludeFeature("shared_pool", [
    "kein gemeinschaftspool",
    "kein geteilter pool",
    "pool nicht teilen",
  ]);


  // ---------------------------------------------------------
  // KINDER / FAMILIEN
  // ---------------------------------------------------------

  excludeFeature("children", [
    "keine kinder",
    "ohne kinder",
    "kinderfrei",
    "keine familien mit kindern",
    "nicht mit kindern",
  ]);

  if (
    includesAny(normalizedText, [
      "nur erwachsene",
      "adults only",
      "adults-only",
      "kinderfreies hotel",
      "kinderfreies resort",
    ])
  ) {
    params.append("require_preference", "adults_only");
  }


  // ---------------------------------------------------------
  // HAUSTIERE
  // ---------------------------------------------------------

  excludeFeature("pets", [
    "keine haustiere",
    "ohne haustiere",
    "haustierfrei",
    "keine tiere",
    "pet free",
    "no pets",
  ]);

  excludeFeature("dogs", [
    "keine hunde",
    "ohne hunde",
    "hundefrei",
    "no dogs",
  ]);

  excludeFeature("cats", [
    "keine katzen",
    "ohne katzen",
    "katzenfrei",
    "no cats",
  ]);


  // ---------------------------------------------------------
  // RAUCHEN
  // ---------------------------------------------------------

  excludeFeature("smoking", [
    "nicht rauchen",
    "kein rauchen",
    "rauchfrei",
    "nichtraucher",
    "keine raucherzimmer",
    "no smoking",
  ]);

  if (
    includesAny(normalizedText, [
      "raucherzimmer",
      "rauchen erlaubt",
      "smoking allowed",
    ])
  ) {
    params.append("require_feature", "smoking_allowed");
  }


  // ---------------------------------------------------------
  // PARTY / NACHTLEBEN / LÄRM
  // ---------------------------------------------------------

  excludeFeature("party", [
    "keine partys",
    "keine parties",
    "keine party",
    "ohne partys",
    "keine feiernden gäste",
    "keine feiernden gaeste",
  ]);

  excludeLocation("nightlife", [
    "nicht beim nachtleben",
    "nicht bei clubs",
    "nicht bei bars",
    "weg vom nachtleben",
    "kein nachtleben in der nähe",
    "kein nachtleben in der naehe",
  ]);

  excludeLocation("busy_area", [
    "nicht in belebter gegend",
    "keine belebte gegend",
    "nicht mitten im trubel",
    "weg vom trubel",
  ]);

  excludeLocation("main_road", [
    "nicht an der hauptstraße",
    "nicht an der hauptstrasse",
    "weg von der hauptstraße",
    "weg von der hauptstrasse",
  ]);

  excludeLocation("airport", [
    "nicht beim flughafen",
    "nicht in flughafennähe",
    "nicht in flughafennaehe",
    "weit weg vom flughafen",
  ]);


  // ---------------------------------------------------------
  // STADT / ZENTRUM
  // ---------------------------------------------------------

  excludeLocation("city_center", [
    "nicht im zentrum",
    "nicht im stadtzentrum",
    "nicht in der innenstadt",
    "außerhalb des zentrums",
    "ausserhalb des zentrums",
    "weg vom stadtzentrum",
  ]);

  excludeLocation("old_town", [
    "nicht in der altstadt",
    "außerhalb der altstadt",
    "ausserhalb der altstadt",
  ]);

  excludeLocation("urban", [
    "nicht in der stadt",
    "keine stadtlage",
    "raus aus der stadt",
    "nicht urban",
  ]);


  // ---------------------------------------------------------
  // STRAND / MEER / SEE / BERGE
  // ---------------------------------------------------------

  excludeLocation("beach", [
    "nicht am strand",
    "nicht in strandnähe",
    "nicht in strandnaehe",
    "kein strandurlaub",
  ]);

  excludeLocation("sea", [
    "nicht am meer",
    "nicht in meernähe",
    "nicht in meernaehe",
    "kein meer",
  ]);

  excludeLocation("lake", [
    "nicht am see",
    "nicht in seenähe",
    "nicht in seenähe",
    "kein see",
  ]);

  excludeLocation("mountains", [
    "nicht in den bergen",
    "keine bergregion",
    "nicht im gebirge",
  ]);

  excludeLocation("ski_area", [
    "kein skigebiet",
    "nicht im skigebiet",
    "kein skiurlaub",
  ]);


  // ---------------------------------------------------------
  // AUSSTATTUNG AUSSCHLIESSEN
  // ---------------------------------------------------------

  excludeFeature("pool", [
    "kein pool",
    "ohne pool",
    "pool nicht nötig",
    "pool nicht noetig",
    "brauche keinen pool",
  ]);

  excludeFeature("spa", [
    "kein spa",
    "ohne spa",
    "kein wellnessbereich",
    "wellness nicht nötig",
    "wellness nicht noetig",
  ]);

  excludeFeature("sauna", [
    "keine sauna",
    "ohne sauna",
    "sauna nicht nötig",
    "sauna nicht noetig",
  ]);

  excludeFeature("gym", [
    "kein fitnessstudio",
    "kein fitnessraum",
    "ohne gym",
    "gym nicht nötig",
    "gym nicht noetig",
  ]);

  excludeFeature("breakfast", [
    "kein frühstück",
    "kein fruehstueck",
    "ohne frühstück",
    "ohne fruehstueck",
    "frühstück nicht nötig",
    "fruehstueck nicht noetig",
  ]);

  excludeFeature("parking", [
    "kein parkplatz nötig",
    "kein parkplatz noetig",
    "brauche keinen parkplatz",
    "ohne parkplatz",
  ]);

  excludeFeature("air_conditioning", [
    "keine klimaanlage",
    "ohne klimaanlage",
    "klimaanlage nicht nötig",
    "klimaanlage nicht noetig",
  ]);

  excludeFeature("elevator", [
    "kein aufzug",
    "ohne aufzug",
    "aufzug nicht nötig",
    "aufzug nicht noetig",
  ]);

  excludeFeature("tv", [
    "kein fernseher",
    "kein tv",
    "ohne fernseher",
    "ohne tv",
  ]);

  excludeFeature("wifi", [
    "kein wlan",
    "kein wifi",
    "ohne wlan",
    "ohne internet",
  ]);


  // ---------------------------------------------------------
  // VERPFLEGUNG AUSSCHLIESSEN
  // ---------------------------------------------------------

  if (
    includesAny(normalizedText, [
      "keine halbpension",
      "ohne halbpension",
    ])
  ) {
    params.append("exclude_board", "half_board");
  }

  if (
    includesAny(normalizedText, [
      "keine vollpension",
      "ohne vollpension",
    ])
  ) {
    params.append("exclude_board", "full_board");
  }

  if (
    includesAny(normalizedText, [
      "kein all inclusive",
      "kein all-inclusive",
      "ohne all inclusive",
    ])
  ) {
    params.append("exclude_board", "all_inclusive");
  }

  if (
    includesAny(normalizedText, [
      "keine selbstverpflegung",
      "nicht selbst verpflegen",
    ])
  ) {
    params.append("exclude_board", "self_catering");
  }


  // ---------------------------------------------------------
  // PREIS / QUALITÄTS-AUSSCHLÜSSE
  // ---------------------------------------------------------

  if (
    includesAny(normalizedText, [
      "nicht luxuriös",
      "nicht luxurioes",
      "kein luxus",
      "kein luxushotel",
      "kein luxusresort",
    ])
  ) {
    params.append("exclude_preference", "luxury");
  }

  if (
    includesAny(normalizedText, [
      "nicht billig",
      "kein billighotel",
      "keine billige unterkunft",
    ])
  ) {
    params.append("exclude_preference", "budget");
  }


  // ---------------------------------------------------------
  // SPEZIELLE STILE AUSSCHLIESSEN
  // ---------------------------------------------------------

  if (
    includesAny(normalizedText, [
      "nicht modern",
      "kein modernes hotel",
      "kein moderner stil",
    ])
  ) {
    params.append("exclude_style", "modern");
  }

  if (
    includesAny(normalizedText, [
      "nicht rustikal",
      "kein rustikaler stil",
    ])
  ) {
    params.append("exclude_style", "rustic");
  }

  if (
    includesAny(normalizedText, [
      "kein boutiquehotel",
      "kein boutique hotel",
    ])
  ) {
    params.append("exclude_style", "boutique");
  }


  // ---------------------------------------------------------
  // NEGATIVE PRIORITÄT / "EGAL"
  // ---------------------------------------------------------

  if (
    includesAny(normalizedText, [
      "pool egal",
      "pool ist egal",
    ])
  ) {
    params.append("ignore_preference", "pool");
  }

  if (
    includesAny(normalizedText, [
      "frühstück egal",
      "fruehstueck egal",
      "frühstück ist egal",
      "fruehstueck ist egal",
    ])
  ) {
    params.append("ignore_preference", "breakfast");
  }

  if (
    includesAny(normalizedText, [
      "parkplatz egal",
      "parkplatz ist egal",
    ])
  ) {
    params.append("ignore_preference", "parking");
  }

  if (
    includesAny(normalizedText, [
      "lage egal",
      "die lage ist egal",
    ])
  ) {
    params.append("ignore_preference", "location");
  }

  if (
    includesAny(normalizedText, [
      "unterkunftsart egal",
      "art der unterkunft egal",
      "hotel oder ferienwohnung egal",
    ])
  ) {
    params.append("ignore_preference", "accommodation_type");
  }
}


// =========================================================
// HAUPTFUNKTION
// =========================================================

export function parseExtendedSearch(
  normalizedText: string,
  params: URLSearchParams
) {
  parseEvents(normalizedText, params);
  parseLongStay(normalizedText, params);
  parseUniqueStays(normalizedText, params);
  parseClimate(normalizedText, params);
  parseSleepComfort(normalizedText, params);
  parseExtendedAmenities(normalizedText, params);
  parseHotelServices(normalizedText, params);
  parseBookingFlexibility(normalizedText, params);
  parseExclusions(normalizedText, params);
}