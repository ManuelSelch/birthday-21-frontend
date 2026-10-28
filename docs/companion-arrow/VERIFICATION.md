# Companion arrow verification

- Approved mockup R2 preserved; agent-owned preview stopped and listener/process exit verified before implementation.
- Red/green: new driven keyboard/toggle test initially failed because the switch was not a button. Production row then passed.
- `npm test`: 32 passed.
- `ADMIN_TEST_PORT=3287 COCKPIT_TEST_PORT=3288 npx playwright test tests/ui/invitation.spec.ts`: 8 passed. Covers persisted enable/disable, green selected background and checkmark, keyboard Space, pending disabled state, failed-save retention and 320/375/1280px layouts.
- `npm run typecheck`: passed.
- Scoped ESLint for changed TSX and test files: passed.
- `npm run build`: passed.
- `git diff --check`: passed.
- Full browser suite: 15 passed, 4 unrelated add-guests tests failed. Their unchanged driver expects the textbox name `Name`; the unchanged form exposes `Name des Gastes`. No guest-management changes made.
- Existing desktop screenshot inspected; row matches approved composition inside the actual invitation. Browser layout assertions pass for mobile widths.
- Dependency installation reported 21 existing audit findings (including one critical); dependency upgrades are outside this task.
- No push or deployment.
