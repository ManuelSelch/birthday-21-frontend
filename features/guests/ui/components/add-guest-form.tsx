"use client";

import { Box, Button, Group, Stack, Text, TextInput } from "@mantine/core";
import type { FormEvent } from "react";

type Props = {
  name: string;
  pending: boolean;
  error: string;
  success: string;
  onNameChange: (name: string) => void;
  onSubmit: () => void;
};

export function AddGuestForm({ name, pending, error, success, onNameChange, onSubmit }: Props) {
  function submit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <Stack gap="xs">
      <form onSubmit={submit} className="flex items-end gap-3">
        <Group>
          <TextInput
            className="min-w-0 flex-1"
            label=""
            placeholder="Name des Gastes"
            value={name}
            onChange={event => onNameChange(event.currentTarget.value)}
            maxLength={100}
            disabled={pending}
            error={error ? <span role="alert">{error}</span> : undefined}
          />
          <Button className="shrink-0" type="submit" loading={pending} disabled={pending}>Add</Button>
        </Group>

      </form>
      {success && <Text role="status" size="sm" c="green">{success}</Text>}
    </Stack>
  );
}
