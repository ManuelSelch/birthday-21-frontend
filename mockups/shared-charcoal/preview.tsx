import { useState } from 'react';
import { Badge, Button, PasswordInput, SegmentedControl, TextInput } from '@mantine/core';
import { IconArrowLeft, IconCalendarEvent, IconMapPin, IconScan, IconSearch } from '@tabler/icons-react';
import photo from '../reichshof-image/assets/reichshof.jpg';

const pages = ['Einladung', 'Programm', 'Gäste', 'Login', 'Scanner'] as const;
type Page = typeof pages[number];
export function Preview() {
  const requested = new URLSearchParams(location.search).get('page');
  const [page, setPage] = useState<Page>(pages.find(value => value === requested) ?? 'Gäste');
  function select(value: string) { setPage(value as Page); const url = new URL(location.href); url.searchParams.set('page', value); history.replaceState(null, '', url); }
  return <><aside className="review"><b>Gemeinsamer Stil · Vorschau</b><SegmentedControl aria-label="Seite wählen" value={page} onChange={select} data={[...pages]} /><span>Beispieldaten · keine Speicherung</span></aside><div className="app">
    {page === 'Einladung' ? <><header className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(20,19,19,.9), rgba(20,19,19,.22)), url(${photo})` }}><span>2026</span><h1>21. Geburtstag</h1></header><main><h2>Wir feiern mit euch</h2><div className="details"><p><IconCalendarEvent /> WANN<br />Termin folgt · 2026</p><p><IconMapPin /> WO<br />Reichshof Bayreuth</p></div><h2>Alex Beispiel, bist du dabei?</h2><Button className="primary">Ich bin dabei</Button></main></> : <><header className="top"><span>21. Geburtstag</span><small>{page === 'Programm' ? 'Ein Abend.' : 'ADMIN'}</small></header><main>
    {page === 'Gäste' && <><div className="heading"><div><small>ALLES IM BLICK</small><h1>Gästeliste</h1></div><Button variant="outline" color="gray" leftSection={<IconScan size={16} />}>Scanner</Button></div><div className="summary">{[['Gäste','124'],['Zusagen','88'],['Mit Begleitung','103'],['Eingecheckt','42']].map(([label,n]) => <div key={label}><small>{label}</small><strong>{n}</strong></div>)}</div><div className="panel"><TextInput leftSection={<IconSearch size={16}/>} placeholder="Gäste suchen"/><div className="tabs">Alle &nbsp;&nbsp; Zusagen &nbsp;&nbsp; Offen</div><table><thead><tr><th>Name</th><th>Rückmeldung</th><th>Check-in</th></tr></thead><tbody><tr><td>Anna Weber</td><td><Badge color="teal">Zugesagt</Badge></td><td>Eingecheckt</td></tr><tr><td>Felix Schneider</td><td><Badge color="teal">Zugesagt</Badge></td><td>—</td></tr><tr><td>Laura Fischer</td><td><Badge color="gray">Offen</Badge></td><td>—</td></tr></tbody></table></div></>}
    {page === 'Programm' && <><p className="back"><IconArrowLeft size={17}/> Zur Einladung</p><div className="heading"><div><small>MANUEL · MARCO · DAVID</small><h1>Ein Abend.</h1><p>Schön, dass du dabei bist.</p></div></div><div className="schedule">{[['19:00','Ankommen','Auf einen schönen Abend'],['20:30','Das Highlight','Wir suchen den Superstar'],['21:30','Ein süßer Moment','Zeit für Geburtstagstorte']].map(([time,label,title]) => <div key={time}><strong>{time}</strong><section><small>{label}</small><h2>{title}</h2><p>Gemeinsam genießen und Erinnerungen schaffen.</p></section></div>)}</div></>}
    {page === 'Login' && <div className="login panel"><small>21. GEBURTSTAG</small><h1>Admin-Anmeldung</h1><PasswordInput label="Admin-Passwort" placeholder="Passwort eingeben"/><Button className="primary" fullWidth mt="md">Anmelden</Button></div>}
    {page === 'Scanner' && <><h1>Ticket scannen</h1><p>Kamera auf den QR-Code richten.</p><div className="camera"><IconScan size={64}/><span>Kameravorschau · simuliert</span></div><Button variant="outline" color="gray">Zurück zur Gästeliste</Button></>}
    </main></>}
  </div></>;
}
