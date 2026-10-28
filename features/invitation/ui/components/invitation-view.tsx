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
        </div>
      </div>
    </main>
  );
}
