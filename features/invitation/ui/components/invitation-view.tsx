import Link from "next/link";
import { IconArrowUpRight } from "@tabler/icons-react";
import { EventDetails } from "./event-details";
import { GuestResponse, type GuestResponseProps } from "./guest-response";
import { InvitationHero } from "./invitation-hero";
import { InvitationHosts } from "./invitation-hosts";
import styles from "./invitation.module.css";

export function InvitationView(props: GuestResponseProps) {
  return (
    <main className={styles.invitation}>
      <div className={styles.layout}>
        <InvitationHero />
        <InvitationHosts />
        <div className={styles.content}>
          <div>
            <EventDetails />
            <iframe
              title="Karte: Reichshof Bayreuth"
              src="https://maps.google.com/maps?q=Reichshof%2C%20Maximilianstra%C3%9Fe%2028%2C%2095444%20Bayreuth&output=embed"
              className="mt-5 block h-64 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer"
              allowFullScreen
            />
            <Link href={props.links.timeline} className={styles.programmeLink}>Programm ansehen <IconArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
          <GuestResponse {...props} />
        </div>
      </div>
    </main>
  );
}
