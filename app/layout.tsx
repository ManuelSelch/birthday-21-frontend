import type { Metadata } from "next";
import "./globals.css";
import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider, Paper, mantineHtmlProps } from '@mantine/core';

export const metadata: Metadata = {
  title: "21. Geburtstag",
  description: "Manuel, Marco & David",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" {...mantineHtmlProps}>
     <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <Paper pt="lg" c="black">
            {children}
          </Paper>
        </MantineProvider>
      </body>
    </html>
  );
}
