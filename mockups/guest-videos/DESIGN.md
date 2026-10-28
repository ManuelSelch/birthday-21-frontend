# Guest videos — R4
- Status: in review. No approval for production implementation.
- Goal: mobile administration of the guest-level `video` boolean (at least one video available for that guest). Guests do not submit the videos themselves; use neutral availability wording, not receipt/submission wording.
- Preserve navy/gold admin styling; add Übersicht/Videos view selection to avoid widening the mobile guest table.
- Videos view: no progress overview or explanatory switch footnote; search, Alle/Fehlt/Vorhanden filters, individual switches with accessible labels and no status text below the toggles. All guests count, independent of RSVP.
- Filter counts update immediately; changing a flag removes the row if it no longer matches the active filter.
- Sample guests only, local React state, resets on reload. No uploads, backend calls, persistence, real guest data or production edits.
- Overview is deliberately simplified to review view switching, not a replacement for the existing admin table. Other admin actions omitted.
- Mobile-first, centered at max 560px on larger viewports. Default URL: /guest-videos/.
- Open question: separate Videos view versus placing the flag in the existing guest editor.
