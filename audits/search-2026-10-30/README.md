# LÜDIGO – Prüfung der Unterkunftssuche

> Historischer Ausgangsbefund. Die anschließenden Korrekturen und der aktuelle Prüfstand stehen in [FIXES.md](./FIXES.md). Die unveränderten ursprünglichen Prüfergebnisse wurden in `baseline-results.json` erhalten; `results.json` enthält den jeweils neuesten Lauf.

Stand: 30. Oktober 2026. Geprüfter Produktivstand: `61de11f2de4c77b91a18e7a25bf58e2c87dcece8`.

Die Suche hat bestätigte Logikfehler. Fehlende Hotels, Links oder Ausstattungsdaten in Supabase erklären nur einen Teil der Probleme. Weitere Daten allein beheben die hier beschriebenen Fehler nicht.

## Umfang und Methode

Geprüft wurde die gesamte Verarbeitungskette: Formularwerte, KI-Aufruf, Normalisierung, lokaler Parser in `SearchBox.tsx`, die eingebundenen Fachparser für Natur, Stadt, Romantik, Luxus, Nachhaltigkeit, Sicherheit und erweiterte Wünsche, Hotelsterne, Wunsch-/Muss-Erkennung, Bereinigung, Feature-Mapping, API-Whitelist, Supabase-Abfragen der drei Datenquellen, Ranking und Ergebnisdarstellung.

Die Diagnose lädt den unveränderten Produktivcode. React-Zustand, KI-Antworten und Supabase werden an den äußeren Schnittstellen kontrolliert simuliert. Die Datenbankattrappen wenden die tatsächlich aufgebauten Filter an. Positive Kontrollfälle prüfen unter anderem Ort, Gäste, Hotelsterne, Pflicht-/Wunschfilter und Preisfilter der Hauptquelle. Es werden keine echten KI-Anfragen oder Datenbankänderungen durch das Diagnoseskript ausgelöst.

**Ergebnis: 60 gezielte Prüfungen, davon 24 erfüllt und 36 mit Abweichung.** Mehrere Prüfungen betreffen dieselbe Ursache. Die Fälle wurden gezielt zur Prüfung von Fehlergrenzen gewählt; diese Zahlen sind kein statistischer Qualitätsscore und keine Aussage über alle möglichen Suchformulierungen.

Zusätzlich wurde auf der Live-Website `Camping am Gardasee Bewertung mindestens 4,5` eingegeben. Das Browserprotokoll zeigte `min_review_score=4.5` in der tatsächlich versendeten Anfrage. Die Seite meldete trotzdem 12 Treffer, darunter Camping Bella Italia mit 3,3, Camping Butterfly mit 3,5 und Camping Cisano mit 3,8. Das bestätigt den Filterfehler der Campingquelle unabhängig von den Simulationen.

Es wurden keine Produktivdateien, Supabase-Daten oder Hosting-Einstellungen geändert. Der direkte Supabase-Datenbestand, RLS-Regeln, Indizes, eindeutige Constraints, Serverprotokolle und die tatsächliche Modellverfügbarkeit wurden nicht geprüft. Tagesgenaue Buchbarkeit lässt sich mit den vorliegenden statischen Unterkunftsdaten nicht bestätigen.

## Befunde nach Priorität

### F01 · Hoch: Campingtreffer umgehen die meisten Pflichtfilter

`app/api/accommodations/route.ts:642–669, 860–864`

Der Campingimport berücksichtigt beim Laden nur Land und Region. Stadt, Mindestbewertung, Gästezahl, Pool, WLAN, Lage und Preis werden nicht gemeinsam auf die importierten Treffer angewendet. Der einzige nachträgliche Ausstattungsfilter reagiert auf `dogs_allowed=true`. Der Textparser erzeugt jedoch normalerweise `feature=dogs_allowed`. Diese beiden Wege passen nicht zusammen.

Nachweise: A04–A13 und A20; zusätzlich der oben dokumentierte Live-Test. Beispielsweise enthält eine simulierte Suche nach `type=campsite&city=Berlin` auch einen Campingplatz in München. Eine Pool-Pflicht lässt einen Datensatz mit `has_pool=false` durch.

Korrektur: Alle Quellen durch denselben Filtervertrag führen. Fehlende Angaben dürfen keine Pflicht erfüllen. Ein unbekannter Preis darf nicht als Einhaltung eines Preislimits gelten. Nicht unterstützte Anforderungen müssen sichtbar gemeldet werden.

### F02 · Hoch: Die Hauptquelle entscheidet vorzeitig über andere Quellen

`app/api/accommodations/route.ts:142–152, 230–237`

Ein unbekanntes Feature oder eine leere Verknüpfungsliste der Hauptquelle beendet die gesamte Anfrage, bevor Camping und Expedia überhaupt geprüft werden. Damit kann ein passender Campingplatz verschwinden, nur weil `accommodation_features` für die andere Tabelle keine passenden Verknüpfungen enthält.

Nachweis: A17. Ein importierter Campingplatz mit `dogs_allowed=true` wird bei leerer Hauptquellen-Verknüpfung nicht mehr abgefragt.

Korrektur: Ergebnisse und Fähigkeiten je Quelle getrennt ermitteln und erst anschließend kombinieren. Die Schutzregel gegen unbekannte Pflichtmerkmale beibehalten, aber nicht an eine fremde Quellentabelle koppeln.

### F03 · Hoch: Die Standard-Personenzahl blockiert Expedia-Hotels

`app/SearchBox.tsx:10782`; `app/api/accommodations/route.ts:882–890`

Das Formular sendet auch ohne ausdrücklich genannten Kapazitätswunsch immer `max_guests=2`. Der Expedia-Zweig schließt sich bei jedem vorhandenen `max_guests` vollständig aus. Deshalb werden importierte Expedia-Hotels über die normale Formularsuche grundsätzlich nicht geladen, selbst bei `Hotel in Berlin`.

Nachweise: P05, A02 und A03. Dieselbe Hotelquelle liefert den Fixture-Treffer ohne `max_guests`; mit `max_guests=2` wird sie nicht einmal abgefragt.

Diese Wechselwirkung wurde durch die frühere Formularanpassung eingeführt. Die Personenzahl für die Reiseplanung und ein ausdrücklich verlangter, bestätigter Kapazitätsfilter müssen unterscheidbar sein. Die Lösung darf nicht darin bestehen, unbekannte Hotelkapazitäten pauschal als bestätigt auszugeben.

### F04 · Hoch: Verneinungen werden umgedreht oder verworfen

`app/SearchBox.tsx:3371–3380, 9958–9965, 10798–10859`; `app/lib/parsers/searchParamCleanup.ts:289–453`

`Camping ohne Hund` erzeugt `feature=dogs_allowed`. Für andere Formulierungen wie `ohne Hunde` oder `ohne Pool` erkennt die Bereinigung zwar Ausschlüsse und entfernt positive Merkmale. Anschließend entfernt die API-Whitelist aber `exclude_feature`. Die Datenbank bekommt dann überhaupt keinen Ausschluss mehr.

Nachweise: P09–P11 und A22. Ob `ohne Hund` lediglich keinen Hunde-Wunsch oder ausdrücklich eine tierfreie Unterkunft bedeutet, kann eine Produktentscheidung sein. Es darf jedoch keinen positiven Hunde-Pflichtfilter auslösen.

Korrektur: Negationen vor positiven Erkennungen auflösen und einen ausdrücklichen Ausschluss bis zur jeweiligen Datenquelle transportieren. Fehlende Daten sind weder eine bestätigte positive noch eine bestätigte negative Eigenschaft.

### F05 · Hoch: Geldbeträge und Gesamtbudgets werden falsch verarbeitet

`app/lib/searchTextNormalizer.ts:261–265`; `app/SearchBox.tsx:9523–9536, 9550–9860, 9872–9905, 10776–10782`; `app/api/accommodations/route.ts:54–61`

Die Normalisierung ersetzt Punkt und Komma durch Leerzeichen, bevor der Preisparser sie auswertet. Dadurch wird `99,50 Euro pro Nacht` zu einer Grenze von **50 Euro**, `1.200 Euro pro Nacht` zu **200 Euro**.

Ein Gesamtbudget wird nur dann in ein Nachtbudget umgerechnet, wenn die Nächte bereits im Text erkannt wurden. Stammt die Dauer aus den Datumsfeldern, wird sie erst später ergänzt. `Hotel Budget 700 Euro` mit sieben Formularnächten sendet dann nur `max_total_price=700`; diesen Parameter wertet die API nicht aus. Auch die Untergrenze eines Gesamtpreisbereichs bleibt unberücksichtigt.

Nachweise: P21–P25. P23 ist ein positiver Kontrollfall: 700 Euro und sieben ausdrücklich genannte Nächte ergeben korrekt maximal 100 Euro pro Nacht.

Korrektur: Zahlen tokenisieren, bevor Satzzeichen normalisiert werden. Reisezeit vor der Budgetumrechnung zusammenführen. Gesamt- und Nachtpreise sowie Preise pro Person getrennt behandeln.

### F06 · Hoch: KI wird vor dem lokalen Parser ungeprüft übernommen

`app/SearchBox.tsx:245–304, 10468–10773`; `app/api/search/route.ts:8–10, 17–83`

Jede normale Suche ruft zunächst die KI auf. Danach gibt es einen zweiten, bedingten KI-Fallback. Der erste Aufruf läuft auch bei einfachen, lokal vollständig verstandenen Anfragen; manche Anfragen lösen zwei Aufrufe aus.

Die Feature-Whitelist und der angekündigte Vorrang lokaler Werte gelten nur für den zweiten Weg. Beim ersten Aufruf gelangen unbekannte Feature-Keys direkt in die Anfrage. Ein KI-Land bleibt teilweise bestehen, obwohl der lokale Parser eine Stadt mit einem anderen Land erkennt. Kontrolliert simuliert ergibt `Hotel in Berlin` mit KI-Land Italien tatsächlich `city=Berlin&country=Italien`.

Nachweise: P32–P34 und P38. Die Aussage über widersprüchliche KI-Werte basiert auf kontrollierten Antworten, nicht auf der Behauptung, das Live-Modell habe genau diese Werte geliefert. Der lokale Parser arbeitet bei einem KI-Ausfall grundsätzlich weiter.

Korrektur: Zuerst lokal parsen, danach höchstens einen ergänzenden KI-Aufruf. Alle Antworten über ein gemeinsames Schema prüfen, bekannte Feature-Keys erzwingen und widersprüchliche Ortsangaben auflösen. Für den öffentlichen KI-Endpunkt fehlen außerdem eine serverseitige Längenbegrenzung und eine im Code erkennbare Begrenzung der Aufrufhäufigkeit.

### F07 · Mittel: Muss und Wunsch gelten irrtümlich für den ganzen Satz

`app/lib/parsers/preferenceParser.ts:45–106`

Ein einziges `muss` macht alle im Text erwähnten Merkmale zur Pflicht. `WLAN muss sein, Pool wäre schön` erzeugt sowohl `must_feature=wifi` als auch `must_feature=pool`. Ein einzelner optionaler Pool funktioniert hingegen korrekt.

Nachweise: P12, P13, P37 und A18–A19. Die serverseitige Unterscheidung zwischen einem korrekt gelieferten Wunsch und einer Pflicht funktioniert in der Hauptquelle.

Korrektur: Wunsch- und Pflichtsignale an die betreffende Formulierung bzw. den jeweiligen Satzteil binden.

### F08 · Mittel: Teilwörter erzeugen zusätzliche Lagefilter

`app/SearchBox.tsx:9911–9965`

Die abschließenden `text.includes(...)`-Regeln überschreiben teilweise die sorgfältigeren Fachparser. `Heidelberg` enthält `berg` und erzeugt deshalb zusätzlich eine Berg-Pflicht. `Nordsee` enthält `see` und erzeugt einen Binnensee-Filter statt einer Meereslage.

Nachweise: P14 und P15. Diese falschen zusätzlichen Pflichtmerkmale können ansonsten passende Hotels ausschließen.

Korrektur: Ortsnamen zuerst erkennen und als Ortsnamen behandeln; anschließend Begriffe mit Wortgrenzen und Kontext prüfen. Die mehrfachen parallel laufenden Erkennungen zusammenführen.

### F09 · Mittel: Datumswerte sind unvollständig und teilweise widersprüchlich

`app/SearchBox.tsx:7247–7458, 7483–7510, 10776–10782`; `app/api/accommodations/route.ts:5–91, 357–359`

Numerische Datumsspannen mit Jahreszahl werden lokal nicht erfasst. Die Suche fällt auf die Formularwerte zurück. Ein explizites `im Juli 2028` verliert das Jahr in der Whitelist. Ein unmögliches Datum wie der 31. Februar wird als `2027-02-31` weitergereicht.

Außerdem kann der Text drei Nächte festlegen, während die mitgesendeten Formularwerte sieben Nächte auseinanderliegen. Der aktuelle Server liest `check_in`, `check_out` und `nights` gar nicht für eine Kalenderabfrage. Lediglich `month` begrenzt die Hauptquelle über `available_months`.

Nachweise: P28–P31 und `coverageNotes` in `results.json`. Zwei völlig unterschiedliche Datumsbereiche erzeugen identische Datenbankabfragen. **Tagesgenaue Verfügbarkeit ist derzeit eine fehlende Anbindung**, nicht durch bloßes Reparieren eines Textparsers herstellbar. Die Website weist bereits darauf hin, Verfügbarkeit beim Anbieter zu prüfen.

Korrektur: Einen gültigen, konsistenten Reisezeitraum bilden und in der Oberfläche anzeigen. Buchbarkeit erst mit einer tatsächlichen Kalender-/Partnerquelle zusagen; Jahres- und Monatskontext bis dorthin nicht still verlieren.

### F10 · Mittel: Gäste, Schlafzimmer und Unterkunfts-Tab sind nicht konsistent

`app/SearchBox.tsx:505–509, 563–565, 705–726, 407–430, 9917–9931`

Beim Baby-RegEx wird die Zahl nicht als Gruppe erfasst, später aber die erste Gruppe als Zahl gelesen. Daher werden `2 Erwachsene und 1 Baby` als zwei Gäste statt drei erkannt. `mit 3 Schlafzimmern` geht wegen der Wortform leer aus; `mindestens 2 Schlafzimmer` funktioniert.

Ein gewählter Hotel-Tab kann durch den Suchtext auf Ferienwohnung umgestellt werden, während die Oberfläche weiterhin Hotels markiert. Ob Tab oder Text Vorrang haben soll, ist eine Produktentscheidung; beide Anzeigen müssen dieselbe Entscheidung darstellen.

Nachweise: P04, P16, P26 und P27.

### F11 · Mittel: Zahlreiche erkannte Anforderungen gehen still verloren

`app/SearchBox.tsx:10798–10859`; `app/lib/parsers/dbFeatureMapper.ts:17–408`

Die Fachparser erkennen viel mehr Parameter, als Mapper, Whitelist und API umsetzen. Beispiele: Flughafennähe, Entfernungsvorgaben, Altersangaben, Ernährungswünsche, Wohnfläche und verschiedene Buchungsbedingungen. Der Besucher erhält keinen Hinweis, dass diese Wünsche unberücksichtigt bleiben.

Auch beim Mapping gehen Einschränkungen verloren: `kostenloser Parkplatz` wird nur zu `parking`. `glutenfreies Frühstück` behält lokal nur die Frühstückspflicht; `dietary_need` wird entfernt. Allgemeine Barrierefreiheit erzeugt zusätzlich eine Pflicht für `wheelchair_accessible`, was eine präzisere Anforderung ist.

Nachweise: P35 und P36 sowie die protokollierten verworfenen Parameter in den explorativen Prüfungen. Die umfassende Erkennung von Begriffen ist daher noch kein Beleg für eine vollständig angebundene Suche.

Korrektur: Einen dokumentierten Katalog tatsächlich unterstützter Filter führen. Nicht unterstützte oder nur teilweise erfüllbare Wünsche in der Oberfläche ausweisen. Keine präzisere Eigenschaft aus einer allgemeineren ableiten.

### F12 · Mittel: Ranking und Datenvertrag gelten nicht für alle Quellen gleich

`app/api/accommodations/route.ts:501–625, 843–855, 947–951`; `app/lib/accommodation-view.ts:12–22`; `app/components/AccommodationPage.tsx:23–39`

Nur die Hauptquelle erhält das Match-Ranking. Camping und Expedia werden danach angehängt. In der Ansicht `Beste Treffer` bleibt diese Reihenfolge erhalten; es gibt keine gemeinsame Rangfolge aller Quellen. Auch die Bewertungssortierung vergleicht Zahlen roh. Unterschiedliche Bewertungsskalen der Partner müssen vor einem Vergleich ausdrücklich vereinheitlicht werden.

Filter der Hauptquelle verlangen Einträge in `features` und `accommodation_features`. Ein bloßes `has_pool=true` in einer Hotelzeile genügt für `feature=pool` nicht. Die Icons lesen dagegen primär die booleschen Ergebnisfelder. Beziehungen und Spalten müssen deshalb konsistent importiert oder gemeinsam normalisiert werden.

Korrektur: Einheitliches Ergebnisformat mit bestätigten Merkmalen, Datenherkunft, Preistyp und Bewertungsskala. Erst danach alle Treffer gemeinsam bewerten und sortieren. Beim Hotelimport den erforderlichen Datenvertrag prüfen.

### F13 · Niedriger: Grenzen und Quellenausfälle sind für Besucher unsichtbar

`app/api/accommodations/route.ts:672–674, 684–696, 737–741, 870–871, 936–938`; `app/SearchBox.tsx:10887–10906`

Der Campingimport lädt fest nur die ersten zwei Seiten mit insgesamt höchstens 2.000 Datensätzen. In einer Simulation mit 2.001 passenden Einträgen fehlt der letzte, ohne Fortsetzung oder Hinweis. Ausfälle der Camping-/Expediaquelle werden nur serverseitig protokolliert und als normale reduzierte Ergebnisliste beantwortet. A21 bestätigt dieses Verhalten mit einem simulierten Verbindungsfehler.

Ein unbekanntes Pflichtfeature liefert zwar korrekt keine scheinbar passenden Treffer und `missing_features`, die Oberfläche zeigt dazu jedoch nur `Keine passende Unterkunft gefunden`. Suchwunsch, fehlende Daten und technischer Ausfall bleiben so schwer unterscheidbar. Serverseitige Zahlenwerte werden außerdem mit `Number(...)` ohne gemeinsame Wertebereichsprüfung verarbeitet.

Korrektur: Pagination und Datenmengenbegrenzung ausdrücklich gestalten. Teilausfälle und nicht unterstützte Kriterien separat zurückgeben und sichtbar machen. Eingaben serverseitig validieren.

## Was bereits funktioniert

- Einfache lokale Ortsangaben, direkte Personenzahlen und Erwachsene plus Kinder.
- Normale Pool-/WLAN-/Hunde-Erkennung, Hotelsterne und dezimale Mindestbewertungen.
- Hauptquellenfilter für Stadt, Preis und Kapazität sowie korrekt übergebene Pflicht- und Wunschmerkmale.
- Sicherer Ausschluss unbekannter Pflichtfeature-Keys statt erfundener Übereinstimmungen.
- Weiterverwendung lokaler Parameter bei KI-Ausfall.
- Die sechs vorhandenen Tests für Preisdarstellung, Sortierung, Angebotslinks und Merkliste bestehen; auch TypeScript meldet keine Fehler. Diese Prüfungen decken die oben beschriebene Suchkette bisher nicht ab.

## Empfohlene Korrekturreihenfolge

1. Gemeinsamen Filtervertrag festlegen und Quellen unabhängig abfragen. Camping-Pflichten, frühe Rückgaben und Expedia-Gästekonflikt zuerst beheben.
2. Zahlen, Negationen und Muss-/Wunschbindung korrigieren; Text und Formularwerte anschließend konsistent zusammenführen.
3. Doppelten KI-Weg entfernen und dieselben validierten Kriterien für lokalen Parser und KI verwenden.
4. Unterstützte Filter offenlegen; Hotelimport und Featureverknüpfungen anhand dieses Vertrags prüfen.
5. Gemeinsames Ranking, Bewertungsskalen, Pagination und Rückmeldungen bei Teilausfällen ergänzen. Tagesverfügbarkeit als eigene Datenanbindung planen.

## Diagnose erneut ausführen

Voraussetzungen: installierte Projektabhängigkeiten und Node.js 22 oder neuer. Vom Repository-Stamm aus:

```bash
node audits/search-2026-10-30/run.mjs
```

Der Prozess beendet sich bei gefundenen Abweichungen mit Exitcode 1 und schreibt `results.json` neben das Skript. Das ist beim dokumentierten Ausgangsstand beabsichtigt. Der Exitcode soll nach entsprechenden Korrekturen schrittweise auf 0 wechseln. Vor einem Einbau in eine automatische CI sollten die beschriebenen Produktentscheidungen zu Tab-Priorität, Hotelkapazität und unterstützten Wünschen verbindlich festgelegt werden.

Die mitgelieferten Fixture-Namen und `example.invalid`-Links sind ausschließlich synthetische Testdaten. Sie werden nicht in die Anwendung oder Supabase geladen.
