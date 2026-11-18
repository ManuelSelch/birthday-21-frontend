import React from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import { Agentation } from 'agentation';
import '@mantine/core/styles.css';
import './styles.css';
import './birthday.css';
import { Studio } from './Studio';
const theme = createTheme({
  primaryColor:'champagne',
  colors:{champagne:['#faf6ef','#f3eadc','#e6d4b7','#d8c4a4','#cbb38d','#bea176','#ad8f62','#977a50','#806642','#695335']},
  primaryShade:2,
  autoContrast:true,
  fontFamily:'Arial, Helvetica, sans-serif',
  headings:{fontFamily:'Georgia, "Times New Roman", serif',fontWeight:'400'},
  defaultRadius:3,
});
createRoot(document.getElementById('root')!).render(<React.StrictMode><MantineProvider theme={theme} forceColorScheme="dark"><Studio/>{import.meta.env.DEV && <Agentation/>}</MantineProvider></React.StrictMode>);
