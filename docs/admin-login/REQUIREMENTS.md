# Birthday Admin Login — Requirements

## Goal
Provide a small admin login for birthday-party management, preventing unauthenticated access to guest lists, check-in, and points management without disrupting public invitations.

## Requirements
- **R1** — Provide a public `/admin/login` page with a password field, submit button, loading state, and a generic invalid-credentials error. Never display or log credentials. The page must work on mobile and support keyboard submission and an accessible field label.
- **R2** — Require an authenticated admin session for `/admin` and every nested admin page except `/admin/login`, including guests, orders, points, and scanner. Unauthenticated page requests redirect to login before protected content is fetched or rendered. Successful login returns to the requested admin page, or `/admin/guests` by default; return destinations must remain within the protected admin area.
- **R3** — Independently require admin authentication for `/api/guests`, `/api/points`, and `/api/check-in`. Unauthenticated requests return HTTP 401 without reading or changing Cockpit data; protecting pages alone is insufficient.
- **R4** — Keep guest invitation viewing, acceptance, cancellation, companion selection, invited-status tracking, and Apple Wallet access public under their existing guest-link behavior. Do not require guests to log in. This scope does not redesign guest-link authorization.
- **R5** — Maintain authentication with a server-validated, tamper-resistant, expiring session in an HttpOnly cookie, using Secure cookies in production and a SameSite policy. Do not store admin credentials or session tokens in browser local storage or expose secrets through public environment variables. Missing authentication configuration must fail closed.
- **R6** — Provide logout from authenticated admin pages. Logout clears the browser session; subsequent protected requests from that browser are denied. Use a fixed session expiry, provisionally 12 hours, without silently extending it indefinitely.
- **R7** — Protect login against repeated password guessing with a documented attempt limit and retry response. State-changing authentication and administrative operations must reject inappropriate cross-site requests and must not mutate state through GET requests. Preserve public guest endpoints outside this administrative scope.
- **R8** — Document server-only authentication configuration using placeholders, local setup, production HTTPS requirements, password rotation, and the limits of the chosen session/logout behavior. Do not commit actual secrets or reuse the Cockpit API key as the login password.
- **R9** — Verify invalid and valid login, direct protected-page access, direct API access, logout, expired/tampered sessions, safe redirects, attempt limiting, cross-site rejection, and continued public invitation access. No production implementation begins before a technical design is approved; the new login UI also requires an approved isolated mockup.

## Assumptions
- Confirmed in Q1: use one shared admin password. Individual accounts, roles, registration, password-reset emails, and Cockpit-user authentication are out of scope.
- A 12-hour fixed session is suitable for party-day use. Per-device remote revocation and forced logout of all sessions are outside this small initial scope; the design must explain credential-rotation effects.
- Existing admin features and the casino theme remain unchanged apart from the login and a minimal logout control.
- The deployment will serve production traffic over HTTPS. The design must establish deployment topology before selecting an effective login-attempt limiter.

## Implementation Plan
### S1 — Approve Login Scope and UI
Description: Resolve Q1, create an isolated mobile-friendly login mockup with password, loading/error states, and a minimal logout placement, and obtain explicit UI approval. Write and present `docs/admin-login/DESIGN.md` covering credentials, sessions, page/API protection, cross-site safeguards, attempt limiting, and deployment assumptions; obtain explicit design approval before production changes. Implements the approval prerequisite in R9 and prepares R1–R8. Verify by recording the agreed behavior and approvals, not by changing production code.

### S2 — Add Login and Session Lifecycle
Description: After S1, implement the approved login page, credential verification, session issuance/validation, expiry, logout behavior, and login-attempt/cross-site safeguards. Implements R1, R5, R6, and authentication-related parts of R7. Verify valid/invalid credentials, missing configuration, tampered/expired cookies, repeated attempts, and logout with focused automated tests.

### S3 — Protect Admin Pages and APIs
Description: After S2, enforce authentication before loading admin data and independently on the three administrative API routes. Add a minimal logout control, safe return navigation, and non-GET administrative mutations with matching caller updates. Implements R2–R4 and remaining R7 behavior. Verify unauthenticated direct access is denied, authenticated guests/points/scanner flows work, external return targets are rejected, and public invitation flows remain usable.

### S4 — Verify and Document Setup
Description: After S3, complete end-to-end coverage for R9 and add concise placeholder-only configuration and deployment instructions for R8. Verify the protected browser/API flows and public invitation regression checks; run available project checks and report failures accurately. Do not modify or commit real environment secrets.

## Open Questions
- **Q1 — Resolved** — Is one shared admin password enough, or do you need separate logins for each organizer? Resolution: the user approved the recommended single shared admin password and requirements plan. Technical design and mockup approval remain separate.
