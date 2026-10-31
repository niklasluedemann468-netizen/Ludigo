import Link from 'next/link';
import type { WorldKey } from '../lib/world-content';
import { configuredPaymentOffers, paymentWorlds } from '../lib/travel-payments';
import { Icon } from './LudigoChrome';

export default function TravelBookingSection({ world }: { world?: WorldKey }) {
  const offers = configuredPaymentOffers().filter(offer => !world || offer.world === world);
  const title = world ? paymentWorlds.find(item => item.key === world)!.title : 'Deine nächste Reise';
  return <section className="booking-section wrap" id="buchen" aria-labelledby="booking-title">
    <div className="booking-heading"><div><p className="eyebrow">VORFREUDE MIT FESTEM TERMIN</p><h2 id="booking-title">{title}.<br/><em>Hier beginnt deine Buchung.</em></h2></div><Icon name="payment"/></div>
    {offers.length ? <><p className="booking-intro">Wähle dein Reiseangebot. Termin, Leistungen und Gesamtpreis kannst du auf der Zahlungsseite noch einmal prüfen, bevor du bezahlst.</p><div className="booking-offers">{offers.map(offer => <article className="booking-offer" key={offer.id}>
      <span className="booking-category"><Icon name={paymentWorlds.find(item => item.key === offer.world)!.icon}/>{paymentWorlds.find(item => item.key === offer.world)!.title}</span>
      {offer.test && <p className="booking-test">Testangebot · keine echte Reisebuchung</p>}<h3>{offer.title}</h3><p>{offer.description}</p><a className="primary-button" href={offer.url} rel="noreferrer" aria-label={`${offer.title}: ${offer.test ? 'Testzahlung' : 'Angebot und Zahlung'} bei Stripe öffnen`}>{offer.test ? 'Testzahlung öffnen' : 'Angebot und Zahlung öffnen'}<Icon name="arrow"/></a>
    </article>)}</div><p className="booking-note">Die Zahlung erfolgt auf der geschützten Zahlungsseite von Stripe. Bewahre die Zahlungsbestätigung des Anbieters auf.</p></> : <div className="booking-empty"><Icon name={world ? paymentWorlds.find(item => item.key === world)!.icon : 'compass'}/><div><h3>Neue Reisetermine sind in Vorbereitung.</h3><p>Sobald Reisen buchbar sind, findest du hier die konkreten Angebote mit Termin, Leistungen und Zahlungslink.</p>{world ? <a className="text-link" href="#planung">Schon jetzt Reisewünsche festhalten <span aria-hidden="true">↗</span></a> : <nav aria-label="Reisewünsche festhalten">{paymentWorlds.map(item => <Link className="text-link" key={item.key} href={item.href}>{item.title}<Icon name={item.icon}/></Link>)}</nav>}</div></div>}
    {world && <Link className="booking-all text-link" href="/reisen">Alle buchbaren Reisewelten <Icon name="arrow"/></Link>}
  </section>;
}
