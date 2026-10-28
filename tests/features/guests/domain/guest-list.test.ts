import { test } from "node:test";
import assert from "node:assert/strict";
import { filterGuests, guestSummary } from "../../../../features/guests/domain/guest-list";
import type { Guest } from "../../../../features/guests/domain/guest";

const guests: Guest[] = [
  { _id: "1", name: "Anna Weber", accepted: true, companion: true, checked_in: true },
  { _id: "2", name: "Felix", accepted: true },
  { _id: "3", name: "Laura", accepted: null },
  { _id: "4", name: "Sophie", accepted: false, companion: true },
  { _id: "5", name: "Max" },
];

test("summary counts accepted guests and only their companions", () => {
  assert.deepEqual(guestSummary(guests), { total: 5, accepted: 2, withCompanions: 3, checkedIn: 1 });
});

test("unanswered includes null and missing, not declined", () => {
  assert.deepEqual(filterGuests(guests, "", "unanswered").map(g => g._id), ["3", "5"]);
});

test("search combines with accepted filter without mutating guests", () => {
  assert.deepEqual(filterGuests(guests, "ANNA", "accepted").map(g => g._id), ["1"]);
  assert.equal(guests.length, 5);
});

test("empty lists and no matches are supported", () => {
  assert.equal(filterGuests(guests, "Nobody", "all").length, 0);
  assert.deepEqual(guestSummary([]), { total: 0, accepted: 0, withCompanions: 0, checkedIn: 0 });
});
