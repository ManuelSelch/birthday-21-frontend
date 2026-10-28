import React from 'react';
import { createRoot } from 'react-dom/client';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import './styles.css';
import { InvitationPreview } from './preview';

if (import.meta.env.DEV) await import('react-grab');

const theme = createTheme({ primaryColor: 'grape', defaultRadius: 'sm', fontFamily: 'Arial, Helvetica, sans-serif', headings: { fontFamily: 'Georgia, serif', fontWeight: '400' } });
createRoot(document.getElementById('root')!).render(<React.StrictMode><MantineProvider theme={theme}><InvitationPreview /></MantineProvider></React.StrictMode>);
