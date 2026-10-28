import { useState } from 'react';
import { Button } from '@mantine/core';
import { IconArrowRight, IconCalendarEvent, IconMapPin } from '@tabler/icons-react';
import { HostPortrait } from './host-portrait';
import manuelPhoto from './assets/manuel.jpg';
import davidPhoto from './assets/david.jpg';

function Hosts() {
  return <section className="hosts-section" aria-labelledby="hosts-title">
    <h2 id="hosts-title">Wir feiern mit euch</h2>
    <div className="host-row">
      <HostPortrait name="Manuel" initialPhoto={manuelPhoto} />
      <HostPortrait name="Marco" initialPhoto={null} />
      <HostPortrait name="David" initialPhoto={davidPhoto} />
    </div>
  </section>;
}

export function InvitationHosts() {
  const [notice, setNotice] = useState('');
  return <main className="mobile-preview">
    <header className="hero">
      <span className="eyebrow">EINLADUNG · 2026</span>
      <h1>21. Geburtstag</h1>
    </header>
    <div className="content">
      <Hosts />
      <section className="event" aria-label="Datum und Ort">
        <div><IconCalendarEvent size={21} stroke={1.5} aria-hidden="true" /><span><small>WANN</small>Termin folgt · 2026</span></div>
        <div><IconMapPin size={21} stroke={1.5} aria-hidden="true" /><span><small>WO</small>Location folgt · Bayreuth</span></div>
      </section>
      <section className="response" aria-labelledby="response-title">
        <h2 id="response-title">Max, bist du dabei?</h2>
        <Button fullWidth className="accept" size="md" rightSection={<IconArrowRight size={19} />} onClick={() => setNotice('Nur Vorschau – es wird keine Zusage gespeichert.')}>Ich bin dabei</Button>
        <p className="notice" role="status">{notice}</p>
      </section>
      <footer>Mockup · Portraits antippen, um eigene Fotos auszuprobieren.<br />Ausgewählte Fotos werden nicht hochgeladen.<br />Atmosphärenfoto: Stadtball Bayreuth · SW Bayreuth / Screenshot</footer>
    </div>
  </main>;
}
