import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Group } from "@mantine/core";
import { auth, SESSION_COOKIE } from "@/features/admin-auth/server";
import { LogoutContainer } from "@/features/admin-auth/ui";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!auth.authenticated((await cookies()).get(SESSION_COOKIE)?.value)) redirect("/admin/login");

  return (
    <>
      <Group justify="flex-end" px="md" pb="md"><LogoutContainer /></Group>
      {children}
    </>
  );
}
