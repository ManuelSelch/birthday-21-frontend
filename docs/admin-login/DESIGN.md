# Birthday Admin Login — Design

## Overview
Add a shared-password login and server-validated sessions around the existing Next.js admin area. Public guest links remain unchanged. The user approved the isolated [revision 3 mockup](../../mockups/admin-login/DESIGN.md): a small German-language Mantine form with the existing blue color scheme, reduced copy, and minimal logout control.

## Components
| Package/module | Component | Change | Responsibility |
|---|---|---|---|
| Proposed `features/admin-auth/domain` | Session and return-path rules | New | Fixed expiry and safe internal destinations |
| Proposed `features/admin-auth/infra` | Credential/session crypto and attempt counter | New | Node crypto, server-only configuration, process-owned attempt state |
| Proposed `features/admin-auth/app` | Authentication operations | New | Coordinate verification, cookie lifecycle, guards, and origin checks |
| Proposed `features/admin-auth/ui` | Login container, form, logout control | New | Container owns submission/navigation; components receive values and callbacks |
| Next route wiring | Proposed `proxy.ts`, auth handlers, admin layout | New | Guard all admin page requests before rendering; exempt only login; wire feature operations |
| Existing [API routes](../../app/api) and [client API](../../lib/api.ts) | Guests, points, check-in | Changed | Independently authorize requests; submit points by POST |
| Existing [Cockpit client](../../lib/cockpit.ts) | Guest persistence | Reused | Access data only after authorization |

## Runtime flow
1. An unauthenticated admin page request reaches the page guard and redirects to login with a validated admin return destination, before rendering or Cockpit access.
2. Login submits the password to the authentication handler. It checks same-origin submission and the attempt limit, then verifies the stored password hash.
3. Success sets a signed, 12-hour cookie and navigates to the safe destination, defaulting to `/admin/guests`. Failure shows a generic error; limited attempts receive a retry time.
4. Every administrative API handler independently validates the session before data access. The protected admin layout supplies logout; it is separate from the public login route using a route group.
5. Logout checks origin, expires the cookie, and returns to login. Expired or tampered sessions are rejected; public invitation flows bypass admin authentication.

## Contracts & API changes
| Provider → consumer | Current → proposed contract | Compatibility |
|---|---|---|
| Auth handlers → login/logout UI | None → POST `/api/admin/login` and `/api/admin/logout`; generic failure, 429 with Retry-After, unavailable configuration fails closed | New; no passwords in URLs |
| Admin pages → browser | Public → session required; redirect unauthenticated requests | Intentional access restriction |
| Guest-list API → client | Public array → same array for admins; otherwise 401 | Intentional access restriction |
| Points API → client | GET query mutation → authenticated POST JSON with guest ID and finite numeric points; GET returns 405 | Caller updated together; no legacy fallback |
| Check-in API → scanner | Public POST → authenticated same-origin POST; existing success/warning payload retained | Intentional access restriction |
| Guest invitation APIs → guests | Current links and payloads → unchanged | No guest login introduced |

## Decisions & Trade-offs
- Reuse Node crypto rather than add an authentication framework for one shared identity. Store a salted scrypt hash in server-only `ADMIN_PASSWORD_HASH` and an independent random `ADMIN_SESSION_SECRET`; document generation without committing actual values.
- HMAC-signed sessions contain issued/expiry timestamps and a credential-version fingerprint. Verify signatures with timing-safe comparison and reject invalid timestamps. Rotating either configured secret invalidates existing sessions. Logout clears this browser's cookie; it cannot revoke a copied token independently.
- Cookie: HttpOnly, SameSite=Lax, Path=/, no Domain, Secure in production; development permits loopback HTTP. Protected responses and auth responses are not cached.
- Require exact configured `APP_ORIGIN` for state-changing admin/auth requests; reject missing/mismatched Origin. Do not trust arbitrary forwarded headers or support cross-origin admin clients.
- Proposed limiter: at most 10 login attempts per 15-minute fixed window globally per process, counting successful and failed attempts. Avoid trusting client-supplied IP headers. This tiny shared-admin deployment accepts temporary global lockout as a trade-off.
- Confirmed deployment: one PM2/Node process on one server, without clustering or replicas. The limiter resets on restart and cannot coordinate multiple workers. Multiple replicas require a revised shared limiter design.
- Keep new feature code inside its slice; Next route files are thin wiring. Do not restructure unrelated invitation code or add user databases.

## Verification
- Planned unit tests: password hashes, cookie signatures, fixed expiry, credential rotation, safe redirects, attempt-window boundaries, and origin rejection.
- Planned driven integration tests: guards run before Cockpit, unauthorized APIs return 401 without writes, points GET cannot mutate, login/logout statuses and cookie flags.
- Planned driven browser tests: keyboard login, generic errors, safe return navigation, logout, mobile layout, and unchanged public invitations against isolated fake Cockpit data.
- Run the available lint/build checks and new scoped tests, reporting unrelated existing failures separately. No production behavior has been implemented or verified yet.

## Open Questions
None. The user approved implementation and confirmed single-process deployment.
