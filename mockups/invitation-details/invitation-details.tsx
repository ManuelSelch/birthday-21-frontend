import { useState } from 'react';
import { Button } from '@mantine/core';
import { IconArrowUpRight, IconBrandApple, IconBrandWhatsapp, IconCalendarEvent, IconCheck, IconHanger, IconMapPin, IconQrcode, IconTicket } from '@tabler/icons-react';

function ImportantDetails({ onJoin }: { onJoin: () => void }) {
  return <section className="important" aria-labelledby="details-title">
    <div className="section-label">FÜR DEINEN ABEND</div>
    <h2 id="details-title">Gut zu wissen</h2>
    <div className="detail-row">
      <IconBrandWhatsapp size={23} stroke={1.5} aria-hidden="true" />
      <div><h3>Sei in der WhatsApp-Gruppe dabei</h3><p>Alle Updates zum Abend teilen wir dort.</p>
        <Button className="join-button" variant="subtle" onClick={onJoin} rightSection={<IconArrowUpRight size={17} />}>Gruppe beitreten</Button>
      </div>
    </div>
    <div className="detail-row">
      <IconTicket size={23} stroke={1.5} aria-hidden="true" />
      <div><h3>Dein Ticket ist dein Einlass</h3><p>Halte es am Eingang bereit – in deiner Wallet oder direkt auf dieser Seite.</p></div>
    </div>
    <div className="detail-row">
      <IconHanger size={23} stroke={1.5} aria-hidden="true" />
      <div><h3>Dresscode: Anzug</h3><p>Wir freuen uns auf einen festlichen Abend mit dir.</p></div>
    </div>
  </section>;
}

function GuestTicket({ onWallet }: { onWallet: () => void }) {
  return <section className="ticket-section" aria-labelledby="ticket-title">
    <div className="ticket">
      <div><span className="section-label" id="ticket-title">DEIN TICKET</span><strong>Max Muster</strong><span className="ticket-caption">21. Geburtstag · 2026</span></div>
      <IconQrcode size={78} stroke={1.3} aria-label="QR-Platzhalter, nicht scannbar" />
    </div>
    <Button className="wallet-button" fullWidth variant="outline" onClick={onWallet} leftSection={<IconBrandApple size={20} />}>Zu Apple Wallet hinzufügen</Button>
  </section>;
}

export function InvitationDetails() {
  const [notice, setNotice] = useState('');
  return <main className="mobile-preview">
    <header className="hero">
      <span className="section-label">EINLADUNG · 2026</span>
      <h1>21. Geburtstag</h1>
      <p>MANUEL · MARCO · DAVID</p>
    </header>
    <div className="content">
      <section className="event" aria-label="Datum und Ort">
        <div><IconCalendarEvent size={20} aria-hidden="true" /><span><small>DATUM & UHRZEIT</small>Folgt</span></div>
        <div><IconMapPin size={20} aria-hidden="true" /><span><small>LOCATION</small>Folgt</span></div>
      </section>
      <section className="greeting"><span className="confirmed"><IconCheck size={15} aria-hidden="true" /> Du bist dabei</span><h2>Schön, dass du kommst,<br />Max!</h2></section>
      <ImportantDetails onJoin={() => setNotice('Vorschau: Hier öffnet sich später die WhatsApp-Gruppe.')} />
      <GuestTicket onWallet={() => setNotice('Vorschau: Hier wird später dein Wallet-Ticket geladen.')} />
      <p className="notice" role="status">{notice}</p>
      <footer>Mobile Mockup · Keine echte Anmeldung<br />Foto: Stadtball Bayreuth · SW Bayreuth / Screenshot</footer>
    </div>
  </main>;
}
