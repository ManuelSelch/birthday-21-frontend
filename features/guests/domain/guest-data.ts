import type { Guest } from "./guest";
import { guestAssignments } from "./assignments";

type GuestListResult = { ok: true; guests: Guest[] } | { ok: false; invalidIds: string[] };

export function parseGuestList(value: unknown): GuestListResult {
  if (!Array.isArray(value)) return { ok: false, invalidIds: ["collection"] };
  const guests: Guest[] = [];
  const invalidIds: string[] = [];
  value.forEach((item: unknown, index) => {
    const record = item && typeof item === "object" ? item : null;
    const id = record && "_id" in record && typeof record._id === "string" ? record._id : "";
    const name = record && "name" in record && typeof record.name === "string" ? record.name : "";
    const assignments = guestAssignments(record);
    if (!id || !name.trim() || !assignments) {
      invalidIds.push(id || `#${index + 1}`);
      return;
    }
    guests.push({ ...record, ...assignments, _id: id, name } as Guest);
  });
  return invalidIds.length ? { ok: false, invalidIds } : { ok: true, guests };
}
