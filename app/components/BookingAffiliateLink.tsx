import { Icon } from './LudigoChrome';

const affiliateUrl = 'http://www.jdoqocy.com/click-101892570-17319656?sid=';

export default function BookingAffiliateLink() {
  return (
    <section className="booking-section wrap" aria-labelledby="booking-affiliate-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">WERBUNG · AFFILIATE-LINK</p>
          <h2 id="booking-affiliate-title">Noch mehr Orte für <em>deine Auszeit.</em></h2>
          <p>Entdecke weitere Unterkünfte bei Booking.com.</p>
        </div>
      </div>
      <a className="primary-button" href={affiliateUrl} target="_blank" rel="sponsored noopener noreferrer">
        Weitere Unterkünfte bei Booking.com suchen <Icon name="arrow" />
      </a>
      <p className="booking-note">
        Booking.com öffnet sich in einem neuen Tab. Gib dort dein Reiseziel, deinen Zeitraum und die Reisenden ein.
        Deine LÜDIGO-Suchkriterien werden nicht automatisch übertragen. Preise, Verfügbarkeit und Ausstattung prüfst du bei Booking.com.
      </p>
      <p className="booking-note">Bei einer Buchung über diesen Link erhält LÜDIGO möglicherweise eine Provision.</p>
    </section>
  );
}
