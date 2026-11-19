import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Alert, Badge, Button, FileButton, Group, MantineProvider, Modal, Stack, TextInput, Textarea, createTheme } from '@mantine/core';
import { IconArrowLeft, IconCheck, IconDeviceTv, IconPhoto, IconPlus, IconStar, IconUpload, IconX } from '@tabler/icons-react';
import { Agentation } from 'agentation';
import '@mantine/core/styles.css';
import './styles.css';

type Show = { id: string; name: string; title: string; description: string; images: string[] };
const initial: Show[] = [
  ['Joschua', 'Kartenzauber'], ['Danny', 'Jonglieren'], ['Johannes', 'Klavier'],
  ['Jakob', 'Zeichentalent'], ['Charlie', 'Karaoke? / noch offen'],
  ['Daniel, Thiebaud & Leonard', 'Überraschung / noch offen'],
].map(([name, title], i) => ({ id: String(i), name, title, description: 'Talent optional. Legendenstatus garantiert.', images: [] }));
const theme = createTheme({ primaryColor: 'champagne', colors: { champagne: ['#faf6ef','#f3eadc','#e6d4b7','#d8c4a4','#cbb38d','#bea176','#ad8f62','#977a50','#806642','#695335'] }, primaryShade: 2, autoContrast: true, fontFamily: 'Arial, Helvetica, sans-serif', defaultRadius: 4, headings: { fontFamily: 'Georgia, serif', fontWeight: '400' } });

function BeamerPreview({ show, image }: { show: Show; image: number }) {
  return <section className="beamer" aria-label="Beamer-Entwurf">
    <div className="beamer-top"><span><IconStar size={13}/> GEBURTSTAG SUCHT DEN SUPERSTAR</span><span>DREI MAL 21</span></div>
    <div className="beamer-content"><div><small>KEIN DRUCK. NUR APPLAUS.</small><h2>{show.name || 'Dein Superstar'}<em>ist am Start.</em></h2><strong>{show.title || 'Der große Auftritt'}</strong><p>{show.description}</p></div>
    <div className="portrait">{show.images[image] ? <img src={show.images[image]} alt={show.name}/> : <><IconPhoto stroke={1}/><span>Dein Beamerbild</span></>}</div></div>
    <footer>ECHTE FREUNDE. UNENTDECKTE TALENTE.</footer>
  </section>;
}
function ShowEditor() {
  const [shows, setShows] = useState(initial);
  const [draft, setDraft] = useState<Show>(initial[0]);
  const [saved, setSaved] = useState(false);
  const [image, setImage] = useState(0);
  const [pending, setPending] = useState<Show | null>(null);
  const [error, setError] = useState('');
  const original = shows.find(show => show.id === draft.id);
  const dirty = JSON.stringify(original) !== JSON.stringify(draft);
  const change = (patch: Partial<Show>) => { setDraft({ ...draft, ...patch }); setSaved(false); };
  const select = (show: Show) => { if (dirty) { setPending(show); return; } open(show); };
  const open = (show: Show) => { setDraft({ ...show, images: [...show.images] }); setSaved(false); setError(''); setImage(0); setPending(null); };
  const add = () => select({ id: crypto.randomUUID(), name: '', title: '', description: '', images: [] });
  const save = () => {
    if (!draft.name.trim() || !draft.title.trim()) { setError('Bitte Name und Titel ausfüllen.'); return; }
    const next = { ...draft, name: draft.name.trim(), title: draft.title.trim() };
    setShows(list => original ? list.map(show => show.id === draft.id ? next : show) : [...list, next]);
    setDraft(next); setSaved(true); setError('');
  };
  const upload = (files: File[]) => {
    if (files.some(file => !['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024)) {
      setError('Bitte JPG, PNG oder WebP verwenden, maximal 10 MB pro Bild.'); return;
    }
    change({ images: [...draft.images, ...files.map(file => URL.createObjectURL(file))] }); setError('');
  };
  return <div className="shell">
    <header className="site-header"><div className="brand"><span>21</span><div>SUPERSTAR<small>MANUEL / MARCO / DAVID</small></div></div><Badge color="gray" variant="outline">EDITOR-ENTWURF</Badge></header>
    <main><a className="back" href="../superstar-control-feedback/"><IconArrowLeft size={15}/> Zur Regie</a>
      <div className="heading"><h1>Shows bearbeiten</h1></div>
      <div className="editor">
        <aside><div className="list-heading"><h2>Shows</h2><span>{shows.length}</span></div><Stack gap={6}>{shows.map((show, index) => <button key={show.id} className={'show-item ' + (draft.id === show.id ? 'selected' : '')} onClick={() => select(show)}><span className="number">{String(index + 1).padStart(2,'0')}</span><span><strong>{show.name}</strong><small>{show.title}</small></span></button>)}</Stack><Button fullWidth variant="outline" leftSection={<IconPlus size={16}/>} mt="md" onClick={add}>Show hinzufügen</Button></aside>
        <section className="form-panel"><div className="panel-heading"><h2>{original ? 'Show bearbeiten' : 'Neue Show'}</h2><Badge variant="light" color={dirty ? 'yellow' : 'gray'}>{dirty ? 'Ungespeichert' : 'Gespeichert'}</Badge></div>
          <Stack gap="sm">{error && <Alert color="red" role="alert">{error}</Alert>}
            <TextInput label="Name" placeholder="z. B. Joschua" required maxLength={100} value={draft.name} onChange={e => change({name:e.currentTarget.value})}/>
            <TextInput label="Titel" placeholder="z. B. Kartenzauber" required maxLength={160} value={draft.title} onChange={e => change({title:e.currentTarget.value})}/>
            <Textarea label="Beschreibung" autosize minRows={2} maxLength={500} value={draft.description} onChange={e => change({description:e.currentTarget.value})}/>
            <section><Group justify="space-between" mb={8}><label className="field-label">Beamerbilder</label><FileButton multiple accept="image/jpeg,image/png,image/webp" onChange={upload}>{props => <Button {...props} size="xs" variant="subtle" leftSection={<IconUpload size={14}/>}>Hochladen</Button>}</FileButton></Group>
            {draft.images.length ? <div className="image-grid">{draft.images.map((src, i) => <div className="image-tile" key={src}><button className={'image-pick '+(image===i?'active':'')} onClick={() => setImage(i)} aria-label={'Bild '+(i+1)+' in Vorschau anzeigen'}><img src={src} alt={'Beamerbild '+(i+1)}/></button><Button size="compact-xs" variant="subtle" color="red" aria-label={'Bild '+(i+1)+' entfernen'} onClick={() => { change({ images: draft.images.filter((_,j)=>i!==j) }); setImage(0); }}><IconX size={14}/></Button></div>)}</div> : <div className="upload-empty"><IconPhoto size={24} stroke={1}/><span>Keine Bilder</span></div>}
            <p className="hint">JPG, PNG, WebP / max. 10 MB</p></section>
          </Stack>
          <div className="save-bar"><span role="status">{saved ? 'Gespeichert' : ''}</span><Group gap={8}><Button variant="default" disabled={!dirty} onClick={() => original ? open(original) : open(shows[0])}>Verwerfen</Button><Button leftSection={<IconCheck size={16}/>} disabled={!dirty} onClick={save}>Speichern</Button></Group></div>
        </section>
        <section className="preview-panel"><div className="preview-heading"><IconDeviceTv size={16}/><span>BEAMER-VORSCHAU</span><Badge size="xs" variant="outline" color="gray">NICHT LIVE</Badge></div><BeamerPreview show={draft} image={image}/></section>
      </div>
    </main>
    <Modal opened={Boolean(pending)} onClose={()=>setPending(null)} title="Ungespeicherte Änderungen" centered><p>Änderungen verwerfen und eine andere Show öffnen?</p><Group justify="flex-end"><Button variant="default" onClick={()=>setPending(null)}>Weiter bearbeiten</Button><Button onClick={()=>pending && open(pending)}>Änderungen verwerfen</Button></Group></Modal>
  </div>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><MantineProvider theme={theme} forceColorScheme="dark"><ShowEditor/>{import.meta.env.DEV && <Agentation/>}</MantineProvider></React.StrictMode>);
