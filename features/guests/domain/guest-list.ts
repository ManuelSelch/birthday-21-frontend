import type { Guest } from "./guest";

export type GuestFilter = "all" | "accepted" | "unanswered";

export function filterGuests(guests: Guest[], search: string, filter: GuestFilter) {
  const query = search.toLocaleLowerCase("de");
  return guests.filter(guest =>
    guest.name.toLocaleLowerCase("de").includes(query) &&
    (filter === "all" || (filter === "accepted" ? guest.accepted === true : guest.accepted == null))
  );
}

export function guestSummary(guests: Guest[]) {
  const accepted = guests.filter(guest => guest.accepted === true);
  return {
    total: guests.length,
    accepted: accepted.length,
    withCompanions: accepted.length + accepted.filter(guest => guest.companion === true).length,
    checkedIn: guests.filter(guest => guest.checked_in === true).length,
  };
}
