import styles from "./invitation.module.css";

export function InvitationUnavailable() {
  return (
    <main className={styles.invitation}>
      <section className={styles.unavailable}>
        <h1>Einladung nicht verfügbar</h1>
        <p>Bitte öffne den persönlichen Link auf deiner Einladung.</p>
      </section>
    </main>
  );
}
