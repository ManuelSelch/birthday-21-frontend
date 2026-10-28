"use client";

import type { ReactNode } from "react";
import { Button, MantineProvider, Select, TextInput } from "@mantine/core";
import { IconPlus, IconScan, IconSearch } from "@tabler/icons-react";
import type { Guest } from "../../domain/guest";
import { HOSTS } from "../../domain/assignments";
import { UNASSIGNED, type GuestFilter } from "../../domain/guest-list";
import { GuestTable } from "./guest-table";
import styles from "./guest-list.module.css";

type Props = {
  guests: Guest[]; summary: { total: number; accepted: number; withCompanions: number; checkedIn: number };
  search: string; filter: GuestFilter; group: string; host: string; availableGroups: string[];
  onSearchChange: (value: string) => void; onFilterChange: (value: GuestFilter) => void;
  onGroupChange: (value: string) => void; onHostChange: (value: string) => void;
  onCreate: () => void; onEdit: (guest: Guest) => void;
  editor: ReactNode; logout: ReactNode; notice: string; refreshing: boolean;
};

export function GuestListView(props: Props) {
  return <MantineProvider forceColorScheme="dark">
    <div className={styles.screen}>
      <header className={styles.topbar}><span className={styles.brand}>21. Geburtstag</span>
        <div className={styles.headerActions}><span className={styles.eyebrow}>ADMIN</span>{props.logout}</div></header>
      <main className={styles.main}>
        <div className={styles.heading}><div><h1>Gäste</h1><p className={styles.summary} aria-label="Übersicht">
          <span aria-label={"Gäste: " + props.summary.total}>{props.summary.total} Gäste</span><span aria-hidden="true"> · </span>
          <span aria-label={"Zusagen: " + props.summary.accepted}>{props.summary.accepted} Zusagen</span><span aria-hidden="true"> · </span>
          <span aria-label={"Eingecheckt: " + props.summary.checkedIn}>{props.summary.checkedIn} eingecheckt</span>
          <span className={styles.srOnly} aria-label={"Mit Begleitung: " + props.summary.withCompanions}>Mit Begleitung: {props.summary.withCompanions}</span>
        </p></div><Button leftSection={<IconPlus size={17}/>} onClick={props.onCreate} disabled={props.refreshing}>Gast</Button></div>
        <section className={styles.toolbar} aria-label="Gäste filtern">
          <TextInput aria-label="Gäste suchen" size="md" leftSection={<IconSearch size={18}/>} placeholder="Namen suchen"
            value={props.search} onChange={event => props.onSearchChange(event.currentTarget.value)}/>
          <div className={styles.filterPair}>
            <Select aria-label="Gruppe filtern" size="md" placeholder="Alle Gruppen" clearable
              data={[...props.availableGroups.map(value => ({ value, label: value })), { value: UNASSIGNED, label: "Ohne Gruppe" }]}
              value={props.group || null} onChange={value => props.onGroupChange(value ?? "")}/>
            <Select aria-label="Hosts filtern" size="md" placeholder="Alle Hosts" clearable
              data={[...HOSTS.map(value => ({ value, label: value })), { value: UNASSIGNED, label: "Ohne Hosts" }]}
              value={props.host || null} onChange={value => props.onHostChange(value ?? "")}/>
          </div>
          <div className={styles.filters}>{([["all", "Alle"], ["accepted", "Zugesagt"], ["unanswered", "Offen"], ["declined", "Abgesagt"]] as const).map(([value, label]) =>
            <button type="button" key={value} aria-pressed={props.filter === value} onClick={() => props.onFilterChange(value)}>{label}</button>)}</div>
        </section>
        <section className={styles.guestPanel} aria-label="Gäste verwalten" aria-busy={props.refreshing}>
          <GuestTable guests={props.guests} total={props.summary.total} onEdit={props.onEdit}/>
        </section>
        <p className={styles.notice} role="status">{props.notice}</p>
        <nav className={styles.secondaryLinks} aria-label="Weitere Verwaltung">
          <Button component="a" href="/admin/scanner" variant="subtle" leftSection={<IconScan size={17}/>}>Scanner</Button>
          <a href="/admin/orders">Bestellungen</a>
        </nav>
      </main>
    </div>
    {props.editor}
  </MantineProvider>;
}
