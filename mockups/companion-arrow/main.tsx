import React from 'react';
import { createRoot } from 'react-dom/client';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import './styles.css';
import { CompanionPreview } from './preview';

if (import.meta.env.DEV) await import('react-grab');

const theme = createTheme({ primaryColor: 'blue', defaultRadius: 'md', fontFamily: 'Arial, Helvetica, sans-serif' });
createRoot(document.getElementById('root')!).render(
  <React.StrictMode><MantineProvider theme={theme} forceColorScheme="dark"><CompanionPreview /></MantineProvider></React.StrictMode>
);
