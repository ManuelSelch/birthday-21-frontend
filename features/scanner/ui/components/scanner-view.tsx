"use client";

import type { ReactNode } from "react";
import { Button, Loader } from "@mantine/core";
import { IconArrowRight, IconCameraOff, IconPlayerPause, IconUsers } from "@tabler/icons-react";
import type { ScanFeedback } from "../../domain/scan-feedback";
import { ScannerResult } from "./scanner-result";
import styles from "./scanner.module.css";

type Props = {
  camera: ReactNode;
  cameraError: boolean;
  loading: boolean;
  feedback?: ScanFeedback;
  onScanNext: () => void;
};

export function ScannerView({ camera, cameraError, loading, feedback, onScanNext }: Props) {
  const paused = !loading && Boolean(feedback);

  return (
    <div className={styles.screen}>
      <header className={styles.topbar}>
        <span className={styles.brand}>21. Geburtstag</span>
        <span className={styles.eyebrow}>ADMIN</span>
      </header>
      <main className={styles.main}>
        <div className={styles.heading}>
          <h1>Ticket-Scanner</h1>
          <Button component="a" href="/admin/guests" variant="outline" radius="xs" leftSection={<IconUsers size={17} />}>Gästeliste</Button>
        </div>
        <section className={styles.panel} aria-label="Ticket scannen">
          <div className={styles.camera}>
            {paused ? (
              <div className={styles.placeholder}><IconPlayerPause size={36} stroke={1.2} /><span>Scanner pausiert</span></div>
            ) : cameraError ? (
              <div className={styles.placeholder}><IconCameraOff size={36} stroke={1.2} /><span>Kamera nicht verfügbar</span></div>
            ) : camera}
          </div>
          <div className={styles.status} role="status">
            {loading ? <><Loader size={18} color="var(--gold)" /><span>Ticket wird geprüft …</span></> : (
              <><span className={paused ? styles.paused : cameraError ? styles.offline : styles.dot} /><span>{paused ? "Bereit für den nächsten Gast?" : cameraError ? "Bitte Kamerazugriff im Browser erlauben." : "Bereit zum Scannen"}</span></>
            )}
          </div>
        </section>
        {paused && feedback && <>
          <ScannerResult feedback={feedback} />
          <div className={styles.nextAction}>
            <Button fullWidth size="md" radius="xs" rightSection={<IconArrowRight size={18} />} onClick={onScanNext}>Nächsten Gast scannen</Button>
            <p>Erst dann werden wieder Tickets gelesen.</p>
          </div>
        </>}
      </main>
    </div>
  );
}
