"use client";

import { useLogout } from "../../app/use-logout";
import { LogoutButton } from "../components/logout-button";

export function LogoutContainer() {
  const state = useLogout();

  async function logout() {
    if (await state.logout()) window.location.replace("/admin/login");
  }

  return <LogoutButton loading={state.loading} error={state.error} onLogout={logout} />;
}
