import Link from "next/link";
import type { ReactNode } from "react";
export const worldLinks = [
 { href: "/#ergebnisse", title: "Unterkünfte", icon: "home", key: "accommodations" },
 { href: "/surprise", title: "LÜDIGO Surprise", icon: "spark", key: "surprise" },
 { href: "/bike", title: "LÜDIGO Bike", icon: "bike", key: "bike" },
 { href: "/bustouren-senioren", title: "Bustouren für Senioren", icon: "bus", key: "bus" },
] as const;
export function Icon({name}:{name:string}) { return <svg className="icon" aria-hidden="true"><use href={`#${name}`} /></svg>; }
export function SiteHeader({right}:{right?:ReactNode}) { return <header className="site-header wrap"><Link className="brand" href="/" aria-label="LÜDIGO – Startseite"><img className="brand-logo" src="/images/ludigo-logo-transparent.png" width="2170" height="725" alt="LÜDIGO – Urlaub auf deine Art" /></Link><nav aria-label="Hauptnavigation"><Link href="/#ergebnisse">Unterkünfte</Link><Link href="/#reisewelten">Reisewelten</Link><Link href="/#so-gehts">So geht’s</Link></nav>{right || <Link className="saved-nav" href="/#suche">Unterkünfte <Icon name="arrow" /></Link>}</header>; }
export function WorldNavigation({current}:{current?:string}) { return <nav className="world-navigation wrap" aria-label="Reisewelten"><span className="nav-caption">DEINE REISEWELTEN</span>{worldLinks.map(w=><Link key={w.key} href={w.href} aria-current={current===w.key ? "page" : undefined}><Icon name={w.icon} />{w.title}</Link>)}</nav>; }
export function SiteFooter() { return <footer className="wrap"><div className="footer-top"><Link className="brand" href="/" aria-label="LÜDIGO – Startseite"><img className="brand-logo" src="/images/ludigo-logo.png" width="2048" height="683" alt="LÜDIGO – Urlaub auf deine Art" loading="lazy" /></Link><p>Für alle, die ihren eigenen Weg in den Urlaub finden.</p><div><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link></div></div><div className="footer-bottom"><p>© {new Date().getFullYear()} LÜDIGO · Urlaub auf deine Art</p><p>Die Angebotslinks können Affiliate-Links sein. Bei einer Buchung kann LÜDIGO eine Provision erhalten; für dich entstehen dadurch keine zusätzlichen Kosten. Deine Merkliste und gespeicherte Wunschprofile bleiben in diesem Browser.</p></div></footer>; }
export function IconSprite() { return (<svg className="svg-sprite" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
    <symbol id="heart" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></symbol>
    <symbol id="compass" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5Z"/></symbol>
    <symbol id="pin" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></symbol>
    <symbol id="arrow" viewBox="0 0 24 24"><path d="M4 12h16m-6-6 6 6-6 6"/></symbol>
    <symbol id="tent" viewBox="0 0 24 24"><path d="m3 21 9-17 9 17H3ZM8 21l4-8 4 8M9 2l3 2 3-2"/></symbol>
    <symbol id="home" viewBox="0 0 24 24"><path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8"/></symbol>
    <symbol id="bed" viewBox="0 0 24 24"><path d="M3 18V6m18 12v-7H3m0 4h18M6 11V7h5v4m2 0V7h5v4M3 18v3m18-3v3"/></symbol>
    <symbol id="star" viewBox="0 0 24 24"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/></symbol>
    <symbol id="spark" viewBox="0 0 24 24"><path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/></symbol>
    <symbol id="bike" viewBox="0 0 24 24"><circle cx="5" cy="17" r="4"/><circle cx="19" cy="17" r="4"/><path d="m5 17 5-10 6 10H5m6-7h6l2 7m-2-7-2-6h4M7 7h6"/></symbol>
    <symbol id="bus" viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="16" rx="3"/><path d="M4 12h16M8 19v3m8-3v3M8 16h.01M16 16h.01M12 3v9"/></symbol>
  </defs></svg>); }
