import type { TimelineEntry } from "../../domain/timeline";
import styles from "./timeline.module.css";

export function TimelineItem({ entry }: { entry: TimelineEntry }) {
  return (
    <li className={styles.item}>
      <div className={styles.timeColumn}>
        <time dateTime={entry.start}>{entry.time}</time>
        <span className={styles.dot} aria-hidden="true" />
      </div>
      <div className={styles.entry}>
        {entry.subtitle && <span className="block text-[10px] leading-normal tracking-[1.2px] text-[var(--timeline-muted)] uppercase min-[761px]:tracking-[1.5px]">{entry.subtitle}</span>}
        <h2 className="my-[9px] font-[Georgia,serif] text-[25px] leading-[1.22] font-normal min-[761px]:text-[26px]">{entry.title}</h2>
        {entry.description && <p className="text-[15px] leading-[1.75] whitespace-pre-line text-[var(--timeline-muted)] min-[761px]:text-sm min-[761px]:leading-[1.8]">{entry.description}</p>}
      </div>
    </li>
  );
}
