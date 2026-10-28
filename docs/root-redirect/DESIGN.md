# Root Redirect — Design

## Overview
Replace the empty root page with Next.js's server-side redirect to `/admin/login`. Keep existing authentication and invitation routes unchanged.

## Components
| Package/module | Component | Change | Responsibility |
|---|---|---|---|
| App Router | [Home](../../app/page.tsx) | Changed | Redirect root requests; no state |
| Admin login | [AdminLogin](../../app/admin/login/page.tsx) | Reused | Render login or redirect authenticated visitors using existing session state |

## Runtime flow
1. A visitor requests `/`.
2. Home calls Next.js `redirect` with `/admin/login`.
3. AdminLogin shows the login form, or forwards an authenticated visitor to the existing admin destination.

## Contracts & API changes
| Provider → consumer | Current → proposed contract | Compatibility |
|---|---|---|
| Root route → visitor | Empty page → temporary redirect to `/admin/login` | Intentional root behavior change |

Authentication cookies, protected routes, public invitations and API contracts remain unchanged.

## Decisions & Trade-offs
- Use the existing Next.js navigation API, without client JavaScript or new dependencies.
- Keep the redirect temporary rather than permanently caching a destination.
- No UI changes or new authentication logic.

## Verification
- Planned: verify the root component calls the redirect with the exact destination and run TypeScript checking.
- Confirm the existing authenticated-login redirect remains unchanged by inspection.

## Open Questions
None.
