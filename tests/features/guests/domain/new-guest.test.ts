import assert from "node:assert/strict";
import { test } from "node:test";
import { newGuest } from "../../../../features/guests/domain/new-guest";

test("new guests have trimmed names and explicit initial states", () => {
  assert.deepEqual(newGuest("  Alex Beispiel  "), {
    name: "Alex Beispiel", invited: false, accepted: null,
    checked_in: null, companion: false, points: 0,
  });
});

test("rejects absent, blank, non-string and overly long names", () => {
  for (const name of [undefined, null, 42, {}, [], "", " \n ", "a".repeat(101)]) {
    assert.equal(newGuest(name), undefined);
  }
});

test("allows the name length boundary and equal names", () => {
  assert.equal(newGuest("a".repeat(100))?.name.length, 100);
  assert.deepEqual(newGuest("Alex"), newGuest("Alex"));
});
