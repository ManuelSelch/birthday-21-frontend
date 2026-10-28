"use client";

import { useLogin } from "../../app/use-login";
import { LoginForm } from "../components/login-form";

export function LoginContainer({ returnTo }: { returnTo: string }) {
  const state = useLogin(returnTo);

  async function submit() {
    const destination = await state.login();
    if (destination) window.location.replace(destination);
  }

  return <LoginForm {...state} onPassword={state.setPassword} onSubmit={submit} />;
}
