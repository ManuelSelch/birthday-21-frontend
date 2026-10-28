import cockpit from "@/lib/cockpit";
import { auth, privateJson } from "@/features/admin-auth/server";

export async function GET(request: Request) {
  const denied = auth.authorize(request);
  if (denied) return denied;

  return privateJson(await cockpit.getItems("guests"));
}
