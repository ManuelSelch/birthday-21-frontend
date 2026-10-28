# Invitation 2026 — Verification

## Implemented
- Approved Midnight Gala R7 with minimal “21. Geburtstag” hero, local ballroom image, large mobile text, and adjacent Apple Wallet/WhatsApp buttons.
- Production guest names replace Max Muster. Real 200px QR with quiet zone replaces the mockup icon; ticket stacks on mobile so the code is not reduced.
- Typed invitation slice owns presentation, attendance state and its browser adapter. View tracking runs on mount rather than render. Failed mutations retain prior saved state; concurrent mutations are disabled.
- Missing/repeated IDs and unknown or malformed guest data do not render personalized invitations.
- Date/location remain the approved “folgt” placeholders. Existing WhatsApp destination and pass generation are retained. Later main-branch Wallet changes were merged unchanged.
- Latest local main at `4635c8a` was merged into this branch, including the plain ADMIN_PASSWORD simplification. No worktree merge back to main, push or deployment was performed.

## Checks run after final main merge
| Check | Result |
|---|---|
| `npm test` | 23 passed, including 5 new invitation domain/adapter tests |
| `npm run test:ui` | 14 passed, including invitation flows and admin regressions |
| `npm run typecheck` | Passed |
| Scoped ESLint for invitation, touched routes, drivers and Playwright config | Passed |
| `NEXT_TEST_DIST_DIR=.next-admin-build npm run build` | Passed |
| `ADMIN_TEST_PRODUCTION=1 npm run test:ui` | 8 passed against production build |
| `git diff --check` | Passed |
| Full repository `npm run lint` | Existing unrelated failures: 24 errors, 17 warnings in admin/order/points/guest code and legacy API/Cockpit helpers |

Tests ran against fake Cockpit only. Coverage includes public access, keyboard confirmation, persistence after reload, companion changes, cancellation, failed HTTP/result responses, retry, pending state, single view tracking per mount, invalid IDs, production link destinations, and QR matrix matching the expected guest URL. The reduced final unit-test count reflects main's removal of the superseded authentication tests.

## Layout and accessibility
- Browser checks at 320px, 375px and 1280px confirm no horizontal overflow and adjacent Wallet/WhatsApp actions with at least 44px height. Mobile hosts/details are at least 16px.
- Production-rendered screenshots were inspected at these widths. Screenshots are generated under ignored `test-results/` by the layout scenarios.
- Static palette contrast ratios: body text 16.89:1, supporting text 9.65:1 against the navy surface; primary-action text 9.91:1 against gold. These measurements do not certify every image-background pixel or all control states.
- Focus styles and reduced-motion rules are included. This was not a comprehensive accessibility audit or a physical-device QR scan.
- Agent-owned mockup preview was stopped at approval. Automated test servers exited; no owned test listener remains on ports 3187/3188.

## Before publication
Confirm final date/time/venue/dress code, current WhatsApp group, generated Wallet pass details, and photograph publication rights/attribution. Live Cockpit and signed Apple Wallet generation were not exercised. Existing Next.js security advisories remain a separate deployment concern.
