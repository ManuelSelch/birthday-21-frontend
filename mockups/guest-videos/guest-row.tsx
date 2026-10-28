import { Switch } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

export interface SampleGuest {
  id: number; name: string; group: string; hosts: string; video: boolean; accepted: boolean | null;
}

export function GuestRow({guest, videos, onToggle}: {guest: SampleGuest; videos: boolean; onToggle: () => void}) {
  return <li className="guest-row">
    <div className="guest-copy"><strong>{guest.name}</strong><p>{guest.group} <span>·</span> {guest.hosts}</p></div>
    {videos ? <div className="video-control">
      <Switch checked={guest.video} onChange={onToggle} size="md"
        aria-label={'Video zu ' + guest.name + ' vorhanden'}
        thumbIcon={guest.video ? <IconCheck size={12} color="var(--navy)"/> : null}/>
      <span className={guest.video ? 'received' : 'missing'}>{guest.video ? 'Vorhanden' : 'Fehlt'}</span>
    </div> : <span className={'rsvp ' + (guest.accepted === true ? 'yes' : guest.accepted === false ? 'no' : '')}>
      {guest.accepted === true ? 'Zugesagt' : guest.accepted === false ? 'Abgesagt' : 'Offen'}
    </span>}
  </li>;
}
