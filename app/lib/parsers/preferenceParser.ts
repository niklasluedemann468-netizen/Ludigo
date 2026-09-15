export function parsePreferences(
  normalizedText: string,
  params: URLSearchParams
) {
  const featureTerms: Record<string, string[]> = {
    wifi: ["wlan", "wifi"],
    pool: ["pool", "schwimmbad"],
    sauna: ["sauna"],
    parking: ["parkplatz", "parken"],
    breakfast: ["frühstück", "fruehstueck"],
    dogs_allowed: [
      "hund erlaubt",
      "hunde erlaubt",
      "hundefreundlich",
    ],
    near_sea: [
      "am meer",
      "meernähe",
      "meernaehe",
    ],
    near_lake: [
      "am see",
      "seenähe",
      "seenaehe",
    ],
    kitchen: ["küche", "kueche"],
    balcony: ["balkon"],
    washing_machine: [
      "waschmaschine",
    ],
    air_conditioning: [
      "klimaanlage",
    ],
  };

  const hasAny = (
    source: string,
    terms: string[]
  ) =>
    terms.some((term) =>
      source.includes(term)
    );

  const mustSignals = [
    "muss",
    "unbedingt",
    "zwingend",
    "auf jeden fall",
    "ist pflicht",
    "brauche",
    "benötige",
    "benoetige",
  ];

  const preferredSignals = [
    "wäre schön",
    "waere schoen",
    "wäre gut",
    "waere gut",
    "am liebsten",
    "gern",
    "gerne",
    "bevorzugt",
    "wenn möglich",
    "wenn moeglich",
    "idealerweise",
  ];

  const hasMustSignal =
    hasAny(
      normalizedText,
      mustSignals
    );

  const hasPreferredSignal =
    hasAny(
      normalizedText,
      preferredSignals
    );

  for (const [featureKey, terms] of Object.entries(
    featureTerms
  )) {
    const featureMentioned =
      hasAny(
        normalizedText,
        terms
      );

    if (!featureMentioned) {
      continue;
    }

    if (hasMustSignal) {
      params.append(
        "must_feature",
        featureKey
      );
      continue;
    }

    if (hasPreferredSignal) {
      params.append(
        "preferred_feature",
        featureKey
      );
    }
  }
}