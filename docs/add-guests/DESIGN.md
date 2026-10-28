# Add guests — Design

## Overview
Add the [revision 1 inline form](../../mockups/add-guests/DESIGN.md) to the existing guest page. Keep Cockpit storage and the current table/invitation behavior; editing and deletion are excluded.

## Components
| Package/module | Component | Change | Responsibility |
|---|---|---|---|
| Proposed features/guests | Domain validation and creation handler | New | Validate names, construct fresh guest data, coordinate persistence |
| Proposed features/guests | Form component, hook and container | New | Pure controls; per-form input, pending, error and success state; submit and refresh |
| [Guest page](../../app/admin/(protected)/guests/page.tsx), [table](../../components/guests/guests-table.tsx) | Page wiring and search reset | Changed | Mount form; refresh server-owned guests/counters and clear search after creation |
| [Guest route](../../app/api/guests/route.ts) | POST wiring | Changed | Connect feature creation to persistence and guards; preserve GET |
| [Auth entry](../../features/admin-auth/server.ts), [Cockpit client](../../lib/cockpit.ts) | Existing collaborators | Reused | Session checks, JSON parsing and item creation |

## Runtime flow
1. Admin enters a name and submits. The form marks itself pending and prevents another in-flight submission.
2. POST authorizes the session before reading JSON or touching Cockpit. Validate and trim the name; ignore other fields.
3. Save a new item without an ID, with all four flags false and points zero.
4. On success clear input/search, announce success and refresh server data/counters. On failure retain input and display a generic error. No automatic retries.

## Contracts & API changes
| Provider → consumer | Current → proposed contract | Compatibility |
|---|---|---|
| Guest route → admin form | GET only → add POST JSON with name; 201 with success true on confirmed creation | Existing GET unchanged |
| Guest POST → caller | New 400 invalid body/name, 401 unauthorized, 502 persistence failure | No Cockpit details exposed; no-store responses |
| Creation handler → Cockpit | Existing saveItem operation with name and explicit defaults, no caller-supplied ID | Existing collection schema; equal names allowed |

## Decisions & Trade-offs
- Use a small guests feature slice, existing auth public entry and existing Cockpit adapter. No dependencies or unrelated restructuring.
- Merge reconciliation follows main's explicitly simplified ADMIN_PASSWORD authentication: no separate origin configuration/enforcement or bounded-body helper is restored.
- Names must contain 1–100 characters after trimming; identical names remain valid.
- Keep form inline above search; stack on mobile. No new modal, invitation-copy tool or status controls.
- Pending protection prevents repeated clicks, not duplicate creation after an ambiguous network failure; do not auto-retry.

## Verification
Planned: unit validation/default tests; driven route tests for guards, malformed input, safe persistence payloads and failure responses; driven browser checks for create/refresh, blank input, pending and failure recovery with fake Cockpit. Run scoped lint, typecheck, tests and build; report existing failures separately.

## Open Questions
None.
