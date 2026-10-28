"use client";

import { Badge, Button } from "@mantine/core";
import { IconArrowUpRight } from "@tabler/icons-react";
import type { Guest } from "../../domain/guest";
import styles from "./guest-list.module.css";

export function GuestTable({ guests, total }: { guests: Guest[]; total: number }) {
  return (
    <>
      <div className={styles.tableScroll} role="region" aria-label="Gästetabelle" tabIndex={0}>
        <table>
          <thead><tr><th scope="col">Name</th><th scope="col">Rückmeldung</th><th scope="col">Check-in</th><th scope="col"><span className={styles.srOnly}>Aktion</span></th></tr></thead>
          <tbody>
            {guests.map(guest => (
              <tr key={guest._id}>
                <td className={styles.guestName}>{guest.name}{guest.companion && <small>+1 Begleitung</small>}</td>
                <td><Badge variant="light" color={guest.accepted == null ? "gray" : guest.accepted ? "teal" : "red"}>
                  {guest.accepted == null ? "Offen" : guest.accepted ? "Zugesagt" : "Abgesagt"}
                </Badge></td>
                <td>{guest.checked_in === true
                  ? <span className={styles.checked}>Eingecheckt</span>
                  : <span className={styles.muted}><span aria-hidden="true">—</span><span className={styles.srOnly}>{guest.checked_in === false ? "Nicht eingecheckt" : "Noch nicht erfasst"}</span></span>}
                </td>
                <td><Button component="a" href={`/invite?id=${encodeURIComponent(guest._id)}`}
                  variant="subtle" size="compact-sm" rightSection={<IconArrowUpRight size={14} />}
                  aria-label={`Einladung für ${guest.name} öffnen`}>Einladung</Button></td>
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
