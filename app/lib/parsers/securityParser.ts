export function parseSecuritySearch(
  normalizedText: string,
  params: URLSearchParams
) {
  // =========================================================
  // SICHERHEIT, SCHUTZ & REISE-SICHERHEIT
  // =========================================================

  const securityIncludesAny = (terms: string[]) =>
    terms.some((term) => normalizedText.includes(term));

  const securityAppendIfAny = (
    key: string,
    value: string,
    terms: string[]
  ) => {
    if (securityIncludesAny(terms)) {
      params.append(key, value);
    }
  };


  // =========================================================
  // SICHERHEIT ALLGEMEIN
  // =========================================================

  securityAppendIfAny("security_preference", "high_security", [
    "sichere unterkunft",
    "besonders sicher",
    "hohe sicherheit",
    "viel sicherheit",
    "sicheres hotel",
    "sicheres resort",
    "security",
    "high security",
  ]);


  // =========================================================
  // SICHERE GEGEND
  // =========================================================

  securityAppendIfAny("security_location", "safe_area", [
    "sichere gegend",
    "sicheres viertel",
    "sichere nachbarschaft",
    "sichere lage",
    "ruhige und sichere gegend",
    "safe area",
    "safe neighborhood",
  ]);


  // =========================================================
  // BELEUCHTETE UMGEBUNG
  // =========================================================

  securityAppendIfAny("security_location", "well_lit_area", [
    "gut beleuchtete gegend",
    "gut beleuchtete straßen",
    "gut beleuchtete strassen",
    "beleuchtete umgebung",
    "well lit area",
    "well-lit area",
  ]);


  // =========================================================
  // 24H REZEPTION
  // =========================================================

  securityAppendIfAny("security_service", "reception_24h", [
    "24h rezeption",
    "24 stunden rezeption",
    "24/7 rezeption",
    "rezeption rund um die uhr",
    "24 hour reception",
    "24-hour reception",
  ]);


  // =========================================================
  // SECURITY PERSONAL
  // =========================================================

  securityAppendIfAny("security_service", "security_staff", [
    "security personal",
    "sicherheitspersonal",
    "sicherheitsdienst",
    "security service",
    "security staff",
    "bewachung",
  ]);


  // =========================================================
  // 24H SECURITY
  // =========================================================

  securityAppendIfAny("security_service", "security_24h", [
    "24h security",
    "24 stunden security",
    "24/7 security",
    "sicherheitsdienst rund um die uhr",
    "24 hour security",
  ]);


  // =========================================================
  // NACHTWÄCHTER
  // =========================================================

  securityAppendIfAny("security_service", "night_security", [
    "nachtwächter",
    "nachtwaechter",
    "nachtsicherheitsdienst",
    "security in der nacht",
    "night security",
    "night guard",
  ]);


  // =========================================================
  // VIDEOÜBERWACHUNG
  // =========================================================

  securityAppendIfAny("security_feature", "cctv", [
    "videoüberwachung",
    "videoueberwachung",
    "kameraüberwachung",
    "kameraueberwachung",
    "überwachungskameras",
    "ueberwachungskameras",
    "cctv",
    "security cameras",
  ]);


  // =========================================================
  // VIDEOÜBERWACHUNG AUSSEN
  // =========================================================

  securityAppendIfAny("security_feature", "cctv_outside", [
    "videoüberwachung außen",
    "videoueberwachung aussen",
    "kameras außen",
    "kameras aussen",
    "außenkameras",
    "aussenkameras",
    "cctv outside",
  ]);


  // =========================================================
  // VIDEOÜBERWACHUNG GEMEINSCHAFTSBEREICHE
  // =========================================================

  securityAppendIfAny("security_feature", "cctv_common_areas", [
    "videoüberwachung in gemeinschaftsbereichen",
    "videoueberwachung in gemeinschaftsbereichen",
    "kameras in gemeinschaftsbereichen",
    "cctv common areas",
  ]);


  // =========================================================
  // ZIMMERSAFE
  // =========================================================

  securityAppendIfAny("security_feature", "room_safe", [
    "zimmersafe",
    "safe im zimmer",
    "tresor im zimmer",
    "zimmer tresor",
    "room safe",
    "in room safe",
    "in-room safe",
  ]);


  // =========================================================
  // LAPTOP-SAFE
  // =========================================================

  securityAppendIfAny("security_feature", "laptop_safe", [
    "laptop safe",
    "laptopsafe",
    "safe für laptop",
    "safe fuer laptop",
    "laptop tresor",
  ]);


  // =========================================================
  // SAFE AN REZEPTION
  // =========================================================

  securityAppendIfAny("security_feature", "reception_safe", [
    "safe an der rezeption",
    "tresor an der rezeption",
    "safe bei der rezeption",
    "reception safe",
  ]);


  // =========================================================
  // SCHLIESSFACH
  // =========================================================

  securityAppendIfAny("security_feature", "locker", [
    "schließfach",
    "schliessfach",
    "schließfächer",
    "schliessfaecher",
    "locker",
    "lockers",
  ]);


  // =========================================================
  // ELEKTRONISCHE ZIMMERSCHLÖSSER
  // =========================================================

  securityAppendIfAny("security_feature", "electronic_room_lock", [
    "elektronisches türschloss",
    "elektronisches tuerschloss",
    "elektronische türschlösser",
    "elektronische tuerschloesser",
    "elektronische zimmerschlösser",
    "elektronische zimmerschloesser",
    "keycard",
    "key card",
    "electronic door lock",
  ]);


  // =========================================================
  // SMART LOCK
  // =========================================================

  securityAppendIfAny("security_feature", "smart_lock", [
    "smart lock",
    "smartlock",
    "smartes türschloss",
    "smartes tuerschloss",
    "digitales türschloss",
    "digitales tuerschloss",
  ]);


  // =========================================================
  // CODE-SCHLOSS
  // =========================================================

  securityAppendIfAny("security_feature", "keypad_lock", [
    "codeschloss",
    "code schloss",
    "türcode",
    "tuercode",
    "pin code tür",
    "pin code tuer",
    "keypad lock",
  ]);


  // =========================================================
  // DOPPELVERRIEGELUNG
  // =========================================================

  securityAppendIfAny("security_feature", "double_lock", [
    "doppelverriegelung",
    "doppelschloss",
    "zusätzliche türverriegelung",
    "zusaetzliche tuer verriegelung",
    "double lock",
  ]);


  // =========================================================
  // TÜRKETTE
  // =========================================================

  securityAppendIfAny("security_feature", "door_chain", [
    "türkette",
    "tuerkette",
    "sicherheitskette",
    "door chain",
  ]);


  // =========================================================
  // TÜRSPION
  // =========================================================

  securityAppendIfAny("security_feature", "door_viewer", [
    "türspion",
    "tuerspion",
    "spion an der tür",
    "spion an der tuer",
    "door viewer",
    "peephole",
  ]);


  // =========================================================
  // TÜRALARM
  // =========================================================

  securityAppendIfAny("security_feature", "door_alarm", [
    "türalarm",
    "tueralarm",
    "alarm an der tür",
    "alarm an der tuer",
    "door alarm",
  ]);


  // =========================================================
  // FENSTERSICHERUNG
  // =========================================================

  securityAppendIfAny("security_feature", "window_security", [
    "fenstersicherung",
    "sichere fenster",
    "abschließbare fenster",
    "abschliessbare fenster",
    "window security",
    "window locks",
  ]);


  // =========================================================
  // EINBRUCHSCHUTZ
  // =========================================================

  securityAppendIfAny("security_feature", "burglary_protection", [
    "einbruchschutz",
    "einbruchssicher",
    "einbruchsicherung",
    "burglary protection",
    "anti burglary",
    "anti-burglary",
  ]);


  // =========================================================
  // ALARMANLAGE
  // =========================================================

  securityAppendIfAny("security_feature", "alarm_system", [
    "alarmanlage",
    "alarmsystem",
    "einbruchalarmanlage",
    "security alarm",
    "alarm system",
  ]);


  // =========================================================
  // BEWEGUNGSMELDER
  // =========================================================

  securityAppendIfAny("security_feature", "motion_detector", [
    "bewegungsmelder",
    "bewegungssensor",
    "bewegungssensoren",
    "motion detector",
    "motion sensor",
  ]);


  // =========================================================
  // RAUCHMELDER
  // =========================================================

  securityAppendIfAny("security_feature", "smoke_detector", [
    "rauchmelder",
    "rauchwarnmelder",
    "smoke detector",
    "smoke alarm",
  ]);


  // =========================================================
  // KOHLENMONOXIDMELDER
  // =========================================================

  securityAppendIfAny("security_feature", "carbon_monoxide_detector", [
    "kohlenmonoxidmelder",
    "kohlenmonoxid melder",
    "co melder",
    "co-melder",
    "co2 melder",
    "carbon monoxide detector",
    "carbon monoxide alarm",
  ]);


  // =========================================================
  // GASWARNMELDER
  // =========================================================

  securityAppendIfAny("security_feature", "gas_detector", [
    "gasmelder",
    "gaswarnmelder",
    "gas detector",
    "gas alarm",
  ]);


  // =========================================================
  // FEUERLÖSCHER
  // =========================================================

  securityAppendIfAny("security_feature", "fire_extinguisher", [
    "feuerlöscher",
    "feuerloescher",
    "löscher",
    "loescher",
    "fire extinguisher",
  ]);


  // =========================================================
  // SPRINKLERANLAGE
  // =========================================================

  securityAppendIfAny("security_feature", "sprinkler_system", [
    "sprinkleranlage",
    "sprinkler",
    "feuersprinkler",
    "fire sprinkler",
    "sprinkler system",
  ]);


  // =========================================================
  // BRANDSCHUTZ
  // =========================================================

  securityAppendIfAny("security_feature", "fire_safety", [
    "brandschutz",
    "guter brandschutz",
    "brandschutzsystem",
    "fire safety",
    "fire protection",
  ]);


  // =========================================================
  // FEUERALARM
  // =========================================================

  securityAppendIfAny("security_feature", "fire_alarm", [
    "feueralarm",
    "brandmeldeanlage",
    "brandalarm",
    "fire alarm",
  ]);


  // =========================================================
  // NOTAUSGANG
  // =========================================================

  securityAppendIfAny("security_feature", "emergency_exit", [
    "notausgang",
    "notausgänge",
    "notausgaenge",
    "emergency exit",
    "emergency exits",
  ]);


  // =========================================================
  // FLUCHTWEG
  // =========================================================

  securityAppendIfAny("security_feature", "escape_route", [
    "fluchtweg",
    "fluchtwege",
    "markierte fluchtwege",
    "escape route",
    "evacuation route",
  ]);


  // =========================================================
  // NOTBELEUCHTUNG
  // =========================================================

  securityAppendIfAny("security_feature", "emergency_lighting", [
    "notbeleuchtung",
    "notfallbeleuchtung",
    "emergency lighting",
  ]);


  // =========================================================
  // ERSTE-HILFE-KASTEN
  // =========================================================

  securityAppendIfAny("security_feature", "first_aid_kit", [
    "erste hilfe kasten",
    "erste-hilfe-kasten",
    "erste hilfe set",
    "erste-hilfe-set",
    "verbandskasten",
    "first aid kit",
  ]);


  // =========================================================
  // DEFIBRILLATOR
  // =========================================================

  securityAppendIfAny("security_feature", "aed", [
    "defibrillator",
    "aed",
    "automatisierter externer defibrillator",
  ]);


  // =========================================================
  // NOTRUF
  // =========================================================

  securityAppendIfAny("security_service", "emergency_contact", [
    "notfallkontakt",
    "notfallnummer",
    "notrufkontakt",
    "emergency contact",
    "emergency number",
  ]);


  // =========================================================
  // ARZT AUF ABRUF
  // =========================================================

  securityAppendIfAny("security_service", "doctor_on_call", [
    "arzt auf abruf",
    "arzt auf anfrage",
    "arzt erreichbar",
    "doctor on call",
    "doctor available",
  ]);


  // =========================================================
  // MEDIZINISCHE HILFE
  // =========================================================

  securityAppendIfAny("security_service", "medical_assistance", [
    "medizinische hilfe",
    "medizinische unterstützung",
    "medizinische unterstuetzung",
    "medical assistance",
  ]);


  // =========================================================
  // KRANKENHAUS IN DER NÄHE
  // =========================================================

  securityAppendIfAny("security_location", "near_hospital", [
    "krankenhaus in der nähe",
    "krankenhaus in der naehe",
    "nahe am krankenhaus",
    "nähe krankenhaus",
    "naehe krankenhaus",
    "near hospital",
  ]);


  // =========================================================
  // APOTHEKE IN DER NÄHE
  // =========================================================

  securityAppendIfAny("security_location", "near_pharmacy", [
    "apotheke in der nähe",
    "apotheke in der naehe",
    "nahe an einer apotheke",
    "nähe apotheke",
    "naehe apotheke",
    "near pharmacy",
  ]);


  // =========================================================
  // POLIZEI IN DER NÄHE
  // =========================================================

  securityAppendIfAny("security_location", "near_police", [
    "polizei in der nähe",
    "polizei in der naehe",
    "polizeistation in der nähe",
    "polizeistation in der naehe",
    "near police station",
  ]);


  // =========================================================
  // BEWACHTER PARKPLATZ
  // =========================================================

  securityAppendIfAny("security_feature", "guarded_parking", [
    "bewachter parkplatz",
    "bewachtes parken",
    "überwachter parkplatz",
    "ueberwachter parkplatz",
    "guarded parking",
    "secure parking",
  ]);


  // =========================================================
  // ABGESCHLOSSENER PARKPLATZ
  // =========================================================

  securityAppendIfAny("security_feature", "gated_parking", [
    "abgeschlossener parkplatz",
    "eingezäunter parkplatz",
    "eingezaeunter parkplatz",
    "gesicherter parkplatz",
    "gated parking",
  ]);


  // =========================================================
  // TIEFGARAGE
  // =========================================================

  securityAppendIfAny("security_feature", "secure_underground_parking", [
    "sichere tiefgarage",
    "gesicherte tiefgarage",
    "bewachte tiefgarage",
    "secure underground parking",
  ]);


  // =========================================================
  // MOTORRAD SICHER PARKEN
  // =========================================================

  securityAppendIfAny("security_feature", "secure_motorcycle_parking", [
    "motorrad sicher parken",
    "sicherer motorradparkplatz",
    "bewachter motorradparkplatz",
    "secure motorcycle parking",
  ]);


  // =========================================================
  // FAHRRAD SICHER PARKEN
  // =========================================================

  securityAppendIfAny("security_feature", "secure_bicycle_storage", [
    "fahrrad sicher abstellen",
    "sichere fahrradgarage",
    "abschließbarer fahrradraum",
    "abschliessbarer fahrradraum",
    "secure bicycle storage",
    "bike locker",
  ]);


  // =========================================================
  // ZUTRITTSKONTROLLE
  // =========================================================

  securityAppendIfAny("security_feature", "access_control", [
    "zutrittskontrolle",
    "zugangskontrolle",
    "kontrollierter zugang",
    "access control",
    "controlled access",
  ]);


  // =========================================================
  // NUR FÜR GÄSTE
  // =========================================================

  securityAppendIfAny("security_feature", "guest_only_access", [
    "nur für gäste zugänglich",
    "nur fuer gaeste zugaenglich",
    "zugang nur für gäste",
    "zugang nur fuer gaeste",
    "guest only access",
    "guests only",
  ]);


  // =========================================================
  // GESCHLOSSENE ANLAGE
  // =========================================================

  securityAppendIfAny("security_feature", "gated_property", [
    "geschlossene anlage",
    "abgeschlossene anlage",
    "eingezäunte anlage",
    "eingezaeunte anlage",
    "gated property",
    "gated resort",
  ]);


  // =========================================================
  // GESICHERTER EINGANG
  // =========================================================

  securityAppendIfAny("security_feature", "secure_entrance", [
    "gesicherter eingang",
    "sicherer eingang",
    "kontrollierter eingang",
    "secure entrance",
  ]);


  // =========================================================
  // REZEPTION MIT ZUGANGSKONTROLLE
  // =========================================================

  securityAppendIfAny("security_feature", "controlled_lobby", [
    "kontrollierte lobby",
    "gesicherte lobby",
    "zugangskontrolle in der lobby",
    "secure lobby",
  ]);


  // =========================================================
  // KINDERSICHERE UNTERKUNFT
  // =========================================================

  securityAppendIfAny("security_preference", "child_safe", [
    "kindersicher",
    "kindersichere unterkunft",
    "sicher für kinder",
    "sicher fuer kinder",
    "child safe",
    "child-safe",
  ]);


  // =========================================================
  // STECKDOSENSICHERUNG
  // =========================================================

  securityAppendIfAny("security_feature", "socket_covers", [
    "steckdosensicherung",
    "steckdosenschutz",
    "kindersichere steckdosen",
    "socket covers",
  ]);


  // =========================================================
  // TREPPENSCHUTZGITTER
  // =========================================================

  securityAppendIfAny("security_feature", "stair_gate", [
    "treppenschutzgitter",
    "treppengitter",
    "schutzgitter an treppe",
    "stair gate",
    "baby gate",
  ]);


  // =========================================================
  // FENSTERSICHERUNG FÜR KINDER
  // =========================================================

  securityAppendIfAny("security_feature", "child_window_lock", [
    "kindersicherung am fenster",
    "fenstersicherung für kinder",
    "fenstersicherung fuer kinder",
    "child window lock",
  ]);


  // =========================================================
  // BALKONSICHERUNG
  // =========================================================

  securityAppendIfAny("security_feature", "balcony_safety", [
    "sicherer balkon",
    "kindersicherer balkon",
    "balkonsicherung",
    "balcony safety",
  ]);


  // =========================================================
  // POOLSICHERUNG
  // =========================================================

  securityAppendIfAny("security_feature", "pool_safety", [
    "poolsicherung",
    "sicherer pool",
    "kindersicherer pool",
    "pool safety",
  ]);


  // =========================================================
  // POOLZAUN
  // =========================================================

  securityAppendIfAny("security_feature", "pool_fence", [
    "poolzaun",
    "pool umzäunt",
    "pool umzaeunt",
    "eingezäunter pool",
    "eingezaeunter pool",
    "pool fence",
  ]);


  // =========================================================
  // POOLABDECKUNG
  // =========================================================

  securityAppendIfAny("security_feature", "pool_cover", [
    "poolabdeckung",
    "sicherheitsabdeckung pool",
    "pool cover",
  ]);


  // =========================================================
  // BADemeister / LIFEGUARD
  // =========================================================

  securityAppendIfAny("security_service", "lifeguard", [
    "bademeister",
    "rettungsschwimmer",
    "lifeguard",
  ]);


  // =========================================================
  // STRAND MIT RETTUNGSSCHWIMMER
  // =========================================================

  securityAppendIfAny("security_location", "lifeguarded_beach", [
    "strand mit rettungsschwimmer",
    "bewachter strand",
    "strand mit lifeguard",
    "lifeguarded beach",
  ]);


  // =========================================================
  // ALLEINREISENDE
  // =========================================================

  securityAppendIfAny("security_preference", "solo_traveler_safe", [
    "sicher für alleinreisende",
    "sicher fuer alleinreisende",
    "sicher alleine reisen",
    "sicher für solo reisende",
    "sicher fuer solo reisende",
    "solo traveler safe",
  ]);


  // =========================================================
  // ALLEINREISENDE FRAUEN
  // =========================================================

  securityAppendIfAny("security_preference", "female_solo_traveler_safe", [
    "sicher für alleinreisende frauen",
    "sicher fuer alleinreisende frauen",
    "für frauen alleine sicher",
    "fuer frauen alleine sicher",
    "female solo traveler safe",
    "safe for solo female travelers",
  ]);


  // =========================================================
  // FAMILIEN-SICHERHEIT
  // =========================================================

  securityAppendIfAny("security_preference", "family_safe", [
    "sicher für familien",
    "sicher fuer familien",
    "familienfreundlich und sicher",
    "familien sicherheit",
    "family safe",
  ]);


  // =========================================================
  // SENIOREN-SICHERHEIT
  // =========================================================

  securityAppendIfAny("security_preference", "senior_safe", [
    "sicher für senioren",
    "sicher fuer senioren",
    "seniorengerechte sicherheit",
    "safe for seniors",
  ]);


  // =========================================================
  // LGBTQ+ FREUNDLICHE / SICHERE UNTERKUNFT
  // =========================================================

  securityAppendIfAny("security_preference", "lgbtq_friendly_safe", [
    "lgbtq freundlich",
    "lgbtq+ freundlich",
    "lgbt freundlich",
    "lgbtq sicher",
    "lgbtq+ sicher",
    "lgbtq friendly",
    "lgbtq safe",
  ]);


  // =========================================================
  // DISKRETE UNTERKUNFT
  // =========================================================

  securityAppendIfAny("security_preference", "discreet", [
    "diskrete unterkunft",
    "diskret",
    "viel privatsphäre",
    "viel privatsphaere",
    "discreet",
    "privacy",
  ]);


  // =========================================================
  // PRIVATER EINGANG
  // =========================================================

  securityAppendIfAny("security_feature", "private_entrance", [
    "privater eingang",
    "eigener eingang",
    "separater eingang",
    "private entrance",
  ]);


  // =========================================================
  // KONTAKTLOSER CHECK-IN
  // =========================================================

  securityAppendIfAny("security_service", "contactless_check_in", [
    "kontaktloser check in",
    "kontaktloser check-in",
    "kontaktlos einchecken",
    "contactless check in",
    "contactless check-in",
  ]);


  // =========================================================
  // SELF CHECK-IN
  // =========================================================

  securityAppendIfAny("security_service", "self_check_in", [
    "self check in",
    "self check-in",
    "selbstständiger check in",
    "selbststaendiger check in",
    "selbst einchecken",
  ]);


  // =========================================================
  // PERSONENKONTROLLE / ID-KONTROLLE
  // =========================================================

  securityAppendIfAny("security_feature", "identity_verification", [
    "identitätskontrolle",
    "identitaetskontrolle",
    "ausweiskontrolle",
    "id kontrolle",
    "id verification",
    "identity verification",
  ]);


  // =========================================================
  // GEPÄCKAUFBEWAHRUNG
  // =========================================================

  securityAppendIfAny("security_service", "secure_luggage_storage", [
    "sichere gepäckaufbewahrung",
    "sichere gepaeckaufbewahrung",
    "gesicherte gepäckaufbewahrung",
    "gesicherte gepaeckaufbewahrung",
    "secure luggage storage",
  ]);


  // =========================================================
  // VERSICHERUNG / REISESCHUTZ
  // =========================================================

  securityAppendIfAny("security_service", "travel_protection", [
    "reiseschutz",
    "reiseversicherung",
    "urlaubsschutz",
    "travel protection",
    "travel insurance",
  ]);


  // =========================================================
  // EVAKUIERUNGSPLAN
  // =========================================================

  securityAppendIfAny("security_feature", "evacuation_plan", [
    "evakuierungsplan",
    "notfallplan",
    "fluchtplan",
    "evacuation plan",
    "emergency plan",
  ]);


  // =========================================================
  // ERDBEBENSICHER
  // =========================================================

  securityAppendIfAny("security_feature", "earthquake_resistant", [
    "erdbebensicher",
    "erdbebensichere unterkunft",
    "earthquake resistant",
    "earthquake-safe",
  ]);


  // =========================================================
  // STURMSICHER
  // =========================================================

  securityAppendIfAny("security_feature", "storm_resistant", [
    "sturmsicher",
    "sturmgeschützt",
    "sturmgeschuetzt",
    "storm resistant",
    "storm safe",
  ]);


  // =========================================================
  // HOCHWASSERSICHER
  // =========================================================

  securityAppendIfAny("security_feature", "flood_resistant", [
    "hochwassersicher",
    "hochwasserschutz",
    "flutsicher",
    "flood resistant",
    "flood protection",
  ]);


  // =========================================================
  // NOTSTROM
  // =========================================================

  securityAppendIfAny("security_feature", "backup_power", [
    "notstrom",
    "notstromaggregat",
    "backup strom",
    "backup power",
    "generator",
  ]);


  // =========================================================
  // NOTWASSERVERSORGUNG
  // =========================================================

  securityAppendIfAny("security_feature", "emergency_water_supply", [
    "notwasserversorgung",
    "wasserreserve",
    "notfall wasser",
    "emergency water supply",
  ]);


  // =========================================================
  // SATELLITENTELEFON / NOTFALLKOMMUNIKATION
  // =========================================================

  securityAppendIfAny("security_feature", "emergency_communication", [
    "satellitentelefon",
    "notfallkommunikation",
    "notfall funk",
    "emergency communication",
    "satellite phone",
  ]);


  // =========================================================
  // 24H NOTFALLSUPPORT
  // =========================================================

  securityAppendIfAny("security_service", "emergency_support_24h", [
    "24h notfallsupport",
    "24 stunden notfallsupport",
    "24/7 notfallsupport",
    "notfallhilfe rund um die uhr",
    "24 hour emergency support",
  ]);


  // =========================================================
  // SICHERER TRANSFER
  // =========================================================

  securityAppendIfAny("security_service", "secure_transfer", [
    "sicherer transfer",
    "gesicherter transfer",
    "security transfer",
    "secure transfer",
  ]);


  // =========================================================
  // PRIVATER TRANSFER
  // =========================================================

  securityAppendIfAny("security_service", "private_transfer", [
    "privater transfer",
    "private transfer",
    "privattransfer",
  ]);


  // =========================================================
  // ABHOLUNG AM FLUGHAFEN
  // =========================================================

  securityAppendIfAny("security_service", "airport_pickup", [
    "abholung am flughafen",
    "flughafenabholung",
    "airport pickup",
    "airport pick up",
  ]);


  // =========================================================
  // ABHOLUNG AM BAHNHOF
  // =========================================================

  securityAppendIfAny("security_service", "train_station_pickup", [
    "abholung am bahnhof",
    "bahnhofabholung",
    "train station pickup",
  ]);


  // =========================================================
  // SICHERES NACHTTAXI
  // =========================================================

  securityAppendIfAny("security_service", "safe_night_transport", [
    "sicheres taxi nachts",
    "sicherer transfer nachts",
    "sicher nach hause nachts",
    "safe night transport",
  ]);


  // =========================================================
  // REISE-SICHERHEIT ALS PRIORITÄT
  // =========================================================

  securityAppendIfAny("trip_style", "safety_focused_trip", [
    "sicherheit ist mir wichtig",
    "sicherheit ist uns wichtig",
    "besonders sicher reisen",
    "sicherheitsorientierte reise",
    "safety focused trip",
    "safety-focused trip",
  ]);
}