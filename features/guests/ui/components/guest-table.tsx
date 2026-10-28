"use client";

import { Badge } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import type { Guest } from "../../domain/guest";
import styles from "./guest-list.module.css";

export function GuestTable({ guests, onEdit }: { guests: Guest[]; onEdit: (guest: Guest) => void }) {
  return <>
    <div className={styles.tableScroll} role="region" aria-label="Gästetabelle" tabIndex={0}>
      <table><thead><tr><th scope="col">Gast</th><th scope="col" className={styles.mobileColumn}>Gruppen / Hosts</th><th scope="col" className={styles.desktopColumn}>Gruppen</th><th scope="col" className={styles.desktopColumn}>Hosts</th><th scope="col" className={styles.rsvpColumn}>Status</th><th scope="col" className={styles.checkinColumn}>Check-in</th></tr></thead>
        <tbody>{guests.map(guest => <tr key={guest._id}>
          <td><button className={styles.guestDetails} data-invited={guest.invited === true} onClick={() => onEdit(guest)}
            aria-label={guest.name + " · Details und Einladungslink"}>
            <strong>{guest.name}</strong>
          </button></td>
          <td className={styles.mobileColumn}><div className={styles.combinedAssignment}><span className={styles.groupLabel}>{guest.groups.join(", ") || "—"}</span><span>{guest.hosts.join(", ") || "—"}</span></div></td>
          <td className={styles.desktopColumn}><span className={styles.groupLabel}>{guest.groups.join(", ") || "—"}</span></td>
          <td className={styles.desktopColumn}>{guest.hosts.join(", ") || "—"}</td>
          <td className={styles.rsvpColumn}>
            <span className={styles.mobileStatus} role="img" data-status={guest.accepted == null ? "unanswered" : guest.accepted ? "accepted" : "declined"}
              aria-label={guest.accepted == null ? "Offen" : guest.accepted ? "Zugesagt" : "Abgesagt"}
              title={guest.accepted == null ? "Offen" : guest.accepted ? "Zugesagt" : "Abgesagt"}/>
            <Badge className={styles.desktopStatus} size="xs" variant="dot" color={guest.accepted == null ? "gray" : guest.accepted ? "teal" : "red"}>{guest.accepted == null ? "Offen" : guest.accepted ? "Zugesagt" : "Abgesagt"}</Badge></td>
          <td className={styles.checkinColumn}><span className={guest.checked_in === true ? styles.checked : styles.muted}>
            <span aria-hidden="true">{guest.checked_in === true ? <IconCheck size={19}/> : "—"}</span>
            <span className={styles.srOnly}>{guest.checked_in === true ? "Eingecheckt" : guest.checked_in === false ? "Nicht eingecheckt" : "Noch nicht erfasst"}</span>
          </span></td>
        </tr>)}</tbody>
      </table>
    </div>
    {!guests.length && <p className={styles.empty}>Keine Gäste gefunden.</p>}
  </>;
}
