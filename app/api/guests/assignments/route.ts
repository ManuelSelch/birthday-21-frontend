import cockpit from "@/lib/cockpit";
import { auth, privateJson, readAdminBody } from "@/features/admin-auth/server";
import { updateAssignmentsHandler } from "@/features/guests/server";

export const POST = updateAssignmentsHandler({
  authorize: auth.authorize,
  readBody: readAdminBody,
  json: privateJson,
  find: id => cockpit.getItem("guests", id),
  save: guest => cockpit.saveItem("guests", guest),
});
