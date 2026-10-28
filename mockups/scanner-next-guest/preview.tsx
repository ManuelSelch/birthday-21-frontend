import { useEffect, useState } from 'react';
import { Button, Loader } from '@mantine/core';
import { IconUsers, IconScan, IconCheck, IconAlertTriangle, IconPlayerPause, IconArrowRight } from '@tabler/icons-react';

type State = 'ready' | 'loading' | 'success' | 'warning' | 'error';
const states: State[] = ['ready', 'loading', 'success', 'warning', 'error'];
const labels: Record<State, string> = { ready: 'Bereit', loading: 'Prüfen', success: 'Erfolgreich', warning: 'Bereits eingecheckt', error: 'Ungültiges Ticket' };

export function ScannerPreview() {
  const requested = new URLSearchParams(location.search).get('state') as State;
  const [state, setState] = useState<State>(states.includes(requested) ? requested : 'success');
  const paused = state === 'success' || state === 'warning' || state === 'error';
  useEffect(() => {
    if (state !== 'loading') return;
    const timer = window.setTimeout(() => setState('success'), 850);
    return () => window.clearTimeout(timer);
  }, [state]);

  return <div className="admin">
    <header className="topbar"><span className="brand">21. Geburtstag</span><span className="eyebrow">ADMIN</span></header>
    <main>
      <div className="heading"><h1>Ticket-Scanner</h1><Button component="a" href="../admin-ui/" variant="outline" leftSection={<IconUsers size={17}/>}>Gästeliste</Button></div>
      <section className="scanner-panel" aria-label="Ticket scannen">
        <div className={'camera-view ' + (paused ? 'camera-paused' : '')}>
          {paused ? <div className="camera-placeholder"><IconPlayerPause size={36} stroke={1.2}/><span>Scanner pausiert</span></div> : <><div className="scan-frame"><IconScan size={52} stroke={1}/></div><span className="camera-caption">Kameravorschau · simuliert</span></>}
        </div>
        <div className="scanner-status" role="status">
          {state === 'loading' ? <><Loader size={18} color="gold"/><span>Ticket wird geprüft …</span></> : <><span className={'status-dot ' + (paused ? 'paused' : '')}/><span>{paused ? 'Bereit für den nächsten Gast?' : 'Bereit zum Scannen'}</span></>}
        </div>
      </section>
      {paused && <>
        <ScanResult state={state}/>
        <div className="next-action"><Button fullWidth size="md" rightSection={<IconArrowRight size={18}/>} onClick={() => setState('ready')}>Nächsten Gast scannen</Button><p>Erst dann werden wieder Tickets gelesen.</p></div>
      </>}
      <aside className="preview-controls" aria-label="Mockup-Steuerung"><span>NUR IM MOCKUP</span>
        {state === 'ready' && <Button fullWidth variant="outline" mt="sm" onClick={() => setState('loading')} leftSection={<IconScan size={16}/>}>Ticket-Scan simulieren</Button>}
        <div>{states.filter(value => value !== 'loading').map(value => <Button key={value} size="compact-xs" variant={state === value ? 'filled' : 'outline'} onClick={() => setState(value)}>{labels[value]}</Button>)}</div>
      </aside>
    </main>
  </div>;
}

function ScanResult({ state }: { state: 'success' | 'warning' | 'error' }) {
  const success = state === 'success';
  return <div className={'scan-result ' + (success ? 'success' : 'warning')} role="status">
    {success ? <IconCheck size={24}/> : <IconAlertTriangle size={24}/>}
    <div><strong>{success ? 'Ticket gültig' : state === 'warning' ? 'Bereits eingecheckt' : 'Ticket ungültig'}</strong><p>{success ? 'Max Muster · Check-in erfolgreich.' : state === 'warning' ? 'Max Muster wurde bereits eingecheckt.' : 'Dieser QR-Code ist kein gültiges Ticket.'}</p></div>
  </div>;
}
