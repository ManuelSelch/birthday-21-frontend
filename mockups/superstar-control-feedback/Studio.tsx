import { useEffect, useRef, useState } from 'react';
import manuelPhoto from './assets/manuel.jpg';
import marcoPhoto from './assets/marco.jpg';
import davidPhoto from './assets/david.jpg';
import { Button, SegmentedControl, Select } from '@mantine/core';
import { IconStarFilled, IconBoltFilled, IconCode, IconConfetti, IconCamera, IconCards, IconMicrophone, IconPlayerPlay, IconArrowUpRight, IconHeartFilled, IconDeviceTv, IconSparkles } from '@tabler/icons-react';

type Direction = 'birthday' | 'pop' | 'gala' | 'arcade';
type Scene = 'act' | 'camera' | 'vote' | 'results' | 'idle';
const directions = {
  birthday: {name:'Birthday 21', eyebrow:'DREI MAL 21 / DIE GEBURTSTAGSSHOW', title:'Ein Abend. Lauter Superstars.', description:'Unsere Bühne für eure Talente. Persönlich, ein bisschen feierlich und mit ganz viel Applaus.', question:'Welchen Preis verdient dieser Act?', answers:['Goldene Gänsehaut','Orden für maximalen Mut','Pokal der offenen Münder'], values:[27,24,49], award:'Pokal der offenen Münder', voting:'Das Publikum vergibt liebevolle Fantasiepreise. Jeder Act bekommt seinen eigenen großen Moment.'},
  pop: {name:'Pop-Party', eyebrow:'01 / LAUT, BUNT, ZUSAMMEN', title:'Die Bühne gehört euch.', description:'Festival-Plakat trifft Wohnzimmerparty. Große Typo, freche Sticker und jede Menge Rückenwind.', question:'Was war gerade dein Gedanke?', answers:['Wie macht er das?!','Ich brauche eine Zeitlupe.','Joschua, erklär dich!'], values:[52,31,17], award:'100 % Staunen', voting:'Ein Stimmungsbild pro Act. Keine Punkte, keine Verlierer — nur die beste Publikumsreaktion.'},
  gala: {name:'Geburtstagsshow', eyebrow:'02 / GROSSE SHOW, KLEINES AUGENZWINKERN', title:'Ein Abend. Lauter Legenden.', description:'Samtblau, warme Scheinwerfer und ein goldener Moment. Ein bisschen Fernsehen, nur viel persönlicher.', question:'Welchen Preis verdient dieser Act?', answers:['Goldene Gänsehaut','Orden für maximalen Mut','Pokal der offenen Münder'], values:[27,24,49], award:'Pokal der offenen Münder', voting:'Das Publikum vergibt liebevolle Fantasiepreise. Jeder Act bekommt seinen eigenen großen Moment.'},
  arcade: {name:'Level 21', eyebrow:'03 / SPIELERISCH, PIXELIG, NICHT GANZ ERNST', title:'Neues Level. Gleiche Chaoten.', description:'Die Geburtstagsparty als Koop-Spiel. Jeder Act ein neues Level, jeder Buzzer ein Power-up.', question:'Welches Power-up schalten wir frei?', answers:['Zauber-Level +1','Noch eine Runde!','Endgegner: Kartentrick'], values:[36,46,18], award:'Noch eine Runde!', voting:'Gemeinsam statt gegeneinander: Das Publikum wählt ein Power-up für den Act. Keine Rangliste.'}
};
const jurors = [
  {name:'Manuel', photo:manuelPhoto, label:'Sauber abgeliefert!', sub:'BEGEISTERUNG ERFOLGREICH KOMPILIERT', Icon:IconCode, color:'mint'},
  {name:'Marco', photo:marcoPhoto, label:'Volle Spannung!', sub:'ACHTUNG: HOCHSPANNUNGS-TALENT', Icon:IconBoltFilled, color:'pink'},
  {name:'David', photo:davidPhoto, label:'Zugabe!', sub:'DAVON GEHT NOCH EINE RUNDE', Icon:IconHeartFilled, color:'orange'}
];
const performers = [
  {name:'Joschua',act:'Kartenzauber',initials:'JO', Icon:IconCards},
  {name:'Danny',act:'Jonglieren',initials:'DA', Icon:IconSparkles},
  {name:'Johannes',act:'Klavier',initials:'JO', Icon:IconStarFilled},
  {name:'Jakob',act:'Zeichentalent',initials:'JA', Icon:IconStarFilled},
  {name:'Charlie',act:'Karaoke? / noch offen',initials:'CH', Icon:IconMicrophone},
  {name:'Daniel, Thiebaud & Leonard',act:'Überraschung / noch offen',initials:'DTL', Icon:IconSparkles}
];
const sceneLabels: Record<Scene,string> = {act:'Auftritt',camera:'Kamera',vote:'Abstimmung',results:'Ergebnis',idle:'Showpause'};
const params = new URLSearchParams(window.location.search);
const initialDirection = (['birthday','pop','gala','arcade'].includes(params.get('design') ?? '') ? params.get('design') : 'birthday') as Direction;
const initialScene = (Object.keys(sceneLabels).includes(params.get('scene') ?? '') ? params.get('scene') : 'act') as Scene;

function Confetti({burst}: {burst:number}) {
  return <div className="confetti" aria-hidden="true" key={burst}>{Array.from({length:42},(_,i)=><i key={i} style={{left:`${(i*37)%100}%`,background:['#e6d4b7','#c6ab87','#f7f3ed','#a88b70'][i%4],animationDelay:`${(i%9)*0.09}s`,transform:`rotate(${i*31}deg)`}}/>)}</div>;
}

function CameraIllustration(){
  return <div className="camera-illustration"><div className="camera-grain"/><div className="camera-stamp"><IconCamera size={16}/> KAMERA-VORSCHAU / SIMULIERT</div><div className="table-shadow"/><div className="playing-card card-back"/><div className="playing-card card-front"><span>A<br/>♥</span><IconHeartFilled/><span>A<br/>♥</span></div><div className="camera-caption">Ganz nah dran.<small>Hier würde die Live-Kamera den Kartentrick zeigen.</small></div></div>;
}

function BuzzerReaction({index}: {index:number}) {
 const [visible,setVisible]=useState(true);
 const juror=jurors[index]; const Icon=juror.Icon;
 useEffect(()=>{const timer=window.setTimeout(()=>setVisible(false),3200);return ()=>window.clearTimeout(timer);},[]);
 if (!visible) return null;
 return <div className={`beamer-reaction reaction-${index}`} role="status"><div className="reaction-wave"/><div className="reaction-mark"><img src={juror.photo} alt={juror.name}/><Icon/></div><div className="reaction-copy"><span>{juror.name.toUpperCase()} FEIERT DICH</span><strong>{juror.label}</strong></div><div className="reaction-sparks" aria-hidden="true">{Array.from({length:12},(_,i)=><IconStarFilled key={i} style={{left:`${8+(i*23)%85}%`,top:`${12+(i*31)%70}%`,animationDelay:`${i*.035}s`}}/>)}</div></div>;
}

function Projector({direction,scene,performer,celebrate,burst,reaction}: {direction:Direction;scene:Scene;performer:typeof performers[number];celebrate:boolean;burst:number;reaction:number|null}){
 const d=directions[direction]; const ActIcon=performer.Icon;
 return <div className={`projector scene-${scene}`}>
   <div className="show-top"><span className="show-wordmark"><IconStarFilled/> GEBURTSTAG SUCHT DEN SUPERSTAR</span><span className="show-edition">DREI MAL 21</span></div>
   {scene==='act' && <div className="act-content"><div className="act-copy"><span className="kicker">KEIN DRUCK. NUR APPLAUS.</span><h2>{performer.name}<span>ist am Start.</span></h2><div className="act-tag"><ActIcon size={21}/>{performer.act}</div><p>Talent optional. Legendenstatus garantiert.</p></div><div className="portrait-art"><span className="portrait-placeholder">FOTO-PLATZHALTER</span><span className="portrait-initials">{performer.initials}</span><span className="portrait-star"><IconStarFilled/></span><span className="portrait-sticker">DEIN<br/>MOMENT!</span></div></div>}
   {scene==='camera' && <div className="camera-layout"><CameraIllustration/><div className="camera-lower"><strong>{performer.name}</strong><span>{performer.act}</span><span className="live-label">NAHAUFNAHME</span></div></div>}
   {(scene==='vote'||scene==='results') && <div className="vote-content"><span className="kicker">{scene==='vote'?'IHR SEID GEFRAGT':'DAS SAGT DAS PUBLIKUM'} / {performer.name.toUpperCase()}</span><h2>{scene==='vote'?d.question:d.award}</h2><div className="vote-options">{d.answers.map((a,i)=><div className={`vote-option ${scene==='results'?'with-result':''}`} key={a}><span className="option-number">0{i+1}</span><strong>{a}</strong>{scene==='results'&&<><span className="result-percent">{d.values[i]} %</span><div className="result-bar" style={{width:`${d.values[i]}%`}}/></>}</div>)}</div><span className="vote-foot">{scene==='vote'?'Mit dem Handy abstimmen / Zugang und QR-Code später':'42 Stimmen / erfundene Vorschauwerte / kein Ranking der Acts'}</span></div>}
   {scene==='idle' && <div className="idle-content"><span className="kicker">MANUEL / MARCO / DAVID</span><h2>21<span>und kein bisschen leise.</span></h2><p>Kurze Pause. Großer Applaus.</p><IconStarFilled className="idle-star"/></div>}
   <div className="show-bottom"><span>ECHTE FREUNDE. UNENTDECKTE TALENTE.</span></div>
   {reaction!==null&&!celebrate&&<BuzzerReaction key={burst} index={reaction}/>}
   {celebrate&&<div className="golden-moment" key={burst}><Confetti burst={burst}/><IconStarFilled/><span>DREI MAL JA ZU DIR.</span><strong>Das ist dein<br/>goldener Moment!</strong><small>KEIN FINALE-TICKET. EINFACH MAXIMALER APPLAUS.</small></div>}
 </div>;
}

function JuryScreen({index,active,mode,burst}: {index:number;active:boolean;mode:string;burst:number}){
 const j=jurors[index]; const Icon=j.Icon;
 return <div className={`jury-screen ${j.color} ${active?'is-active':''}`} key={`${mode}-${burst}`}><div className="jury-body">{active?<><Icon className="jury-symbol"/><strong>{j.label}</strong><small>{j.sub}</small></>:mode==='names'?<><Icon className="jury-id-icon"/><strong>{j.name}</strong><small>BEREIT FÜR DEINEN MOMENT</small></>:mode==='portraits'?<><div className="jury-photo"><img src={j.photo} alt={j.name}/></div><strong>{j.name}</strong></>:<><IconStarFilled className="jury-symbol"/><strong className="jury-art-title">{['DREI','MAL','21'][index]}</strong><small>GEMEINSAM WIRD’S GROSS</small></>}</div>{active&&<div className="jury-rings"/>}</div>;
}

export function Studio(){
 const [direction,setDirection]=useState<Direction>(initialDirection);
 const [scene,setScene]=useState<Scene>(initialScene);
 const [performerIndex,setPerformerIndex]=useState('0');
 const [active,setActive]=useState<boolean[]>([false,false,false]);
 const [celebrate,setCelebrate]=useState(false);
 const [burst,setBurst]=useState(0);
 const [reaction,setReaction]=useState<number|null>(null);
 const juryTimers=useRef<Array<number|undefined>>([]);
 useEffect(()=>()=>{juryTimers.current.forEach(timer=>window.clearTimeout(timer));},[]);
 const [mode,setMode]=useState('portraits');

 const d=directions[direction];
 function updateDirection(v:string){setDirection(v as Direction); const url=new URL(window.location.href);url.searchParams.set('design',v);window.history.replaceState({},'',url);}
 function updateScene(v:string){setScene(v as Scene);setCelebrate(false);setReaction(null);const url=new URL(window.location.href);url.searchParams.set('scene',v);window.history.replaceState({},'',url);}
 function buzz(i:number){
  window.clearTimeout(juryTimers.current[i]);
  setActive(old=>old.map((v,n)=>n===i?true:v));
  juryTimers.current[i]=window.setTimeout(()=>{
   setActive(old=>old.map((v,n)=>n===i?false:v));
  },3200);
  setCelebrate(false);setReaction(i);setBurst(v=>v+1);
 }
 return <div className={`studio theme-${direction} ${direction==='birthday'?'theme-gala':''} `}>
   <header className="studio-header"><a className="studio-brand" href="./"><span>21</span><div>SUPERSTAR<small>MANUEL / MARCO / DAVID</small></div></a><span aria-label="Verbunden" title="Verbunden" style={{marginLeft:'auto',marginRight:-24,width:7,height:7,borderRadius:'50%',background:'#40c057'}} /></header>
   <a className="skip-link" href="#show-preview">Zur Showvorschau</a>
   <main id="show-preview">
    <section className="intro"><div><span className="eyebrow">{d.eyebrow}</span><h1>{d.title}</h1></div></section>
    <nav aria-label="Show-Bildschirme" style={{display:'flex',gap:20,flexWrap:'wrap',marginBottom:24,fontSize:14}}><a href="#">Beamer öffnen</a><a href="#">Manuel öffnen</a><a href="#">Marco öffnen</a><a href="#">David öffnen</a></nav>
    <div className="workspace"><div className="outputs"><div className="output-heading"><span><IconDeviceTv size={16}/> Beamer</span></div><Projector direction={direction} scene={scene} performer={performers[Number(performerIndex)]} celebrate={celebrate} burst={burst} reaction={reaction}/>
      <div className="jury-heading"><span>Jurytisch</span><span>VON LINKS NACH RECHTS</span></div><div className="jury-grid">{jurors.map((j,i)=><JuryScreen key={j.name} index={i} active={active[i]||celebrate} mode={mode} burst={burst}/>)}</div>
    </div>
    <aside className="controls"><div className="control-heading"><span className="status-dot"/><strong>Show-Regie</strong></div>
      <label className="field-label">Beamer</label><div className="scene-buttons">{Object.entries(sceneLabels).map(([v,label])=><Button key={v} variant={scene===v?'filled':'default'} size="xs" onClick={()=>updateScene(v)} leftSection={v==='camera'?<IconCamera size={14}/>:v==='act'?<IconPlayerPlay size={14}/>:undefined}>{label}</Button>)}</div>
      <Select label="Act für die Vorschau" data={performers.map((p,i)=>({value:String(i),label:p.name}))} value={performerIndex} onChange={v=>{setPerformerIndex(v??'0');setActive([false,false,false]);setCelebrate(false);setReaction(null);}} allowDeselect={false}/>
      <div className="control-divider"/><label className="field-label">Jury</label><div className="buzzer-list">{jurors.map((j,i)=><Button key={j.name} variant="default" className={`buzzer-button ${j.color}`} onClick={()=>buzz(i)} leftSection={<j.Icon size={19}/>} rightSection={<IconArrowUpRight size={15}/>}><span className="buzzer-copy"><strong>{j.name}</strong><small>{j.label}</small></span></Button>)}</div>
      <Button className="golden-button" fullWidth leftSection={<IconConfetti size={18}/>} onClick={()=>{setCelebrate(true);setReaction(null);setBurst(v=>v+1);}}>Goldener Moment für alle</Button><Button fullWidth variant="subtle" color="gray" size="xs" onClick={()=>{setActive([false,false,false]);setCelebrate(false);setReaction(null);}}>Reaktionen zurücksetzen</Button>
      <div className="control-divider"/><label className="field-label">03 / JURYTISCH IM RUHEZUSTAND</label><SegmentedControl fullWidth size="xs" value={mode} onChange={setMode} data={[{value:'names',label:'Namen'},{value:'portraits',label:'Porträts'},{value:'art',label:'Showmotiv'}]}/>
    </aside></div>
   </main>
 </div>;
}
