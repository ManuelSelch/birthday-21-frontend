"use client";

import { useRef, useState } from "react";
import { newGuest } from "../domain/new-guest";
import { submitGuest } from "../infra/browser";

export function useAddGuest(onCreated: () => void) {
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const submitting = useRef(false);

  async function submit() {
    if (submitting.current) return;
    setSuccess("");
    const guest = newGuest(name);
    if (!guest) {
      setError("Bitte gib einen Namen mit 1 bis 100 Zeichen ein.");
      return;
    }

    submitting.current = true;
    setPending(true);
    setError("");
    try {
      await submitGuest(guest.name);
      setName("");
      setSuccess("Gast hinzugefügt.");
      onCreated();
    } catch {
      setError("Gast konnte nicht hinzugefügt werden. Bitte versuche es erneut.");
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return { name, setName, pending, error, success, submit };
}
