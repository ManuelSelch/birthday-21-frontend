# Birthday Admin Login — Design

## Overview
Simplify the existing login to one server-only environment variable: `ADMIN_PASSWORD`, containing the plain shared password. Keep the approved blue login page, logout, and existing admin page/API guards. This replaces the earlier security-heavy design at the user's request.

## Components
| Package/module | Component | Change | Responsibility |
|---|---|---|---|
| `features/admin-auth/infra` | Small session helper | Changed | Compare the submitted password directly against `ADMIN_PASSWORD`; create and verify the login cookie using the already-installed `jsonwebtoken` package |
| `features/admin-auth/app/http.ts` | Login/logout and guards | Simplified | Handle password submission, cookie creation/clearing, and access checks without a dependency factory or rate limiter |
| Existing login/logout UI and route wiring | Form, proxy, handlers | Reused | Preserve the approved appearance and navigation; remove rate-limit UI |

## Runtime flow
1. Submit the password to the existing login endpoint.
2. Compare it directly with `ADMIN_PASSWORD`; a missing/empty setting does not permit login.
3. On success, set an HttpOnly cookie valid for 12 hours and open the requested admin page. Wrong passwords show the existing error.
4. Page/API guards check the cookie. Logout clears it. Guest invitations remain public.

## Contracts & API changes
- Configuration becomes only `ADMIN_PASSWORD=your-party-password`; remove `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET`, and `APP_ORIGIN` from the authentication implementation and instructions. Do not read or modify the real `.env`.
- Existing login/logout endpoints and protected routes stay the same. Points remains POST.
- Remove the hash-generation script, password-hashing code, configuration validator, attempt limiter, and their obsolete tests. No fallback for the old configuration.

## Decisions & Trade-offs
- Password verification is a plain string comparison: no password hashing or password-generation steps.
- Use the configured password directly as the signing key for the existing JWT library. This is internal cookie handling, not a hash the user must generate or configure. It avoids storing the actual password in the browser, an extra secret, and session-storage infrastructure.
- Remove custom origin enforcement and brute-force protection as requested. Retain basic cookie flags, expiry, and safe internal return paths because they require little code.
- Password changes invalidate existing cookies. The approved UI needs no new mockup.

## Verification
- Update the existing tests for direct-password login, wrong/missing passwords, cookie expiry, logout, protected routes, and public invitations.
- Run the focused tests, browser tests, typecheck, and build. Preserve unrelated Wallet/certificate changes in the working tree.

## Open Questions
None.
