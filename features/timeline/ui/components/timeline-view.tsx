import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import type { TimelineEntry } from "../../domain/timeline";
import { TimelineHeader } from "./timeline-header";
import { TimelineItem } from "./timeline-item";
import styles from "./timeline.module.css";

export interface TimelineViewProps {
  entries: TimelineEntry[];
  unavailable: boolean;
  invitationHref: string | null;
}

export function TimelineView({ entries, unavailable, invitationHref }: TimelineViewProps) {
  return (
    <div className={styles.root}>
      <a href="#timeline" className={styles.skipLink}>Zum Programm</a>
      <div className="mx-auto max-w-[1320px] px-[23px] min-[761px]:px-8 min-[1001px]:px-16">
        <nav aria-label="Seitennavigation" className="flex items-center justify-between border-b border-[var(--timeline-line)] py-[17px] min-[761px]:py-7">
          {invitationHref ? <Link href={invitationHref} prefetch={false} className="flex min-h-9 items-center gap-2.5 text-sm text-[var(--timeline-muted)] no-underline hover:text-[var(--timeline-gold)] min-[761px]:text-[13px]"><IconArrowLeft size={17} aria-hidden="true" />Zur Einladung</Link> : <span />}
          <span className="font-[Georgia,serif] text-[30px]">21<span className="text-[var(--timeline-gold)]">.</span></span>
        </nav>
        <main id="timeline" className="grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] items-start gap-x-[70px] min-[761px]:grid min-[1500px]:gap-x-[110px]">
          <TimelineHeader />
          <section aria-label="Ablauf des Abends" className="mt-[15px] min-w-0 min-[761px]:mt-[74px]">
            {unavailable ? <p role="status" className={styles.message}>Das Programm ist gerade nicht verfügbar. Bitte versuche es später noch einmal.</p>
              : entries.length ? <ol className="m-0 list-none p-0">{entries.map(entry => <TimelineItem key={entry.id} entry={entry} />)}</ol>
                : <p role="status" className={styles.message}>Das Programm folgt in Kürze.</p>}
          </section>
          <footer className="col-span-2 mt-9 border-t border-[var(--timeline-line)] pt-[29px] pb-[45px] text-center min-[761px]:mt-[65px] min-[761px]:pt-[37px]">
            <span className="text-xs text-[var(--timeline-muted)]">Wir freuen uns auf euch.</span>
            <p className="mt-3 font-[Georgia,serif] text-[23px] text-[var(--timeline-gold)] italic">Manuel, Marco &amp; David</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
