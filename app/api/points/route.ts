import cockpit from "@/lib/cockpit";
import { auth, privateJson, readAdminBody } from "@/features/admin-auth/server";

export async function GET() {
  return privateJson({ success: false, error: "Method not allowed" }, 405, { Allow: "POST" });
}

export async function POST(request: Request) {
  const denied = auth.authorize(request);
  if (denied) return denied;

  const body = await readAdminBody(request);
  if (!body || typeof body.id !== "string" || !body.id.trim() || body.id.length > 128 ||
    typeof body.points !== "number" || !Number.isFinite(body.points)) {
    return privateJson({ success: false, error: "Invalid guest or points" }, 400);
  }

  await cockpit.saveItem("guests", { _id: body.id, points: body.points });
  return privateJson({ success: true });
}
