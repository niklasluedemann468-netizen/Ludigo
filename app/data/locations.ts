export type LocationEntry = {
  name: string;
  country: string;
  aliases: string[];
  type: "country" | "region";
};

export const locations: LocationEntry[] = [
  // =========================================================
  // LÄNDER – EUROPA
  // =========================================================

  {
    name: "Deutschland",
    country: "Deutschland",
    aliases: ["deutschland", "germany", "alemania"],
    type: "country",
  },
  {
    name: "Österreich",
    country: "Österreich",
    aliases: ["österreich", "oesterreich", "austria"],
    type: "country",
  },
  {
    name: "Schweiz",
    country: "Schweiz",
    aliases: ["schweiz", "switzerland", "suisse", "svizzera"],
    type: "country",
  },
  {
    name: "Spanien",
    country: "Spanien",
    aliases: ["spanien", "spain", "españa", "espana"],
    type: "country",
  },
  {
    name: "Portugal",
    country: "Portugal",
    aliases: ["portugal"],
    type: "country",
  },
  {
    name: "Italien",
    country: "Italien",
    aliases: ["italien", "italy", "italia"],
    type: "country",
  },
  {
    name: "Frankreich",
    country: "Frankreich",
    aliases: ["frankreich", "france"],
    type: "country",
  },
  {
    name: "Griechenland",
    country: "Griechenland",
    aliases: ["griechenland", "greece", "hellas"],
    type: "country",
  },
  {
    name: "Kroatien",
    country: "Kroatien",
    aliases: ["kroatien", "croatia", "hrvatska"],
    type: "country",
  },
  {
    name: "Slowenien",
    country: "Slowenien",
    aliases: ["slowenien", "slovenia"],
    type: "country",
  },
  {
    name: "Montenegro",
    country: "Montenegro",
    aliases: ["montenegro"],
    type: "country",
  },
  {
    name: "Albanien",
    country: "Albanien",
    aliases: ["albanien", "albania"],
    type: "country",
  },
  {
    name: "Bosnien und Herzegowina",
    country: "Bosnien und Herzegowina",
    aliases: [
      "bosnien",
      "bosnien und herzegowina",
      "bosnia",
      "bosnia and herzegovina",
    ],
    type: "country",
  },
  {
    name: "Serbien",
    country: "Serbien",
    aliases: ["serbien", "serbia"],
    type: "country",
  },
  {
    name: "Nordmazedonien",
    country: "Nordmazedonien",
    aliases: ["nordmazedonien", "north macedonia", "mazedonien"],
    type: "country",
  },
  {
    name: "Niederlande",
    country: "Niederlande",
    aliases: ["niederlande", "holland", "netherlands"],
    type: "country",
  },
  {
    name: "Belgien",
    country: "Belgien",
    aliases: ["belgien", "belgium", "belgique"],
    type: "country",
  },
  {
    name: "Luxemburg",
    country: "Luxemburg",
    aliases: ["luxemburg", "luxembourg"],
    type: "country",
  },
  {
    name: "Dänemark",
    country: "Dänemark",
    aliases: ["dänemark", "daenemark", "denmark"],
    type: "country",
  },
  {
    name: "Schweden",
    country: "Schweden",
    aliases: ["schweden", "sweden"],
    type: "country",
  },
  {
    name: "Norwegen",
    country: "Norwegen",
    aliases: ["norwegen", "norway"],
    type: "country",
  },
  {
    name: "Finnland",
    country: "Finnland",
    aliases: ["finnland", "finland"],
    type: "country",
  },
  {
    name: "Island",
    country: "Island",
    aliases: ["island", "iceland"],
    type: "country",
  },
  {
    name: "Polen",
    country: "Polen",
    aliases: ["polen", "poland", "polska"],
    type: "country",
  },
  {
    name: "Tschechien",
    country: "Tschechien",
    aliases: ["tschechien", "czechia", "czech republic"],
    type: "country",
  },
  {
    name: "Slowakei",
    country: "Slowakei",
    aliases: ["slowakei", "slovakia"],
    type: "country",
  },
  {
    name: "Ungarn",
    country: "Ungarn",
    aliases: ["ungarn", "hungary"],
    type: "country",
  },
  {
    name: "Rumänien",
    country: "Rumänien",
    aliases: ["rumänien", "rumaenien", "romania"],
    type: "country",
  },
  {
    name: "Bulgarien",
    country: "Bulgarien",
    aliases: ["bulgarien", "bulgaria"],
    type: "country",
  },
  {
    name: "Estland",
    country: "Estland",
    aliases: ["estland", "estonia"],
    type: "country",
  },
  {
    name: "Lettland",
    country: "Lettland",
    aliases: ["lettland", "latvia"],
    type: "country",
  },
  {
    name: "Litauen",
    country: "Litauen",
    aliases: ["litauen", "lithuania"],
    type: "country",
  },
  {
    name: "Irland",
    country: "Irland",
    aliases: ["irland", "ireland"],
    type: "country",
  },
  {
    name: "Vereinigtes Königreich",
    country: "Vereinigtes Königreich",
    aliases: [
      "vereinigtes königreich",
      "großbritannien",
      "grossbritannien",
      "great britain",
      "united kingdom",
      "uk",
      "england",
    ],
    type: "country",
  },
  {
    name: "Malta",
    country: "Malta",
    aliases: ["malta"],
    type: "country",
  },
  {
    name: "Zypern",
    country: "Zypern",
    aliases: ["zypern", "cyprus"],
    type: "country",
  },
  {
    name: "Türkei",
    country: "Türkei",
    aliases: ["türkei", "tuerkei", "turkey", "türkiye", "turkiye"],
    type: "country",
  },

  // =========================================================
  // DEUTSCHLAND – REGIONEN
  // =========================================================

  {
    name: "Bayern",
    country: "Deutschland",
    aliases: ["bayern", "bavaria"],
    type: "region",
  },
  {
    name: "Allgäu",
    country: "Deutschland",
    aliases: ["allgäu", "allgaeu"],
    type: "region",
  },
  {
    name: "Schwarzwald",
    country: "Deutschland",
    aliases: ["schwarzwald", "black forest"],
    type: "region",
  },
  {
    name: "Bodensee",
    country: "Deutschland",
    aliases: ["bodensee", "lake constance"],
    type: "region",
  },
  {
    name: "Nordsee",
    country: "Deutschland",
    aliases: ["nordsee", "deutsche nordsee"],
    type: "region",
  },
  {
    name: "Ostsee",
    country: "Deutschland",
    aliases: ["ostsee", "deutsche ostsee"],
    type: "region",
  },
  {
    name: "Rügen",
    country: "Deutschland",
    aliases: ["rügen", "ruegen"],
    type: "region",
  },
  {
    name: "Usedom",
    country: "Deutschland",
    aliases: ["usedom"],
    type: "region",
  },
  {
    name: "Sylt",
    country: "Deutschland",
    aliases: ["sylt"],
    type: "region",
  },
  {
    name: "Harz",
    country: "Deutschland",
    aliases: ["harz"],
    type: "region",
  },
  {
    name: "Eifel",
    country: "Deutschland",
    aliases: ["eifel"],
    type: "region",
  },
  {
    name: "Mosel",
    country: "Deutschland",
    aliases: ["mosel", "moselle"],
    type: "region",
  },
  {
    name: "Sächsische Schweiz",
    country: "Deutschland",
    aliases: ["sächsische schweiz", "saechsische schweiz"],
    type: "region",
  },
  {
    name: "Mecklenburgische Seenplatte",
    country: "Deutschland",
    aliases: ["mecklenburgische seenplatte", "seenplatte"],
    type: "region",
  },
  {
    name: "Lüneburger Heide",
    country: "Deutschland",
    aliases: ["lüneburger heide", "lueneburger heide"],
    type: "region",
  },
  {
    name: "Fränkische Schweiz",
    country: "Deutschland",
    aliases: ["fränkische schweiz", "fraenkische schweiz"],
    type: "region",
  },
  {
    name: "Bayerischer Wald",
    country: "Deutschland",
    aliases: ["bayerischer wald"],
    type: "region",
  },

  // =========================================================
  // ÖSTERREICH
  // =========================================================

  {
    name: "Tirol",
    country: "Österreich",
    aliases: ["tirol", "tyrol"],
    type: "region",
  },
  {
    name: "Südtirol",
    country: "Italien",
    aliases: ["südtirol", "suedtirol", "south tyrol", "alto adige"],
    type: "region",
  },
  {
    name: "Kärnten",
    country: "Österreich",
    aliases: ["kärnten", "kaernten", "carinthia"],
    type: "region",
  },
  {
    name: "Steiermark",
    country: "Österreich",
    aliases: ["steiermark", "styria"],
    type: "region",
  },
  {
    name: "Salzburger Land",
    country: "Österreich",
    aliases: ["salzburger land", "salzburgerland"],
    type: "region",
  },
  {
    name: "Vorarlberg",
    country: "Österreich",
    aliases: ["vorarlberg"],
    type: "region",
  },
  {
    name: "Zillertal",
    country: "Österreich",
    aliases: ["zillertal"],
    type: "region",
  },
  {
    name: "Ötztal",
    country: "Österreich",
    aliases: ["ötztal", "oetztal"],
    type: "region",
  },
  {
    name: "Wachau",
    country: "Österreich",
    aliases: ["wachau"],
    type: "region",
  },

  // =========================================================
  // SCHWEIZ
  // =========================================================

  {
    name: "Berner Oberland",
    country: "Schweiz",
    aliases: ["berner oberland"],
    type: "region",
  },
  {
    name: "Engadin",
    country: "Schweiz",
    aliases: ["engadin", "engadine"],
    type: "region",
  },
  {
    name: "Wallis",
    country: "Schweiz",
    aliases: ["wallis", "valais"],
    type: "region",
  },
  {
    name: "Tessin",
    country: "Schweiz",
    aliases: ["tessin", "ticino"],
    type: "region",
  },
  {
    name: "Vierwaldstättersee",
    country: "Schweiz",
    aliases: [
      "vierwaldstättersee",
      "vierwaldstaettersee",
      "lake lucerne",
    ],
    type: "region",
  },

  // =========================================================
  // SPANIEN
  // =========================================================

  {
    name: "Mallorca",
    country: "Spanien",
    aliases: ["mallorca", "majorca"],
    type: "region",
  },
  {
    name: "Ibiza",
    country: "Spanien",
    aliases: ["ibiza", "eivissa"],
    type: "region",
  },
  {
    name: "Menorca",
    country: "Spanien",
    aliases: ["menorca", "minorca"],
    type: "region",
  },
  {
    name: "Formentera",
    country: "Spanien",
    aliases: ["formentera"],
    type: "region",
  },
  {
    name: "Teneriffa",
    country: "Spanien",
    aliases: ["teneriffa", "tenerife"],
    type: "region",
  },
  {
    name: "Gran Canaria",
    country: "Spanien",
    aliases: ["gran canaria"],
    type: "region",
  },
  {
    name: "Fuerteventura",
    country: "Spanien",
    aliases: ["fuerteventura"],
    type: "region",
  },
  {
    name: "Lanzarote",
    country: "Spanien",
    aliases: ["lanzarote"],
    type: "region",
  },
  {
    name: "La Palma",
    country: "Spanien",
    aliases: ["la palma"],
    type: "region",
  },
  {
    name: "Kanaren",
    country: "Spanien",
    aliases: [
      "kanaren",
      "kanarische inseln",
      "canary islands",
      "canaries",
    ],
    type: "region",
  },
  {
    name: "Balearen",
    country: "Spanien",
    aliases: ["balearen", "balearic islands"],
    type: "region",
  },
  {
    name: "Costa Brava",
    country: "Spanien",
    aliases: ["costa brava"],
    type: "region",
  },
  {
    name: "Costa Dorada",
    country: "Spanien",
    aliases: ["costa dorada", "costa daurada"],
    type: "region",
  },
  {
    name: "Costa Blanca",
    country: "Spanien",
    aliases: ["costa blanca"],
    type: "region",
  },
  {
    name: "Costa del Sol",
    country: "Spanien",
    aliases: ["costa del sol"],
    type: "region",
  },
  {
    name: "Costa de la Luz",
    country: "Spanien",
    aliases: ["costa de la luz"],
    type: "region",
  },
  {
    name: "Andalusien",
    country: "Spanien",
    aliases: ["andalusien", "andalusia", "andalucía", "andalucia"],
    type: "region",
  },
  {
    name: "Katalonien",
    country: "Spanien",
    aliases: ["katalonien", "catalonia", "catalunya"],
    type: "region",
  },

  // =========================================================
  // ITALIEN
  // =========================================================

  {
    name: "Toskana",
    country: "Italien",
    aliases: ["toskana", "tuscany", "toscana"],
    type: "region",
  },
  {
    name: "Sardinien",
    country: "Italien",
    aliases: ["sardinien", "sardinia", "sardegna"],
    type: "region",
  },
  {
    name: "Sizilien",
    country: "Italien",
    aliases: ["sizilien", "sicily", "sicilia"],
    type: "region",
  },
  {
    name: "Gardasee",
    country: "Italien",
    aliases: ["gardasee", "lake garda", "lago di garda"],
    type: "region",
  },
  {
    name: "Comer See",
    country: "Italien",
    aliases: ["comer see", "lake como", "lago di como"],
    type: "region",
  },
  {
    name: "Lago Maggiore",
    country: "Italien",
    aliases: ["lago maggiore", "laggo maggiore"],
    type: "region",
  },
  {
    name: "Adria",
    country: "Italien",
    aliases: ["italienische adria", "adria italien"],
    type: "region",
  },
  {
    name: "Venetien",
    country: "Italien",
    aliases: ["venetien", "veneto"],
    type: "region",
  },
  {
    name: "Ligurien",
    country: "Italien",
    aliases: ["ligurien", "liguria"],
    type: "region",
  },
  {
    name: "Amalfiküste",
    country: "Italien",
    aliases: ["amalfiküste", "amalfikueste", "amalfi coast"],
    type: "region",
  },
  {
    name: "Apulien",
    country: "Italien",
    aliases: ["apulien", "puglia"],
    type: "region",
  },
  {
    name: "Kalabrien",
    country: "Italien",
    aliases: ["kalabrien", "calabria"],
    type: "region",
  },

  // =========================================================
  // FRANKREICH
  // =========================================================

  {
    name: "Provence",
    country: "Frankreich",
    aliases: ["provence"],
    type: "region",
  },
  {
    name: "Côte d’Azur",
    country: "Frankreich",
    aliases: [
      "côte d’azur",
      "cote d'azur",
      "cote d azur",
      "französische riviera",
      "french riviera",
    ],
    type: "region",
  },
  {
    name: "Normandie",
    country: "Frankreich",
    aliases: ["normandie", "normandy"],
    type: "region",
  },
  {
    name: "Bretagne",
    country: "Frankreich",
    aliases: ["bretagne", "brittany"],
    type: "region",
  },
  {
    name: "Elsass",
    country: "Frankreich",
    aliases: ["elsass", "alsace"],
    type: "region",
  },
  {
    name: "Korsika",
    country: "Frankreich",
    aliases: ["korsika", "corsica", "corse"],
    type: "region",
  },
  {
    name: "Loiretal",
    country: "Frankreich",
    aliases: ["loiretal", "loire valley"],
    type: "region",
  },

  // =========================================================
  // PORTUGAL
  // =========================================================

  {
    name: "Algarve",
    country: "Portugal",
    aliases: ["algarve"],
    type: "region",
  },
  {
    name: "Madeira",
    country: "Portugal",
    aliases: ["madeira"],
    type: "region",
  },
  {
    name: "Azoren",
    country: "Portugal",
    aliases: ["azoren", "azores"],
    type: "region",
  },

  // =========================================================
  // GRIECHENLAND
  // =========================================================

  {
    name: "Kreta",
    country: "Griechenland",
    aliases: ["kreta", "crete"],
    type: "region",
  },
  {
    name: "Rhodos",
    country: "Griechenland",
    aliases: ["rhodos", "rhodes"],
    type: "region",
  },
  {
    name: "Korfu",
    country: "Griechenland",
    aliases: ["korfu", "corfu"],
    type: "region",
  },
  {
    name: "Kos",
    country: "Griechenland",
    aliases: ["kos"],
    type: "region",
  },
  {
    name: "Santorini",
    country: "Griechenland",
    aliases: ["santorini", "thira"],
    type: "region",
  },
  {
    name: "Mykonos",
    country: "Griechenland",
    aliases: ["mykonos"],
    type: "region",
  },
  {
    name: "Chalkidiki",
    country: "Griechenland",
    aliases: ["chalkidiki", "halkidiki"],
    type: "region",
  },
  {
    name: "Peloponnes",
    country: "Griechenland",
    aliases: ["peloponnes", "peloponnese"],
    type: "region",
  },

  // =========================================================
  // KROATIEN / ADRIA
  // =========================================================

  {
    name: "Istrien",
    country: "Kroatien",
    aliases: ["istrien", "istria"],
    type: "region",
  },
  {
    name: "Dalmatien",
    country: "Kroatien",
    aliases: ["dalmatien", "dalmatia"],
    type: "region",
  },
  {
    name: "Kvarner Bucht",
    country: "Kroatien",
    aliases: ["kvarner", "kvarner bucht", "kvarner bay"],
    type: "region",
  },
  {
    name: "Krk",
    country: "Kroatien",
    aliases: ["insel krk", "krk"],
    type: "region",
  },
  {
    name: "Hvar",
    country: "Kroatien",
    aliases: ["hvar"],
    type: "region",
  },
  {
    name: "Brač",
    country: "Kroatien",
    aliases: ["brač", "brac"],
    type: "region",
  },

  // =========================================================
  // NIEDERLANDE
  // =========================================================

  {
    name: "Zeeland",
    country: "Niederlande",
    aliases: ["zeeland"],
    type: "region",
  },
  {
    name: "Friesland",
    country: "Niederlande",
    aliases: ["friesland", "fryslân", "fryslan"],
    type: "region",
  },
  {
    name: "Texel",
    country: "Niederlande",
    aliases: ["texel"],
    type: "region",
  },

  // =========================================================
  // SKANDINAVIEN
  // =========================================================

  {
    name: "Lofoten",
    country: "Norwegen",
    aliases: ["lofoten"],
    type: "region",
  },
  {
    name: "Fjordnorwegen",
    country: "Norwegen",
    aliases: ["fjordnorwegen", "norwegische fjorde", "norwegian fjords"],
    type: "region",
  },
  {
    name: "Lappland",
    country: "Finnland",
    aliases: ["lappland", "lapland"],
    type: "region",
  },

  // =========================================================
  // TÜRKEI
  // =========================================================

  {
    name: "Türkische Riviera",
    country: "Türkei",
    aliases: ["türkische riviera", "tuerkische riviera"],
    type: "region",
  },
  {
    name: "Ägäische Küste",
    country: "Türkei",
    aliases: [
      "ägäische küste",
      "aegaeische kueste",
      "türkische ägäis",
      "turkish aegean",
    ],
    type: "region",
  },

  // =========================================================
  // NORDAFRIKA / NAHER OSTEN
  // =========================================================

  {
    name: "Ägypten",
    country: "Ägypten",
    aliases: ["ägypten", "aegypten", "egypt"],
    type: "country",
  },
  {
    name: "Marokko",
    country: "Marokko",
    aliases: ["marokko", "morocco"],
    type: "country",
  },
  {
    name: "Tunesien",
    country: "Tunesien",
    aliases: ["tunesien", "tunisia"],
    type: "country",
  },
  {
    name: "Vereinigte Arabische Emirate",
    country: "Vereinigte Arabische Emirate",
    aliases: [
      "vereinigte arabische emirate",
      "vae",
      "uae",
      "united arab emirates",
      "emirate",
    ],
    type: "country",
  },
  {
    name: "Dubai",
    country: "Vereinigte Arabische Emirate",
    aliases: ["dubai", "emirat dubai"],
    type: "region",
  },
  {
    name: "Abu Dhabi",
    country: "Vereinigte Arabische Emirate",
    aliases: ["abu dhabi"],
    type: "region",
  },
  {
    name: "Rotes Meer",
    country: "Ägypten",
    aliases: ["rotes meer", "red sea"],
    type: "region",
  },

  // =========================================================
  // ASIEN
  // =========================================================

  {
    name: "Thailand",
    country: "Thailand",
    aliases: ["thailand"],
    type: "country",
  },
  {
    name: "Japan",
    country: "Japan",
    aliases: ["japan"],
    type: "country",
  },
  {
    name: "Indonesien",
    country: "Indonesien",
    aliases: ["indonesien", "indonesia"],
    type: "country",
  },
  {
    name: "Vietnam",
    country: "Vietnam",
    aliases: ["vietnam"],
    type: "country",
  },
  {
    name: "Malaysia",
    country: "Malaysia",
    aliases: ["malaysia"],
    type: "country",
  },
  {
    name: "Malediven",
    country: "Malediven",
    aliases: ["malediven", "maldives"],
    type: "country",
  },
  {
    name: "Sri Lanka",
    country: "Sri Lanka",
    aliases: ["sri lanka", "ceylon"],
    type: "country",
  },
  {
    name: "Bali",
    country: "Indonesien",
    aliases: ["bali"],
    type: "region",
  },
  {
    name: "Phuket",
    country: "Thailand",
    aliases: ["phuket"],
    type: "region",
  },
  {
    name: "Koh Samui",
    country: "Thailand",
    aliases: ["koh samui", "ko samui"],
    type: "region",
  },
  {
    name: "Khao Lak",
    country: "Thailand",
    aliases: ["khao lak"],
    type: "region",
  },

  // =========================================================
  // AFRIKA
  // =========================================================

  {
    name: "Südafrika",
    country: "Südafrika",
    aliases: ["südafrika", "suedafrika", "south africa"],
    type: "country",
  },
  {
    name: "Kenia",
    country: "Kenia",
    aliases: ["kenia", "kenya"],
    type: "country",
  },
  {
    name: "Tansania",
    country: "Tansania",
    aliases: ["tansania", "tanzania"],
    type: "country",
  },
  {
    name: "Sansibar",
    country: "Tansania",
    aliases: ["sansibar", "zanzibar"],
    type: "region",
  },
  {
    name: "Mauritius",
    country: "Mauritius",
    aliases: ["mauritius"],
    type: "country",
  },
  {
    name: "Seychellen",
    country: "Seychellen",
    aliases: ["seychellen", "seychelles"],
    type: "country",
  },
  {
    name: "Kapverden",
    country: "Kapverden",
    aliases: ["kapverden", "cape verde", "cabo verde"],
    type: "country",
  },

  // =========================================================
  // NORDAMERIKA
  // =========================================================

  {
    name: "USA",
    country: "USA",
    aliases: [
      "usa",
      "united states",
      "vereinigte staaten",
      "amerika",
      "united states of america",
    ],
    type: "country",
  },
  {
    name: "Kanada",
    country: "Kanada",
    aliases: ["kanada", "canada"],
    type: "country",
  },
  {
    name: "Mexiko",
    country: "Mexiko",
    aliases: ["mexiko", "mexico", "méxico"],
    type: "country",
  },
  {
    name: "Florida",
    country: "USA",
    aliases: ["florida"],
    type: "region",
  },
  {
    name: "Kalifornien",
    country: "USA",
    aliases: ["kalifornien", "california"],
    type: "region",
  },
  {
    name: "Hawaii",
    country: "USA",
    aliases: ["hawaii", "hawai'i"],
    type: "region",
  },
  {
    name: "Alaska",
    country: "USA",
    aliases: ["alaska"],
    type: "region",
  },
  {
    name: "Yucatán",
    country: "Mexiko",
    aliases: ["yucatán", "yucatan"],
    type: "region",
  },
  {
    name: "Riviera Maya",
    country: "Mexiko",
    aliases: ["riviera maya"],
    type: "region",
  },

  // =========================================================
  // KARIBIK
  // =========================================================

  {
    name: "Dominikanische Republik",
    country: "Dominikanische Republik",
    aliases: ["dominikanische republik", "dominican republic", "dom rep"],
    type: "country",
  },
  {
    name: "Kuba",
    country: "Kuba",
    aliases: ["kuba", "cuba"],
    type: "country",
  },
  {
    name: "Jamaika",
    country: "Jamaika",
    aliases: ["jamaika", "jamaica"],
    type: "country",
  },
  {
    name: "Bahamas",
    country: "Bahamas",
    aliases: ["bahamas"],
    type: "country",
  },
  {
    name: "Barbados",
    country: "Barbados",
    aliases: ["barbados"],
    type: "country",
  },
  {
    name: "Aruba",
    country: "Aruba",
    aliases: ["aruba"],
    type: "country",
  },
  {
    name: "Curaçao",
    country: "Curaçao",
    aliases: ["curaçao", "curacao"],
    type: "country",
  },

  // =========================================================
  // SÜDAMERIKA
  // =========================================================

  {
    name: "Brasilien",
    country: "Brasilien",
    aliases: ["brasilien", "brazil", "brasil"],
    type: "country",
  },
  {
    name: "Argentinien",
    country: "Argentinien",
    aliases: ["argentinien", "argentina"],
    type: "country",
  },
  {
    name: "Chile",
    country: "Chile",
    aliases: ["chile"],
    type: "country",
  },
  {
    name: "Peru",
    country: "Peru",
    aliases: ["peru", "perú"],
    type: "country",
  },
  {
    name: "Kolumbien",
    country: "Kolumbien",
    aliases: ["kolumbien", "colombia"],
    type: "country",
  },

  // =========================================================
  // AUSTRALIEN / OZEANIEN
  // =========================================================

  {
    name: "Australien",
    country: "Australien",
    aliases: ["australien", "australia"],
    type: "country",
  },
  {
    name: "Neuseeland",
    country: "Neuseeland",
    aliases: ["neuseeland", "new zealand"],
    type: "country",
  },
  {
    name: "Fidschi",
    country: "Fidschi",
    aliases: ["fidschi", "fiji"],
    type: "country",
  },
  {
    name: "Queensland",
    country: "Australien",
    aliases: ["queensland"],
    type: "region",
  },
  {
    name: "Tasmanien",
    country: "Australien",
    aliases: ["tasmanien", "tasmania"],
    type: "region",
  },
];