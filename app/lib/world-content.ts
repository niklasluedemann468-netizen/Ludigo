export type WorldKey = "surprise" | "bike" | "bus";
export type ProfileField = { name: string; label: string; type?: string; value?: string; min?: string; max?: string; unit?: string; hint?: string; placeholder?: string; maxlength?: string; options?: string[][]; default?: string };
export type WorldContent = { slug: string; key: string; class: string; title: string; short: string; icon: string; eyebrow: string; headline: string; description: string; action: string; status: string; pass_title: string; pass_description: string; pass_bottom: string[]; intro_title: string; intro_text: string; features: string[][]; planner_eyebrow: string; planner_title: string; planner_description: string; detail: string; form_title: string; fields: ProfileField[]; submit: string; faq_intro: string; faqs: string[][] };
export const worldPages: Record<WorldKey, WorldContent> = {
  "surprise": {
    "slug": "surprise",
    "key": "surprise",
    "class": "surprise-page",
    "title": "LÜDIGO Surprise",
    "short": "Surprise",
    "icon": "spark",
    "eyebrow": "FÜR DIE SPONTANE SEITE IN DIR",
    "headline": "Ein bisschen Mut.<br><em>Ganz viel Vorfreude.</em>",
    "description": "Du kennst dein Budget. Du weißt, was dir Freude macht. Nur das Ziel darf dich überraschen. Hier beginnt die Idee für deinen nächsten Kurztrip.",
    "action": "Meine Surprise-Idee",
    "status": "Testversion: Reiseangebote sind in Planung. Keine echte Reisevermittlung, Buchung oder Zahlung.",
    "pass_title": "Dein nächstes<br>Vielleicht.",
    "pass_description": "Ein bisschen Neugier passt in jedes Gepäck.",
    "pass_bottom": [
      "BUDGET + INTERESSEN",
      "KURZ RAUS"
    ],
    "intro_title": "Du gibst die Richtung vor.<br><em>Die Neugier darf mit.</em>",
    "intro_text": "So könnte eine Überraschungsreise mit LÜDIGO beginnen: mit deinen Vorstellungen statt mit einer langen Zielliste.",
    "features": [
      [
        "Dein Rahmen.",
        "Ein Wunschbudget und die passende Reisedauer geben deiner Idee eine Richtung. Sie sind noch keine Preiszusage."
      ],
      [
        "Deine Interessen.",
        "Natur, Kultur oder genussvolle Momente: Entscheide, was deine kleine Auszeit besonders machen soll."
      ],
      [
        "Dein Überraschungsmoment.",
        "Das Ziel bleibt zunächst offen. Hier geht es darum, Vorfreude zu wecken und dein Reiseprofil kennenzulernen."
      ]
    ],
    "planner_eyebrow": "EIN ERSTER SCHRITT INS UNGEPLANTE",
    "planner_title": "Welche Überraschung<br><em>passt zu dir?</em>",
    "planner_description": "Beschreibe deinen Rahmen und entdecke passende Themenideen. Über das vorhandene Formular kannst du anschließend einen Reisewunsch zur Prüfung an LÜDIGO übermitteln.",
    "detail": "Die Themenideen sind keine verfügbaren Reiseangebote. Vor dem Absenden einer Anfrage werden deine Angaben noch einmal zur Prüfung angezeigt.",
    "form_title": "Deine Surprise-Idee",
    "fields": [
      {
        "name": "budget",
        "label": "Wunschbudget pro Person",
        "type": "number",
        "value": "250",
        "min": "1",
        "max": "100000",
        "unit": " €",
        "hint": "Dein selbst gewählter Rahmen, kein Angebotspreis."
      },
      {
        "name": "duration",
        "label": "Wie lange möchtest du weg?",
        "options": [
          [
            "1",
            "1 Übernachtung"
          ],
          [
            "2",
            "2 Übernachtungen"
          ],
          [
            "3",
            "3 Übernachtungen"
          ],
          [
            "4",
            "4 Übernachtungen"
          ]
        ],
        "default": "2"
      },
      {
        "name": "interest",
        "label": "Was zieht dich an?",
        "options": [
          [
            "nature",
            "Natur & Abschalten"
          ],
          [
            "culture",
            "Kultur & Entdecken"
          ],
          [
            "enjoyment",
            "Genuss & Gemütlichkeit"
          ]
        ]
      }
    ],
    "submit": "Meine Idee zusammenstellen",
    "faq_intro": "LÜDIGO Surprise ist eine Testversion. Hier kannst du Themenideen ausprobieren und deinen Reisewunsch festhalten.",
    "faqs": [
      [
        "Kann ich schon eine Überraschungsreise buchen?",
        "Noch nicht. LÜDIGO Surprise ist eine Testversion. Die Themenideen sind keine verfügbaren Reiseangebote. Eine Anfrage ist keine Buchung, Reisevermittlung oder Zahlung."
      ],
      [
        "Wird hier schon ein konkretes Reiseziel ausgewählt?",
        "Nein. Die vorhandene Ideensuche gleicht deine Angaben mit Reisethemen ab. Sie weist dir noch kein buchbares Ziel und keine verfügbaren Leistungen zu."
      ],
      [
        "Was passiert mit meinen Angaben?",
        "Die Ideensuche benötigt noch keine Kontaktdaten. Wenn du eine Idee auswählst und eine Anfrage stellen möchtest, kannst du die Kontaktangaben im Formular ergänzen und vor dem Absenden prüfen. Erst der abschließende Versand übermittelt die Anfrage an LÜDIGO. Details stehen in der Datenschutzerklärung."
      ]
    ]
  },
  "bike": {
    "slug": "bike",
    "key": "bike",
    "class": "bike-page",
    "title": "LÜDIGO Bike",
    "short": "Bike",
    "icon": "bike",
    "eyebrow": "FÜR DEN WEG, DER DAS ZIEL IST",
    "headline": "Der schönste Umweg<br><em>beginnt hier.</em>",
    "description": "Ein Tag im Sattel. Eine Pause mit Aussicht. Oder mehrere Etappen voller kleiner Entdeckungen. Gib deiner nächsten Radreise eine erste Richtung.",
    "action": "Meine Radreise planen",
    "status": "Radtouren und Radreiseangebote sind in Planung. Dein Tourenwunsch beginnt hier.",
    "pass_title": "Im eigenen<br>Rhythmus.",
    "pass_description": "Mit Fahrrad, E-Bike und jeder Menge Vorfreude.",
    "pass_bottom": [
      "DEIN RAD. DEIN TEMPO.",
      "WEITER DENKEN"
    ],
    "intro_title": "Nicht jeder Weg muss der kürzeste sein.<br><em>Nur deiner.</em>",
    "intro_text": "LÜDIGO Bike ist die geplante Reisewelt für Touren, E-Bike-Ausflüge und mehrtägige Radreisen.",
    "features": [
      [
        "Genuss im Fokus.",
        "In Ruhe unterwegs sein, anhalten und die Umgebung kennenlernen. Eine Idee für alle, die Pausen genauso mögen wie das Fahren."
      ],
      [
        "Ein Tag für Neues.",
        "Ein Tagesausflug gibt deiner Reise einen überschaubaren Rahmen. Wohin und wie weit es geht, legst du selbst fest."
      ],
      [
        "Etappe für Etappe.",
        "Eine mehrtägige Radreise bietet Raum für neue Perspektiven. Dein gewünschter Rhythmus steht am Anfang der Planung."
      ]
    ],
    "planner_eyebrow": "DEIN NÄCHSTER LIEBLINGSWEG",
    "planner_title": "Wie möchtest du<br><em>unterwegs sein?</em>",
    "planner_description": "Halte fest, welches Rad, welche Reisedauer und welcher Rhythmus zu deiner Idee passen. So wird aus „mal wieder Rad fahren“ ein klarerer Wunsch.",
    "detail": "Dein Tourenprofil enthält noch keine konkrete Strecke, Navigation oder buchbare Radreise.",
    "form_title": "Dein Tourenwunsch",
    "fields": [
      {
        "name": "bicycle",
        "label": "Womit fährst du?",
        "options": [
          [
            "bicycle",
            "Fahrrad"
          ],
          [
            "ebike",
            "E-Bike"
          ]
        ]
      },
      {
        "name": "duration",
        "label": "Wie lange möchtest du unterwegs sein?",
        "options": [
          [
            "day",
            "Ein Tagesausflug"
          ],
          [
            "weekend",
            "Ein Wochenende"
          ],
          [
            "multiple",
            "Mehrere Tage"
          ]
        ]
      },
      {
        "name": "pace",
        "label": "Was ist dir am wichtigsten?",
        "options": [
          [
            "easy",
            "Genuss & viele Pausen"
          ],
          [
            "active",
            "Aktiv sein & Strecke machen"
          ],
          [
            "mixed",
            "Fahren & Entdecken im Wechsel"
          ]
        ]
      }
    ],
    "submit": "Mein Tourenprofil zusammenstellen",
    "faq_intro": "Dein Tourenprofil ist der Anfang einer Idee. Die konkrete Radreise folgt, wenn passende Angebote angebunden sind.",
    "faqs": [
      [
        "Gibt es bereits konkrete Routen oder GPX-Dateien?",
        "Noch nicht. Auf dieser Seite kannst du deinen Tourenwunsch festhalten. Konkrete Strecken, Navigation und GPX-Downloads gehören noch nicht zum verfügbaren Angebot."
      ],
      [
        "Kann ich auch mit einem E-Bike planen?",
        "Ja, du kannst ein E-Bike als Wunsch auswählen. Die Seite ordnet dir aber noch keine E-Bike-geeignete Strecke, Ladepunkte oder verfügbare Radreise zu."
      ],
      [
        "Kann ich eine Unterkunft für meine Reise suchen?",
        "Über „Unterkünfte“ kommst du zur Unterkunftsübersicht. Für die vollständige Suche führt ein Link zur bestehenden LÜDIGO-Website. Eine Prüfung radbezogener Ausstattungsmerkmale ist hier noch nicht angebunden."
      ]
    ]
  },
  "bus": {
    "slug": "bustouren-senioren",
    "key": "bus",
    "class": "bus-page",
    "title": "Bustouren für Senioren",
    "short": "Bustouren für Senioren",
    "icon": "bus",
    "eyebrow": "FÜR DAS UNTERWEGSSEIN ZUSAMMEN",
    "headline": "Gemeinsam unterwegs.<br><em>Entspannt entdecken.</em>",
    "description": "Neue Orte kennenlernen und schöne Momente teilen. Hier beginnt dein Wunsch nach einer Busreise, die zu deinen Interessen und deinem Reisetempo passt.",
    "action": "Meinen Reisewunsch festhalten",
    "status": "Busreiseangebote sind in Planung. Aktuell sind hier keine Touren buchbar.",
    "pass_title": "Zusammen<br>mehr erleben.",
    "pass_description": "Einsteigen mit Vorfreude. Ankommen mit Geschichten.",
    "pass_bottom": [
      "DEIN WUNSCH. DEIN TEMPO.",
      "GEMEINSAM LOS"
    ],
    "intro_title": "Eine gute Reise beginnt<br><em>mit deinen Wünschen.</em>",
    "intro_text": "Diese geplante Reisewelt richtet sich an Senioren, die gemeinsam auf Entdeckung gehen möchten.",
    "features": [
      [
        "Passend einsteigen.",
        "Ein günstiger Zustiegsort macht den Anfang angenehmer. Halte fest, von welcher Stadt aus du gern starten möchtest."
      ],
      [
        "Deinen Rhythmus finden.",
        "Ein Tagesausflug oder mehrere Tage unterwegs: Entscheide, wie viel Zeit du deiner Reise geben möchtest."
      ],
      [
        "Gemeinsam entdecken.",
        "Kultur, Landschaft oder gesellige Momente. Deine Interessen helfen, den Wunsch nach einer passenden Busreise zu beschreiben."
      ]
    ],
    "planner_eyebrow": "EINFACH DEN ERSTEN SCHRITT MACHEN",
    "planner_title": "Was wünschst du dir<br><em>von deiner Busreise?</em>",
    "planner_description": "Nenne deinen gewünschten Startort, die Reisedauer und deine Interessen. Daraus entsteht ein übersichtlicher Reisewunsch für deine weitere Planung.",
    "detail": "Es erfolgt noch kein Abgleich mit echten Zustiegsorten oder Touren. Dein Wunschprofil wird nicht als Anfrage an Anbieter gesendet.",
    "form_title": "Dein Busreise-Wunsch",
    "fields": [
      {
        "name": "departure",
        "label": "Gewünschte Stadt für den Zustieg",
        "type": "text",
        "placeholder": "Zum Beispiel deine Heimatstadt",
        "maxlength": "80",
        "hint": "Ein Wunschort, noch kein bestätigter Abfahrtsort."
      },
      {
        "name": "duration",
        "label": "Wie lange möchtest du verreisen?",
        "options": [
          [
            "day",
            "Ein Tagesausflug"
          ],
          [
            "short",
            "2 bis 4 Tage"
          ],
          [
            "long",
            "5 Tage oder länger"
          ]
        ]
      },
      {
        "name": "interest",
        "label": "Was möchtest du erleben?",
        "options": [
          [
            "culture",
            "Kultur & neue Orte"
          ],
          [
            "nature",
            "Natur & Landschaft"
          ],
          [
            "enjoyment",
            "Genuss & Geselligkeit"
          ]
        ]
      }
    ],
    "submit": "Meinen Reisewunsch zusammenstellen",
    "faq_intro": "Hier findest du Antworten zum aktuellen Stand dieser Reisewelt und zu deinem Wunschprofil.",
    "faqs": [
      [
        "Kann ich hier schon eine Busreise buchen?",
        "Nein. Bustouren für Senioren ist eine Reisewelt in Planung. Es werden noch keine verfügbaren Touren angezeigt und keine Buchungen oder Anfragen an Reiseanbieter vorgenommen."
      ],
      [
        "Ist mein gewünschter Zustiegsort verfügbar?",
        "Dein eingetragener Ort ist zunächst ein Wunsch. Ein Abgleich mit tatsächlichen Abfahrtsorten ist noch nicht angebunden."
      ],
      [
        "Wo finde ich Angaben zu Komfort und Unterstützung?",
        "Solche Angaben müssen beim konkreten Reiseanbieter geprüft werden, sobald echte Touren verknüpft sind. Hier werden noch keine Zusagen zu Barrierefreiheit, Betreuung oder Ausstattung gemacht."
      ],
      [
        "Brauche ich ein Konto für mein Wunschprofil?",
        "Nein. Du kannst den Reisewunsch direkt zusammenstellen und auf Wunsch in diesem Browser speichern. Es werden weder Kontaktdaten benötigt noch Nachrichten versendet."
      ]
    ]
  }
};
