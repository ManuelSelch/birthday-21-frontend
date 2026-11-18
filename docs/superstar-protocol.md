# Superstar protocol

- `POST /api/superstar/commands`: existing admin session required; JSON only, same-origin browser requests, maximum 2048 bytes. Invalid commands return 400, unauthenticated requests 401, foreign origins 403, oversized bodies 413, and non-JSON bodies 415. No command queue or automatic retry.
- Commands contain exactly these fields:
  - `{ "type": "scene", "scene": "act|camera|vote|results|idle" }` (choose one value).
  - `{ "type": "performer", "index": 0 }` (zero-based catalog index, currently 0–5).
  - `{ "type": "buzz", "index": 0 }` (0 Manuel, 1 Marco, 2 David).
  - `{ "type": "mode", "mode": "names|portraits|art" }` (choose one value).
  - `{ "type": "golden" }` or `{ "type": "reset" }`.
- A successful command returns a complete snapshot; clients render the SSE stream rather than optimistically applying commands.
- `GET /api/superstar/events`: public, read-only SSE. Emits named `snapshot` events immediately on connection and after state changes/expiry, a 15-second heartbeat comment, and a 1500ms reconnect hint. Slow consumers are disconnected instead of buffering indefinitely; disconnect/cancel removes subscriptions and heartbeat timers.
- Snapshot fields: `sessionId`, increasing `revision`, `serverTime` (Unix milliseconds), `state`, three `juryExpiresAt` timestamps, and `reactionExpiresAt`. Inactive expiries are null. `state` includes scene, act index, active jury flags, celebration flag, animation burst ID, projector reaction index, jury mode, and `solo: false` (preview-only locally).
- SSE event IDs combine session ID and revision. There is no historical replay: every reconnect receives a fresh full snapshot, even when `Last-Event-ID` is supplied.
- Commands are applied serially by the Node.js event loop; the latest command wins. Display clocks use elapsed time since snapshot receipt to hide expired reactions while disconnected.
