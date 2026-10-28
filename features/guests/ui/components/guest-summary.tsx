import styles from "./guest-list.module.css";

export function GuestSummary({ summary }: {
  summary: { total: number; accepted: number; withCompanions: number; checkedIn: number };
}) {
  return (
    <section className={styles.summary} aria-label="Übersicht">
      {([
        ["Gäste", summary.total], ["Zusagen", summary.accepted],
        ["Mit Begleitung", summary.withCompanions], ["Eingecheckt", summary.checkedIn],
      ] as const).map(([label, value]) => (
        <div key={label} aria-label={label + ": " + value}><span>{label}</span><strong>{value}</strong></div>
      ))}
    </section>
  );
}
