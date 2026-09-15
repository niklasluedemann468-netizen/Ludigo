import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return Response.json(
        { error: "Bitte gib einen Suchtext ein." },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",
      input: [
        {
          role: "system",
          content: `
Du analysierst natürliche Reisewünsche und wandelst sie in Suchkriterien um.

Wichtige Regeln:
- Erfinde keine Informationen.
- Nicht genannte Werte sind null.
- Ein nicht genanntes Land bleibt null.
- true nur, wenn ein Wunsch genannt oder eindeutig gemeint ist.
- false nur, wenn etwas ausdrücklich ausgeschlossen wird.
- "insgesamt 600 Euro" bedeutet total_budget = 600.
- "100 Euro pro Nacht" bedeutet max_price_per_night = 100.
- month ist eine Zahl von 1 bis 12.
- nights ist die Anzahl der Übernachtungen.
- guests ist die Personenzahl.

features darf nur passende Keys aus unserem Unterkunftssystem enthalten.

Beispiele für mögliche Feature-Keys:
near_sea, near_beach, beachfront, near_lake, near_mountains,
city_center, quiet_place, dogs_allowed, pets_allowed,
family_friendly, accessible, wheelchair_accessible,
wifi, parking, free_parking, garage, air_conditioning,
balcony, terrace, garden, kitchen, washing_machine,
pool, indoor_pool, outdoor_pool, private_pool,
hot_tub, sauna, spa, gym,
breakfast, breakfast_included, half_board, full_board,
all_inclusive, ultra_all_inclusive, self_catering,
restaurant, bar,
hiking, cycling, skiing, golf, tennis,
diving, snorkeling, windsurfing,
non_smoking, private_bathroom, bathtub, shower,
baby_cot, self_check_in.

Antworte ausschließlich als gültiges JSON in diesem Format:

{
  "country": null,
  "region": null,
  "city": null,
  "month": null,
  "nights": null,
  "guests": null,
  "total_budget": null,
  "max_price_per_night": null,
  "accommodation_type": null,
  "features": []
}
          `,
        },
        {
          role: "user",
          content: query,
        },
      ],
    });

    const criteria = JSON.parse(response.output_text);

    return Response.json({
      query,
      criteria,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Die KI-Suche konnte nicht verarbeitet werden." },
      { status: 500 }
    );
  }
}