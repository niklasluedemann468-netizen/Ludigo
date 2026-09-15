export function parseNatureSearch(
  normalizedText: string,
  params: URLSearchParams
) {
  // =========================================================
  // NATUR, BERGE, SKI & UMGEBUNG
  // =========================================================

  if (
    normalizedText.includes("in der natur") ||
    normalizedText.includes("mitten in der natur") ||
    normalizedText.includes("naturnah") ||
    normalizedText.includes("natururlaub") ||
    normalizedText.includes("naturerlebnis")
  ) {
    params.append("nature_location", "nature");
  }

  if (
    normalizedText.includes("ruhige naturlage") ||
    normalizedText.includes("ruhig in der natur") ||
    normalizedText.includes("ruhige lage in der natur") ||
    normalizedText.includes("ungestört in der natur") ||
    normalizedText.includes("ungestoert in der natur")
  ) {
    params.append("nature_preference", "quiet_nature");
  }

  if (
    normalizedText.includes("abgelegen") ||
    normalizedText.includes("abgelegene lage") ||
    normalizedText.includes("einsame lage") ||
    normalizedText.includes("fernab") ||
    normalizedText.includes("weit weg vom trubel") ||
    normalizedText.includes("abseits vom trubel")
  ) {
    params.append("nature_preference", "remote");
  }

  if (
    normalizedText.includes("alleinlage") ||
    normalizedText.includes("in alleinlage") ||
    normalizedText.includes("ohne direkte nachbarn") ||
    normalizedText.includes("keine direkten nachbarn") ||
    normalizedText.includes("einsam gelegen")
  ) {
    params.append("nature_preference", "secluded");
  }

  if (
    normalizedText.includes("ländlich") ||
    normalizedText.includes("laendlich") ||
    normalizedText.includes("ländliche lage") ||
    normalizedText.includes("laendliche lage") ||
    normalizedText.includes("auf dem land") ||
    normalizedText.includes("landurlaub")
  ) {
    params.append("nature_location", "rural");
  }

  if (
    normalizedText.includes("landschaftsblick") ||
    normalizedText.includes("blick in die landschaft") ||
    normalizedText.includes("blick auf die landschaft") ||
    normalizedText.includes("panoramablick auf die landschaft")
  ) {
    params.append("nature_view", "landscape_view");
  }

  if (
    normalizedText.includes("panoramablick") ||
    normalizedText.includes("panorama aussicht") ||
    normalizedText.includes("panoramaaussicht") ||
    normalizedText.includes("weite aussicht") ||
    normalizedText.includes("panoramic view")
  ) {
    params.append("nature_view", "panoramic_view");
  }

  if (
    normalizedText.includes("aussichtslage") ||
    normalizedText.includes("lage mit aussicht") ||
    normalizedText.includes("schöne aussicht") ||
    normalizedText.includes("schoene aussicht")
  ) {
    params.append("nature_preference", "scenic_location");
  }

  if (
    normalizedText.includes("höhenlage") ||
    normalizedText.includes("hoehenlage") ||
    normalizedText.includes("hoch gelegen") ||
    normalizedText.includes("erhöhte lage") ||
    normalizedText.includes("erhoehte lage")
  ) {
    params.append("nature_location", "elevated_location");
  }

  if (
    normalizedText.includes("in den bergen") ||
    normalizedText.includes("in den berge") ||
    normalizedText.includes("bergregion") ||
    normalizedText.includes("bergurlaub") ||
    normalizedText.includes("gebirge")
  ) {
    params.append("mountain_location", "mountains");
  }

  if (
    normalizedText.includes("direkt in den bergen") ||
    normalizedText.includes("mitten in den bergen") ||
    normalizedText.includes("berg lage") ||
    normalizedText.includes("berglage")
  ) {
    params.append("mountain_location", "mountain_location");
  }

  if (
    normalizedText.includes("bergblick") ||
    normalizedText.includes("blick auf die berge") ||
    normalizedText.includes("blick in die berge") ||
    normalizedText.includes("mountain view")
  ) {
    params.append("nature_view", "mountain_view");
  }

  if (
    normalizedText.includes("bergpanorama") ||
    normalizedText.includes("panoramablick auf die berge") ||
    normalizedText.includes("alpenpanorama") ||
    normalizedText.includes("panorama der berge")
  ) {
    params.append("nature_view", "mountain_panorama");
  }

  if (
    normalizedText.includes("in den alpen") ||
    normalizedText.includes("alpenlage") ||
    normalizedText.includes("alpenregion")
  ) {
    params.append("mountain_location", "alpine");
  }

  if (
    normalizedText.includes("im tal") ||
    normalizedText.includes("tallage") ||
    normalizedText.includes("in einem tal")
  ) {
    params.append("mountain_location", "valley");
  }

  if (
    normalizedText.includes("auf der alm") ||
    normalizedText.includes("almlage") ||
    normalizedText.includes("almurlaub") ||
    normalizedText.includes("bergalm")
  ) {
    params.append("mountain_location", "alpine_pasture");
  }

  if (
    normalizedText.includes("waldnähe") ||
    normalizedText.includes("waldnaehe") ||
    normalizedText.includes("nah am wald") ||
    normalizedText.includes("wald in der nähe") ||
    normalizedText.includes("wald in der naehe") ||
    normalizedText.includes("am waldrand")
  ) {
    params.append("nature_location", "near_forest");
  }

  if (
    normalizedText.includes("direkt im wald") ||
    normalizedText.includes("mitten im wald") ||
    normalizedText.includes("im wald gelegen") ||
    normalizedText.includes("waldlage")
  ) {
    params.append("nature_location", "forest");
  }

  if (
    normalizedText.includes("waldblick") ||
    normalizedText.includes("blick auf den wald") ||
    normalizedText.includes("blick in den wald") ||
    normalizedText.includes("forest view")
  ) {
    params.append("nature_view", "forest_view");
  }

  if (
    normalizedText.includes("nationalpark") ||
    normalizedText.includes("national park")
  ) {
    params.append("nature_location", "near_national_park");
  }

  if (
    normalizedText.includes("naturpark") ||
    normalizedText.includes("natur park")
  ) {
    params.append("nature_location", "near_nature_park");
  }

  if (
    normalizedText.includes("naturschutzgebiet") ||
    normalizedText.includes("naturreservat") ||
    normalizedText.includes("natur reserve")
  ) {
    params.append("nature_location", "near_nature_reserve");
  }

  if (
    normalizedText.includes("wanderwege") ||
    normalizedText.includes("wanderweg") ||
    normalizedText.includes("wanderrouten") ||
    normalizedText.includes("wanderroute")
  ) {
    params.append("outdoor_feature", "hiking_trails");
  }

  if (
    normalizedText.includes("wanderweg direkt") ||
    normalizedText.includes("wanderwege direkt") ||
    normalizedText.includes("wandern direkt ab unterkunft") ||
    normalizedText.includes("wandern direkt vom hotel") ||
    normalizedText.includes("wanderweg vor der tür") ||
    normalizedText.includes("wanderweg vor der tuer")
  ) {
    params.append("outdoor_feature", "hiking_from_property");
  }

  if (
    normalizedText.includes("wandergebiet") ||
    normalizedText.includes("wanderregion") ||
    normalizedText.includes("gutes wandergebiet")
  ) {
    params.append("nature_location", "hiking_area");
  }

  if (
    normalizedText.includes("fernwanderweg") ||
    normalizedText.includes("weitwanderweg") ||
    normalizedText.includes("long distance hiking trail")
  ) {
    params.append("outdoor_feature", "long_distance_hiking_trail");
  }

  if (
    normalizedText.includes("spazierwege") ||
    normalizedText.includes("spazierweg") ||
    normalizedText.includes("wege zum spazieren")
  ) {
    params.append("outdoor_feature", "walking_trails");
  }

  if (
    normalizedText.includes("radwege") ||
    normalizedText.includes("radweg") ||
    normalizedText.includes("fahrradwege") ||
    normalizedText.includes("fahrradweg")
  ) {
    params.append("outdoor_feature", "cycling_trails");
  }

  if (
    normalizedText.includes("mountainbike strecken") ||
    normalizedText.includes("mountainbike-strecken") ||
    normalizedText.includes("mountainbike trails") ||
    normalizedText.includes("mtb trails") ||
    normalizedText.includes("mtb strecken")
  ) {
    params.append("outdoor_feature", "mountain_bike_trails");
  }

  if (
    normalizedText.includes("klettergebiet") ||
    normalizedText.includes("kletterfelsen") ||
    normalizedText.includes("kletterrouten") ||
    normalizedText.includes("klettern in der nähe") ||
    normalizedText.includes("klettern in der naehe")
  ) {
    params.append("outdoor_feature", "climbing_area");
  }

  if (
    normalizedText.includes("klettersteig") ||
    normalizedText.includes("klettersteige") ||
    normalizedText.includes("via ferrata")
  ) {
    params.append("outdoor_feature", "via_ferrata");
  }

  if (
    normalizedText.includes("aussichtspunkt") ||
    normalizedText.includes("aussichtspunkte") ||
    normalizedText.includes("viewpoint")
  ) {
    params.append("nature_location", "near_viewpoint");
  }

  if (
    normalizedText.includes("wasserfall in der nähe") ||
    normalizedText.includes("wasserfall in der naehe") ||
    normalizedText.includes("nah am wasserfall")
  ) {
    params.append("nature_location", "near_waterfall");
  }

  if (
    normalizedText.includes("schlucht in der nähe") ||
    normalizedText.includes("schlucht in der naehe") ||
    normalizedText.includes("klamm in der nähe") ||
    normalizedText.includes("klamm in der naehe")
  ) {
    params.append("nature_location", "near_gorge");
  }

  if (
    normalizedText.includes("höhle in der nähe") ||
    normalizedText.includes("hoehle in der naehe") ||
    normalizedText.includes("höhlen in der nähe") ||
    normalizedText.includes("hoehlen in der naehe")
  ) {
    params.append("nature_location", "near_cave");
  }

  if (
    normalizedText.includes("tierbeobachtung") ||
    normalizedText.includes("wildtiere beobachten") ||
    normalizedText.includes("wildlife watching") ||
    normalizedText.includes("wildlife")
  ) {
    params.append("nature_activity", "wildlife_watching");
  }

  if (
    normalizedText.includes("vogelbeobachtung") ||
    normalizedText.includes("vögel beobachten") ||
    normalizedText.includes("voegel beobachten") ||
    normalizedText.includes("birdwatching") ||
    normalizedText.includes("bird watching")
  ) {
    params.append("nature_activity", "birdwatching");
  }

  if (
    normalizedText.includes("sternenhimmel") ||
    normalizedText.includes("sterne beobachten") ||
    normalizedText.includes("wenig lichtverschmutzung") ||
    normalizedText.includes("dark sky") ||
    normalizedText.includes("stargazing")
  ) {
    params.append("nature_preference", "stargazing");
  }

  // =========================================================
  // SKI & WINTERSPORT
  // =========================================================

  if (
    normalizedText.includes("skigebiet") ||
    normalizedText.includes("ski gebiet") ||
    normalizedText.includes("skiregion") ||
    normalizedText.includes("wintersportgebiet")
  ) {
    params.append("ski_location", "ski_area");
  }

  if (
    normalizedText.includes("skipiste in der nähe") ||
    normalizedText.includes("skipiste in der naehe") ||
    normalizedText.includes("piste in der nähe") ||
    normalizedText.includes("piste in der naehe") ||
    normalizedText.includes("nah an der skipiste") ||
    normalizedText.includes("nah an der piste")
  ) {
    params.append("ski_location", "near_ski_slope");
  }

  if (
    normalizedText.includes("direkt an der skipiste") ||
    normalizedText.includes("direkt an der piste") ||
    normalizedText.includes("unmittelbar an der skipiste") ||
    normalizedText.includes("pistenlage")
  ) {
    params.append("ski_location", "ski_slope_front");
  }

  if (
    normalizedText.includes("ski in ski out") ||
    normalizedText.includes("ski-in ski-out") ||
    normalizedText.includes("ski-in/ski-out") ||
    normalizedText.includes("ski in / ski out") ||
    normalizedText.includes("mit ski bis zur unterkunft") ||
    normalizedText.includes("mit skiern bis zur unterkunft")
  ) {
    params.append("ski_feature", "ski_in_ski_out");
  }

  if (
    normalizedText.includes("skilift in der nähe") ||
    normalizedText.includes("skilift in der naehe") ||
    normalizedText.includes("lift in der nähe") ||
    normalizedText.includes("lift in der naehe") ||
    normalizedText.includes("nah am skilift")
  ) {
    params.append("ski_location", "near_ski_lift");
  }

  if (
    normalizedText.includes("direkt am skilift") ||
    normalizedText.includes("direkt am lift") ||
    normalizedText.includes("unmittelbar am skilift")
  ) {
    params.append("ski_location", "ski_lift_front");
  }

  if (
    normalizedText.includes("gondel in der nähe") ||
    normalizedText.includes("gondel in der naehe") ||
    normalizedText.includes("bergbahn in der nähe") ||
    normalizedText.includes("bergbahn in der naehe") ||
    normalizedText.includes("seilbahn in der nähe") ||
    normalizedText.includes("seilbahn in der naehe")
  ) {
    params.append("ski_location", "near_mountain_lift");
  }

  const natureSkiSlopeDistanceMatch = normalizedText.match(
    /(?:maximal|max\.?|höchstens|hoechstens|bis zu|nicht mehr als)\s*(\d+(?:[.,]\d+)?)\s*(m|meter|km|kilometer)\s*(?:zur|von der|bis zur|entfernt von der)\s*(?:skipiste|piste)/
  );

  if (natureSkiSlopeDistanceMatch) {
    const value = Number(natureSkiSlopeDistanceMatch[1].replace(",", "."));
    const unit = natureSkiSlopeDistanceMatch[2];

    const meters =
      unit === "km" || unit === "kilometer"
        ? Math.round(value * 1000)
        : Math.round(value);

    params.set("max_distance_ski_slope_m", String(meters));
  }

  const natureSkiLiftDistanceMatch = normalizedText.match(
    /(?:maximal|max\.?|höchstens|hoechstens|bis zu|nicht mehr als)\s*(\d+(?:[.,]\d+)?)\s*(m|meter|km|kilometer)\s*(?:zum|vom|bis zum|entfernt vom)\s*(?:skilift|lift)/
  );

  if (natureSkiLiftDistanceMatch) {
    const value = Number(natureSkiLiftDistanceMatch[1].replace(",", "."));
    const unit = natureSkiLiftDistanceMatch[2];

    const meters =
      unit === "km" || unit === "kilometer"
        ? Math.round(value * 1000)
        : Math.round(value);

    params.set("max_distance_ski_lift_m", String(meters));
  }

  if (
    normalizedText.includes("skipiste fußläufig") ||
    normalizedText.includes("skipiste fusslaeufig") ||
    normalizedText.includes("zu fuß zur skipiste") ||
    normalizedText.includes("zu fuss zur skipiste") ||
    normalizedText.includes("piste zu fuß erreichbar") ||
    normalizedText.includes("piste zu fuss erreichbar")
  ) {
    params.append("ski_preference", "ski_slope_walkable");
  }

  if (
    normalizedText.includes("skilift fußläufig") ||
    normalizedText.includes("skilift fusslaeufig") ||
    normalizedText.includes("zu fuß zum skilift") ||
    normalizedText.includes("zu fuss zum skilift") ||
    normalizedText.includes("lift zu fuß erreichbar") ||
    normalizedText.includes("lift zu fuss erreichbar")
  ) {
    params.append("ski_preference", "ski_lift_walkable");
  }

  if (
    normalizedText.includes("skibus") ||
    normalizedText.includes("ski bus") ||
    normalizedText.includes("shuttle zur piste") ||
    normalizedText.includes("shuttle zum skilift")
  ) {
    params.append("ski_service", "ski_bus");
  }

  if (
    normalizedText.includes("kostenloser skibus") ||
    normalizedText.includes("gratis skibus") ||
    normalizedText.includes("skibus kostenlos") ||
    normalizedText.includes("kostenloser shuttle zur piste")
  ) {
    params.append("ski_service", "free_ski_bus");
  }

  if (
    normalizedText.includes("skiraum") ||
    normalizedText.includes("ski raum") ||
    normalizedText.includes("skiaufbewahrung") ||
    normalizedText.includes("ski aufbewahrung") ||
    normalizedText.includes("ski storage")
  ) {
    params.append("ski_feature", "ski_storage");
  }

  if (
    normalizedText.includes("beheizter skiraum") ||
    normalizedText.includes("beheizte skiaufbewahrung") ||
    normalizedText.includes("beheizter ski raum")
  ) {
    params.append("ski_feature", "heated_ski_storage");
  }

  if (
    normalizedText.includes("skischuhtrockner") ||
    normalizedText.includes("skischuh trockner") ||
    normalizedText.includes("schuhtrockner für skischuhe") ||
    normalizedText.includes("schuhtrockner fuer skischuhe")
  ) {
    params.append("ski_feature", "ski_boot_dryer");
  }

  if (
    normalizedText.includes("skiverleih") ||
    normalizedText.includes("ski verleih") ||
    normalizedText.includes("ski mieten") ||
    normalizedText.includes("skiausrüstung mieten") ||
    normalizedText.includes("skiausruestung mieten")
  ) {
    params.append("ski_service", "ski_rental");
  }

  if (
    normalizedText.includes("skiverleih im hotel") ||
    normalizedText.includes("skiverleih in der unterkunft") ||
    normalizedText.includes("skiverleih im haus") ||
    normalizedText.includes("ski rental on site")
  ) {
    params.append("ski_service", "ski_rental_on_site");
  }

  if (
    normalizedText.includes("skischule") ||
    normalizedText.includes("ski schule") ||
    normalizedText.includes("skiunterricht") ||
    normalizedText.includes("ski lessons")
  ) {
    params.append("ski_service", "ski_school");
  }

  if (
    normalizedText.includes("skischule in der nähe") ||
    normalizedText.includes("skischule in der naehe") ||
    normalizedText.includes("nah an der skischule")
  ) {
    params.append("ski_location", "near_ski_school");
  }

  if (
    normalizedText.includes("skipass") ||
    normalizedText.includes("ski pass") ||
    normalizedText.includes("liftpass") ||
    normalizedText.includes("liftkarte")
  ) {
    params.append("ski_service", "ski_pass");
  }

  if (
    normalizedText.includes("skipass im hotel") ||
    normalizedText.includes("skipass in der unterkunft") ||
    normalizedText.includes("skipass vor ort") ||
    normalizedText.includes("skipassverkauf")
  ) {
    params.append("ski_service", "ski_pass_sales");
  }

  if (
    normalizedText.includes("schneesicher") ||
    normalizedText.includes("schneesicherheit") ||
    normalizedText.includes("schneesicheres skigebiet") ||
    normalizedText.includes("schneesichere lage")
  ) {
    params.append("ski_preference", "snow_reliable");
  }

  if (
    normalizedText.includes("gletscher") ||
    normalizedText.includes("gletscherskigebiet") ||
    normalizedText.includes("gletscher skigebiet")
  ) {
    params.append("ski_preference", "glacier_skiing");
  }

  if (
    normalizedText.includes("anfängerfreundliches skigebiet") ||
    normalizedText.includes("anfaengerfreundliches skigebiet") ||
    normalizedText.includes("für ski anfänger") ||
    normalizedText.includes("fuer ski anfaenger") ||
    normalizedText.includes("leichte skipisten")
  ) {
    params.append("ski_preference", "beginner_friendly");
  }

  if (
    normalizedText.includes("familienfreundliches skigebiet") ||
    normalizedText.includes("skigebiet für familien") ||
    normalizedText.includes("skigebiet fuer familien") ||
    normalizedText.includes("skigebiet für kinder") ||
    normalizedText.includes("skigebiet fuer kinder")
  ) {
    params.append("ski_preference", "family_friendly");
  }

  if (
    normalizedText.includes("anspruchsvolles skigebiet") ||
    normalizedText.includes("schwierige skipisten") ||
    normalizedText.includes("schwarze pisten") ||
    normalizedText.includes("für erfahrene skifahrer") ||
    normalizedText.includes("fuer erfahrene skifahrer")
  ) {
    params.append("ski_preference", "advanced_skiing");
  }

  if (
    normalizedText.includes("freeride") ||
    normalizedText.includes("freeriden") ||
    normalizedText.includes("tiefschnee") ||
    normalizedText.includes("off piste") ||
    normalizedText.includes("off-piste")
  ) {
    params.append("winter_activity", "freeride");
  }

  if (
    normalizedText.includes("snowboard") ||
    normalizedText.includes("snowboarden")
  ) {
    params.append("winter_activity", "snowboarding");
  }

  if (
    normalizedText.includes("snowpark") ||
    normalizedText.includes("snow park") ||
    normalizedText.includes("funpark") ||
    normalizedText.includes("fun park")
  ) {
    params.append("ski_location", "near_snowpark");
  }

  if (
    normalizedText.includes("langlauf") ||
    normalizedText.includes("langlaufen") ||
    normalizedText.includes("cross country skiing") ||
    normalizedText.includes("cross-country skiing")
  ) {
    params.append("winter_activity", "cross_country_skiing");
  }

  if (
    normalizedText.includes("loipe") ||
    normalizedText.includes("loipen") ||
    normalizedText.includes("langlaufloipe") ||
    normalizedText.includes("langlaufloipen")
  ) {
    params.append("ski_location", "near_cross_country_trail");
  }

  if (
    normalizedText.includes("loipe direkt") ||
    normalizedText.includes("loipe vor der tür") ||
    normalizedText.includes("loipe vor der tuer") ||
    normalizedText.includes("langlauf direkt ab unterkunft")
  ) {
    params.append("ski_location", "cross_country_trail_front");
  }

  if (
    normalizedText.includes("rodeln") ||
    normalizedText.includes("rodelbahn") ||
    normalizedText.includes("schlittenfahren") ||
    normalizedText.includes("sledding")
  ) {
    params.append("winter_activity", "sledding");
  }

  if (
    normalizedText.includes("rodelbahn in der nähe") ||
    normalizedText.includes("rodelbahn in der naehe") ||
    normalizedText.includes("nah an der rodelbahn")
  ) {
    params.append("ski_location", "near_sledding");
  }

  if (
    normalizedText.includes("winterwandern") ||
    normalizedText.includes("winterwanderwege") ||
    normalizedText.includes("winterwanderung")
  ) {
    params.append("winter_activity", "winter_hiking");
  }

  if (
    normalizedText.includes("schneeschuhwandern") ||
    normalizedText.includes("schneeschuh wandern") ||
    normalizedText.includes("schneeschuhtour") ||
    normalizedText.includes("snowshoeing")
  ) {
    params.append("winter_activity", "snowshoeing");
  }

  if (
    normalizedText.includes("eislaufen") ||
    normalizedText.includes("eislaufbahn") ||
    normalizedText.includes("schlittschuhlaufen") ||
    normalizedText.includes("ice skating")
  ) {
    params.append("winter_activity", "ice_skating");
  }

  if (
    normalizedText.includes("winterurlaub") ||
    normalizedText.includes("winterferien") ||
    normalizedText.includes("urlaub im winter")
  ) {
    params.append("trip_style", "winter_trip");
  }

  if (
    normalizedText.includes("skiurlaub") ||
    normalizedText.includes("ski urlaub") ||
    normalizedText.includes("urlaub zum skifahren") ||
    normalizedText.includes("skiferien")
  ) {
    params.append("trip_style", "ski_trip");
  }

  if (
    normalizedText.includes("wanderurlaub") ||
    normalizedText.includes("wanderreise") ||
    normalizedText.includes("urlaub zum wandern")
  ) {
    params.append("trip_style", "hiking_trip");
  }

  if (
    normalizedText.includes("bergurlaub") ||
    normalizedText.includes("urlaub in den bergen") ||
    normalizedText.includes("ferien in den bergen")
  ) {
    params.append("trip_style", "mountain_trip");
  }

  if (
    normalizedText.includes("natururlaub") ||
    normalizedText.includes("urlaub in der natur") ||
    normalizedText.includes("naturreise")
  ) {
    params.append("trip_style", "nature_trip");
  }
}