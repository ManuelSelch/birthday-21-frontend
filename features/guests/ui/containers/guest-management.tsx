"use client";

import { useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useGuestManagement } from "../../app/use-guest-management";
import type { Guest } from "../../domain/guest";
import { GuestEditor } from "../components/guest-editor";
import { GuestListView } from "../components/guest-list-view";

export function GuestManagement({ guests, logout }: { guests: Guest[]; logout: ReactNode }) {
  const router = useRouter();
  const [refreshing, startRefresh] = useTransition();
  const state = useGuestManagement(guests, () => startRefresh(() => router.refresh()));

  return <GuestListView guests={state.guests} summary={state.summary} search={state.search} filter={state.filter}
    group={state.group} host={state.host} availableGroups={state.availableGroups} onSearchChange={state.setSearch}
    onFilterChange={state.setFilter} onGroupChange={state.setGroup} onHostChange={state.setHost}
    onCreate={() => state.open("new")} onEdit={state.open} onRefresh={() => window.location.reload()}
    logout={logout} notice={state.notice} refreshing={refreshing}
    editor={<GuestEditor editor={state.editor} name={state.name} groups={state.groups} hosts={state.hosts}
      groupName={state.groupName} availableGroups={state.availableGroups} pending={state.pending}
      error={state.error} link={state.link} copyMessage={state.copyMessage} onNameChange={state.setName}
      onGroupsChange={state.setGroups} onHostsChange={state.setHosts} onGroupNameChange={state.setGroupName}
      onAddGroup={state.addGroup} onClose={state.close} onSubmit={() => { void state.submit(); }} onCopy={() => { void state.copy(); }}/>}
  />;
}
