"use client";

import { useLogout } from "../../app/use-logout";
import { LogoutButton } from "../components/logout-button";
import { setEnabled } from "@/features/agentation/app/preference";

export function LogoutContainer() {
  const state = useLogout();

  async function logout() {
    if (await state.logout()) {
      setEnabled(false);
      window.location.replace("/admin/login");
    }
  }

  return <LogoutButton loading={state.loading} error={state.error} onLogout={logout} />;
}
