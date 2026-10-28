"use client";

import { useState } from "react";
import { submitAuthentication } from "../infra/browser";
import { safeAdminDestination } from "../domain/rules";

export function useLogin(returnTo: string) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  async function login(): Promise<string | undefined> {
    if (loading) return;
    setLoading(true);
    setError(undefined);
    try {
      const response = await submitAuthentication("login", { password, returnTo });
      if (response.ok) return safeAdminDestination(response.redirectTo);
      setError(response.status === 503
        ? "Anmeldung derzeit nicht verfügbar."
        : "Anmeldung fehlgeschlagen. Bitte versuche es erneut.");
    } catch {
      setError("Anmeldung derzeit nicht verfügbar. Bitte versuche es erneut.");
    } finally {
      setPassword("");
      setLoading(false);
    }
  }

  return { password, setPassword, loading, error, login };
}
