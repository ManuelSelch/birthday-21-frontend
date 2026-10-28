# Admin login setup

- Add one server-only value to your existing `.env` yourself:

  ```dotenv
  ADMIN_PASSWORD=your-party-password
  ```

- Keep your Cockpit settings. No password hash, separate session secret, or origin setting is needed.
- Restart the app, then open `/admin/login` and enter that password.
- Login lasts 12 hours; **Abmelden** logs out. Changing the password and restarting invalidates existing logins.
- A missing or empty password disables login. Never use `NEXT_PUBLIC_ADMIN_PASSWORD` or commit your real `.env`.
- Production cookies require HTTPS. Guest invitations remain public.
