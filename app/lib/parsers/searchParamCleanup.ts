type SearchParams = URLSearchParams;

function getAllValues(params: SearchParams, key: string): string[] {
  return params.getAll(key);
}

function removeAll(params: SearchParams, key: string) {
  params.delete(key);
}

function appendUnique(
  params: SearchParams,
  key: string,
  values: string[]
) {
  const uniqueValues = [...new Set(values)];

  params.delete(key);

  for (const value of uniqueValues) {
    params.append(key, value);
  }
}

function removeValue(
  params: SearchParams,
  key: string,
  valueToRemove: string
) {
  const remaining = params
    .getAll(key)
    .filter((value) => value !== valueToRemove);

  params.delete(key);

  for (const value of remaining) {
    params.append(key, value);
  }
}

function removeValues(
  params: SearchParams,
  key: string,
  valuesToRemove: string[]
) {
  const blocked = new Set(valuesToRemove);

  const remaining = params
    .getAll(key)
    .filter((value) => !blocked.has(value));

  params.delete(key);

  for (const value of remaining) {
    params.append(key, value);
  }
}

function hasValue(
  params: SearchParams,
  key: string,
  value: string
) {
  return params.getAll(key).includes(value);
}


// =========================================================
// DOPPELTE PARAMETER ENTFERNEN
// =========================================================

function removeDuplicates(params: SearchParams) {
  const keys = [...new Set(Array.from(params.keys()))];

  for (const key of keys) {
    const values = getAllValues(params, key);

    if (values.length > 1) {
      appendUnique(params, key, values);
    }
  }
}


// =========================================================
// UNTERKUNFTSARTEN: AUSSCHLUSS GEWINNT
// =========================================================

function resolveAccommodationConflicts(params: SearchParams) {
  const excludedTypes = params.getAll(
    "exclude_accommodation_type"
  );

  if (excludedTypes.length === 0) {
    return;
  }

  const positiveKeys = [
    "accommodation_type",
    "type",
    "preferred_accommodation_type",
    "luxury_accommodation",
    "unique_stay_type",
  ];

  for (const excludedType of excludedTypes) {
    for (const key of positiveKeys) {
      removeValue(params, key, excludedType);
    }
  }


  // Spezielle Synonym-Gruppen

  if (
    excludedTypes.includes("holiday_apartment") ||
    excludedTypes.includes("apartment")
  ) {
    removeValues(params, "accommodation_type", [
      "holiday_apartment",
      "apartment",
      "apartment_hotel",
    ]);

    removeValues(params, "type", [
      "holiday_apartment",
      "apartment",
      "apartment_hotel",
    ]);
  }

  if (excludedTypes.includes("hotel")) {
    removeValues(params, "accommodation_type", [
      "hotel",
      "boutique_hotel",
      "design_hotel",
      "luxury_hotel",
    ]);

    removeValues(params, "type", [
      "hotel",
      "boutique_hotel",
      "design_hotel",
      "luxury_hotel",
    ]);
  }

  if (excludedTypes.includes("campsite")) {
    removeValues(params, "accommodation_type", [
      "campsite",
      "camping",
    ]);

    removeValues(params, "type", [
      "campsite",
      "camping",
    ]);
  }
}


// =========================================================
// LAGE: NEGATIVE LAGE GEWINNT
// =========================================================

function resolveLocationConflicts(params: SearchParams) {
  const excludedLocations = params.getAll(
    "exclude_location_preference"
  );

  if (excludedLocations.length === 0) {
    return;
  }

  const locationMap: Record<string, string[]> = {
    city_center: [
      "city_center",
      "central_location",
      "very_central",
      "downtown",
      "central",
    ],

    old_town: [
      "old_town",
      "historic_center",
      "historic_city_center",
    ],

    nightlife: [
      "nightlife",
      "nightlife_nearby",
      "bars_nearby",
      "clubs_nearby",
      "lively_location",
    ],

    busy_area: [
      "lively_location",
      "busy_location",
      "urban_buzz",
    ],

    main_road: [
      "main_road",
      "roadside",
    ],

    airport: [
      "near_airport",
      "airport",
      "airport_location",
    ],

    urban: [
      "urban",
      "city",
      "city_location",
      "urban_location",
    ],

    beach: [
      "beachfront",
      "near_beach",
      "beach",
      "beach_location",
    ],

    sea: [
      "near_sea",
      "sea",
      "seafront",
      "sea_location",
    ],

    lake: [
      "near_lake",
      "lake",
      "lakefront",
      "lake_location",
    ],

    mountains: [
      "mountain_location",
      "mountains",
      "mountain_area",
      "mountain_region",
    ],

    ski_area: [
      "ski_area",
      "ski_in_ski_out",
      "near_ski_slope",
      "ski_location",
    ],
  };

  const positiveKeys = [
    "location_feature",
    "location_preference",
    "city_preference",
    "city_feature",
    "nature_preference",
    "nature_location",
    "water_location",
    "luxury_location",
    "sleep_location",
  ];

  for (const excludedLocation of excludedLocations) {
    const conflictingValues =
      locationMap[excludedLocation] ?? [excludedLocation];

    for (const key of positiveKeys) {
      removeValues(
        params,
        key,
        conflictingValues
      );
    }
  }
}


// =========================================================
// FEATURES: AUSSCHLUSS GEWINNT
// =========================================================

function resolveFeatureConflicts(params: SearchParams) {
  const excludedFeatures =
    params.getAll("exclude_feature");

  if (excludedFeatures.length === 0) {
    return;
  }

  const positiveKeys = [
    "feature",
    "amenity",
    "luxury_feature",
    "security_feature",
    "sustainability_feature",
    "climate_feature",
    "sleep_feature",
    "event_feature",
    "long_stay_feature",
    "unique_stay_feature",
    "romance_feature",
    "family_feature",
    "pet_feature",
    "mobility_feature",
    "wellness_feature",
    "business_feature",
    "food_feature",
    "water_feature",
  ];

  const featureAliases: Record<string, string[]> = {
    pool: [
      "pool",
      "private_pool",
      "indoor_pool",
      "outdoor_pool",
      "infinity_pool",
      "rooftop_pool",
      "heated_pool",
      "shared_pool",
      "pool_villa",
    ],

    spa: [
      "spa",
      "private_spa",
      "wellness",
      "wellness_area",
      "spa_area",
      "spa_access",
    ],

    sauna: [
      "sauna",
      "private_sauna",
    ],

    gym: [
      "gym",
      "fitness",
      "fitness_room",
      "fitness_center",
      "private_gym",
    ],

    breakfast: [
      "breakfast",
      "breakfast_in_room",
      "floating_breakfast",
    ],

    parking: [
      "parking",
      "private_parking",
      "guarded_parking",
      "gated_parking",
      "secure_underground_parking",
      "private_garage",
      "valet_parking",
    ],

    air_conditioning: [
      "air_conditioning",
      "quiet_air_conditioning",
    ],

    elevator: [
      "elevator",
      "private_elevator",
    ],

    tv: [
      "tv",
      "smart_tv",
    ],

    wifi: [
      "wifi",
      "wlan",
      "high_speed_internet",
      "fast_wifi",
    ],

    pets: [
      "pets",
      "pets_allowed",
      "pet_friendly",
      "dogs_allowed",
      "cats_allowed",
    ],

    dogs: [
      "dogs",
      "dogs_allowed",
      "dog_friendly",
    ],

    cats: [
      "cats",
      "cats_allowed",
      "cat_friendly",
    ],

    shared_bathroom: [
      "shared_bathroom",
      "shared_bath",
    ],

    shared_kitchen: [
      "shared_kitchen",
    ],

    shared_room: [
      "shared_room",
      "dorm",
      "dormitory",
    ],

    smoking: [
      "smoking",
      "smoking_allowed",
      "smoking_room",
    ],

    children: [
      "children",
      "child_friendly",
      "family_with_children",
    ],
  };

  for (const excludedFeature of excludedFeatures) {
    const conflictingValues =
      featureAliases[excludedFeature] ??
      [excludedFeature];

    for (const key of positiveKeys) {
      removeValues(
        params,
        key,
        conflictingValues
      );
    }
  }
}


// =========================================================
// VERPFLEGUNG: AUSSCHLUSS GEWINNT
// =========================================================

function resolveBoardConflicts(params: SearchParams) {
  const excludedBoards =
    params.getAll("exclude_board");

  for (const excludedBoard of excludedBoards) {
    removeValue(
      params,
      "board",
      excludedBoard
    );

    removeValue(
      params,
      "board_type",
      excludedBoard
    );

    removeValue(
      params,
      "meal_plan",
      excludedBoard
    );
  }
}


// =========================================================
// STIL / PRÄFERENZEN
// =========================================================

function resolvePreferenceConflicts(params: SearchParams) {
  const excludedPreferences =
    params.getAll("exclude_preference");

  for (const excluded of excludedPreferences) {
    removeValue(
      params,
      "quality_preference",
      excluded
    );

    removeValue(
      params,
      "luxury_preference",
      excluded
    );

    removeValue(
      params,
      "sustainability_preference",
      excluded
    );

    removeValue(
      params,
      "romance_preference",
      excluded
    );
  }


  const excludedStyles =
    params.getAll("exclude_style");

  for (const excludedStyle of excludedStyles) {
    removeValue(
      params,
      "luxury_style",
      excludedStyle
    );

    removeValue(
      params,
      "style_preference",
      excludedStyle
    );

    removeValue(
      params,
      "accommodation_style",
      excludedStyle
    );
  }
}


// =========================================================
// "EGAL" / IGNORE-PREFERENCES
// =========================================================

function resolveIgnoredPreferences(params: SearchParams) {
  const ignored =
    params.getAll("ignore_preference");

  if (ignored.includes("pool")) {
    removeValues(params, "feature", [
      "pool",
      "private_pool",
      "indoor_pool",
      "outdoor_pool",
    ]);

    removeValues(params, "amenity", [
      "pool",
      "private_pool",
      "indoor_pool",
      "outdoor_pool",
    ]);
  }


  if (ignored.includes("breakfast")) {
    removeValue(
      params,
      "feature",
      "breakfast"
    );

    removeValue(
      params,
      "board",
      "breakfast"
    );

    removeValue(
      params,
      "board_type",
      "breakfast"
    );

    removeValue(
      params,
      "meal_plan",
      "breakfast"
    );
  }


  if (ignored.includes("parking")) {
    removeValues(params, "feature", [
      "parking",
      "private_parking",
      "garage",
    ]);

    removeValues(params, "amenity", [
      "parking",
      "private_parking",
      "garage",
    ]);
  }


  if (ignored.includes("location")) {
    const locationKeys = [
      "location_feature",
      "location_preference",
      "city_preference",
      "city_feature",
      "nature_location",
      "nature_preference",
      "water_location",
      "luxury_location",
      "sleep_location",
    ];

    for (const key of locationKeys) {
      removeAll(params, key);
    }
  }


  if (
    ignored.includes("accommodation_type")
  ) {
    removeAll(
      params,
      "accommodation_type"
    );

    removeAll(
      params,
      "preferred_accommodation_type"
    );
  }
}


// =========================================================
// REQUIRE-WERTE GEGEN AUSSCHLÜSSE ABSICHERN
// =========================================================

function resolveRequiredPreferences(params: SearchParams) {
  if (
    hasValue(
      params,
      "require_preference",
      "adults_only"
    )
  ) {
    removeValue(
      params,
      "guest_type",
      "family_with_children"
    );

    removeValue(
      params,
      "guest_type",
      "children"
    );

    removeValue(
      params,
      "family_preference",
      "family_friendly"
    );
  }


  if (
    hasValue(
      params,
      "require_feature",
      "smoking_allowed"
    )
  ) {
    removeValue(
      params,
      "exclude_feature",
      "smoking"
    );
  }
}


// =========================================================
// SPEZIELLE WIDERSPRÜCHE
// =========================================================

function resolveSpecialConflicts(params: SearchParams) {
  // "nicht im Stadtzentrum"
  // darf keinen positiven city_center-Wert übrig lassen.

  if (
    hasValue(
      params,
      "exclude_location_preference",
      "city_center"
    )
  ) {
    const keys = [
      "location_feature",
      "location_preference",
      "city_feature",
      "city_preference",
    ];

    for (const key of keys) {
      removeValues(params, key, [
        "city_center",
        "central",
        "central_location",
        "very_central",
        "downtown",
      ]);
    }
  }


  // Kein Hotel:
  // alte Parser können trotzdem allgemeine Hotelwerte setzen.

  if (
    hasValue(
      params,
      "exclude_accommodation_type",
      "hotel"
    )
  ) {
    removeValue(
      params,
      "accommodation_type",
      "hotel"
    );

    removeValue(
      params,
      "type",
      "hotel"
    );
  }


  // Kein Gemeinschaftsbad.

  if (
    hasValue(
      params,
      "exclude_feature",
      "shared_bathroom"
    )
  ) {
    removeValue(
      params,
      "feature",
      "shared_bathroom"
    );

    removeValue(
      params,
      "amenity",
      "shared_bathroom"
    );
  }
}

type SemanticDuplicateRule = {
  sourceKey: string;
  sourceValue: string;
  removeFrom: Array<{
    key: string;
    values: string[];
  }>;
};

const semanticDuplicateRules: SemanticDuplicateRule[] = [
  // =========================================================
  // BESONDERE UNTERKÜNFTE
  // unique_stay_type ist die Hauptquelle.
  // =========================================================

  // ============================================================
  // KANONISCHE DB-FEATURES VOR SEMANTISCHEN DUBLETTEN BEVORZUGEN
  // Wenn das echte feature=... bereits vorhanden ist,
  // werden gleichbedeutende Parser-Parameter entfernt.
  // ============================================================

  {
    sourceKey: "feature",
    sourceValue: "dogs_allowed",
    removeFrom: [
      {
        key: "pet_feature",
        values: ["dogs_allowed"],
      },
    ],
  },

  {
    sourceKey: "feature",
    sourceValue: "parking",
    removeFrom: [
      {
        key: "transport_feature",
        values: ["parking"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "treehouse",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["treehouse"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "tiny_house",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["tiny_house"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "yurt",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["yurt"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "teepee",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["teepee"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "dome",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["dome"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "bubble_tent",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["bubble_tent"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "safari_tent",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["safari_tent"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "shepherd_hut",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["shepherd_hut"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "wagon",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["wagon"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "railway_carriage",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["railway_carriage"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "airplane",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["airplane"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "bus",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["bus"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "container",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["container"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "houseboat",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["houseboat"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "boat",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["boat"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "yacht",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["yacht"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "lighthouse",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["lighthouse"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "windmill",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["windmill"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "watermill",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["watermill"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "cave",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["cave"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "igloo",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["igloo"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "ice_hotel",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["ice_hotel"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "glass_igloo",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["glass_igloo"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "castle",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["castle"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "monastery",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["monastery"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "church",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["church"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "farm",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["farm"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "vineyard",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["vineyard"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "desert_camp",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["desert_camp"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "floating_house",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["floating_house"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "underwater_hotel",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["underwater_hotel"],
      },
    ],
  },

  {
    sourceKey: "unique_stay_type",
    sourceValue: "overwater_bungalow",
    removeFrom: [
      {
        key: "romance_feature",
        values: ["overwater_bungalow"],
      },
    ],
  },

  // =========================================================
  // UNIQUE-STAY-PRÄFERENZ
  // =========================================================

  {
    sourceKey: "unique_stay_preference",
    sourceValue: "unique",
    removeFrom: [
      {
        key: "romance_preference",
        values: ["unique_stay"],
      },
    ],
  },

  // =========================================================
  // RUHE / SCHLAF
  // =========================================================

  {
    sourceKey: "sleep_preference",
    sourceValue: "quiet",
    removeFrom: [
      {
        key: "quality_preference",
        values: ["quiet"],
      },
    ],
  },

  {
    sourceKey: "sleep_preference",
    sourceValue: "very_quiet",
    removeFrom: [
      {
        key: "quality_preference",
        values: ["quiet"],
      },
    ],
  },

  {
    sourceKey: "sleep_feature",
    sourceValue: "soundproof_rooms",
    removeFrom: [
      {
        key: "feature",
        values: ["soundproof", "soundproof_rooms"],
      },
    ],
  },

  // =========================================================
  // ALLGEMEINE AUSSTATTUNG
  // amenity ist die Hauptquelle.
  // =========================================================

  {
    sourceKey: "amenity",
    sourceValue: "washing_machine",
    removeFrom: [
      {
        key: "feature",
        values: ["washing_machine"],
      },
    ],
  },

  {
    sourceKey: "amenity",
    sourceValue: "dishwasher",
    removeFrom: [
      {
        key: "feature",
        values: ["dishwasher"],
      },
    ],
  },

  {
    sourceKey: "amenity",
    sourceValue: "bbq",
    removeFrom: [
      {
        key: "feature",
        values: ["bbq", "grill"],
      },
    ],
  },

  {
    sourceKey: "amenity",
    sourceValue: "balcony",
    removeFrom: [
      {
        key: "feature",
        values: ["balcony"],
      },
    ],
  },

  {
    sourceKey: "amenity",
    sourceValue: "terrace",
    removeFrom: [
      {
        key: "feature",
        values: ["terrace"],
      },
    ],
  },

  // =========================================================
  // HOTEL-SERVICE
  // spezifischer Hotel-Service gewinnt.
  // =========================================================

  {
    sourceKey: "hotel_service",
    sourceValue: "late_check_out",
    removeFrom: [
      {
        key: "feature",
        values: ["late_check_out"],
      },
    ],
  },

  {
    sourceKey: "hotel_service",
    sourceValue: "early_check_in",
    removeFrom: [
      {
        key: "feature",
        values: ["early_check_in"],
      },
    ],
  },

  {
    sourceKey: "hotel_service",
    sourceValue: "self_check_in",
    removeFrom: [
      {
        key: "feature",
        values: ["self_check_in"],
      },
    ],
  },

  {
    sourceKey: "hotel_service",
    sourceValue: "contactless_check_in",
    removeFrom: [
      {
        key: "feature",
        values: ["contactless_check_in"],
      },
    ],
  },

  // =========================================================
  // SECURITY
  // spezifischer Security-Wert gewinnt.
  // =========================================================

  {
    sourceKey: "security_feature",
    sourceValue: "room_safe",
    removeFrom: [
      {
        key: "amenity",
        values: ["safe"],
      },
    ],
  },

  {
    sourceKey: "security_feature",
    sourceValue: "private_entrance",
    removeFrom: [
      {
        key: "amenity",
        values: ["private_entrance"],
      },
    ],
  },

  // =========================================================
  // LUXUS
  // spezifischer Luxus-Wert gewinnt.
  // =========================================================

  {
    sourceKey: "luxury_feature",
    sourceValue: "private_pool",
    removeFrom: [
      {
        key: "feature",
        values: ["private_pool"],
      },
    ],
  },

  {
    sourceKey: "luxury_feature",
    sourceValue: "private_sauna",
    removeFrom: [
      {
        key: "feature",
        values: ["private_sauna"],
      },
    ],
  },

  {
    sourceKey: "luxury_feature",
    sourceValue: "private_hot_tub",
    removeFrom: [
      {
        key: "feature",
        values: ["private_hot_tub"],
      },
    ],
  },
];

function applySemanticDuplicateRules(
  params: SearchParams
) {
  for (const rule of semanticDuplicateRules) {
    if (
      !hasValue(
        params,
        rule.sourceKey,
        rule.sourceValue
      )
    ) {
      continue;
    }

    for (const target of rule.removeFrom) {
      removeValues(
        params,
        target.key,
        target.values
      );
    }
  }
}


// =========================================================
// KONTEXTABHÄNGIGE BEREINIGUNG
// =========================================================

function resolveContextualDuplicates(
  params: SearchParams
) {
  // Long-Stay-spezifische Werte nur behalten,
  // wenn tatsächlich Langzeitaufenthalt erkannt wurde.

  const hasLongStay =
    params.has("stay_type") ||
    params.has("stay_months");

  if (!hasLongStay) {
    removeValues(
      params,
      "long_stay_feature",
      [
        "washing_machine",
        "dryer",
        "full_kitchen",
        "storage",
        "wardrobe",
        "workspace",
        "high_speed_internet",
      ]
    );

    removeValues(
      params,
      "long_stay_service",
      [
        "regular_cleaning",
        "linen_service",
      ]
    );
  }


  // Event-Kapazität nur behalten,
  // wenn auch ein Event erkannt wurde.

  const hasEvent =
    params.has("event_type") ||
    params.has("event_feature") ||
    params.has("event_service");

  if (!hasEvent) {
    params.delete("event_min_capacity");
  }


  // Romantic Trip nur dann als Kontext behalten,
  // wenn wirklich ein romantischer Anlass erkannt wurde.

  const hasRomanticContext =
    params.has("special_occasion") ||
    params.has("romantic_trip") ||
    params.has("romance_service") ||
    params.has("romance_accommodation");

  if (!hasRomanticContext) {
    const romanceFeatures =
      params.getAll("romance_feature");

    const genericRomanceValues = [
      "treehouse",
      "tiny_house",
      "castle",
      "glamping",
      "unique_stay",
    ];

    const cleaned = romanceFeatures.filter(
      (value) =>
        !genericRomanceValues.includes(value)
    );

    params.delete("romance_feature");

    for (const value of cleaned) {
      params.append(
        "romance_feature",
        value
      );
    }
  }
}


// =========================================================
// SEMANTISCHE DUBLETTEN ZENTRAL AUFLÖSEN
// =========================================================

function resolveSemanticDuplicates(
  params: SearchParams
) {
  applySemanticDuplicateRules(params);
  resolveContextualDuplicates(params);
}

type CanonicalRule = {
  canonicalKey: string;
  canonicalValue: string;
  sources: Array<{
    key: string;
    values: string[];
  }>;
};

const canonicalRules: CanonicalRule[] = [
  // =========================================================
  // POOL
  // =========================================================

  // =========================================================
// WLAN – weitere alte Parser
// =========================================================

{
  canonicalKey: "feature",
  canonicalValue: "wifi",
  sources: [
    { key: "digital_feature", values: ["wifi", "wlan"] },
  ],
},

// =========================================================
// PRIVATPOOL – weitere alte Parser
// =========================================================

{
  canonicalKey: "feature",
  canonicalValue: "private_pool",
  sources: [
    { key: "leisure_feature", values: ["private_pool"] },
  ],
},

// =========================================================
// GENERISCHER POOL
// =========================================================

{
  canonicalKey: "feature",
  canonicalValue: "pool",
  sources: [
    { key: "leisure_feature", values: ["pool"] },
  ],
},

// =========================================================
// MEERBLICK – weitere alte Parser
// =========================================================

{
  canonicalKey: "feature",
  canonicalValue: "sea_view",
  sources: [
    { key: "romance_view", values: ["sea_view"] },
  ],
},

  {
    canonicalKey: "feature",
    canonicalValue: "private_pool",
    sources: [
      { key: "luxury_feature", values: ["private_pool"] },
      { key: "romance_feature", values: ["private_pool"] },
      { key: "amenity", values: ["private_pool"] },
    ],
  },

  {
    canonicalKey: "feature",
    canonicalValue: "indoor_pool",
    sources: [
      { key: "climate_feature", values: ["indoor_pool"] },
      { key: "wellness_feature", values: ["indoor_pool"] },
      { key: "amenity", values: ["indoor_pool"] },
    ],
  },

  {
    canonicalKey: "feature",
    canonicalValue: "outdoor_pool",
    sources: [
      { key: "amenity", values: ["outdoor_pool"] },
      { key: "wellness_feature", values: ["outdoor_pool"] },
    ],
  },

  // =========================================================
  // SAUNA / SPA / FITNESS
  // =========================================================

  {
    canonicalKey: "feature",
    canonicalValue: "sauna",
    sources: [
      { key: "luxury_feature", values: ["private_sauna"] },
      { key: "romance_feature", values: ["private_sauna"] },
      { key: "wellness_feature", values: ["sauna"] },
      { key: "amenity", values: ["sauna"] },
    ],
  },

  {
    canonicalKey: "feature",
    canonicalValue: "spa",
    sources: [
      { key: "luxury_feature", values: ["private_spa"] },
      { key: "wellness_feature", values: ["spa", "wellness"] },
      { key: "amenity", values: ["spa"] },
    ],
  },

  {
    canonicalKey: "feature",
    canonicalValue: "gym",
    sources: [
      { key: "luxury_feature", values: ["private_gym"] },
      { key: "wellness_feature", values: ["gym", "fitness"] },
      { key: "amenity", values: ["gym"] },
    ],
  },

  // =========================================================
  // WLAN / INTERNET
  // =========================================================

  {
    canonicalKey: "feature",
    canonicalValue: "wifi",
    sources: [
      { key: "amenity", values: ["wifi", "wlan"] },
      { key: "business_feature", values: ["wifi", "fast_wifi"] },
      { key: "long_stay_feature", values: ["high_speed_internet"] },
    ],
  },

  // =========================================================
  // WASCHMASCHINE / SPÜLMASCHINE
  // =========================================================

  {
    canonicalKey: "feature",
    canonicalValue: "washing_machine",
    sources: [
      { key: "amenity", values: ["washing_machine"] },
      { key: "long_stay_feature", values: ["washing_machine"] },
    ],
  },

  {
    canonicalKey: "feature",
    canonicalValue: "dishwasher",
    sources: [
      { key: "amenity", values: ["dishwasher"] },
      { key: "long_stay_feature", values: ["dishwasher"] },
    ],
  },

  // =========================================================
  // BALKON / TERRASSE / GARTEN
  // =========================================================

  {
    canonicalKey: "feature",
    canonicalValue: "balcony",
    sources: [
      { key: "amenity", values: ["balcony"] },
      { key: "romance_feature", values: ["private_balcony"] },
    ],
  },

  {
    canonicalKey: "feature",
    canonicalValue: "terrace",
    sources: [
      { key: "amenity", values: ["terrace"] },
      { key: "romance_feature", values: ["private_terrace"] },
      { key: "climate_feature", values: ["sunny_terrace", "covered_terrace"] },
    ],
  },

  {
    canonicalKey: "feature",
    canonicalValue: "garden",
    sources: [
      { key: "amenity", values: ["private_garden"] },
      { key: "romance_feature", values: ["private_garden"] },
    ],
  },

  // =========================================================
  // KLIMAANLAGE / KAMIN
  // =========================================================

  {
    canonicalKey: "feature",
    canonicalValue: "air_conditioning",
    sources: [
      { key: "climate_feature", values: ["air_conditioning"] },
      { key: "amenity", values: ["air_conditioning"] },
    ],
  },

  {
    canonicalKey: "feature",
    canonicalValue: "fireplace",
    sources: [
      { key: "climate_feature", values: ["fireplace"] },
      { key: "amenity", values: ["fireplace"] },
      { key: "romance_feature", values: ["fireplace"] },
    ],
  },

  // =========================================================
  // CHECK-IN / CHECK-OUT
  // =========================================================

  {
    canonicalKey: "service",
    canonicalValue: "self_check_in",
    sources: [
      { key: "hotel_service", values: ["self_check_in"] },
      { key: "security_service", values: ["self_check_in"] },
      { key: "feature", values: ["self_check_in"] },
    ],
  },

  {
    canonicalKey: "service",
    canonicalValue: "contactless_check_in",
    sources: [
      { key: "hotel_service", values: ["contactless_check_in"] },
      { key: "security_service", values: ["contactless_check_in"] },
      { key: "feature", values: ["contactless_check_in"] },
    ],
  },

  {
    canonicalKey: "service",
    canonicalValue: "late_check_out",
    sources: [
      { key: "hotel_service", values: ["late_check_out"] },
      { key: "feature", values: ["late_check_out"] },
    ],
  },

  // =========================================================
  // PARKPLATZ / GARAGE
  // =========================================================

  {
    canonicalKey: "feature",
    canonicalValue: "parking",
    sources: [
      { key: "amenity", values: ["parking"] },
      { key: "security_feature", values: ["guarded_parking", "gated_parking"] },
      { key: "mobility_feature", values: ["parking"] },
    ],
  },

  {
    canonicalKey: "feature",
    canonicalValue: "garage",
    sources: [
      { key: "amenity", values: ["garage"] },
      { key: "luxury_feature", values: ["private_garage"] },
    ],
  },

  // =========================================================
  // STRAND / MEER / SEE
  // =========================================================

  {
    canonicalKey: "feature",
    canonicalValue: "near_beach",
    sources: [
      { key: "location_feature", values: ["near_beach", "beachfront"] },
      { key: "water_location", values: ["near_beach", "beachfront"] },
    ],
  },

  {
    canonicalKey: "feature",
    canonicalValue: "near_sea",
    sources: [
      { key: "location_feature", values: ["near_sea", "seafront"] },
      { key: "water_location", values: ["near_sea", "seafront"] },
    ],
  },

  {
    canonicalKey: "feature",
    canonicalValue: "near_lake",
    sources: [
      { key: "location_feature", values: ["near_lake", "lakefront"] },
      { key: "water_location", values: ["near_lake", "lakefront"] },
    ],
  },

  // =========================================================
  // AUSSICHT
  // =========================================================

  {
    canonicalKey: "feature",
    canonicalValue: "sea_view",
    sources: [
      { key: "luxury_view", values: ["sea_view"] },
      { key: "water_view", values: ["sea_view"] },
      { key: "location_feature", values: ["sea_view"] },
      { key: "romance_feature", values: ["sea_view"] },
    ],
  },

  {
    canonicalKey: "feature",
    canonicalValue: "mountain_view",
    sources: [
      { key: "luxury_view", values: ["mountain_view"] },
      { key: "nature_feature", values: ["mountain_view"] },
      { key: "location_feature", values: ["mountain_view"] },
      { key: "romance_feature", values: ["mountain_view"] },
    ],
  },

  {
    canonicalKey: "feature",
    canonicalValue: "lake_view",
    sources: [
      { key: "water_view", values: ["lake_view"] },
      { key: "location_feature", values: ["lake_view"] },
      { key: "romance_feature", values: ["lake_view"] },
    ],
  },

  // =========================================================
  // FRÜHSTÜCK
  // =========================================================

  {
    canonicalKey: "feature",
    canonicalValue: "breakfast",
    sources: [
      { key: "food_feature", values: ["breakfast"] },
      { key: "meal_plan", values: ["breakfast"] },
      { key: "board_type", values: ["breakfast"] },
    ],
  },
];

function applyCanonicalRules(params: SearchParams) {
  for (const rule of canonicalRules) {
    let matched = false;

    for (const source of rule.sources) {
      if (
        source.values.some((value) =>
          params.getAll(source.key).includes(value)
        )
      ) {
        matched = true;
      }
    }

    if (!matched) {
      continue;
    }

    if (
      !params
        .getAll(rule.canonicalKey)
        .includes(rule.canonicalValue)
    ) {
      params.append(
        rule.canonicalKey,
        rule.canonicalValue
      );
    }

    for (const source of rule.sources) {
      if (source.key === rule.canonicalKey) {
        continue;
      }

      removeValues(
        params,
        source.key,
        source.values
      );
    }
  }
}

// =========================================================
// SEMANTISCHE FEHLTREFFER BEREINIGEN
// =========================================================

function resolveSemanticFalsePositives(
  params: SearchParams
) {
  const features = params.getAll("feature");

  // ---------------------------------------------------------
  // MEERBLICK ist nicht automatisch MEERNÄHE
  //
  // Wenn sea_view erkannt wurde und near_sea nur als
  // Nebenprodukt eines anderen Parsers entstanden ist,
  // entfernen wir near_sea.
  // ---------------------------------------------------------

  if (
    features.includes("sea_view") &&
    features.includes("near_sea")
  ) {
    removeValue(params, "feature", "near_sea");
  }

  // ---------------------------------------------------------
  // SEEBLICK ist nicht automatisch SEENÄHE
  // ---------------------------------------------------------

  if (
    features.includes("lake_view") &&
    features.includes("near_lake")
  ) {
    removeValue(params, "feature", "near_lake");
  }

  // ---------------------------------------------------------
  // BERGBLICK ist nicht automatisch BERGLAGE
  // ---------------------------------------------------------

  if (
    features.includes("mountain_view") &&
    features.includes("mountain_location")
  ) {
    removeValue(
      params,
      "feature",
      "mountain_location"
    );
  }
}

function resolveSpecificFeatureHierarchy(
  params: SearchParams
) {
  if (
    params.getAll("feature").includes("private_pool")
  ) {
    removeValue(params, "feature", "pool");
  }

  if (
    params.getAll("feature").includes("private_sauna")
  ) {
    removeValue(params, "feature", "sauna");
  }

  if (
    params.getAll("feature").includes("private_spa")
  ) {
    removeValue(params, "feature", "spa");
  }
}

// =========================================================
// ÖFFENTLICHE HAUPTFUNKTION
// =========================================================

export function cleanupSearchParams(
  params: URLSearchParams
) {
  resolveAccommodationConflicts(params);
  resolveLocationConflicts(params);
  resolveFeatureConflicts(params);
  resolveBoardConflicts(params);
  resolvePreferenceConflicts(params);
  resolveIgnoredPreferences(params);
  resolveRequiredPreferences(params);
  resolveSpecialConflicts(params);

  resolveSemanticDuplicates(params);

  applyCanonicalRules(params);
  resolveSpecificFeatureHierarchy(params);
  resolveSemanticFalsePositives(params);

  removeDuplicates(params);
}