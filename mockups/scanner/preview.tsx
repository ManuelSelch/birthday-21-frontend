import { useState } from 'react';
import { Button, Loader } from '@mantine/core';
import { IconUsers, IconScan, IconCheck, IconAlertTriangle, IconCameraOff } from '@tabler/icons-react';

type State = 'ready' | 'loading' | 'success' | 'warning' | 'error';
const states: State[] = ['ready', 'loading', 'success', 'warning', 'error'];
const labels = { ready: 'Bereit', loading: 'Prüfen', success: 'Gültig', warning: 'Warnung', error: 'Kamerafehler' };
export function ScannerPreview() {
  const requested = new URLSearchParams(location.search).get('state') as State;
  const [state, setState] = useState<State>(states.includes(requested) ? requested : 'ready');
  return <div className="admin">
    <header className="topbar"><span className="brand">21. Geburtstag</span><span className="eyebrow">ADMIN</span></header>
    <main>
      <div className="heading"><div><h1>Ticket-Scanner</h1></div><Button component="a" href="../admin-ui/" variant="outline" leftSection={<IconUsers size={17}/>}>Gästeliste</Button></div>
      <section className="scanner-panel" aria-label="Ticket scannen">
        <div className="camera-view">
          {state === 'error' ? <div className="camera-placeholder"><IconCameraOff size={36} stroke={1.2}/><span>Kamera nicht verfügbar</span></div> : <><div className="scan-frame"><IconScan size={52} stroke={1}/></div><span className="camera-caption">Kameravorschau · simuliert</span></>}
        </div>
        <div className="scanner-status" role="status">
          {state === 'loading' ? <><Loader size={18} color="gold"/><span>Ticket wird geprüft …</span></> : <><span className={'status-dot ' + (state === 'error' ? 'offline' : '')}/><span>{state === 'error' ? 'Bitte Kamerazugriff im Browser erlauben.' : 'Bereit zum Scannen'}</span></>}
        </div>
      </section>
      {(state === 'success' || state === 'warning') && <ScanResult state={state}/>}
      <aside className="preview-controls" aria-label="Vorschaustatus"><span>VORSCHAU</span><div>{states.map(value => <Button key={value} size="compact-xs" variant={state === value ? 'filled' : 'outline'} onClick={() => setState(value)}>{labels[value]}</Button>)}</div></aside>
    </main>
  </div>;
}
function ScanResult({ state }: { state: 'success' | 'warning' }) {
  return <div className={'scan-result ' + state} role="status">
    {state === 'success' ? <IconCheck size={22}/> : <IconAlertTriangle size={22}/>}
    <div><strong>{state === 'success' ? 'Ticket gültig' : 'Bereits eingecheckt'}</strong><p>{state === 'success' ? 'Check-in erfolgreich.' : 'Dieser Gast wurde bereits eingecheckt.'}</p></div>
  </div>;
}
