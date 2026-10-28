# Guest programme

## Cockpit collection: timeline

One record per guest-facing programme item:

| Field | Type | Content |
| --- | --- | --- |
| title | Text | Main heading, e.g. Empfang |
| subtitle | Text | Small label above the title, e.g. Ankommen; may be empty or null |
| description | Textarea | Short plain-text description; may be empty or null |
| start | Date with time enabled | Full date and time, including the next day's date for entries after midnight |

All four fields must be stored on each record. Cockpit supplies _id.
The API must return the collection as an array, like the existing guests collection.
There is no published field: **every record is guest-facing**. Keep organizer notes, private cues and surprises in a separate collection/document.
The website maps only these display fields and never exposes credentials or arbitrary additional fields.

## Dates
- Venue timezone: Europe/Berlin.
- A start such as 2026-11-14 19:00 (or 2026-11-14T19:00:00) is interpreted as venue-local time.
- ISO timestamps with Z/offset are converted to Europe/Berlin, including daylight saving.
- Use full dates to keep entries after midnight in chronological order.
- No hardcoded programme items or event date are shipped. The 19:00 start must be entered in Cockpit.

## Routes and editing
- /timeline is public and works without a guest ID.
- Invitations include “Programm ansehen” before RSVP. /timeline?id=... provides a return link to the same invitation.
- Edit records directly in Cockpit. Data is fetched server-side with the existing COCKPIT_API_URL and COCKPIT_API_KEY configuration and no persistent cache. Reload the page to see changes; there is no live push.
- Empty collections show “Das Programm folgt in Kürze.”
- Unavailable or invalid data shows a generic unavailable message, without partial/mockup events or upstream error details.
- No collection creation or live Cockpit writes were performed.

## Suggested copy (enter manually)
| Time | Title | Description |
| --- | --- | --- |
| 19:00 | Empfang | Erst mal ankommen, etwas trinken und Hallo sagen. |
| 19:15 | Abendessen | Wir essen gemeinsam. |
| 20:30 | Wir suchen den Superstar | Ihr auf der Bühne, wir in der Jury. Wir sind gespannt, was das wird. |
| 21:15 | Die letzten Jahre in einem Film | Wir haben unsere alten Fotos und Videos durchgeschaut. Einiges davon müssen wir euch zeigen. |
| 21:30 | Geburtstagstorte | Für ein Stück Torte ist noch Platz. |
| 22:00 | Musik & Tanz | Wer mag, tanzt. Wer nicht mag, bleibt sitzen und redet weiter. |

Only the 19:00 start was explicitly requested. Other times remain suggestions; confirm with Marco.
