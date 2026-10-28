import { auth } from "@/features/admin-auth/server";

export async function POST(request: Request) {
  return auth.logout(request);
}
