import { guestAssignments } from "./assignments";

export function newGuest(value: unknown) {
  if (!value || typeof value !== "object" || !("name" in value) || typeof value.name !== "string") return;
  const name = value.name.trim();
  const assignments = guestAssignments(value);
  if (!name || name.length > 100 || !assignments) return;

  return { name, ...assignments, invited: false, accepted: null, checked_in: null, companion: false, points: 0 };
}

export type NewGuest = NonNullable<ReturnType<typeof newGuest>>;
