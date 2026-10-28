"use client";

import { useEffect, useState } from "react";
import { submitAuthentication } from "../infra/browser";
import { safeAdminDestination } from "../domain/rules";

export function useLogin(returnTo: string) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [limitedUntil, setLimitedUntil] = useState(0);

  useEffect(() => {
    if (!limitedUntil) return;
    const timer = setTimeout(() => setLimitedUntil(0), Math.max(0, limitedUntil - Date.now()));
    return () => clearTimeout(timer);
  }, [limitedUntil]);

  async function login(): Promise<string | undefined> {
    if (loading) return;
    if (Date.now() < limitedUntil) {
      setError("Zu viele Versuche. Bitte versuche es später erneut.");
      return;
    }
    setLoading(true);
    setError(undefined);
    try {
      const response = await submitAuthentication("login", { password, returnTo });
      setPassword("");
      if (response.ok) return safeAdminDestination(response.redirectTo);
      if (response.status === 429) {
        const seconds = response.retryAfter ?? 900;
        setLimitedUntil(Date.now() + seconds * 1000);
        setError(`Zu viele Versuche. Bitte versuche es in ${Math.ceil(seconds / 60)} Minuten erneut.`);
      } else if (response.status === 503) {
        setError("Anmeldung derzeit nicht verfügbar.");
      } else {
        setError("Anmeldung fehlgeschlagen. Bitte versuche es erneut.");
      }
    } catch {
      setPassword("");
      setError("Anmeldung derzeit nicht verfügbar. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  }

  return { password, setPassword, loading, error, limited: limitedUntil !== 0, login };
}
