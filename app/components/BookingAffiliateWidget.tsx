'use client';

import Script from 'next/script';
import { useRef, useState } from 'react';

const widgetId = 'bookingAffiliateWidget_9afaba33-a14f-401d-bfb3-83611e96d760';
const affiliateUrl = 'http://www.jdoqocy.com/click-101892570-17319656?sid=';

type BookingSdk = {
  AffiliateWidget: new (settings: {
    iframeSettings: { selector: string; responsive: boolean };
    widgetSettings: { destinationurloverride: string };
  }) => unknown;
};

export default function BookingAffiliateWidget() {
  const initialized = useRef(false);
  const [failed, setFailed] = useState(false);

  function initialize() {
    if (initialized.current) return;
    const booking = (window as Window & { Booking?: BookingSdk }).Booking;
    if (!booking?.AffiliateWidget) {
      setFailed(true);
      return;
    }
    try {
      new booking.AffiliateWidget({
        iframeSettings: { selector: widgetId, responsive: true },
        widgetSettings: { destinationurloverride: affiliateUrl },
      });
      initialized.current = true;
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }

  return (
    <section className="booking-section wrap" aria-labelledby="booking-affiliate-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">WERBUNG · BOOKING.COM</p>
          <h2 id="booking-affiliate-title">Noch mehr Orte für <em>deine Auszeit.</em></h2>
          <p>Entdecke weitere Unterkünfte bei Booking.com. Die Buchung erfolgt beim Anbieter.</p>
        </div>
      </div>
      <div id={widgetId} style={{ width: '100%', minWidth: 0 }} />
      <Script
        id="booking-affiliate-sdk"
        src="https://www.booking.com/affiliate/prelanding_sdk"
        strategy="lazyOnload"
        onReady={initialize}
        onError={() => setFailed(true)}
      />
      {failed && <p role="status">Die eingebettete Suche ist gerade nicht verfügbar. Du kannst Booking.com direkt öffnen.</p>}
      <p className="booking-note">
        <a className="text-link" href={affiliateUrl} target="_blank" rel="sponsored noopener noreferrer">Unterkünfte bei Booking.com ansehen ↗</a>
        <br />Affiliate-Link: Bei einer Buchung erhält LÜDIGO möglicherweise eine Provision.
      </p>
      {/* The affiliate impression pixel must use its original URL without image optimization. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://www.lduhtrp.net/image-101892570-17319656" width="1" height="1" alt="" aria-hidden="true" style={{ border: 0 }} />
    </section>
  );
}
