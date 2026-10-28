"use client";

import { ActionIcon, Alert, Stack } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";

export function LogoutButton({ loading, error, onLogout }: {
  loading: boolean; error?: string; onLogout: () => void;
}) {
  return (
    <Stack gap="xs" align="flex-end">
      <ActionIcon variant="default" size={44} aria-label="Abmelden" title="Abmelden" loading={loading} onClick={onLogout}>
        <IconLogout size={18} aria-hidden="true" />
      </ActionIcon>
      {error && <Alert color="red" role="alert">{error}</Alert>}
    </Stack>
  );
}
