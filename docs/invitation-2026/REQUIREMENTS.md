# Invitation 2026 — Requirements

## Goal
Refresh the personalized birthday invitation for 2026 with a Stadtball Bayreuth-inspired visual identity, replacing the previous casino theme while preserving the existing guest journey.

## Requirements
- **R1** — Replace the casino background, casino wording, and amber casino styling on `/invite?id=…` with a coherent Stadtball Bayreuth-inspired invitation. Confirm the reference edition and visual direction before mockup approval; do not imply affiliation with the public Stadtball.
- **R2** — Show the guest's name and confirmed birthday-event title, hosts, date, time, venue, and any agreed dress-code information. Remove obsolete 2025/20th-birthday copy from invitation-related presentation and metadata. Do not substitute the public Stadtball's event details for the private birthday details.
- **R3** — Preserve personalized guest access, attendance confirmation, cancellation, companion selection, invitation-view recording, QR ticket, Apple Wallet link, and WhatsApp link. Represent pending, accepted, loading, and error states clearly without changing API contracts.
- **R4** — Make the invitation readable and usable at narrow mobile and desktop widths, without horizontal overflow. Keep keyboard focus visible, controls labeled, contrast readable, and the QR code scannable. Respect reduced-motion preferences if animation is introduced.
- **R5** — Review the visual direction in an isolated mockup with fake guest data and representative invitation states; obtain explicit approval before production implementation. Preserve the approved mockup as the implementation reference.
- **R6** — Limit production changes to the invitation and directly related presentation/metadata. Do not redesign admin, ordering, or points screens, add Google Wallet support, or change generated Wallet pass artwork/content without separately agreed scope. Shared styling changes must not unintentionally restyle other routes.

## Assumptions
- “This year” means the private 2026 birthday event, likely the 21st birthday; the age, hosts, and event details still need confirmation.
- “Stadtball Bayreuth theme” means visual inspiration rather than an exact copy or use of its branding. A restrained, elegant ballroom direction is a proposal, not an approved palette or typography decision.
- Existing German invitation language remains appropriate.
- Existing guest data and API contracts remain in use. Existing photos and external links are retained only if confirmed appropriate for 2026.
- Reference: https://www.stadtballbayreuth.de/ . At planning time the official site advertises 16 January 2027, so it does not establish which edition or artwork the user intends. Exact colors, fonts, imagery, and asset permissions remain unconfirmed.
- Repository baseline: Next.js, React, Mantine, and Tailwind; invitation components live in `components/invitation/`. Current copy hardcodes 1 November 2025, 21:00, Reichshof Bayreuth, and a casino theme. These are not confirmed 2026 details. No automated test script is currently defined in the root package.

## Implementation Plan
### S1 — Confirm reference and event content
Description: Resolve Q1–Q3 and identify the approved reference images/site edition, intended visual cues, and usable assets. Produce an agreed invitation-content inventory and scope boundary. Verify that no public-ball details or unconfirmed old birthday details are treated as facts. Implements R1, R2, and R6.

### S2 — Review invitation mockup
Description: After S1, create `mockups/invitation-2026/` in the existing shared Vite workspace. Show pending and accepted invitations, companion selection, ticket/actions, and loading/error examples using fake data. Let the user review mobile and desktop layouts and explicitly approve a revision. Preserve the approved files and stop any agent-owned preview at handoff. Implements R4 and R5; does not change production code.

### S3 — Approve design and implement invitation
Description: After S2, write and present `docs/invitation-2026/DESIGN.md`, covering component responsibilities, invitation-scoped styles, event content, and unchanged guest/API flows. Obtain explicit technical-design approval before production edits. Then apply the approved presentation to the invitation components and related metadata, retaining existing behavior and avoiding unrelated routes. Implements R1–R4 and R6.

### S4 — Verify invitation states and regressions
Description: After S3, verify pending/accepted states, confirmation, cancellation, companion updates, loading/errors, invalid guest access, ticket QR content, and Apple Wallet/WhatsApp destinations. Check narrow/wide layouts, keyboard access, contrast, and reduced motion where relevant against the approved mockup. Run lint and production build where the environment permits; report baseline issues and unavailable backend/Wallet checks separately. Confirm unrelated routes remain unaffected. Record actual verification results without claiming unexecuted checks.

## Open Questions
- **Q1** — Should the visual reference be the current Stadtball Bayreuth website, a specific year's invitation/poster, or only its elegant ballroom atmosphere? Please share the intended link or image.
- **Q2** — What are the confirmed 2026 event title/age, hosts, date, time, venue, and dress code?
- **Q3** — Should the current host photos and WhatsApp group remain, and should generated Apple Wallet pass styling/content be updated too or remain outside this UI refresh?
