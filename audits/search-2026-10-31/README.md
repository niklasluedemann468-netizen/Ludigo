# 50 gemischte Suchkombinationen und Ausstattungskarten

## Gemeldeter Fehler und Datenbefund

„Camping am Meer“ und „am Meer“ wurden als `near_sea` erkannt. Die bisherigen Importdaten enthielten jedoch überwiegend keine solchen booleschen Lagekennzeichen. Der mitgelieferte Campingfeed enthält 1.152 Datensätze mit Koordinaten. Die Hoteltabelle aus `LISTE AFFILATE.xlsx` enthält 799 Zeilen, aber keine Ausstattungsfelder. Deshalb waren die Karten im Screenshot ohne Ausstattungs-Icons und die positiven Meeresfilter schlossen unbekannte Werte aus.

## Änderungen

- Jede Karte zeigt höchstens **fünf** bekannte, nicht redundante Merkmale, unabhängig davon, ob die Merkmale im Suchtext vorkamen. Passende Suchkriterien erhalten Vorrang. Ohne bestätigte Ausstattungsdaten erscheint ein Info-Icon mit „Ausstattung noch nicht hinterlegt“. Es werden keine fünf Merkmale erfunden.
- Strukturierte Angaben aus `amenities`, `facilities`, `features`, `equipment` und entsprechenden vorhandenen `raw_data`-Listen werden für alle Quellen gelesen. Boolesche Zeichenketten, definierte Aliasnamen und deutsch beschriftete Merkmale werden unterstützt. Marketingbeschreibungen werden nicht als Ausstattung interpretiert. Widersprüche bleiben unbekannt.
- Fehlende Meereslage kann aus vorhandenen gültigen Koordinaten und einer offline gespeicherten Küstenkarte ergänzt werden. Der Bereich ist auf Europa und angrenzende Inseln begrenzt. Maximal 1.000 Meter zur **kartierten** Küstenlinie werden als Meernähe betrachtet und auf der Karte als „Küste ca. … m“ mit Erläuterung angezeigt. Das ist eine ungefähre Luftlinie, kein bestätigter Strandzugang, keine Wegstrecke und keine Garantie punktgenauer Kartendaten. Explizite Anbieterangaben haben Vorrang. Aus einer nicht gefundenen Küste wird keine bestätigte Abwesenheit abgeleitet.
- Die Küstenberechnung ergibt im mitgelieferten Feed **207** Küstentreffer. Steinhuder Meer, Gardasee und andere Binnenlagen werden dadurch nicht zum Meer. Neue Suche benötigt weder einen Geodienstschlüssel noch externe Kartenabfragen bei jeder Anfrage.
- „wären schön“, Orte vor Doppelpunkt bzw. „nahe“, gemeinsame Preisunter-/obergrenzen und „mit eigenem Bad“ wurden korrigiert.
- Ein Reisemonat ist zunächst Reisekontext. Bestätigte Öffnungsmonate schließen bekannte Schließzeiten aus; fehlende Öffnungsdaten schließen nicht mehr sämtliche Importe aus. Tagesverfügbarkeit bleibt ausdrücklich `not_checked` und ist beim Anbieter zu prüfen.
- Für Pflichtmerkmale ohne irgendwelche bestätigten Angaben wird das fehlende Merkmal namentlich gemeldet. Fehlende Pool-, Hunde-, Kapazitäts- oder Preisangaben werden weiterhin nicht als erfüllt ausgegeben.

## Datenquelle der Küstenkarte

[Natural Earth, 1:10m Coastline](https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-coastline/), Public Domain gemäß [Nutzungsbedingungen](https://www.naturalearthdata.com/about/terms-of-use/). Der Datensatz ist generalisiert und kann örtliche Ungenauigkeiten enthalten. Er umfasst auch das Kaspische Meer; dieses liegt außerhalb des hier verwendeten Ausschnitts. Die Quelle und ihr SHA-256 stehen in `app/data/coastline-europe.json`. Der komprimierte Ausschnitt wird ausschließlich serverseitig verwendet.

Reproduzieren mit der dort angegebenen Originaldatei:

```bash
node scripts/prepare-coastline.mjs /absoluter/pfad/ne_10m_coastline.geojson
```

Es wurden keine Supabase-Daten geschrieben, keine Hotelmerkmale recherchiert oder hinzu erfunden, keine Angebotsziele und keine Logo-Dateien geändert. Für echte Ausstattungs-Icons bei jedem einzelnen Hotel müssen die entsprechenden Anbieterangaben in der Datenquelle vorliegen.

## Prüfmethode und Ergebnisse

`wild-cases.mjs` enthält exakt 50 von Hand festgelegte Kombinationen: Meer-/Binnenlage, Hund, Pool, WLAN, Muss/Wunsch/Ausschluss, Rollstuhleignung, einzelne barrierefreie Einrichtungen, Kapazität, Baby, Schlafzimmer, Sterne, Bewertung, Preisgrenzen, Gesamtbudget, privater Pool/Sauna, bewachtes Parken, Verpflegung, Datum und widersprüchliche Wünsche.

`tests/wild-search.test.mjs` führt den wirklichen Searchbox-Parser und danach die wirkliche GET-Route aus. Nur die externen Datenbank-/KI-Grenzen werden simuliert. Erwartete Treffer stammen aus einer unabhängigen, handgeschriebenen Tabelle. 46 Fälle vergleichen konkrete Ergebnismengen; vier verlangen eine verständliche Ablehnung ungültiger bzw. widersprüchlicher Eingaben. Der Bericht enthält einen SHA-256 des Anwendungscodes einschließlich der Kartendaten.

Der Ausgangslauf zeigte 36 erfolgreiche Prüfungen und 14 Abweichungen. Eine Abweichung war eine zu strenge Testannahme: „mit drei Schlafzimmern“ bedeutet im vorhandenen Vertrag mindestens drei, erst „genau“ setzt auch eine Obergrenze. Dieser Fall wurde entsprechend korrigiert und bleibt als positive Trefferprüfung erhalten. Die übrigen 13 Abweichungen betrafen die oben beschriebenen Daten- und Parserpfade. Der Ausgangsbericht `baseline-wild-results.json` bleibt unverändert; seine Methodenzeile enthält irrtümlich 45/5 statt der tatsächlich ausgeführten 46/4 Fälle.

Der korrigierte Lauf steht in `wild-results.json`: **50 bestanden, 0 fehlgeschlagen**. Insgesamt bestanden **135 reguläre Tests plus 60 historische Diagnosefälle = 195 Prüfungen mit 0 Fehlschlägen**. TypeScript und ESLint auf allen geänderten Such-/Darstellungsmodulen sowie der Kartenaufbereitung sind ebenfalls ohne Fehler. Zusätzliche Regressionstests prüfen die Fünfergrenze, leere Karten, strukturierte Anbieterangaben, Datenwidersprüche, echte Feed-Koordinaten, Binnenlagen und ausdrücklich unbekannte Verfügbarkeit. Die bisherigen regulären Tests sowie die 60 historischen Diagnosefälle bleiben bestehen.

Nach Veröffentlichung prüft `verify-live.mjs` dieselben 50 Kombinationen nochmals gegen die öffentliche GET-Route (46 echte HTTP-Anfragen und vier erwartete lokale Ablehnungen). Leere Ergebnismengen werden als `no_matching_data` ausgewiesen, nicht als erfüllte Reisewünsche. Die beiden gemeldeten einfachen Meer-Suchen müssen echte Treffer liefern. Alle zurückgegebenen Pflicht-/Ausschlussmerkmale werden kontrolliert. Der Live-Stand wird im zugehörigen GitHub-PR dokumentiert.

```bash
npm test
node node_modules/typescript/bin/tsc --noEmit
node audits/search-2026-10-31/verify-live.mjs /absoluter/pfad/live-results.json
```

Dies belegt die ausgeführten Fälle, keine mathematische Fehlerfreiheit jeder denkbaren Freitextformulierung und keine Existenz beliebiger Wunschkombinationen im Unterkunftsbestand.
