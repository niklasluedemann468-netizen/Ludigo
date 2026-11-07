# Ausführung der zwölf Parser-Dateien

Die zwölf Dateien des Screenshots werden im tatsächlichen Searchbox-Controller ausgeführt. `parser-results.json` weist für jede der 30 neuen Suchanfragen die aufgerufenen Exportfunktionen, ihre Aufrufzahlen und Änderungen an den Suchparametern nach. Die Parser sind bereits verdrahtet; die Korrekturen betreffen die Übertragung erkannter Merkmale und einzelne Formulierungen.

| Datei | Aufruf in der Suche |
| --- | --- |
| cityParser.ts | `parseCitySearch` |
| natureParser.ts | `parseNatureSearch` |
| romanceParser.ts | `parseRomanceSearch` |
| luxuryParser.ts | `parseLuxurySearch` |
| sustainabilityParser.ts | `parseSustainabilitySearch` |
| securityParser.ts | `parseSecuritySearch` |
| extendedSearchParser.ts | `parseExtendedSearch` |
| hotelStarsParser.ts | `parseHotelStars` |
| preferenceParser.ts | `parsePreferences` |
| searchParamCleanup.ts | `cleanupSearchParams`, zweimal pro erfolgreicher Anfrage |
| dbFeatureMapper.ts | `mapSearchParamsToDbFeatures` |
| parserUtils.ts | `containsAnyWholeTerm`, über andere Parser |

## Gefundene und behobene Fehler

- Konkrete Merkmale etwa `reception_24h`, `safe`, `solar_power` oder zusätzliche Angebote aus den Fachparsern gingen verloren, wenn die alte Mappingtabelle keinen Eintrag hatte. Erkannte Sachmerkmale werden jetzt als strenge Featurefilter übertragen. Allgemeine Reiseanlässe und Themen werden dabei nicht automatisch als Ausstattung ausgegeben.
- Strukturierte Anbieterangaben für zusätzliche angefragte Merkmale werden auch über die drei gemeinsamen Datenquellen geprüft. Eine unbekannte Angabe bleibt unbekannt; Werbebeschreibungen werden nicht als Ausstattungsbeleg verwendet.
- „E-Ladestation“, „privater Wallbox“, „nahe am Wald“ und „mit privatem Kino“ werden berücksichtigt. Wünsche und Ausschlüsse für Ladestation, Rezeption und Safe bleiben von Pflichtmerkmalen getrennt.
- Eine Rezeption aus dem älteren Parserformat `24h_reception` erhält denselben kanonischen Schlüssel. Ein Schlafsofa erfüllt das allgemeine Sofamerkmal. Eine private Ladestation erfüllt die allgemeine Ladeanforderung; umgekehrt reicht eine allgemeine Ladestation nicht für „privat“.
- „Berlin in der Altstadt“, nachgestellte Sternebereiche und „Berlin Solarstrom wäre schön“ werden nicht mehr als unbekannter Ortsname interpretiert. Mehrteilige Namen wie „Neustadt in Holstein“ und „Königstein in der Sächsischen Schweiz“ bleiben erhalten.
- Neue verständliche Kriterien- und Kartenlabels ergänzen die vorhandenen Icons. Pro Karte werden weiterhin höchstens fünf bestätigte Merkmale angezeigt.

## Prüfumfang

**302 reguläre Tests plus 60 Diagnosefälle: 362 bestanden, 0 fehlgeschlagen.** Die bestehenden 100 Kombinationstests behalten ihre Erwartungen. Neu sind 30 Suchfälle mit unabhängigen erwarteten Ergebnismengen sowie elf Prüfungen für die drei Datenquellen, widersprüchliche Angaben, Nulltreffer unter 1.501 Objekten, vollständige Wörter, Ortsgrenzen und die Fünfergrenze.

Die Laufzeitbeobachtung sitzt ausschließlich im Test-Lader und verändert keine Parser-Entscheidungen. Der echte Searchbox-Controller und die echte GET-Route werden ausgeführt; nur externe Datenbank-/KI-Grenzen sind kontrolliert. Die Beispielobjekte sind ausschließlich Testdaten. Ein pauschal leeres Ergebnis kann die positiven Ergebnismengen nicht bestehen.

TypeScript sowie ESLint auf allen geänderten Anwendungsmodulen sind erfolgreich. Nach Veröffentlichung werden 130 echte Produktionsanfragen und Browserfälle im zugehörigen PR dokumentiert. Ein Aufrufnachweis für alle Dateien bedeutet nicht, dass jeder Zweig oder jede beliebige Formulierung erschöpfend geprüft wurde. Tatsächliche Treffer benötigen weiterhin passende und bestätigte Anbieterangaben.

```bash
npm test
node node_modules/typescript/bin/tsc --noEmit
node audits/search-2026-11-07/verify-live.mjs /absoluter/pfad/live-results.json
```
