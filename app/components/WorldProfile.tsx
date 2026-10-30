'use client';
import {useEffect,useRef,useState,type FormEvent} from 'react';
import type {WorldContent} from '../lib/world-content';
import {Icon} from './LudigoChrome';
type Profile={values:Record<string,string>;rows:{label:string;value:string}[];idea:string;text:string};
const ideas:Record<string,Record<string,string>>={
 bike:{easy:'Dein Wunsch: eine Tour mit Zeit für Pausen, kleine Entdeckungen und ein entspanntes Tempo. Die passende konkrete Strecke wird hier noch nicht ermittelt.',active:'Dein Wunsch: eine Tour, bei der das Radfahren im Mittelpunkt steht. Strecke und Etappen sollen zu deinem persönlichen Rhythmus passen.',mixed:'Dein Wunsch: eine Mischung aus Radfahren und Zeit vor Ort. Unterwegssein und Entdecken sollen gleichermaßen Platz haben.'},
 bus:{culture:'Dein Wunsch: gemeinsam neue Orte und Kultur kennenlernen. Ein passendes Reiseprogramm soll genug Raum für Besichtigungen und eigene Zeit bieten.',nature:'Dein Wunsch: gemeinsam Landschaften entdecken und Zeit im Grünen verbringen. Das genaue Programm soll zu deinem gewünschten Reisetempo passen.',enjoyment:'Dein Wunsch: gemeinsam eine angenehme Auszeit genießen, mit Zeit zum Ankommen und für gesellige Momente.'}
};
export default function WorldProfile({content}:{content:WorldContent}){
 const form=useRef<HTMLFormElement>(null),result=useRef<HTMLDivElement>(null),copy=useRef<HTMLTextAreaElement>(null);
 const [profile,setProfile]=useState<Profile|null>(null),[status,setStatus]=useState(''),[showCopy,setShowCopy]=useState(false);
 const storageKey=`ludigo-world-profile-v1-${content.key}`;
 function readForm(element:HTMLFormElement):Profile{
  const values:Record<string,string>={},rows:{label:string;value:string}[]=[];
  for(const field of content.fields){
   const control=element.elements.namedItem(field.name) as HTMLInputElement|HTMLSelectElement;
   values[field.name]=control.value.trim();
   rows.push({label:field.label,value:control instanceof HTMLSelectElement?control.selectedOptions[0].textContent||control.value:control.value.trim()+(field.unit||'')});
  }
  const idea=ideas[content.key]?.[values.interest||values.pace]||'';
  return {values,rows,idea,text:`${content.title}\nDein Wunschprofil\n\n${rows.map(row=>`${row.label}: ${row.value}`).join('\n')}\n\n${idea}\n\nReisewelt in Planung. Kein verfügbares Reiseangebot; keine Anfrage versendet.`};
 }
 useEffect(()=>{
  try{
   const saved:unknown=JSON.parse(localStorage.getItem(storageKey)||'null');
   if(!saved||typeof saved!=='object'||Array.isArray(saved)||!form.current)return;
   const values=saved as Record<string,unknown>;
   for(const field of content.fields){
    const value=values[field.name];
    if(typeof value!=='string'||!value.trim()||(field.maxlength&&value.length>Number(field.maxlength)))return;
    if(field.options&&!field.options.some(option=>option[0]===value))return;
   }
   for(const field of content.fields){(form.current.elements.namedItem(field.name) as HTMLInputElement|HTMLSelectElement).value=String(values[field.name]);}
   if(form.current.checkValidity()){setProfile(readForm(form.current));setStatus('Dein gespeichertes Wunschprofil aus diesem Browser ist wieder da.');}
  }catch{/* Storage is optional. */}
 // The form definition is fixed for this mounted world page.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[storageKey]);
 function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  for(const field of content.fields){const input=event.currentTarget.elements.namedItem(field.name) as HTMLInputElement|HTMLSelectElement;if(!input.value.trim()){input.setCustomValidity('Bitte gib einen gewünschten Ort ein.');input.reportValidity();return;}}
  setProfile(readForm(event.currentTarget));setShowCopy(false);setStatus('Dein Wunschprofil ist zusammengestellt. Du kannst es in diesem Browser speichern oder als Text kopieren.');
  requestAnimationFrame(()=>{result.current?.focus({preventScroll:true});result.current?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});});
 }
 function save(){if(!profile)return;try{localStorage.setItem(storageKey,JSON.stringify(profile.values));setStatus('Dein Wunschprofil ist in diesem Browser gespeichert. Es wurde keine Anfrage versendet.');}catch{setStatus('Das Speichern im Browser ist nicht verfügbar. Du kannst dein Profil als Text kopieren.');}}
 async function copyText(){if(!profile)return;try{await navigator.clipboard.writeText(profile.text);setStatus('Dein Wunschprofil wurde als Text kopiert.');}catch{setShowCopy(true);setStatus('Dein Profil steht im markierten Textfeld zum manuellen Kopieren bereit.');requestAnimationFrame(()=>{copy.current?.focus();copy.current?.select();});}}
 function reset(){form.current?.reset();setProfile(null);setShowCopy(false);try{localStorage.removeItem(storageKey);setStatus('Dein Wunschprofil wurde zurückgesetzt und aus diesem Browser entfernt.');}catch{setStatus('Das Formular ist zurückgesetzt. Der Browserspeicher ist gerade nicht zugänglich.');}form.current?.querySelector<HTMLInputElement|HTMLSelectElement>('input,select')?.focus();}
 return <div className="planner-panel"><h3>{content.form_title}</h3><form ref={form} onSubmit={submit} onInput={event=>{(event.target as HTMLInputElement).setCustomValidity?.('');if(profile){setProfile(null);setStatus('Du hast deine Wünsche geändert. Stelle dein Profil erneut zusammen.');}}}><div className="planner-fields">{content.fields.map(field=><div className="planner-field" key={field.name}><label htmlFor={`${content.key}-${field.name}`}>{field.label}</label>{field.options?<select id={`${content.key}-${field.name}`} name={field.name} defaultValue={field.default||field.options[0][0]} required>{field.options.map(option=><option key={option[0]} value={option[0]}>{option[1]}</option>)}</select>:<input id={`${content.key}-${field.name}`} name={field.name} type={field.type||'text'} defaultValue={field.value||''} placeholder={field.placeholder} min={field.min} max={field.max} maxLength={field.maxlength?Number(field.maxlength):undefined} aria-describedby={field.hint?`${content.key}-${field.name}-hint`:undefined} required/>}{field.hint&&<small className="field-hint" id={`${content.key}-${field.name}-hint`}>{field.hint}</small>}</div>)}</div><button type="submit" className="primary-button">{content.submit}<Icon name="arrow"/></button></form><p className="planner-status" role="status" aria-live="polite">{status}</p>
 {profile&&<div ref={result} className="profile-result" tabIndex={-1} aria-labelledby="profile-heading"><h4 id="profile-heading">Dein Wunschprofil</h4><dl>{profile.rows.map(row=><div className="profile-row" key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl><p className="profile-idea">{profile.idea}</p><p className="profile-disclosure">Beispielhafte Planungshilfe. Kein verfügbares Reiseangebot und keine versendete Anfrage.</p><div className="profile-actions"><button type="button" className="secondary-button" onClick={save}>Im Browser speichern</button><button type="button" className="secondary-button" onClick={copyText}>Text kopieren</button><button type="button" className="secondary-button" onClick={reset}>Zurücksetzen</button></div>{showCopy&&<textarea ref={copy} className="profile-copy" aria-label="Wunschprofil zum manuellen Kopieren" value={profile.text} readOnly/>}</div>}</div>;
}
