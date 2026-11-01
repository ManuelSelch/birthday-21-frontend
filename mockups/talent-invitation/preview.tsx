import { useState } from "react";
import { Button, SegmentedControl, Switch } from "@mantine/core";
import { IconArrowRight, IconCalendarEvent, IconMapPin, IconStar, IconTicket } from "@tabler/icons-react";
import image from "./birthday-stage.png";

type Variant = "premiere" | "backstage" | "spotlight";
const variants = [{ label: "01 · Premiere", value: "premiere" }, { label: "02 · Backstage", value: "backstage" }, { label: "03 · Spotlight", value: "spotlight" }];

function EventDetails() {
  return <div className="event-details"><div><IconCalendarEvent size={20}/><span><small>WANN</small><strong>20. November 2026</strong></span></div><div><IconMapPin size={20}/><span><small>WO</small><strong>Reichshof Bayreuth</strong></span></div></div>;
}

function Response({ accepted, setAccepted }: { accepted: boolean; setAccepted: (value: boolean) => void }) {
  return <section className="response"><div className="section-label">DEINE PERSÖNLICHE EINLADUNG</div><h2>Alex, bist du dabei?</h2><p>Wir freuen uns darauf, diesen besonderen Abend mit dir zu feiern.</p>{accepted ? <div className="accepted"><div className="confirmed">✓ &nbsp;Du bist dabei!</div><Switch label="Ich bringe eine Begleitung mit" color="red" /><div className="ticket"><IconTicket size={26}/><span><small>DEIN TICKET · VORSCHAU</small><strong>Alex Beispiel</strong></span></div><Button variant="subtle" color="gray" onClick={() => setAccepted(false)}>Zusage zurückziehen</Button></div> : <Button className="rsvp" fullWidth rightSection={<IconArrowRight size={17}/>} onClick={() => setAccepted(true)}>Ich bin dabei</Button>}<button className="programme" onClick={() => alert("Das Programm ist in dieser Designstudie nicht verknüpft.")}>Programm ansehen <IconArrowRight size={16}/></button></section>;
}

function Hero({ variant }: { variant: Variant }) {
  if (variant === "premiere") return <><header className="topline"><span>MANUEL · MARCO · DAVID</span><span>20 NOV 2026</span></header><div className="premiere-image"><img src={image} alt="Manuel, Marco und David am Richterpult zum 21. Geburtstag" /></div><section className="intro"><h1>Unser 21. <em>Geburtstag</em></h1></section></>;
  if (variant === "backstage") return <><header className="topline"><span>THE BIRTHDAY SHOW</span><span>REICHSHOF · BAYREUTH</span></header><section className="backstage-heading"><div className="eyebrow">DU STEHST AUF DER GÄSTELISTE</div><h1>Ein Abend,<br/><em>der bleibt.</em></h1><p>Manuel, Marco & David werden 21.<br/>Und du bist eingeladen.</p><div className="show-tag"><IconStar size={15} fill="currentColor"/> DIE GEBURTSTAGSSHOW</div></section><div className="backstage-image"><img src={image} alt="Die Gastgeber am Richterpult" /><span>THE JUDGES <b>01 / 03</b></span></div></>;
  return <><header className="topline"><span>MANUEL / MARCO / DAVID</span><span>PRIVATE EVENT · 2026</span></header><section className="spotlight-heading"><div className="eyebrow">EINLADUNG ZUM 21. GEBURTSTAG</div><h1>It’s showtime<span>.</span></h1><p>Eine Bühne. Drei Geburtstage.<br/>Ein Abend, den wir gemeinsam feiern.</p></section><div className="spotlight-image"><img src={image} alt="Die Gastgeber auf der Jurybühne von 21’s Got Talent" /></div><div className="spotlight-caption"><span>21. GEBURTSTAG</span><span>THE BIRTHDAY EDITION</span></div></>;
}

export function Preview() {
  const initial = new URLSearchParams(location.search).get("variant");
  const [variant, setVariant] = useState<Variant>(initial === "backstage" || initial === "spotlight" ? initial : "premiere");
  const [accepted, setAccepted] = useState(new URLSearchParams(location.search).get("state") === "accepted");
  function changeVariant(value: string) { const next = value as Variant; setVariant(next); const url = new URL(location.href); url.searchParams.set("variant", next); history.replaceState(null, "", url); }
  return <><nav className="review"><div><strong>21. GEBURTSTAG</strong><small>DESIGNSTUDIE · R5</small></div><SegmentedControl aria-label="Design auswählen" value={variant} onChange={changeVariant} data={variants}/><button onClick={() => setAccepted(!accepted)}>{accepted ? "Offene Einladung zeigen" : "Zusage zeigen"}</button></nav><main className={`invitation ${variant}`}><div className="invitation-inner"><Hero variant={variant}/><div className="content"><EventDetails/><Response accepted={accepted} setAccepted={setAccepted}/><footer>WIR FREUEN UNS AUF DICH · MANUEL · MARCO · DAVID</footer></div></div></main><div className="disclaimer">DESIGNSTUDIE · BEISPIELGAST · KEINE ECHTE ANMELDUNG</div></>;
}
