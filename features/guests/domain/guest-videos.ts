import type { Guest } from "./guest";
import { filterGuests } from "./guest-list";

export type VideoFilter = "all" | "missing" | "available";

export function filterGuestVideos(guests: Guest[], search: string, filter: VideoFilter, group = "", host = "") {
  return filterGuests(guests, search, "all", group, host).filter(guest =>
    filter === "all" || (filter === "available" ? guest.video : !guest.video)
  );
}
