import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, MantineProvider, SegmentedControl, createTheme } from '@mantine/core';
import { IconArrowsMaximize } from '@tabler/icons-react';
import { Agentation } from 'agentation';
import '@mantine/core/styles.css';
import './styles.css';

const samples = {
  portrait: { image: './images/portrait.jpg', name: 'David', title: 'Ein Song für euch', description: 'Ein Mikrofon, ein bisschen Mut und ein Lied für diesen Abend.' },
  landscape: { image: './images/landscape.jpg', name: 'Manuel & Marco', title: 'Die große Überraschung', description: 'Zwei Freunde, eine Bühne und eine Geschichte, die noch nicht zu Ende erzählt ist.' },
  panorama: { image: './images/panorama.jpg', name: 'Die sensationellen Geburtstags­kinder', title: 'Eine außergewöhnlich lange Show mit Musik, Überraschungen und allem, was dazugehört', description: 'Ein längerer Beschreibungstext, der auch bei mehreren Zeilen auf der Bühne ruhig und gut lesbar bleiben soll. Heute gehört die Bühne unseren Gästen.' },
  empty: { image: '', name: 'Nächster Auftritt', title: 'Eine kleine Überraschung', description: '' },
};
type Sample = keyof typeof samples;

function ActScreen({ sample }: { sample: (typeof samples)[Sample] }) {
  return <section className="stage" id="stage" aria-label="Beamer Vorschau">
    <header className="stage-header"><span>GEBURTSTAG SUCHT DEN SUPERSTAR</span><span>21 / 21 / 21</span></header>
    <div className="content">
      <div className="copy"><div className="eyebrow"><span /> DER NÄCHSTE AUFTRITT</div><h1>{sample.name}</h1><div className="rule"/><h2>{sample.title}</h2><p>{sample.description}</p></div>
      <div className="image-frame">{sample.image ? <img src={sample.image} alt="Beispielfoto"/> : <div className="image-empty"><span>G</span><small>GEBURTSTAG SUCHT DEN SUPERSTAR</small></div>}</div>
    </div>
    <footer className="stage-footer"><span>GEBURTSTAG SUCHT DEN SUPERSTAR</span><span>LIVE</span></footer>
  </section>;
}

function Mockup() {
  const initial = new URLSearchParams(location.search).get('state');
  const [sample, setSample] = useState<Sample>(initial && initial in samples ? initial as Sample : 'portrait');
  const select = (value: string) => { setSample(value as Sample); history.replaceState(null, '', `?state=${value}`); };
  return <main className="workspace"><div className="toolbar"><div><div className="toolbar-kicker">DESIGN-ENTWURF</div><h2>Beamer / Auftritt</h2></div><div className="toolbar-actions"><SegmentedControl aria-label="Beispiel auswählen" value={sample} onChange={select} data={[{label:'Hochformat',value:'portrait'},{label:'Querformat',value:'landscape'},{label:'Lang',value:'panorama'},{label:'Ohne Bild',value:'empty'}]}/><Button variant="light" color="gray" leftSection={<IconArrowsMaximize size={16}/>} onClick={() => document.getElementById('stage')?.requestFullscreen()}>Vollbild</Button></div></div><ActScreen sample={samples[sample]}/></main>;
}
const theme = createTheme({ fontFamily: 'Inter, system-ui, sans-serif', primaryColor: 'gray', defaultRadius: 'sm' });
createRoot(document.getElementById('root')!).render(<React.StrictMode><MantineProvider theme={theme}><Mockup/>{import.meta.env.DEV && <Agentation/>}</MantineProvider></React.StrictMode>);
