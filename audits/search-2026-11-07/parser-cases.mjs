const keys=['city_center','old_town','near_forest','mountain_view','private_terrace','private_garden','infinity_pool','private_cinema','solar_power','ev_charging','private_ev_charger','reception_24h','safe','room_safe','cctv','cctv_outside','late_check_out','sofa_bed','concierge','wifi','pool','renewable_energy'];
const facts=positive=>Object.fromEntries(keys.map(key=>[key,positive.includes(key)]));
const a=facts(keys),b=facts(['city_center','private_garden','ev_charging','reception_24h','safe','cctv','sofa_bed','wifi']),c=facts(['private_cinema','room_safe','solar_power','pool','concierge']);delete c.safe;delete c.cctv;
export const parserTables={accommodations:[
 {id:1,name:'A',is_active:true,accommodation_type:'hotel',city:'Berlin',country:'Deutschland',hotel_stars:4,amenities:a},
 {id:2,name:'B',is_active:true,accommodation_type:'hotel',city:'Berlin',country:'Deutschland',hotel_stars:3,...b},
 {id:3,name:'C',is_active:true,accommodation_type:'hotel',city:'Berlin',country:'Deutschland',hotel_stars:5,facilities:c},
 {id:4,name:'Unbekannt',is_active:true,accommodation_type:'hotel',city:'Berlin',country:'Deutschland'},
 {id:6,name:'D',is_active:true,accommodation_type:'hotel',city:'Berlin',country:'Deutschland',safe:false,ev_charging:false},
 {id:5,name:'Falscher Ort',is_active:true,accommodation_type:'hotel',city:'München',country:'Deutschland',hotel_stars:4,amenities:a},
],features:[],accommodation_features:[],camping_info_campsites:[],expedia_accommodations:[]};
// Independent expected memberships; the expected result never calls the production filter.
export const parserCases=[
 {id:'P01',file:'cityParser.ts',query:'Hotel in Berlin im Stadtzentrum',hard:['city_center'],names:['A','B']},
 {id:'P02',file:'cityParser.ts',query:'Hotel in Berlin in der Altstadt',hard:['old_town'],names:['A']},
 {id:'P03',file:'natureParser.ts',query:'Hotel in Berlin nahe am Wald',hard:['near_forest'],names:['A']},
 {id:'P04',file:'natureParser.ts',query:'Hotel in Berlin mit Bergblick',hard:['mountain_view'],names:['A']},
 {id:'P05',file:'romanceParser.ts',query:'Hotel in Berlin mit privater Terrasse',hard:['private_terrace'],names:['A']},
 {id:'P06',file:'romanceParser.ts',query:'Hotel in Berlin mit privatem Garten',hard:['private_garden'],names:['A','B']},
 {id:'P07',file:'luxuryParser.ts',query:'Hotel in Berlin mit Infinity Pool',hard:['infinity_pool'],names:['A']},
 {id:'P08',file:'luxuryParser.ts',query:'Hotel in Berlin mit privatem Kino',hard:['private_cinema'],names:['A','C']},
 {id:'P09',file:'sustainabilityParser.ts',query:'Hotel in Berlin mit Solarstrom',hard:['solar_power'],names:['A','C']},
 {id:'P10',file:'sustainabilityParser.ts',query:'Hotel in Berlin mit E-Ladestation',hard:['ev_charging'],names:['A','B']},
 {id:'P11',file:'securityParser.ts',query:'Hotel in Berlin mit 24h Rezeption',hard:['reception_24h'],names:['A','B']},
 {id:'P12',file:'securityParser.ts',query:'Hotel in Berlin mit Zimmersafe',hard:['room_safe'],names:['A','C']},
 {id:'P13',file:'securityParser.ts',query:'Hotel in Berlin mit Videoüberwachung außen',hard:['cctv_outside'],names:['A']},
 {id:'P14',file:'extendedSearchParser.ts',query:'Hotel in Berlin mit Late Check-out',hard:['late_check_out'],names:['A']},
 {id:'P15',file:'extendedSearchParser.ts',query:'Hotel in Berlin mit Schlafsofa',hard:['sofa_bed'],names:['A','B']},
 {id:'P16',file:'extendedSearchParser.ts',query:'Hotel in Berlin mit Concierge',hard:['concierge'],names:['A','C']},
 {id:'P17',file:'hotelStarsParser.ts',query:'Hotel in Berlin mindestens 4 Sterne',values:{min_hotel_stars:'4'},names:['A','C']},
 {id:'P18',file:'hotelStarsParser.ts',query:'Hotel in Berlin zwischen 3 und 4 Sternen',values:{min_hotel_stars:'3',max_hotel_stars:'4'},names:['A','B']},
 {id:'P19',file:'preferenceParser.ts',query:'Hotel in Berlin WLAN muss sein, Pool wäre schön',hard:['wifi'],preferred:['pool'],names:['A','B']},
 {id:'P20',file:'searchParamCleanup.ts',query:'Hotel in Berlin ohne Safe',excluded:['safe'],names:['D']},
 {id:'P21',file:'dbFeatureMapper.ts',query:'Hotel in Berlin mit Safe und 24h Rezeption',hard:['safe','reception_24h'],names:['A','B']},
 {id:'P22',file:'sustainabilityParser.ts',query:'Hotel in Berlin mit privater Wallbox',hard:['private_ev_charger'],names:['A']},
 {id:'P23',file:'preferenceParser.ts',query:'Hotel in Berlin mit Pool, E-Ladestation wäre schön',hard:['pool'],preferred:['ev_charging'],names:['A','C']},
 {id:'P24',file:'extendedSearchParser.ts',query:'Hotel in Berlin mit Bademantel',hard:['bathrobe'],names:[]},
 {id:'P25',file:'sustainabilityParser.ts',query:'Hotel in Berlin ohne E-Ladestation',excluded:['ev_charging'],names:['C','D']},
 {id:'P26',file:'sustainabilityParser.ts',query:'Hotel in Berlin mit Wallbox und 24h Rezeption',hard:['ev_charging','reception_24h'],names:['A','B']},
 {id:'P27',file:'romanceParser.ts',query:'Hotel in Berlin mit privater Terrasse und 24h Rezeption und E-Ladestation',hard:['private_terrace','reception_24h','ev_charging'],names:['A']},
 {id:'P28',file:'securityParser.ts',query:'Hotel in Berlin ohne 24h Rezeption',excluded:['reception_24h'],names:['C']},
 {id:'P29',file:'securityParser.ts',query:'Hotel in Berlin mit Pool, 24h Rezeption wäre schön',hard:['pool'],preferred:['reception_24h'],names:['A','C']},
 {id:'P30',file:'sustainabilityParser.ts',query:'Hotel in Berlin Solarstrom wäre schön, WLAN muss sein',hard:['wifi'],preferred:['solar_power'],names:['A','B']},
];
