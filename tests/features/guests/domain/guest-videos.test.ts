import assert from "node:assert/strict";
import { test } from "node:test";
import { filterGuestVideos } from "../../../../features/guests/domain/guest-videos";
import type { Guest } from "../../../../features/guests/domain/guest";

const guests: Guest[] = [
  { _id: "1", name: "Anna", groups: ["Uni"], hosts: ["Marco"], accepted: false, video: true },
  { _id: "2", name: "Alex", groups: [], hosts: ["Manuel"], accepted: true, video: false },
];

test("video availability is independent of RSVP", () => {
  assert.deepEqual(filterGuestVideos(guests, "", "available"), [guests[0]]);
  assert.deepEqual(filterGuestVideos(guests, "", "missing"), [guests[1]]);
  assert.deepEqual(filterGuestVideos(guests, "", "all"), guests);
});

test("video search matches names, groups and hosts and combines with the filter", () => {
  assert.deepEqual(filterGuestVideos(guests, "ANNA", "all"), [guests[0]]);
  assert.deepEqual(filterGuestVideos(guests, "uni", "available"), [guests[0]]);
  assert.deepEqual(filterGuestVideos(guests, "marco", "missing"), []);
  assert.deepEqual(filterGuestVideos([], "", "all"), []);
});
