import { Alert } from '@mantine/core';
import type { ShowConnection } from '../../app/use-live-show';
import { cx } from './show-styles';

export function ConnectionStatus({ connection, indicator = false }: { connection: ShowConnection; indicator?: boolean }) {
  const label = connection === 'connected' ? 'Verbunden' : connection === 'connecting' ? 'Verbindung wird aufgebaut' : 'Verbindung unterbrochen';
  if (indicator) return <span role="status" aria-label={label} title={label} className={cx(`connection-indicator ${connection === 'connected' ? 'connected' : 'disconnected'}`)} />;
  if (connection === 'connected') return <span role="status">Verbunden</span>;
  return (
    <Alert role="alert" color="yellow" title={label}>
      {connection === 'connecting' ? 'Warte auf den Show-Server.' : 'Letzter Stand wird angezeigt. Automatische Wiederverbindung läuft.'}
    </Alert>
  );
}
