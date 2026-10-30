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
    <symbol id="sea" viewBox="0 0 24 24"><circle cx="17" cy="6" r="3"/><path d="M2 14q2.5-3 5 0t5 0 5 0 5 0M2 20q2.5-3 5 0t5 0 5 0 5 0"/></symbol>
    <symbol id="lake" viewBox="0 0 24 24"><path d="M3 14c4-4 14-4 18 0M3 19q3-2 6 0t6 0 6 0M5 12V4m0 4L2 5m3 5 3-4M17 10V3m0 4 3-3"/></symbol>
    <symbol id="mountains" viewBox="0 0 24 24"><path d="m2 21 8-17 5 10 3-6 4 13H2Zm5-11 3 3 2-3"/></symbol>
    <symbol id="city" viewBox="0 0 24 24"><path d="M2 21h20M4 21V9h7m0 12V3h9v18M7 12v1m0 3v1m7-10v1m3-1v1m-3 3v1m3-1v1m-3 3v1m3-1v1"/></symbol>
    <symbol id="paw" viewBox="0 0 24 24"><ellipse cx="4.5" cy="9" rx="2" ry="2.5"/><ellipse cx="9" cy="5" rx="2" ry="2.5"/><ellipse cx="15" cy="5" rx="2" ry="2.5"/><ellipse cx="19.5" cy="9" rx="2" ry="2.5"/><path d="M8 13c2-4 6-4 8 0 1 2 4 3 3 6s-5 1-7 1-6 2-7-1 2-4 3-6Z"/></symbol>
    <symbol id="family" viewBox="0 0 24 24"><circle cx="7" cy="5" r="2.5"/><circle cx="17" cy="6" r="2"/><path d="M2 20v-5a5 5 0 0 1 10 0v5m3-8a4 4 0 0 1 7 3v5M6 20v-4m12 4v-4"/></symbol>
    <symbol id="accessible" viewBox="0 0 24 24"><circle cx="11" cy="4" r="2"/><path d="m10 8 1 7h6l3 6 2-1M11 11h6M7 10a6 6 0 1 0 7 10"/></symbol>
    <symbol id="leaf" viewBox="0 0 24 24"><path d="M20 3C9 2 2 8 5 15s16 4 15-12ZM3 21 15 9"/></symbol>
    <symbol id="pool" viewBox="0 0 24 24"><path d="M7 14V5a2 2 0 0 1 4 0m2 9V5a2 2 0 0 1 4 0M7 8h6m-6 4h6M2 17q2.5-2 5 0t5 0 5 0 5 0M2 22q2.5-2 5 0t5 0 5 0 5 0"/></symbol>
    <symbol id="wifi" viewBox="0 0 24 24"><path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0m-11 4a6 6 0 0 1 8 0M12 20h.01"/></symbol>
    <symbol id="parking" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></symbol>
    <symbol id="kitchen" viewBox="0 0 24 24"><path d="M4 10h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9ZM1 13h3m16 0h3M9 7V3m6 4V3M3 10h18"/></symbol>
    <symbol id="laundry" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M4 7h16M7 4.5h.01m3 0h.01"/><circle cx="12" cy="14" r="4.5"/><path d="M8 14q2-2 4 0t4 0"/></symbol>
    <symbol id="coffee" viewBox="0 0 24 24"><path d="M4 9h12v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9Zm12 1h2a3 3 0 0 1 0 6h-2M2 23h18M7 5V2m5 3V2"/></symbol>
    <symbol id="restaurant" viewBox="0 0 24 24"><path d="M4 3v6a3 3 0 0 0 6 0V3M7 3v18M19 3c-3 0-5 4-5 8h5m0-8v18"/></symbol>
    <symbol id="snowflake" viewBox="0 0 24 24"><path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 4l3 3 3-3M9 20l3-3 3 3M4 10l4-1-1-4m10 14-1-4 4-1M4 14l4 1-1 4M17 5l-1 4 4 1"/></symbol>
  </defs></svg>); }
