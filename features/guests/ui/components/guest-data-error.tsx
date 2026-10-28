import styles from "./guest-list.module.css";

export function GuestDataError({ invalidIds }: { invalidIds: string[] }) {
  return <div className={styles.screen}><main className={styles.main}>
    <h1>Gästedaten prüfen</h1>
    <div role="alert">
      <p>Die Gästeliste konnte nicht geladen werden, weil Cockpit ungültige Gästedaten liefert.</p>
      <p>Bitte prüfe bei den folgenden Gästen <strong>groups</strong> und <strong>hosts</strong>.
        Beide Felder müssen JSON-Arrays enthalten, zum Beispiel <code>[]</code> oder <code>{JSON.stringify(["Uni"])}</code> für Gruppen
        und <code>{JSON.stringify(["Manuel"])}</code> für Hosts. Erlaubte Hosts: Manuel, Marco, David. Das Feld <strong>video</strong> muss einen Boolean enthalten (true oder false).</p>
      <p>Betroffene Datensätze: {invalidIds.join(", ")}</p>
      <p>Feld-Defaults allein aktualisieren bestehende Gäste nicht. Bitte die Datensätze in Cockpit speichern und diese Seite neu laden.</p>
    </div>
  </main></div>;
}
