"use client";

import { useRef, useState } from "react";
import { Scanner, type IDetectedBarcode } from "@yudiel/react-qr-scanner";
import api from "@/lib/api";
import { scanFeedback, type ScanFeedback } from "../../domain/scan-feedback";
import { ScannerView } from "../components/scanner-view";
import styles from "../components/scanner.module.css";

export function TicketScanner() {
  const [feedback, setFeedback] = useState<ScanFeedback>();
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const checking = useRef(false);

  async function handleScan(codes: IDetectedBarcode[]) {
    if (checking.current || !codes[0]?.rawValue) return;
    checking.current = true;
    let id: string | null;
    try {
      id = new URL(codes[0].rawValue).searchParams.get("id");
    } catch {
      setFeedback(scanFeedback({ success: false, error: "ticket is invalid" }));
      return;
    }
    if (!id) {
      setFeedback(scanFeedback({ success: false, error: "no ticket id provided" }));
      return;
    }

    setLoading(true);
    try {
      setFeedback(scanFeedback(await api.checkIn(id)));
    } finally {
      setLoading(false);
    }
  }

  return <ScannerView
    loading={loading}
    cameraError={cameraError}
    feedback={feedback}
    onScanNext={() => {
      setFeedback(undefined);
      setCameraError(false);
      checking.current = false;
    }}
    camera={<>
      <Scanner paused={loading} onScan={handleScan} onError={() => setCameraError(true)} components={{ finder: false }} />
      <div className={styles.frame} aria-hidden="true" />
    </>}
  />;
}
