"use client";

import { useSyncExternalStore } from "react";
import { ActionIcon } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import { enabled, setEnabled, subscribe } from "../app/preference";

const initiallyOff = () => false;

export function AgentationToggle() {
  const active = useSyncExternalStore(subscribe, enabled, initiallyOff);
  return <ActionIcon variant={active ? "light" : "subtle"} color={active ? "yellow" : "gray"} size={36}
    aria-label="Agentation" aria-pressed={active} onClick={() => setEnabled(!active)}>
    <IconPencil size={18} aria-hidden="true" />
  </ActionIcon>;
}
