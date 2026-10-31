# Korrigierte Suchlogik

Die Korrektur führt lokale Textauswertung, optionale KI-Ergänzung und alle Unterkunftsquellen auf gemeinsame, validierte Kriterien zurück. Das Logo und die Angebotslinks wurden nicht verändert. Es wurden keine Supabase-Daten geschrieben oder Tabellen geändert.

## Verhalten nach der Korrektur

- Camping, eigene Unterkünfte und Expedia-Hotels durchlaufen dieselben Orts-, Merkmals-, Bewertungs-, Kapazitäts-, Preis- und Monatsfilter.
- Ein erfolgloser Featurejoin der Hauptquelle beendet nicht mehr die Abfrage anderer Quellen.
- `guests` ist Reisekontext. `max_guests` verlangt eine bestätigte Kapazität. Die voreingestellten zwei Reisenden blockieren Hotelimporte nicht; ausdrücklich genannte oder im Formular geänderte Gästezahlen bleiben Pflichtfilter.
- Explizite boolesche Spalten oder Featureverknüpfungen können ein Merkmal bestätigen. Widersprüchliche Angaben bestätigen weder Vorhandensein noch Abwesenheit. Negative Filter verlangen eine bestätigte Abwesenheit; fehlende Werte werden nicht als `false` behandelt.
- Komma und Tausenderpunkt bleiben in Geldbeträgen erhalten. Gesamtbudgets werden nach Zusammenführung von Text und Formularzeitraum in Nachtgrenzen umgerechnet. Untergrenzen und Preise pro Person werden berücksichtigt.
- Muss und Wunsch werden dem jeweiligen Satzteil zugeordnet. Die Hierarchie berücksichtigt unter anderem optionale private Pools, ohne einen privaten Pool mit einem allgemeinen Pool gleichzusetzen.
- Präzisierungen wie `beachfront`, `private_sauna` und `guarded_parking` bleiben erhalten. Stadtzentrum und Flughafennähe werden an die Filter weitergegeben. Ein Strand wird nicht automatisch zu einer Meereslage.
- Ortsnamen wie Heidelberg und Nordsee erzeugen keine zusätzlichen Berg- bzw. Binnenseefilter. Ein nicht auflösbares Reiseziel wird nicht still durch allgemeine Treffer ersetzt.
- Babys werden mitgezählt, `Schlafzimmern` wird erkannt, der gewählte Unterkunfts-Tab hat Vorrang und wird bei abweichendem Text erklärt.
- Explizite Jahreszahlen, benannte und numerische Datumsspannen, ISO-Daten und Jahreswechsel werden berücksichtigt. Ungültige Daten und widersprüchliche Zeiträume führen zu einer verständlichen Meldung.
- Der erste unbedingte KI-Aufruf entfällt. Ein optionaler Fallback ergänzt ausschließlich geprüfte, fehlende Kriterien. Ortswerte aus dem lokalen Parser haben Vorrang. Das Backend verwendet Structured Outputs, eine Feature-Whitelist, begrenzte Laufzeit ohne automatische Wiederholungen, Eingabelimits und einen instanzlokalen Aufrufzähler.
- Erkannte, aber noch nicht unterstützte Detailwünsche werden sichtbar gemeldet. Nicht bestätigbare Pflichtmerkmale ergeben keine scheinbar passenden Treffer.
- Alle Quellen erhalten ein gemeinsames Ranking. Bewertungen werden anhand ihrer Punkteskala verglichen und mit `/5` bzw. `/10` angezeigt. Der Sternebonus ist kleiner als der Unterschied einer ganzen Bewertungsstufe.
- Quellendaten werden über die frühere Grenze von 2.000 Datensätzen hinaus gelesen, auch wenn die Datenbank kleinere Antwortseiten liefert. Gesamtmenge, nächste Seite und Sortierung sind serverseitig konsistent. Die Oberfläche lädt weitere Treffer nach und sortiert die gesamte Treffermenge vor der Seitenauswahl. Fehler beim Nachladen erhalten die bisherige Liste.
- Fehler einzelner Quellen und die technische Sicherheitsgrenze von 50.000 gelesenen Datensätzen pro Tabelle werden ausdrücklich gemeldet. Sie werden nicht als vollständige, leere Suche ausgegeben.

## Supabase-Vertrag für den Hotelimport

Die vorhandenen Clients und Berechtigungen bleiben unverändert. Abgefragt werden `accommodations`, `features`, `accommodation_features`, `camping_info_campsites` und `expedia_accommodations`. Die Implementierung verwendet ausschließlich Leseabfragen. Optionale Spalten dürfen fehlen; eine fehlende Angabe kann dann jedoch keinen Pflichtfilter erfüllen.

| Daten | Bedeutung |
|---|---|
| `city`, `region`, `country` | Ortswerte, entsprechend den üblichen deutschen Orts- und Ländernamen; Groß-/Kleinschreibung und Umlaute werden beim Vergleich normalisiert. |
| `max_guests` | Bestätigte maximale Kapazität, keine frei erfundene Standardbelegung. |
| `price_min`, `currency` | Bestätigter Katalogpreis pro Nacht und dessen Währung. Ohne bestätigte Preisbasis erfüllt ein Datensatz keinen Nachtpreisfilter. |
| `price` im Campingfeed | Bleibt als unbestätigte Partnerpreisangabe getrennt. |
| `has_pool`, `has_wifi`, `dogs_allowed` usw. | `true` bestätigt vorhanden/erlaubt, `false` bestätigt nicht vorhanden/nicht erlaubt, `null` oder fehlend bedeutet unbekannt. |
| `features.key` und `accommodation_features` | Bestätigte Merkmale der eigenen Unterkünfte. Eine Verknüpfung kann ein unbekanntes boolesches Feld ergänzen, aber keinen widersprüchlichen `false`-Wert überschreiben. |
| `review_score` bzw. `rating`, optional `review_scale` | Zahlenwert und Skala 5 oder 10. Konvention ohne explizite Skala: Campingfeed 5, eigene und Expedia-Unterkünfte 10. Beim Import einer anderen Skala ist `review_scale` ausdrücklich anzugeben. |
| `available_months` | Optionale, bestätigte Monate 1–12. Die Monatsangabe ersetzt keinen Buchungskalender. |
| `affiliate_url`, alternativ `booking_url` / `website_url` | Tatsächliche Angebotsziele. Expedia-Einträge ohne Angebotslink werden nicht angeboten. |

Frei formulierte Marketingbeschreibungen werden nicht länger als Beweis für Ausstattung verwendet. Das verhindert zum Beispiel, dass die bloße Erwähnung eines Schwimmbads in der Umgebung einen eigenen Pool bestätigt.

## Tests und Reproduzierbarkeit

```bash
npm test
node node_modules/typescript/bin/tsc --noEmit
```

`npm test` kombiniert die regulären Tests unter `tests/` mit den 60 Diagnosefällen. Die neuen Regressionstests laden den wirklichen Parser und die wirkliche GET-/POST-Implementierung. Nur externe KI- und Datenbankgrenzen werden simuliert. Zusätzlich werden der tatsächliche Suchcontroller, Nachladen, globale Sortierung, Fehlererholung, Datumswechsel und ungültige Anfragen geprüft.

`baseline-results.json` enthält unverändert den Ausgangsbefund. `results.json` enthält den aktuellen Diagnoselauf und einen SHA-256-Fingerabdruck aller TypeScript-/TSX-Dateien unter `app/`, damit auch ein geprüfter Arbeitsstand vor seinem Commit nachvollziehbar bleibt.

Zwei Diagnoseannahmen wurden dem expliziten Datenvertrag angepasst: Die React-Attrappe kennzeichnet geänderte Formularreisende als geändert. Der Pflichtmerkmal-Kontrollfall entfernt sowohl eine Spaltenbestätigung als auch die Verknüpfung; eine bestätigte Spalte allein darf nach der Korrektur ausdrücklich genügen. Die Erwartungen an Pflichtfilter wurden nicht gelockert. Die übrigen ursprünglichen Prüferwartungen bleiben bestehen.

Der Prüflauf belegt die ausgeführten Fälle und garantiert keine Fehlerfreiheit jeder denkbaren Freitextformulierung. Direkte Prüfung des Supabase-Bestands, RLS/Indizes und aller tatsächlichen Partnerangebote ist weiterhin eine gesonderte Datenprüfung.

## Verfügbarkeit und Betrieb

Die API gibt `availability.status = "not_checked"` zurück. Reisezeitraum und Nächte sind gültiger, sichtbarer Reisekontext; tagesgenaue Buchbarkeit wird ohne Kalender-/Partneranbindung nicht behauptet. Die Oberfläche verweist weiter auf die Prüfung beim Anbieter.

Der optionale KI-Fallback nutzt die vorhandene serverseitige `OPENAI_API_KEY`-Variable. `OPENAI_SEARCH_MODEL` kann das Modell konfigurieren; Standard ist `gpt-4.1-mini`. Die instanzlokale Begrenzung ersetzt keine hostingweite Begrenzung über mehrere Serverinstanzen.

Technische Grundlage des strukturierten Ausgabeformats: [OpenAI Docs – Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs). Die Modellfunktionen wurden anhand der [offiziellen Modellseite](https://developers.openai.com/api/docs/models/gpt-4.1-mini) geprüft.
