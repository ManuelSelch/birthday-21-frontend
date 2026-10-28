"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Stack } from "@mantine/core";
import GuestsTable from "@/components/guests/guests-table";
import { useAddGuest } from "../../app/use-add-guest";
import type { Guest } from "../../domain/guest";
import { AddGuestForm } from "../components/add-guest-form";

export function GuestManagement({ guests }: { guests: Guest[] }) {
  const router = useRouter();
  const [tableVersion, setTableVersion] = useState(0);
  const [refreshing, startRefresh] = useTransition();
  const form = useAddGuest(() => {
    setTableVersion(version => version + 1);
    startRefresh(() => router.refresh());
  });

  return (
    <Stack gap={0}>
      <AddGuestForm name={form.name} pending={form.pending || refreshing} error={form.error}
        success={form.success} onNameChange={form.setName} onSubmit={() => { void form.submit(); }} />
      <GuestsTable key={tableVersion} guests={guests} />
    </Stack>
  );
}
