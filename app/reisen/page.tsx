import type { Metadata } from 'next';
import { IconSprite, SiteFooter, SiteHeader, WorldNavigation } from '../components/LudigoChrome';
import TravelBookingSection from '../components/TravelBookingSection';
export const metadata: Metadata = { title: 'Reisen buchen – LÜDIGO', description: 'Busreisen, Fahrradtouren und Überraschungsreisen: aktuelle LÜDIGO-Reiseangebote und sichere Zahlung.' };
export const dynamic = 'force-dynamic';
export default function Page() {
  return <div className="ludigo-site booking-page"><a className="skip-link" href="#buchen">Direkt zu den Reiseangeboten</a><SiteHeader/><WorldNavigation/><main><div className="wrap booking-page-title"><p className="eyebrow">DEINE AUSZEIT MIT LÜDIGO</p><h1>Reisen entdecken.<br/><em>Vorfreude buchen.</em></h1><p>Busreisen, Fahrradtouren und Überraschungsreisen an einem Ort.</p></div><TravelBookingSection/></main><SiteFooter/><IconSprite/></div>;
}
