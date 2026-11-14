import { Icon } from './LudigoChrome';
import { bookingSearch, type BookingParty } from '../lib/booking-search';

export default function BookingAffiliateLink({ criteria = '', party = { adults: 2, children: 0, babies: 0 } }: { criteria?: string; party?: BookingParty }) {
  const booking = bookingSearch(criteria, party);
  return (
    <section className="booking-section wrap" aria-labelledby="booking-affiliate-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">WERBUNG · AFFILIATE-LINK</p>
          <h2 id="booking-affiliate-title">Noch mehr Orte für <em>deine Auszeit.</em></h2>
          <p>Entdecke weitere Unterkünfte bei Booking.com.</p>
        </div>
      </div>
      {booking.transferred.length > 0 && <div className="booking-criteria"><h3>Für Booking.com vorbereitet</h3><ul className="live-features">{booking.transferred.map(label => <li key={label}><Icon name="arrow"/><span>{label}</span></li>)}</ul></div>}
      {booking.manual.length > 0 && <div className="booking-criteria"><h3>Bei Booking.com noch prüfen oder ergänzen</h3><ul className="live-features">{booking.manual.map(label => <li key={label}><Icon name="info"/><span>{label}</span></li>)}</ul></div>}
      <a className="primary-button" href={booking.href} target="_blank" rel="sponsored noopener noreferrer">
        Weitere Unterkünfte bei Booking.com suchen <Icon name="arrow" />
      </a>
      <p className="booking-note">
        {booking.hasSearch ? 'Booking.com öffnet sich mit den vorbereiteten Suchkriterien in einem neuen Tab. Bitte kontrolliere dort die übernommenen Filter, Reisenden und Zimmer.' : 'Booking.com öffnet sich in einem neuen Tab. Gib dort dein Reiseziel, deinen Zeitraum und die Reisenden ein.'}
        {' '}Preise, Verfügbarkeit und Ausstattung prüfst du bei Booking.com. Wünsche und Ausschlüsse werden nicht automatisch als Booking-Filter gesetzt. Booking-Ergebnisse erscheinen auf Booking.com.
      </p>
      <p className="booking-note">Bei einer Buchung über diesen Link erhält LÜDIGO möglicherweise eine Provision.</p>
    </section>
  );
}
