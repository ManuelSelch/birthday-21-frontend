import { IconDots, IconQrcode } from "@tabler/icons-react";
import stage from "./assets/birthday-stage.png";

function EventTicket() {
  return <article className="ticket" aria-label="Beispiel eines Apple Wallet Tickets">
    <header className="ticketHeader"><div className="brand"><div className="mark">21</div><span>Unser 21. Geburtstag</span></div><IconDots size={23} aria-hidden="true" /></header>
    <div className="strip"><img src={stage} alt="Manuel, Marco und David auf der Bühne" /></div>
    <section className="fields">
      <div className="name"><div className="label">GAST</div><div className="value">Max Mustermann</div></div>
      <div className="row"><div><div className="label">DATUM</div><div className="value">20.11.2026</div></div><div><div className="label">BEGINN</div><div className="value">21 Uhr</div></div></div>
      <div><div className="label">ORT</div><div className="value">Reichshof Bayreuth</div></div>
    </section>
    <div className="barcode"><div className="qr"><IconQrcode size={151} stroke={1.3} aria-label="QR-Platzhalter, nicht scannbar" /></div></div>
  </article>;
}

export function WalletPreview() {
  return <main className="page"><div className="intro"><span>DESIGNVORSCHLAG · R6</span><h1>Dein Ticket.<br /><em>Für einen besonderen Abend.</em></h1><p>Eine Vorschau im Stil eines Apple Wallet Event-Tickets.</p></div><div className="wallet"><EventTicket /><p className="note">Vorschau · QR-Code ist ein Platzhalter</p></div><p className="disclaimer">Apple Wallet bestimmt die endgültige Darstellung. Bildausschnitt, Abstände und sichtbare Felder können auf dem iPhone abweichen.</p></main>;
}
