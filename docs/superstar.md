# Superstar

- Birthday 21 visuals follow approved [mockup revision 09](../mockups/superstar/DESIGN.md). No hardware, real camera, voting, or sound integration yet.
- `/superstar/control`: live controller, protected by the existing admin login. Opens links to all four outputs.
- `/superstar/projector`: public, read-only beamer output.
- `/superstar/jury/manuel`, `/superstar/jury/marco`, `/superstar/jury/david`: public, read-only individual jury outputs. Unknown jurors return 404.
- Move one browser window to each physical screen and enter browser fullscreen manually. Outputs fit a complete 16:9 composition with letterboxing rather than cropping.
- `/superstar` remains the independent local demo, including its scene query parameter; it never controls live screens.

## Live behavior

- Controller commands select a scene, act, jury idle mode, individual buzzer, golden moment, or reaction reset. “Nur Beamer” affects only the controller's preview.
- Next.js owns shared state in memory and broadcasts full snapshots through SSE. Reloading any page reconnects to the current show; restarting the server resets it.
- Individual reactions expire independently after 3.2 seconds. Repeated presses restart that reaction; the newest juror owns the beamer overlay. Golden moment remains until reset or another relevant command.
- Disconnected outputs retain the last scene with a warning, expire transient artwork locally, and automatically catch up on reconnect. Controls are disabled while disconnected or submitting. Failed commands show an error and are never automatically replayed.
- Run **one persistent self-hosted Next.js process**, not serverless, multiple replicas, or cluster workers. No database or separate Node.js service is needed.
- Use HTTPS for a remote controller: the existing admin session cookie is Secure in production. Localhost can be used for local review.
- Reverse proxies must allow long-lived SSE connections and disable response buffering; the event route sends keepalives and no-cache/no-buffer headers.

## Structure and checks

- `features/superstar/app/show-service.ts` owns state, subscriptions, revision counters, and expiry timers. `server.ts` keeps one process-wide singleton shared by the command/event route bundles.
- `app/use-live-show.ts` owns EventSource lifecycle and command submission; components only render values and callbacks. Session IDs distinguish server restarts; server timestamps avoid relying on display wall clocks.
- [Protocol](superstar-protocol.md), [state/service tests](../tests/features/superstar/), [HTTP scenarios](../tests/integration/superstar.test.ts), and [multi-screen UI scenarios](../tests/ui/superstar-live.spec.ts).
- Production checks: build with `NEXT_TEST_DIST_DIR=.next-admin-build`, then run `ADMIN_TEST_PRODUCTION=1 npm run test:ui -- superstar-live.spec.ts`. Browser geometry checks do not replace visual approval.
