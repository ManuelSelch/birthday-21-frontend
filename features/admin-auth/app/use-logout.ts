"use client";

import { useState } from "react";
import { submitAuthentication } from "../infra/browser";

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  async function logout() {
    if (loading) return false;
    setLoading(true);
    setError(undefined);
    try {
      const response = await submitAuthentication("logout");
      if (response.ok) return true;
    } catch {
      // Keep the admin page visible so the user can retry.
    }
    setError("Abmelden fehlgeschlagen. Bitte versuche es erneut.");
    setLoading(false);
    return false;
  }

  return { loading, error, logout };
}
