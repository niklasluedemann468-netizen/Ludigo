import type { Metadata } from "next";
import TravelWorldPage from "../components/TravelWorldPage";
export const metadata:Metadata = {"title": "Bustouren für Senioren – Urlaub auf deine Art", "description": "Bustouren für Senioren: Entdecke die Idee und halte deine Reisewünsche fest. Reiseangebote sind in Planung."};
export default function Page(){return <TravelWorldPage world="bus"/>;}
