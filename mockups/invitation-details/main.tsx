import React from 'react';
import { createRoot } from 'react-dom/client';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import './styles.css';
import { InvitationDetails } from './invitation-details';

if (import.meta.env.DEV) await import('react-grab');

const theme = createTheme({
  primaryColor: 'yellow',
  defaultRadius: 'sm',
  fontFamily: 'Arial, Helvetica, sans-serif',
  headings: { fontFamily: 'Georgia, serif', fontWeight: '400' },
});
createRoot(document.getElementById('root')!).render(
  <React.StrictMode><MantineProvider theme={theme} forceColorScheme="dark"><InvitationDetails /></MantineProvider></React.StrictMode>
);
