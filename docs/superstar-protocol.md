# Superstar protocol

- `POST /api/superstar/buzzer/{name}`: device-only endpoint; names are exactly `manuel`, `marco`, `david`. Requires `Authorization: Bearer <SUPERSTAR_BUZZER_API_KEY>`, not an admin cookie. No body or Content-Type required; body contents are ignored. Each successful request triggers the existing live buzzer and SSE broadcast, including repeated presses.
- Device responses: 200 with `{"ok":true}`, missing/invalid key 401, unknown name 404, missing/empty server configuration 503, catalogue failure 502; all are no-store. Only POST is exported. The key does not authorize admin commands, editing, uploads or pages.
- Configure a dedicated random server key (generate with `openssl rand -hex 32`), then put the same value in the ESP's ignored `config.h`. Use HTTPS with certificate verification; never put the key in URLs, logs or Git. Restart the server after changing its environment; update the ESP when rotating the key. Never automatically retry requests: a lost response may still mean the buzzer fired.

- `POST /api/superstar/commands`: existing admin session required; JSON only, same-origin browser requests, maximum 2048 bytes. Invalid commands return 400, unauthenticated requests 401, foreign origins 403, oversized bodies 413, and non-JSON bodies 415. No command queue or automatic retry.
- Commands contain exactly these fields:
  - `{ "type": "scene", "scene": "act|camera|vote|results|idle" }` (choose one value).
  - `{ "type": "performer", "index": 0 }` (zero-based index in the snapshot's CMS catalogue).
  - `{ "type": "image", "index": 0 }` (zero-based image index of the selected show; preserves jury reactions).
  - `{ "type": "buzz", "index": 0 }` (0 Manuel, 1 Marco, 2 David).
  - `{ "type": "mode", "mode": "portraits|art" }` (choose one value).
  - `{ "type": "golden" }` or `{ "type": "reset" }`.
- A successful command returns a complete snapshot; clients render the SSE stream rather than optimistically applying commands.
- `GET /api/superstar/events`: public, read-only SSE. Emits named `snapshot` events immediately on connection and after state changes/expiry, a 15-second heartbeat comment, and a 1500ms reconnect hint. Slow consumers are disconnected instead of buffering indefinitely; disconnect/cancel removes subscriptions and heartbeat timers.
- Snapshot fields: `sessionId`, increasing `revision`, `serverTime` (Unix milliseconds), `shows` (validated catalogue), `state`, three `juryExpiresAt` timestamps, and `reactionExpiresAt`. Inactive expiries are null. `state` includes scene, act index, image index, active jury flags, celebration flag, animation burst ID, projector reaction index, jury mode, and `solo: false` (preview-only locally).
- SSE event IDs combine session ID and revision. There is no historical replay: every reconnect receives a fresh full snapshot, even when `Last-Event-ID` is supplied.
- `GET /api/superstar/shows`: authenticated, no-store catalogue; CMS failure returns 502. `POST` creates or updates by `_id`; same-origin JSON, max. 32 KiB, validates fields/assets, ignores caller ordering, rejects unknown IDs (404), confirms upstream response before publication. Invalid body 400, unauthorized 401, origin 403, size 413, media type 415, upstream/unconfirmed save 502.
- `POST /api/superstar/images`: authenticated, same-origin multipart with one `file`; 10 MB file limit and 64 KiB multipart allowance. Validates JPEG/PNG/WebP signatures; invalid input 400, missing upload configuration 503, upstream failure 502. `GET /api/superstar/images/{id}` proxies authenticated image bytes without exposing Cockpit credentials. See [upload setup](superstar-cockpit.md).
- Commands are applied serially by the Node.js event loop; the latest command wins. Display clocks use elapsed time since snapshot receipt to hide expired reactions while disconnected.
