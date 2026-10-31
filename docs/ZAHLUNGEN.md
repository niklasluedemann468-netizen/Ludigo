# Reiseangebote und Stripe-Zahlungen aktivieren

Die drei Reisewelten und `/reisen` unterstützen jetzt echte Stripe Payment Links. Die Website erfasst keine Karten- oder Kontodaten. Es sind weder ein Stripe-Geheimschlüssel im Website-Code noch eine zusätzliche Kundendatenbank erforderlich. Preise und die endgültige Zahlung werden auf Stripe angezeigt; eine Rückkehr zur Website wird niemals als Zahlungsnachweis gewertet.

## Einmalige Einrichtung durch den Betreiber

1. Das eigene Stripe-Konto einrichten und für Auszahlungen verifizieren. Das kann nur der Kontoinhaber abschließen.
2. In Stripe je tatsächlichem Reiseangebot ein einmaliges Produkt mit dem richtigen Endpreis, Termin, Leistungsumfang und Reisebedingungen anlegen. Keine Abonnements für diese Reisen verwenden. Die Zahl verkaufbarer Plätze und Teilnehmerangaben im konkreten Angebot berücksichtigen. Ein Zahlungslink ersetzt keine Sitzplatzverwaltung; bei begrenzten Gruppen eine passende Kauflimitierung in Stripe setzen und den Absatz überwachen. Die Konfiguration muss verhindern, dass mehr Plätze verkauft werden als verfügbar sind.
3. Einen Payment Link erstellen. Zahlungsbestätigungen und die gewünschten verfügbaren Zahlungsmethoden im Stripe-Konto konfigurieren. Reiseleistungen werden im Stripe-Dashboard anhand bestätigter Zahlungen zugeordnet; die Website bestätigt oder erfüllt keine Buchung automatisch.
4. Im Vercel-Projekt die serverseitige Umgebungsvariable `LUDIGO_TRAVEL_PAYMENT_LINKS` als JSON-Liste setzen. Danach neu deployen. Die Liste kann bis zu 50 Angebote enthalten. Ohne gültige Angebote zeigen alle Seiten den Zustand „Neue Reisetermine sind in Vorbereitung“.

Jeder Eintrag benötigt diese Felder:

| Feld | Wert |
| --- | --- |
| `id` | Eindeutige Kennung mit kleinen Buchstaben, Ziffern und Bindestrichen, höchstens 60 Zeichen. |
| `world` | `bus`, `bike` oder `surprise`. |
| `title` | Tatsächlicher Angebotsname, höchstens 120 Zeichen. |
| `description` | Tatsächlicher Termin und Leistungsumfang, höchstens 600 Zeichen. |
| `url` | Unveränderter HTTPS-Payment-Link von `buy.stripe.com`. Keine Trackingparameter anhängen. |

Die folgende Form ist eine Vorlage und kein veröffentlichtes Reiseangebot. Den Platzhalter vollständig durch einen echten Stripe-Link ersetzen:

```json
[{"id":"eigene-reise-kennung","world":"bus","title":"Tatsächlicher Name der Busreise","description":"Tatsächlicher Termin und enthaltene Leistungen","url":"PAYMENT_LINK_AUS_DEM_STRIPE_DASHBOARD"}]
```

## Testen und freischalten

Zuerst Stripe-Testlinks verwenden und ausschließlich im Vorschaudeployment `LUDIGO_PAYMENTS_TEST_MODE=true` setzen. Testlinks erscheinen ausdrücklich als Testangebot; ohne dieses Flag werden sie ausgeblendet. Eine erfolgreiche Zahlung mit Stripe-Testdaten im Stripe-Dashboard prüfen, ebenso Abbruch, abgelaufenen/deaktivierten Link und Kauflimit. Für Produktion echte Links einsetzen und das Testflag entfernen. Geheimschlüssel oder Bankdaten niemals in den Chat, das Repository oder diese Variable schreiben.

Für eine spätere automatische Buchungsbestätigung sind signierte Stripe-Webhooks und eine dauerhafte, gegen Wiederholungen geschützte Buchungs-/Kapazitätsverwaltung erforderlich. Diese Payment-Link-Integration erfindet keine Zahlungsbestätigung und keine verfügbaren Plätze.

Technische Grundlage: https://docs.stripe.com/payment-links und https://docs.stripe.com/checkout/fulfillment.
