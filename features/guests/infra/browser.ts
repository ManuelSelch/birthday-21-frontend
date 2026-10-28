import type { GuestAssignments } from "../domain/assignments";

async function save(url: string, body: unknown, expectedStatus: number): Promise<void> {
  const response = await fetch(url, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body), cache: "no-store",
  });
  const result: unknown = await response.json();
  if (response.status !== expectedStatus || !result || typeof result !== "object" || !("success" in result) || result.success !== true) {
    throw new Error("Guest save failed");
  }
}

export function submitGuest(guest: GuestAssignments & { name: string }) {
  return save("/api/guests", guest, 201);
}

export function submitAssignments(id: string, assignments: GuestAssignments) {
  return save("/api/guests/assignments", { id, ...assignments }, 200);
}

export function invitationLink(id: string) {
  return new URL("/invite?id=" + encodeURIComponent(id), window.location.origin).href;
}

export function copyInvitation(id: string) {
  return navigator.clipboard.writeText(invitationLink(id));
}
