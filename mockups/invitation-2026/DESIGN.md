# Invitation 2026 — Mockup

## Goal and scope
Compare three distinct invitation treatments using images downloaded from the official Stadtball Bayreuth website, as requested by the user. Isolated React/Mantine prototype; no production changes.

## Revision and review
- Revision: R7. Sample guest is Max Muster; visible QR placeholder disclaimer removed as requested.
- Status: in review; Midnight Gala is the preferred direction, not yet approved for implementation.
- User prefers the first direction with less text and the title “21. Geburtstag”. Midnight Gala's mobile typography uses: 48–64px title, 16px hosts/controls, 17px event details, 12–13px supporting labels, and 32px greeting. Event details stack; action targets are at least 44px tall. R5 keeps Apple Wallet and WhatsApp next to each other at every width, with equal-width mobile buttons and 14px labels. Desktop and other directions remain unchanged. This is a request to iterate, not production approval.

## Directions
- `?variant=midnight`: Midnight Gala — navy/gold, wide blue-lit ballroom hero, expressive serif title; details and RSVP alongside each other below, stacked on mobile. R3 uses “21. Geburtstag” as the main title, with year, hosts, date/location, personalized greeting, and actions. Removes hero slogans, descriptive paragraphs, decorative guest number, RSVP explanation, and redundant confirmation label. Image attribution and prototype caveats remain in the review footer; useful errors remain visible; the ticket has no placeholder disclaimer.
- `?variant=champagne`: Champagne Editorial — cream/brown, large serif headline, portrait ballroom photograph, birthday seal, editorial two-column composition; single column on mobile.
- `?variant=afterdark`: After Dark — burgundy/coral, bokeh photograph, full-height party-poster composition and bold sans-serif title with serif accent; RSVP beside poster, below on mobile.
- Shared review toolbar selects direction and state. Every direction includes provisional hosts/age, personalized greeting, unknown date/location, RSVP, companion control, ticket placeholder, simulated Wallet/WhatsApp actions, and cancellation.
- No intentional animation; reduced-motion CSS is included. Mantine controls provide standard keyboard interactions, with explicit focus styling for buttons/links.

## Supported states
Append `&state=pending`, `&state=accepted`, `&state=loading`, or `&state=error` to a variant URL. State selection is retained in the URL on change. Confirm/cancel switches local state; companion selection is local only. Loading is a deliberately frozen review state. Error shows a sample failure, not an actual request failure.

## Assets and attribution
Locally cached images are used to avoid third-party requests while reviewing. All are from https://www.stadtballbayreuth.de/ and its public media library:
- `assets/gala.jpg`: https://www.stadtballbayreuth.de/wp-content/uploads/2024/11/431191859_7427335603992299_3082343921711553263_n-1536x864.jpg . Visible embedded credit: SW Bayreuth / Screenshot.
- `assets/lights.jpg`: https://www.stadtballbayreuth.de/wp-content/uploads/2024/01/image05_stadtball-bayreuth.jpg . Red-lit ballroom.
- `assets/ballroom.jpg`: https://www.stadtballbayreuth.de/wp-content/uploads/2024/01/image01_stadtball-bayreuth-1024x680.jpg . Bokeh lights, despite the local filename.

Image reuse was requested for this private mockup; publication rights have not been established. The footer links the source and states this is not affiliated with the event. Photographs illustrate atmosphere, not a confirmed birthday venue. Do not publish these images in production without confirming permission and required attribution.

## Fake or omitted behavior
- Max Muster is fictional. Hosts and 21st-birthday wording are provisional; date, time, venue, dress code, real photos, and WhatsApp destination remain unconfirmed.
- No guest backend, tracking, credentials, persistence, generated pass, or external messaging. QR icon is a non-scannable placeholder; its visible disclaimer was removed at the user's request. The review footer still identifies this as a mockup with no real registration.
- Wallet/WhatsApp buttons display explanatory messages. RSVP/loading/error do not exercise real API calls.
- No public Stadtball event date or branding is presented as the birthday event.

## Verification and next step
- Feature entry served successfully over HTTP; shared mockup TypeScript check passes.
- No browser automation or visual/interaction verification performed; review is user-led.
- Select a direction and request changes; explicit revision approval is required before production work. Agent-owned managed preview remains running during review and must be stopped at approval/cancellation, with approved files preserved.
