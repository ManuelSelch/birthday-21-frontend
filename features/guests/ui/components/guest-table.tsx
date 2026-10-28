"use client";

import { Badge } from "@mantine/core";
import type { Guest } from "../../domain/guest";
import styles from "./guest-list.module.css";

export function GuestTable({ guests, total }: { guests: Guest[]; total: number }) {
  return (
    <>
      <div className={styles.tableScroll} role="region" aria-label="Gästetabelle" tabIndex={0}>
        <table>
          <thead><tr><th scope="col">Name</th><th scope="col">Status</th><th scope="col">Check-in</th></tr></thead>
          <tbody>
            {guests.map(guest => (
              <tr key={guest._id}>
                <td className={styles.guestName}>
                  <a href={`/invite?id=${encodeURIComponent(guest._id)}`} data-invited={guest.invited === true}
                    aria-label={`Einladung für ${guest.name} öffnen`}>{guest.name}</a>
                </td>
                <td><Badge variant="light" color={guest.accepted == null ? "gray" : guest.accepted ? "teal" : "red"}>
                  {guest.accepted == null ? "Offen" : guest.accepted ? "Zugesagt" : "Abgesagt"}
                </Badge></td>
                <td>{guest.checked_in === true
                  ? <span className={styles.checked}>Eingecheckt</span>
                  : <span className={styles.muted}><span aria-hidden="true">—</span><span className={styles.srOnly}>{guest.checked_in === false ? "Nicht eingecheckt" : "Noch nicht erfasst"}</span></span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!guests.length && <p className={styles.empty}>Keine Gäste gefunden.</p>}
      <div className={styles.tableFooter}>{guests.length} von {total} Gästen</div>
    </>
  );
}
