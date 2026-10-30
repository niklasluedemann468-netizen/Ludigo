import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Sans, Manrope } from "next/font/google";
import "./globals.css";
import "./ludigo.css";

const bodyFont = DM_Sans({variable:"--font-body",subsets:["latin"],display:"swap"});
const headingFont = Manrope({variable:"--font-heading",subsets:["latin"],display:"swap"});
export const metadata: Metadata = {
  title: "LÜDIGO – Urlaub auf deine Art",
  description: "Beschreibe deine Reise und entdecke passende Hotels, Ferienwohnungen und Campingplätze. Urlaub auf deine Art mit LÜDIGO.",
};
export default function RootLayout({children}:{children:ReactNode}) {
 return <html lang="de" className={`${bodyFont.variable} ${headingFont.variable}`}><body>{children}</body></html>;
}
