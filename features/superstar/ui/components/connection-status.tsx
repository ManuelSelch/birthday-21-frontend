import { Alert } from '@mantine/core';
import type { ShowConnection } from '../../app/use-live-show';

export function ConnectionStatus({ connection }: { connection: ShowConnection }) {
  if (connection === 'connected') return <span role="status">Verbunden</span>;
  return (
    <Alert role="alert" color="yellow" title={connection === 'connecting' ? 'Verbindung wird aufgebaut' : 'Verbindung unterbrochen'}>
      {connection === 'connecting' ? 'Warte auf den Show-Server.' : 'Letzter Stand wird angezeigt. Automatische Wiederverbindung läuft.'}
    </Alert>
  );
}
