export function parseHotelStars(
  normalizedText: string,
  params: URLSearchParams
) {
  // ============================================================
  // HOTELSTERNE
  //
  // Unterstützt unter anderem:
  //
  // "4 Sterne"
  // "4-Sterne-Hotel"
  // "4 Sterne Hotel"
  // "Hotel mit 4 Sternen"
  //
  // "mindestens 4 Sterne"
  // "ab 4 Sterne"
  // "4 Sterne oder besser"
  // "4 Sterne oder mehr"
  //
  // "maximal 4 Sterne"
  // "höchstens 4 Sterne"
  // "bis 4 Sterne"
  //
  // "zwischen 3 und 5 Sternen"
  //
  // Gültiger Bereich: 1 bis 5 Sterne
  // ============================================================

  const isValidStars = (value: number) =>
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 5;

  // ============================================================
  // 1. STERNE-BEREICH
  // Beispiel:
  // "zwischen 3 und 5 sternen"
  // ============================================================

  const starsRangeMatch = normalizedText.match(
    /\bzwischen\s+([1-5])\s+und\s+([1-5])\s*(?:sterne|sternen)\b/i
  );

  if (starsRangeMatch) {
    const first = Number(starsRangeMatch[1]);
    const second = Number(starsRangeMatch[2]);

    if (
      isValidStars(first) &&
      isValidStars(second)
    ) {
      params.set(
        "min_hotel_stars",
        String(Math.min(first, second))
      );

      params.set(
        "max_hotel_stars",
        String(Math.max(first, second))
      );

      return;
    }
  }

  // ============================================================
  // 2. MINDESTENS X STERNE
  //
  // "mindestens 4 sterne"
  // "ab 4 sternen"
  // "4 sterne oder besser"
  // "4 sterne oder mehr"
  // ============================================================

  const minStarsMatch =
    normalizedText.match(
      /\b(?:mindestens|min\.?|ab)\s+([1-5])\s*(?:sterne|sternen)\b/i
    ) ??
    normalizedText.match(
      /\b([1-5])\s*(?:sterne|sternen)\s*(?:oder\s+besser|oder\s+mehr)\b/i
    );

  if (minStarsMatch) {
    const stars = Number(minStarsMatch[1]);

    if (isValidStars(stars)) {
      params.set(
        "min_hotel_stars",
        String(stars)
      );

      return;
    }
  }

  // ============================================================
  // 3. MAXIMAL X STERNE
  //
  // "maximal 4 sterne"
  // "höchstens 4 sterne"
  // "bis 4 sterne"
  // ============================================================

  const maxStarsMatch =
    normalizedText.match(
      /\b(?:maximal|max\.?|höchstens|hoechstens)\s+([1-5])\s*(?:sterne|sternen)\b/i
    ) ??
    normalizedText.match(
      /\bbis\s+([1-5])\s*(?:sterne|sternen)\b/i
    );

  if (maxStarsMatch) {
    const stars = Number(maxStarsMatch[1]);

    if (isValidStars(stars)) {
      params.set(
        "max_hotel_stars",
        String(stars)
      );

      return;
    }
  }

  // ============================================================
  // 4. EXAKTE STERNEZAHL
  //
  // "4 sterne"
  // "4 sternen"
  // "4-sterne-hotel"
  // "4 sterne hotel"
  // "hotel mit 4 sternen"
  // ============================================================

  const exactStarsMatch =
    normalizedText.match(
      /\b([1-5])\s*[- ]?\s*sterne(?:n)?(?:\s*[- ]?\s*hotel)?\b/i
    ) ??
    normalizedText.match(
      /\bhotel\s+mit\s+([1-5])\s*(?:sterne|sternen)\b/i
    );

  if (exactStarsMatch) {
    const stars = Number(exactStarsMatch[1]);

    if (isValidStars(stars)) {
      params.set(
        "hotel_stars",
        String(stars)
      );
    }
  }
}