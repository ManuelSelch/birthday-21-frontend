# Birthday Admin Login — Requirements

## Goal
Provide a simple shared-password login for the party admin pages, without password hashes or complex configuration. This simplified scope replaces the earlier security-heavy requirements at the user's request.

## Requirements
- **R1** — Keep the approved blue `/admin/login` page with a password field, submit/loading state, and a generic wrong-password error.
- **R2** — Require login for `/admin` and nested admin pages except login. Return to the requested admin page after login, defaulting to guests; accept only internal admin destinations.
- **R3** — Keep login checks for the guest-list, points, and check-in APIs before Cockpit access.
- **R4** — Keep guest invitation viewing, attendance responses, companion selection, invited tracking, and Wallet access public.
- **R5** — Compare the submitted password directly against server-only `ADMIN_PASSWORD`. No password hashing, minimum length policy, additional secret, or custom origin configuration. A missing or empty password does not permit login.
- **R6** — Retain a 12-hour login cookie and logout. Keep the password itself out of the browser cookie. Password changes invalidate existing cookies.
- **R7** — Remove rate limiting and custom cross-site checks. Administrative mutations remain POST; do not change public guest endpoints.
- **R8** — Document only `ADMIN_PASSWORD=your-party-password` and restarting the app. Remove the hash-generation script and obsolete configuration instructions. Do not read, edit, or commit the real `.env`.
- **R9** — Verify valid/wrong/missing passwords, cookies, logout, expiry, admin access, safe returns, and public invitations. Reuse the approved UI without another mockup.

## Assumptions
- One shared password is sufficient; no individual accounts, roles, registration, or password-reset flow.
- The existing 12-hour session and admin functionality stay unchanged.
- The user explicitly approved the simpler technical design and accepts removing rate limiting and custom origin enforcement.

## Implementation Plan
### S1 — Approve Login Scope and UI
Description: Completed. Reuse the approved blue UI and the approved simplified design; no new mockup.

### S2 — Add Login and Session Lifecycle
Description: Simplify password verification and cookie handling; remove hashing, extra configuration, and the attempt limiter. Verify R5–R7 with focused tests.

### S3 — Protect Admin Pages and APIs
Description: Preserve existing page/API checks and navigation while adapting them to the plain-password session helper. Verify R2–R4 and unchanged administrative POST behavior.

### S4 — Verify and Document Setup
Description: Replace obsolete tests/instructions, document the single environment variable, and run the focused tests, browser suite, typecheck, and build. Implements R8–R9.

## Open Questions
- **Q1 — Resolved** — Use one shared admin password, as approved by the user.
- **Q2 — Resolved** — The user rejected the earlier complexity and approved a plain `ADMIN_PASSWORD` with no hashing or extra authentication configuration.
