"use client";

import { useEffect, useRef, useState } from "react";
import type { InvitationGuest } from "../domain/invitation";
import { submitInvitation, type InvitationAction } from "../infra/browser";

export function useAttendance(guest: InvitationGuest) {
  const [accepted, setAccepted] = useState(guest.accepted);
  const [companion, setCompanion] = useState(guest.companion);
  const [pending, setPending] = useState<InvitationAction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false);
  const viewed = useRef<string | null>(null);

  useEffect(() => {
    if (viewed.current === guest._id) return;
    viewed.current = guest._id;
    void submitInvitation("invited", guest._id);
  }, [guest._id]);

  async function save(action: "accept" | "cancel" | "companion", nextCompanion?: boolean) {
    if (busy.current) return;
    busy.current = true;
    setPending(action);
    setError(null);
    try {
      const success = await submitInvitation(action, guest._id, nextCompanion);
      if (!success) {
        const messages = {
          accept: "Deine Zusage konnte nicht gespeichert werden.",
          cancel: "Deine Absage konnte nicht gespeichert werden.",
          companion: "Deine Begleitung konnte nicht gespeichert werden.",
        };
        setError(`${messages[action]} Bitte versuche es erneut.`);
        return;
      }
      if (action === "companion") setCompanion(nextCompanion === true);
      else setAccepted(action === "accept");
    } finally {
      busy.current = false;
      setPending(null);
    }
  }

  return {
    accepted, companion, pending, error,
    accept: () => save("accept"),
    cancel: () => save("cancel"),
    setCompanion: (next: boolean) => save("companion", next),
  };
}
