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
            <Link href={props.links.timeline} className={styles.programmeLink}>Programm ansehen <IconArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
          <GuestResponse {...props} />
        </div>
      </div>
    </main>
  );
}
