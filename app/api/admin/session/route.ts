import { auth, privateJson } from "@/features/admin-auth/server";

export function GET(request: Request): Response {
  return auth.authorize(request) ?? privateJson({ success: true });
}
