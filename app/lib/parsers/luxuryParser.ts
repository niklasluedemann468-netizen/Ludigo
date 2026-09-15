export function parseLuxurySearch(
  normalizedText: string,
  params: URLSearchParams
) {
  // =========================================================
  // LUXUS, EXKLUSIVITÄT & BESONDERE UNTERKUNFTSARTEN
  // =========================================================

  const luxuryIncludesAny = (terms: string[]) =>
    terms.some((term) => normalizedText.includes(term));

  const luxuryAppendIfAny = (
    key: string,
    value: string,
    terms: string[]
  ) => {
    if (luxuryIncludesAny(terms)) {
      params.append(key, value);
    }
  };


  // =========================================================
  // LUXUS ALLGEMEIN
  // =========================================================

  luxuryAppendIfAny("luxury_preference", "luxury", [
    "luxus",
    "luxuriös",
    "luxurioes",
    "luxuriöse unterkunft",
    "luxurioese unterkunft",
    "luxushotel",
    "luxusresort",
    "luxusurlaub",
    "luxury",
    "luxury hotel",
  ]);

  luxuryAppendIfAny("trip_style", "luxury_trip", [
    "luxusreise",
    "luxusurlaub",
    "luxuriöse reise",
    "luxurioese reise",
    "luxury trip",
    "luxury vacation",
  ]);


  // =========================================================
  // 5-STERNE
  // =========================================================

  luxuryAppendIfAny("luxury_preference", "five_star", [
    "5 sterne",
    "5-sterne",
    "fünf sterne",
    "fuenf sterne",
    "fünfsterne",
    "fuenfsterne",
    "five star",
    "five-star",
  ]);


  // =========================================================
  // 4-STERNE SUPERIOR
  // =========================================================

  luxuryAppendIfAny("luxury_preference", "four_star_superior", [
    "4 sterne superior",
    "4-sterne-superior",
    "vier sterne superior",
    "viersterne superior",
  ]);


  // =========================================================
  // PREMIUM
  // =========================================================

  luxuryAppendIfAny("luxury_preference", "premium", [
    "premium",
    "premium hotel",
    "premium unterkunft",
    "gehobene unterkunft",
    "gehobenes hotel",
    "gehobener standard",
  ]);


  // =========================================================
  // HIGH-END
  // =========================================================

  luxuryAppendIfAny("luxury_preference", "high_end", [
    "high end",
    "high-end",
    "highend",
    "oberklasse",
    "absolute oberklasse",
  ]);


  // =========================================================
  // EXKLUSIV
  // =========================================================

  luxuryAppendIfAny("luxury_preference", "exclusive", [
    "exklusiv",
    "exklusive unterkunft",
    "exklusives hotel",
    "exklusives resort",
    "exklusive lage",
    "exclusive",
  ]);


  // =========================================================
  // ULTRA-LUXUS
  // =========================================================

  luxuryAppendIfAny("luxury_preference", "ultra_luxury", [
    "ultra luxus",
    "ultra-luxus",
    "ultraluxus",
    "ultra luxury",
    "höchster luxus",
    "hoechster luxus",
  ]);


  // =========================================================
  // BOUTIQUE
  // =========================================================

  luxuryAppendIfAny("luxury_style", "boutique", [
    "boutique hotel",
    "boutiquehotel",
    "boutique unterkunft",
    "boutique resort",
    "boutique style",
  ]);


  // =========================================================
  // DESIGNHOTEL
  // =========================================================

  luxuryAppendIfAny("luxury_style", "design_hotel", [
    "designhotel",
    "design hotel",
    "designer hotel",
    "design unterkunft",
    "design resort",
  ]);


  // =========================================================
  // LIFESTYLE HOTEL
  // =========================================================

  luxuryAppendIfAny("luxury_style", "lifestyle_hotel", [
    "lifestyle hotel",
    "lifestylehotel",
    "lifestyle resort",
  ]);


  // =========================================================
  // SMALL LUXURY HOTEL
  // =========================================================

  luxuryAppendIfAny("luxury_style", "small_luxury_hotel", [
    "small luxury hotel",
    "kleines luxushotel",
    "kleines exklusives hotel",
    "kleines feines hotel",
  ]);


  // =========================================================
  // PRIVATVILLA
  // =========================================================

  luxuryAppendIfAny("luxury_accommodation", "private_villa", [
    "privatvilla",
    "private villa",
    "private luxusvilla",
    "private luxus villa",
    "eigene villa",
    "exklusive villa",
  ]);


  // =========================================================
  // LUXUSVILLA
  // =========================================================

  luxuryAppendIfAny("luxury_accommodation", "luxury_villa", [
    "luxusvilla",
    "luxus villa",
    "luxuriöse villa",
    "luxurioese villa",
    "luxury villa",
  ]);


  // =========================================================
  // PRIVATE RESIDENCE
  // =========================================================

  luxuryAppendIfAny("luxury_accommodation", "private_residence", [
    "private residence",
    "private residenz",
    "privatresidenz",
    "private wohnresidenz",
  ]);


  // =========================================================
  // PRIVATE ESTATE
  // =========================================================

  luxuryAppendIfAny("luxury_accommodation", "private_estate", [
    "private estate",
    "privates anwesen",
    "exklusives anwesen",
    "luxusanwesen",
  ]);


  // =========================================================
  // PENTHOUSE
  // =========================================================

  luxuryAppendIfAny("luxury_accommodation", "penthouse", [
    "penthouse",
    "penthouse suite",
    "luxus penthouse",
    "luxuspenthouse",
  ]);


  // =========================================================
  // PRÄSIDENTENSUITE
  // =========================================================

  luxuryAppendIfAny("luxury_accommodation", "presidential_suite", [
    "präsidentensuite",
    "praesidentensuite",
    "presidential suite",
    "präsidenten suite",
    "praesidenten suite",
  ]);


  // =========================================================
  // ROYAL SUITE
  // =========================================================

  luxuryAppendIfAny("luxury_accommodation", "royal_suite", [
    "royal suite",
    "königssuite",
    "koenigssuite",
    "royal suite hotel",
  ]);


  // =========================================================
  // SCHLOSS
  // =========================================================

  luxuryAppendIfAny("luxury_accommodation", "castle", [
    "schloss",
    "schlosshotel",
    "übernachten im schloss",
    "uebernachten im schloss",
    "castle hotel",
    "castle stay",
  ]);


  // =========================================================
  // BURG
  // =========================================================

  luxuryAppendIfAny("luxury_accommodation", "historic_castle", [
    "burg",
    "burghotel",
    "übernachten in einer burg",
    "uebernachten in einer burg",
    "castle accommodation",
  ]);


  // =========================================================
  // PALAST
  // =========================================================

  luxuryAppendIfAny("luxury_accommodation", "palace", [
    "palast",
    "palasthotel",
    "palace hotel",
    "historic palace",
  ]);


  // =========================================================
  // RIAD
  // =========================================================

  luxuryAppendIfAny("luxury_accommodation", "riad", [
    "riad",
    "luxusriad",
    "luxury riad",
    "privater riad",
  ]);


  // =========================================================
  // OVERWATER BUNGALOW
  // =========================================================

  luxuryAppendIfAny("luxury_accommodation", "overwater_bungalow", [
    "overwater bungalow",
    "overwater-bungalow",
    "wasserbungalow",
    "bungalow über dem wasser",
    "bungalow ueber dem wasser",
  ]);


  // =========================================================
  // OVERWATER VILLA
  // =========================================================

  luxuryAppendIfAny("luxury_accommodation", "overwater_villa", [
    "overwater villa",
    "overwater-villa",
    "wasservilla",
    "villa über dem wasser",
    "villa ueber dem wasser",
  ]);


  // =========================================================
  // BEACH VILLA
  // =========================================================

  luxuryAppendIfAny("luxury_accommodation", "beach_villa", [
    "beach villa",
    "strandvilla",
    "villa direkt am strand",
    "private strandvilla",
  ]);


  // =========================================================
  // POOL VILLA
  // =========================================================

  luxuryAppendIfAny("luxury_accommodation", "pool_villa", [
    "pool villa",
    "poolvilla",
    "villa mit privatpool",
    "villa mit eigenem pool",
  ]);


  // =========================================================
  // TREEHOUSE LUXURY
  // =========================================================

  luxuryAppendIfAny("luxury_accommodation", "luxury_treehouse", [
    "luxus baumhaus",
    "luxusbaumhaus",
    "luxury treehouse",
    "exklusives baumhaus",
  ]);


  // =========================================================
  // GLAMPING LUXURY
  // =========================================================

  luxuryAppendIfAny("luxury_accommodation", "luxury_glamping", [
    "luxus glamping",
    "luxusglamping",
    "luxury glamping",
    "luxus zelt",
    "luxuszelt",
  ]);


  // =========================================================
  // PRIVATE ISLAND
  // =========================================================

  luxuryAppendIfAny("luxury_accommodation", "private_island", [
    "privatinsel",
    "private insel",
    "private island",
    "eigene insel",
  ]);


  // =========================================================
  // EXKLUSIVE STRANDLAGE
  // =========================================================

  luxuryAppendIfAny("luxury_location", "exclusive_beachfront", [
    "exklusive strandlage",
    "direkt am exklusiven strand",
    "luxus direkt am strand",
    "luxus strandlage",
  ]);


  // =========================================================
  // PRIVATSTRAND
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "private_beach", [
    "privatstrand",
    "privater strand",
    "private beach",
    "eigener strand",
  ]);


  // =========================================================
  // PRIVATE BADEBUCHT
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "private_bay", [
    "private bucht",
    "privatbucht",
    "eigene bucht",
    "private bay",
  ]);


  // =========================================================
  // PRIVATER STEG
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "private_jetty", [
    "privater steg",
    "eigener steg",
    "privatsteg",
    "private jetty",
  ]);


  // =========================================================
  // PRIVATER YACHTLIEGEPLATZ
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "private_yacht_berth", [
    "privater yachtliegeplatz",
    "eigener yachtliegeplatz",
    "private yacht berth",
    "yacht liegeplatz",
  ]);


  // =========================================================
  // PRIVATPOOL
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "private_pool", [
    "privatpool",
    "privater pool",
    "eigener pool",
    "private pool",
  ]);


  // =========================================================
  // INFINITY POOL
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "infinity_pool", [
    "infinity pool",
    "infinitypool",
    "endlos pool",
    "endloser pool",
  ]);


  // =========================================================
  // ROOFTOP POOL
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "rooftop_pool", [
    "rooftop pool",
    "dachpool",
    "pool auf dem dach",
    "pool auf der dachterrasse",
  ]);


  // =========================================================
  // PRIVATE SPA
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "private_spa", [
    "private spa",
    "privater spa",
    "eigener spa",
    "privater wellnessbereich",
    "private wellnessbereich",
  ]);


  // =========================================================
  // PRIVATE SAUNA
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "private_sauna", [
    "private sauna",
    "eigene sauna",
    "privatsauna",
    "private sauna im zimmer",
  ]);


  // =========================================================
  // PRIVATE HOT TUB
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "private_hot_tub", [
    "privater whirlpool",
    "eigener whirlpool",
    "private hot tub",
    "private jacuzzi",
  ]);


  // =========================================================
  // PRIVATE FITNESS AREA
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "private_gym", [
    "privates fitnessstudio",
    "eigener fitnessraum",
    "private gym",
    "private fitness area",
  ]);


  // =========================================================
  // PRIVATE CINEMA
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "private_cinema", [
    "privates kino",
    "private cinema",
    "heimkino",
    "cinema room",
  ]);


  // =========================================================
  // WEINKELLER
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "wine_cellar", [
    "weinkeller",
    "privater weinkeller",
    "wine cellar",
  ]);


  // =========================================================
  // PRIVATE BAR
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "private_bar", [
    "private bar",
    "eigene bar",
    "privatbar",
  ]);


  // =========================================================
  // PRIVATE ROOFTOP
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "private_rooftop", [
    "private dachterrasse",
    "eigene dachterrasse",
    "private rooftop",
    "privates rooftop",
  ]);


  // =========================================================
  // BUTLER-SERVICE
  // =========================================================

  luxuryAppendIfAny("luxury_service", "butler_service", [
    "butler",
    "butlerservice",
    "butler service",
    "privater butler",
    "persönlicher butler",
    "persoenlicher butler",
  ]);


  // =========================================================
  // PRIVATER CONCIERGE
  // =========================================================

  luxuryAppendIfAny("luxury_service", "private_concierge", [
    "privater concierge",
    "persönlicher concierge",
    "persoenlicher concierge",
    "private concierge",
    "concierge service",
  ]);


  // =========================================================
  // 24H CONCIERGE
  // =========================================================

  luxuryAppendIfAny("luxury_service", "concierge_24h", [
    "24h concierge",
    "24 stunden concierge",
    "24/7 concierge",
    "concierge rund um die uhr",
  ]);


  // =========================================================
  // PRIVATE CHEF
  // =========================================================

  luxuryAppendIfAny("luxury_service", "private_chef", [
    "private chef",
    "privater koch",
    "persönlicher koch",
    "persoenlicher koch",
    "eigener koch",
  ]);


  // =========================================================
  // PRIVATER BARMAN / MIXOLOGIST
  // =========================================================

  luxuryAppendIfAny("luxury_service", "private_bartender", [
    "privater bartender",
    "private bartender",
    "privater barmann",
    "mixologist",
    "privater mixologe",
  ]);


  // =========================================================
  // ZIMMERSERVICE 24H
  // =========================================================

  luxuryAppendIfAny("luxury_service", "room_service_24h", [
    "24h zimmerservice",
    "24 stunden zimmerservice",
    "zimmerservice rund um die uhr",
    "24/7 room service",
  ]);


  // =========================================================
  // PRIVATE DINING
  // =========================================================

  luxuryAppendIfAny("luxury_service", "private_dining", [
    "private dining",
    "privates dinner",
    "privates abendessen",
    "private mahlzeiten",
  ]);


  // =========================================================
  // FINE DINING
  // =========================================================

  luxuryAppendIfAny("luxury_service", "fine_dining", [
    "fine dining",
    "fine-dining",
    "gourmetrestaurant",
    "sterneküche",
    "sternekueche",
    "gehobene gastronomie",
  ]);


  // =========================================================
  // MICHELIN
  // =========================================================

  luxuryAppendIfAny("luxury_service", "michelin_restaurant", [
    "michelin restaurant",
    "michelin stern",
    "sternerestaurant",
    "restaurant mit michelin stern",
  ]);


  // =========================================================
  // PRIVATER TRANSFER
  // =========================================================

  luxuryAppendIfAny("luxury_service", "private_transfer", [
    "privater transfer",
    "private transfer",
    "chauffeur transfer",
    "privattransfer",
  ]);


  // =========================================================
  // VIP TRANSFER
  // =========================================================

  luxuryAppendIfAny("luxury_service", "vip_transfer", [
    "vip transfer",
    "vip-transfer",
    "vip shuttle",
    "vip airport transfer",
  ]);


  // =========================================================
  // CHAUFFEUR
  // =========================================================

  luxuryAppendIfAny("luxury_service", "chauffeur", [
    "chauffeur",
    "chauffeurservice",
    "chauffeur service",
    "privater fahrer",
    "persönlicher fahrer",
    "persoenlicher fahrer",
  ]);


  // =========================================================
  // LUXUSFAHRZEUG
  // =========================================================

  luxuryAppendIfAny("luxury_service", "luxury_car", [
    "luxusauto",
    "luxusfahrzeug",
    "luxury car",
    "limousine",
    "limousinenservice",
  ]);


  // =========================================================
  // HELIKOPTER-TRANSFER
  // =========================================================

  luxuryAppendIfAny("luxury_service", "helicopter_transfer", [
    "helikopter transfer",
    "helikoptertransfer",
    "helicopter transfer",
    "hubschrauber transfer",
    "hubschraubertransfer",
  ]);


  // =========================================================
  // PRIVATER HELIKOPTER
  // =========================================================

  luxuryAppendIfAny("luxury_service", "private_helicopter", [
    "privater helikopter",
    "private helicopter",
    "privater hubschrauber",
  ]);


  // =========================================================
  // PRIVATJET TRANSFER
  // =========================================================

  luxuryAppendIfAny("luxury_service", "private_jet_transfer", [
    "privatjet transfer",
    "private jet transfer",
    "private jet service",
    "privatjet service",
  ]);


  // =========================================================
  // YACHT
  // =========================================================

  luxuryAppendIfAny("luxury_service", "private_yacht", [
    "private yacht",
    "privatyacht",
    "eigene yacht",
    "yachtservice",
  ]);


  // =========================================================
  // YACHT CHARTER
  // =========================================================

  luxuryAppendIfAny("luxury_service", "yacht_charter", [
    "yacht charter",
    "yachtcharter",
    "private yacht charter",
    "yacht mieten",
  ]);


  // =========================================================
  // PRIVATBOOT
  // =========================================================

  luxuryAppendIfAny("luxury_service", "private_boat", [
    "privates boot",
    "private boat",
    "eigenes boot",
    "privatboot",
  ]);


  // =========================================================
  // BODYGUARD / SECURITY
  // =========================================================

  luxuryAppendIfAny("luxury_service", "private_security", [
    "private security",
    "privater sicherheitsdienst",
    "security service",
    "personenschutz",
    "bodyguard",
  ]);


  // =========================================================
  // VIP CHECK-IN
  // =========================================================

  luxuryAppendIfAny("luxury_service", "vip_check_in", [
    "vip check in",
    "vip check-in",
    "privater check in",
    "private check-in",
    "diskreter check in",
  ]);


  // =========================================================
  // PRIVATE REZEPTION
  // =========================================================

  luxuryAppendIfAny("luxury_service", "private_reception", [
    "private rezeption",
    "private reception",
    "private lobby",
    "separate rezeption",
  ]);


  // =========================================================
  // DISKRETION
  // =========================================================

  luxuryAppendIfAny("luxury_preference", "discreet", [
    "diskret",
    "diskrete unterkunft",
    "diskretion",
    "diskreter service",
    "privacy",
  ]);


  // =========================================================
  // MAXIMALE PRIVATSPHÄRE
  // =========================================================

  luxuryAppendIfAny("luxury_preference", "maximum_privacy", [
    "maximale privatsphäre",
    "maximale privatsphaere",
    "absolute privatsphäre",
    "absolute privatsphaere",
    "höchste privatsphäre",
    "hoechste privatsphaere",
    "vollständig privat",
    "vollstaendig privat",
  ]);


  // =========================================================
  // ABGESCHIRMTE LAGE
  // =========================================================

  luxuryAppendIfAny("luxury_location", "secluded", [
    "abgeschirmte lage",
    "abgelegen",
    "in alleinlage",
    "ohne nachbarn",
    "keine direkten nachbarn",
    "secluded",
  ]);


  // =========================================================
  // EXKLUSIVE INSELLAGE
  // =========================================================

  luxuryAppendIfAny("luxury_location", "exclusive_island", [
    "exklusive insellage",
    "auf einer exklusiven insel",
    "auf einer privatinsel",
    "luxusinsel",
  ]);


  // =========================================================
  // EXKLUSIVE BERGLAGE
  // =========================================================

  luxuryAppendIfAny("luxury_location", "exclusive_mountain_location", [
    "exklusive berglage",
    "luxus in den bergen",
    "luxushotel in den bergen",
    "exklusiv in den bergen",
  ]);


  // =========================================================
  // EXKLUSIVE STADTLAGE
  // =========================================================

  luxuryAppendIfAny("luxury_location", "exclusive_city_location", [
    "exklusive stadtlage",
    "luxus im stadtzentrum",
    "luxus in der innenstadt",
    "exklusiv im zentrum",
  ]);


  // =========================================================
  // PANORAMABLICK
  // =========================================================

  luxuryAppendIfAny("luxury_view", "panoramic_view", [
    "panoramablick",
    "panoramaaussicht",
    "panorama aussicht",
    "panoramic view",
  ]);


  // =========================================================
  // MEERBLICK
  // =========================================================

  luxuryAppendIfAny("luxury_view", "sea_view", [
    "meerblick",
    "blick aufs meer",
    "blick auf das meer",
    "sea view",
  ]);


  // =========================================================
  // BERGBLICK
  // =========================================================

  luxuryAppendIfAny("luxury_view", "mountain_view", [
    "bergblick",
    "bergpanorama",
    "blick auf die berge",
    "mountain view",
  ]);


  // =========================================================
  // SKYLINE VIEW
  // =========================================================

  luxuryAppendIfAny("luxury_view", "skyline_view", [
    "skyline blick",
    "skyline view",
    "blick auf die skyline",
    "stadtpanorama",
  ]);


  // =========================================================
  // SONNENUNTERGANG
  // =========================================================

  luxuryAppendIfAny("luxury_view", "sunset_view", [
    "sonnenuntergangsblick",
    "blick auf den sonnenuntergang",
    "sunset view",
  ]);


  // =========================================================
  // SONNENAUFGANG
  // =========================================================

  luxuryAppendIfAny("luxury_view", "sunrise_view", [
    "sonnenaufgangsblick",
    "blick auf den sonnenaufgang",
    "sunrise view",
  ]);


  // =========================================================
  // PERSONALISIERTER SERVICE
  // =========================================================

  luxuryAppendIfAny("luxury_service", "personalized_service", [
    "personalisierter service",
    "individueller service",
    "maßgeschneiderter service",
    "massgeschneiderter service",
    "besonders persönlicher service",
    "besonders persoenlicher service",
  ]);


  // =========================================================
  // TAILOR-MADE
  // =========================================================

  luxuryAppendIfAny("luxury_service", "tailor_made", [
    "tailor made",
    "tailor-made",
    "maßgeschneidert",
    "massgeschneidert",
    "individuell zusammengestellt",
  ]);


  // =========================================================
  // VIP-SERVICE
  // =========================================================

  luxuryAppendIfAny("luxury_service", "vip_service", [
    "vip service",
    "vip-service",
    "vip betreuung",
    "vip treatment",
  ]);


  // =========================================================
  // PRIORITY SERVICE
  // =========================================================

  luxuryAppendIfAny("luxury_service", "priority_service", [
    "priority service",
    "priority check in",
    "priority check-in",
    "bevorzugter service",
  ]);


  // =========================================================
  // EXKLUSIVER CLUB / LOUNGE
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "private_lounge", [
    "private lounge",
    "exklusive lounge",
    "club lounge",
    "vip lounge",
  ]);


  // =========================================================
  // CLUB LEVEL
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "club_level", [
    "club level",
    "club floor",
    "executive floor",
    "executive level",
  ]);


  // =========================================================
  // EXECUTIVE LOUNGE
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "executive_lounge", [
    "executive lounge",
    "executive-lounge",
    "business lounge exklusiv",
  ]);


  // =========================================================
  // PRIVATE EINGANG
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "private_entrance", [
    "privater eingang",
    "eigener eingang",
    "separater eingang",
    "private entrance",
  ]);


  // =========================================================
  // PRIVATE AUFFAHRT
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "private_driveway", [
    "private auffahrt",
    "eigene auffahrt",
    "private driveway",
  ]);


  // =========================================================
  // VALET PARKING
  // =========================================================

  luxuryAppendIfAny("luxury_service", "valet_parking", [
    "valet parking",
    "valet-parking",
    "parkservice",
    "wagenmeister",
  ]);


  // =========================================================
  // PRIVATGARAGE
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "private_garage", [
    "privatgarage",
    "private garage",
    "eigene garage",
  ]);


  // =========================================================
  // HELIPAD
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "helipad", [
    "helipad",
    "helikopterlandeplatz",
    "hubschrauberlandeplatz",
    "private helipad",
  ]);


  // =========================================================
  // PRIVATER AUFZUG
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "private_elevator", [
    "privater aufzug",
    "eigener aufzug",
    "private elevator",
    "privatlift",
  ]);


  // =========================================================
  // SMART HOME
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "smart_home", [
    "smart home",
    "smarthome",
    "intelligentes zimmer",
    "smart room",
    "hausautomation",
  ]);


  // =========================================================
  // HIGH-END AUDIO
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "premium_audio", [
    "high end audio",
    "high-end audio",
    "premium soundsystem",
    "luxus soundsystem",
    "bose soundsystem",
    "sonos",
  ]);


  // =========================================================
  // PRIVATES BÜRO
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "private_office", [
    "privates büro",
    "privates buero",
    "private office",
    "eigenes büro",
    "eigenes buero",
  ]);


  // =========================================================
  // ANKLEIDEZIMMER
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "walk_in_closet", [
    "ankleidezimmer",
    "begehbarer kleiderschrank",
    "walk in closet",
    "walk-in closet",
  ]);


  // =========================================================
  // MARMORBAD
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "marble_bathroom", [
    "marmorbad",
    "marmor badezimmer",
    "marmorbadezimmer",
    "marble bathroom",
  ]);


  // =========================================================
  // RAIN SHOWER
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "rain_shower", [
    "regendusche",
    "rain shower",
    "rainshower",
    "luxusdusche",
  ]);


  // =========================================================
  // DESIGNER-BAD
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "designer_bathroom", [
    "designerbad",
    "designer badezimmer",
    "designbad",
    "luxusbadezimmer",
  ]);


  // =========================================================
  // FREISTEHENDE BADEWANNE
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "freestanding_bathtub", [
    "freistehende badewanne",
    "freistehende wanne",
    "freestanding bathtub",
  ]);


  // =========================================================
  // LUXUS-BETTWÄSCHE
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "premium_bedding", [
    "luxusbettwäsche",
    "luxusbettwaesche",
    "premium bettwäsche",
    "premium bettwaesche",
    "hochwertige bettwäsche",
    "hochwertige bettwaesche",
  ]);


  // =========================================================
  // PILLOW MENU
  // =========================================================

  luxuryAppendIfAny("luxury_service", "pillow_menu", [
    "kissenmenü",
    "kissenmenue",
    "pillow menu",
    "kissenauswahl",
  ]);


  // =========================================================
  // TURNDOWN SERVICE
  // =========================================================

  luxuryAppendIfAny("luxury_service", "turndown_service", [
    "turndown service",
    "turndown-service",
    "abendlicher zimmerservice",
    "abendservice im zimmer",
  ]);


  // =========================================================
  // HOUSEKEEPING MEHRFACH TÄGLICH
  // =========================================================

  luxuryAppendIfAny("luxury_service", "enhanced_housekeeping", [
    "mehrmals tägliche reinigung",
    "mehrmals taegliche reinigung",
    "mehrfach tägliches housekeeping",
    "mehrfach taegliches housekeeping",
    "twice daily housekeeping",
  ]);


  // =========================================================
  // PERSONAL SHOPPER
  // =========================================================

  luxuryAppendIfAny("luxury_service", "personal_shopper", [
    "personal shopper",
    "privater shopper",
    "shopping assistent",
  ]);


  // =========================================================
  // PRIVATE TOUR GUIDE
  // =========================================================

  luxuryAppendIfAny("luxury_service", "private_guide", [
    "privater guide",
    "private guide",
    "privater reiseführer",
    "privater reisefuehrer",
    "private tour guide",
  ]);


  // =========================================================
  // EXKLUSIVE AUSFLÜGE
  // =========================================================

  luxuryAppendIfAny("luxury_service", "exclusive_excursions", [
    "exklusive ausflüge",
    "exklusive ausfluege",
    "private ausflüge",
    "private ausfluege",
    "private excursions",
  ]);


  // =========================================================
  // PRIVATE SAFARI
  // =========================================================

  luxuryAppendIfAny("luxury_service", "private_safari", [
    "private safari",
    "privatsafari",
    "private game drive",
  ]);


  // =========================================================
  // PRIVATE TAUCHTOUR
  // =========================================================

  luxuryAppendIfAny("luxury_service", "private_diving", [
    "privater tauchausflug",
    "private diving trip",
    "privates tauchen",
    "private dive",
  ]);


  // =========================================================
  // PRIVATER SKILEHRER
  // =========================================================

  luxuryAppendIfAny("luxury_service", "private_ski_instructor", [
    "privater skilehrer",
    "private ski instructor",
    "persönlicher skilehrer",
    "persoenlicher skilehrer",
  ]);


  // =========================================================
  // PRIVATER YOGALEHRER
  // =========================================================

  luxuryAppendIfAny("luxury_service", "private_yoga_instructor", [
    "privater yogalehrer",
    "private yoga instructor",
    "private yogastunde",
  ]);


  // =========================================================
  // PERSONAL TRAINER
  // =========================================================

  luxuryAppendIfAny("luxury_service", "personal_trainer", [
    "personal trainer",
    "privater trainer",
    "persönlicher trainer",
    "persoenlicher trainer",
  ]);


  // =========================================================
  // PRIVATE SPA-TREATMENTS
  // =========================================================

  luxuryAppendIfAny("luxury_service", "private_spa_treatments", [
    "private spa behandlung",
    "private spa behandlungen",
    "spa behandlung im zimmer",
    "massage im zimmer",
    "in room spa treatment",
  ]);


  // =========================================================
  // UNENDLICHKEITSPOOL MIT AUSSICHT
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "infinity_pool_view", [
    "infinity pool mit meerblick",
    "infinity pool mit bergblick",
    "infinity pool mit aussicht",
    "infinity pool mit panorama",
  ]);


  // =========================================================
  // FLOATING BREAKFAST
  // =========================================================

  luxuryAppendIfAny("luxury_service", "floating_breakfast", [
    "floating breakfast",
    "frühstück im pool",
    "fruehstueck im pool",
    "schwimmendes frühstück",
    "schwimmendes fruehstueck",
  ]);


  // =========================================================
  // CHAMPAGNER BEI ANKUNFT
  // =========================================================

  luxuryAppendIfAny("luxury_service", "champagne_welcome", [
    "champagner bei ankunft",
    "champagner zur begrüßung",
    "champagner zur begruessung",
    "champagne welcome",
  ]);


  // =========================================================
  // WILLKOMMENSGESCHENK
  // =========================================================

  luxuryAppendIfAny("luxury_service", "welcome_gift", [
    "willkommensgeschenk",
    "welcome gift",
    "begrüßungsgeschenk",
    "begruessungsgeschenk",
  ]);


  // =========================================================
  // PRIVATE EXPERIENCE
  // =========================================================

  luxuryAppendIfAny("luxury_preference", "private_experience", [
    "private erlebnisse",
    "private erlebnisse nur für uns",
    "private erlebnisse nur fuer uns",
    "exclusive experiences",
    "private experiences",
  ]);


  // =========================================================
  // EINZIGARTIGE UNTERKUNFT
  // =========================================================

  luxuryAppendIfAny("luxury_preference", "unique_luxury_stay", [
    "einzigartige luxusunterkunft",
    "außergewöhnliche luxusunterkunft",
    "aussergewoehnliche luxusunterkunft",
    "besondere luxusunterkunft",
    "unique luxury stay",
  ]);


  // =========================================================
  // ARCHITEKTUR-HIGHLIGHT
  // =========================================================

  luxuryAppendIfAny("luxury_style", "architecture_highlight", [
    "besondere architektur",
    "außergewöhnliche architektur",
    "aussergewoehnliche architektur",
    "architektur highlight",
    "design architektur",
  ]);


  // =========================================================
  // HISTORISCHER LUXUS
  // =========================================================

  luxuryAppendIfAny("luxury_style", "historic_luxury", [
    "historischer luxus",
    "historisches luxushotel",
    "luxus in historischem gebäude",
    "luxus in historischem gebaeude",
    "historic luxury",
  ]);


  // =========================================================
  // MODERNER LUXUS
  // =========================================================

  luxuryAppendIfAny("luxury_style", "modern_luxury", [
    "moderner luxus",
    "modernes luxushotel",
    "moderner luxusstil",
    "modern luxury",
  ]);


  // =========================================================
  // MINIMALISTISCHER LUXUS
  // =========================================================

  luxuryAppendIfAny("luxury_style", "minimalist_luxury", [
    "minimalistischer luxus",
    "minimalistisches luxushotel",
    "minimal luxury",
  ]);


  // =========================================================
  // ECO LUXURY
  // =========================================================

  luxuryAppendIfAny("luxury_style", "eco_luxury", [
    "eco luxury",
    "eco-luxury",
    "ökologischer luxus",
    "oekologischer luxus",
    "nachhaltiger luxus",
    "luxus und nachhaltig",
  ]);


  // =========================================================
  // ADULTS ONLY LUXURY
  // =========================================================

  luxuryAppendIfAny("luxury_preference", "adults_only_luxury", [
    "luxus adults only",
    "luxus nur für erwachsene",
    "luxus nur fuer erwachsene",
    "adults only luxushotel",
    "adults-only luxury",
  ]);


  // =========================================================
  // PRIVATER BEREICH IM RESORT
  // =========================================================

  luxuryAppendIfAny("luxury_feature", "private_resort_area", [
    "privater bereich im resort",
    "exklusiver resortbereich",
    "private area",
    "private wing",
  ]);


  // =========================================================
  // VILLA HOST
  // =========================================================

  luxuryAppendIfAny("luxury_service", "villa_host", [
    "villa host",
    "privater villa host",
    "villa manager",
    "privater villa manager",
  ]);


  // =========================================================
  // PRIVATER HOUSEKEEPER
  // =========================================================

  luxuryAppendIfAny("luxury_service", "private_housekeeper", [
    "private housekeeper",
    "privater housekeeper",
    "persönliches housekeeping",
    "persoenliches housekeeping",
  ]);


  // =========================================================
  // KOMPLETTES PERSONAL
  // =========================================================

  luxuryAppendIfAny("luxury_service", "full_staff", [
    "vollständiges personal",
    "vollstaendiges personal",
    "komplettes personal",
    "full staff",
    "fully staffed villa",
  ]);
}