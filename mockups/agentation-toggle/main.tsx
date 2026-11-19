import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ActionIcon, Button, MantineProvider, Tooltip } from '@mantine/core';
import { IconLogout, IconPencil, IconPlus, IconRefresh, IconScan } from '@tabler/icons-react';
import { Agentation } from 'agentation';
import '@mantine/core/styles.css';
import './styles.css';

function GuestPreview() {
  const [enabled, setEnabled] = useState(false);
  return <div className="screen"><header><span className="brand">21. Geburtstag</span><div className="actions">
    <Tooltip label={enabled ? 'Agentation deaktivieren' : 'Agentation aktivieren'}><ActionIcon variant={enabled ? 'light' : 'subtle'} color={enabled ? 'yellow' : 'gray'} size={36} aria-label="Agentation" aria-pressed={enabled} onClick={() => setEnabled(!enabled)}><IconPencil size={18}/></ActionIcon></Tooltip>
    <Tooltip label="Seite neu laden"><ActionIcon variant="subtle" color="gray" aria-label="Seite neu laden"><IconRefresh size={18}/></ActionIcon></Tooltip>
    <Button variant="subtle" color="gray" leftSection={<IconScan size={17}/>}>Scanner</Button><Button variant="default" leftSection={<IconLogout size={16}/>}>Abmelden</Button>
  </div></header><main><div className="heading"><div><h1>Gäste</h1><p>3 Gäste, 2 Zusagen, 0 eingecheckt</p></div><Button color="yellow" leftSection={<IconPlus size={17}/>}>Gast</Button></div>
  <div className="guests">{['Anna Weber', 'Felix Schneider', 'Laura Fischer'].map(name => <div key={name}>{name}</div>)}</div><p>Vorschau mit Beispieldaten.</p></main>
  {import.meta.env.DEV && enabled && <Agentation />}</div>;
}
createRoot(document.getElementById('root')!).render(<MantineProvider forceColorScheme="dark"><GuestPreview /></MantineProvider>);
