# Companion arrow mockup

- Revision: R2. Status: approved. Includes requested green enabled styling.
- Scope: replace the small companion switch with one prominent, full-width toggle row. Production unchanged.
- Preserve invitation navy background, serif response heading and warm white typography; introduce a restrained blue interactive accent.
- Row: at least 88px high, rounded border, 17px label, 32px right arrow; full row clickable.
- Selected: label becomes “Deine Begleitung ist dabei”, arrow becomes a mint-green checkmark with a subtle green fill and border. A second click deselects.
- Responsive: centered 460px maximum response panel, 24px page gutters; text wraps without shrinking.
- Keyboard: native button, aria-pressed, visible focus; reduced-motion support.
- Fake guest Max; local state only. No APIs, saving, ticket, or full invitation.
- Review states: default /companion-arrow/ and /companion-arrow/?state=selected.
- Open design questions: none.
- Approval evidence: user approved R2 and the linked implementation design with “yes implement”.
