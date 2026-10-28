"use client";

import { Button, Drawer, TextInput } from "@mantine/core";
import { IconCheck, IconCopy, IconExternalLink } from "@tabler/icons-react";
import type { Guest } from "../../domain/guest";
import type { Host } from "../../domain/assignments";
import { AssignmentFields } from "./assignment-fields";
import styles from "./guest-list.module.css";

export type GuestEditorProps = {
  editor: Guest | "new" | null; name: string; groups: string[]; hosts: Host[]; groupName: string;
  availableGroups: string[]; pending: boolean; error: string; link: string; copyMessage: string;
  onNameChange: (name: string) => void; onGroupsChange: (groups: string[]) => void; onHostsChange: (hosts: Host[]) => void;
  onGroupNameChange: (name: string) => void; onAddGroup: () => void; onClose: () => void;
  onSubmit: () => void; onCopy: () => void;
};

export function GuestEditor(props: GuestEditorProps) {
  const existing = props.editor && props.editor !== "new" ? props.editor : null;
  return <Drawer opened={props.editor !== null} onClose={props.onClose} position="bottom" size="auto"
    title={existing ? existing.name : "Gast hinzufügen"} closeOnClickOutside={!props.pending} closeOnEscape={!props.pending}
    withCloseButton={!props.pending} classNames={{ content: styles.sheet, header: styles.sheetHeader, title: styles.sheetTitle, close: styles.sheetClose, body: styles.sheetBody }}>
    <form className={styles.sheetContent} onSubmit={event => { event.preventDefault(); props.onSubmit(); }}>
      {existing ? <div className={styles.guestUtilities}>
        <span className={existing.checked_in ? styles.checked : styles.muted}>{existing.checked_in && <IconCheck size={14}/>} {existing.checked_in ? "Eingecheckt" : "Nicht eingecheckt"}</span>
        <Button type="button" variant="default" size="md" leftSection={<IconCopy size={17}/>} onClick={props.onCopy}>Einladungslink kopieren</Button>
        <Button component="a" href={props.link} variant="subtle" leftSection={<IconExternalLink size={16}/>}>Einladung öffnen</Button>
        {props.copyMessage && <p className={styles.hint} role="status">{props.copyMessage}</p>}
      </div> : <TextInput label="Name" placeholder="Vor- und Nachname" data-autofocus size="md" maxLength={100}
        disabled={props.pending} value={props.name} onChange={event => props.onNameChange(event.currentTarget.value)}/>}
      <AssignmentFields groups={props.groups} hosts={props.hosts} availableGroups={props.availableGroups}
        groupName={props.groupName} disabled={props.pending} onGroupsChange={props.onGroupsChange}
        onHostsChange={props.onHostsChange} onGroupNameChange={props.onGroupNameChange} onAddGroup={props.onAddGroup}/>
      {props.error && <p className={styles.error} role="alert">{props.error}</p>}
      <Button type="submit" size="md" fullWidth disabled={props.pending} loading={props.pending}>{existing ? "Speichern" : "Gast hinzufügen"}</Button>
    </form>
  </Drawer>;
}
