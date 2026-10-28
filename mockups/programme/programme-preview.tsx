import { useState } from 'react';
import { SegmentedControl } from '@mantine/core';
import { IconArrowLeft, IconClock, IconSparkles } from '@tabler/icons-react';
import { ProgrammeItem, type ProgrammeEntry } from './programme-item';

const entries: ProgrammeEntry[] = [
  { time: '18:30', chapter: 'Ankommen', title: 'Auf einen schönen Abend', summary: 'Ein Willkommensdrink, vertraute Gesichter und neue Bekanntschaften.', details: 'Komm entspannt an. Wir freuen uns auf Zeit mit dir – mit und ohne Alkohol im Glas.' },
  { time: '19:15', chapter: 'Gemeinsam genießen', title: 'Zu Tisch, bitte', summary: 'Gutes Essen und Zeit für lange Gespräche.', details: 'Nimm dir Zeit zum Genießen. Bei Fragen zu Zutaten oder Allergenen sprich uns bitte vor Ort an.' },
  { time: '20:30', chapter: 'Das Highlight', title: 'Wir suchen den Superstar', summary: 'Unsere Freunde im Rampenlicht. Die Gastgeber in der Jury.', details: 'Tanz, Magie oder etwas ganz anderes? Lass dich überraschen. Heute feiern wir Mut, Kreativität und unsere Freunde – nicht die perfekte Performance.', highlight: true },
  { time: '21:15', chapter: 'Erinnerungen', title: 'Ein Blick zurück', summary: 'Die letzten Jahre. Die besten Geschichten. Wir zusammen.', details: 'Ein kleiner Film über große und kleine gemeinsame Momente. Lehn dich zurück – es gibt einiges zu lachen.' },
  { time: '21:30', chapter: 'Ein süßer Moment', title: 'Zeit für Geburtstagstorte', summary: 'Etwas Süßes und ein gemeinsames Anstoßen.', details: 'Auf die Geburtstagskinder, auf unsere Freundschaft und auf alles, was noch kommt.' },
  { time: '22:00', chapter: 'Der Abend bleibt offen', title: 'Noch ein Lied. Noch ein Gespräch.', summary: 'Ein bisschen tanzen oder einfach zusammen den Abend genießen.', details: 'Die Tanzfläche ist offen, die Gespräche gehen weiter. Mach den Abend so, wie er dir gefällt.' },
];

function ProgrammeHeader() {
  return <header className="programme-header">
    <span className="eyebrow">MANUEL · MARCO · DAVID</span>
    <h1>Ein Abend.</h1>
    <p>Schön, dass du dabei bist.<br className="mobile-break" /> Das haben wir mit euch vor.</p>
    <div className="header-meta"><span>21. Geburtstag</span></div>
  </header>;
}

export function ProgrammePreview() {
  const initial = new URLSearchParams(window.location.search).get('variant') === 'editorial' ? 'editorial' : 'timeline';
  const [variant, setVariant] = useState(initial);
  function changeVariant(value: string) {
    setVariant(value === 'editorial' ? 'editorial' : 'timeline');
    const url = new URL(window.location.href);
    url.searchParams.set('variant', value);
    window.history.replaceState(null, '', url);
  }
  return <>
    <div className="review-toolbar">
      <div><strong>Programm · R2</strong><span>Entwurf · Alle Zeiten sind Beispiele</span></div>
      <SegmentedControl aria-label="Designvariante" value={variant} onChange={changeVariant} data={[{ value: 'timeline', label: 'A · Timeline' }, { value: 'editorial', label: 'B · Programmheft' }]} />
    </div>
    <a className="skip-link" href="#programme">Zum Programm</a>
    <div className={'gala-page ' + variant}>
      <nav className="page-nav" aria-label="Seitennavigation">
        <a href="../invitation-details/"><IconArrowLeft size={17} aria-hidden="true" />Zur Einladung</a>
        <span>21<span className="nav-star">.</span></span>
      </nav>
      <main id="programme">
        <ProgrammeHeader />
        <section className="schedule" aria-label="Ablauf des Abends">
          <div className="schedule-heading"><span className="eyebrow">DER ABEND IM ÜBERBLICK</span><IconSparkles size={19} stroke={1.3} aria-hidden="true" /></div>
          <ol className="programme-list">{entries.map((entry, index) => <ProgrammeItem key={entry.time} entry={entry} index={index} />)}</ol>
          <p className="schedule-note"><IconClock size={16} aria-hidden="true" /><span>Ein schöner Abend braucht etwas Spielraum.<br />Alle Zeiten sind ungefähr.</span></p>
        </section>
        <footer className="page-footer"><span>Wir freuen uns auf euch.</span><p>Manuel, Marco & David</p></footer>
      </main>
    </div>
  </>;
}
