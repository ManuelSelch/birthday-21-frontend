"use client";

import type { ReactNode } from "react";
import { ActionIcon, Button, MantineProvider, SegmentedControl, Select, TextInput, Tooltip } from "@mantine/core";
import { IconPlus, IconRefresh, IconScan, IconSearch, IconTimeline } from "@tabler/icons-react";
import type { Guest } from "../../domain/guest";
import { HOSTS } from "../../domain/assignments";
import { UNASSIGNED, type GuestFilter } from "../../domain/guest-list";
import { GuestTable } from "./guest-table";
import { GuestVideoTable } from "./guest-video-table";
import type { VideoFilter } from "../../domain/guest-videos";
import styles from "./guest-list.module.css";

type Props = {
  view: string; onViewChange: (view: string) => void;
  videoFilter: VideoFilter; onVideoFilterChange: (filter: VideoFilter) => void;
  videoCount: number; videoPending: boolean; videoError: string; onToggleVideo: (guest: Guest) => void;
  guests: Guest[]; summary: { total: number; accepted: number; withCompanions: number; checkedIn: number };
  search: string; filter: GuestFilter; group: string; host: string; availableGroups: string[];
  onSearchChange: (value: string) => void; onFilterChange: (value: GuestFilter) => void;
  onGroupChange: (value: string) => void; onHostChange: (value: string) => void;
  onCreate: () => void; onEdit: (guest: Guest) => void; onRefresh: () => void;
  editor: ReactNode; logout: ReactNode; notice: string; refreshing: boolean;
};

export function GuestListView(props: Props) {
  return <MantineProvider forceColorScheme="dark">
    <div className={styles.screen}>
      <header className={styles.topbar}><span className={styles.brand}>21. Geburtstag</span>
        <div className={styles.headerActions}>
          <Tooltip label="Seite neu laden">
            <ActionIcon variant="subtle" color="gray" size={36} aria-label="Seite neu laden" onClick={props.onRefresh}>
              <IconRefresh size={18} />
            </ActionIcon>
          </Tooltip>
          <Button component="a" href="/admin/scanner" variant="subtle" leftSection={<IconScan size={17}/>}>Scanner</Button>
          <Button component="a" href="/timeline" variant="subtle" leftSection={<IconTimeline size={17} aria-hidden="true" />}>Timeline</Button>
          {props.logout}</div></header>
      <main className={styles.main}>
        <div className={styles.heading}><div><h1>Gäste</h1><p className={styles.summary} aria-label="Übersicht">
          <span aria-label={"Gäste: " + props.summary.total}>{props.summary.total} Gäste</span><span aria-hidden="true"> · </span>
          <span aria-label={"Zusagen: " + props.summary.accepted}>{props.summary.accepted} Zusagen</span><span aria-hidden="true"> · </span>
          <span aria-label={"Eingecheckt: " + props.summary.checkedIn}>{props.summary.checkedIn} eingecheckt</span>
          <span className={styles.srOnly} aria-label={"Mit Begleitung: " + props.summary.withCompanions}>Mit Begleitung: {props.summary.withCompanions}</span>
        </p></div><Button leftSection={<IconPlus size={17}/>} onClick={props.onCreate} disabled={props.refreshing}>Gast</Button></div>
        <SegmentedControl className={styles.viewTabs} fullWidth size="md" value={props.view} onChange={props.onViewChange}
          aria-label="Ansicht" data={[{ value: "guests", label: "Übersicht" }, { value: "videos", label: "Videos" }]}/>
        <section className={styles.toolbar} aria-label="Gäste filtern">
          <TextInput aria-label="Gäste suchen" size="md" leftSection={<IconSearch size={18}/>} placeholder="Namen suchen"
            value={props.search} onChange={event => props.onSearchChange(event.currentTarget.value)}/>
          <div className={styles.filterPair}>
            <Select aria-label="Gruppe filtern" size="md" placeholder="Alle Gruppen" clearable
              data={[...props.availableGroups.map(value => ({ value, label: value })), { value: UNASSIGNED, label: "—" }]}
              value={props.group || null} onChange={value => props.onGroupChange(value ?? "")}/>
            <Select aria-label="Hosts filtern" size="md" placeholder="Alle Hosts" clearable
              data={[...HOSTS.map(value => ({ value, label: value })), { value: UNASSIGNED, label: "—" }]}
              value={props.host || null} onChange={value => props.onHostChange(value ?? "")}/>
          </div>
          {props.view === "videos" ? <SegmentedControl className={styles.videoFilters} fullWidth
            value={props.videoFilter} onChange={value => props.onVideoFilterChange(value as VideoFilter)}
            aria-label="Video-Status" data={[{ value: "all", label: "Alle" },
              { value: "missing", label: "Fehlt · " + (props.summary.total - props.videoCount) },
              { value: "available", label: "Vorhanden · " + props.videoCount }]}/>
            : <div className={styles.filters}>{([["all", "Alle"], ["accepted", "Zugesagt"], ["unanswered", "Offen"], ["declined", "Abgesagt"]] as const).map(([value, label]) =>
            <button type="button" key={value} aria-pressed={props.filter === value} onClick={() => props.onFilterChange(value)}>{label}</button>)}</div>}
        </section>
        <section className={styles.guestPanel} aria-label="Gäste verwalten" aria-busy={props.refreshing}>
          {props.view === "videos" ? <GuestVideoTable guests={props.guests} pending={props.videoPending || props.refreshing} onToggle={props.onToggleVideo}/>
            : <GuestTable guests={props.guests} onEdit={props.onEdit}/>}
          {props.videoError && props.view === "videos" && <p className={styles.error} role="alert">{props.videoError}</p>}
        </section>
        <p className={styles.notice} role="status">{props.notice}</p>
      </main>
    </div>
    {props.editor}
  </MantineProvider>;
}
