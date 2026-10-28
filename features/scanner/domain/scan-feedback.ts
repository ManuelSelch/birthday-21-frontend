export type CheckInResult = { success: boolean; warning?: string; error?: string };
export type ScanFeedback = { tone: "success" | "warning" | "error"; title: string; message: string };

const messages: Record<string, string> = {
  "guest is already checked in": "Dieser Gast wurde bereits eingecheckt.",
  "guest has not accepted invitation": "Dieser Gast hat die Einladung noch nicht angenommen.",
  "ticket is invalid": "Dieses Ticket ist ungültig.",
  "no ticket id provided": "Die Einladung enthält keine Ticket-ID.",
  "server error": "Das Ticket konnte nicht geprüft werden. Bitte erneut versuchen.",
};

export function scanFeedback(result: CheckInResult): ScanFeedback {
  if (result.success) return { tone: "success", title: "Ticket gültig", message: "Check-in erfolgreich." };
  const detail = result.warning ?? result.error;
  return {
    tone: result.warning ? "warning" : "error",
    title: result.warning === "guest is already checked in" ? "Bereits eingecheckt" : result.warning ? "Check-in nicht möglich" : "Ticket nicht gültig",
    message: detail ? messages[detail] ?? detail : "Das Ticket konnte nicht geprüft werden. Bitte erneut versuchen.",
  };
}
