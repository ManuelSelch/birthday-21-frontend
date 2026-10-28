import { createRoot } from 'react-dom/client';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import './styles.css';
import { GuestGroupsPreview } from './preview';

if (import.meta.env.DEV) await import('react-grab');

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Arial, Helvetica, sans-serif',
  defaultRadius: 'md',
});
createRoot(document.getElementById('root')!).render(
  <MantineProvider forceColorScheme="dark" theme={theme}><GuestGroupsPreview/></MantineProvider>,
);
