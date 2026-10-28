import assert from "node:assert/strict";
import { test } from "node:test";
import { filterGuestVideos } from "../../../../features/guests/domain/guest-videos";
import { UNASSIGNED } from "../../../../features/guests/domain/guest-list";
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

test("videos reuse name search and explicit group and host filters", () => {
  assert.deepEqual(filterGuestVideos(guests, "ANNA", "all", "Uni", "Marco"), [guests[0]]);
  assert.deepEqual(filterGuestVideos(guests, "uni", "all"), []);
  assert.deepEqual(filterGuestVideos(guests, "", "missing", "Uni", "Marco"), []);
  assert.deepEqual(filterGuestVideos(guests, "", "all", "Uni", "Manuel"), []);
  assert.deepEqual(filterGuestVideos(guests, "", "all", UNASSIGNED, "Manuel"), [guests[1]]);
  assert.deepEqual(filterGuestVideos(guests, "", "all", "", UNASSIGNED), []);
  assert.deepEqual(filterGuestVideos([], "", "all"), []);
});
