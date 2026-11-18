# Superstar birthday-app mockup

- Revision: 09. Status: approved for implementation (Birthday 21 direction only).
- Source: copied from `~/Downloads/mockups/superstar` revision 07; Downloads remains unchanged.
- Goal: fit the positive talent show into the birthday app's existing visual language, without production integration.
- Default: `/superstar/` or `?design=birthday`; original `pop`, `gala`, and `arcade` directions remain selectable for comparison.
- Scenes: `?scene=act|camera|vote|results|idle`, combinable with any design.

## Design and interactions

- Birthday direction uses the exact charcoal, champagne, ivory, muted text, and border tokens from `app/globals.css`.
- Georgia editorial headings, italic accent line, restrained portrait arch, fine borders, and real circular host portraits echo the invitation.
- Review controls use dark Mantine styling; birthday jury reactions and confetti use warm champagne tones.
- Preserve five projector scenes, six selectable acts, three 16:9 jury screens, portrait/name/showmotif modes, and projector-only view.
- Individual buzzer overlays and independent jury reactions last 3.2 seconds; repeated presses replay. Scene/act changes and reset clear projector overlays.
- Golden moment is separate, replayable, and remains until reset. No elimination, ranking, or automatic triple-buzzer behavior.
- Intro description, idea footer, and studio footer are removed per user feedback; show interactions remain unchanged.
- Controls stack below 1000px; design choices wrap into two columns on narrow screens. Reduced-motion preference suppresses animation.
- Agentation uses the local copy-and-paste annotation workflow only.

## Quick source review and limits

- Strengths: inclusive show concept, clear separation of projector/jury outputs, personal host reactions, useful scene coverage.
- Original mismatch: white control panel and three unrelated visual identities did not match the app's charcoal/champagne identity.
- Performer photos, camera feed, and vote totals remain simulated; host portraits are real copied assets from the original mockup.
- Fake local state only; no backend, camera permission, hardware, sound, display routing, synchronization, real voting, or persistence.
- Tentative acts and original reaction wording are unchanged. Actual hardware readability/safe areas remain an integration decision.
- Verification: HTTP/module serving checked; no browser automation or screenshots. Pipeline not required for mockup-only iteration.
- Approval: user explicitly approved revision 09 and requested a simple Birthday 21 implementation.
- Implementation scope: standalone `/superstar` page with existing local demo interactions; omit alternate design picker and annotation tooling. No existing app journeys change.
- Agent-owned mockup preview stopped and listener exit verified before implementation; approved files preserved.
