# Interne Surprise-Benachrichtigung über IONOS

Erst wenn `/api/surprise/request` eine gültige Anfrage in Supabase gespeichert hat,
wird eine interne E-Mail an **info@ludigo-travel.com** vorbereitet und nach der
HTTP-Antwort über IONOS versendet. Das reine Ausfüllen, die Themenvorschau,
ungültige Anfragen und fehlgeschlagene Speichervorgänge senden keine E-Mail.
Die Kundenoberfläche erhält keine Booking-Hinweise.

Die Nachricht enthält die Kundenangaben, drei redaktionelle Zielideen zum
gewählten Thema und vorbereitete Booking-Partner-Suchlinks. Es handelt sich
nicht um automatisch abgerufene Booking-Angebote. Es werden keine Verfügbarkeiten,
Preise, Fahrtzeiten oder passenden Unterkünfte behauptet. Persönliche
Kundenangaben und Abfahrtsort werden nicht in die Partnerlinks geschrieben.
Die Zahl und das Alter von Erwachsenen/Kindern sowie die Zimmeraufteilung
bleiben bei Booking zu ergänzen. Das Reisebudget ist kein Hotelbudget.

## Produktionskonfiguration

Im Vercel-Projekt **ludigo** unter **Settings → Environment Variables**:

| Variable | Wert |
| --- | --- |
| `SURPRISE_SMTP_USER` | `info@ludigo-travel.com` (Standardwert) |
| `SURPRISE_SMTP_PORT` | `465` (Standardwert, SSL/TLS); alternativ `587` mit STARTTLS |
| `SURPRISE_SMTP_PASSWORD` | Passwort bzw. geeignetes App-Passwort dieses IONOS-Postfachs; als geheime Variable eingeben |

Nur für **Production** aktivieren. Danach neu deployen, damit die Funktion die
Werte erhält. Keine `NEXT_PUBLIC_`-Variablen verwenden und kein Passwort in Git,
Dokumentation oder Chat schreiben. Der Server ist fest auf `smtp.ionos.de`
eingestellt; Absender ist das angemeldete Postfach, Empfänger ausschließlich
die oben bestätigte interne Adresse. Eine SMTP-Annahme bestätigt noch keinen
Eingang im Posteingang; nach der Aktivierung eine eindeutig markierte Testanfrage
absenden und Eingang/Spamordner kontrollieren.

## Fehler und Wiederholung

Fehlende SMTP-Konfiguration oder ein Versandfehler dürfen die gespeicherte
Kundenanfrage nicht verlieren lassen. Sie bleibt in `surprise_requests` mit
dem normalen Status erhalten. Das Serverlog enthält nur einen allgemeinen
Hinweis, keine Zugangsdaten oder Kundenangaben.

Es gibt in dieser Version keine automatische Wiederholungswarteschlange.
Bei einem Fehler muss die gespeicherte Anfrage intern in Supabase geprüft
und die Benachrichtigung manuell nachgeholt werden. Die HTTP-Antwort an den
Kunden bestätigt nur die gespeicherte Anfrage, niemals eine versendete E-Mail.
Es wird keine Nachricht an den Kunden und keine automatische Buchung ausgelöst.

IONOS-Serverdaten: https://www.ionos.de/hilfe/e-mail/allgemeine-themen/serverinformationen-fuer-imap-pop3-und-smtp/
