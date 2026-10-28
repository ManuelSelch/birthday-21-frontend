"use client";

import { Group } from "@mantine/core";
import { usePathname } from "next/navigation";
import { LogoutContainer } from "./logout-container";

export function AdminSessionHeader() {
  const pathname = usePathname();
  if (pathname === "/admin/guests" || pathname === "/admin/scanner") return null;

  return <Group justify="flex-end" px="md" pb="md"><LogoutContainer /></Group>;
}
