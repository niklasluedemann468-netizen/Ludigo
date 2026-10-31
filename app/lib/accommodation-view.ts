import type { SearchResult, SortOption } from './accommodation-types';
export function usableNumber(value: unknown): number | null {
  if ((typeof value !== 'number' && typeof value !== 'string') || String(value).trim() === '') return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}
export function safeOfferUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; }
  catch { return null; }
}
export function normalizedRating(item:SearchResult):number|null {
  const rating=usableNumber(item.review_score);
  const scale=usableNumber(item.review_scale)??(item.provider_name==='camping.info'?5:10);
  return rating!==null&&rating<=scale?rating/scale*10:null;
}
export function sortAccommodations(items: SearchResult[], option: SortOption): SearchResult[] {
  return [...items].sort((a,b) => {
    if (option === 'best') return 0;
    const first=option==='rating'?normalizedRating(a):usableNumber(a.price_min);
    const second=option==='rating'?normalizedRating(b):usableNumber(b.price_min);
    if(first===null)return second===null?0:1;
    if(second===null)return -1;
    return option==='price_asc'?first-second:second-first;
  });
}
export function displayPrice(item: SearchResult) {
  const price=usableNumber(item.price_min),partner=usableNumber(item.partner_price);
  function format(value:number) {
    try{return new Intl.NumberFormat('de-DE',{style:'currency',currency:item.currency||'EUR'}).format(value);}
    catch{return `${value.toLocaleString('de-DE')} ${item.currency||'€'}`;}
  }
  if(price!==null)return {value:format(price),label:'Katalogpreis ab / Nacht',note:'Preis für deinen Zeitraum beim Anbieter prüfen.'};
  if(partner!==null)return {value:format(partner),label:'Preisangabe des Partners',note:'Preisbasis nicht bestätigt. Beim Anbieter prüfen.'};
  return {value:null,label:'Preis & Verfügbarkeit',note:'Beim Anbieter prüfen.'};
}
export function readFavorites(raw:string|null):SearchResult[] {
  try {
    const parsed:unknown=JSON.parse(raw||'[]');
    if(!Array.isArray(parsed))return [];
    const unique=new Map<number,SearchResult>();
    for(const item of parsed.slice(0,200)) {
      if(!item||typeof item!=='object'||typeof item.id!=='number'||!Number.isFinite(item.id)||typeof item.name!=='string'||!item.name.trim())continue;
      unique.set(item.id,item as SearchResult);
    }
    return [...unique.values()];
  }catch{return [];}
}
