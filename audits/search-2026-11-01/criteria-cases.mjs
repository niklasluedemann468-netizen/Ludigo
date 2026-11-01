import {wildTables} from '../search-2026-10-31/wild-cases.mjs';
export const combinationTables={...wildTables,
 accommodations:[...wildTables.accommodations.map(row=>({...row,price_min:({C1:35,C3:40,H4:39,A6:39})[row.name]??row.price_min})),
  {id:9,name:'C9',is_active:true,accommodation_type:'campsite',city:'Cuxhaven',region:'Nordsee',country:'Deutschland',near_sea:true,dogs_allowed:true,has_pool:false,has_wifi:false,price_min:29,currency:'EUR',max_guests:4},
  {id:19,name:'H9',is_active:true,accommodation_type:'hotel',city:'Rostock',region:'Ostsee',country:'Deutschland',near_sea:true,dogs_allowed:true,has_pool:false,has_wifi:true,price_min:38,currency:'EUR',max_guests:2},
  {id:20,name:'H10',is_active:true,accommodation_type:'hotel',city:'Rostock',region:'Ostsee',country:'Deutschland',near_sea:true,dogs_allowed:false,has_pool:true,has_wifi:true,price_min:39,currency:'EUR',max_guests:3},
  {id:11,name:'A11',is_active:true,accommodation_type:'holiday_apartment',city:'Alicante',region:'Costa Blanca',country:'Spanien',near_sea:true,dogs_allowed:true,has_pool:false,has_wifi:false,price_min:40,currency:'EUR',max_guests:4}],
 expedia_accommodations:wildTables.expedia_accommodations.map(row=>({...row,price_min:30})),
};
const bases=[
 {query:'Camping am Meer',names:['C1','C2','C7','C9'],type:'campsite',hard:['near_sea']},
 {query:'Camping am Merr',names:['C1','C2','C7','C9'],type:'campsite',hard:['near_sea']},
 {query:'Unterkunft am Meer',names:['C1','C2','C7','C9','H5','H9','H10','A6','A11'],hard:['near_sea']},
 {query:'Hotel am Meer',names:['H5','H9','H10'],type:'hotel',hard:['near_sea']},
 {query:'Ferienwohnung am Meer',names:['A6','A11'],type:'holiday_apartment',hard:['near_sea']},
 {query:'Camping an der Nordsee',names:['C2','C9'],type:'campsite',hard:['near_sea'],values:{region:'Nordsee'}},
 {query:'Hotel in Berlin',names:['H4','H8'],type:'hotel',values:{city:'Berlin'}},
 {query:'Ferienwohnung in Alicante',names:['A6','A11'],type:'holiday_apartment',values:{city:'Alicante'}},
 {query:'Camping am See',names:['C3'],type:'campsite',hard:['near_lake']},
 {query:'Unterkunft in Wassernähe',names:['C1','C2','C3','C7','C9','H5','H9','H10','A6','A11'],hard:['near_water']},
];
// Independently specified membership sets. The oracle does not call the production filter.
const suffixes=[
 {query:'mit Hund',names:['C1','C9','H4','H9','A6','A11'],hard:['dogs_allowed']},
 {query:'mit Hund und Pool',names:['C1','H4','A6'],hard:['dogs_allowed','pool']},
 {query:'max Preis 40€ pro Nacht',names:['C1','C2','C3','C9','H4','H8','H9','H10','A6','A11'],values:{max_price_per_night:'40',currency:'EUR'}},
 {query:'Preis maximal 40 € pro Nacht, mit Hund und WLAN',names:['C1','H4','H9','A6'],hard:['dogs_allowed','wifi'],values:{max_price_per_night:'40',currency:'EUR'}},
 {query:'maximal 40€ und pro Nacht, Pool wäre schön',names:['C1','C2','C3','C9','H4','H8','H9','H10','A6','A11'],preferred:['pool'],values:{max_price_per_night:'40',currency:'EUR'}},
 {query:'ohne Hund, bis 40€ pro Nacht',names:['C2','C3','H10'],excluded:['dogs_allowed'],values:{max_price_per_night:'40',currency:'EUR'}},
 {query:'WLAN muss sein, ein Pool wäre schön',names:['C1','C2','H4','H5','H9','H10','A6'],hard:['wifi'],preferred:['pool']},
 {query:'Hunde und Pool wären schön',names:['C1','C2','C3','C7','C9','H4','H5','H8','H9','H10','A6','A11'],preferred:['dogs_allowed','pool']},
 {query:'für 7 Nächte, insgesamt maximal 280 €',names:['C1','C2','C3','C9','H4','H8','H9','H10','A6','A11'],values:{max_price_per_night:'40',max_total_price:'280',nights:'7',currency:'EUR'}},
 {query:'für 2 Erwachsene und 1 Baby, bis 40€ pro Nacht',names:['C1','C3','C9','H4','H10','A6','A11'],values:{max_guests:'3',max_price_per_night:'40',currency:'EUR'}},
];
export const combinationCases=bases.flatMap((base,b)=>suffixes.map((suffix,s)=>({
 id:`K${String(b*10+s+1).padStart(3,'0')}`,
 query:b===2&&s===2?'max Preis 40€ und am Merr pro Nacht':`${base.query} ${suffix.query}`,
 names:base.names.filter(name=>suffix.names.includes(name)).sort(),
 type:base.type??null,hard:[...(base.hard??[]),...(suffix.hard??[])],preferred:suffix.preferred??[],excluded:suffix.excluded??[],values:{...base.values,...suffix.values},
})));
