import assert from "node:assert/strict";
import { test } from "node:test";
import { newGuest } from "../../../../features/guests/domain/new-guest";

test("new guests have trimmed names, assignments and explicit initial states", () => {
  assert.deepEqual(newGuest({ name: "  Alex Beispiel  ", groups: [" Uni "], hosts: ["Manuel", "David"] }), {
    name: "Alex Beispiel", groups: ["Uni"], hosts: ["Manuel", "David"], invited: false, accepted: null,
    checked_in: null, companion: false, points: 0,
  });
});

test("rejects absent, blank, non-string and overly long names", () => {
  for (const name of [undefined, null, 42, {}, [], "", " \n ", "a".repeat(101)]) {
    assert.equal(newGuest({ name, groups: [], hosts: [] }), undefined);
  }
  assert.equal(newGuest({ name: "Alex" }), undefined);
});

test("allows the name length boundary and equal names", () => {
  assert.equal(newGuest({ name: "a".repeat(100), groups: [], hosts: [] })?.name.length, 100);
  assert.deepEqual(newGuest({ name: "Alex", groups: [], hosts: [] }), newGuest({ name: "Alex", groups: [], hosts: [] }));
});
