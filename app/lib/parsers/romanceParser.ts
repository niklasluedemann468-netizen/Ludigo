export function parseRomanceSearch(
  normalizedText: string,
  params: URLSearchParams
) {
  // =========================================================
  // ROMANTIK, PAARE & BESONDERE ANLÄSSE
  // =========================================================

  const romanceIncludesAny = (terms: string[]) =>
    terms.some((term) => normalizedText.includes(term));

  const romanceAppendIfAny = (
    key: string,
    value: string,
    terms: string[]
  ) => {
    if (romanceIncludesAny(terms)) {
      params.append(key, value);
    }
  };


  // =========================================================
  // ROMANTISCHE REISE
  // =========================================================

  romanceAppendIfAny("trip_style", "romantic_trip", [
    "romantikurlaub",
    "romantik urlaub",
    "romantischer urlaub",
    "romantische reise",
    "romantikreise",
    "romantikwochenende",
    "romantisches wochenende",
    "romantic getaway",
  ]);

  romanceAppendIfAny("romance_preference", "romantic", [
    "romantisch",
    "romantische unterkunft",
    "romantisches hotel",
    "romantische ferienwohnung",
    "romantisches ferienhaus",
    "romantische atmosphäre",
    "romantische atmosphaere",
    "romantisches ambiente",
  ]);


  // =========================================================
  // PAARURLAUB
  // =========================================================

  romanceAppendIfAny("trip_style", "couples_trip", [
    "paarurlaub",
    "urlaub als paar",
    "urlaub zu zweit",
    "reise zu zweit",
    "wochenende zu zweit",
    "pärchenurlaub",
    "paerchenurlaub",
    "couples trip",
  ]);

  romanceAppendIfAny("romance_preference", "couples_friendly", [
    "für paare",
    "fuer paare",
    "für pärchen",
    "fuer paerchen",
    "ideal für paare",
    "ideal fuer paare",
    "paarfreundlich",
  ]);


  // =========================================================
  // HONEYMOON / FLITTERWOCHEN
  // =========================================================

  romanceAppendIfAny("trip_style", "honeymoon", [
    "flitterwochen",
    "hochzeitsreise",
    "honeymoon",
    "honeymoon reise",
    "honeymoon urlaub",
  ]);

  romanceAppendIfAny("romance_preference", "honeymoon_friendly", [
    "honeymoon hotel",
    "honeymoon suite",
    "für flitterwochen",
    "fuer flitterwochen",
    "ideal für flitterwochen",
    "ideal fuer flitterwochen",
  ]);


  // =========================================================
  // HOCHZEITSTAG / JAHRESTAG
  // =========================================================

  romanceAppendIfAny("special_occasion", "anniversary", [
    "hochzeitstag",
    "jahrestag",
    "beziehungstag",
    "anniversary",
    "hochzeitsjubiläum",
    "hochzeitsjubilaeum",
  ]);


  // =========================================================
  // GEBURTSTAG
  // =========================================================

  romanceAppendIfAny("special_occasion", "birthday", [
    "geburtstag",
    "geburtstagsreise",
    "geburtstagswochenende",
    "birthday trip",
  ]);


  // =========================================================
  // VERLOBUNG
  // =========================================================

  romanceAppendIfAny("special_occasion", "engagement", [
    "verlobung",
    "verlobungsreise",
    "verlobungswochenende",
    "engagement trip",
  ]);


  // =========================================================
  // HEIRATSANTRAG
  // =========================================================

  romanceAppendIfAny("special_occasion", "proposal", [
    "heiratsantrag",
    "hochzeitsantrag",
    "antrag machen",
    "einen antrag machen",
    "proposal",
    "marriage proposal",
  ]);

  romanceAppendIfAny("romance_service", "proposal_arrangement", [
    "heiratsantrag organisieren",
    "heiratsantrag arrangieren",
    "hilfe beim heiratsantrag",
    "antrag arrangieren",
    "proposal package",
  ]);


  // =========================================================
  // ADULTS ONLY
  // =========================================================

  romanceAppendIfAny("romance_preference", "adults_only", [
    "adults only",
    "adults-only",
    "nur erwachsene",
    "nur für erwachsene",
    "nur fuer erwachsene",
    "erwachsenenhotel",
    "adult only",
  ]);


  // =========================================================
  // RUHIGER RÜCKZUGSORT
  // =========================================================

  romanceAppendIfAny("romance_preference", "private_retreat", [
    "privater rückzugsort",
    "privater rueckzugsort",
    "romantischer rückzugsort",
    "romantischer rueckzugsort",
    "ruhiger rückzugsort",
    "ruhiger rueckzugsort",
    "ungestörter rückzugsort",
    "ungestoerter rueckzugsort",
    "private retreat",
  ]);


  // =========================================================
  // PRIVATSPHÄRE
  // =========================================================

  romanceAppendIfAny("romance_preference", "high_privacy", [
    "viel privatsphäre",
    "viel privatsphaere",
    "maximale privatsphäre",
    "maximale privatsphaere",
    "absolute privatsphäre",
    "absolute privatsphaere",
    "ungestört",
    "ungestoert",
    "sehr privat",
  ]);


  // =========================================================
  // ABGELEGEN / EINSAM
  // =========================================================

  romanceAppendIfAny("romance_preference", "secluded", [
    "abgelegen",
    "einsam gelegen",
    "in alleinlage",
    "ohne direkte nachbarn",
    "keine direkten nachbarn",
    "abseits vom trubel",
  ]);


  // =========================================================
  // ROMANTISCHE SUITE
  // =========================================================

  romanceAppendIfAny("romance_feature", "romantic_suite", [
    "romantische suite",
    "romantik suite",
    "romantiksuite",
    "couples suite",
  ]);


  // =========================================================
  // HONEYMOON SUITE
  // =========================================================

  romanceAppendIfAny("romance_feature", "honeymoon_suite", [
    "honeymoon suite",
    "honeymoonsuite",
    "flitterwochen suite",
    "flitterwochensuite",
  ]);


  // =========================================================
  // PRIVATER WHIRLPOOL
  // =========================================================

  romanceAppendIfAny("romance_feature", "private_hot_tub", [
    "privater whirlpool",
    "privatem whirlpool",
    "privaten whirlpool",
    "eigener whirlpool",
    "eigenem whirlpool",
    "eigenen whirlpool",
    "privater jacuzzi",
    "eigener jacuzzi",
    "private hot tub",
  ]);


  // =========================================================
  // WHIRLPOOL IM ZIMMER
  // =========================================================

  romanceAppendIfAny("romance_feature", "in_room_hot_tub", [
    "whirlpool im zimmer",
    "jacuzzi im zimmer",
    "whirlpool in der suite",
    "jacuzzi in der suite",
    "whirlpool im schlafzimmer",
    "in room hot tub",
  ]);


  // =========================================================
  // BADEWANNE FÜR ZWEI
  // =========================================================

  romanceAppendIfAny("romance_feature", "bathtub_for_two", [
    "badewanne für zwei",
    "badewanne fuer zwei",
    "badewanne zu zweit",
    "paarbadewanne",
    "doppelbadewanne",
    "two person bathtub",
  ]);


  // =========================================================
  // FREISTEHENDE BADEWANNE
  // =========================================================

  romanceAppendIfAny("romance_feature", "freestanding_bathtub", [
    "freistehende badewanne",
    "freistehender badewanne",
    "freistehende wanne",
    "freestanding bathtub",
  ]);


  // =========================================================
  // BADEWANNE IM SCHLAFZIMMER
  // =========================================================

  romanceAppendIfAny("romance_feature", "bedroom_bathtub", [
    "badewanne im schlafzimmer",
    "badewanne neben dem bett",
    "badewanne direkt am bett",
    "bathtub in bedroom",
  ]);


  // =========================================================
  // PRIVATSAUNA
  // =========================================================

  romanceAppendIfAny("romance_feature", "private_sauna", [
    "private sauna",
    "privater sauna",
    "eigene sauna",
    "eigener sauna",
    "sauna nur für uns",
    "sauna nur fuer uns",
  ]);


  // =========================================================
  // PRIVATPOOL
  // =========================================================

  romanceAppendIfAny("romance_feature", "private_pool", [
    "privater pool",
    "privatem pool",
    "privaten pool",
    "eigener pool",
    "eigenem pool",
    "eigenen pool",
    "private pool",
  ]);


  // =========================================================
  // HIMMELBETT
  // =========================================================

  romanceAppendIfAny("romance_feature", "canopy_bed", [
    "himmelbett",
    "himmel bett",
    "canopy bed",
  ]);


  // =========================================================
  // KING-SIZE-BETT
  // =========================================================

  romanceAppendIfAny("romance_feature", "king_bed", [
    "king size bett",
    "king-size-bett",
    "kingsize bett",
    "king bed",
  ]);


  // =========================================================
  // GROSSES DOPPELBETT
  // =========================================================

  romanceAppendIfAny("romance_feature", "large_double_bed", [
    "großes doppelbett",
    "grosses doppelbett",
    "extra großes doppelbett",
    "extra grosses doppelbett",
  ]);


  // =========================================================
  // KAMIN
  // =========================================================

  romanceAppendIfAny("romance_feature", "fireplace", [
    "kamin",
    "offener kamin",
    "kamin im zimmer",
    "kamin in der suite",
    "fireplace",
  ]);


  // =========================================================
  // PRIVATER BALKON
  // =========================================================

  romanceAppendIfAny("romance_feature", "private_balcony", [
    "privater balkon",
    "privatem balkon",
    "privaten balkon",
    "eigener balkon",
    "private balcony",
  ]);


  // =========================================================
  // PRIVATE TERRASSE
  // =========================================================

  romanceAppendIfAny("romance_feature", "private_terrace", [
    "private terrasse",
    "privater terrasse",
    "eigene terrasse",
    "eigener terrasse",
    "private terrace",
  ]);


  // =========================================================
  // PRIVATER GARTEN
  // =========================================================

  romanceAppendIfAny("romance_feature", "private_garden", [
    "privater garten",
    "privatem garten",
    "privaten garten",
    "eigener garten",
    "private garden",
  ]);


  // =========================================================
  // DACHTERRASSE
  // =========================================================

  romanceAppendIfAny("romance_feature", "rooftop_terrace", [
    "dachterrasse",
    "private dachterrasse",
    "eigene dachterrasse",
    "rooftop terrace",
  ]);


  // =========================================================
  // MEERBLICK
  // =========================================================

  romanceAppendIfAny("romance_view", "sea_view", [
    "meerblick",
    "blick aufs meer",
    "blick auf das meer",
    "sea view",
  ]);


  // =========================================================
  // BERGBLICK
  // =========================================================

  romanceAppendIfAny("romance_view", "mountain_view", [
    "bergblick",
    "blick auf die berge",
    "bergpanorama",
    "mountain view",
  ]);


  // =========================================================
  // SEEBLICK
  // =========================================================

  romanceAppendIfAny("romance_view", "lake_view", [
    "seeblick",
    "blick auf den see",
    "lake view",
  ]);


  // =========================================================
  // PANORAMABLICK
  // =========================================================

  romanceAppendIfAny("romance_view", "panoramic_view", [
    "panoramablick",
    "panoramaaussicht",
    "panorama aussicht",
    "weite aussicht",
  ]);


  // =========================================================
  // SONNENUNTERGANG
  // =========================================================

  romanceAppendIfAny("romance_view", "sunset_view", [
    "sonnenuntergang",
    "sonnenuntergangsblick",
    "blick auf den sonnenuntergang",
    "sunset view",
  ]);


  // =========================================================
  // ROMANTISCHES DINNER
  // =========================================================

  romanceAppendIfAny("romance_service", "romantic_dinner", [
    "romantisches dinner",
    "romantisches abendessen",
    "romantik dinner",
    "romantic dinner",
  ]);


  // =========================================================
  // CANDLE-LIGHT-DINNER
  // =========================================================

  romanceAppendIfAny("romance_service", "candlelight_dinner", [
    "candle light dinner",
    "candle-light-dinner",
    "candlelight dinner",
    "kerzenschein dinner",
    "dinner bei kerzenschein",
    "abendessen bei kerzenschein",
  ]);


  // =========================================================
  // PRIVATES DINNER
  // =========================================================

  romanceAppendIfAny("romance_service", "private_dining", [
    "privates dinner",
    "privates abendessen",
    "private dining",
    "dinner nur für uns",
    "dinner nur fuer uns",
  ]);


  // =========================================================
  // DINNER AUF DEM ZIMMER
  // =========================================================

  romanceAppendIfAny("romance_service", "in_room_dining", [
    "dinner im zimmer",
    "abendessen im zimmer",
    "essen im zimmer",
    "in room dining",
  ]);


  // =========================================================
  // FRÜHSTÜCK IM ZIMMER
  // =========================================================

  romanceAppendIfAny("romance_service", "breakfast_in_room", [
    "frühstück im zimmer",
    "fruehstueck im zimmer",
    "frühstück ans bett",
    "fruehstueck ans bett",
    "frühstück auf dem zimmer",
    "fruehstueck auf dem zimmer",
    "breakfast in room",
  ]);


  // =========================================================
  // FRÜHSTÜCK IM BETT
  // =========================================================

  romanceAppendIfAny("romance_service", "breakfast_in_bed", [
    "frühstück im bett",
    "fruehstueck im bett",
    "breakfast in bed",
  ]);


  // =========================================================
  // PAARMASSAGE
  // =========================================================

  romanceAppendIfAny("romance_service", "couples_massage", [
    "paarmassage",
    "paar massage",
    "massage für paare",
    "massage fuer paare",
    "massage zu zweit",
    "couples massage",
  ]);


  // =========================================================
  // PRIVATE SPA
  // =========================================================

  romanceAppendIfAny("romance_feature", "private_spa", [
    "private spa",
    "privater spa",
    "eigener spa",
    "private wellnessbereich",
    "privater wellnessbereich",
    "wellness nur für uns",
    "wellness nur fuer uns",
  ]);


  // =========================================================
  // SPA FÜR PAARE
  // =========================================================

  romanceAppendIfAny("romance_preference", "couples_spa", [
    "spa für paare",
    "spa fuer paare",
    "paar spa",
    "couples spa",
    "wellness für paare",
    "wellness fuer paare",
  ]);


  // =========================================================
  // ROMANTISCHE DEKORATION
  // =========================================================

  romanceAppendIfAny("romance_service", "romantic_decoration", [
    "romantische dekoration",
    "romantisch dekoriert",
    "romantik dekoration",
    "romantische zimmerdekoration",
    "romantic decoration",
  ]);


  // =========================================================
  // ROSEN / BLUMEN
  // =========================================================

  romanceAppendIfAny("romance_service", "flowers", [
    "rosen im zimmer",
    "rosenblätter",
    "rosenblaetter",
    "blumen im zimmer",
    "blumenarrangement",
    "rosendekoration",
  ]);


  // =========================================================
  // CHAMPAGNER / SEKT
  // =========================================================

  romanceAppendIfAny("romance_service", "sparkling_wine", [
    "sekt im zimmer",
    "sekt auf dem zimmer",
    "champagner im zimmer",
    "champagner auf dem zimmer",
    "flasche sekt",
    "flasche champagner",
    "sparkling wine",
  ]);


  // =========================================================
  // ROMANTIK-PAKET
  // =========================================================

  romanceAppendIfAny("romance_service", "romance_package", [
    "romantikpaket",
    "romantik paket",
    "romantikangebot",
    "romantik arrangement",
    "romantikarrangement",
    "romance package",
  ]);


  // =========================================================
  // HONEYMOON-PAKET
  // =========================================================

  romanceAppendIfAny("romance_service", "honeymoon_package", [
    "honeymoon paket",
    "honeymoon package",
    "flitterwochenpaket",
    "flitterwochen paket",
    "hochzeitsreise paket",
  ]);


  // =========================================================
  // JAHRESTAGS-PAKET
  // =========================================================

  romanceAppendIfAny("romance_service", "anniversary_package", [
    "jahrestagspaket",
    "jahrestags paket",
    "hochzeitstagspaket",
    "hochzeitstags paket",
    "anniversary package",
  ]);


  // =========================================================
  // BESONDERE ÜBERRASCHUNG
  // =========================================================

  romanceAppendIfAny("romance_service", "surprise_arrangement", [
    "romantische überraschung",
    "romantische ueberraschung",
    "überraschung für meinen partner",
    "ueberraschung fuer meinen partner",
    "überraschung für meine partnerin",
    "ueberraschung fuer meine partnerin",
    "überraschung arrangieren",
    "ueberraschung arrangieren",
  ]);


  // =========================================================
  // PRIVATES PICKNICK
  // =========================================================

  romanceAppendIfAny("romance_service", "romantic_picnic", [
    "romantisches picknick",
    "privates picknick",
    "picknick für zwei",
    "picknick fuer zwei",
    "romantic picnic",
  ]);


  // =========================================================
  // ROMANTISCHE BOOTSFAHRT
  // =========================================================

  romanceAppendIfAny("romance_service", "romantic_boat_trip", [
    "romantische bootsfahrt",
    "bootsfahrt zu zweit",
    "private bootsfahrt",
    "romantic boat trip",
  ]);


  // =========================================================
  // PRIVATER STRAND
  // =========================================================

  romanceAppendIfAny("romance_feature", "private_beach", [
    "privatstrand",
    "privater strand",
    "private beach",
  ]);


  // =========================================================
  // DIREKTER STRANDZUGANG
  // =========================================================

  romanceAppendIfAny("romance_feature", "direct_beach_access", [
    "direkter strandzugang",
    "direktzugang zum strand",
    "eigener strandzugang",
    "direct beach access",
  ]);


  // =========================================================
  // ROMANTISCHE STRANDLAGE
  // =========================================================

  romanceAppendIfAny("romance_preference", "romantic_beach_location", [
    "romantische strandlage",
    "ruhiger strand für paare",
    "ruhiger strand fuer paare",
    "einsamer strand",
    "romantischer strand",
  ]);


  // =========================================================
  // DIREKT AM MEER
  // =========================================================

  romanceAppendIfAny("romance_preference", "seafront", [
    "direkt am meer",
    "direkte meerlage",
    "unmittelbar am meer",
    "seafront",
  ]);


  // =========================================================
  // DIREKT AM SEE
  // =========================================================

  romanceAppendIfAny("romance_preference", "lakefront", [
    "direkt am see",
    "direkte seelage",
    "unmittelbar am see",
    "lakefront",
  ]);


  // =========================================================
  // BAUMHAUS
  // =========================================================

  romanceAppendIfAny("romance_feature", "treehouse", [
    "baumhaus",
    "baumhaus hotel",
    "baumhausunterkunft",
    "treehouse",
  ]);


  // =========================================================
  // GLAMPING
  // =========================================================

  romanceAppendIfAny("romance_feature", "glamping", [
    "glamping",
    "luxuszelt",
    "luxus zelt",
    "glampingzelt",
  ]);


  // =========================================================
  // TINY HOUSE
  // =========================================================

  romanceAppendIfAny("romance_feature", "tiny_house", [
    "tiny house",
    "tinyhouse",
    "tiny haus",
  ]);


  // =========================================================
  // PRIVATE HÜTTE
  // =========================================================

  romanceAppendIfAny("romance_feature", "private_cabin", [
    "private hütte",
    "private huette",
    "eigene hütte",
    "eigene huette",
    "einsame hütte",
    "einsame huette",
    "romantische hütte",
    "romantische huette",
  ]);


  // =========================================================
  // SCHLOSS / BURG
  // =========================================================

  romanceAppendIfAny("romance_feature", "castle_stay", [
    "schlosshotel",
    "übernachten im schloss",
    "uebernachten im schloss",
    "übernachten in einer burg",
    "uebernachten in einer burg",
    "burghotel",
    "castle hotel",
  ]);


  // =========================================================
  // BOUTIQUE-HOTEL
  // =========================================================

  romanceAppendIfAny("romance_preference", "boutique", [
    "boutique hotel",
    "boutiquehotel",
    "kleines boutique hotel",
    "individuelles boutique hotel",
  ]);


  // =========================================================
  // LUXUS
  // =========================================================

  romanceAppendIfAny("romance_preference", "luxury", [
    "luxuriös",
    "luxurioes",
    "luxusurlaub zu zweit",
    "luxushotel für paare",
    "luxushotel fuer paare",
    "luxuriöse suite",
    "luxurioese suite",
  ]);


  // =========================================================
  // KLEIN / INTIM
  // =========================================================

  romanceAppendIfAny("romance_preference", "intimate", [
    "kleines romantisches hotel",
    "kleine romantische unterkunft",
    "intimes hotel",
    "intime atmosphäre",
    "intime atmosphaere",
    "persönliche atmosphäre",
    "persoenliche atmosphaere",
  ]);


  // =========================================================
  // KEIN MASSENTOURISMUS
  // =========================================================

  romanceAppendIfAny("romance_preference", "away_from_mass_tourism", [
    "kein massentourismus",
    "ohne massentourismus",
    "abseits vom massentourismus",
    "fern vom massentourismus",
  ]);


  // =========================================================
  // KEINE KINDER / RUHE FÜR PAARE
  // =========================================================

  romanceAppendIfAny("romance_preference", "quiet_for_couples", [
    "ruhig für paare",
    "ruhig fuer paare",
    "ruhe für paare",
    "ruhe fuer paare",
    "ungestört zu zweit",
    "ungestoert zu zweit",
  ]);


  // =========================================================
  // BESONDERE / EINZIGARTIGE UNTERKUNFT
  // =========================================================

  romanceAppendIfAny("romance_preference", "unique_stay", [
    "besondere unterkunft",
    "außergewöhnliche unterkunft",
    "aussergewoehnliche unterkunft",
    "einzigartige unterkunft",
    "ungewöhnliche unterkunft",
    "ungewoehnliche unterkunft",
    "unique stay",
  ]);


  // =========================================================
  // ERWACHSENENPOOL
  // =========================================================

  romanceAppendIfAny("romance_feature", "adults_pool", [
    "pool nur für erwachsene",
    "pool nur fuer erwachsene",
    "adults only pool",
    "adults-only pool",
  ]);


  // =========================================================
  // RUHEBEREICH NUR FÜR ERWACHSENE
  // =========================================================

  romanceAppendIfAny("romance_feature", "adults_only_relaxation_area", [
    "ruhebereich nur für erwachsene",
    "ruhebereich nur fuer erwachsene",
    "adults only ruhebereich",
    "adults-only ruhebereich",
  ]);


  // =========================================================
  // ROMANTISCHE AUSSICHT
  // =========================================================

  romanceAppendIfAny("romance_preference", "romantic_view", [
    "romantische aussicht",
    "romantischer ausblick",
    "traumhafte aussicht zu zweit",
    "schöne aussicht für paare",
    "schoene aussicht fuer paare",
  ]);


  // =========================================================
  // STERNE BEOBACHTEN
  // =========================================================

  romanceAppendIfAny("romance_preference", "stargazing", [
    "sterne beobachten",
    "sternenhimmel",
    "romantischer sternenhimmel",
    "stargazing",
  ]);


  // =========================================================
  // SONNENUNTERGANG ZU ZWEIT
  // =========================================================

  romanceAppendIfAny("romance_preference", "sunset_romance", [
    "sonnenuntergang zu zweit",
    "romantischer sonnenuntergang",
    "sonnenuntergang vom balkon",
    "sonnenuntergang von der terrasse",
  ]);


  // =========================================================
  // ROMANTISCHES WOCHENENDE
  // =========================================================

  romanceAppendIfAny("trip_style", "romantic_weekend", [
    "romantisches wochenende",
    "romantikwochenende",
    "romantik wochenende",
    "wochenende für zwei",
    "wochenende fuer zwei",
    "wochenende zu zweit",
  ]);


  // =========================================================
  // KURZURLAUB ZU ZWEIT
  // =========================================================

  romanceAppendIfAny("trip_style", "couples_short_break", [
    "kurzurlaub zu zweit",
    "kurztrip zu zweit",
    "kurzreise zu zweit",
    "romantischer kurzurlaub",
    "romantischer kurztrip",
  ]);


  // =========================================================
  // WELLNESS-WOCHENENDE ZU ZWEIT
  // =========================================================

  romanceAppendIfAny("trip_style", "couples_wellness_trip", [
    "wellness zu zweit",
    "wellnessurlaub zu zweit",
    "wellnesswochenende zu zweit",
    "romantisches wellnesswochenende",
    "wellness für paare",
    "wellness fuer paare",
  ]);
}
