
export type SurprisePreference =
  | "Strand & Meer"
  | "Natur"
  | "Städtereise"
  | "Wellness"
  | "Aktivurlaub";

export type SurpriseRequest = {
  departure: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: string;
  preferences: SurprisePreference[];
};

export type SurpriseIdea = {
  id: string;
  title: string;
  teaser: string;
  highlights: string[];
  reason: string;
  score: number;
};

export type SurpriseMatches = {
  ideas: SurpriseIdea[];
  windowDays: number;
  budgetPerPerson: number | null;
  note: string;
};

type IdeaTemplate = Omit<SurpriseIdea, "score" | "reason"> & {
  preference: SurprisePreference;
  minimumDays: number;
  // Nur Orientierungswert, kein tatsächlicher Reisepreis.
  orientationBudgetPerPerson: number;
};

const templates: IdeaTemplate[] = [
  {
    id: "meer",
    preference: "Strand & Meer",
    title: "Deine maritime Überraschung",
    teaser:
      "Meeresluft und entspannte Stunden am Wasser – wohin es geht, bleibt geheim.",
    highlights: [
      "Maritimes Flair",
      "Zeit am Wasser",
      "Geheimes Reiseziel",
    ],
    minimumDays: 2,
    orientationBudgetPerPerson: 250,
  },
  {
    id: "natur",
    preference: "Natur",
    title: "Deine Auszeit im Grünen",
    teaser:
      "Natur, frische Luft und neue Perspektiven: eine Überraschung für Entdecker.",
    highlights: [
      "Natur erleben",
      "Ruhe finden",
      "Geheimes Reiseziel",
    ],
    minimumDays: 2,
    orientationBudgetPerPerson: 160,
  },
  {
    id: "city",
    preference: "Städtereise",
    title: "Dein unbekannter Citytrip",
    teaser:
      "Neue Gassen, Kultur und spannende Eindrücke – die Stadt bleibt geheim.",
    highlights: [
      "Stadt entdecken",
      "Kultur & Atmosphäre",
      "Geheimes Reiseziel",
    ],
    minimumDays: 2,
    orientationBudgetPerPerson: 200,
  },
  {
    id: "wellness",
    preference: "Wellness",
    title: "Deine Wohlfühl-Überraschung",
    teaser:
      "Eine erholsame Auszeit mit Raum zum Abschalten – das Ziel bleibt geheim.",
    highlights: [
      "Erholung",
      "Entspannung",
      "Geheimes Reiseziel",
    ],
    minimumDays: 2,
    orientationBudgetPerPerson: 320,
  },
  {
    id: "aktiv",
    preference: "Aktivurlaub",
    title: "Dein kleines Abenteuer",
    teaser:
      "Bewegung und neue Eindrücke für eine aktive Überraschung.",
    highlights: [
      "Aktiv unterwegs",
      "Neues entdecken",
      "Geheimes Reiseziel",
    ],
    minimumDays: 3,
    orientationBudgetPerPerson: 220,
  },
];

function calendarDays(start: string, end: string): number {
  const first = Date.parse(`${start}T12:00:00Z`);
  const last = Date.parse(`${end}T12:00:00Z`);

  if (!Number.isFinite(first) || !Number.isFinite(last)) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor((last - first) / 86400000) + 1
  );
}

/**
 * Erstellt bis zu drei Überraschungsideen.
 *
 * WICHTIG:
 * - Gewählte Vorlieben sind verbindliche Themenfilter.
 * - Budget und Zeitraum beeinflussen nur die Reihenfolge.
 * - Ohne Vorlieben werden drei Inspirationen angezeigt.
 * - Es erfolgt keine echte Reise- oder Verfügbarkeitsprüfung.
 */
export function matchSurprises(
  request: SurpriseRequest
): SurpriseMatches {
  const windowDays = calendarDays(
    request.startDate,
    request.endDate
  );

  const budgetValue =
    request.budget.trim() === ""
      ? null
      : Number(request.budget);

  const budgetPerPerson =
    budgetValue !== null &&
    Number.isFinite(budgetValue) &&
    budgetValue >= 0 &&
    request.travelers > 0
      ? budgetValue / request.travelers
      : null;

  // NEU: Nur Ideen zu ausgewählten Vorlieben zulassen.
  // Wenn keine Vorliebe gewählt ist, sind alle Themen erlaubt.
  const matchingTemplates =
    request.preferences.length > 0
      ? templates.filter((template) =>
          request.preferences.includes(template.preference)
        )
      : templates;

  const ranked = matchingTemplates.map(
    (template, index) => {
      const preferenceIndex =
        request.preferences.indexOf(template.preference);

      let score =
        preferenceIndex >= 0
          ? 100 - preferenceIndex * 8
          : 30;

      const reasons: string[] = [];

      if (preferenceIndex >= 0) {
        reasons.push(
          `passt zu deiner Vorliebe „${template.preference}“`
        );
      }

      if (windowDays >= template.minimumDays) {
        score += 15;
        reasons.push(
          "passt grundsätzlich in dein angegebenes Reisefenster"
        );
      } else {
        score -= 15;
        reasons.push(
          "benötigt eventuell mehr zeitlichen Spielraum"
        );
      }

      if (budgetPerPerson !== null) {
        if (
          budgetPerPerson >=
          template.orientationBudgetPerPerson
        ) {
          score += 10;
          reasons.push(
            "wird bei deinem Budget in der Ideenauswahl höher gewichtet"
          );
        } else {
          score -= 10;
          reasons.push(
            "wird bei deinem Budget vorsichtiger gewichtet"
          );
        }
      }

      if (request.preferences.length === 0) {
        reasons.push(
          "als neue Inspiration für offene Reisewünsche"
        );
      }

      return {
        id: template.id,
        title: template.title,
        teaser: template.teaser,
        highlights: template.highlights,
        score,
        reason: reasons.join("; ") + ".",
        index,
      };
    }
  );

  ranked.sort(
    (a, b) =>
      b.score - a.score ||
      a.index - b.index
  );

  return {
    ideas: ranked
      .slice(0, 3)
      .map(({ index: _index, ...idea }) => idea),

    windowDays,
    budgetPerPerson,

    note:
      "Die Auswahl berücksichtigt ausschließlich deine gewählten Reisevorlieben. " +
      "Reisezeitraum und Budget beeinflussen die Reihenfolge. " +
      "Es wurden keine konkreten Reiseziele, Preise, Anreisen oder Verfügbarkeiten geprüft. " +
      "Die Budgetgewichtung ist keine Preisprognose.",
  };
}
