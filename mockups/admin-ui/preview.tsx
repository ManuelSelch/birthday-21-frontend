import { useState } from 'react';
import { Badge, Button, TextInput } from '@mantine/core';
import { IconSearch, IconPlus, IconArrowUpRight, IconScan } from '@tabler/icons-react';

type Guest = { id: number; name: string; accepted: boolean | null; checkedIn: boolean; companion: boolean };
const initialGuests: Guest[] = [
  { id: 1, name: 'Anna Weber', accepted: true, checkedIn: true, companion: true },
  { id: 2, name: 'Felix Schneider', accepted: true, checkedIn: false, companion: false },
  { id: 3, name: 'Laura Fischer', accepted: null, checkedIn: false, companion: false },
  { id: 4, name: 'Max Muster', accepted: true, checkedIn: true, companion: false },
  { id: 5, name: 'Sophie Wagner', accepted: false, checkedIn: false, companion: false },
];
export function AdminPreview() {
  const [guests, setGuests] = useState(initialGuests);
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [filter, setFilter] = useState('Alle');
  const [notice, setNotice] = useState('');
  const visible = guests.filter(g => g.name.toLocaleLowerCase('de').includes(search.toLocaleLowerCase('de')) && (filter === 'Alle' || (filter === 'Zusagen' ? g.accepted === true : g.accepted === null)));
  function addGuest(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setGuests([...guests, { id: Date.now(), name: name.trim(), accepted: null, checkedIn: false, companion: false }]);
    setName(''); setSearch(''); setFilter('Alle'); setNotice('Gast hinzugefügt · nur in dieser Vorschau');
  }
  return (
    <div className="admin">
      <header className="topbar"><span className="brand">21. Geburtstag</span><span className="eyebrow">ADMIN</span></header>
      <main>
        <div className="heading"><div><p className="eyebrow">ALLES IM BLICK</p><h1>Gästeliste</h1></div><Button variant="outline" leftSection={<IconScan size={17}/>} onClick={() => setNotice('Scanner ist nicht Teil dieser Vorschau.')}>Scanner</Button></div>
        <Summary guests={guests}/>
        <section className="guest-panel" aria-label="Gäste verwalten">
          <form className="add-form" onSubmit={addGuest}><TextInput aria-label="Name des neuen Gasts" placeholder="Name des neuen Gasts" maxLength={100} value={name} onChange={e => setName(e.currentTarget.value)}/><Button type="submit" leftSection={<IconPlus size={16}/>} disabled={!name.trim()}>Hinzufügen</Button></form>
          <div className="toolbar"><div className="filters" aria-label="Gäste filtern">{['Alle', 'Zusagen', 'Offen'].map(item => <button type="button" key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div><TextInput aria-label="Gäste suchen" leftSection={<IconSearch size={16}/>} placeholder="Gäste suchen" value={search} onChange={e => setSearch(e.currentTarget.value)}/></div>
          <div className="table-scroll"><table><thead><tr><th>Name</th><th>Rückmeldung</th><th>Check-in</th><th><span className="sr-only">Aktion</span></th></tr></thead><tbody>{visible.map(guest => <GuestRow key={guest.id} guest={guest} onInvite={() => setNotice('Einladungslink · in der Vorschau nicht verknüpft.')}/>)}</tbody></table></div>
          {!visible.length && <p className="empty">Keine Gäste gefunden.</p>}
          <div className="table-footer">{visible.length} von {guests.length} Gästen</div>
        </section>
        <p className="notice" role="status">{notice || 'Designvorschau · Beispieldaten'}</p>
      </main>
    </div>
  );
}
function Summary({ guests }: { guests: Guest[] }) {
  const accepted = guests.filter(g => g.accepted === true);
  return <section className="summary" aria-label="Übersicht">{[
    ['Gäste', guests.length], ['Zusagen', accepted.length], ['Mit Begleitung', accepted.length + accepted.filter(g => g.companion).length], ['Eingecheckt', guests.filter(g => g.checkedIn).length],
  ].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</section>;
}
function GuestRow({ guest, onInvite }: { guest: Guest; onInvite: () => void }) {
  return <tr><td className="guest-name">{guest.name}{guest.companion && <small>+1 Begleitung</small>}</td><td><Badge variant="light" color={guest.accepted === null ? 'gray' : guest.accepted ? 'teal' : 'red'}>{guest.accepted === null ? 'Offen' : guest.accepted ? 'Zugesagt' : 'Abgesagt'}</Badge></td><td><span className={guest.checkedIn ? 'checked' : 'muted'}>{guest.checkedIn ? 'Eingecheckt' : '—'}</span></td><td><Button variant="subtle" size="compact-sm" rightSection={<IconArrowUpRight size={14}/>} onClick={onInvite} aria-label={'Einladung für ' + guest.name + ' öffnen'}>Einladung</Button></td></tr>;
}
