# Companion arrow — Design

## Overview
Replace the invitation's small companion switch with the full-width row from [mockup R2](../../mockups/companion-arrow/DESIGN.md). Keep the ticket, response heading, API and attendance logic unchanged.

## Components
| Package/module | Component | Change | Responsibility |
|---|---|---|---|
| Invitation UI | [GuestResponse](../../features/invitation/ui/components/guest-response.tsx) | Changed | Render a native Mantine button with arrow/checkmark and selected styling |
| Invitation UI | [Invitation CSS](../../features/invitation/ui/components/invitation.module.css) | Changed | Responsive 88px-minimum row, blue default, green selected fill/border and green checkmark |
| Invitation app | [useAttendance](../../features/invitation/app/use-attendance.ts) | Reused | Own persisted companion state, pending action and retryable errors |

## Runtime flow
1. Accepted guest clicks the row; GuestResponse requests the opposite companion value.
2. Existing attendance hook disables competing actions while saving.
3. Success renders “Deine Begleitung ist dabei”, green checkmark and green-tinted row. Clicking again removes the companion.
4. Failed saves retain the previous state and existing error message. Reload restores the saved value.

## Contracts & API changes
| Provider → consumer | Current → proposed contract | Compatibility |
|---|---|---|
| GuestResponse → useAttendance | Boolean callback and pending state → unchanged | Unchanged |
| Browser → companion endpoint | Existing guest ID and companion 1/0 → unchanged | Unchanged |
| UI → assistive technology | Labeled switch → labeled toggle button with aria-pressed | Intent unchanged; browser test locator updated |

## Decisions & Trade-offs
- Match R2's 17px label, 32px icon, rounded full-width row and wrapping text within existing layout.
- Selected uses mint-green checkmark plus restrained green background/border; text and icon also communicate state without relying on color.
- Use native disabled behavior while busy, visible keyboard focus and reduced-motion support.
- Disabled cancellation stays transparent: Mantine's default light disabled background caused a flash during companion saves. Override only the invitation cancellation button's disabled background; keep native disabled semantics and existing text styling. This is the fix described to the user and approved with “yes fix it”.
- Keep state in the existing hook, not the presentation. No dependencies, backend changes or mock-only React Grab.

## Verification
Regression: hold a companion save and assert the cancellation button remains disabled with a transparent background. Planned: driven browser coverage for keyboard toggle, enable/disable persistence, disabled pending actions and failed-save state retention; check narrow layout. Run existing invitation tests, typecheck and scoped lint; report checks actually executed.

## Open Questions
None.
