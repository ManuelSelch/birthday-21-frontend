# Invitation 2026 — Design

## Overview
Implement the approved Midnight Gala R7 from [the preserved mockup](../../mockups/invitation-2026/DESIGN.md): navy/gold, ballroom image, “21. Geburtstag”, minimal copy, larger mobile text, and side-by-side Wallet/WhatsApp actions. Replace the invitation presentation only; preserve merged admin authentication and existing guest/API contracts.

## Components
| Package/module | Component | Change | Responsibility |
|---|---|---|---|
| Next.js invite route | [Invite page](../../app/invite/page.tsx) | Changed | Load and validate the guest server-side; compose invitation; show German invalid-access state |
| `features/invitation/domain` | Proposed guest/event values | New | Typed guest fields and approved event copy |
| `features/invitation/app` | Proposed attendance hook | New | Own attendance, companion, pending operation, and error for the mounted guest; update only after success |
| `features/invitation/infra` | Proposed browser adapter | New | Call existing public endpoints; check HTTP status and returned success |
| `features/invitation/ui` | Proposed container and pure invitation/ticket components | New | Wire hook to plain-value/callback views; own CSS Module and local ballroom asset |
| Existing server | [Cockpit](../../lib/cockpit.ts), `/api/invited`, `/api/accept`, `/api/cancel`, `/api/companion`, `/api/apple-pass` | Reused | Guest retrieval, persistence, and pass generation |

Move the replaced invitation responsibilities out of `components/invitation/`; remove obsolete casino/host-photo views and unused imports, without restructuring other features.

## Runtime flow
1. Invite page reads one guest ID and loads the guest through Cockpit. Missing/invalid IDs or failed retrieval show an access message, not a personalized invitation.
2. Invitation container initializes the hook from the saved guest and records invitation viewing on mount, not during render; UI updates do not retrigger tracking.
3. Confirm, cancel, or companion actions disable competing mutations while pending. The adapter calls the existing endpoint; success updates local state, failure preserves state and exposes a retryable German error.
4. Accepted guests see a real QR encoding their existing invitation URL, their actual name, Wallet/WhatsApp links, and cancellation. Reload restores persisted guest values.

## Contracts & API changes
| Provider → consumer | Current → proposed contract | Compatibility |
|---|---|---|
| Cockpit → invite route | `_id`, `name`, `accepted`, `companion`, `invited` → same guest fields | Unchanged |
| Browser → public APIs | Existing GET endpoints with `id` and companion `1`/`0` → same; inspect HTTP/`success` results | Wire unchanged; failures no longer treated as success |
| Ticket → scanner/Wallet | Existing production invitation URL and Apple pass URL with guest ID → same | Unchanged; encode ID safely |
| UI → WhatsApp | Existing group destination → same | Unchanged |

No backend schema, admin-auth, pass-generation, or dependency changes. Max Muster remains mockup data only.

## Decisions & Trade-offs
- Reuse Mantine, Tabler, and `qrcode.react`; no React Grab, review toolbar, or simulated actions in production.
- Keep approved hosts and “Termin folgt · 2026” / “Location folgt · Bayreuth”; do not invent date, time, venue, or dress code. Omit old host photos. Retain existing WhatsApp destination and generated pass content until separately changed.
- Use invitation-scoped CSS and local theme overrides; retain root layout spacing/theme behavior for other routes. Update birthday metadata to 21 and German document language.
- Copy only the approved ballroom photograph into production assets with source attribution recorded. Publication rights remain unverified; implementation does not authorize deployment.
- Replace the small decorative QR icon with a real 200px black-on-white QR and quiet zone. Keep a compact ticket/name layout on wider screens; let the QR ticket stack on narrow screens rather than shrinking the code. Wallet and WhatsApp remain adjacent at every width.

## Verification
Planned, not yet run: TDD for adapter success/failure and guest/ticket values; driven Playwright scenarios using the existing fake Cockpit server for RSVP, cancellation, companion persistence, errors, invalid access, tracking, QR value, and link destinations. Check 320/375px and desktop layouts, readable mobile type, adjacent action buttons, keyboard access, and overflow. Update existing admin boundary driver expectations for the new invitation copy; rerun admin tests, typecheck, scoped lint, and production build. Report pre-existing lint issues separately. No live Cockpit mutations or real Wallet generation required for automated checks.

## Open Questions
None. Date/location and unchanged external destinations follow the approved mockup and existing behavior; confirm final event details, WhatsApp group, image rights, and pass content before publication.
