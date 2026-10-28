import { createRoot } from 'react-dom/client';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import './styles.css';
import { GuestGroupsPreview } from './preview';

if (import.meta.env.DEV) await import('react-grab');

const theme = createTheme({
  primaryColor: 'gold',
  colors: { gold: ['#faf5eb','#f0e5d0','#e8d6b4','#dfc796','#d9bd86','#c8aa70','#b6985f','#9a7e4c','#80673d','#695332'] },
  fontFamily: 'Arial, Helvetica, sans-serif',
  defaultRadius: 'md',
});
createRoot(document.getElementById('root')!).render(
  <MantineProvider forceColorScheme="dark" theme={theme}><GuestGroupsPreview/></MantineProvider>,
);
