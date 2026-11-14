'use client';

import { useState } from 'react';
import { surpriseBookingSearch } from '../lib/surprise-booking';
import type { SurpriseIdea, SurpriseRequest } from '../lib/surpriseMatcher';
import { Icon } from './LudigoChrome';

export default function SurpriseBookingSearch({ request, idea }: { request: SurpriseRequest | null; idea?: SurpriseIdea }) {
  const [destination, setDestination] = useState('');
  const booking = surpriseBookingSearch(request, destination);
  return <section aria-labelledby="surprise-booking-title" style={{ marginTop: 24, padding: 24, background: '#ffffff', border: '1px solid #cad6ce', borderRadius: 18 }}>
    <p className="eyebrow">WERBUNG · AFFILIATE-LINK</p>
    <h2 id="surprise-booking-title" style={{ fontSize: 25, marginBottom: 12 }}>Deine Unterkunft bei Booking.com</h2>
    <p>Du möchtest selbst eine Unterkunft auswählen? Entdecke passende Angebote direkt bei Booking.com. Deine Surprise-Idee bleibt eine unverbindliche Inspiration.</p>
    {idea && <p style={{ marginTop: 12 }}><strong>Deine ausgewählte Idee:</strong> {idea.title}</p>}
    {request ? <div style={{ marginTop: 18 }}>
      <label htmlFor="surprise-booking-destination" style={{ display: 'block', fontWeight: 600 }}>Reiseziel für deine eigene Unterkunftssuche (optional)</label>
      <input id="surprise-booking-destination" value={destination} onChange={event => setDestination(event.target.value)} maxLength={120} placeholder="z. B. Berlin oder Gardasee" aria-describedby="surprise-booking-hint" style={{ width: '100%', padding: 13, marginTop: 8, border: '1px solid #cad6ce', borderRadius: 10, fontSize: 16 }}/>
      <p id="surprise-booking-hint" className="booking-note">Ein hier selbst gewähltes Reiseziel gilt nur für Booking.com. Es ersetzt nicht das geheime Surprise-Ziel. Der Abfahrtsort wird nicht als Urlaubsziel verwendet.</p>
    </div> : <p className="booking-note">Erstelle oben dein Surprise-Profil, um deinen Reisezeitraum für die Unterkunftssuche vorzubereiten.</p>}
    {booking.transferred.length > 0 && <div className="booking-criteria" style={{ marginTop: 18 }}><h3>Für Booking.com vorbereitet</h3><ul className="live-features">{booking.transferred.map(label => <li key={label}><Icon name="arrow"/><span>{label}</span></li>)}</ul></div>}
    {booking.manual.length > 0 && <div className="booking-criteria" style={{ marginTop: 18 }}><h3>Bei Booking.com noch prüfen oder ergänzen</h3><ul>{booking.manual.map(label => <li key={label}>{label}</li>)}</ul></div>}
    <a className="primary-button" href={booking.href} target="_blank" rel="sponsored noopener noreferrer" style={{ marginTop: 18 }}>Unterkünfte bei Booking.com suchen <Icon name="arrow"/></a>
    <p className="booking-note">{booking.hasSearch ? 'Deine vorbereiteten Angaben öffnen sich bei Booking.com. ' : 'Wähle dein Reiseziel und deine Reisedaten bei Booking.com. '}Bitte ergänze dort Erwachsene, Kinderalter und Zimmerzahl. Preise, Verfügbarkeit und Themenwünsche prüfst du beim Anbieter. Die Unterkunftsbuchung umfasst keine Anreise oder komplette Surprise-Reise.</p>
    <p className="booking-note">Bei einer Buchung über diesen Link erhält LÜDIGO möglicherweise eine Provision.</p>
  </section>;
}
