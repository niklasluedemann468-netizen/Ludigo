import { containsAnyWholeTerm } from "./parserUtils";

export function parseSustainabilitySearch(
  normalizedText: string,
  params: URLSearchParams
) {
  // =========================================================
  // NACHHALTIGKEIT, UMWELT & ECO-TRAVEL
  // =========================================================

  const sustainabilityIncludesAny = (terms: string[]) =>
    terms.some((term) => normalizedText.includes(term));

  const sustainabilityAppendIfAny = (
    key: string,
    value: string,
    terms: string[]
  ) => {
    if (sustainabilityIncludesAny(terms)) {
      params.append(key, value);
    }
  };


  // =========================================================
  // NACHHALTIG ALLGEMEIN
  // =========================================================

  sustainabilityAppendIfAny("sustainability_preference", "sustainable", [
    "nachhaltig",
    "nachhaltige unterkunft",
    "nachhaltiges hotel",
    "nachhaltiger urlaub",
    "umweltfreundlich",
    "umweltschonend",
    "ökologisch",
    "oekologisch",
    "eco friendly",
    "eco-friendly",
    "sustainable hotel",
  ]);

  sustainabilityAppendIfAny("trip_style", "eco_trip", [
    "ökourlaub",
    "oekourlaub",
    "eco urlaub",
    "eco-urlaub",
    "nachhaltigkeitsreise",
    "nachhaltige reise",
    "nachhaltiger urlaub",
    "eco trip",
    "sustainable travel",
  ]);


  // =========================================================
  // ECO HOTEL
  // =========================================================

  sustainabilityAppendIfAny("sustainability_type", "eco_hotel", [
    "eco hotel",
    "eco-hotel",
    "ecohotel",
    "öko hotel",
    "oeko hotel",
    "ökohotel",
    "oekohotel",
    "umwelthotel",
  ]);


  // =========================================================
  // BIO HOTEL
  // =========================================================

  sustainabilityAppendIfAny("sustainability_type", "bio_hotel", [
    "bio hotel",
    "bio-hotel",
    "biohotel",
    "biounterkunft",
    "bio unterkunft",
  ]);


  // =========================================================
  // GREEN HOTEL
  // =========================================================

  sustainabilityAppendIfAny("sustainability_type", "green_hotel", [
    "green hotel",
    "greenhotel",
    "grünes hotel",
    "gruenes hotel",
    "grüne unterkunft",
    "gruene unterkunft",
  ]);


  // =========================================================
  // ECO RESORT
  // =========================================================

  sustainabilityAppendIfAny("sustainability_type", "eco_resort", [
    "eco resort",
    "eco-resort",
    "ecoresort",
    "öko resort",
    "oeko resort",
    "nachhaltiges resort",
  ]);


  // =========================================================
  // NACHHALTIGE BAUWEISE
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_feature",
    "sustainable_construction",
    [
      "nachhaltige bauweise",
      "ökologische bauweise",
      "oekologische bauweise",
      "umweltfreundliche bauweise",
      "nachhaltig gebaut",
      "ökologisch gebaut",
      "oekologisch gebaut",
    ]
  );


  // =========================================================
  // NATURMATERIALIEN
  // =========================================================

  sustainabilityAppendIfAny("sustainability_feature", "natural_materials", [
    "naturmaterialien",
    "natürliche materialien",
    "natuerliche materialien",
    "ökologische materialien",
    "oekologische materialien",
    "holzbau",
    "lehmputz",
  ]);


  // =========================================================
  // ENERGIEEFFIZIENT
  // =========================================================

  sustainabilityAppendIfAny("sustainability_feature", "energy_efficient", [
    "energieeffizient",
    "energieeffiziente unterkunft",
    "energiesparend",
    "niedriger energieverbrauch",
    "passivhaus",
    "passiv haus",
  ]);


  // =========================================================
  // ERNEUERBARE ENERGIEN
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_feature",
    "renewable_energy",
    [
      "erneuerbare energien",
      "erneuerbare energie",
      "strom aus erneuerbaren energien",
      "grünstrom",
      "gruenstrom",
      "ökostrom",
      "oekostrom",
      "green energy",
      "renewable energy",
    ]
  );


  // =========================================================
  // SOLARSTROM
  // =========================================================

  sustainabilityAppendIfAny("sustainability_feature", "solar_power", [
    "solarstrom",
    "solaranlage",
    "solarpanele",
    "solarpanels",
    "photovoltaik",
    "photovoltaikanlage",
    "pv anlage",
    "pv-anlage",
  ]);


  // =========================================================
  // SOLARTHERMIE
  // =========================================================

  sustainabilityAppendIfAny("sustainability_feature", "solar_thermal", [
    "solarthermie",
    "solare warmwasserbereitung",
    "warmwasser durch solar",
  ]);


  // =========================================================
  // WINDENERGIE
  // =========================================================

  sustainabilityAppendIfAny("sustainability_feature", "wind_energy", [
    "windenergie",
    "windstrom",
    "strom aus windkraft",
    "wind power",
  ]);


  // =========================================================
  // WÄRMEPUMPE
  // =========================================================

  sustainabilityAppendIfAny("sustainability_feature", "heat_pump", [
    "wärmepumpe",
    "waermepumpe",
    "heizen mit wärmepumpe",
    "heizen mit waermepumpe",
    "heat pump",
  ]);


  // =========================================================
  // GEOTHERMIE
  // =========================================================

  sustainabilityAppendIfAny("sustainability_feature", "geothermal_energy", [
    "geothermie",
    "erdwärme",
    "erdwaerme",
    "geothermal",
  ]);


  // =========================================================
  // E-AUTO-LADESTATION
  // =========================================================

  sustainabilityAppendIfAny("sustainability_feature", "ev_charging", [
    "e auto ladestation",
    "e-auto ladestation",
    "eauto ladestation",
    "elektroauto ladestation",
    "elektroauto laden",
    "ev charging",
    "ev charger",
    "wallbox",
  ]);


  // =========================================================
  // PRIVATE WALLBOX
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_feature",
    "private_ev_charger",
    [
      "private wallbox",
      "eigene wallbox",
      "private ladestation",
      "eigene e auto ladestation",
      "eigene e-auto ladestation",
    ]
  );


  // =========================================================
  // E-BIKE LADEN
  // =========================================================

  sustainabilityAppendIfAny("sustainability_feature", "ebike_charging", [
    "e bike laden",
    "e-bike laden",
    "ebike laden",
    "e bike ladestation",
    "e-bike ladestation",
    "ebike ladestation",
  ]);


  // =========================================================
  // FAHRRADFREUNDLICH
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_preference",
    "bicycle_friendly",
    [
      "fahrradfreundlich",
      "radfahrerfreundlich",
      "bike friendly",
      "bike-friendly",
    ]
  );


  // =========================================================
  // FAHRRADVERLEIH
  // =========================================================

  sustainabilityAppendIfAny("sustainability_service", "bicycle_rental", [
    "fahrradverleih",
    "fahrräder mieten",
    "fahrraeder mieten",
    "fahrrad mieten",
    "bike rental",
  ]);


  // =========================================================
  // E-BIKE VERLEIH
  // =========================================================

  sustainabilityAppendIfAny("sustainability_service", "ebike_rental", [
    "e bike verleih",
    "e-bike verleih",
    "ebike verleih",
    "e bike mieten",
    "e-bike mieten",
  ]);


  // =========================================================
  // ÖPNV
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_preference",
    "public_transport_friendly",
    [
      "gute öffentliche verkehrsanbindung",
      "gute oeffentliche verkehrsanbindung",
      "guter öpnv",
      "guter oepnv",
      "gut mit bus und bahn",
      "gut mit öffentlichen verkehrsmitteln",
      "gut mit oeffentlichen verkehrsmitteln",
    ]
  );


  // =========================================================
  // AUTO NICHT NÖTIG
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_preference",
    "car_not_needed",
    [
      "kein auto nötig",
      "kein auto noetig",
      "ohne auto",
      "auto nicht notwendig",
      "autofrei möglich",
      "autofrei moeglich",
      "alles ohne auto erreichbar",
    ]
  );


  // =========================================================
  // AUTOFREIE UNTERKUNFT / ANREISE
  // =========================================================

  sustainabilityAppendIfAny("sustainability_preference", "car_free", [
    "autofrei",
    "autofreie unterkunft",
    "autofreier urlaub",
    "car free",
    "car-free",
  ]);

  sustainabilityAppendIfAny(
    "sustainability_preference",
    "car_free_arrival",
    [
      "autofreie anreise",
      "ohne auto anreisen",
      "anreise ohne auto",
      "mit zug anreisen",
      "mit der bahn anreisen",
    ]
  );


  // =========================================================
  // SHUTTLE VOM BAHNHOF
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_service",
    "train_station_shuttle",
    [
      "bahnhof shuttle",
      "bahnhof-shuttle",
      "shuttle vom bahnhof",
      "abholung vom bahnhof",
      "transfer vom bahnhof",
    ]
  );


  // =========================================================
  // REGIONALE LEBENSMITTEL
  // =========================================================

  sustainabilityAppendIfAny("sustainability_food", "local_food", [
    "regionale lebensmittel",
    "regionale produkte",
    "regionale küche",
    "regionale kueche",
    "lokale lebensmittel",
    "lokale produkte",
    "local food",
  ]);


  // =========================================================
  // BIO-LEBENSMITTEL
  // =========================================================

  sustainabilityAppendIfAny("sustainability_food", "organic_food", [
    "bio lebensmittel",
    "bio-lebensmittel",
    "biologische lebensmittel",
    "bio produkte",
    "bio-produkte",
    "bioküche",
    "biokueche",
    "organic food",
  ]);


  // =========================================================
  // SAISONALE LEBENSMITTEL
  // =========================================================

  sustainabilityAppendIfAny("sustainability_food", "seasonal_food", [
    "saisonale lebensmittel",
    "saisonale produkte",
    "saisonale küche",
    "saisonale kueche",
    "seasonal food",
  ]);


  // =========================================================
  // FARM TO TABLE
  // =========================================================

  sustainabilityAppendIfAny("sustainability_food", "farm_to_table", [
    "farm to table",
    "farm-to-table",
    "vom bauernhof",
    "direkt vom bauern",
    "lebensmittel vom eigenen hof",
  ]);


  // =========================================================
  // EIGENER GARTEN / ANBAU
  // =========================================================

  sustainabilityAppendIfAny("sustainability_food", "own_garden_produce", [
    "eigener gemüsegarten",
    "eigener gemuesegarten",
    "eigener kräutergarten",
    "eigener kraeutergarten",
    "gemüse aus eigenem anbau",
    "gemuese aus eigenem anbau",
    "kräuter aus eigenem anbau",
    "kraeuter aus eigenem anbau",
  ]);


  // =========================================================
  // VEGETARISCH
  // =========================================================

  sustainabilityAppendIfAny("sustainability_food", "vegetarian_options", [
    "vegetarische optionen",
    "vegetarisches essen",
    "vegetarische küche",
    "vegetarische kueche",
    "vegetarian options",
  ]);


  // =========================================================
  // VEGAN
  // =========================================================

  sustainabilityAppendIfAny("sustainability_food", "vegan_options", [
    "vegane optionen",
    "veganes essen",
    "vegane küche",
    "vegane kueche",
    "vegan options",
  ]);


  // =========================================================
  // FOOD WASTE REDUCTION
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_feature",
    "food_waste_reduction",
    [
      "lebensmittelverschwendung vermeiden",
      "gegen lebensmittelverschwendung",
      "weniger lebensmittelabfälle",
      "weniger lebensmittelabfaelle",
      "food waste reduction",
    ]
  );


  // =========================================================
  // PLASTIKFREI
  // =========================================================

  sustainabilityAppendIfAny("sustainability_feature", "plastic_free", [
    "plastikfrei",
    "ohne plastik",
    "plastic free",
    "plastic-free",
    "wenig plastik",
    "plastik vermeiden",
  ]);


  // =========================================================
  // KEIN EINWEGPLASTIK
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_feature",
    "no_single_use_plastic",
    [
      "kein einwegplastik",
      "ohne einwegplastik",
      "keine plastikstrohhalme",
      "keine plastikflaschen",
      "no single use plastic",
      "no single-use plastic",
    ]
  );


  // =========================================================
  // NACHFÜLLBARE SPENDER
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_feature",
    "refillable_toiletries",
    [
      "nachfüllbare seifenspender",
      "nachfuellbare seifenspender",
      "nachfüllbare shampoo spender",
      "nachfuellbare shampoo spender",
      "refillable toiletries",
    ]
  );


  // =========================================================
  // RECYCLING
  // =========================================================

  sustainabilityAppendIfAny("sustainability_feature", "recycling", [
    "recycling",
    "mülltrennung",
    "muelltrennung",
    "abfalltrennung",
    "recyclingstation",
    "recycling station",
  ]);


  // =========================================================
  // KOMPOST
  // =========================================================

  sustainabilityAppendIfAny("sustainability_feature", "composting", [
    "kompost",
    "kompostierung",
    "kompostieren",
    "biomüll kompostieren",
    "biomuell kompostieren",
    "composting",
  ]);


  // =========================================================
  // WASSER SPAREN
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_feature",
    "water_conservation",
    [
      "wassersparen",
      "wasser sparen",
      "wassersparend",
      "geringer wasserverbrauch",
      "water conservation",
    ]
  );


  // =========================================================
  // WASSERSPARENDE ARMATUREN
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_feature",
    "water_saving_fixtures",
    [
      "wassersparende armaturen",
      "wassersparende dusche",
      "wassersparende toiletten",
      "wasser sparende armaturen",
      "low flow shower",
      "low-flow shower",
    ]
  );


  // =========================================================
  // REGENWASSERNUTZUNG
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_feature",
    "rainwater_harvesting",
    [
      "regenwassernutzung",
      "regenwasser nutzen",
      "regenwasser sammeln",
      "rainwater harvesting",
    ]
  );


  // =========================================================
  // GRAUWASSERNUTZUNG
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_feature",
    "greywater_reuse",
    [
      "grauwassernutzung",
      "grauwasser nutzen",
      "grauwasser recycling",
      "greywater reuse",
    ]
  );


  // =========================================================
  // TRINKWASSERSTATION
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_feature",
    "water_refill_station",
    [
      "trinkwasserstation",
      "wasser refill station",
      "wasser nachfüllstation",
      "wasser nachfuellstation",
      "water refill station",
    ]
  );


  // =========================================================
  // ENERGIESPARENDE BELEUCHTUNG
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_feature",
    "energy_saving_lighting",
    [
      "energiesparende beleuchtung",
      "led beleuchtung",
      "led lampen",
      "led lighting",
    ]
  );


  // =========================================================
  // BEWEGUNGSMELDER / AUTOMATIK
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_feature",
    "smart_energy_management",
    [
      "bewegungsmelder",
      "automatische lichtsteuerung",
      "intelligente energienutzung",
      "smart energy management",
      "energie management system",
    ]
  );


  // =========================================================
  // KLIMANEUTRAL
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_preference",
    "climate_neutral",
    [
      "klimaneutral",
      "klima neutral",
      "carbon neutral",
      "carbon-neutral",
      "co2 neutral",
      "co2-neutral",
    ]
  );


  // =========================================================
  // CO2 KOMPENSATION
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_service",
    "carbon_offsetting",
    [
      "co2 kompensation",
      "co2-kompensation",
      "co2 ausgleich",
      "co2-ausgleich",
      "carbon offset",
      "carbon offsetting",
    ]
  );


  // =========================================================
  // CO2-ARME UNTERKUNFT
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_preference",
    "low_carbon",
    [
      "co2 arm",
      "co2-arm",
      "geringer co2 ausstoß",
      "geringer co2 ausstoss",
      "low carbon",
      "low-carbon",
    ]
  );


  // =========================================================
  // ZERO WASTE
  // =========================================================

  sustainabilityAppendIfAny("sustainability_preference", "zero_waste", [
    "zero waste",
    "zero-waste",
    "müllvermeidung",
    "muellvermeidung",
    "abfall vermeiden",
  ]);


  // =========================================================
  // PAPIERLOS
  // =========================================================

  sustainabilityAppendIfAny("sustainability_feature", "paperless", [
    "papierlos",
    "digitale rechnung",
    "digitaler check in",
    "digitaler check-in",
    "paperless",
  ]);


  // =========================================================
  // UMWELTFREUNDLICHE REINIGUNG
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_feature",
    "eco_cleaning",
    [
      "ökologische reinigung",
      "oekologische reinigung",
      "umweltfreundliche reinigung",
      "ökologische reinigungsmittel",
      "oekologische reinigungsmittel",
      "eco cleaning",
    ]
  );


  // =========================================================
  // CHEMIEARME REINIGUNG
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_feature",
    "low_chemical_cleaning",
    [
      "wenig chemie",
      "chemiearme reinigung",
      "ohne aggressive reiniger",
      "natürliche reinigungsmittel",
      "natuerliche reinigungsmittel",
    ]
  );


  // =========================================================
  // HANDTUCHWECHSEL AUF WUNSCH
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_feature",
    "towel_reuse_program",
    [
      "handtuchwechsel auf wunsch",
      "handtücher mehrfach verwenden",
      "handtuecher mehrfach verwenden",
      "towel reuse",
      "towel reuse program",
    ]
  );


  // =========================================================
  // BETTWÄSCHEWECHSEL AUF WUNSCH
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_feature",
    "linen_reuse_program",
    [
      "bettwäschewechsel auf wunsch",
      "bettwaeschewechsel auf wunsch",
      "bettwäsche mehrfach verwenden",
      "bettwaesche mehrfach verwenden",
      "linen reuse",
    ]
  );


  // =========================================================
  // ARTENSCHUTZ
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_feature",
    "biodiversity_protection",
    [
      "artenschutz",
      "biodiversität",
      "biodiversitaet",
      "schutz der artenvielfalt",
      "biodiversity protection",
    ]
  );


  // =========================================================
  // NATURNAHER GARTEN
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_feature",
    "biodiversity_garden",
    [
      "naturnaher garten",
      "ökologischer garten",
      "oekologischer garten",
      "insektenfreundlicher garten",
      "bienenfreundlicher garten",
      "biodiversitätsgarten",
      "biodiversitaetsgarten",
    ]
  );


  // =========================================================
  // BIENEN / INSEKTENSCHUTZ
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_feature",
    "pollinator_friendly",
    [
      "bienenfreundlich",
      "insektenfreundlich",
      "bienenhotel",
      "insektenhotel",
      "pollinator friendly",
    ]
  );


  // =========================================================
  // EIGENE LANDWIRTSCHAFT
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_feature",
    "own_farm",
    [
      "eigener bauernhof",
      "eigene landwirtschaft",
      "eigener hof",
      "farm stay",
      "farmstay",
    ]
  );


  // =========================================================
  // BIO-BAUERNHOF
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_type",
    "organic_farm_stay",
    [
      "bio bauernhof",
      "bio-bauernhof",
      "ökologischer bauernhof",
      "oekologischer bauernhof",
      "organic farm stay",
    ]
  );


  // =========================================================
  // GREEN KEY
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_certification",
    "green_key",
    [
      "green key",
      "green-key",
      "green key zertifikat",
      "green key zertifiziert",
    ]
  );


  // =========================================================
  // EU ECOLABEL
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_certification",
    "eu_ecolabel",
    [
      "eu ecolabel",
      "eu eco label",
      "eu-ecolabel",
      "eu umweltzeichen",
      "eu umweltlabel",
    ]
  );


  // =========================================================
  // BLAUER ENGEL
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_certification",
    "blue_angel",
    [
      "blauer engel",
      "blauer-engel",
      "blauer engel zertifiziert",
    ]
  );


  // =========================================================
  // EARTHCHECK
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_certification",
    "earthcheck",
    [
      "earthcheck",
      "earth check",
      "earthcheck zertifiziert",
    ]
  );


  // =========================================================
  // LEED
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_certification",
    "leed",
    [
      "leed",
      "leed zertifiziert",
      "leed certification",
    ]
  );


  // =========================================================
  // BREEAM
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_certification",
    "breeam",
    [
      "breeam",
      "breeam zertifiziert",
      "breeam certification",
    ]
  );


  // =========================================================
  // GSTC
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_certification",
    "gstc",
    [
      "gstc",
      "gstc zertifiziert",
      "global sustainable tourism council",
    ]
  );


  // =========================================================
  // TOURCERT
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_certification",
    "tourcert",
    [
      "tourcert",
      "tour cert",
      "tourcert zertifiziert",
    ]
  );


  // =========================================================
  // BIO HOTELS
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_certification",
    "bio_hotels",
    [
      "bio hotels zertifiziert",
      "biohotels zertifiziert",
      "bio hotels mitglied",
    ]
  );


  // =========================================================
  // EMAS
  // =========================================================

  if (
  containsAnyWholeTerm(normalizedText, [
    "emas",
    "emas zertifiziert",
    "emas umweltmanagement",
  ])
) {
  params.append(
    "sustainability_certification",
    "emas"
  );
}


  // =========================================================
  // ISO 14001
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_certification",
    "iso_14001",
    [
      "iso 14001",
      "iso14001",
      "iso 14001 zertifiziert",
    ]
  );


  // =========================================================
  // FAIR TRADE
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_preference",
    "fair_trade",
    [
      "fair trade",
      "fair-trade",
      "fairtrade",
      "fair gehandelt",
      "fair gehandelte produkte",
    ]
  );


  // =========================================================
  // LOKALE BESCHÄFTIGUNG
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_preference",
    "local_employment",
    [
      "lokale mitarbeiter",
      "lokales personal",
      "beschäftigt menschen aus der region",
      "beschaeftigt menschen aus der region",
      "local employment",
    ]
  );


  // =========================================================
  // LOKALE GEMEINSCHAFT
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_preference",
    "supports_local_community",
    [
      "unterstützt lokale gemeinschaft",
      "unterstuetzt lokale gemeinschaft",
      "unterstützt die region",
      "unterstuetzt die region",
      "supports local community",
    ]
  );


  // =========================================================
  // REGIONALE LIEFERANTEN
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_preference",
    "local_suppliers",
    [
      "regionale lieferanten",
      "lokale lieferanten",
      "produkte aus der region",
      "local suppliers",
    ]
  );


  // =========================================================
  // NACHHALTIGE AKTIVITÄTEN
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_activity",
    "eco_activities",
    [
      "nachhaltige aktivitäten",
      "nachhaltige aktivitaeten",
      "ökologische aktivitäten",
      "oekologische aktivitaeten",
      "eco activities",
    ]
  );


  // =========================================================
  // NATURFÜHRUNGEN
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_activity",
    "guided_nature_tours",
    [
      "naturführung",
      "naturfuehrung",
      "naturführungen",
      "naturfuehrungen",
      "geführte naturtour",
      "gefuehrte naturtour",
      "guided nature tour",
    ]
  );


  // =========================================================
  // UMWELTBILDUNG
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_activity",
    "environmental_education",
    [
      "umweltbildung",
      "umweltprogramm",
      "ökologische workshops",
      "oekologische workshops",
      "environmental education",
    ]
  );


  // =========================================================
  // NATURSCHUTZPROJEKTE
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_activity",
    "conservation_projects",
    [
      "naturschutzprojekt",
      "naturschutzprojekte",
      "umweltprojekt",
      "umweltprojekte",
      "conservation project",
    ]
  );


  // =========================================================
  // STRANDREINIGUNG
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_activity",
    "beach_cleanup",
    [
      "strandreinigung",
      "strand säubern",
      "strand saeubern",
      "beach cleanup",
      "beach clean up",
    ]
  );


  // =========================================================
  // BAUMPFLANZUNG
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_activity",
    "tree_planting",
    [
      "bäume pflanzen",
      "baeume pflanzen",
      "baumpflanzung",
      "aufforstung",
      "tree planting",
    ]
  );


  // =========================================================
  // ELEKTRISCHE SHUTTLES
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_service",
    "electric_shuttle",
    [
      "elektrischer shuttle",
      "elektro shuttle",
      "e shuttle",
      "e-shuttle",
      "electric shuttle",
    ]
  );


  // =========================================================
  // E-AUTO-VERLEIH
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_service",
    "electric_car_rental",
    [
      "e auto verleih",
      "e-auto verleih",
      "elektroauto verleih",
      "elektroauto mieten",
      "electric car rental",
    ]
  );


  // =========================================================
  // WENIGER ZIMMERREINIGUNG
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_preference",
    "reduced_housekeeping",
    [
      "reinigung nur auf wunsch",
      "zimmerreinigung nur auf wunsch",
      "weniger zimmerreinigung",
      "reduced housekeeping",
    ]
  );


  // =========================================================
  // UMWELTSCHUTZPROGRAMM
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_preference",
    "environmental_program",
    [
      "umweltschutzprogramm",
      "nachhaltigkeitsprogramm",
      "umweltprogramm",
      "environmental program",
      "sustainability program",
    ]
  );


  // =========================================================
  // NACHHALTIGKEITSBERICHT
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_preference",
    "sustainability_reporting",
    [
      "nachhaltigkeitsbericht",
      "nachhaltigkeitsberichte",
      "sustainability report",
      "umweltbericht",
    ]
  );


  // =========================================================
  // ECO LUXURY
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_preference",
    "eco_luxury",
    [
      "eco luxury",
      "eco-luxury",
      "ökologischer luxus",
      "oekologischer luxus",
      "nachhaltiger luxus",
      "luxus und nachhaltig",
    ]
  );


  // =========================================================
  // NACHHALTIG FÜR FAMILIEN
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_preference",
    "eco_family_friendly",
    [
      "nachhaltig für familien",
      "nachhaltig fuer familien",
      "umweltfreundlich für familien",
      "umweltfreundlich fuer familien",
      "eco family",
    ]
  );


  // =========================================================
  // NACHHALTIG UND HUNDEFREUNDLICH
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_preference",
    "eco_pet_friendly",
    [
      "nachhaltig und hundefreundlich",
      "nachhaltig mit hund",
      "eco pet friendly",
      "eco dog friendly",
    ]
  );


  // =========================================================
  // NACHHALTIGES WELLNESSHOTEL
  // =========================================================

  sustainabilityAppendIfAny(
    "sustainability_preference",
    "eco_wellness",
    [
      "nachhaltiges wellnesshotel",
      "ökologisches wellnesshotel",
      "oekologisches wellnesshotel",
      "eco wellness",
      "eco spa",
    ]
  );


  // =========================================================
  // NACHHALTIGER STÄDTETRIP
  // =========================================================

  sustainabilityAppendIfAny(
    "trip_style",
    "sustainable_city_trip",
    [
      "nachhaltiger städtetrip",
      "nachhaltiger staedtetrip",
      "ökologischer städtetrip",
      "oekologischer staedtetrip",
      "eco city trip",
    ]
  );


  // =========================================================
  // NACHHALTIGER STRANDURLAUB
  // =========================================================

  sustainabilityAppendIfAny(
    "trip_style",
    "sustainable_beach_trip",
    [
      "nachhaltiger strandurlaub",
      "ökologischer strandurlaub",
      "oekologischer strandurlaub",
      "eco beach trip",
    ]
  );


  // =========================================================
  // NACHHALTIGER NATURURLAUB
  // =========================================================

  sustainabilityAppendIfAny(
    "trip_style",
    "sustainable_nature_trip",
    [
      "nachhaltiger natururlaub",
      "ökologischer natururlaub",
      "oekologischer natururlaub",
      "eco nature trip",
    ]
  );
}