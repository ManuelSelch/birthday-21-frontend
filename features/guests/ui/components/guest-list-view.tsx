"use client";

import type { ReactNode } from "react";
import { Button, TextInput } from "@mantine/core";
import { IconScan, IconSearch } from "@tabler/icons-react";
import type { Guest } from "../../domain/guest";
import type { GuestFilter } from "../../domain/guest-list";
import { GuestSummary } from "./guest-summary";
import { GuestTable } from "./guest-table";
import styles from "./guest-list.module.css";

type Props = {
  guests: Guest[];
  summary: { total: number; accepted: number; withCompanions: number; checkedIn: number };
  search: string;
  filter: GuestFilter;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: GuestFilter) => void;
  form: ReactNode;
  logout: ReactNode;
};

export function GuestListView({ guests, summary, search, filter, onSearchChange, onFilterChange, form, logout }: Props) {
  return (
    <div className={styles.screen}>
      <header className={styles.topbar}>
        <span className={styles.brand}>21. Geburtstag</span>
        <div className={styles.headerActions}><span className={styles.eyebrow}>ADMIN</span>{logout}</div>
      </header>
      <main className={styles.main}>
        <div className={styles.heading}>
          <div><p className={styles.eyebrow}>ALLES IM BLICK</p><h1>Gästeliste</h1></div>
          <Button component="a" href="/admin/scanner" variant="outline" leftSection={<IconScan size={17} />}>Scanner</Button>
        </div>
        <GuestSummary summary={summary} />
        <section className={styles.guestPanel} aria-label="Gäste verwalten">
          {form}
          <div className={styles.toolbar}>
            <div className={styles.filters} aria-label="Gäste filtern">
              {([["all", "Alle"], ["accepted", "Zusagen"], ["unanswered", "Offen"]] as const).map(([value, label]) => (
                <button type="button" key={value} aria-pressed={filter === value} onClick={() => onFilterChange(value)}>{label}</button>
              ))}
            </div>
            <TextInput aria-label="Gäste suchen" leftSection={<IconSearch size={16} />} placeholder="Gäste suchen"
              radius="xs" value={search} onChange={event => onSearchChange(event.currentTarget.value)} />
          </div>
          <GuestTable guests={guests} total={summary.total} />
        </section>
        <nav className={styles.secondaryLinks} aria-label="Weitere Verwaltung"><a href="/admin/orders">Bestellungen</a></nav>
      </main>
    </div>
  );
}
