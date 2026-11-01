import { useState } from 'react';
import { Button, SegmentedControl } from '@mantine/core';
import { IconCalendarEvent, IconMapPin } from '@tabler/icons-react';
import manuel from '../invitation-hosts/assets/manuel.jpg';
import marco from '../invitation-hosts/assets/marco.jpg';
import david from '../invitation-hosts/assets/david.jpg';
import styles from './invitation.module.css';

const variants = ['navy', 'burgundy', 'charcoal'] as const;
type Variant = typeof variants[number];

export function InvitationPreview() {
  const initial = new URLSearchParams(window.location.search).get('variant');
  const [variant, setVariant] = useState<Variant>(variants.find(value => value === initial) ?? 'navy');
  function selectVariant(value: string) {
    const next = value as Variant;
    setVariant(next);
    const url = new URL(window.location.href);
    url.searchParams.set('variant', next);
    window.history.replaceState(null, '', url);
  }

  return <>
    <aside className="comparison"><strong>Farbvergleich</strong><SegmentedControl value={variant} onChange={selectVariant} data={[{ value: 'navy', label: 'Original Navy' }, { value: 'burgundy', label: 'Burgunder & Gold' }, { value: 'charcoal', label: 'Anthrazit & Rot' }]} /><span>Nur Vorschau · Auswahl oben wechseln</span></aside>
    <main className={`${styles.invitation} ${styles[variant]}`}><div className={styles.layout}>
      <header className={styles.hero}><span className={styles.edition}>2026</span><div className={styles.heroTitle}><h1>21. Geburtstag</h1></div></header>
      <section className={styles.hostsSection}><h2>Wir feiern mit euch</h2><div className={styles.hostRow}>{[['Manuel', manuel], ['Marco', marco], ['David', david]].map(([name, photo]) => <figure className={styles.hostPortrait} key={name}><img className={styles.portraitImage} src={photo} alt={name} /><figcaption>{name}</figcaption></figure>)}</div></section>
      <div className={styles.content}><dl className={styles.details}><div><IconCalendarEvent size={20} /><div><dt>WANN</dt><dd>Termin folgt · 2026</dd></div></div><div><IconMapPin size={20} /><div><dt>WO</dt><dd>Reichshof Bayreuth</dd></div></div></dl><section className={styles.response}><h2>Alex Beispiel, bist du dabei?</h2><Button className={styles.rsvp} fullWidth>Ich bin dabei</Button><p>Vorschau – keine Zusage wird gespeichert.</p></section></div>
    </div></main>
  </>;
}
