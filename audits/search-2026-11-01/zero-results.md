# Nulltreffer und Grenzen der KI-Ergänzung

## Reproduzierte Fehler

Auf Commit `5c4cc29` löste der vollständig unerkannte Text „Pinguinobservatorium“ bei gewähltem Camping-Tab eine allgemeine Campingabfrage aus. Der Tab wurde irrtümlich als erkanntes Textkriterium gezählt; es erfolgte kein KI-Aufruf. Nach einer vorherigen Suche mit 1.500 Treffern konnte außerdem eine leere Eingabe zwar die Karten löschen, aber die alte Gesamtzahl und die Folgeseite behalten.

## Korrekturen

- Tab und Formular-Kontext belegen nicht, dass der Suchtext verstanden wurde. Ein unbekannter Text erhält eine ergänzende Auswertung. Bleiben die Kriterien unklar oder wiederholt die KI nur die bereits erkannte Unterkunftsart, wird keine allgemeine Datenbankabfrage gestartet. Die Oberfläche zeigt 0 Treffer und die konkrete Einschränkung.
- Erkannte Zahlen, Datumsbereiche und Merkmale werden nach ihrer endgültigen Normalisierung beurteilt. Bereits gültige lokale Suchen bleiben möglich.
- Änderungen von Text, Unterkunftsart, Zeitraum oder Personen löschen Karten, Gesamtzahl und Seitennavigation gemeinsam. Eine neue Anfrage beginnt ebenfalls mit diesem leeren Zustand.
- Jede Anfrage hat eine fortlaufende Kennung. Antworten und Fehler älterer Suchen, Sortierungen oder Folgeseiten dürfen eine neuere Suche nicht mehr überschreiben. Das gilt auch dann, wenn die neue Suche 0 Treffer hat.
- Sortierung und Nachladen behalten die ursprünglichen Filter. Eine leere Ergebnismenge wird nicht durch allgemeinere Angebote ersetzt.
- Die KI-Anfrage ist im Browser auf 20 Sekunden begrenzt. Serverseitig werden Konfigurations-, Authentifizierungs-, Kontingent-, Modell-, Timeout- und sonstige Anbieterprobleme durch feste Fehlercodes unterschieden; Schlüssel und Anbieter-Fehlertexte werden nicht veröffentlicht.

## Was die KI tatsächlich macht

Die KI ist weiterhin eine ergänzende Textauswertung für unklare Anfragen bzw. Ziele. Sie prüft **nicht pauschal alle übrigen Kriterien** und belegt keine Hotelausstattung. Vollständig lokal verstandene Suchen benötigen sie nicht. Die eigentlichen Pflichtfilter werden anschließend einheitlich gegen bestätigte Daten aller Anbieter angewendet.

Der öffentliche Endpunkt antwortete vor dieser Änderung auf eine freie Reiseanfrage mit HTTP 503. Ein funktionierender KI-Dienst wird deshalb nicht behauptet. Der konkrete Status nach Veröffentlichung wird im zugehörigen PR ergänzt. Eine unerkannte Suchanfrage darf bei einem solchen Ausfall nicht in eine allgemeine Unterkunftsliste übergehen.

## Validierung

**261 reguläre Tests plus 60 historische Diagnosefälle = 321 bestanden, 0 fehlgeschlagen.** Enthalten sind die unveränderten 100 Kombinationstests und **26 neue Regressionsfälle**. Die neuen Fälle prüfen echte Controller-/GET-/POST-Grenzen mit kontrollierten externen Daten und 1.501 vorhandenen Objekten, sämtliche Sortierungen, Tab-Auswahl, fehlende KI-Auswertung, späte erfolgreiche und fehlgeschlagene Antworten sowie alte Folgeseiten.

TypeScript und ESLint für die geänderten API-/Kriterienmodule sind fehlerfrei. Der App-Quellhash (TS/TSX/JSON) lautet `40498a2b6b4bf836a89784666ff39b21b23459e17dca5b8820d06b2152a9246b`. Die vollständigen Ergebnisdateien der bisherigen 100/50/60-Fälle wurden mit diesem Stand erneut erzeugt. Die Ergebnisse der zusätzlichen 100 Produktionsanfragen und die Browserprüfung werden im PR festgehalten. Fehlende Anbieterangaben bleiben Datenlücken; die Tests garantieren keine allgemeine KI-Verfügbarkeit.
