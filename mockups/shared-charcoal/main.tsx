import React from 'react';
import { createRoot } from 'react-dom/client';
import { createTheme, MantineProvider } from '@mantine/core';
import { Agentation } from 'agentation';
import '@mantine/core/styles.css';
import './styles.css';
import { Preview } from './preview';

createRoot(document.getElementById('root')!).render(<React.StrictMode><MantineProvider forceColorScheme="dark" theme={createTheme({ fontFamily: 'Arial, sans-serif', defaultRadius: 'sm' })}><Preview />{import.meta.env.DEV && <Agentation />}</MantineProvider></React.StrictMode>);
