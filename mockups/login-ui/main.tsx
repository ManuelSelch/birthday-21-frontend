import { createRoot } from 'react-dom/client';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import './styles.css';
import { LoginPreview } from './login-preview';

if (import.meta.env.DEV) await import('react-grab');

const theme = createTheme({
  fontFamily: 'Arial, Helvetica, sans-serif',
  headings: { fontFamily: 'Georgia, serif', fontWeight: '400' },
  defaultRadius: 'sm',
});

createRoot(document.getElementById('root')!).render(
  <MantineProvider theme={theme} forceColorScheme="dark"><LoginPreview /></MantineProvider>,
);
