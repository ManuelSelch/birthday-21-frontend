import type { Metadata, Viewport } from "next";
import "./globals.css";
import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider, Paper, mantineHtmlProps } from '@mantine/core';

export const metadata: Metadata = {
  title: "21. Geburtstag",
  description: "Manuel, Marco & David",
  applicationName: "21. Geburtstag",
  appleWebApp: {
    capable: true,
    title: "21. Geburtstag",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d1220",
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
