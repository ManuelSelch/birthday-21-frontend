import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "21. Geburtstag";
const description = "Du bist eingeladen! Alle Infos & deine Zusage findest du hier.";

export const metadata: Metadata = {
  metadataBase: new URL("https://geburtstag.manuelselch.de"),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "de_DE",
    siteName: "21. Geburtstag",
  },
};

export default function InviteLayout({ children }: { children: ReactNode }) {
  return children;
}
