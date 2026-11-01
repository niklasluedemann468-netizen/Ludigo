import { normalizeSemanticText } from '../searchTextNormalizer';
export function applyTextBudget(params: URLSearchParams, query: string, guests: number): void {
 const text=normalizeSemanticText(query);
 const prices=[...text.matchAll(/(?<![\d.,])(\d+(?:[.,]\d+)*)\s*(?:€|euros?\b|eur\b)/giu)];
 const markers=[...text.matchAll(/\b(?:pro|je|die)\s+(?:nacht|übernachtung|uebernachtung)\b|\b(?:insgesamt|gesamtbudget|gesamtpreis|budget)\b/giu)];
 if(!markers.length)return;
 const amount=(value:string)=>Number(value.replace(/\.(?=\d{3}(?:\D|$))/g,'').replace(',','.'));
 for(const price of prices){
  const start=price.index!,end=start+price[0].length;
  const distance=(marker:RegExpMatchArray)=>Math.max(0,marker.index!-end,start-marker.index!-marker[0].length);
  const nightly=(value:string)=>/^(?:pro|je|die)\s/u.test(value);
  const marker=[...markers].sort((a,b)=>distance(a)-distance(b)||Number(nightly(b[0]))-Number(nightly(a[0])))[0];
  const basis=nightly(marker[0])?'price_per_night':'total_price';
  const prefix=text.slice(Math.max(0,start-65),start);
  const lower=/\b(?:mindestens|minimum|min\.?|ab)\s*(?:(?:preis|budget|gesamtpreis|gesamtbudget)\s*)?$/u.test(prefix);
  const target=`${lower?'min':'max'}_${basis}`;
  const perPerson=/^\s*(?:pro|je)\s+person\b/u.test(text.slice(end));
  const value=amount(price[1])*(perPerson?guests:1);
  if(!Number.isFinite(value))continue;
  const previous=[params.get(target),...(target==='max_total_price'?[params.get('total_budget')]:[])].filter((v):v is string=>v!==null).map(Number).filter(Number.isFinite);
  params.set(target,String(lower?Math.max(value,...previous):Math.min(value,...previous)));
 }
}
