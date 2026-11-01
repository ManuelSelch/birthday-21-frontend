import { EventDetails } from "./event-details";
import { GuestResponse, type GuestResponseProps } from "./guest-response";
import { InvitationHero } from "./invitation-hero";
import styles from "./invitation.module.css";

export function InvitationView(props: GuestResponseProps) {
  return (
    <main className={styles.invitation}>
      <div className={styles.layout}>
        <InvitationHero />
        <div className={styles.content}>
          <EventDetails />
          <GuestResponse {...props} />
          <footer className={styles.footer}>WIR FREUEN UNS AUF DICH · MANUEL · MARCO · DAVID</footer>
        </div>
      </div>
    </main>
  );
}
