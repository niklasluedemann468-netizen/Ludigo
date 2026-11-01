# Mehrfachkriterien: 100 gezielte Kombinationen

## Ergebnis des automatisierten Prüflaufs

**100 neue Kombinationsprüfungen bestanden, 0 fehlgeschlagen.** Zusammen mit den bestehenden Prüfungen sind es **235 reguläre Tests plus 60 historische Diagnosefälle = 295 erfolgreich, 0 fehlgeschlagen**. TypeScript und ESLint auf den geänderten Suchmodulen sind ebenfalls fehlerfrei. Die Ergebnismengen werden anhand ausreichend beschriebener, kontrollierter Testobjekte geprüft; das bedeutet nicht, dass für jeden Wunsch tatsächlich ein Anbieterangebot existiert.

Der Ausgangslauf auf dem veröffentlichten Stand `109d8a1` zeigte 69 erfolgreiche Prüfungen und 31 Abweichungen. `baseline-results.json` bewahrt diesen Lauf unverändert; `criteria-results.json` enthält den korrigierten Lauf. Die erwarteten Filter und Ergebnismengen wurden nicht abgeschwächt. Der Bericht enthält einen SHA-256 aller TS-/TSX-/JSON-Dateien unter `app/`.

## Korrekturen

- Der ausdrücklich genannte Tippfehler „am Merr“ wird im Reisekontext konsistent als „am Meer“ verarbeitet. Es werden keine beliebigen Ortsnamen ähnlich klingend ersetzt. Die Originaleingabe bleibt im Suchfeld sichtbar.
- Preisangaben werden auch bei anderer Wortstellung zusammengeführt: „max Preis 40€ … pro Nacht“, „Preis maximal 40 € pro Nacht“, „maximal 40€ und pro Nacht“ sowie „insgesamt maximal 280 € für sieben Nächte“. Nachtgrenzen, Gesamtbudgets, Untergrenzen und Preise pro Person bleiben getrennt; ein Gesamtbudget wird nach der endgültigen Reisedauer umgerechnet.
- Lokale Merkmals- und Budgetauswertung läuft vor der Entscheidung über eine optionale KI-Ergänzung. Die vollständig lokal erkennbare Beispielanfrage „max Preis 40€ und am Merr pro Nacht“ benötigt keinen KI-Aufruf.
- Wunsch- und Muss-Wörter beziehen sich auf die nächste zusammenhängende Merkmalsgruppe. In „Camping am Meer Hunde und Pool wären schön“ bleibt Meernähe Pflicht, während Hund und Pool Wünsche sind. „WLAN muss sein, Pool wäre schön“ verändert keine zuvor genannte Meeres- oder Seenlage. Ganze Wörter und explizite Listenverbindungen verhindern, dass bloße Teilwörter oder entfernte Kriterien dieselbe Wunschmarkierung erhalten.
- „Hunde“ ohne vorausgehendes „mit“ wird bei Wunschformulierungen berücksichtigt. Ortsgrenzen vor „Preis“, „Budget“, „max“ und „Hunde“ verhindern, dass solche Zusätze Bestandteil des Stadtnamens werden.
- Erkannte Nachtpreis- und Gesamtbudgetgrenzen werden mit Euro-Icon und Betrag oberhalb der Ergebnisse angezeigt. Bei fehlenden bestätigten Nachtpreisen oder Belegungsdaten benennt die API die konkrete Datenlücke.

Die bisherige Fünfergrenze je Ergebniskarte, die Trennung von unbekannt/ja/nein, die Kartenkennzeichnung berechneter Küstennähe und der Hinweis auf nicht geprüfte Buchbarkeit bleiben erhalten. Datenbankbestand, Logo, Angebotslinks und Zahlungsintegration werden nicht geändert.

## Was die 100 Fälle prüfen

Zehn Suchbasen (Camping, Hotel, Ferienwohnung bzw. alle Unterkünfte; Meer, Nordsee, Berlin, Alicante und allgemeine Wassernähe) werden mit zehn unabhängig beschriebenen Kriteriengruppen kombiniert. Dazu gehören Hund, Pool, WLAN, Wunsch/Muss/Ausschluss, unterschiedliche Positionen einer 40-Euro-Grenze, Gesamtbudget 280 Euro für sieben Nächte sowie zwei Erwachsene und ein Baby. Die konkrete Nutzeranfrage „max Preis 40€ und am Merr pro Nacht“ ist als eigener Fall enthalten.

Die Erwartung ist eine unabhängige, explizite Mengenüberschneidung anhand handgeschriebener Objektlisten. Sie verwendet weder den Produktionsfilter noch dessen berechnete Kriterien. Der wirkliche Searchbox-Controller erzeugt die Anfrage, danach wird die wirkliche GET-Route geladen; ausschließlich die externen Datenbank-/KI-Grenzen sind kontrolliert simuliert. Jeder Fall prüft Typ, Pflichtfilter, Wünsche, Ausschlüsse, Zahlenwerte, sichtbare Preisgrenze und exakte Ergebnismenge. Ein pauschal leeres Ergebnis könnte diese Tests nicht bestehen.

## Live-Prüfung

Nach erfolgreichem Vercel-Build werden dieselben 100 gültigen Kombinationen mit `verify-live.mjs` als echte HTTP-Anfragen gegen die öffentliche GET-Route geprüft. Leere Suchen werden ausdrücklich als `no_matching_data` ausgewiesen. Kontrolliert werden alle tatsächlich zurückgegebenen Pflicht-/Ausschlussmerkmale, Typ, Ort, Preisgrenze, Währung, Kapazität und Fünfergrenze. Die Nutzerbeispiele werden zusätzlich im Browser eingegeben. Der Live-Bericht wird im zugehörigen GitHub-PR dokumentiert.

## Datenlimit: Hund und Preis

„Mit Hund“ erfordert eine bestätigte Hundefreigabe. Ein Nachtpreisfilter erfordert einen bestätigten Nachtpreis und dessen Währung. Die vorhandenen Camping-Partnerpreise haben weiterhin keine bestätigte Nachtpreisbasis; diese Werte werden deshalb nicht still als Nachtpreise verwendet. Die Rohdatei enthält bei `Travel:duration` nur Zahlen. Die [offizielle Awin-Spaltenbeschreibung](https://help.awin.com/developers/docs/hosting-feeds) erlaubt dagegen unterschiedliche Einheiten wie Tage, Stunden oder Nächte. Aus der bloßen Zahl lässt sich daher keine belastbare Nachtpreisbasis ableiten. Fehlende Anbieterangaben bleiben eine Datenlücke, keine erfüllte Anforderung.

```bash
npm test
node node_modules/typescript/bin/tsc --noEmit
node audits/search-2026-11-01/verify-live.mjs /absoluter/pfad/live-100-results.json
```

„0 Fehler“ bezeichnet die ausgeführten Prüfungen. Eine Garantie für jede denkbare Formulierung oder die Existenz jeder Wunschkombination kann daraus nicht abgeleitet werden.
