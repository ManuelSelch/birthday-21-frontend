import cockpit from "@/lib/cockpit";
import { auth, privateJson, readAdminBody } from "@/features/admin-auth/server";
import { createGuestHandler } from "@/features/guests/server";

export const POST = createGuestHandler({
  authorize: auth.authorize,
  readBody: readAdminBody,
  json: privateJson,
  save: guest => cockpit.saveItem("guests", guest),
});

export async function GET(request: Request) {
  const denied = auth.authorize(request);
  if (denied) return denied;

  return privateJson(await cockpit.getItems("guests"));
}
