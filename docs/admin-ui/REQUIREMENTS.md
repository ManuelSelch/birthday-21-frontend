# Admin guest list — Requirements

## Goal
Bring the approved minimal Midnight Gala guest-list mockup into the existing admin.

## Requirements
- **R1** — Match approved [R1](../../mockups/admin-ui/DESIGN.md): navy background, gold accents, serif headings, compact header, four summary counts, guest panel and responsive table.
- **R2** — Provide name search and Alle/Zusagen/Offen filters, readable response and check-in states, empty results and visible-result count. Unanswered is not declined.
- **R3** — Preserve real guest creation, validation, pending/error/success feedback and list refresh; reset search and filter after success.
- **R4** — Use real invitation/scanner links and retain logout and access to existing orders. No authentication, API or Cockpit schema changes.
- **R5** — Scope styling to guest-list screen; leave login, invitation and other admin screens unchanged. No mock data or React Grab in production.

## Assumptions
- The approved single-screen mockup defines scope; a site-wide admin redesign is not included.
- Existing orders access is retained as a small secondary link, not a new navigation system.

## Implementation Plan
### S1 — Guest-list presentation
Description: Implement the approved screen in the guests feature, with scoped styles, real links, existing logout, summary counts and responsive presentation. Verify layout and unchanged route protection.

### S2 — Filtering and creation integration
Description: Add local search/filter behavior and wire existing creation feedback and refresh into the new panel. Verify unanswered/declined semantics, reset on success, errors, pending state and mobile behavior through feature and driven UI tests.

## Open Questions
None.
