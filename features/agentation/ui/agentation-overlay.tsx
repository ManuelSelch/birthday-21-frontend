"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { enabled, subscribe } from "../app/preference";

const Toolbar = dynamic(() => import("agentation").then(module => module.Agentation), { ssr: false });
const initiallyOff = () => false;

function AuthorizedOverlay() {
  const [authorized, setAuthorized] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/admin/session", { cache: "no-store", signal: controller.signal })
      .then(response => { if (!controller.signal.aborted) setAuthorized(response.ok); })
      .catch(() => { if (!controller.signal.aborted) setAuthorized(false); });
    return () => controller.abort();
  }, []);
  return authorized ? <Toolbar /> : null;
}

export function AgentationOverlay() {
  const active = useSyncExternalStore(subscribe, enabled, initiallyOff);
  const pathname = usePathname();
  return active ? <AuthorizedOverlay key={pathname} /> : null;
}
