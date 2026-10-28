import { useState } from 'react';
import { ActionIcon, Badge, Button, Drawer, MultiSelect, SegmentedControl, Select, TextInput } from '@mantine/core';
import { IconCheck, IconCopy, IconPlus, IconSearch } from '@tabler/icons-react';

type Guest = { id: number; name: string; checkedIn: boolean; groups: string[]; hosts: string[]; status: 'Zugesagt' | 'Offen' | 'Abgesagt' };
const hosts = ['Manuel', 'Marco', 'David'];
const initialGuests: Guest[] = [
  { id: 1, name: 'Anna Weber', checkedIn: true, groups: ['Uni'], hosts: ['Manuel', 'Marco'], status: 'Zugesagt' },
  { id: 2, name: 'Felix Schneider', checkedIn: false, groups: ['Fußball'], hosts: ['David'], status: 'Zugesagt' },
  { id: 3, name: 'Laura Fischer', checkedIn: false, groups: ['Schule', 'Uni'], hosts: ['Manuel', 'Marco', 'David'], status: 'Offen' },
  { id: 4, name: 'Max Muster', checkedIn: true, groups: ['Arbeit'], hosts: ['Manuel'], status: 'Zugesagt' },
  { id: 5, name: 'Sophie Wagner', checkedIn: false, groups: ['Schule'], hosts: ['Marco', 'David'], status: 'Abgesagt' },
  { id: 6, name: 'Leon Bauer', checkedIn: false, groups: [], hosts: [], status: 'Offen' },
  { id: 7, name: 'Julia Hoffmann', checkedIn: false, groups: ['Uni'], hosts: ['Marco'], status: 'Zugesagt' },
  { id: 8, name: 'Paul Becker', checkedIn: false, groups: ['Fußball'], hosts: ['David', 'Manuel'], status: 'Offen' },
];

export function GuestGroupsPreview() {
  const [guests, setGuests] = useState(initialGuests);
  const [groups, setGroups] = useState(['Uni', 'Schule', 'Fußball', 'Arbeit']);
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState<string | null>(null);
  const [host, setHost] = useState<string | null>(null);
  const [status, setStatus] = useState('Alle');
  const [editing, setEditing] = useState<number | null>(null);
  const [draftGroups, setDraftGroups] = useState<string[]>([]);
  const [draftHosts, setDraftHosts] = useState<string[]>([]);
  const [newGroup, setNewGroup] = useState('');
  const [newName, setNewName] = useState('');
  const [createGroups, setCreateGroups] = useState<string[]>([]);
  const [createHosts, setCreateHosts] = useState<string[]>([]);
  const [createGroupName, setCreateGroupName] = useState('');
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState('');

  const visible = guests.filter(g =>
    g.name.toLocaleLowerCase('de').includes(search.toLocaleLowerCase('de')) &&
    (!group || (group === 'unassigned' ? !g.groups.length : g.groups.includes(group))) &&
    (!host || (host === 'unassigned' ? !g.hosts.length : g.hosts.includes(host))) &&
    (status === 'Alle' || g.status === status));
  const activeGuest = guests.find(g => g.id === editing);
  const [linkMessage, setLinkMessage] = useState('');
  async function copyInvitation() {
    if (!activeGuest) return;
    try {
      await navigator.clipboard.writeText(`https://example.invalid/invitation/${activeGuest.id}`);
      setLinkMessage('Beispiellink kopiert · keine echte Einladung');
    } catch {
      setLinkMessage('Kopieren nicht möglich. Bitte den Beispiellink unten markieren.');
    }
  }
  function openEditor(guest: Guest) {
    setLinkMessage('');
    setNewGroup('');
    setDraftGroups(guest.groups);
    setDraftHosts(guest.hosts);
    setEditing(guest.id);
  }
  function save() {
    if (editing === null) return;
    setGuests(current => current.map(g => g.id === editing ? {
      ...g, groups: draftGroups, hosts: draftHosts,
    } : g));
    setNotice('Zuordnung gespeichert.');
    setEditing(null);
  }
  return <div className="guest-app">
    <header className="topbar"><span>21. Geburtstag</span><span className="admin-label">ADMIN</span></header>
    <main className="guest-main">
      <div className="page-heading"><div><h1>Gäste</h1><p>{guests.length} Gäste <span>·</span> {guests.filter(g => g.status === 'Zugesagt').length} Zusagen <span>·</span> {guests.filter(g => g.checkedIn).length} eingecheckt</p></div>
        <Button leftSection={<IconPlus size={17}/>} onClick={() => { setNewName(''); setCreateGroups([]); setCreateHosts([]); setCreateGroupName(''); setAdding(true); }}>Gast</Button></div>
      <section className="filter-area" aria-label="Gäste filtern">
        <TextInput size="md" leftSection={<IconSearch size={18}/>} aria-label="Gäste suchen" placeholder="Namen suchen" value={search} onChange={e => setSearch(e.currentTarget.value)}/>
        <div className="filter-pair">
          <Select size="md" aria-label="Gruppe filtern" placeholder="Alle Gruppen" clearable data={[...groups, { value: 'unassigned', label: 'Ohne Gruppe' }]} value={group} onChange={setGroup}/>
          <Select size="md" aria-label="Hosts filtern" placeholder="Alle Hosts" clearable data={[...hosts, { value: 'unassigned', label: 'Ohne Hosts' }]} value={host} onChange={setHost}/>
        </div>
        <SegmentedControl fullWidth size="sm" aria-label="Rückmeldung filtern" value={status} onChange={setStatus} data={['Alle', 'Zugesagt', 'Offen', 'Abgesagt']}/>
      </section>
      <div className="list-heading"><span>{visible.length} Gäste{(group || host || search || status !== 'Alle') && ' im Filter'}</span></div>
      <section aria-label="Gästeliste" className="guest-list">
        <table className="guest-table">
          <thead><tr><th scope="col">Gast</th><th scope="col" className="desktop-column">Gruppen</th><th scope="col" className="desktop-column">Hosts</th><th scope="col" className="rsvp-column">Status</th><th scope="col" className="checkin-column">Check-in</th></tr></thead>
          <tbody>{visible.map(guest => <GuestRow key={guest.id} guest={guest} onEdit={() => openEditor(guest)}/>)}</tbody>
        </table>
        {!visible.length && <p className="empty">Keine Gäste gefunden.<br/><Button variant="subtle" mt="sm" onClick={() => { setSearch(''); setGroup(null); setHost(null); setStatus('Alle'); }}>Filter zurücksetzen</Button></p>}
      </section>
      <p className="footnote" role="status">{notice || 'Designvorschau · nur Beispieldaten'}</p>
    </main>

    <Drawer opened={editing !== null} onClose={() => setEditing(null)} position="bottom" size="auto" title={activeGuest?.name} className="assignment-drawer">
      <div className="sheet-content">

        {activeGuest && <div className="guest-utilities">
          <span className={'checkin-status' + (activeGuest.checkedIn ? ' checked-in' : '')}>{activeGuest.checkedIn && <IconCheck size={14}/>} {activeGuest.checkedIn ? 'Eingecheckt' : 'Nicht eingecheckt'}</span>
          <Button variant="default" size="md" leftSection={<IconCopy size={17}/>} onClick={copyInvitation}>Einladungslink kopieren</Button>
          <TextInput label="Beispiellink · keine echte Einladung" readOnly value={`https://example.invalid/invitation/${activeGuest.id}`} aria-label="Beispiel-Einladungslink"/>
          {linkMessage && <p className="sheet-hint" role="status">{linkMessage}</p>}
        </div>}
        <MultiSelect label="Gruppen" placeholder="Gruppen auswählen" data={groups} value={draftGroups} onChange={setDraftGroups} size="md" clearable/>
        <form className="new-group" onSubmit={e => { e.preventDefault(); const value = newGroup.trim(); if (!value) return; if (!groups.includes(value)) setGroups([...groups, value]); setDraftGroups([...new Set([...draftGroups, value])]); setNewGroup(''); }}>
          <TextInput aria-label="Neue Gruppe" placeholder="Neue Gruppe" value={newGroup} onChange={e => setNewGroup(e.currentTarget.value)} maxLength={40}/>
          <ActionIcon size={36} type="submit" variant="light" disabled={!newGroup.trim()} aria-label="Gruppe erstellen"><IconPlus size={18}/></ActionIcon>
        </form>
        <div className="host-picker"><span className="field-label">Hosts</span><div className="host-options">{hosts.map(value => <Button key={value} variant={draftHosts.includes(value) ? 'filled' : 'default'} aria-pressed={draftHosts.includes(value)} leftSection={draftHosts.includes(value) ? <IconCheck size={15}/> : undefined} onClick={() => setDraftHosts(draftHosts.includes(value) ? draftHosts.filter(h => h !== value) : [...draftHosts, value])}>{value}</Button>)}</div></div>
        <Button size="md" fullWidth onClick={save}>Speichern</Button>
      </div>
    </Drawer>
    <Drawer opened={adding} onClose={() => setAdding(false)} position="bottom" size="auto" title="Gast hinzufügen">
      <form className="sheet-content" onSubmit={e => {e.preventDefault(); if (!newName.trim()) return; const id = Date.now(); setGuests([...guests, {id, name: newName.trim(), checkedIn: false, groups: createGroups, hosts: createHosts, status: 'Offen'}]); setNewName(''); setAdding(false); setSearch(''); setGroup(null); setHost(null); setStatus('Alle'); setNotice('Gast mit Zuordnungen hinzugefügt.');}}>
        <TextInput label="Name" placeholder="Vor- und Nachname" autoFocus size="md" maxLength={100} value={newName} onChange={e => setNewName(e.currentTarget.value)}/>
        <MultiSelect label="Gruppen" placeholder="Gruppen auswählen" data={groups} value={createGroups} onChange={setCreateGroups} size="md" clearable/>
        <div className="new-group">
          <TextInput aria-label="Neue Gruppe beim Erstellen" placeholder="Neue Gruppe" maxLength={40} value={createGroupName} onChange={e => setCreateGroupName(e.currentTarget.value)}/>
          <ActionIcon type="button" size={36} variant="light" disabled={!createGroupName.trim()} aria-label="Gruppe erstellen und auswählen" onClick={() => { const value = createGroupName.trim(); if (!value) return; if (!groups.includes(value)) setGroups([...groups, value]); setCreateGroups([...new Set([...createGroups, value])]); setCreateGroupName(''); }}><IconPlus size={18}/></ActionIcon>
        </div>
        <div className="host-picker"><span className="field-label">Hosts</span><div className="host-options">{hosts.map(value => <Button type="button" key={value} variant={createHosts.includes(value) ? 'filled' : 'default'} aria-pressed={createHosts.includes(value)} leftSection={createHosts.includes(value) ? <IconCheck size={15}/> : undefined} onClick={() => setCreateHosts(createHosts.includes(value) ? createHosts.filter(h => h !== value) : [...createHosts, value])}>{value}</Button>)}</div></div>
        <Button type="submit" size="md" disabled={!newName.trim()}>Gast hinzufügen</Button>
      </form>
    </Drawer>
  </div>;
}

function GuestRow({ guest, onEdit }: {guest: Guest; onEdit: () => void}) {
  return <tr className="guest-row">
    <td>
      <button className="guest-details" onClick={onEdit} aria-label={guest.name + ' · Details und Einladungslink'}>
        <strong>{guest.name}</strong>
        <span className="guest-meta mobile-meta"><span className={guest.groups.length ? 'group-label' : 'unassigned'}>{guest.groups.join(' · ') || 'Ohne Gruppe'}</span><span>{guest.hosts.join(', ') || 'Ohne Hosts'}</span></span>
      </button>
    </td>
    <td className="desktop-column"><span className="group-label">{guest.groups.join(', ') || 'Ohne Gruppe'}</span></td>
    <td className="desktop-column">{guest.hosts.join(', ') || 'Ohne Hosts'}</td>
    <td className="rsvp-column"><Badge size="xs" variant="dot" color={guest.status === 'Zugesagt' ? 'teal' : guest.status === 'Offen' ? 'gray' : 'red'}>{guest.status}</Badge></td>
    <td className="checkin-column"><span className={'checkin-indicator' + (guest.checkedIn ? ' checked-in' : '')} role="img" aria-label={guest.checkedIn ? 'Eingecheckt' : 'Nicht eingecheckt'} title={guest.checkedIn ? 'Eingecheckt' : 'Nicht eingecheckt'}>{guest.checkedIn ? <IconCheck size={19}/> : '—'}</span></td>
  </tr>;
}
