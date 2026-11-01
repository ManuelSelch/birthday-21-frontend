import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/admin",
    name: "21. Geburtstag",
    short_name: "Geburtstag",
    description: "Gästeliste und Ticket-Scanner für den 21. Geburtstag",
    lang: "de",
    start_url: "/admin/guests",
    scope: "/admin/",
    display: "standalone",
    background_color: "#1a1919",
    theme_color: "#1a1919",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
