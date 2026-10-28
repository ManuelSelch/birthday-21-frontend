# Guest video flag

- Cockpit collection: `guests`; field: `video` (Boolean).
- Every existing guest must have a stored `true` or `false` value. Cockpit field defaults do not backfill existing records. Preserve existing true flags when populating missing values.
- New guests start with `video: false`.
- Admin → Gäste → Videos: use the same name search and Group/Host dropdowns as the overview (values are shared between views), filter Alle/Fehlt/Vorhanden, toggle whether at least one video is available for that guest. This does not mean guests submit videos.
- POST `/api/guests/video` requires the existing admin session and an `{ id, video }` body. Only `_id` and `video` are written; other guest fields remain unchanged.
- No upload, media storage or guest-facing changes. No live Cockpit data has been read or modified by this implementation.
