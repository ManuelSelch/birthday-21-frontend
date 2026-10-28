import type { Guest } from "./guest";

export type VideoFilter = "all" | "missing" | "available";

export function filterGuestVideos(guests: Guest[], search: string, filter: VideoFilter) {
  const query = search.toLocaleLowerCase("de");
  return guests.filter(guest =>
    [guest.name, ...guest.groups, ...guest.hosts].some(value => value.toLocaleLowerCase("de").includes(query)) &&
    (filter === "all" || (filter === "available" ? guest.video : !guest.video))
  );
}
