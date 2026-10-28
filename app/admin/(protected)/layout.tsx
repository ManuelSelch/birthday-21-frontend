import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth, SESSION_COOKIE } from "@/features/admin-auth/server";
import { AdminSessionHeader } from "@/features/admin-auth/ui";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!auth.authenticated((await cookies()).get(SESSION_COOKIE)?.value)) redirect("/admin/login");

  return (
    <>
      <AdminSessionHeader />
      {children}
    </>
  );
}
