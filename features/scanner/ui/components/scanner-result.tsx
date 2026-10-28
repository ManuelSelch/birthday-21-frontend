import { IconAlertTriangle, IconCheck } from "@tabler/icons-react";
import type { ScanFeedback } from "../../domain/scan-feedback";
import styles from "./scanner.module.css";

export function ScannerResult({ feedback }: { feedback: ScanFeedback }) {
  return (
    <div className={`${styles.result} ${styles[feedback.tone]}`} role="status">
      {feedback.tone === "success" ? <IconCheck size={22} /> : <IconAlertTriangle size={22} />}
      <div><strong>{feedback.title}</strong><p>{feedback.message}</p></div>
    </div>
  );
}
