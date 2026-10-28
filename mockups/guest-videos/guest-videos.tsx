import { useState } from 'react';
import { Badge, Progress, SegmentedControl, TextInput } from '@mantine/core';
import { IconSearch, IconVideo } from '@tabler/icons-react';
import { GuestRow, type SampleGuest } from './guest-row';

const initialGuests: SampleGuest[] = [
  {id:1, name:'Anna Weber', group:'Freunde', hosts:'Manuel', video:true, accepted:true},
  {id:2, name:'Felix Schneider', group:'Uni', hosts:'Marco', video:false, accepted:true},
  {id:3, name:'Laura Fischer', group:'Freunde', hosts:'Manuel, David', video:false, accepted:null},
  {id:4, name:'Lukas Hoffmann', group:'Familie', hosts:'David', video:true, accepted:true},
  {id:5, name:'Sophie Wagner', group:'Uni', hosts:'Marco', video:true, accepted:true},
  {id:6, name:'Max Berger', group:'Freunde', hosts:'Manuel', video:false, accepted:false},
  {id:7, name:'Marie Keller', group:'Familie', hosts:'Marco', video:false, accepted:true},
  {id:8, name:'Paul Richter', group:'Freunde', hosts:'David', video:true, accepted:null},
];

export function GuestVideos() {
  const [guests, setGuests] = useState(initialGuests);
  const [view, setView] = useState('videos');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const received = guests.filter(guest => guest.video).length;
  const videos = view === 'videos';
  const visible = guests.filter(guest =>
    (guest.name + ' ' + guest.group + ' ' + guest.hosts).toLocaleLowerCase('de').includes(query.toLocaleLowerCase('de')) &&
    (!videos || filter === 'all' || (filter === 'received' ? guest.video : !guest.video)));
  function toggle(id: number) {
    const guest = guests.find(item => item.id === id)!;
    setGuests(items => items.map(item => item.id === id ? {...item, video: !item.video} : item));
    setAnnouncement(guest.name + ': ' + (guest.video ? 'Video als fehlend markiert.' : 'Video als erhalten markiert.'));
  }
  return <div className="screen">
    <header><span className="brand">21. Geburtstag</span><Badge variant="outline" color="gray" size="sm">Admin</Badge></header>
    <main>
      <div className="heading"><h1>Gäste</h1><span>{guests.length} Gäste</span></div>
      <SegmentedControl className="view-tabs" fullWidth size="md" value={view} onChange={setView}
        aria-label="Ansicht" data={[{value:'guests',label:'Übersicht'},{value:'videos',label:'Videos'}]}/>
      {videos && <section className="summary" aria-label="Video-Fortschritt">
        <div className="summary-title"><span><IconVideo size={18}/> Videos erhalten</span><strong>{received} <span>/ {guests.length}</span></strong></div>
        <Progress value={received / guests.length * 100} size={4} aria-label={received + ' von ' + guests.length + ' Gästen mit Video'}/>
        <p>Von {guests.length - received} Gästen fehlt noch ein Video.</p>
      </section>}
      <TextInput className="search" size="md" placeholder="Name, Gruppe oder Host suchen"
        aria-label="Gäste suchen" leftSection={<IconSearch size={17}/>} value={query} onChange={event => setQuery(event.currentTarget.value)}/>
      {videos && <SegmentedControl className="filters" fullWidth value={filter} onChange={setFilter} aria-label="Video-Status"
        data={[{value:'all',label:'Alle'},{value:'missing',label:'Fehlt · ' + (guests.length - received)},{value:'received',label:'Erhalten · ' + received}]}/>}
      <div className="list-label"><span>{visible.length} {visible.length === 1 ? 'Gast' : 'Gäste'}</span><span>{videos ? 'Video erhalten' : 'Status'}</span></div>
      <ul className="guest-list">{visible.map(guest => <GuestRow key={guest.id} guest={guest} videos={videos} onToggle={() => toggle(guest.id)}/>)}</ul>
      {!visible.length && <p className="empty">Keine Gäste gefunden.</p>}
      <div className="sr-only" role="status" aria-live="polite">{announcement}</div>
      <p className="footnote">{videos ? 'Ein Schalter pro Gast – unabhängig von der Zusage.' : 'Übersicht für diese Vorschau vereinfacht.'}<br/>Mockup · Beispieldaten · Änderungen nur lokal</p>
    </main>
  </div>;
}
