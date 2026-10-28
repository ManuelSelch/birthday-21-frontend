"use client";

import { Alert, Button, Stack } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";

export function LogoutButton({ loading, error, onLogout }: {
  loading: boolean; error?: string; onLogout: () => void;
}) {
  return (
    <Stack gap="xs" align="flex-end">
      <Button variant="default" leftSection={<IconLogout size={16} />} loading={loading} onClick={onLogout}>Abmelden</Button>
      {error && <Alert color="red" role="alert">{error}</Alert>}
    </Stack>
  );
}
