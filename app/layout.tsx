import type { Metadata } from "next";
import "./globals.css";
import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider, Paper, mantineHtmlProps } from '@mantine/core';
import InvitationHero from "@/components/invitation/invitation-hero";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "20. Geburtstag",
  description: "Manuel, Marco & David",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
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
