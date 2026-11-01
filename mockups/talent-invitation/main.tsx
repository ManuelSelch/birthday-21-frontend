import React from "react";
import { createRoot } from "react-dom/client";
import { createTheme, MantineProvider } from "@mantine/core";
import { Agentation } from "agentation";
import "@mantine/core/styles.css";
import "./styles.css";
import { Preview } from "./preview";

const theme = createTheme({ fontFamily: "Arial, sans-serif", primaryColor: "red", defaultRadius: "sm" });
createRoot(document.getElementById("root")!).render(<React.StrictMode><MantineProvider theme={theme} forceColorScheme="dark"><Preview />{import.meta.env.DEV && <Agentation />}</MantineProvider></React.StrictMode>);
