import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth, SESSION_COOKIE } from "@/features/admin-auth/server";
import { safeAdminDestination } from "@/features/admin-auth/domain/rules";
import { LoginContainer } from "@/features/admin-auth/ui";

export const dynamic = "force-dynamic";

export default async function AdminLogin({ searchParams }: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const returnTo = safeAdminDestination((await searchParams).returnTo);
  if (auth.authenticated((await cookies()).get(SESSION_COOKIE)?.value)) redirect(returnTo);
  return <LoginContainer returnTo={returnTo} />;
}
