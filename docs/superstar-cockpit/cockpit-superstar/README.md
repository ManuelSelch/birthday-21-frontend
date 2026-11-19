# Cockpit Superstar upload addon

- Adapted from the existing website-2026 `cockpit-portfolio` uploader. Independent of that addon; no project-authoring hooks.
- Copy this whole `cockpit-superstar` directory into Cockpit's active `addons/` directory. Keep `bootstrap.php` and `api/upload.post.php` in place; do not copy the handler to `config/api/`.
- Reload Cockpit/PHP-FPM if OPcache retains old code.
- Create exactly one **root Assets folder named `superstar`**. The endpoint resolves its ID; it never uses the website's `projects` folder.
- Grant the server API-key role `assets/upload`, plus asset metadata/image-read access. Never grant uploads to the public role. No extra shared secret is needed.
- Set frontend server environment `COCKPIT_ASSET_UPLOAD_PATH=/superstar/upload`; restart the frontend. Existing `COCKPIT_API_URL` already ends in `/api`; the complete CMS route is `POST /api/superstar/upload`.
- Requires PHP 8.1+, Fileinfo, image inspection, writable asset storage, and PHP/proxy limits above 10 MiB (`post_max_size` greater than `upload_max_filesize`).
- Contract: one multipart `file`, `api-key` header, native `{ asset: {...} }` response; identical bytes in the Superstar folder return `{ asset: {...}, reused: true }`.
- Accepts PNG/JPEG/WebP, up to 10 MiB and 20 megapixels. No remote URLs, arbitrary folders, replacement or deletion.
- After installation, try one upload in **Superstar → Shows bearbeiten**, save, then select the show/image live. Failed responses can follow successful storage: inspect Assets before retrying.

## Host verification

- Run from this addon directory: `php -l bootstrap.php`, `php -l api/upload.post.php`, then `php tests/routes.php`.
- The route test checks app context, registration, method, header/override and role guards without CMS access or writes. Actual image storage requires a live installation.
- PHP execution and live deployment have not been verified in this frontend environment; PHP is unavailable locally.
