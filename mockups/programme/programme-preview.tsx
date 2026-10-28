import { useState } from 'react';
import { SegmentedControl } from '@mantine/core';
import { IconArrowLeft, IconClock, IconSparkles } from '@tabler/icons-react';
import { ProgrammeItem, type ProgrammeEntry } from './programme-item';

const entries: ProgrammeEntry[] = [
  { time: '18:30', chapter: 'Ankommen', title: 'Auf einen schönen Abend', summary: 'Ein Willkommensdrink, vertraute Gesichter und neue Bekanntschaften.' },
  { time: '19:15', chapter: 'Gemeinsam genießen', title: 'Zu Tisch, bitte', summary: 'Gutes Essen und Zeit für lange Gespräche.' },
  { time: '20:30', chapter: 'Das Highlight', title: 'Wir suchen den Superstar', summary: 'Unsere Freunde im Rampenlicht. Die Gastgeber in der Jury.', highlight: true },
  { time: '21:15', chapter: 'Erinnerungen', title: 'Ein Blick zurück', summary: 'Die letzten Jahre. Die besten Geschichten. Wir zusammen.' },
  { time: '21:30', chapter: 'Ein süßer Moment', title: 'Zeit für Geburtstagstorte', summary: 'Etwas Süßes und ein gemeinsames Anstoßen.' },
  { time: '22:00', chapter: 'Der Abend bleibt offen', title: 'Noch ein Lied. Noch ein Gespräch.', summary: 'Ein bisschen tanzen oder einfach zusammen den Abend genießen.' },
];

function ProgrammeHeader() {
  return <header className="programme-header">
    <span className="eyebrow">MANUEL · MARCO · DAVID</span>
    <h1>Ein Abend.</h1>
    <p>Schön, dass du dabei bist.</p>
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
      <div><strong>Programm · R4</strong><span>Entwurf · Alle Zeiten sind Beispiele</span></div>
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
          <ol className="programme-list">{entries.map((entry) => <ProgrammeItem key={entry.time} entry={entry} />)}</ol>
          <p className="schedule-note"><IconClock size={16} aria-hidden="true" /><span>Ein schöner Abend braucht etwas Spielraum.<br />Alle Zeiten sind ungefähr.</span></p>
        </section>
        <footer className="page-footer"><span>Wir freuen uns auf euch.</span><p>Manuel, Marco & David</p></footer>
      </main>
    </div>
  </>;
}
