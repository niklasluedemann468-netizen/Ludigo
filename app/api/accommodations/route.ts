import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const type = searchParams.get("type");
  const nearSea = searchParams.get("near_sea");
  const nearLake = searchParams.get("near_lake");
  const nearMountains = searchParams.get("near_mountains");
  const dogsAllowed = searchParams.get("dogs_allowed");
  const hasPool = searchParams.get("has_pool");
  const month = searchParams.get("month");
  // ============================================================
// FEATURES: NORMAL / PFLICHT / WUNSCH
// ============================================================

const features =
  searchParams.getAll("feature");

const mustFeatures =
  searchParams.getAll("must_feature");

const preferredFeatures =
  searchParams.getAll("preferred_feature");

// Wenn z. B. "Pool wäre schön" sowohl
// feature=pool als auch preferred_feature=pool erzeugt,
// darf Pool NICHT zum harten Filter werden.
//
// Muss-Kriterien bleiben dagegen immer harte Filter.

const hardFeatures = [
  ...new Set([
    ...features.filter(
      (feature) =>
        !preferredFeatures.includes(feature) ||
        mustFeatures.includes(feature)
    ),
    ...mustFeatures,
  ]),
];
  const country = searchParams.get("country");
  const region = searchParams.get("region");
  const city = searchParams.get("city");
  // ============================================================
// ZAHLEN- UND BEREICHSFILTER
// ============================================================

// Gäste / benötigte Kapazität
const maxGuests =
  searchParams.get("max_guests");

// Preis pro Nacht
const minPrice =
  searchParams.get("min_price_per_night") ??
  searchParams.get("min_price");

const maxPrice =
  searchParams.get("max_price_per_night") ??
  searchParams.get("max_price");

// Bewertung
const reviewScore =
  searchParams.get("review_score");

const minReviewScore =
  searchParams.get("min_review_score");

const maxReviewScore =
  searchParams.get("max_review_score");

// Hotelsterne
const hotelStars =
  searchParams.get("hotel_stars");

const minHotelStars =
  searchParams.get("min_hotel_stars");

const maxHotelStars =
  searchParams.get("max_hotel_stars");

// Schlafzimmer
const bedrooms =
  searchParams.get("bedrooms");

const minBedrooms =
  searchParams.get("min_bedrooms");

const maxBedrooms =
  searchParams.get("max_bedrooms");


  const supabase = await createClient();

// ============================================================
// FEATURE-KEYS AUFLÖSEN
// ============================================================

// Doppelte Features aus der URL entfernen.
// Beispiel:
// feature=wifi&feature=wifi
// wird intern nur einmal behandelt.
const uniqueFeatures = [...new Set(features)];

let featureIds: number[] = [];

// ============================================================
// HARTE FEATURES AUFLÖSEN
// ============================================================

if (hardFeatures.length > 0) {
  const { data: featureRows, error: featureError } =
    await supabase
      .from("features")
      .select("id, key")
      .in("key", hardFeatures);

  if (featureError) {
    return Response.json(
      { error: featureError.message },
      { status: 500 }
    );
  }

  // Prüfen, ob wirklich alle angefragten Features
  // in unserer Feature-Tabelle existieren.
  const foundFeatureKeys = new Set(
    (featureRows ?? []).map(
      (feature) => feature.key
    )
  );

  const missingFeatures =
    hardFeatures.filter(
      (feature) =>
        !foundFeatureKeys.has(feature)
    );

  // Ein unbekanntes MUSS-Kriterium darf nicht
  // einfach ignoriert werden und falsche Treffer erzeugen.
  if (missingFeatures.length > 0) {
  console.warn(
    "Unbekannte Feature-Keys:",
    missingFeatures
  );

  return Response.json({
    accommodations: [],
    missing_features: missingFeatures,
  });
}

  featureIds = (featureRows ?? []).map(
    (feature) => feature.id
  );
}

let matchingAccommodationIds: number[] | null = null;

if (featureIds.length > 0) {
  const { data: links, error: linksError } = await supabase
    .from("accommodation_features")
    .select("accommodation_id, feature_id")
    .in("feature_id", featureIds);

  if (linksError) {
    return Response.json(
      { error: linksError.message },
      { status: 500 }
    );
  }

  const counts = new Map<number, number>();

  for (const link of links ?? []) {
    counts.set(
      link.accommodation_id,
      (counts.get(link.accommodation_id) ?? 0) + 1
    );
  }

  matchingAccommodationIds = [...counts.entries()]
    .filter(([, count]) => count === featureIds.length)
    .map(([accommodationId]) => accommodationId);
}


  let query = supabase
    .from("accommodations")
    .select(`
  id,
  name,
  city,
  country,
  region,
  accommodation_type,
  image_url,
  price_min,
  price_max,
  is_featured,
  currency,
  review_score,
  hotel_stars,
  apartment_has_kitchen,
  apartment_has_washing_machine,
  max_guests,
  has_pool,
has_wifi,
has_parking,
has_restaurant,
has_breakfast,
has_air_conditioning,
dogs_allowed,
family_friendly,
accessible,
quiet_place,
near_sea,
near_lake,
near_mountains,
apartment_has_kitchen,
apartment_has_washing_machine,
  affiliate_url,
  booking_url,
  website_url
  
`)
    .eq("is_active", true);

  if (matchingAccommodationIds !== null) {
  if (matchingAccommodationIds.length === 0) {
    return Response.json({
      accommodations: [],
    });
  }

  query = query.in("id", matchingAccommodationIds);
}

  if (type) {
    query = query.eq("accommodation_type", type);
  }

  if (nearSea === "true") {
    query = query.eq("near_sea", true);
  }

  if (nearLake === "true") {
    query = query.eq("near_lake", true);
  }

  if (nearMountains === "true") {
    query = query.eq("near_mountains", true);
  }

  if (dogsAllowed === "true") {
    query = query.eq("dogs_allowed", true);
  }

  if (hasPool === "true") {
    query = query.eq("has_pool", true);
  }
  
  // ============================================================
// ZAHLEN- UND BEREICHSFILTER ANWENDEN
// ============================================================

// Gäste / benötigte Kapazität
if (maxGuests) {
  query = query.gte(
    "max_guests",
    Number(maxGuests)
  );
}

// Bewertung
if (reviewScore) {
  query = query.eq(
    "review_score",
    Number(reviewScore)
  );
}

if (minReviewScore) {
  query = query.gte(
    "review_score",
    Number(minReviewScore)
  );
}

if (maxReviewScore) {
  query = query.lte(
    "review_score",
    Number(maxReviewScore)
  );
}

// Hotelsterne
if (hotelStars) {
  query = query.eq(
    "hotel_stars",
    Number(hotelStars)
  );
}

if (minHotelStars) {
  query = query.gte(
    "hotel_stars",
    Number(minHotelStars)
  );
}

if (maxHotelStars) {
  query = query.lte(
    "hotel_stars",
    Number(maxHotelStars)
  );
}

// Schlafzimmer
if (bedrooms) {
  query = query.eq(
    "apartment_bedrooms",
    Number(bedrooms)
  );
}

if (minBedrooms) {
  query = query.gte(
    "apartment_bedrooms",
    Number(minBedrooms)
  );
}

if (maxBedrooms) {
  query = query.lte(
    "apartment_bedrooms",
    Number(maxBedrooms)
  );
}

// Preis pro Nacht
if (minPrice) {
  query = query.gte(
    "price_min",
    Number(minPrice)
  );
}

if (maxPrice) {
  query = query.lte(
    "price_min",
    Number(maxPrice)
  );
}

  if (month) {
  query = query.contains("available_months", [Number(month)]);
}

if (country) {
  query = query.ilike("country", country);
}

if (region) {
  query = query.ilike("region", region);
}

if (city) {
  query = query.ilike("city", city);
}


  const { data, error } = await query;

if (error) {
  return Response.json(
    { error: error.message },
    { status: 500 }
  );
}

// ============================================================
// WUNSCHFEATURES FÜR DAS RANKING
// ============================================================

const preferredFeatureMatches =
  new Map<number, number>();

if (
  preferredFeatures.length > 0 &&
  (data ?? []).length > 0
) {
  const uniquePreferredFeatures = [
    ...new Set(preferredFeatures),
  ];

  const {
    data: preferredFeatureRows,
    error: preferredFeatureError,
  } = await supabase
    .from("features")
    .select("id, key")
    .in("key", uniquePreferredFeatures);

  if (preferredFeatureError) {
    return Response.json(
      {
        error:
          preferredFeatureError.message,
      },
      { status: 500 }
    );
  }

  const preferredFeatureIds =
    (preferredFeatureRows ?? []).map(
      (feature) => feature.id
    );

  if (preferredFeatureIds.length > 0) {
    const accommodationIds =
      (data ?? []).map(
        (item) => item.id
      );

    const {
      data: preferredLinks,
      error: preferredLinksError,
    } = await supabase
      .from("accommodation_features")
      .select(
        "accommodation_id, feature_id"
      )
      .in(
        "accommodation_id",
        accommodationIds
      )
      .in(
        "feature_id",
        preferredFeatureIds
      );

    if (preferredLinksError) {
      return Response.json(
        {
          error:
            preferredLinksError.message,
        },
        { status: 500 }
      );
    }

    // Set verhindert Doppelzählungen eines Features.
    const matchesByAccommodation =
      new Map<number, Set<number>>();

    for (const link of preferredLinks ?? []) {
      if (
        !matchesByAccommodation.has(
          link.accommodation_id
        )
      ) {
        matchesByAccommodation.set(
          link.accommodation_id,
          new Set<number>()
        );
      }

      matchesByAccommodation
        .get(link.accommodation_id)!
        .add(link.feature_id);
    }

    for (
      const [
        accommodationId,
        matchedFeatures,
      ] of matchesByAccommodation
    ) {
      preferredFeatureMatches.set(
        accommodationId,
        matchedFeatures.size
      );
    }
  }
}

// ============================================================
// MATCH-RANKING
// ============================================================

const requestedGuests = maxGuests
  ? Number(maxGuests)
  : null;

const requestedMaxPrice = maxPrice
  ? Number(maxPrice)
  : null;

const rankedAccommodations = [...(data ?? [])]
  .map((item, originalIndex) => {
    let score = 0;

    // --------------------------------------------------------
// Wunschkriterien
//
// Wunschfeature vorhanden = Bonus.
// Unterkunft wird NICHT ausgeschlossen, wenn es fehlt.
// --------------------------------------------------------

const matchedPreferredFeatures =
  preferredFeatureMatches.get(
    item.id
  ) ?? 0;

score +=
  matchedPreferredFeatures * 12;

    // --------------------------------------------------------
    // 1. Besonders empfohlene Unterkünfte
    // --------------------------------------------------------

    if (item.is_featured) {
      score += 20;
    }

    // --------------------------------------------------------
    // 2. Bewertung
    // Bewertung ist einer der wichtigsten Qualitätsfaktoren.
    // Beispiel:
    // 8,5 Punkte = 25,5 Rankingpunkte
    // --------------------------------------------------------

    if (
      item.review_score !== null &&
      item.review_score !== undefined
    ) {
      score += Number(item.review_score) * 3;
    }

    // --------------------------------------------------------
    // 3. Hotelsterne
    // Nur kleiner Bonus, damit Sterne nicht wichtiger werden
    // als echte Gästebewertungen.
    // --------------------------------------------------------

    if (
      item.hotel_stars !== null &&
      item.hotel_stars !== undefined
    ) {
      score += Number(item.hotel_stars) * 2;
    }

    // --------------------------------------------------------
    // 4. Gäste-Kapazität
    //
    // Wenn z. B. 4 Gäste gesucht werden:
    // Unterkunft für genau 4 Personen wird gegenüber einer
    // Unterkunft für 10 Personen leicht bevorzugt.
    // --------------------------------------------------------

    if (
      requestedGuests !== null &&
      item.max_guests !== null &&
      item.max_guests !== undefined
    ) {
      const capacityDifference =
        Number(item.max_guests) - requestedGuests;

      if (capacityDifference === 0) {
        score += 10;
      } else if (capacityDifference > 0) {
        score += Math.max(
          0,
          8 - capacityDifference
        );
      }
    }

    // --------------------------------------------------------
    // 5. Preis innerhalb des Maximalbudgets
    //
    // Günstigere Treffer bekommen einen kleinen Bonus.
    // Der Preis soll aber nicht stärker zählen als Bewertung.
    // --------------------------------------------------------

    if (
      requestedMaxPrice !== null &&
      requestedMaxPrice > 0 &&
      item.price_min !== null &&
      item.price_min !== undefined
    ) {
      const price = Number(item.price_min);

      if (price <= requestedMaxPrice) {
        const priceRatio =
          price / requestedMaxPrice;

        score +=
          Math.max(
            0,
            1 - priceRatio
          ) * 10;
      }
    }

    return {
      item,
      score,
      originalIndex,
    };
  })
  .sort((a, b) => {
    // Höherer Score zuerst
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    // Bei gleichem Score ursprüngliche Reihenfolge behalten
    return a.originalIndex - b.originalIndex;
  })
  .map(({ item }) => item);

return Response.json({
  accommodations: rankedAccommodations,
});
}