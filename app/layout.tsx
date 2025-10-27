import type { Metadata } from "next";
import "./globals.css";
import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import InvitationHero from "@/components/invitation/invitation-hero";

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
          <div className="min-h-screen bg-linear-to-b from-black to-gray-900 text-white flex flex-col items-center justify-center p-6">
            <InvitationHero />

            <div className="relative z-10 flex flex-col grow">
              {children}
            </div>
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}
