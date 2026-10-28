# Invitation details — R3
- Status: R3 approved for implementation. User: “yes implement”.
- Agent-owned Vite PID 55524 verified against command/workspace and stopped via managed preview. Process exit and no listener on port 5173 confirmed; approved source preserved.
- Scope: small mobile-first navy/gold invitation showing the proposed “Gut zu wissen” block, followed by the ticket.
- Three always-visible rows with minimal wording: “WhatsApp-Gruppe” with “Gruppe beitreten” button, “Einlass nur mit Ticket”, and “Dresscode: Anzug”. No supporting descriptions, as requested by the user.
- User-specified dress code: **Anzug** (required).
- Fictional accepted guest Max Muster; date and venue remain “Folgt”. No RSVP changes or production edits.
- Date and location stay stacked as two rows. “Teilnahme absagen” is restored below the Wallet button.
- WhatsApp/Wallet/cancellation buttons show local explanatory messages only. QR icon is not scannable. No real links, API calls, authentication or persistence.
- Content uses a 430px maximum width, full-width on narrow screens. No animation.
- Photo reused from the existing invitation mockup; source/rights documentation remains in ../invitation-2026/DESIGN.md. Not approved for publication.
- This proposal moves WhatsApp into the contextual details block and leaves Wallet next to the ticket, rather than preserving adjacent Wallet/WhatsApp buttons. This layout change is for review only.
- Mockup review was user-led; serving checked over HTTP without browser automation during review.

## Production handoff
- Implemented R3 in the invitation feature: new pure ImportantDetails component before the real ticket, existing WhatsApp destination moved to “Gruppe beitreten”, full-width Wallet action, stacked event details and working cancellation retained.
- Existing guest-specific greeting, real QR and companion control are preserved rather than replaced with mock data. Accepted invitations may scroll vertically with the additional details.
- Verification: 59 unit/integration tests, 13 invitation browser tests in both dev and production, TypeScript, scoped ESLint, production build and diff whitespace check passed. Responsive invitation checks cover 320–1280px; generated mobile/desktop screenshots inspected.
- Full browser suite: 45/46 passed. Unrelated admin-boundaries test fails in its URL parsing helper (new URL on a relative Location header); untouched. Browser tests use fake Cockpit only. No push or deployment.
