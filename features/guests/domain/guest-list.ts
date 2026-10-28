import type { Guest } from "./guest";

// Longer than the 40-character group-name limit, so it cannot collide with a real group.
export const UNASSIGNED = "__unassigned_guest_organization_filter_value__";

export type GuestFilter = "all" | "accepted" | "unanswered" | "declined";

export function filterGuests(guests: Guest[], search: string, filter: GuestFilter, group = "", host = "") {
  const query = search.toLocaleLowerCase("de");
  return guests.filter(guest =>
    guest.name.toLocaleLowerCase("de").includes(query) &&
    (filter === "all" || (filter === "accepted" ? guest.accepted === true : filter === "declined" ? guest.accepted === false : guest.accepted == null)) &&
    (!group || (group === UNASSIGNED ? !guest.groups.length : guest.groups.includes(group))) &&
    (!host || (host === UNASSIGNED ? !guest.hosts.length : guest.hosts.some(value => value === host)))
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
