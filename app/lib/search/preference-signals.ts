import { termPattern } from './accessibility';
export type FeatureMention = { feature: string; start: number; end: number; preferred: boolean; must: boolean; ignored: boolean; excluded: boolean };
export const commonPreferenceTerms: Record<string, readonly string[]> = {
 wifi:['wlan','wifi'],pool:['pool','schwimmbad'],sauna:['sauna'],parking:['parkplatz','parken'],breakfast:['frühstück','fruehstueck'],
 dogs_allowed:['hund erlaubt','hunde erlaubt','hundefreundlich','mit hund','mit hunden','hund','hunde'],
 near_mountains:['in den bergen','bergnähe','bergnaehe'],city_center:['stadtzentrum','innenstadt','im zentrum'],old_town:['altstadt'],near_airport:['flughafen','airport'],near_train_station:['bahnhof'],near_attractions:['sehenswürdigkeiten','sehenswuerdigkeiten'],rural:['ländlich','laendlich'],nature:['natur'],kitchen:['küche','kueche'],balcony:['balkon'],washing_machine:['waschmaschine'],air_conditioning:['klimaanlage'],
};
// Qualifiers attach to the nearest feature group, not to every earlier criterion.
// Only explicit list connectors join a group: “Hunde und Pool wären schön”.
export function qualifyFeatures(text: string, terms: Record<string,readonly string[]>): FeatureMention[] {
 const result:FeatureMention[]=[];
 const clauses=text.split(/(?<!\d)[.,]|[.,](?!\d)|[;:!?\n]|\b(?:aber|während|waehrend)\b/u);
 for(const clause of clauses){
  const mentions:FeatureMention[]=[];
  for(const [feature,aliases] of Object.entries(terms))for(const alias of aliases){
   const pattern=new RegExp(termPattern(alias).source,'giu');
   for(const match of clause.matchAll(pattern))mentions.push({feature,start:match.index!,end:match.index!+match[0].length,preferred:false,must:false,ignored:false,excluded:false});
  }
  for(const match of clause.matchAll(/\bbarrierefrei(?:e[rmns]?)?\b/giu))mentions.push({feature:'accessible',start:match.index!,end:match.index!+match[0].length,preferred:false,must:false,ignored:false,excluded:false});
  const selected:FeatureMention[]=[];
  for(const mention of mentions.sort((a,b)=>(b.end-b.start)-(a.end-a.start)))if(!selected.some(other=>mention.start<other.end&&mention.end>other.start))selected.push(mention);
  selected.sort((a,b)=>a.start-b.start);
  const groups:FeatureMention[][]=[];
  for(const mention of selected){
   const previous=groups.at(-1)?.at(-1),gap=previous?clause.slice(previous.end,mention.start):'';
   if(previous&&/^\s*(?:und|sowie|oder)\s*(?:mit\s*)?$/u.test(gap))groups.at(-1)!.push(mention);else groups.push([mention]);
   mention.ignored=/^\s*(?:(?:ist|sind)\s+)?(?:nicht (?:nötig|noetig|erforderlich)|egal|kein muss)\b/u.test(clause.slice(mention.end));
   mention.excluded=/\b(?:ohne|kein(?:e[rmns]?)?|nicht(?: mit)?)\s*$/u.test(clause.slice(0,mention.start));
  }
  for(const signal of clause.matchAll(/\b(?:wären? schön|waeren? schoen|wären? gut|waeren? gut|am liebsten|gern|gerne|bevorzugt|wenn möglich|wenn moeglich|idealerweise|optional|muss|unbedingt|zwingend|auf jeden fall|pflicht|brauche|benötige|benoetige)\b/giu)){
   if(/\bkein\s*$/u.test(clause.slice(0,signal.index)))continue;
   const distance=(group:FeatureMention[])=>Math.max(0,signal.index!-group.at(-1)!.end,group[0].start-signal.index!-signal[0].length);
   const group=[...groups].sort((a,b)=>distance(a)-distance(b)||Number(b.at(-1)!.end<=signal.index!)-Number(a.at(-1)!.end<=signal.index!))[0];
   if(!group)continue;
   const must=/^(?:muss|unbedingt|zwingend|auf jeden fall|pflicht|brauche|benötige|benoetige)$/u.test(signal[0]);
   for(const mention of group)if(!mention.ignored){if(must)mention.must=true;else mention.preferred=true;}
  }
  result.push(...selected);
 }
 return result;
}
