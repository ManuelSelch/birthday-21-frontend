import { IconCalendarEvent, IconMapPin } from "@tabler/icons-react";
import { invitationEvent } from "../../domain/invitation";
import styles from "./invitation.module.css";

export function EventDetails() {
  return (
    <dl className={styles.details} aria-label="Veranstaltungsdetails">
      <div>
        <IconCalendarEvent size={19} aria-hidden="true" />
        <div><dt>WANN</dt><dd>{invitationEvent.date}</dd></div>
      </div>
      <div>
        <IconMapPin size={19} aria-hidden="true" />
        <div><dt>WO</dt><dd>{invitationEvent.location}</dd></div>
      </div>
    </dl>
  );
}
