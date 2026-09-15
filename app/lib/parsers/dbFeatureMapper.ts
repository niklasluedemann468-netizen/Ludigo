type SearchParams = URLSearchParams;


// =========================================================
// PARSER-PARAMETER → DB-FEATURES
//
// Ziel:
// Unterschiedliche Parser können dieselbe reale Ausstattung
// unter verschiedenen Parametergruppen erkennen.
//
// Vor der DB-Abfrage führen wir nur eindeutig DB-taugliche
// Eigenschaften zu "feature=..." zusammen.
// =========================================================

type FeatureMapping = {
  sourceKey: string;
  sourceValues: Record<string, string>;
};


// =========================================================
// MAPPING-TABELLE
// =========================================================

const featureMappings: FeatureMapping[] = [
  // ---------------------------------------------------------
  // ALLGEMEINE AUSSTATTUNG
  // ---------------------------------------------------------

  {
    sourceKey: "amenity",
    sourceValues: {
      wifi: "wifi",
      wlan: "wifi",

      balcony: "balcony",
      terrace: "terrace",
      private_garden: "garden",
      garden: "garden",

      kitchen: "kitchen",
      kitchenette: "kitchenette",

      washing_machine: "washing_machine",
      dishwasher: "dishwasher",

      bbq: "bbq",
      grill: "bbq",

      tv: "tv",
      smart_tv: "tv",

      fireplace: "fireplace",

      air_conditioning: "air_conditioning",

      elevator: "elevator",

      parking: "parking",
      garage: "parking",
    },
  },


  // ---------------------------------------------------------
  // WELLNESS / FREIZEIT
  // ---------------------------------------------------------

  {
    sourceKey: "wellness_feature",
    sourceValues: {
      pool: "pool",
      indoor_pool: "indoor_pool",
      outdoor_pool: "outdoor_pool",

      sauna: "sauna",

      spa: "spa",
      wellness: "spa",

      gym: "gym",
      fitness: "gym",
      fitness_room: "gym",
    },
  },

  {
    sourceKey: "leisure_feature",
    sourceValues: {
      pool: "pool",
      private_pool: "private_pool",
      indoor_pool: "indoor_pool",
      outdoor_pool: "outdoor_pool",

      sauna: "sauna",
      spa: "spa",

      gym: "gym",
      fitness: "gym",
    },
  },


  // ---------------------------------------------------------
  // LUXUS-AUSSTATTUNG
  // ---------------------------------------------------------

  {
    sourceKey: "luxury_feature",
    sourceValues: {
      private_pool: "private_pool",
      infinity_pool: "pool",
      rooftop_pool: "pool",

      private_sauna: "sauna",
      private_spa: "spa",
      private_gym: "gym",

      private_garage: "parking",

      private_entrance: "private_entrance",
    },
  },


  // ---------------------------------------------------------
  // ROMANTIK
  // ---------------------------------------------------------

  {
    sourceKey: "romance_feature",
    sourceValues: {
      private_pool: "private_pool",
      private_sauna: "sauna",

      fireplace: "fireplace",

      private_balcony: "balcony",
      private_terrace: "terrace",
      private_garden: "garden",

      sea_view: "sea_view",
      lake_view: "lake_view",
      mountain_view: "mountain_view",
    },
  },


  // ---------------------------------------------------------
  // KLIMA
  // ---------------------------------------------------------

  {
    sourceKey: "climate_feature",
    sourceValues: {
      air_conditioning: "air_conditioning",

      fireplace: "fireplace",

      heated_pool: "pool",
      indoor_pool: "indoor_pool",

      sunny_balcony: "balcony",
      sunny_terrace: "terrace",
      covered_terrace: "terrace",
    },
  },


  // ---------------------------------------------------------
  // DIGITALES / BUSINESS
  // ---------------------------------------------------------

  {
    sourceKey: "digital_feature",
    sourceValues: {
      wifi: "wifi",
      wlan: "wifi",
      fast_wifi: "wifi",
    },
  },

  {
    sourceKey: "business_feature",
    sourceValues: {
      wifi: "wifi",
      fast_wifi: "wifi",
      high_speed_internet: "wifi",
    },
  },


  // ---------------------------------------------------------
  // LANGZEITAUFENTHALT
  // ---------------------------------------------------------

  {
    sourceKey: "long_stay_feature",
    sourceValues: {
      washing_machine: "washing_machine",
      dishwasher: "dishwasher",

      full_kitchen: "kitchen",
      kitchenette: "kitchenette",

      high_speed_internet: "wifi",
    },
  },


  // ---------------------------------------------------------
  // FAMILIEN
  // ---------------------------------------------------------

  {
    sourceKey: "family_feature",
    sourceValues: {
      kitchen: "kitchen",
      kitchenette: "kitchenette",

      washing_machine: "washing_machine",

      garden: "garden",
      private_garden: "garden",
    },
  },


  // ---------------------------------------------------------
  // HAUSTIERE
  // ---------------------------------------------------------

  {
    sourceKey: "pet_feature",
    sourceValues: {
      dogs_allowed: "dogs_allowed",
      dog_friendly: "dogs_allowed",

      pets_allowed: "pets",
      pet_friendly: "pets",
    },
  },


  // ---------------------------------------------------------
  // MOBILITÄT
  // ---------------------------------------------------------

  {
    sourceKey: "mobility_feature",
    sourceValues: {
      parking: "parking",
      private_parking: "parking",
      garage: "parking",

      elevator: "elevator",

      wheelchair_accessible: "wheelchair_accessible",
    },
  },


  // ---------------------------------------------------------
  // BARRIEREFREIHEIT
  // ---------------------------------------------------------

  {
    sourceKey: "accessibility_feature",
    sourceValues: {
      wheelchair_accessible: "wheelchair_accessible",
      elevator: "elevator",
    },
  },


  // ---------------------------------------------------------
  // ESSEN / VERPFLEGUNG
  // ---------------------------------------------------------

  {
    sourceKey: "food_feature",
    sourceValues: {
      breakfast: "breakfast",

      kitchen: "kitchen",
      kitchenette: "kitchenette",
    },
  },


  // ---------------------------------------------------------
  // WASSER / LAGE
  // ---------------------------------------------------------

  {
    sourceKey: "water_feature",
    sourceValues: {
      near_sea: "near_sea",
      near_lake: "near_lake",

      sea_view: "sea_view",
      lake_view: "lake_view",

      private_pool: "private_pool",
      pool: "pool",
    },
  },

  {
    sourceKey: "water_location",
    sourceValues: {
      near_sea: "near_sea",
      seafront: "near_sea",

      near_lake: "near_lake",
      lakefront: "near_lake",
    },
  },

  {
    sourceKey: "water_view",
    sourceValues: {
      sea_view: "sea_view",
      lake_view: "lake_view",
    },
  },


  // ---------------------------------------------------------
  // NORMALE LOCATION-FEATURES
  // ---------------------------------------------------------

  {
    sourceKey: "location_feature",
    sourceValues: {
      near_sea: "near_sea",
      near_lake: "near_lake",

      sea_view: "sea_view",
      lake_view: "lake_view",
      mountain_view: "mountain_view",
    },
  },


  // ---------------------------------------------------------
  // NATUR
  // ---------------------------------------------------------

  {
    sourceKey: "nature_feature",
    sourceValues: {
      mountain_view: "mountain_view",
    },
  },


  // ---------------------------------------------------------
  // AUSSICHT
  // ---------------------------------------------------------

  {
    sourceKey: "luxury_view",
    sourceValues: {
      sea_view: "sea_view",
      lake_view: "lake_view",
      mountain_view: "mountain_view",
    },
  },

  {
    sourceKey: "romance_view",
    sourceValues: {
      sea_view: "sea_view",
      lake_view: "lake_view",
      mountain_view: "mountain_view",
    },
  },


  // ---------------------------------------------------------
  // SECURITY
  //
  // Nur Werte, die bereits zu allgemeinen Features passen.
  // Spezielle Sicherheitsmerkmale bleiben vorerst semantisch.
  // ---------------------------------------------------------

  {
    sourceKey: "security_feature",
    sourceValues: {
      private_entrance: "private_entrance",

      secure_underground_parking: "parking",
      guarded_parking: "parking",
      gated_parking: "parking",
    },
  },
];


// =========================================================
// FEATURE EINMALIG HINZUFÜGEN
// =========================================================

function appendUniqueFeature(
  params: SearchParams,
  feature: string
) {
  const existingFeatures = params.getAll("feature");

  if (!existingFeatures.includes(feature)) {
    params.append("feature", feature);
  }
}


// =========================================================
// DIREKTE LEGACY-PARAMETER AUCH ANGLEICHEN
// =========================================================

function mapLegacyParameters(
  params: SearchParams
) {
  if (params.get("has_pool") === "true") {
    appendUniqueFeature(params, "pool");
  }

  if (params.get("dogs_allowed") === "true") {
    appendUniqueFeature(params, "dogs_allowed");
  }

  if (params.get("near_sea") === "true") {
    appendUniqueFeature(params, "near_sea");
  }

  if (params.get("near_lake") === "true") {
    appendUniqueFeature(params, "near_lake");
  }
}


// =========================================================
// SEMANTISCHE PARAMETER AUF FEATURE MAPPEN
// =========================================================

function mapSemanticFeatures(
  params: SearchParams
) {
  for (const mapping of featureMappings) {
    const sourceValues = params.getAll(
      mapping.sourceKey
    );

    for (const sourceValue of sourceValues) {
      const mappedFeature =
        mapping.sourceValues[sourceValue];

      if (!mappedFeature) {
        continue;
      }

      appendUniqueFeature(
        params,
        mappedFeature
      );
    }
  }
}


// =========================================================
// SPEZIFISCHE FEATURE-HIERARCHIEN
// =========================================================

function resolveMappedFeatureHierarchy(
  params: SearchParams
) {
  const features = params.getAll("feature");

  // Privater Pool ist spezifischer als allgemeiner Pool.
  if (
    features.includes("private_pool") &&
    features.includes("pool")
  ) {
    const remaining = params
      .getAll("feature")
      .filter((value) => value !== "pool");

    params.delete("feature");

    for (const value of remaining) {
      params.append("feature", value);
    }
  }
}


// =========================================================
// ÖFFENTLICHE FUNKTION
// =========================================================

export function mapSearchParamsToDbFeatures(
  params: URLSearchParams
) {
  mapLegacyParameters(params);
  mapSemanticFeatures(params);
  resolveMappedFeatureHierarchy(params);
}