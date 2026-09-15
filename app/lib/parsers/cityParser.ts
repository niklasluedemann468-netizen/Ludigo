export function parseCitySearch(
  normalizedText: string,
  params: URLSearchParams
) {
  // =========================================================
  // STADT, ZENTRUM, SEHENSWÜRDIGKEITEN & NACHTLEBEN
  // =========================================================

  const cityIncludesAny = (terms: string[]) =>
    terms.some((term) => normalizedText.includes(term));

  const cityAppendIfAny = (
    key: string,
    value: string,
    terms: string[]
  ) => {
    if (cityIncludesAny(terms)) {
      params.append(key, value);
    }
  };

  const cityToMeters = (value: string, unit: string) => {
    const numericValue = Number(value.replace(",", "."));

    return unit === "km" || unit === "kilometer"
      ? Math.round(numericValue * 1000)
      : Math.round(numericValue);
  };


  // =========================================================
  // STADTLAGE ALLGEMEIN
  // =========================================================

  cityAppendIfAny("city_location", "urban", [
    "stadtlage",
    "städtische lage",
    "staedtische lage",
    "mitten in der stadt",
    "in der stadt",
    "urban gelegen",
    "urban location",
  ]);

  cityAppendIfAny("trip_style", "city_trip", [
    "städtereise",
    "staedtereise",
    "städteurlaub",
    "staedteurlaub",
    "citytrip",
    "city trip",
    "stadturlaub",
    "urlaub in der stadt",
  ]);


  // =========================================================
  // STADTZENTRUM / INNENSTADT
  // =========================================================

  cityAppendIfAny("city_location", "city_center", [
    "stadtzentrum",
    "stadt zentrum",
    "im zentrum",
    "im stadtzentrum",
    "zentrumslage",
    "zentrale innenstadt",
    "city center",
    "city centre",
  ]);

  cityAppendIfAny("city_location", "downtown", [
    "innenstadt",
    "innenstadtlage",
    "mitten in der innenstadt",
    "downtown",
  ]);

  cityAppendIfAny("city_preference", "very_central", [
    "sehr zentral",
    "äußerst zentral",
    "aeusserst zentral",
    "maximal zentral",
    "mitten im zentrum",
    "direkt im zentrum",
    "direkt in der innenstadt",
  ]);

  cityAppendIfAny("city_preference", "central_location", [
    "zentrale lage",
    "zentral gelegen",
    "möglichst zentral",
    "moeglichst zentral",
    "zentral wohnen",
  ]);


  // =========================================================
  // ALTSTADT
  // =========================================================

  cityAppendIfAny("city_location", "old_town", [
    "altstadt",
    "in der altstadt",
    "altstadtlage",
    "historische altstadt",
    "old town",
  ]);

  cityAppendIfAny("city_preference", "historic_center", [
    "historisches zentrum",
    "historischer stadtkern",
    "historisches stadtzentrum",
    "historischer ortskern",
  ]);


  // =========================================================
  // FUSSGÄNGERZONE
  // =========================================================

  cityAppendIfAny("city_location", "pedestrian_zone", [
    "fußgängerzone",
    "fussgaengerzone",
    "fußgängerbereich",
    "fussgaengerbereich",
    "pedestrian zone",
  ]);

  cityAppendIfAny("city_preference", "pedestrian_friendly", [
    "fußgängerfreundlich",
    "fussgaengerfreundlich",
    "gut zu fuß",
    "gut zu fuss",
    "viel zu fuß erreichbar",
    "viel zu fuss erreichbar",
    "walkable",
  ]);


  // =========================================================
  // SEHENSWÜRDIGKEITEN
  // =========================================================

  cityAppendIfAny("city_location", "near_attractions", [
    "sehenswürdigkeiten in der nähe",
    "sehenswuerdigkeiten in der naehe",
    "nah an sehenswürdigkeiten",
    "nah an sehenswuerdigkeiten",
    "nähe sehenswürdigkeiten",
    "naehe sehenswuerdigkeiten",
    "touristische attraktionen in der nähe",
    "touristische attraktionen in der naehe",
    "attractions nearby",
  ]);

  cityAppendIfAny("city_preference", "sightseeing_friendly", [
    "gut für sightseeing",
    "gut fuer sightseeing",
    "ideal für sightseeing",
    "ideal fuer sightseeing",
    "für sightseeing geeignet",
    "fuer sightseeing geeignet",
    "sightseeing",
  ]);


  // =========================================================
  // HISTORISCHE SEHENSWÜRDIGKEITEN
  // =========================================================

  cityAppendIfAny("city_location", "near_historic_sites", [
    "historische sehenswürdigkeiten",
    "historische sehenswuerdigkeiten",
    "historische stätten",
    "historische staetten",
    "historische gebäude",
    "historische gebaeude",
    "historische orte",
    "historic sites",
  ]);


  // =========================================================
  // MUSEEN
  // =========================================================

  cityAppendIfAny("city_location", "near_museum", [
    "museum in der nähe",
    "museum in der naehe",
    "museen in der nähe",
    "museen in der naehe",
    "nah am museum",
    "nah an museen",
    "museum nearby",
  ]);

  cityAppendIfAny("city_preference", "museum_area", [
    "museumviertel",
    "museumsviertel",
    "museumsquartier",
    "kulturviertel mit museen",
  ]);


  // =========================================================
  // KUNST / GALERIEN
  // =========================================================

  cityAppendIfAny("city_location", "near_art_gallery", [
    "kunstgalerie in der nähe",
    "kunstgalerie in der naehe",
    "galerie in der nähe",
    "galerie in der naehe",
    "galerien in der nähe",
    "galerien in der naehe",
    "kunstgalerien",
  ]);

  cityAppendIfAny("city_preference", "art_district", [
    "kunstviertel",
    "galerienviertel",
    "kunstszene",
    "kreativviertel",
  ]);


  // =========================================================
  // THEATER
  // =========================================================

  cityAppendIfAny("city_location", "near_theater", [
    "theater in der nähe",
    "theater in der naehe",
    "nah am theater",
    "theater nearby",
  ]);


  // =========================================================
  // OPER
  // =========================================================

  cityAppendIfAny("city_location", "near_opera", [
    "oper in der nähe",
    "oper in der naehe",
    "operhaus in der nähe",
    "operhaus in der naehe",
    "nah an der oper",
  ]);


  // =========================================================
  // KONZERTHAUS
  // =========================================================

  cityAppendIfAny("city_location", "near_concert_hall", [
    "konzerthaus in der nähe",
    "konzerthaus in der naehe",
    "konzerthalle in der nähe",
    "konzerthalle in der naehe",
    "konzertsaal in der nähe",
    "konzertsaal in der naehe",
  ]);


  // =========================================================
  // VERANSTALTUNGSORT
  // =========================================================

  cityAppendIfAny("city_location", "near_event_venue", [
    "veranstaltungsort in der nähe",
    "veranstaltungsort in der naehe",
    "eventlocation in der nähe",
    "eventlocation in der naehe",
    "veranstaltungshalle in der nähe",
    "veranstaltungshalle in der naehe",
  ]);


  // =========================================================
  // STADION
  // =========================================================

  cityAppendIfAny("city_location", "near_stadium", [
    "stadion in der nähe",
    "stadion in der naehe",
    "nah am stadion",
    "fußballstadion in der nähe",
    "fussballstadion in der naehe",
    "stadium nearby",
  ]);


  // =========================================================
  // ARENA
  // =========================================================

  cityAppendIfAny("city_location", "near_arena", [
    "arena in der nähe",
    "arena in der naehe",
    "nah an der arena",
    "multifunktionsarena in der nähe",
    "multifunktionsarena in der naehe",
  ]);


  // =========================================================
  // MESSE / AUSSTELLUNG
  // =========================================================

  cityAppendIfAny("city_location", "near_exhibition_center", [
    "messe in der nähe",
    "messe in der naehe",
    "nah an der messe",
    "messegelände in der nähe",
    "messegelände in der naehe",
    "messezentrum in der nähe",
    "messezentrum in der naehe",
    "exhibition center nearby",
  ]);


  // =========================================================
  // KONGRESSZENTRUM
  // =========================================================

  cityAppendIfAny("city_location", "near_convention_center", [
    "kongresszentrum in der nähe",
    "kongresszentrum in der naehe",
    "kongresshalle in der nähe",
    "kongresshalle in der naehe",
    "conference center nearby",
    "convention center nearby",
  ]);


  // =========================================================
  // GESCHÄFTSVIERTEL
  // =========================================================

  cityAppendIfAny("city_location", "business_district", [
    "geschäftsviertel",
    "geschaeftsviertel",
    "businessviertel",
    "business district",
    "büroviertel",
    "bueroviertel",
    "finanzviertel",
  ]);


  // =========================================================
  // SHOPPING ALLGEMEIN
  // =========================================================

  cityAppendIfAny("city_location", "near_shopping", [
    "shopping in der nähe",
    "shopping in der naehe",
    "einkaufen in der nähe",
    "einkaufen in der naehe",
    "geschäfte in der nähe",
    "geschaefte in der naehe",
    "läden in der nähe",
    "laeden in der naehe",
    "shopping nearby",
  ]);

  cityAppendIfAny("city_preference", "shopping_trip", [
    "shoppingurlaub",
    "shoppingreise",
    "shopping trip",
    "zum shoppen",
    "zum einkaufen",
  ]);


  // =========================================================
  // EINKAUFSSTRASSE
  // =========================================================

  cityAppendIfAny("city_location", "near_shopping_street", [
    "einkaufsstraße",
    "einkaufsstrasse",
    "shoppingstraße",
    "shoppingstrasse",
    "geschäftsstraße",
    "geschaeftsstrasse",
  ]);


  // =========================================================
  // EINKAUFSZENTRUM
  // =========================================================

  cityAppendIfAny("city_location", "near_shopping_mall", [
    "einkaufszentrum in der nähe",
    "einkaufszentrum in der naehe",
    "shoppingcenter in der nähe",
    "shoppingcenter in der naehe",
    "shopping mall in der nähe",
    "shopping mall in der naehe",
    "nah am einkaufszentrum",
  ]);


  // =========================================================
  // LUXUS-SHOPPING
  // =========================================================

  cityAppendIfAny("city_preference", "luxury_shopping", [
    "luxus shopping",
    "luxusshopping",
    "designerläden",
    "designerlaeden",
    "luxusboutiquen",
    "luxusgeschäfte",
    "luxusgeschaefte",
  ]);


  // =========================================================
  // MARKT
  // =========================================================

  cityAppendIfAny("city_location", "near_market", [
    "markt in der nähe",
    "markt in der naehe",
    "wochenmarkt in der nähe",
    "wochenmarkt in der naehe",
    "markthalle in der nähe",
    "markthalle in der naehe",
  ]);


  // =========================================================
  // RESTAURANTVIERTEL
  // =========================================================

  cityAppendIfAny("city_location", "restaurant_district", [
    "restaurantviertel",
    "gastronomieviertel",
    "viele restaurants",
    "restaurantmeile",
    "restaurant straße",
    "restaurant strasse",
  ]);


  // =========================================================
  // RESTAURANTS IN DER NÄHE
  // =========================================================

  cityAppendIfAny("city_location", "near_restaurants", [
    "restaurants in der nähe",
    "restaurants in der naehe",
    "restaurant in der nähe",
    "restaurant in der naehe",
    "nah an restaurants",
    "restaurants fußläufig",
    "restaurants fusslaeufig",
  ]);


  // =========================================================
  // CAFÉS
  // =========================================================

  cityAppendIfAny("city_location", "near_cafes", [
    "cafés in der nähe",
    "cafes in der naehe",
    "café in der nähe",
    "cafe in der naehe",
    "viele cafés",
    "viele cafes",
    "caféviertel",
    "cafeviertel",
  ]);


  // =========================================================
  // BARS
  // =========================================================

  cityAppendIfAny("city_location", "near_bars", [
    "bars in der nähe",
    "bars in der naehe",
    "bar in der nähe",
    "bar in der naehe",
    "viele bars",
    "barviertel",
  ]);


  // =========================================================
  // NACHTLEBEN
  // =========================================================

  cityAppendIfAny("city_location", "nightlife_area", [
    "nachtleben",
    "nightlife",
    "ausgehviertel",
    "partyviertel",
    "kneipenviertel",
    "barviertel",
    "clubviertel",
  ]);

  cityAppendIfAny("trip_style", "nightlife_trip", [
    "partyurlaub",
    "partyreise",
    "party trip",
    "urlaub zum feiern",
    "zum feiern",
  ]);


  // =========================================================
  // CLUBS / DISKOTHEKEN
  // =========================================================

  cityAppendIfAny("city_location", "near_nightclubs", [
    "clubs in der nähe",
    "clubs in der naehe",
    "club in der nähe",
    "club in der naehe",
    "diskothek in der nähe",
    "diskothek in der naehe",
    "diskotheken in der nähe",
    "diskotheken in der naehe",
    "nachtclubs in der nähe",
    "nachtclubs in der naehe",
  ]);


  // =========================================================
  // PUBS / KNEIPEN
  // =========================================================

  cityAppendIfAny("city_location", "near_pubs", [
    "kneipen in der nähe",
    "kneipen in der naehe",
    "pubs in der nähe",
    "pubs in der naehe",
    "pub in der nähe",
    "pub in der naehe",
  ]);


  // =========================================================
  // RUHIG TROTZ ZENTRUM
  // =========================================================

  cityAppendIfAny("city_preference", "quiet_central", [
    "ruhig aber zentral",
    "zentral aber ruhig",
    "ruhige zentrale lage",
    "ruhig trotz innenstadt",
    "ruhig trotz zentrum",
  ]);


  // =========================================================
  // LEBENDIGE UMGEBUNG
  // =========================================================

  cityAppendIfAny("city_preference", "lively_area", [
    "lebendige umgebung",
    "lebendiges viertel",
    "belebte gegend",
    "viel los in der umgebung",
    "mitten im leben",
  ]);


  // =========================================================
  // TRENDVIERTEL
  // =========================================================

  cityAppendIfAny("city_preference", "trendy_district", [
    "trendviertel",
    "hippes viertel",
    "angesagtes viertel",
    "szeneviertel",
    "hip district",
  ]);


  // =========================================================
  // KREATIVVIERTEL
  // =========================================================

  cityAppendIfAny("city_preference", "creative_district", [
    "kreativviertel",
    "künstlerviertel",
    "kuenstlerviertel",
    "kulturviertel",
    "kreative gegend",
  ]);


  // =========================================================
  // HISTORISCHES VIERTEL
  // =========================================================

  cityAppendIfAny("city_preference", "historic_district", [
    "historisches viertel",
    "historisches quartier",
    "historisches stadtviertel",
    "historisches wohnviertel",
  ]);


  // =========================================================
  // LUXUSVIERTEL
  // =========================================================

  cityAppendIfAny("city_preference", "upscale_district", [
    "luxusviertel",
    "gehobenes viertel",
    "exklusives viertel",
    "nobles viertel",
    "upscale district",
  ]);


  // =========================================================
  // WOHNVIERTEL
  // =========================================================

  cityAppendIfAny("city_preference", "residential_area", [
    "wohnviertel",
    "ruhiges wohnviertel",
    "wohngegend",
    "residential area",
  ]);


  // =========================================================
  // UNIVERSITÄT
  // =========================================================

  cityAppendIfAny("city_location", "near_university", [
    "universität in der nähe",
    "universitaet in der naehe",
    "uni in der nähe",
    "uni in der naehe",
    "nah an der universität",
    "nah an der universitaet",
    "campus in der nähe",
    "campus in der naehe",
  ]);


  // =========================================================
  // KRANKENHAUS
  // =========================================================

  cityAppendIfAny("city_location", "near_hospital", [
    "krankenhaus in der nähe",
    "krankenhaus in der naehe",
    "klinik in der nähe",
    "klinik in der naehe",
    "nah am krankenhaus",
  ]);


  // =========================================================
  // PARK / STADTPARK
  // =========================================================

  cityAppendIfAny("city_location", "near_city_park", [
    "park in der nähe",
    "park in der naehe",
    "stadtpark in der nähe",
    "stadtpark in der naehe",
    "nah am park",
    "grünanlage in der nähe",
    "gruenanlage in der naehe",
  ]);


  // =========================================================
  // BOTANISCHER GARTEN
  // =========================================================

  cityAppendIfAny("city_location", "near_botanical_garden", [
    "botanischer garten in der nähe",
    "botanischer garten in der naehe",
    "nah am botanischen garten",
  ]);


  // =========================================================
  // ZOO
  // =========================================================

  cityAppendIfAny("city_location", "near_zoo", [
    "zoo in der nähe",
    "zoo in der naehe",
    "tierpark in der nähe",
    "tierpark in der naehe",
    "nah am zoo",
  ]);


  // =========================================================
  // FREIZEITPARK
  // =========================================================

  cityAppendIfAny("city_location", "near_theme_park", [
    "freizeitpark in der nähe",
    "freizeitpark in der naehe",
    "themenpark in der nähe",
    "themenpark in der naehe",
    "nah am freizeitpark",
  ]);


  // =========================================================
  // FLUSSPROMENADE / UFER INNERHALB DER STADT
  // =========================================================

  cityAppendIfAny("city_location", "near_riverfront", [
    "flussufer in der nähe",
    "flussufer in der naehe",
    "uferpromenade in der nähe",
    "uferpromenade in der naehe",
    "promenade am fluss",
  ]);


  // =========================================================
  // HAFENVIERTEL
  // =========================================================

  cityAppendIfAny("city_location", "harbor_district", [
    "hafenviertel",
    "hafen quartier",
    "hafenquartier",
    "am stadthafen",
    "waterfront district",
  ]);


  // =========================================================
  // BAHNHOFSVIERTEL
  // =========================================================

  cityAppendIfAny("city_location", "near_main_station", [
    "hauptbahnhof in der nähe",
    "hauptbahnhof in der naehe",
    "nah am hauptbahnhof",
    "zentralbahnhof in der nähe",
    "zentralbahnhof in der naehe",
  ]);


  // =========================================================
  // ÖPNV-FREUNDLICH
  // =========================================================

  cityAppendIfAny("city_preference", "public_transport_friendly", [
    "gute öffentliche verkehrsanbindung",
    "gute oeffentliche verkehrsanbindung",
    "guter öffentlicher nahverkehr",
    "guter oeffentlicher nahverkehr",
    "gut mit öffentlichen verkehrsmitteln",
    "gut mit oeffentlichen verkehrsmitteln",
    "guter öpnv",
    "guter oepnv",
  ]);


  // =========================================================
  // AUTO NICHT NOTWENDIG
  // =========================================================

  cityAppendIfAny("city_preference", "car_not_needed", [
    "kein auto nötig",
    "kein auto noetig",
    "ohne auto",
    "auto nicht notwendig",
    "alles ohne auto erreichbar",
  ]);


  // =========================================================
  // ALLES ZU FUSS
  // =========================================================

  cityAppendIfAny("city_preference", "walk_everywhere", [
    "alles zu fuß erreichbar",
    "alles zu fuss erreichbar",
    "alles fußläufig",
    "alles fusslaeufig",
    "zu fuß alles erreichbar",
    "zu fuss alles erreichbar",
  ]);


  // =========================================================
  // ENTFERNUNG ZUM STADTZENTRUM
  // Beispiele:
  // "maximal 500 m zum Zentrum"
  // "höchstens 2 km vom Stadtzentrum"
  // =========================================================

  const cityCenterDistanceMatch = normalizedText.match(
    /(?:maximal|max\.?|höchstens|hoechstens|bis zu|nicht mehr als)\s*(\d+(?:[.,]\d+)?)\s*(m|meter|km|kilometer)\s*(?:zum|vom|bis zum|entfernt vom)\s*(?:zentrum|stadtzentrum|innenstadt)/
  );

  if (cityCenterDistanceMatch) {
    params.set(
      "max_distance_city_center_m",
      String(
        cityToMeters(
          cityCenterDistanceMatch[1],
          cityCenterDistanceMatch[2]
        )
      )
    );
  }


  // =========================================================
  // ENTFERNUNG ZUR ALTSTADT
  // =========================================================

  const cityOldTownDistanceMatch = normalizedText.match(
    /(?:maximal|max\.?|höchstens|hoechstens|bis zu|nicht mehr als)\s*(\d+(?:[.,]\d+)?)\s*(m|meter|km|kilometer)\s*(?:zur|von der|bis zur|entfernt von der)\s*altstadt/
  );

  if (cityOldTownDistanceMatch) {
    params.set(
      "max_distance_old_town_m",
      String(
        cityToMeters(
          cityOldTownDistanceMatch[1],
          cityOldTownDistanceMatch[2]
        )
      )
    );
  }


  // =========================================================
  // ENTFERNUNG ZU SEHENSWÜRDIGKEITEN
  // =========================================================

  const cityAttractionDistanceMatch = normalizedText.match(
    /(?:maximal|max\.?|höchstens|hoechstens|bis zu|nicht mehr als)\s*(\d+(?:[.,]\d+)?)\s*(m|meter|km|kilometer)\s*(?:zu|von|bis zu|entfernt von)\s*(?:sehenswürdigkeiten|sehenswuerdigkeiten|attraktionen)/
  );

  if (cityAttractionDistanceMatch) {
    params.set(
      "max_distance_attractions_m",
      String(
        cityToMeters(
          cityAttractionDistanceMatch[1],
          cityAttractionDistanceMatch[2]
        )
      )
    );
  }


  // =========================================================
  // ENTFERNUNG ZUM MUSEUM
  // =========================================================

  const cityMuseumDistanceMatch = normalizedText.match(
    /(?:maximal|max\.?|höchstens|hoechstens|bis zu|nicht mehr als)\s*(\d+(?:[.,]\d+)?)\s*(m|meter|km|kilometer)\s*(?:zum|vom|bis zum|entfernt vom)\s*museum/
  );

  if (cityMuseumDistanceMatch) {
    params.set(
      "max_distance_museum_m",
      String(
        cityToMeters(
          cityMuseumDistanceMatch[1],
          cityMuseumDistanceMatch[2]
        )
      )
    );
  }


  // =========================================================
  // ENTFERNUNG ZUM STADION
  // =========================================================

  const cityStadiumDistanceMatch = normalizedText.match(
    /(?:maximal|max\.?|höchstens|hoechstens|bis zu|nicht mehr als)\s*(\d+(?:[.,]\d+)?)\s*(m|meter|km|kilometer)\s*(?:zum|vom|bis zum|entfernt vom)\s*stadion/
  );

  if (cityStadiumDistanceMatch) {
    params.set(
      "max_distance_stadium_m",
      String(
        cityToMeters(
          cityStadiumDistanceMatch[1],
          cityStadiumDistanceMatch[2]
        )
      )
    );
  }


  // =========================================================
  // ENTFERNUNG ZUR MESSE
  // =========================================================

  const cityExhibitionDistanceMatch = normalizedText.match(
    /(?:maximal|max\.?|höchstens|hoechstens|bis zu|nicht mehr als)\s*(\d+(?:[.,]\d+)?)\s*(m|meter|km|kilometer)\s*(?:zur|von der|bis zur|entfernt von der)\s*(?:messe|messegelände|messezentrum)/
  );

  if (cityExhibitionDistanceMatch) {
    params.set(
      "max_distance_exhibition_center_m",
      String(
        cityToMeters(
          cityExhibitionDistanceMatch[1],
          cityExhibitionDistanceMatch[2]
        )
      )
    );
  }


  // =========================================================
  // ENTFERNUNG ZUM EINKAUFSZENTRUM
  // =========================================================

  const cityShoppingMallDistanceMatch = normalizedText.match(
    /(?:maximal|max\.?|höchstens|hoechstens|bis zu|nicht mehr als)\s*(\d+(?:[.,]\d+)?)\s*(m|meter|km|kilometer)\s*(?:zum|vom|bis zum|entfernt vom)\s*(?:einkaufszentrum|shoppingcenter)/
  );

  if (cityShoppingMallDistanceMatch) {
    params.set(
      "max_distance_shopping_mall_m",
      String(
        cityToMeters(
          cityShoppingMallDistanceMatch[1],
          cityShoppingMallDistanceMatch[2]
        )
      )
    );
  }


  // =========================================================
  // ENTFERNUNG ZUM NACHTLEBEN
  // =========================================================

  const cityNightlifeDistanceMatch = normalizedText.match(
    /(?:maximal|max\.?|höchstens|hoechstens|bis zu|nicht mehr als)\s*(\d+(?:[.,]\d+)?)\s*(m|meter|km|kilometer)\s*(?:zum|vom|bis zum|entfernt vom)\s*(?:nachtleben|partyviertel|ausgehviertel)/
  );

  if (cityNightlifeDistanceMatch) {
    params.set(
      "max_distance_nightlife_m",
      String(
        cityToMeters(
          cityNightlifeDistanceMatch[1],
          cityNightlifeDistanceMatch[2]
        )
      )
    );
  }


  // =========================================================
  // ZENTRUM FUSSLÄUFIG
  // =========================================================

  cityAppendIfAny("city_preference", "city_center_walkable", [
    "zentrum fußläufig",
    "zentrum fusslaeufig",
    "stadtzentrum fußläufig",
    "stadtzentrum fusslaeufig",
    "zu fuß ins zentrum",
    "zu fuss ins zentrum",
    "zentrum zu fuß erreichbar",
    "zentrum zu fuss erreichbar",
  ]);


  // =========================================================
  // ALTSTADT FUSSLÄUFIG
  // =========================================================

  cityAppendIfAny("city_preference", "old_town_walkable", [
    "altstadt fußläufig",
    "altstadt fusslaeufig",
    "zu fuß zur altstadt",
    "zu fuss zur altstadt",
    "altstadt zu fuß erreichbar",
    "altstadt zu fuss erreichbar",
  ]);


  // =========================================================
  // SEHENSWÜRDIGKEITEN FUSSLÄUFIG
  // =========================================================

  cityAppendIfAny("city_preference", "attractions_walkable", [
    "sehenswürdigkeiten fußläufig",
    "sehenswuerdigkeiten fusslaeufig",
    "sehenswürdigkeiten zu fuß",
    "sehenswuerdigkeiten zu fuss",
    "attraktionen fußläufig",
    "attraktionen fusslaeufig",
  ]);


  // =========================================================
  // RESTAURANTS FUSSLÄUFIG
  // =========================================================

  cityAppendIfAny("city_preference", "restaurants_walkable", [
    "restaurants fußläufig",
    "restaurants fusslaeufig",
    "restaurants zu fuß erreichbar",
    "restaurants zu fuss erreichbar",
  ]);


  // =========================================================
  // NACHTLEBEN FUSSLÄUFIG
  // =========================================================

  cityAppendIfAny("city_preference", "nightlife_walkable", [
    "nachtleben fußläufig",
    "nachtleben fusslaeufig",
    "clubs fußläufig",
    "clubs fusslaeufig",
    "bars fußläufig",
    "bars fusslaeufig",
  ]);


  // =========================================================
  // KULTURREISE
  // =========================================================

  cityAppendIfAny("trip_style", "culture_trip", [
    "kulturreise",
    "kultururlaub",
    "kultur trip",
    "kulturtrip",
    "urlaub für kultur",
    "urlaub fuer kultur",
  ]);


  // =========================================================
  // SIGHTSEEING-REISE
  // =========================================================

  cityAppendIfAny("trip_style", "sightseeing_trip", [
    "sightseeing reise",
    "sightseeing trip",
    "sightseeingurlaub",
    "urlaub für sightseeing",
    "urlaub fuer sightseeing",
  ]);


  // =========================================================
  // EVENT-REISE
  // =========================================================

  cityAppendIfAny("trip_style", "event_trip", [
    "eventreise",
    "event trip",
    "für ein konzert",
    "fuer ein konzert",
    "für eine veranstaltung",
    "fuer eine veranstaltung",
  ]);


  // =========================================================
  // MESSE-REISE
  // =========================================================

  cityAppendIfAny("trip_style", "trade_fair_trip", [
    "messereise",
    "messebesuch",
    "für eine messe",
    "fuer eine messe",
    "wegen einer messe",
  ]);


  // =========================================================
  // FUSSBALL / STADION-REISE
  // =========================================================

  cityAppendIfAny("trip_style", "stadium_trip", [
    "stadionbesuch",
    "fußballreise",
    "fussballreise",
    "für ein fußballspiel",
    "fuer ein fussballspiel",
    "wegen eines fußballspiels",
    "wegen eines fussballspiels",
  ]);
}