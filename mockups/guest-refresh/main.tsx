import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import { ActionIcon, Button, createTheme, MantineProvider, Tooltip } from '@mantine/core';
import { IconRefresh, IconScan, IconLogout, IconPlus } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import './styles.css';

if (import.meta.env.DEV) await import('react-grab');

function GuestRefreshPreview() {
  const [refreshing, setRefreshing] = useState(false);
  function refresh() {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 700);
  }
  return <div className="screen">
    <header><span className="brand">21. Geburtstag</span><div className="actions">
      <Tooltip label="Seite neu laden"><ActionIcon variant="subtle" color="gray" size={36} aria-label="Seite neu laden" loading={refreshing} onClick={refresh}><IconRefresh size={18}/></ActionIcon></Tooltip>
      <Button component="a" variant="subtle" color="gray" leftSection={<IconScan size={17}/>}>Scanner</Button>
      <Button variant="default" leftSection={<IconLogout size={16}/>}>Abmelden</Button>
    </div></header>
    <main><div className="heading"><div><h1>Gäste</h1><p>3 Gäste · 2 Zusagen · 0 eingecheckt</p></div><Button color="gold" leftSection={<IconPlus size={17}/>}>Gast</Button></div>
      <div className="guests">{['Anna Weber', 'Felix Schneider', 'Laura Fischer'].map(name => <div key={name}>{name}</div>)}</div>
      <p className="note" role="status">{refreshing ? 'Seite wird neu geladen …' : 'Vorschau: Der Refresh-Button simuliert das Neuladen.'}</p>
    </main>
  </div>;
}
const theme = createTheme({ primaryColor: 'gold', colors: { gold: ['#faf5eb','#f0e5d0','#e8d6b4','#dfc796','#d9bd86','#c8aa70','#b6985f','#9a7e4c','#80673d','#695332'] }, fontFamily: 'Arial, Helvetica, sans-serif' });
createRoot(document.getElementById('root')!).render(<MantineProvider forceColorScheme="dark" theme={theme}><GuestRefreshPreview/></MantineProvider>);
