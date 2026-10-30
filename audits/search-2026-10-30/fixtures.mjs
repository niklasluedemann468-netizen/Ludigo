export const features=['pool','wifi','dogs_allowed','near_sea','near_lake','near_mountains','kitchen','sauna'].map((key,i)=>({id:i+1,key}));
const base={is_active:true,country:'Deutschland',region:'Bayern',city:'München',price_min:80,review_score:8,hotel_stars:4,max_guests:4,available_months:[7],affiliate_url:'https://example.invalid/offer',has_wifi:true,has_pool:true,dogs_allowed:true,near_sea:false,near_lake:false,near_mountains:false};
export const tables={
 features,
 accommodations:[
  {...base,id:1,name:'Eigenes Hotel Berlin',city:'Berlin',region:'Berlin',accommodation_type:'hotel'},
  {...base,id:2,name:'Eigener Campingplatz München',accommodation_type:'campsite'},
  {...base,id:3,name:'Eigene Ferienwohnung',accommodation_type:'holiday_apartment',apartment_bedrooms:3},
 ],
 accommodation_features:features.filter(f=>['pool','wifi','dogs_allowed','kitchen','sauna'].includes(f.key)).flatMap(f=>[1,2,3].map(id=>({accommodation_id:id,feature_id:f.id}))),
 camping_info_campsites:[
  {id:10,name:'Feed Berlin ohne Ausstattung',city:'Berlin',region:'Berlin',country:'Deutschland',description:null,rating:2,price:100,currency:'EUR',has_wifi:false,has_pool:false,dogs_allowed:false,max_guests:1,available_months:[1]},
  {id:11,name:'Feed München mit Ausstattung',city:'München',region:'Bayern',country:'Deutschland',description:null,rating:4.5,price:50,currency:'EUR',has_wifi:true,has_pool:true,dogs_allowed:true,max_guests:4,available_months:[7]},
 ],
 expedia_accommodations:[{...base,id:20,name:'Expedia Hotel Berlin',city:'Berlin',region:'Berlin',accommodation_type:'hotel'}],
};
