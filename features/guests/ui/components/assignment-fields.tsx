"use client";

import { ActionIcon, Button, MultiSelect, TextInput } from "@mantine/core";
import { IconCheck, IconPlus } from "@tabler/icons-react";
import { HOSTS, type Host } from "../../domain/assignments";
import styles from "./guest-list.module.css";

export function AssignmentFields(props: {
  groups: string[]; hosts: Host[]; availableGroups: string[]; groupName: string; disabled: boolean;
  onGroupsChange: (groups: string[]) => void; onHostsChange: (hosts: Host[]) => void;
  onGroupNameChange: (name: string) => void; onAddGroup: () => void;
}) {
  return <>
    <MultiSelect label="Gruppen" placeholder="Gruppen auswählen" data={props.availableGroups}
      value={props.groups} onChange={props.onGroupsChange} disabled={props.disabled} size="md" clearable searchable maxValues={50}/>
    <div className={styles.newGroup}>
      <TextInput aria-label="Neue Gruppe" placeholder="Neue Gruppe" maxLength={40} value={props.groupName}
        disabled={props.disabled} onChange={event => props.onGroupNameChange(event.currentTarget.value)}
        onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); props.onAddGroup(); } }}/>
      <ActionIcon type="button" size={36} variant="light" disabled={props.disabled || !props.groupName.trim() || props.groups.length >= 50}
        aria-label="Gruppe erstellen und auswählen" onClick={props.onAddGroup}><IconPlus size={18}/></ActionIcon>
    </div>
    <div><span className={styles.fieldLabel} id="guest-hosts-label">Hosts</span><div className={styles.hostOptions} role="group" aria-labelledby="guest-hosts-label">
      {HOSTS.map(host => <Button type="button" key={host} disabled={props.disabled} variant={props.hosts.includes(host) ? "filled" : "default"}
        aria-pressed={props.hosts.includes(host)} leftSection={props.hosts.includes(host) ? <IconCheck size={15}/> : undefined}
        onClick={() => props.onHostsChange(props.hosts.includes(host) ? props.hosts.filter(value => value !== host) : [...props.hosts, host])}>{host}</Button>)}
    </div></div>
  </>;
}
