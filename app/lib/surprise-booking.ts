import { bookingSearch } from './booking-search';
import { validIsoDate } from './search/criteria';
import type { SurpriseRequest } from './surpriseMatcher';

export function surpriseBookingSearch(request: SurpriseRequest | null, destination = '') {
  const params = new URLSearchParams();
  const place = destination.trim();
  // A departure is not a destination. Never expose or invent a secret Surprise destination.
  if (place && place.length <= 120 && !/[\x00-\x1f]/.test(place)) params.set('city', place);
  const notes: string[] = [];
  if (request) {
    if (validIsoDate(request.startDate) && validIsoDate(request.endDate) && request.endDate > request.startDate) {
      params.set('check_in', request.startDate);
      params.set('check_out', request.endDate);
    } else notes.push('Für eine Unterkunft bitte einen Zeitraum mit mindestens einer Übernachtung bei Booking.com wählen.');
    if (Number.isInteger(request.travelers) && request.travelers >= 1 && request.travelers <= 1000) params.set('max_guests', String(request.travelers));
    if (request.preferences.length) notes.push(`Themenwünsche bei Booking.com prüfen: ${request.preferences.join(', ')}.`);
    const budget = Number(request.budget);
    if (request.budget.trim() && Number.isFinite(budget) && budget > 0) {
      notes.push(`Gesamtbudget für die Reise: ${budget.toLocaleString('de-DE')} €. Unterkunft und Anreise gemeinsam berücksichtigen; kein automatischer Unterkunftspreisfilter.`);
    }
  }
  // Surprise collects a total traveler count, not ages or an adult/child breakdown.
  const result = bookingSearch(params.toString(), { adults: 0, children: 0, babies: 0 });
  return { ...result, manual: [...result.manual, ...notes] };
}
