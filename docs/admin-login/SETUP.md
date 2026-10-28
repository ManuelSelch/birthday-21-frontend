# Admin login setup

## Configure locally

- Keep the existing Cockpit variables. Add these **server-only** values to your local `.env` yourself; never commit real values:

  ```dotenv
  APP_ORIGIN=http://localhost:3000
  ADMIN_PASSWORD_HASH=replace-with-generated-scrypt-hash
  ADMIN_SESSION_SECRET=replace-with-independent-random-secret
  ```

- Generate the password hash without putting the actual password into shell history. In Bash or Zsh, run these commands separately:

  ```bash
  read -rs ADMIN_PASSWORD
  # Type the shared password (at least 12 characters), then press Enter.
  printf '%s' "$ADMIN_PASSWORD" | node scripts/hash-admin-password.mjs
  unset ADMIN_PASSWORD
  ```

  Copy the complete `scrypt:...` output into `ADMIN_PASSWORD_HASH`. Do not store the plain password in the file.

- Generate an independent session secret:

  ```bash
  node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
  ```

  Copy the output into `ADMIN_SESSION_SECRET`. Keep both values private.

- Restart `npm run dev`, then open `http://localhost:3000/admin/login`.
- Use exactly the origin configured in `APP_ORIGIN`. Do not include a trailing slash or path. In development, prefer `localhost` consistently rather than switching between it and `127.0.0.1`; Next normalizes loopback addresses in redirects.
- Missing or invalid configuration disables login and denies protected access. Guest invitations remain public.

## Production

- Set `APP_ORIGIN` to the exact public HTTPS origin, for example `https://geburtstag.example.com`.
- Before public deployment, address the existing dependency vulnerabilities: the current `npm audit` flags the pinned Next.js 16.0.0 as critical. This login change does not upgrade the framework or resolve those advisories.
- Configure both secrets on the server and restart the **single** PM2 process with refreshed environment values. Ensure your deployment runs the current production build.
- HTTPS is required in production; sessions use Secure, HttpOnly, SameSite=Lax cookies with a fixed 12-hour expiry.
- Authenticated access is required for all `/admin` pages except login and for the guest-list, points, and check-in APIs. Administrative writes use POST and validate the browser Origin against `APP_ORIGIN`; missing or mismatched origins are rejected.
- The process permits 10 login attempts total per 15-minute window, including successful attempts. Rejected attempts return 429 with Retry-After. This is intentionally shared across organizers; it can temporarily block everyone. Restarting the process clears the attempt budget. Do not add workers/replicas without introducing a shared limiter.

## Rotation and logout

- To change the shared password, generate and configure a new hash, then restart the process.
- To revoke all existing sessions, rotate `ADMIN_SESSION_SECRET` and restart. Changing the configured password hash also invalidates existing sessions.
- Logout clears the session cookie in that browser. It cannot independently revoke a copied/stolen cookie; rotate a configured secret in that situation.
- Guest invitation IDs, Cockpit API keys, Wallet certificates, and existing public guest-link permissions are outside this login feature. This is not a complete security audit of the application.

## Verification

```bash
npm ci
npm test
npx playwright install chromium
npm run test:ui
npm run typecheck
npm run lint
npm run build
```

- Browser tests start isolated Next and fake-Cockpit servers on ports 3187 and 3188, using fake credentials and guest data. They do not contact the configured live Cockpit.
- To smoke-test production page/API guards without contacting Cockpit, run `NEXT_TEST_DIST_DIR=.next-admin-build npm run build`, then `ADMIN_TEST_PRODUCTION=1 npm run test:ui`. This checks unauthenticated production access; the full interactive browser suite uses development mode.
- Test build output lives in `.next-admin-tests`, separate from normal development output. The approved source mockup remains under `mockups/admin-login`; it is not used for real authentication.
