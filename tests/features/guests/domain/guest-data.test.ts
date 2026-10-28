import assert from "node:assert/strict";
import { test } from "node:test";
import { parseGuestList } from "../../../../features/guests/domain/guest-data";

test("validates Cockpit assignments before building dropdown options", () => {
  const guests = [{ _id: "guest-1", video: false, name: "Alex", groups: [" Uni ", "Uni"], hosts: ["Manuel"], accepted: true }];

  assert.deepEqual(parseGuestList(guests), { ok: true, guests: [{ ...guests[0], groups: ["Uni"] }] });
});

test("identifies missing and invalid stored arrays instead of sending them to Mantine", () => {
  const result = parseGuestList([
    { _id: "missing", name: "Alex" },
    { _id: "null", video: false, name: "Sam", groups: null, hosts: [] },
    { _id: "object", video: false, name: "Max", groups: {}, hosts: [] },
    { _id: "string", video: false, name: "Kim", groups: "[]", hosts: [] },
    { _id: "entry", video: false, name: "Anna", groups: [null], hosts: [] },
    { _id: "host", video: false, name: "David", groups: [], hosts: ["unknown"] },
  ]);

  assert.deepEqual(result, { ok: false, invalidIds: ["missing", "null", "object", "string", "entry", "host"] });
});

test("empty arrays are valid; malformed guest records are not", () => {
  assert.deepEqual(parseGuestList([{ _id: "guest-1", video: false, name: "Alex", groups: [], hosts: [] }]), {
    ok: true, guests: [{ _id: "guest-1", video: false, name: "Alex", groups: [], hosts: [] }],
  });
  assert.deepEqual(parseGuestList([null, { groups: [], hosts: [] }]), { ok: false, invalidIds: ["#1", "#2"] });
  assert.deepEqual(parseGuestList([]), { ok: true, guests: [] });
  assert.deepEqual(parseGuestList(null), { ok: false, invalidIds: ["collection"] });
});
