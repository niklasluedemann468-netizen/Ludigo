import type { Metadata } from "next";
import TravelWorldPage from "../components/TravelWorldPage";
export const metadata:Metadata = {"title": "LÜDIGO Bike – Urlaub auf deine Art", "description": "LÜDIGO Bike: Entdecke die Idee und halte deine Reisewünsche fest. Reiseangebote sind in Planung."};
export const dynamic = 'force-dynamic';
export default function Page(){return <TravelWorldPage world="bike"/>;}
