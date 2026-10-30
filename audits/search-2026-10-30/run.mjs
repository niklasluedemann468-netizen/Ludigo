import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {parseSearch,queryAccommodations,root} from './harness.mjs';
import {tables} from './fixtures.mjs';

const checks=[];
async function check(id,area,label,run){
 try{const evidence=await run();checks.push({id,area,label,pass:true,evidence});}
 catch(error){checks.push({id,area,label,pass:false,error:error.message,evidence:error.evidence});}
}
function expect(value,condition,expected){if(!condition){const e=new Error(expected);e.evidence=value;throw e;}return value;}
async function parserCase(id,label,query,condition,options={}){
 await check(id,'parser',label,async()=>{const r=await parseSearch(query,{aiStatus:503,...options});return expect(r,condition(r),label);});
}
async function routeCase(id,label,params,condition,data=tables,options={}){
 await check(id,'api',label,async()=>{const r=await queryAccommodations(params,data,options);return expect({params,...r},condition(r),label);});
}
const has=(r,k,v)=>r.params[k]?.includes(v)??false;
const names=r=>r.body.accommodations?.map(x=>x.name)??[];
const noWrongFeed=r=>!names(r).includes('Feed Berlin ohne Ausstattung');

await parserCase('P01','Berlin und Deutschland werden erkannt','Hotel in Berlin',r=>has(r,'city','Berlin')&&has(r,'country','Deutschland'));
await parserCase('P02','Vier Personen werden erkannt','Hotel für 4 Personen',r=>has(r,'max_guests','4'));
await parserCase('P03','Erwachsene und Kinder werden addiert','Hotel mit 2 Erwachsenen und 2 Kindern',r=>has(r,'max_guests','4'));
await parserCase('P04','Babys werden mitgezählt','Hotel mit 2 Erwachsenen und 1 Baby',r=>has(r,'max_guests','3'));
await parserCase('P05','Formularpersonenzahl wird übernommen','Hotel in Berlin',r=>has(r,'max_guests','5'),{adults:3,children:2});
await parserCase('P06','Pool wird als Merkmal erkannt','Hotel mit Pool',r=>has(r,'feature','pool'));
await parserCase('P07','WLAN wird als Merkmal erkannt','Hotel mit WLAN',r=>has(r,'feature','wifi'));
await parserCase('P08','Hund wird als Merkmal erkannt','Camping mit Hund',r=>has(r,'feature','dogs_allowed'));
await parserCase('P09','Ohne Hund erzeugt kein positives Hunde-Kriterium','Camping ohne Hund',r=>!has(r,'feature','dogs_allowed'));
await parserCase('P10','Ausdrücklicher Pool-Ausschluss erreicht die API','Hotel ohne Pool',r=>has(r,'exclude_feature','pool'));
await parserCase('P11','Ausdrücklicher WLAN-Ausschluss erreicht die API','Hotel ohne WLAN',r=>has(r,'exclude_feature','wifi'));
await parserCase('P12','Optionaler Pool bleibt Wunsch','Hotel mit Pool wäre schön',r=>has(r,'preferred_feature','pool')&&!has(r,'must_feature','pool'));
await parserCase('P13','WLAN-Pflicht macht optionalen Pool nicht verpflichtend','Hotel WLAN muss sein, Pool wäre schön',r=>has(r,'must_feature','wifi')&&has(r,'preferred_feature','pool')&&!has(r,'must_feature','pool'));
await parserCase('P14','Heidelberg erzeugt keine zusätzliche Berg-Pflicht','Hotel in Heidelberg',r=>has(r,'city','Heidelberg')&&!has(r,'feature','near_mountains'));
await parserCase('P15','Nordsee wird nicht als Binnensee interpretiert','Hotel an der Nordsee',r=>!has(r,'feature','near_lake')&&has(r,'feature','near_sea'));
await parserCase('P16','Gewählter Hotel-Tab wird nicht still überschrieben','Ferienwohnung in Berlin',r=>has(r,'type','hotel'),{type:'hotel'});
await parserCase('P17','Vier Hotelsterne werden erkannt','Hotel mit 4 Sternen',r=>has(r,'hotel_stars','4'));
await parserCase('P18','Mindestens vier Hotelsterne werden erkannt','Hotel mindestens 4 Sterne',r=>has(r,'min_hotel_stars','4')&&!has(r,'hotel_stars','4'));
await parserCase('P19','Höchstens drei Hotelsterne werden erkannt','Hotel maximal 3 Sterne',r=>has(r,'max_hotel_stars','3'));
await parserCase('P20','Dezimale Mindestbewertung bleibt erhalten','Hotel Bewertung mindestens 8,5',r=>has(r,'min_review_score','8.5'));
await parserCase('P21','99,50 Euro bleibt als Preis erhalten','Hotel bis 99,50 Euro pro Nacht',r=>has(r,'max_price_per_night','99.5'));
await parserCase('P22','1.200 Euro bleibt als Preis erhalten','Hotel bis 1.200 Euro pro Nacht',r=>has(r,'max_price_per_night','1200'));
await parserCase('P23','Gesamtbudget mit Textdauer wird auf Nachtpreis umgerechnet','Hotel 700 Euro für 7 Nächte',r=>has(r,'max_price_per_night','100'));
await parserCase('P24','Gesamtbudget mit Formulardauer wird ebenfalls umgerechnet','Hotel Budget 700 Euro',r=>has(r,'max_price_per_night','100'));
await parserCase('P25','Budgetuntergrenze wird mit der Dauer umgerechnet','Hotel zwischen 500 und 700 Euro für 7 Nächte',r=>Number(r.params.min_price_per_night?.[0])>=500/7&&Number(r.params.min_price_per_night?.[0])<=72);
await parserCase('P26','Dativ Schlafzimmern wird erkannt','Ferienwohnung mit 3 Schlafzimmern',r=>has(r,'min_bedrooms','3')||has(r,'bedrooms','3'));
await parserCase('P27','Mindestens zwei Schlafzimmer werden erkannt','Ferienwohnung mindestens 2 Schlafzimmer',r=>has(r,'min_bedrooms','2'));
await parserCase('P28','Numerische Daten mit Jahr werden berücksichtigt','Hotel vom 01.06.2027 bis 08.06.2027',r=>has(r,'check_in','2027-06-01')&&has(r,'check_out','2027-06-08'));
await parserCase('P29','Unmöglicher 31. Februar wird nicht an die Suche übergeben','Hotel vom 31. Februar bis 5. März',r=>!has(r,'check_in','2027-02-31'));
await parserCase('P30','Jahresangabe erreicht die Suchschnittstelle','Hotel im Juli 2028',r=>has(r,'year','2028'));
await parserCase('P31','Gesendete Daten und Nächte sind intern konsistent','Hotel für 3 Nächte',r=>(Date.parse(r.params.check_out?.[0])-Date.parse(r.params.check_in?.[0]))/86400000===Number(r.params.nights?.[0]));
await parserCase('P32','Einfache lokal verstandene Suche ruft keinen KI-Fallback auf','Hotel in Berlin',r=>r.aiCalls===0);
await parserCase('P33','KI-Keys werden schon beim ersten KI-Aufruf geprüft','Hotel in Berlin',r=>!has(r,'feature','not_a_real_feature'),{aiStatus:200,criteria:{features:['not_a_real_feature']}});
await parserCase('P34','Lokal erkanntes Berlin korrigiert widersprüchliches KI-Land','Hotel in Berlin',r=>has(r,'country','Deutschland'),{aiStatus:200,criteria:{country:'Italien'}});
await parserCase('P35','Flughafennähe wird unterstützt oder ausdrücklich als unerfüllt gemeldet','Hotel nahe Flughafen',r=>has(r,'feature','near_airport')||has(r,'location_feature','near_airport')||r.messages.some(x=>/nicht unterstützt/.test(x)));
await parserCase('P36','Kostenloser Parkplatz verliert nicht seine kostenlose Eigenschaft','Hotel mit kostenlosem Parkplatz',r=>has(r,'feature','free_parking'));
await parserCase('P37','Optionaler Pool wird nicht als hartes Muss an die API geschickt','Hotel mit Pool wäre schön',r=>!has(r,'must_feature','pool'));
await parserCase('P38','KI-Ausfall verhindert lokale Parameter nicht','Hotel in Berlin',r=>has(r,'city','Berlin')&&Boolean(r.url),{aiStatus:500});

await routeCase('A01','Hauptdatenquelle filtert Stadt korrekt','type=hotel&city=Berlin',r=>names(r).includes('Eigenes Hotel Berlin')&&!names(r).includes('Eigener Campingplatz München'));
await routeCase('A02','Expedia-Hotel ist grundsätzlich ansprechbar','type=hotel&city=Berlin',r=>names(r).includes('Expedia Hotel Berlin'));
await routeCase('A03','Standard-Personenzahl blockiert den Hotelimport nicht pauschal','type=hotel&city=Berlin&max_guests=2',r=>names(r).includes('Expedia Hotel Berlin'));
await routeCase('A04','Campingimport beachtet den Stadtfilter','type=campsite&city=Berlin',r=>!names(r).includes('Feed München mit Ausstattung'));
await routeCase('A05','Campingimport erfüllt Pool-Pflicht aus feature=pool','type=campsite&feature=pool',noWrongFeed);
await routeCase('A06','Campingimport erfüllt Pool-Pflicht aus has_pool=true','type=campsite&has_pool=true',noWrongFeed);
await routeCase('A07','Campingimport erfüllt Hunde-Pflicht aus feature=dogs_allowed','type=campsite&feature=dogs_allowed',noWrongFeed);
await routeCase('A08','Alter direkter Hunde-Parameter funktioniert','type=campsite&dogs_allowed=true',r=>noWrongFeed(r)&&names(r).includes('Feed München mit Ausstattung'));
await routeCase('A09','Campingimport erfüllt WLAN-Pflicht','type=campsite&feature=wifi',noWrongFeed);
await routeCase('A10','Campingimport erfüllt Mindestbewertung','type=campsite&min_review_score=4',noWrongFeed);
await routeCase('A11','Unbekannte Campingkapazität erfüllt keine Pflicht für zehn Gäste','type=campsite&max_guests=10',r=>r.body.accommodations.length===0);
await routeCase('A12','Unbestätigter Campingpreis erfüllt keine harte Preisgrenze','type=campsite&max_price_per_night=30',r=>r.body.accommodations.length===0);
await routeCase('A13','Unbestätigte Meernähe erfüllt keinen Pflichtfilter','type=campsite&near_sea=true',r=>!names(r).some(n=>n.startsWith('Feed ')));
await routeCase('A14','Unbekanntes Pflichtfeature wird nicht als erfüllt behauptet','type=campsite&feature=unknown_feature',r=>r.body.accommodations.length===0&&r.body.missing_features.includes('unknown_feature'));
await routeCase('A15','Hauptdatenquelle erfüllt Preisgrenze','type=hotel&max_price_per_night=30',r=>!names(r).includes('Eigenes Hotel Berlin'));
await routeCase('A16','Hauptdatenquelle erfüllt Kapazität','type=hotel&max_guests=10',r=>r.body.accommodations.length===0);
await routeCase('A17','Erfolgloser Featurejoin der Hauptquelle blockiert passende Campingquelle nicht','type=campsite&feature=dogs_allowed',r=>names(r).includes('Feed München mit Ausstattung'),{...tables,accommodation_features:[]});
await routeCase('A18','Optionaler Wunsch schließt Haupttreffer ohne Verknüpfung nicht aus','type=hotel&feature=pool&preferred_feature=pool',r=>names(r).includes('Eigenes Hotel Berlin'),{...tables,accommodation_features:[]});
await routeCase('A19','Pflichtfeature wird tatsächlich angewendet','type=hotel&feature=pool&must_feature=pool',r=>!names(r).includes('Eigenes Hotel Berlin'),{...tables,accommodation_features:[]});
await routeCase('A20','Campingimport beachtet Reisemonat','type=campsite&month=1',r=>!names(r).includes('Feed München mit Ausstattung'));
await routeCase('A21','Ausfall der Campingquelle wird als Teilausfall kenntlich gemacht','type=campsite',r=>r.status>=500||Boolean(r.body.warnings?.length),tables,{errors:{camping_info_campsites:'Simulierter Verbindungsfehler'}});
await routeCase('A22','Negatives Poolkriterium wird serverseitig angewendet','type=hotel&exclude_feature=pool',r=>!names(r).includes('Eigenes Hotel Berlin'));

const dates1=await queryAccommodations('type=hotel&check_in=2027-07-01&check_out=2027-07-08',tables);
const dates2=await queryAccommodations('type=hotel&check_in=2030-01-01&check_out=2030-01-15',tables);
const coverageNotes={datesGenerateIdenticalDatabaseQueries:JSON.stringify(dates1.calls)===JSON.stringify(dates2.calls),note:'Die Tagesverfügbarkeit ist ohne Kalender-/Partneranbindung nicht prüfbar. Identische DB-Abfragen belegen die aktuelle Funktionalitätsgrenze; kein Live-Buchungstest.'};
const summary={sourceCommit:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),date:'2026-10-30',total:checks.length,passed:checks.filter(x=>x.pass).length,failed:checks.filter(x=>!x.pass).length};
const compactChecks=checks.map(item=>{
 const e=item.evidence;
 if(!e)return item;
 const evidence=e.query?{query:e.query,params:e.params,aiCalls:e.aiCalls,normalized:e.normalized,dropped:e.dropped,messages:e.messages}:{params:e.params,status:e.status,names:e.body.accommodations?.map(x=>x.name),missing_features:e.body.missing_features,warnings:e.body.warnings,queries:e.calls.map(({table,filters,range})=>({table,filters,range}))};
 return {...item,evidence};
});
fs.writeFileSync(new URL('./results.json',import.meta.url),JSON.stringify({summary,method:'Unveränderte produktive Parser und GET-Route werden geladen; KI und Supabase werden ausschließlich an den externen Grenzen kontrolliert simuliert. Keine echten API-Aufrufe oder Datenbankänderungen.',coverageNotes,checks:compactChecks},null,2));
for(const item of checks)console.log(`${item.pass?'PASS':'FAIL'} ${item.id}: ${item.label}`);
console.log(JSON.stringify(summary));
process.exitCode=summary.failed?1:0;
