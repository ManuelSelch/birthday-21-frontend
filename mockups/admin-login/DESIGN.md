# Admin Login Mockup

- Revision: 1.
- Review status: in review; no UI approval yet.
- Scope: small German-language shared-password login, with a minimal logout control.
- Layout: quiet light admin styling matching the existing Mantine admin pages; amber accent recalls the invitation theme. One centered card, fluid width on mobile.
- Interactions: keyboard-submit password form, password visibility control, simulated loading/error, successful fake login and logout.
- States: `?state=idle`, `?state=error`, `?state=loading`, `?state=limited`, `?state=authenticated`.
- Test password: `demo`. Any other nonempty value shows a generic error.
- Fake behavior: all data and authentication are local React state; no APIs, secrets, persistence, camera, or real session. Review links and fake guest table are not production features.
- Outstanding decision: approve the login layout and minimal logout placement.
- Approval evidence: none. The earlier approval covered requirements and one shared password, not this revision.
