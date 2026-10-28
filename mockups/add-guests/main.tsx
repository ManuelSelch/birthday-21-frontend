import { createRoot } from 'react-dom/client';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import './styles.css';
import { GuestsPreview } from './guests-preview';
if (import.meta.env.DEV) await import('react-grab');
createRoot(document.getElementById('root')!).render(
  <MantineProvider theme={createTheme({ primaryColor: 'blue', fontFamily: 'Arial, Helvetica, sans-serif', defaultRadius: 'md' })} forceColorScheme="light">
    <GuestsPreview />
  </MantineProvider>,
);
