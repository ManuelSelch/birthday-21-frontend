# Cockpit setup: guest groups and hosts

Complete this before deploying the frontend.

1. Open the existing **guests** content model in Cockpit.
2. Add two fields, using the exact machine names below:

| Name | Label | Type | Default | Stored value |
| --- | --- | --- | --- | --- |
| groups | Gruppen | Object | [] | Array of group-name strings |
| hosts | Hosts | Object | [] | Array of host-name strings |

Cockpit calls its JSON editor **Object** (machine type `object`); it also accepts JSON arrays. Keep `asString` off. Its optional `strict` setting may be enabled for standard JSON. See [Cockpit field documentation](https://getcockpit.com/documentation/core/concepts/fields#object).

3. Initialize **both fields on every existing guest** to `[]` (or their intended assignments). Adding a field default may not backfill existing content. Confirm actual API output contains arrays, not null, JSON strings, or missing keys. Do not change IDs, invitation flags, attendance, points, companions or check-in.
4. Hosts must use the exact values **Manuel**, **Marco**, **David**. Groups are free-text names, trimmed, 1–40 characters; max 50 groups per guest.
5. The existing server API key needs read/write permission for guests. No browser API key, new collection, or public read/write permission is needed. Do not make the new metadata public through Cockpit permissions; public invitations render only their existing allowed fields.

Examples:
- `groups: ["Uni", "Fußball"]`
- `hosts: ["Manuel", "David"]`

Empty arrays are valid. Multiple hosts represent a shared friend without duplicating the guest.
Group choices come from names assigned to existing guests; a new name can be entered during guest creation/editing. Groups with no remaining assignments disappear from the choices. There is no standalone group catalogue.

## Frontend behavior
- Mobile: Gast (name with groups/hosts underneath), Status, Check-in.
- Desktop: separate Gruppen and Hosts columns.
- Combined name, group, host and RSVP filters, including unassigned groups/hosts.
- Create name, groups and hosts in one sheet; edit assignments by tapping a name.
- Individual editing only; no bulk operations, renaming guests or deletion.
- Copy/open the real invitation link from guest details.
- POST /api/guests creates; POST /api/guests/assignments updates only groups/hosts. Both require the existing admin session.
- No legacy fallback: stored guests and creation requests must provide both arrays.
- Cockpit itself is not modified by the frontend implementation or tests.
