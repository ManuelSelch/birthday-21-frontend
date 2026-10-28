import assert from "node:assert/strict";
import { test } from "node:test";
import { guestAssignments, HOSTS } from "../../../../features/guests/domain/assignments";

test("trims and deduplicates groups and supports shared hosts", () => {
  assert.deepEqual(guestAssignments({ groups: [" Uni ", "Uni", "Fußball"], hosts: ["Manuel", "David", "Manuel"] }),
    { groups: ["Uni", "Fußball"], hosts: ["Manuel", "David"] });
  assert.deepEqual(HOSTS, ["Manuel", "Marco", "David"]);
});

test("allows empty assignments but requires both arrays", () => {
  assert.deepEqual(guestAssignments({ groups: [], hosts: [] }), { groups: [], hosts: [] });
  for (const value of [null, {}, { groups: [] }, { hosts: [] }, { groups: "Uni", hosts: [] },
    { groups: [42], hosts: [] }, { groups: [""], hosts: [] }, { groups: ["a".repeat(41)], hosts: [] },
    { groups: [], hosts: ["Unknown"] }, { groups: [], hosts: "Manuel" }]) {
    assert.equal(guestAssignments(value), undefined);
  }
});
