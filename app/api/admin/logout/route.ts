import { auth } from "@/features/admin-auth/server";

export async function POST() {
  return auth.logout();
}
