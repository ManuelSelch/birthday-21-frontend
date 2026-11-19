# Superstar Cockpit setup

- Collection: `superstarShows`; API responses must be arrays. Cockpit supplies `_id`.
- Required fields: `name` (Text, 1–100 characters), `title` (Text, 1–160), `description` (multiline plain Text, empty allowed, max. 500), `sortOrder` (nonnegative integer), `images` (Object containing a JSON array, “as string” off, default `[]`).
- Each image is a Cockpit asset reference containing `_id` and `path`. Full asset metadata is accepted and reduced to these two fields. A single asset object is not an array; resave existing records after model changes.
- Limits: 200 shows, 20 images per show, JPG/PNG/WebP, 10 MB per image. New shows append; editing preserves ordering. No show deletion or reordering UI.
- Existing server-only `COCKPIT_API_URL` and `COCKPIT_API_KEY` are reused. Allow collection read/create/update and asset metadata/image reads. Never expose the API key in a browser or image URL.
- Production uses only CMS records; it does not seed, migrate or fall back to the six demo acts.

## Upload endpoint

- Install the [standalone `cockpit-superstar` addon](superstar-cockpit/cockpit-superstar/README.md), adapted from the website-2026 portfolio uploader. It registers `POST /api/superstar/upload` through Cockpit's REST dispatcher; do not use the old standalone `config/api` template.
- Create one root Assets folder named `superstar`; allow the server key's role `assets/upload` and asset metadata/image reads. No extra shared secret or portfolio addon is needed.
- Set server-only `COCKPIT_ASSET_UPLOAD_PATH=/superstar/upload`, relative to `COCKPIT_API_URL`. Missing configuration returns a readable 503; text editing still works.
- Contract: POST multipart `file` (one image), `api-key` header; return `{ "asset": assetObject }`, optionally `"reused": true`. Returned assets are verified through `GET /assets/{id}`; duplicate references are not appended to a draft.
- The addon verifies upload permissions, actual PNG/JPEG/WebP content, 10 MiB and 20 MP limits, and reuses identical images within the Superstar folder. Configure PHP/proxy body limits above the file limit.
- The frontend validates type, size and signature before forwarding, checks the returned asset, and serves authenticated image bytes through its own API.
- Uploads immediately create CMS assets. Discarding a draft or removing an image only unlinks it; it never deletes an asset that another show might use. Unused uploads can be cleaned up in Cockpit.
- Deployment of the custom endpoint and live upload/write permission checks remain operator integration steps; automated tests use a fake endpoint.
