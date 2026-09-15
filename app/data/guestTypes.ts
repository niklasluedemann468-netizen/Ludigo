export type GuestTypeEntry = {
  key: string;
  aliases: string[];
};

export const guestTypes: GuestTypeEntry[] = [
  // =========================================================
  // PAARE
  // =========================================================
  {
    key: "couple",
    aliases: [
      "paar",
      "als paar",
      "zu zweit",
      "für zwei",
      "fuer zwei",
      "2 personen",
      "zwei personen",
      "pärchen",
      "paerchen",
      "partner",
      "mit partner",
      "mit partnerin",
      "couple",
      "couples",
      "for two",
    ],
  },
  {
    key: "romantic_couple",
    aliases: [
      "romantikurlaub",
      "romantischer urlaub",
      "romantische reise",
      "romantikwochenende",
      "romantisches wochenende",
      "romantic getaway",
      "romantic trip",
    ],
  },
  {
    key: "honeymoon",
    aliases: [
      "flitterwochen",
      "hochzeitsreise",
      "honeymoon",
      "honeymooner",
      "honeymooners",
    ],
  },

  // =========================================================
  // ALLEINREISENDE
  // =========================================================
  {
    key: "solo",
    aliases: [
      "alleine",
      "allein",
      "alleinreisend",
      "alleinreisende",
      "alleinreisender",
      "solo",
      "solo reise",
      "soloreise",
      "single traveler",
      "solo traveler",
      "eine person",
      "1 person",
      "nur ich",
    ],
  },

  // =========================================================
  // FAMILIEN
  // =========================================================
  {
    key: "family",
    aliases: [
      "familie",
      "familien",
      "familienurlaub",
      "familienreise",
      "mit familie",
      "mit der familie",
      "family",
      "family vacation",
      "family holiday",
      "family trip",
    ],
  },
  {
    key: "family_with_children",
    aliases: [
      "mit kind",
      "mit kindern",
      "familie mit kind",
      "familie mit kindern",
      "urlaub mit kindern",
      "urlaub mit kind",
      "reise mit kindern",
      "kinder dabei",
      "unsere kinder",
      "family with child",
      "family with children",
      "with kids",
      "with children",
    ],
  },
  {
    key: "single_parent",
    aliases: [
      "alleinerziehend",
      "alleinerziehende",
      "alleinerziehender",
      "allein mit kind",
      "alleine mit kind",
      "allein mit kindern",
      "alleine mit kindern",
      "single parent",
      "single parent family",
    ],
  },
  {
    key: "multi_generation_family",
    aliases: [
      "mehrgenerationenurlaub",
      "mehrgenerationenreise",
      "mehrere generationen",
      "drei generationen",
      "3 generationen",
      "großeltern eltern kinder",
      "grosseltern eltern kinder",
      "mit großeltern",
      "mit grosseltern",
      "multigenerational family",
      "multi generation family",
      "three generations",
    ],
  },
  {
    key: "extended_family",
    aliases: [
      "großfamilie",
      "grossfamilie",
      "große familie",
      "grosse familie",
      "familiengruppe",
      "extended family",
      "large family",
    ],
  },

  // =========================================================
  // BABYS / KINDER / JUGENDLICHE
  // =========================================================
  {
    key: "baby",
    aliases: [
      "baby",
      "babys",
      "mit baby",
      "mit babys",
      "säugling",
      "saeugling",
      "säuglinge",
      "saeuglinge",
      "infant",
      "infants",
      "with baby",
    ],
  },
  {
    key: "toddler",
    aliases: [
      "kleinkind",
      "kleinkinder",
      "mit kleinkind",
      "mit kleinkindern",
      "toddler",
      "toddlers",
    ],
  },
  {
    key: "children",
    aliases: [
      "kinder",
      "mit kindern",
      "mit kind",
      "kids",
      "children",
      "with kids",
      "with children",
    ],
  },
  {
    key: "teenagers",
    aliases: [
      "teenager",
      "teenager dabei",
      "jugendliche",
      "jugendlicher",
      "jugendlichen",
      "mit jugendlichen",
      "teenagerurlaub",
      "teenagers",
      "teens",
    ],
  },

  // =========================================================
  // FREUNDE / GRUPPEN
  // =========================================================
  {
    key: "friends",
    aliases: [
      "freunde",
      "mit freunden",
      "freundesgruppe",
      "freundeskreis",
      "gruppe freunde",
      "freundegruppe",
      "friends",
      "with friends",
      "group of friends",
    ],
  },
  {
    key: "group",
    aliases: [
      "gruppe",
      "reisegruppe",
      "gruppenreise",
      "größere gruppe",
      "groessere gruppe",
      "große gruppe",
      "grosse gruppe",
      "mehrere personen",
      "group",
      "travel group",
      "large group",
      "group trip",
    ],
  },
  {
    key: "club_group",
    aliases: [
      "verein",
      "vereinsreise",
      "vereinsfahrt",
      "vereinsausflug",
      "vereinsgruppe",
      "club trip",
      "club group",
    ],
  },

  // =========================================================
  // JUNGGESELLENABSCHIED
  // =========================================================
  {
    key: "bachelor_party",
    aliases: [
      "junggesellenabschied",
      "junggesellen abschied",
      "jga männer",
      "jga maenner",
      "bachelor party",
      "stag party",
      "stag do",
    ],
  },
  {
    key: "bachelorette_party",
    aliases: [
      "junggesellinnenabschied",
      "junggesellinnen abschied",
      "jga frauen",
      "bachelorette party",
      "hen party",
      "hen do",
    ],
  },

  // =========================================================
  // HOCHZEIT
  // =========================================================
  {
    key: "wedding_group",
    aliases: [
      "hochzeitsgesellschaft",
      "hochzeitsgäste",
      "hochzeitsgaeste",
      "hochzeitsgruppe",
      "hochzeitsfeier",
      "wedding group",
      "wedding guests",
      "wedding party",
    ],
  },

  // =========================================================
  // SENIOREN
  // =========================================================
  {
    key: "seniors",
    aliases: [
      "senioren",
      "seniorenreise",
      "seniorenurlaub",
      "ältere reisende",
      "aeltere reisende",
      "ältere gäste",
      "aeltere gaeste",
      "rentner",
      "rentnerurlaub",
      "seniors",
      "senior travelers",
      "older travelers",
    ],
  },

  // =========================================================
  // GESCHÄFT / ARBEIT
  // =========================================================
  {
    key: "business",
    aliases: [
      "geschäftsreise",
      "geschaeftsreise",
      "geschäftlich",
      "geschaeftlich",
      "businessreise",
      "dienstreise",
      "beruflich",
      "business trip",
      "business traveler",
      "business travel",
      "work trip",
    ],
  },
  {
    key: "workation",
    aliases: [
      "workation",
      "work and travel",
      "arbeiten im urlaub",
      "arbeiten und urlaub",
      "urlaub und arbeiten",
      "remote work urlaub",
      "work vacation",
    ],
  },
  {
    key: "remote_worker",
    aliases: [
      "remote arbeiten",
      "remote worker",
      "remote work",
      "mobiles arbeiten",
      "mobil arbeiten",
      "homeoffice unterwegs",
      "home office unterwegs",
    ],
  },
  {
    key: "digital_nomad",
    aliases: [
      "digital nomad",
      "digitaler nomade",
      "digitale nomaden",
      "digital nomads",
      "ortsunabhängig arbeiten",
      "ortsunabhaengig arbeiten",
    ],
  },
  {
    key: "workers",
    aliases: [
      "monteure",
      "monteur",
      "monteurzimmer",
      "arbeiter",
      "handwerker",
      "geschäftsmitarbeiter",
      "geschaeftsmitarbeiter",
      "workers",
      "contractors",
    ],
  },

  // =========================================================
  // SCHULE / STUDIUM
  // =========================================================
  {
    key: "school_group",
    aliases: [
      "schulklasse",
      "schülergruppe",
      "schuelergruppe",
      "klassenfahrt",
      "schulreise",
      "abschlussfahrt",
      "school group",
      "school trip",
      "class trip",
    ],
  },
  {
    key: "students",
    aliases: [
      "studenten",
      "studentengruppe",
      "studierende",
      "unisport",
      "unigruppe",
      "universitätsgruppe",
      "universitaetsgruppe",
      "students",
      "student group",
      "university group",
    ],
  },

  // =========================================================
  // SPORTGRUPPEN
  // =========================================================
  {
    key: "sports_group",
    aliases: [
      "sportgruppe",
      "sportverein",
      "sportmannschaft",
      "mannschaft",
      "teamreise",
      "trainingslager",
      "sports group",
      "sports team",
      "training camp",
    ],
  },
  {
    key: "football_team",
    aliases: [
      "fußballmannschaft",
      "fussballmannschaft",
      "fußballteam",
      "fussballteam",
      "fußballverein",
      "fussballverein",
      "football team",
      "soccer team",
    ],
  },
  {
    key: "cycling_group",
    aliases: [
      "radgruppe",
      "radfahrergruppe",
      "fahrradgruppe",
      "radsportgruppe",
      "radsportverein",
      "cycling group",
      "cycling team",
    ],
  },
  {
    key: "motorcycle_group",
    aliases: [
      "motorradgruppe",
      "motorradclub",
      "motorradfahrer",
      "bikergruppe",
      "biker gruppe",
      "motorcycle group",
      "motorcycle club",
      "bikers",
    ],
  },

  // =========================================================
  // OUTDOOR / AKTIVREISEN
  // =========================================================
  {
    key: "hikers",
    aliases: [
      "wanderer",
      "wandergruppe",
      "wanderurlaub",
      "wanderfreunde",
      "hikers",
      "hiking group",
    ],
  },
  {
    key: "skiers",
    aliases: [
      "skifahrer",
      "skigruppe",
      "skiurlaub",
      "wintersportgruppe",
      "skiers",
      "ski group",
    ],
  },
  {
    key: "surfers",
    aliases: [
      "surfer",
      "surfgruppe",
      "surfurlaub",
      "surfers",
      "surf group",
    ],
  },
  {
    key: "divers",
    aliases: [
      "taucher",
      "tauchergruppe",
      "tauchurlaub",
      "tauchgruppe",
      "divers",
      "diving group",
    ],
  },

  // =========================================================
  // BACKPACKER / LANGZEITREISEN
  // =========================================================
  {
    key: "backpackers",
    aliases: [
      "backpacker",
      "backpackers",
      "rucksackreisende",
      "rucksackreise",
      "rucksacktouristen",
      "backpacking",
    ],
  },
  {
    key: "long_term_travelers",
    aliases: [
      "langzeiturlaub",
      "langzeitreise",
      "langzeitaufenthalt",
      "längerer aufenthalt",
      "laengerer aufenthalt",
      "mehrere wochen",
      "mehrere monate",
      "long stay",
      "long term stay",
      "extended stay",
    ],
  },

  // =========================================================
  // PILGER / RELIGIÖSE REISEGRUPPEN
  // =========================================================
  {
    key: "pilgrims",
    aliases: [
      "pilger",
      "pilgergruppe",
      "pilgerreise",
      "wallfahrer",
      "wallfahrt",
      "pilgrims",
      "pilgrimage",
    ],
  },
  {
    key: "religious_group",
    aliases: [
      "kirchengruppe",
      "gemeindegruppe",
      "religiöse gruppe",
      "religioese gruppe",
      "religious group",
      "church group",
    ],
  },

  // =========================================================
  // EVENTS / FEIERN
  // =========================================================
  {
    key: "birthday_group",
    aliases: [
      "geburtstagsgruppe",
      "geburtstagsreise",
      "geburtstagsfeier",
      "geburtstag feiern",
      "birthday group",
      "birthday trip",
    ],
  },
  {
    key: "party_group",
    aliases: [
      "partygruppe",
      "partyurlaub",
      "partyreise",
      "feiergruppe",
      "zum feiern",
      "party group",
      "party trip",
    ],
  },

  // =========================================================
  // HAUSTIERBESITZER ALS REISEGRUPPE
  // (dogs_allowed bleibt trotzdem separates Feature)
  // =========================================================
  {
    key: "travelers_with_dog",
    aliases: [
      "mit hund",
      "mit meinem hund",
      "mit unserem hund",
      "urlaub mit hund",
      "reise mit hund",
      "hund dabei",
      "with dog",
      "traveling with dog",
      "travelling with dog",
    ],
  },
  {
    key: "travelers_with_pets",
    aliases: [
      "mit haustier",
      "mit haustieren",
      "haustier dabei",
      "haustiere dabei",
      "urlaub mit haustier",
      "with pet",
      "with pets",
      "traveling with pets",
      "travelling with pets",
    ],
  },

  // =========================================================
  // BESONDERE MOBILITÄTSANFORDERUNGEN
  // Reisegruppe; konkrete Barrierefreiheit bleibt Feature.
  // =========================================================
  {
    key: "wheelchair_user",
    aliases: [
      "rollstuhlfahrer",
      "rollstuhlfahrerin",
      "rollstuhlnutzer",
      "rollstuhlnutzerin",
      "mit rollstuhl",
      "wheelchair user",
      "wheelchair traveler",
    ],
  },
  {
    key: "reduced_mobility",
    aliases: [
      "eingeschränkte mobilität",
      "eingeschraenkte mobilitaet",
      "mobilität eingeschränkt",
      "mobilitaet eingeschraenkt",
      "mobilitätseinschränkung",
      "mobilitaetseinschraenkung",
      "reduced mobility",
      "limited mobility",
    ],
  },
];