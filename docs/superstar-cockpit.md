# Superstar Cockpit setup

- Collection: `superstarShows`; API responses must be arrays. Cockpit supplies `_id`.
- Required fields: `name` (Text, 1–100 characters), `title` (Text, 1–160), `description` (multiline plain Text, empty allowed, max. 500), `sortOrder` (nonnegative integer), `images` (Object containing a JSON array, “as string” off, default `[]`).
- Each image is a Cockpit asset reference containing `_id` and `path`. Full asset metadata is accepted and reduced to these two fields. A single asset object is not an array; resave existing records after model changes.
- Limits: 200 shows, 20 images per show, JPG/PNG/WebP, 10 MB per image. New shows append; editing preserves ordering. No show deletion or reordering UI.
- Existing server-only `COCKPIT_API_URL` and `COCKPIT_API_KEY` are reused. Allow collection read/create/update and asset metadata/image reads. Never expose the API key in a browser or image URL.
- Production uses only CMS records; it does not seed, migrate or fall back to the six demo acts.

## Upload endpoint

- Cockpit's [documented asset API](https://getcockpit.com/documentation/core/api/assets) provides reads, not a standard upload route. Supply a protected custom endpoint using its [file-based API routing](https://getcockpit.com/documentation/guides/creating-file-based-api-endpoints).
- A proposed [Cockpit upload endpoint](superstar-cockpit/superstar-upload.post.php) is included. Copy it to Cockpit's `config/api/superstar-upload.post.php` and set Cockpit's `superstar/uploadKey` configuration to the server API key. It denies all requests until that secret is set, validates actual image content, and returns the required asset response. PHP execution/live deployment is not verified here.
- Configure server-only `COCKPIT_ASSET_UPLOAD_PATH` with its path relative to `COCKPIT_API_URL`, e.g. `/superstar-upload`. Missing configuration returns a readable 503; text editing still works.
- Contract: POST multipart `files[]` (one image per request), authenticated through the server's `api-key` header. Return `{ "failed": [], "assets": [assetObject] }`; the asset must be retrievable through `GET /assets/{id}`.
- Validate credentials and authorization in the Cockpit endpoint; restrict uploads to JPEG/PNG/WebP, 10 MB, and verify actual image content. Do not expose an anonymous write route. Configure PHP/proxy body limits above the 10 MB file limit.
- The frontend validates type, size and signature before forwarding, checks the returned asset, and serves authenticated image bytes through its own API.
- Uploads immediately create CMS assets. Discarding a draft or removing an image only unlinks it; it never deletes an asset that another show might use. Unused uploads can be cleaned up in Cockpit.
- Deployment of the custom endpoint and live upload/write permission checks remain operator integration steps; automated tests use a fake endpoint.
