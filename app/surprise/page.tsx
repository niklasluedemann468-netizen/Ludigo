import type { Metadata } from "next";
import TravelWorldPage from "../components/TravelWorldPage";
export const metadata:Metadata = {"title": "LÜDIGO Surprise – Urlaub auf deine Art", "description": "LÜDIGO Surprise: Entdecke die Idee und halte deine Reisewünsche fest. Reiseangebote sind in Planung."};
export default function Page(){return <TravelWorldPage world="surprise"/>;}
