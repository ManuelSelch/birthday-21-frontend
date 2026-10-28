# Guest videos — R1
- Status: in review. No approval for production implementation.
- Goal: mobile administration of the guest-level `video` boolean (at least one video received).
- Preserve navy/gold admin styling; add Übersicht/Videos view selection to avoid widening the mobile guest table.
- Videos view: received/total summary, search, Alle/Fehlt/Erhalten filters, individual labeled switches. All guests count, independent of RSVP.
- Summary and filter counts update immediately; changing a flag removes the row if it no longer matches the active filter.
- Sample guests only, local React state, resets on reload. No uploads, backend calls, persistence, real guest data or production edits.
- Overview is deliberately simplified to review view switching, not a replacement for the existing admin table. Other admin actions omitted.
- Mobile-first, centered at max 560px on larger viewports. Default URL: /guest-videos/.
- Open question: separate Videos view versus placing the flag in the existing guest editor.
