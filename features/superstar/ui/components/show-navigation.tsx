import { Alert, Button } from '@mantine/core';
import { juryIds } from '../../domain/catalog';
import { jurors } from './show-data';

export function ShowNavigation({ onEdit, error }: { onEdit: () => void; error: string | null }) {
  return <>
    <nav aria-label="Show-Bildschirme" className="mb-6 flex flex-wrap items-center gap-5 text-sm">
      <Button size="xs" variant="default" onClick={onEdit}>Shows bearbeiten</Button>
      <a href="/superstar/projector" target="_blank" rel="noopener noreferrer">Beamer öffnen</a>
      {juryIds.map((id, index) => <a key={id} href={`/superstar/jury/${id}`} target="_blank" rel="noopener noreferrer">{jurors[index].name} öffnen</a>)}
    </nav>
    {error && <Alert role="alert" color="red" mb="md">{error}</Alert>}
  </>;
}
