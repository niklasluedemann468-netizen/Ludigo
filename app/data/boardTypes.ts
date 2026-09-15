export type BoardTypeEntry = {
  feature: string;
  aliases: string[];
};

export const boardTypes: BoardTypeEntry[] = [
  // =========================================================
  // NUR FRÜHSTÜCK / FRÜHSTÜCK VERFÜGBAR
  // =========================================================
  {
    feature: "breakfast",
    aliases: [
      "frühstück",
      "fruehstueck",
      "mit frühstück",
      "mit fruehstueck",
      "frühstück verfügbar",
      "fruehstueck verfuegbar",
      "frühstück möglich",
      "fruehstueck moeglich",
      "frühstück buchbar",
      "fruehstueck buchbar",
      "frühstück optional",
      "fruehstueck optional",
      "breakfast",
      "breakfast available",
      "breakfast option",
      "breakfast optional",
      "breakfast service",
      "morgenessen",
    ],
  },

  // =========================================================
  // FRÜHSTÜCK INKLUSIVE
  // =========================================================
  {
    feature: "breakfast_included",
    aliases: [
      "frühstück inklusive",
      "fruehstueck inklusive",
      "inklusive frühstück",
      "inklusive fruehstueck",
      "frühstück inbegriffen",
      "fruehstueck inbegriffen",
      "frühstück ist inklusive",
      "fruehstueck ist inklusive",
      "frühstück im preis",
      "fruehstueck im preis",
      "frühstück im preis enthalten",
      "fruehstueck im preis enthalten",
      "frühstück enthalten",
      "fruehstueck enthalten",
      "frühstück gratis",
      "fruehstueck gratis",
      "kostenloses frühstück",
      "kostenloses fruehstueck",
      "mit inbegriffenem frühstück",
      "mit inbegriffenem fruehstueck",
      "inkl frühstück",
      "inkl. frühstück",
      "inkl fruehstueck",
      "breakfast included",
      "included breakfast",
      "breakfast is included",
      "complimentary breakfast",
      "free breakfast",
      "breakfast included in price",
    ],
  },

  // =========================================================
  // KONTINENTALES / BUFFET / À-LA-CARTE-FRÜHSTÜCK
  // =========================================================
  {
    feature: "continental_breakfast",
    aliases: [
      "kontinentales frühstück",
      "kontinentales fruehstueck",
      "continental breakfast",
    ],
  },
  {
    feature: "breakfast_buffet",
    aliases: [
      "frühstücksbuffet",
      "fruehstuecksbuffet",
      "frühstück buffet",
      "fruehstueck buffet",
      "buffetfrühstück",
      "buffetfruehstueck",
      "breakfast buffet",
      "buffet breakfast",
    ],
  },
  {
    feature: "a_la_carte_breakfast",
    aliases: [
      "à la carte frühstück",
      "a la carte frühstück",
      "a la carte fruehstueck",
      "frühstück à la carte",
      "fruehstueck a la carte",
      "a la carte breakfast",
    ],
  },

  // =========================================================
  // HALBPENSION
  // =========================================================
  {
    feature: "half_board",
    aliases: [
      "halbpension",
      "hp",
      "half board",
      "half-board",
      "frühstück und abendessen",
      "fruehstueck und abendessen",
      "frühstück plus abendessen",
      "fruehstueck plus abendessen",
      "frühstück mit abendessen",
      "fruehstueck mit abendessen",
      "mit frühstück und abendessen",
      "mit fruehstueck und abendessen",
      "mit abendessen",
      "abendessen inklusive",
      "abendessen inbegriffen",
      "zwei mahlzeiten",
      "2 mahlzeiten",
      "breakfast and dinner",
      "breakfast plus dinner",
      "breakfast & dinner",
      "breakfast and evening meal",
    ],
  },

  // =========================================================
  // HALBPENSION PLUS
  // =========================================================
  {
    feature: "half_board_plus",
    aliases: [
      "halbpension plus",
      "hp plus",
      "half board plus",
      "half-board plus",
      "halbpension mit getränken",
      "halbpension mit getraenken",
      "half board with drinks",
    ],
  },

  // =========================================================
  // VOLLPENSION
  // =========================================================
  {
    feature: "full_board",
    aliases: [
      "vollpension",
      "vp",
      "full board",
      "full-board",
      "frühstück mittagessen und abendessen",
      "fruehstueck mittagessen und abendessen",
      "frühstück, mittagessen und abendessen",
      "fruehstueck mittag und abend",
      "drei mahlzeiten",
      "3 mahlzeiten",
      "alle mahlzeiten",
      "breakfast lunch and dinner",
      "breakfast, lunch and dinner",
      "three meals",
      "three meals a day",
    ],
  },

  // =========================================================
  // VOLLPENSION PLUS
  // =========================================================
  {
    feature: "full_board_plus",
    aliases: [
      "vollpension plus",
      "vp plus",
      "full board plus",
      "full-board plus",
      "vollpension mit getränken",
      "vollpension mit getraenken",
      "full board with drinks",
    ],
  },

  // =========================================================
  // ALL INCLUSIVE
  // =========================================================
  {
    feature: "all_inclusive",
    aliases: [
      "all inclusive",
      "all-inclusive",
      "allinclusive",
      "all incl",
      "all incl.",
      "ai",
      "alles inklusive",
      "alles inbegriffen",
      "alles drin",
      "alles enthalten",
      "komplett inklusive",
      "all inclusive urlaub",
      "all inclusive hotel",
      "all inclusive resort",
      "all inclusive verpflegung",
      "all inclusive package",
      "all inclusive holiday",
      "all inclusive vacation",
      "all meals and drinks",
      "meals and drinks included",
    ],
  },

  // =========================================================
  // ALL INCLUSIVE PLUS
  // =========================================================
  {
    feature: "all_inclusive_plus",
    aliases: [
      "all inclusive plus",
      "all-inclusive plus",
      "allinclusive plus",
      "ai plus",
      "all incl plus",
      "all inclusive premium",
      "premium all inclusive",
      "all inclusive mit extras",
      "all inclusive mit extra leistungen",
    ],
  },

  // =========================================================
  // ULTRA ALL INCLUSIVE
  // =========================================================
  {
    feature: "ultra_all_inclusive",
    aliases: [
      "ultra all inclusive",
      "ultra-all-inclusive",
      "ultra all-inclusive",
      "ultraallinclusive",
      "uai",
      "ultra ai",
      "24 stunden all inclusive",
      "24-stunden-all-inclusive",
      "24h all inclusive",
      "24 h all inclusive",
      "all inclusive rund um die uhr",
      "all inclusive 24 stunden",
      "premium all inclusive",
      "luxury all inclusive",
      "ultra inclusive",
    ],
  },

  // =========================================================
  // SOFT ALL INCLUSIVE
  // =========================================================
  {
    feature: "soft_all_inclusive",
    aliases: [
      "soft all inclusive",
      "soft-all-inclusive",
      "soft ai",
      "all inclusive ohne alkohol",
      "all inclusive ohne alkoholische getränke",
      "all inclusive ohne alkoholische getraenke",
      "non alcoholic all inclusive",
    ],
  },

  // =========================================================
  // GETRÄNKE INKLUSIVE
  // =========================================================
  {
    feature: "drinks_included",
    aliases: [
      "getränke inklusive",
      "getraenke inklusive",
      "inklusive getränke",
      "inklusive getraenke",
      "getränke inbegriffen",
      "getraenke inbegriffen",
      "drinks included",
      "beverages included",
    ],
  },

  // =========================================================
  // ALKOHOLISCHE GETRÄNKE INKLUSIVE
  // =========================================================
  {
    feature: "alcoholic_drinks_included",
    aliases: [
      "alkohol inklusive",
      "alkoholische getränke inklusive",
      "alkoholische getraenke inklusive",
      "alkohol inbegriffen",
      "alcohol included",
      "alcoholic drinks included",
    ],
  },

  // =========================================================
  // SELBSTVERPFLEGUNG
  // =========================================================
  {
    feature: "self_catering",
    aliases: [
      "selbstverpflegung",
      "selbst versorgen",
      "selber versorgen",
      "selbst kochen",
      "selber kochen",
      "wir kochen selbst",
      "eigene verpflegung",
      "ohne verpflegung",
      "keine verpflegung",
      "ohne mahlzeiten",
      "keine mahlzeiten",
      "nur unterkunft",
      "nur übernachtung",
      "nur uebernachtung",
      "self catering",
      "self-catering",
      "self catered",
      "self-catered",
      "room only",
      "accommodation only",
      "no meals",
      "without meals",
      "eigene küche",
      "eigene kueche",
      "mit eigener küche",
      "mit eigener kueche",
      "küche zum selber kochen",
      "kueche zum selber kochen",
    ],
  },

  // =========================================================
  // NUR ÜBERNACHTUNG
  // =========================================================
  {
    feature: "room_only",
    aliases: [
      "nur übernachtung",
      "nur uebernachtung",
      "nur zimmer",
      "ohne essen",
      "ohne frühstück",
      "ohne fruehstueck",
      "room only",
      "accommodation only",
      "bed only",
    ],
  },

  // =========================================================
  // BED & BREAKFAST
  // =========================================================
  {
    feature: "bed_and_breakfast_board",
    aliases: [
      "bed and breakfast",
      "bed & breakfast",
      "b&b",
      "bnb",
      "zimmer mit frühstück",
      "zimmer mit fruehstueck",
      "übernachtung mit frühstück",
      "uebernachtung mit fruehstueck",
    ],
  },

  // =========================================================
  // BRUNCH
  // =========================================================
  {
    feature: "brunch",
    aliases: [
      "brunch",
      "brunch inklusive",
      "brunch included",
    ],
  },

  // =========================================================
  // MITTAGESSEN
  // =========================================================
  {
    feature: "lunch",
    aliases: [
      "mittagessen",
      "mit mittagessen",
      "mittagessen inklusive",
      "mittagessen inbegriffen",
      "lunch",
      "lunch included",
    ],
  },

  // =========================================================
  // ABENDESSEN
  // =========================================================
  {
    feature: "dinner",
    aliases: [
      "abendessen",
      "mit abendessen",
      "abendessen inklusive",
      "abendessen inbegriffen",
      "dinner",
      "dinner included",
      "evening meal",
    ],
  },

  // =========================================================
  // KINDERMAHLZEITEN
  // =========================================================
  {
    feature: "kids_meals",
    aliases: [
      "kindermahlzeiten",
      "kindermenü",
      "kindermenue",
      "kinderessen",
      "essen für kinder",
      "essen fuer kinder",
      "kids meals",
      "children meals",
      "kids menu",
      "children's menu",
    ],
  },

  // =========================================================
  // VEGETARISCH
  // =========================================================
  {
    feature: "vegetarian_food",
    aliases: [
      "vegetarisch",
      "vegetarische küche",
      "vegetarische kueche",
      "vegetarisches essen",
      "vegetarische optionen",
      "vegetarian",
      "vegetarian food",
      "vegetarian options",
    ],
  },

  // =========================================================
  // VEGAN
  // =========================================================
  {
    feature: "vegan_food",
    aliases: [
      "vegan",
      "vegane küche",
      "vegane kueche",
      "veganes essen",
      "vegane optionen",
      "vegan food",
      "vegan options",
    ],
  },

  // =========================================================
  // GLUTENFREI
  // =========================================================
  {
    feature: "gluten_free_food",
    aliases: [
      "glutenfrei",
      "gluten freie kost",
      "glutenfreie kost",
      "glutenfreies essen",
      "glutenfreie optionen",
      "gluten free",
      "gluten-free",
      "gluten free food",
    ],
  },

  // =========================================================
  // LAKTOSEFREI
  // =========================================================
  {
    feature: "lactose_free_food",
    aliases: [
      "laktosefrei",
      "laktose freie kost",
      "laktosefreie kost",
      "laktosefreies essen",
      "lactose free",
      "lactose-free",
    ],
  },

  // =========================================================
  // HALAL
  // =========================================================
  {
    feature: "halal_food",
    aliases: [
      "halal",
      "halal essen",
      "halal food",
      "halal meals",
    ],
  },

  // =========================================================
  // KOSCHER
  // =========================================================
  {
    feature: "kosher_food",
    aliases: [
      "koscher",
      "kosheres essen",
      "kosher",
      "kosher food",
      "kosher meals",
    ],
  },

  // =========================================================
  // DIÄT / SONDERKOST
  // =========================================================
  {
    feature: "special_diet_food",
    aliases: [
      "sonderkost",
      "diätkost",
      "diaetkost",
      "spezielle ernährung",
      "spezielle ernaehrung",
      "besondere ernährung",
      "besondere ernaehrung",
      "special diet",
      "special dietary requirements",
    ],
  },

  // =========================================================
  // RESTAURANT
  // =========================================================
  {
    feature: "restaurant",
    aliases: [
      "restaurant",
      "restaurant im hotel",
      "restaurant vor ort",
      "eigenes restaurant",
      "hotelrestaurant",
      "on site restaurant",
      "on-site restaurant",
    ],
  },

  // =========================================================
  // BAR
  // =========================================================
  {
    feature: "bar",
    aliases: [
      "bar",
      "hotelbar",
      "bar im hotel",
      "bar vor ort",
      "cocktailbar",
      "on site bar",
      "on-site bar",
    ],
  },

  // =========================================================
  // SNACKBAR
  // =========================================================
  {
    feature: "snack_bar",
    aliases: [
      "snackbar",
      "snack bar",
      "snacks",
      "snacks vor ort",
    ],
  },

  // =========================================================
  // POOLBAR
  // =========================================================
  {
    feature: "pool_bar",
    aliases: [
      "poolbar",
      "pool bar",
      "bar am pool",
      "bar beim pool",
    ],
  },

  // =========================================================
  // STRANDBAR
  // =========================================================
  {
    feature: "beach_bar",
    aliases: [
      "strandbar",
      "beach bar",
      "beachbar",
      "bar am strand",
    ],
  },

  // =========================================================
  // ZIMMERSERVICE
  // =========================================================
  {
    feature: "room_service",
    aliases: [
      "zimmerservice",
      "zimmer service",
      "roomservice",
      "room service",
      "essen aufs zimmer",
      "essen ins zimmer",
    ],
  },

  // =========================================================
  // MINIBAR
  // =========================================================
  {
    feature: "minibar",
    aliases: [
      "minibar",
      "mini bar",
      "minibar im zimmer",
    ],
  },

  // =========================================================
  // KÜCHE / KÜCHENZEILE
  // =========================================================
  {
    feature: "kitchen",
    aliases: [
      "küche",
      "kueche",
      "eigene küche",
      "eigene kueche",
      "voll ausgestattete küche",
      "voll ausgestattete kueche",
      "komplette küche",
      "komplette kueche",
      "kitchen",
      "full kitchen",
      "fully equipped kitchen",
    ],
  },
  {
    feature: "kitchenette",
    aliases: [
      "küchenzeile",
      "kuechenzeile",
      "kochnische",
      "kleine küche",
      "kleine kueche",
      "kitchenette",
    ],
  },

  // =========================================================
  // GRILL / BBQ
  // =========================================================
  {
    feature: "bbq",
    aliases: [
      "grill",
      "grillen",
      "grillmöglichkeit",
      "grillmoeglichkeit",
      "grillplatz",
      "bbq",
      "barbecue",
      "barbecue facilities",
    ],
  },

  // =========================================================
  // LEBENSMITTEL / SUPERMARKT
  // =========================================================
  {
    feature: "grocery_store",
    aliases: [
      "supermarkt",
      "lebensmittelladen",
      "lebensmittelgeschäft",
      "lebensmittelgeschaeft",
      "shop für lebensmittel",
      "shop fuer lebensmittel",
      "grocery store",
      "supermarket",
    ],
  },

  // =========================================================
  // BRÖTCHENSERVICE
  // =========================================================
  {
    feature: "bread_service",
    aliases: [
      "brötchenservice",
      "broetchenservice",
      "brötchen dienst",
      "broetchen dienst",
      "frische brötchen",
      "frische broetchen",
      "bread service",
      "bread delivery",
    ],
  },

  // =========================================================
  // CAMPING-SPEZIFISCHE VERPFLEGUNG
  // =========================================================
  {
    feature: "camping_restaurant",
    aliases: [
      "restaurant auf dem campingplatz",
      "camping restaurant",
      "campingplatz restaurant",
    ],
  },
  {
    feature: "camping_shop",
    aliases: [
      "camping shop",
      "campingladen",
      "shop auf dem campingplatz",
      "laden auf dem campingplatz",
    ],
  },

  // =========================================================
  // KAFFEE / CAFÉ
  // =========================================================
  {
    feature: "cafe",
    aliases: [
      "café",
      "cafe",
      "kaffeehaus",
      "coffee shop",
      "coffee bar",
    ],
  },
];