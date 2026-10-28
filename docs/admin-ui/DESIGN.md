# Admin guest list — Design

## Overview
Implement approved [mockup R1](../../mockups/admin-ui/DESIGN.md) on the guest-list route only. Keep current server loading, authentication and creation flow; replace presentation rather than introduce a new admin framework.

## Components
| Package/module | Component | Change | Responsibility |
|---|---|---|---|
| Admin route | [GuestsPage](../../app/admin/(protected)/guests/page.tsx) | Changed | Load Cockpit guests; compose scoped guest screen and existing logout |
| Admin route | [AdminLayout](../../app/admin/(protected)/layout.tsx) | Changed | Preserve guard; allow guest screen to place logout within its header without duplicating it; other screens retain existing placement |
| Guests UI | [GuestManagement](../../features/guests/ui/containers/guest-management.tsx) | Changed | Own client search/filter state and bind creation, refresh and pure presentation |
| Guests UI | Proposed GuestListView, GuestSummary and GuestTable | New | Render values/callbacks with feature-owned CSS module; replace legacy guest table |
| Guests UI | [AddGuestForm](../../features/guests/ui/components/add-guest-form.tsx) | Changed | Preserve feedback and validation; adopt compact German controls |
| Guests app | [useAddGuest](../../features/guests/app/use-add-guest.ts) | Reused | Own creation request and pending/error/success state |

Search/filter state lasts for the mounted guest screen and resets after successful creation. No persistence is added.

## Runtime flow
1. Existing guard authenticates; GuestsPage loads guests from Cockpit.
2. GuestManagement supplies summary values and filtered rows to presentation.
3. Search and filters update local state without requests.
4. AddGuestForm submits through useAddGuest. Failure preserves name and feedback; success clears search/filter and refreshes rows and counts.
5. Invitation, scanner and orders links navigate to existing destinations; logout uses existing behavior.

## Contracts & API changes
| Provider → consumer | Current → proposed contract | Compatibility |
|---|---|---|
| Cockpit/API → guests | Existing guest records and name-only creation → unchanged | No schema/auth changes |
| Guest model → UI | Existing fields → include existing companion boolean in typed projection | Existing stored field, not a new API field |
| Guests → presentation | Unlabeled symbols → German badges | null/undefined response remains unanswered; false remains declined |
| Creation → UI | Refresh and clear search → also reset filter | Existing error/pending semantics preserved |

## Decisions & Trade-offs
- Feature-owned CSS module and existing Mantine controls; no new dependencies or global theme changes.
- Use serif only for headings/numbers; table stays sans-serif.
- Preserve checked-in false versus unset in accessible text, even if both use a muted dash visually.
- Companion total counts accepted guests plus their companions, matching the mockup.
- Keep real logout and a small orders link despite their omission from the focused prototype. Other screens remain outside scope.
- Narrow tables scroll inside their panel rather than overflow the page.

## Verification
- Add feature tests for counts/filtering, including unanswered, declined and companions.
- Update driven UI expectations for German labels and status badges; cover search/filter, empty state, creation reset, validation, failure/retry and mobile layout.
- Run existing auth/invitation regressions, typecheck, scoped lint and build where available. These are planned checks, not completed verification.

## Open Questions
None.
