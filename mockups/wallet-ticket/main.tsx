import React from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider, createTheme } from "@mantine/core";
import { Agentation } from "agentation";
import "@mantine/core/styles.css";
import "./styles.css";
import { WalletPreview } from "./preview";

createRoot(document.getElementById("root")!).render(<React.StrictMode><MantineProvider theme={createTheme({ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' })}><WalletPreview />{import.meta.env.DEV && <Agentation />}</MantineProvider></React.StrictMode>);
