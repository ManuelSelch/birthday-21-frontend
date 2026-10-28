# Invitation hosts — R5
- Status: R5 approved for production implementation. User: “perfect. implement”.
- Preview cleanup: verified agent-owned Vite PID 69305 and workspace, stopped via managed preview service, confirmed process exit and no listener on port 5173. Approved files preserved.
- Scope: small mobile-first host-identification concept, navy/gold, max-width 430px.
- Three equal circular portrait slots (80px, 72px on narrow screens) with Manuel, Marco and David beneath; section “Wir feiern mit euch” below hero, above stacked date/location.
- Names move out of the hero in this concept to avoid duplication. No biographies, gallery, animation or expanded profile.
- Manuel uses a 640px copy of the user-requested Nextcloud Personal profile picture (Profilbild_2025.JPG), stored in assets/manuel.jpg. Source file unchanged; mockup only, not production publication. David uses the user's corrected crop from Downloads/david.jpeg, resized to a maximum of 640px in assets/david.jpg without additional cropping; original unchanged. Marco uses a 360px square crop of the user-provided Downloads/marco.JPG in assets/marco.jpg; original unchanged. All three hosts now have photos. Tap a portrait to choose a local photo for review; FileReader data stays in local React state, no upload or persistence. Consistent center/cover cropping.
- Fictional guest Max; RSVP only displays a notice. Details/ticket/companion actions omitted from this focused composition, not proposed for removal in production.
- Reuses ../invitation-2026/assets/gala.jpg; source and publication-rights caveats in ../invitation-2026/DESIGN.md. Actual portrait permissions/crops must be confirmed before publication.
- Main review question: are three small labelled portraits sufficient to recognise each host without dominating the invitation?
- Mockup review was user-led, without browser automation.

## Production handoff
- R5 implemented with a pure InvitationHosts component, local static photos and Next Image optimization. Portraits are non-interactive; no file picker, sample guest or mockup actions shipped.
- Host names removed from the hero; the labelled portrait row sits below it, before the unchanged event details. Existing RSVP, compact companion control, evening details, real ticket/Wallet and cancellation remain intact.
- Existing desktop hero and event/response columns are preserved; additional content may scroll vertically on mobile.
- Verification: 59 unit/integration tests; all 14 invitation browser tests in development and production; responsive checks at 320, 375, 640, 641, 768 and 1280px; TypeScript, scoped ESLint, production build and whitespace checks passed. Production photo loading and label/order/size checks pass. Generated mobile screenshot inspected.
- No full unrelated browser-suite rerun for this step; the preceding full run had an unrelated admin redirect URL-helper failure. Tests use fake Cockpit only. No push or deployment.
