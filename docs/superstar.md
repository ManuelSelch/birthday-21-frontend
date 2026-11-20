# Superstar

- Birthday 21 visuals follow approved [mockup revision 09](../mockups/superstar/DESIGN.md); the act screen follows the [approved beamer mockup](../mockups/superstar-act/DESIGN.md). No hardware, real camera, voting, or sound integration yet.
- All `/superstar` pages require the existing admin login. Open the live controller via **Superstar** on the guest page; it links to all four outputs.
- `/superstar/projector`: read-only beamer output. The act scene fits images without cropping; long text is bounded within its column.
- `/superstar/jury/manuel`, `/superstar/jury/marco`, `/superstar/jury/david`: read-only individual jury outputs. Unknown jurors return 404.
- Sign in on each separate browser or device, then move one browser window to each physical screen and enter browser fullscreen manually. Outputs fit a complete 16:9 composition with letterboxing rather than cropping.
- `/superstar` remains the independent local demo, including its scene query parameter; it never controls live screens.

## Live behavior

- Controller commands select a scene, act, jury idle mode (Porträts or Motive), individual buzzer, golden moment, or reaction reset. “Nur Beamer” affects only the controller's preview.
- Next.js owns live playback state in memory and broadcasts full snapshots (including the show catalogue) through public, read-only SSE. Reloading reconnects to the current show; restarting resets playback but reloads saved shows from Cockpit. Login protects pages, editing, uploads and image bytes, not SSE show text/asset references.
- Individual reactions expire independently after 3.2 seconds. Repeated presses restart that reaction; the beamer overlay shows all currently active jurors. Golden moment remains until reset or another relevant command.
- Disconnected outputs retain the last scene with a warning, expire transient artwork locally, and automatically catch up on reconnect. Controls are disabled while disconnected or submitting. Failed commands show an error and are never automatically replayed.
- Run **one persistent self-hosted Next.js process**, not serverless, multiple replicas, or cluster workers. No database or separate Node.js service is needed.
- **Shows bearbeiten** opens the approved compact editor in the controller. Draft edits and image previews are local until saved; saving updates connected screens without selecting another act or clearing jury reactions. With multiple images, **Beamerbild** selects the live image. Removing the selected image selects the first remaining image.
- Catalogue storage: [Cockpit schema, permissions and upload setup](superstar-cockpit.md). The catalogue loads once per process; edits through this editor publish immediately. Out-of-band CMS edits require a server restart. Failed reads retry on the next request; failed/unconfirmed saves do not publish changes. Concurrent saves are serialized, with the last confirmed save winning.
- Use HTTPS for a remote controller: the existing admin session cookie is Secure in production. Localhost can be used for local review.
- Reverse proxies must allow long-lived SSE connections and disable response buffering; the event route sends keepalives and no-cache/no-buffer headers.

## Structure and checks

- `features/superstar/app/catalogue-service.ts` loads and serializes confirmed Cockpit catalogue writes; `infra/cockpit-catalogue.ts` owns credentialed CMS requests and image streaming. `app/use-show-editor.ts` owns draft, navigation guards and upload/save state; UI components render values and callbacks.
- `features/superstar/app/show-service.ts` owns state, subscriptions, revision counters, and expiry timers. `server.ts` keeps one process-wide singleton shared by the command/event route bundles.
- `app/use-live-show.ts` owns EventSource lifecycle and command submission; components only render values and callbacks. Session IDs distinguish server restarts; server timestamps avoid relying on display wall clocks.
- The demo and controller client pages compose the shared header, intro, preview and controls directly; the controller also provides live navigation and editing.
- [Protocol](superstar-protocol.md), [state/service tests](../tests/features/superstar/), [HTTP scenarios](../tests/integration/superstar.test.ts), and [multi-screen UI scenarios](../tests/ui/superstar-live.spec.ts), and [editor scenarios](../tests/ui/superstar-editor.spec.ts).
- Production checks: build with `NEXT_TEST_DIST_DIR=.next-admin-build`, then run `ADMIN_TEST_PRODUCTION=1 npm run test:ui -- superstar-live.spec.ts`. Browser geometry checks do not replace visual approval.
