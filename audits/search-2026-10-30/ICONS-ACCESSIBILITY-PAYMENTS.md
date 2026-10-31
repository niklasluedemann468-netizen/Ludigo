# Ergänzende Prüfung: Icons, Barrierefreiheit und Zahlungen

Stand: 31. Oktober 2026. Das Logo und die vorhandenen Affiliate-Ziele bleiben erhalten. Es wurden keine Unterkunftsdaten, Datenbanktabellen oder Zahlungsanbieter-Konten verändert.

## Gefundene und korrigierte Suchfehler

- Nachgestellte Kriterien wie „Berlin barrierefrei“, „Berlin ohne Aufzug“ oder „Berlin direkt am Strand“ wurden teilweise dem Ortsnamen zugeschlagen. Die Ortsgrenze erkennt diese Kriterien jetzt getrennt.
- Spezielle Barrierefreiheitsmerkmale wurden erkannt, aber teilweise als unprüfbare semantische Parameter entfernt. Die entsprechenden Merkmale werden jetzt als eigene boolesche Pflicht-/Wunschfilter verarbeitet: unter anderem stufenloser Zugang, bodengleiche Dusche, Duschsitz, breite Türen, Behindertenparkplatz und Rollstuhlverleih.
- Allgemeine Barrierefreiheit, Rollstuhleignung und einzelne barrierefreie Einrichtungen sind getrennt. Ein barrierefreies Bad bestätigt nicht die gesamte Unterkunft; eine ebenerdige Dusche bestätigt keinen stufenlosen Zugang zum Gebäude.
- Meer-, See-, Strand-, Fluss- und allgemeine Wassernähe sind getrennt. Bestätigte Meeres-, See-, Fluss- oder Strandnähe kann allgemeine Wassernähe erfüllen. Ein Strand bestätigt keine Meereslage.
- „Ohne Aufzug“ verlangt eine bestätigte Abwesenheit. „Barrierefrei wäre schön“ bleibt optional. „Pool ist kein Muss“ verlangt keinen Pool.
- Fahrradverleih verlangt keine zusätzliche Bestätigung einer Radfahraktivität.
- Widersprüchliche boolesche Aliasfelder, etwa `has_wifi=false` und `wifi=true`, beweisen weder Vorhandensein noch Abwesenheit.

## Ergebnisdarstellung und Bedienbarkeit

Alle validierten Kriterien haben eine deutsche Textbeschriftung und ein passendes SVG-Icon. Meer-/Strand-/Wassernähe verwenden das Strand-/Sonnenschirmmotiv, weitere Merkmale unter anderem Rollstuhl, Dusche, Aufzug, Hundepfote, Fahrrad, Wellness, Küche und Parkplatz. Oberhalb der Treffer werden die tatsächlich abgesendeten Kriterien separat mit Icons dargestellt; Wünsche und Ausschlüsse sind beschriftet.

Ergebniskarten zeigen ausschließlich bestätigte Eigenschaften. Unbekannte oder widersprüchliche Angaben erzeugen keine Ausstattungs-Icons. Spezifische Merkmale ersetzen redundante allgemeine Abzeichen. Alle Unterkunftsquellen liefern auch Merkmale, die nicht ausdrücklich Teil der Anfrage sind, sofern sie bestätigt sind. Für eigene Unterkünfte werden entsprechende Merkmalsverknüpfungen gelesen.

Beschriftete SVGs ergänzen lesbaren Text und sind für assistive Technologien dekorativ. Fokusmarkierungen umfassen auch ausklappbare Bedienelemente, Suchhinweise sind dem Feld zugeordnet und zentrale Icon-Schaltflächen haben mindestens 44 × 44 CSS-Pixel. Der Merkliste wurde ein React-konformer externer Speicher gegeben; der bestehende Speicherschlüssel bleibt erhalten, blockierter Browserspeicher wird abgefangen und Änderungen anderer Tabs werden berücksichtigt.

Die neu verwendeten Text-/Hintergrundkombinationen wurden rechnerisch geprüft: Standardtext auf Mint 10,54:1, Grün auf Mint 5,82:1, gedämpfter Text auf Creme 4,59:1 und Testhinweis 7,44:1. Dies ist keine vollständige WCAG-Konformitätszertifizierung.

## Zahlungsfunktion

Ein gemeinsamer Buchungsbereich ist in Busreisen, LÜDIGO Bike und LÜDIGO Surprise sowie auf `/reisen` eingebaut. Er öffnet konfigurierte Stripe Payment Links. Angebot, Preis, Termin und Zahlung werden auf Stripe abschließend geprüft. Die Website speichert keine Karten-/Kontodaten und bestätigt keine Zahlung anhand einer Rückkehr-URL.

Ohne konfigurierte echte Reiseangebote erscheinen keine Zahlungsbuttons. Unvollständige Konfiguration, fremde Domains, ausführbare URLs, Zugangsdaten in URLs, Redirect-Parameter und standardmäßig auch Testlinks werden verworfen. Ausdrücklich aktivierte Testangebote tragen einen sichtbaren Testhinweis. Die Aktivierung und die notwendige Zuordnung bestätigter Zahlungen beim Betreiber beschreibt [ZAHLUNGEN.md](../../docs/ZAHLUNGEN.md).

Ein verifiziertes Stripe-Konto und die echten Angebotslinks wurden nicht bereitgestellt; echte Zahlungen wurden deshalb weder freigeschaltet noch ausgelöst. Eine automatische Buchungs-/Sitzplatzverwaltung ist nicht Bestandteil einer Payment-Link-Integration.

## Validierung

`npm test` führt die bisherigen regulären Tests, die neuen End-to-End-Tests zwischen wirklicher Searchbox und wirklicher GET-Route, Rendering-/Icon-Tests und die 60 historischen Diagnosefälle aus. Externe Datenquellen sind in den automatisierten Tests kontrolliert simuliert. Zusätzliche Tests prüfen die tatsächliche Buchungskomponente, Weltzuordnung, Testmodus, ungültige Zahlungslinks und die Merkliste.

Ergebnis: 76 reguläre Tests und 60 Diagnosefälle bestanden, insgesamt **136 erfolgreich und 0 fehlgeschlagen**.

TypeScript wird mit `node node_modules/typescript/bin/tsc --noEmit` geprüft. ESLint wird auf die geänderten Suchmodule, die Ergebnis-/Reisewelt-/Buchungskomponenten und `/reisen` angewendet. Der Produktionsbuild erfolgt auf Vercel; eine lokale Browser-Vorschau ist wegen des fehlenden Preview-Daemons nicht verfügbar. Die anschließende Live-Prüfung wird im GitHub-PR dokumentiert.

Bestandene Tests belegen diese Prüffälle. Beliebige Freitexte, die Richtigkeit aller tatsächlichen Unterkunftsangaben, vollständige Barrierefreiheit vor Ort und zukünftige Partner-/Zahlungsdienste sind damit nicht pauschal garantiert. Fehlende Pflichtdaten bleiben ausgeschlossen und tagesgenaue Buchbarkeit bleibt ohne entsprechende Partnerdaten unbestätigt.
