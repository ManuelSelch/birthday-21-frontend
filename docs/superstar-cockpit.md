# Superstar Cockpit setup

- Collection: `superstarShows`; API responses must be arrays. Cockpit supplies `_id`.
- Required fields: `name` (Text, 1–100 characters), `title` (Text, 1–160), `description` (multiline plain Text, empty allowed, max. 500), `sortOrder` (nonnegative integer), `images` (Asset field with multiple values, stored as an array; default `[]`).
- Saving fetches and stores native Cockpit asset metadata so the Asset field can display images. Live snapshots expose only `_id` and `path`. A single asset object is not an array. To refresh older minimal references, open and save the show again.
- Limits: 200 shows, 20 images per show, JPG/PNG/WebP, 10 MB per image. New shows append; editing preserves ordering. No show deletion or reordering UI.
- Existing server-only `COCKPIT_API_URL` and `COCKPIT_API_KEY` are reused. Allow collection read/create/update and asset metadata/image reads. Never expose the API key in a browser or image URL.
- Production uses only CMS records; it does not seed, migrate or fall back to the six demo acts.

## Upload endpoint

- Install the separate [Cockpit Image Upload addon](https://github.com/ManuelSelch/cockpit-image-upload) and configure a folder alias in the Cockpit space's allowlist. Grant the server key's role `assets/upload` and asset metadata/image reads.
- Set server-only `COCKPIT_ASSET_UPLOAD_PATH=/image-upload/upload` and `COCKPIT_ASSET_UPLOAD_FOLDER=superstar` (or the configured alias). The path is relative to `COCKPIT_API_URL`; restart the frontend after changing environment variables. Missing configuration returns a readable 503; text editing still works.
- Contract: POST multipart `file` (one image) and `folder` (the configured alias), with the `api-key` header; return `{ "asset": assetObject }`, optionally `"reused": true`. Returned assets are verified through `GET /assets/{id}`; duplicate references are not appended to a draft.
- The addon verifies upload permissions, actual PNG/JPEG/WebP content, 10 MiB and 20 MP limits, and reuses identical images within the destination folder. Configure PHP/proxy body limits above the file limit.
- The frontend validates type, size and signature before forwarding, checks the returned asset, and serves authenticated image bytes through its own API.
- Uploads immediately create CMS assets. Discarding a draft or removing an image only unlinks it; it never deletes an asset that another show might use. Unused uploads can be cleaned up in Cockpit.
- Deployment of the custom endpoint and live upload/write checks remain operator integration steps; automated tests use a fake endpoint.
