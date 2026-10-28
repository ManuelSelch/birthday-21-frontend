# Add guests — Requirements

## Goal
Create guests from the admin guest list without opening Cockpit.

## Requirements
- **R1** — An authenticated administrator can add a guest using only a name; no edit/delete functionality.
- **R2** — Trim names; reject blank, non-string or longer-than-100-character names. Equal names are allowed.
- **R3** — Create a fresh guest with invited, accepted, checked_in and companion false, and points zero. Do not accept caller-supplied identifiers or status fields.
- **R4** — Successful creation clears the input and search, updates the list and counters, and preserves the existing invitation action.
- **R5** — Disable submission during the request; show validation/save errors and preserve the name for correction or retry.
- **R6** — Creation requires an admin session and same-origin submission; Cockpit credentials stay server-side. Existing public invitation behavior is unchanged.

## Assumptions
- The proposed 100-character limit and allowance of equal names are reasonable minimal defaults, subject to design approval.
- Cockpit remains the persistence backend.

## Implementation Plan
### S1 — Create guest endpoint
Description: Implement R2, R3 and R6 through authenticated POST creation using the existing Cockpit client; verify validation, denied requests, safe payload construction and persistence failures.

### S2 — Add guest form
Description: Implement R1, R4 and R5 after S1 using the reviewed inline form; verify the list/counter refresh, pending state, validation and retry through isolated UI tests.

## Open Questions
None.
