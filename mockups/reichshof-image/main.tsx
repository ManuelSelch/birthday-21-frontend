import React from 'react';
import { createRoot } from 'react-dom/client';
import { createTheme, MantineProvider } from '@mantine/core';
import { Agentation } from 'agentation';
import '@mantine/core/styles.css';
import './styles.css';
import { InvitationPreview } from './preview';

const theme = createTheme({ fontFamily: 'Arial, Helvetica, sans-serif' });
createRoot(document.getElementById('root')!).render(<React.StrictMode><MantineProvider theme={theme}><InvitationPreview />{import.meta.env.DEV && <Agentation />}</MantineProvider></React.StrictMode>);
