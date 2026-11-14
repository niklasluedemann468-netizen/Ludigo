import { bookingSearch } from './booking-search';

export const surpriseInbox = 'info@ludigo-travel.com';
export type SurpriseNotification = {
  firstName: string; lastName: string; email: string; phone: string | null;
  departure: string; startDate: string; endDate: string; travelers: number;
  budget: number | null; preferences: string[]; selectedIdea: string; additionalWishes: string | null;
};

// Editorial starting points, never live Booking inventory or confirmed matches.
const destinations: Record<string, string[]> = {
  meer: ['Warnemünde', 'Kühlungsborn', 'Travemünde'],
  natur: ['Lüneburger Heide', 'Harz', 'Sauerland'],
  city: ['Hamburg', 'Berlin', 'Leipzig'],
  wellness: ['Bad Bevensen', 'Bad Harzburg', 'Bad Ems'],
  aktiv: ['Harz', 'Winterberg', 'Oberstdorf'],
};

export function buildSurpriseEmail(requestId: string, data: SurpriseNotification) {
  const id = String(requestId).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80);
  if (!id) throw new Error('Invalid request identifier');
  const ideas = (destinations[data.selectedIdea] ?? destinations.city).map(destination => {
    const params = new URLSearchParams({ city: destination, country: 'Deutschland', max_guests: String(data.travelers) });
    if (data.endDate > data.startDate) { params.set('check_in', data.startDate); params.set('check_out', data.endDate); }
    if (data.selectedIdea === 'wellness') params.append('feature', 'spa');
    return { destination, ...bookingSearch(params.toString(), { adults: 0, children: 0, babies: 0 }) };
  });
  const lines = [
    'Neue LÜDIGO-Surprise-Anfrage', `Anfragenummer: ${id}`, '',
    'KUNDENANGABEN',
    `Name: ${data.firstName} ${data.lastName}`, `E-Mail: ${data.email}`, `Telefon: ${data.phone || 'Nicht angegeben'}`,
    `Abfahrtsort: ${data.departure}`, `Reisefenster: ${data.startDate} bis ${data.endDate}`,
    `Reisende insgesamt: ${data.travelers}`, `Gesamtbudget: ${data.budget === null ? 'Offen' : `${data.budget.toLocaleString('de-DE')} EUR`}`,
    `Vorlieben: ${data.preferences.join(', ') || 'Offen'}`, `Ausgewählte Themenidee: ${data.selectedIdea}`,
    'Zusätzliche Kundenwünsche (vom Kunden eingegebener Text):', data.additionalWishes || 'Keine', '',
    'INTERNE ZIELIDEEN UND BOOKING-SUCHLINKS',
    'Die Ziele sind redaktionelle Ausgangspunkte zum gewählten Thema, keine von Booking gelieferten oder geprüften Angebote.',
    'Entfernungen ab dem Abfahrtsort, Anreise, Gesamtbudget, Ausstattung und Verfügbarkeit bitte selbst prüfen.',
    'Das Gesamtbudget umfasst die ganze Reise und wird nicht als Unterkunftspreisfilter übertragen.',
    'Erwachsene, Kinderalter und Zimmeraufteilung bei Booking ergänzen; die Gesamtpersonenzahl wird nicht als Erwachsenenanzahl angenommen.',
    data.endDate === data.startDate ? 'Tagesausflug: Für eine Unterkunft muss noch ein Übernachtungszeitraum gewählt werden.' : 'Das Reisefenster ist als Suchzeitraum vorbereitet; der endgültige Aufenthalt ist noch zu planen.', '',
    ...ideas.flatMap((idea, index) => [`${index + 1}. ${idea.destination}`, `Vorbereitet: ${idea.transferred.join(' · ') || 'Allgemeine Unterkunftssuche'}`, `Noch prüfen: ${idea.manual.join(' · ') || 'Preis und Verfügbarkeit'}`, idea.href, '']),
    'Diese E-Mail dient nur der internen Planung. Es wurde keine Reise oder Unterkunft gebucht.',
  ];
  return {
    to: surpriseInbox, subject: `LÜDIGO Surprise – neue Anfrage ${id}`,
    messageId: `<surprise-${id}@ludigo-travel.com>`, text: lines.join('\n'),
  };
}
