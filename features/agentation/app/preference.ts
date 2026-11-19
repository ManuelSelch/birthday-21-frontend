const KEY = "birthday-agentation-enabled";
const EVENT = "birthday-agentation-change";

export function enabled(): boolean {
  try { return sessionStorage.getItem(KEY) === "true"; } catch { return false; }
}

export function setEnabled(value: boolean): void {
  try { sessionStorage.setItem(KEY, String(value)); } catch { return; }
  window.dispatchEvent(new Event(EVENT));
}

export function subscribe(callback: () => void): () => void {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}
