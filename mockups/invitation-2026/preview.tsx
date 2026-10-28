import { useState } from 'react';
import { Alert, Button, Group, Select, Stack, Switch } from '@mantine/core';
import { IconArrowUpRight, IconCheck, IconCalendarEvent, IconMapPin, IconQrcode, IconBrandWhatsapp, IconWallet, IconArrowRight } from '@tabler/icons-react';
import gala from './assets/gala.jpg';
import lights from './assets/lights.jpg';
import ballroom from './assets/ballroom.jpg';

type Variant = 'midnight' | 'champagne' | 'afterdark';
type State = 'pending' | 'accepted' | 'loading' | 'error';
const variants: { id: Variant; label: string }[] = [{ id: 'midnight', label: '01 · Midnight Gala' }, { id: 'champagne', label: '02 · Champagne Editorial' }, { id: 'afterdark', label: '03 · After Dark' }];

function EventDetails() {
  return <div className="event-details"><div><IconCalendarEvent size={19}/><span><small>WANN</small>Termin folgt · 2026</span></div><div><IconMapPin size={19}/><span><small>WO</small>Location folgt · Bayreuth</span></div></div>;
}

function GuestResponse({ state, onState, compact = false }: { state: State; onState: (s: State) => void; compact?: boolean }) {
  const [companion, setCompanion] = useState(false);
  const [notice, setNotice] = useState('');
  const accepted = state === 'accepted';
  return <section className="response" aria-label="Deine Rückmeldung">
    {!compact && <div className="response-heading"><span className="eyebrow">DEINE PERSÖNLICHE EINLADUNG</span><span className="guest-number">Nº 021</span></div>}
    <h2>{accepted ? 'Du bist dabei, Sophie.' : compact ? 'Sophie, bist du dabei?' : 'Sophie, wir laden dich ein.'}</h2>
    {!compact && <p>{accepted ? 'Ein Abend, auf den wir uns jetzt schon freuen.' : 'Ein besonderer Geburtstag. Ein festlicher Abend. Und du mittendrin.'}</p>}
    {accepted ? <Stack gap="lg">
      {!compact && <div className="confirmed"><IconCheck size={18}/> Teilnahme bestätigt</div>}
      <Switch label="Ich bringe eine Begleitung mit" checked={companion} onChange={e => setCompanion(e.currentTarget.checked)}/>
      <div className="ticket"><IconQrcode size={70} stroke={1.2}/><div><span className="eyebrow">DEIN TICKET</span><strong>Sophie Muster</strong><small>QR-Platzhalter · nicht zum Einlass geeignet</small></div></div>
      <Group grow><Button variant="outline" className="secondary" leftSection={<IconWallet size={17}/>} onClick={() => setNotice('Wallet ist in diesem Entwurf nur simuliert.')}>Apple Wallet</Button><Button variant="outline" className="secondary" leftSection={<IconBrandWhatsapp size={17}/>} onClick={() => setNotice('Keine echte WhatsApp-Gruppe im Mockup verlinkt.')}>WhatsApp</Button></Group>
      <Button variant="subtle" className="cancel" onClick={() => { onState('pending'); setNotice(''); }}>Teilnahme absagen</Button>
    </Stack> : <><Button fullWidth size="lg" className="rsvp" loading={state === 'loading'} rightSection={<IconArrowRight size={19}/>} onClick={() => { onState('accepted'); setNotice(''); }}>Ich bin dabei</Button>{!compact && <small className="response-note">Dein persönliches Ticket erhältst du nach der Zusage.</small>}</>}
    {state === 'error' && <Alert color="red" mt="md" title="Das hat nicht geklappt">Deine Zusage konnte nicht gespeichert werden. Bitte versuche es erneut.</Alert>}
    {notice && <p role="status" className="demo-notice">{notice}</p>}
  </section>;
}

function MidnightGala({ children }: { children: React.ReactNode }) {
  return <main className="midnight-layout"><section className="gala-hero" style={{ backgroundImage: `linear-gradient(90deg,rgba(8,12,24,.88),rgba(8,12,24,.22)),url(${gala})` }}><div className="hero-top"><span className="eyebrow">21. GEBURTSTAG</span><span className="edition">2026</span></div><div className="gala-title"><h1>Auf die Nacht.<br/>Auf <em>uns.</em></h1><div className="hosts">MANUEL · MARCO · DAVID</div></div></section><div className="gala-content"><EventDetails/>{children}</div></main>;
}

function ChampagneEditorial({ children }: { children: React.ReactNode }) {
  return <main className="editorial-layout"><header className="editorial-header"><span>MANUEL / MARCO / DAVID</span><span>EINLADUNG · 2026</span></header><div className="editorial-grid"><section className="editorial-story"><span className="eyebrow">GUTE FREUNDE. GROSSE NÄCHTE.</span><h1>Ein Abend,<br/>der <em>bleibt.</em></h1><p>Wir werden 21. Lass uns das Leben feiern – mit Musik, guten Gesprächen und einem letzten Tanz, der nie der letzte ist.</p><figure><img src={lights} alt="Festlich beleuchteter Saal auf der Stadtball-Bayreuth-Website"/><figcaption>01 / BALLSAAL-ATMOSPHÄRE · BILDREFERENZ STADTBALL BAYREUTH</figcaption></figure></section><aside><div className="editorial-seal">21<span>JAHRE</span></div><EventDetails/>{children}<p className="signoff">Wir freuen uns auf dich.<br/><em>Manuel, Marco & David</em></p></aside></div></main>;
}

function AfterDark({ children }: { children: React.ReactNode }) {
  return <main className="afterdark-layout"><section className="afterdark-hero"><img src={ballroom} alt="Warme, unscharfe Partylichter von der Stadtball-Bayreuth-Website"/><div className="afterdark-overlay"/><header><span className="eyebrow">M / M / D</span><span className="eyebrow">BAYREUTH · 2026</span></header><div className="afterdark-title"><span className="eyebrow">21 JAHRE SIND ERST DER ANFANG.</span><h1>LET’S<br/><em>MAKE</em><br/>A NIGHT.</h1><div className="afterdark-subtitle">GEBURTSTAG. TANZFLÄCHE. LIEBLINGSMENSCHEN.<IconArrowUpRight size={34}/></div></div><div className="marquee">MANUEL · MARCO · DAVID <span> / </span> NUR MIT DIR.</div></section><aside><span className="eyebrow pink">DU STEHST AUF DER LISTE.</span><EventDetails/>{children}<div className="afterdark-foot">KEIN GEWÖHNLICHER ABEND.<br/>KEINE GEWÖHNLICHEN GÄSTE.</div></aside></main>;
}

export function InvitationPreview() {
  const params = new URLSearchParams(window.location.search);
  const initialVariant = variants.some(v => v.id === params.get('variant')) ? params.get('variant') as Variant : 'midnight';
  const initialState = ['pending', 'accepted', 'loading', 'error'].includes(params.get('state') ?? '') ? params.get('state') as State : 'pending';
  const [variant, setVariant] = useState<Variant>(initialVariant);
  const [state, setState] = useState<State>(initialState);
  function changeVariant(v: Variant) { setVariant(v); const u = new URL(window.location.href); u.searchParams.set('variant', v); window.history.replaceState(null, '', u); }
  function changeState(s: State) { setState(s); const u = new URL(window.location.href); u.searchParams.set('state', s); window.history.replaceState(null, '', u); }
  const Layout = variant === 'midnight' ? MidnightGala : variant === 'champagne' ? ChampagneEditorial : AfterDark;
  return <><nav className="review-bar" aria-label="Mockup-Auswahl"><div className="review-label">EINLADUNG <strong>2026</strong><small>DESIGNSTUDIE / R2</small></div><Group gap={5} className="variant-controls">{variants.map(v => <Button key={v.id} size="xs" variant={variant === v.id ? 'filled' : 'subtle'} color={variant === v.id ? 'dark' : 'gray'} onClick={() => changeVariant(v.id)} aria-pressed={variant === v.id}>{v.label}</Button>)}</Group><Select size="xs" aria-label="Vorschauzustand" value={state} onChange={v => changeState(v as State)} allowDeselect={false} data={[{ value:'pending',label:'Offene Einladung' },{ value:'accepted',label:'Zugesagt / Ticket' },{ value:'loading',label:'Wird gespeichert' },{ value:'error',label:'Fehler' }]}/></nav><div className={`invitation ${variant}`}><Layout><GuestResponse key={variant} state={state} onState={changeState} compact={variant === 'midnight'}/></Layout></div><footer className="review-footer"><span>ENTWURF · Alter & Gastgeber vorläufig · Datum & Ort offen · keine echte Anmeldung</span><a href="https://www.stadtballbayreuth.de/" target="_blank" rel="noreferrer">Bildquelle: Stadtball Bayreuth ↗</a><span>Private Designstudie · keine Verbindung zum Veranstalter</span></footer></>;
}
