import { invitationEvent } from "../../domain/invitation";
import styles from "./invitation.module.css";

export function InvitationHero() {
  return (
    <header className={styles.hero}>
      <span className={styles.edition}>{invitationEvent.year}</span>
      <div className={styles.heroTitle}>
        <h1>{invitationEvent.title}</h1>
        <p className={styles.hosts}>{invitationEvent.hosts}</p>
      </div>
    </header>
  );
}
