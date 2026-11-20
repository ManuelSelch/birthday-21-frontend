import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, MantineProvider, createTheme } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { Agentation } from 'agentation';
import '@mantine/core/styles.css';
import './styles.css';

const jurors = [
  { name: 'Manuel', label: 'Sauber abgeliefert!', sub: 'BEGEISTERUNG ERFOLGREICH KOMPILIERT', photo: './images/manuel.jpg' },
  { name: 'Marco', label: 'Volle Spannung!', sub: 'ACHTUNG: HOCHSPANNUNGS-TALENT', photo: './images/marco.jpg' },
  { name: 'David', label: 'Zugabe!', sub: 'DAVON GEHT NOCH EINE RUNDE', photo: './images/david.jpg' },
];
const colors = ['#e8b9a7', '#d1baff', '#f1ce72', '#a9d9d2', '#ee8e94', '#f3ebd5', '#a7bff1'];

function Confetti() {
  return <div className="confetti" aria-hidden="true">{Array.from({ length: 100 }, (_, i) => <i key={i} style={{
    left: `${(i * 71 + 11) % 101}%`, backgroundColor: colors[i % colors.length],
    width: `${.35 + (i % 4) * .11}cqw`, height: `${.7 + (i % 5) * .13}cqw`,
    animationDelay: `${-((i * 17) % 24) / 10}s`, animationDuration: `${2 + (i % 9) * .17}s`,
    rotate: `${(i * 37) % 180}deg`,
  }}/>)}</div>;
}
function ActBackdrop() {
  return <div className="backdrop"><div className="brand">GEBURTSTAG SUCHT DEN SUPERSTAR</div><div className="act"><div><h2>David</h2><div className="rule"/><strong>Ein Song für euch</strong><p>Ein Mikrofon, ein bisschen Mut und ein Lied für diesen Abend.</p></div><img src="./images/act.jpg" alt=""/></div></div>;
}
function Projector({ active, burst }: { active: number[]; burst: number }) {
  return <div className="screen projector"><ActBackdrop/>{active.length > 0 && <div className="celebration"><div key={burst}><Confetti/></div><div className="toast">{active.map(index => <div className="person" key={index}><img src={jurors[index].photo} alt=""/><strong>{jurors[index].name}</strong></div>)}</div></div>}</div>;
}
function JuryOutput({ juror, active, burst }: { juror: number; active: boolean; burst: number }) {
  const j = jurors[juror];
  return <div className={`screen jury ${active ? 'active' : ''}`} key={`${juror}-${burst}`}>
    {active ? <><Confetti/><div className="jury-active"><strong>{j.name}</strong></div></> : <div className="jury-idle"><img src={j.photo} alt=""/><strong>{j.name}</strong></div>}
  </div>;
}
function App() {
  const [selected, setSelected] = useState(0);
  const [active, setActive] = useState<number[]>([]);
  const [burst, setBurst] = useState(0);
  const timers = useRef<Record<number, number>>({});
  const trigger = (index: number) => {
    setSelected(index);
    setBurst(value => value + 1);
    setActive(current => current.includes(index) ? current : [...current, index]);
    window.clearTimeout(timers.current[index]);
    timers.current[index] = window.setTimeout(() => setActive(current => current.filter(value => value !== index)), 3200);
  };
  useEffect(() => { const current = timers.current; return () => Object.values(current).forEach(window.clearTimeout); }, []);
  return <main className="workspace"><div className="toolbar"><div><span>DESIGN-ENTWURF</span><h1>Jury-Buzzer</h1></div><div className="buttons">{jurors.map((j, i) => <Button key={j.name} variant={selected === i ? 'filled' : 'light'} color="gray" onClick={() => trigger(i)}>{j.name}</Button>)}<Button variant="subtle" color="gray" aria-label="Effekt erneut abspielen" onClick={() => trigger(selected)}><IconRefresh size={18}/></Button></div></div>
    <div className="layout"><section><div className="caption">BEAMER</div><Projector active={active} burst={burst}/></section><section><div className="caption">JURY / {jurors[selected].name.toUpperCase()}</div><JuryOutput juror={selected} active={active.includes(selected)} burst={burst}/></section></div>
  </main>;
}
const theme = createTheme({ fontFamily: 'Inter, system-ui, sans-serif', primaryColor: 'gray', defaultRadius: 'sm' });
createRoot(document.getElementById('root')!).render(<MantineProvider theme={theme}><App/>{import.meta.env.DEV && <Agentation/>}</MantineProvider>);
