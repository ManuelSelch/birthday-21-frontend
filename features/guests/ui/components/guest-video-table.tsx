"use client";

import { Switch } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import type { Guest } from "../../domain/guest";
import styles from "./guest-list.module.css";

export function GuestVideoTable({ guests, pending, onToggle }: {
  guests: Guest[]; pending: boolean; onToggle: (guest: Guest) => void;
}) {
  return <>
    <table className={styles.videoTable}>
      <thead><tr><th scope="col">Gast</th><th scope="col">Video vorhanden</th></tr></thead>
      <tbody>{guests.map(guest => <tr key={guest._id}>
        <td><strong>{guest.name}</strong><p>{[guest.groups.join(", "), guest.hosts.join(", ")].filter(Boolean).join(" · ") || "—"}</p></td>
        <td><Switch role="switch" size="md" checked={guest.video} disabled={pending}
          aria-label={"Video zu " + guest.name + " vorhanden"} onChange={() => onToggle(guest)}
          thumbIcon={guest.video ? <IconCheck size={12} color="#0d1220"/> : null}/></td>
      </tr>)}</tbody>
    </table>
    {!guests.length && <p className={styles.empty}>Keine Gäste gefunden.</p>}
  </>;
}
