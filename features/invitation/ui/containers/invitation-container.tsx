"use client";

import { useAttendance } from "../../app/use-attendance";
import { ticketLinks, type InvitationGuest } from "../../domain/invitation";
import { InvitationView } from "../components/invitation-view";

export function InvitationContainer({ guest }: { guest: InvitationGuest }) {
  const attendance = useAttendance(guest);
  return (
    <InvitationView
      name={guest.name}
      links={ticketLinks(guest._id)}
      accepted={attendance.accepted}
      companion={attendance.companion}
      pending={attendance.pending}
      error={attendance.error}
      onAccept={attendance.accept}
      onCancel={attendance.cancel}
      onCompanionChange={attendance.setCompanion}
    />
  );
}
