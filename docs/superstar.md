# Superstar

- Open `/superstar` for the Birthday 21 show demo, based on approved [mockup revision 09](../mockups/superstar/DESIGN.md).
- Public page; no login required. Controls affect only the current browser tab.
- Choose an act and one of five scenes: performance, simulated camera, voting preview, invented results, or pause. `?scene=act|camera|vote|results|idle` opens a scene directly; invalid values default to performance.
- Jury buzzers show independent 3.2-second compliments. The latest buzzer appears on the projector; repeated presses restart that reaction. Golden moment stays until reset or a scene/act change.
- Jury idle modes: portraits, names, or show motif. “Nur Beamer” hides controls and jury previews; the switch remains available to exit.
- No camera access, real votes, hardware, sound, output routing, backend requests, synchronization, or saved show state. Reload resets everything except the scene in the URL.

## Structure and verification

- `app/superstar/page.tsx` validates the query and renders the client container.
- `features/superstar/domain/show.ts` owns pure state transitions; `app/use-show.ts` owns tab-local state, timers, cleanup, and scene URL updates.
- UI components receive values/callbacks. Scoped styles reuse global site tokens; host portraits are local feature assets. No mockup imports, alternate themes, or annotation tooling ship with this page.
- [State tests](../tests/features/superstar/domain/show.test.ts) and [UI scenarios](../tests/ui/superstar.spec.ts) cover scenes, controls, reaction timing, and narrow/tablet/desktop geometry. Geometry assertions are not visual screenshot approval.
