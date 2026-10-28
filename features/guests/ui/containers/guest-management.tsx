"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAddGuest } from "../../app/use-add-guest";
import type { Guest } from "../../domain/guest";
import { filterGuests, guestSummary, type GuestFilter } from "../../domain/guest-list";
import { AddGuestForm } from "../components/add-guest-form";
import { GuestListView } from "../components/guest-list-view";

export function GuestManagement({ guests, logout }: { guests: Guest[]; logout: ReactNode }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<GuestFilter>("all");
  const [refreshing, startRefresh] = useTransition();
  const form = useAddGuest(() => {
    setSearch("");
    setFilter("all");
    startRefresh(() => router.refresh());
  });

  return (
    <GuestListView guests={filterGuests(guests, search, filter)} summary={guestSummary(guests)}
      search={search} filter={filter} onSearchChange={setSearch} onFilterChange={setFilter} logout={logout}
      form={<AddGuestForm name={form.name} pending={form.pending || refreshing} error={form.error}
        success={form.success} onNameChange={form.setName} onSubmit={() => { void form.submit(); }} />} />
  );
}
