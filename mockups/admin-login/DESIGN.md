# Admin Login Mockup

- Revision: 3.
- Review status: in review; no UI approval yet.
- Scope: small German-language shared-password login, with a minimal logout control. The login header reads “21. Geburtstag” and “Admin-Anmeldung”; omit the Organisation label, introductory description, and Orga-Team footer as requested.
- Layout: quiet light admin styling using the existing pages' Mantine blue scheme for the button, focus indicators, links, card accent, and lock mark. One centered card, fluid width on mobile. Error and rate-limit alerts retain semantic red/orange colors.
- Interactions: keyboard-submit password form, password visibility control, simulated loading/error, successful fake login and logout.
- States: `?state=idle`, `?state=error`, `?state=loading`, `?state=limited`, `?state=authenticated`.
- Test password: `demo`. Any other nonempty value shows a generic error.
- Fake behavior: all data and authentication are local React state; no APIs, secrets, persistence, camera, or real session. Review links and fake guest table are not production features.
- Outstanding decision: approve the login layout and minimal logout placement.
- Approval evidence: the user requested the existing pages' blue color scheme. Revision 3 also removes the requested secondary copy; explicit approval for implementation is still pending.
