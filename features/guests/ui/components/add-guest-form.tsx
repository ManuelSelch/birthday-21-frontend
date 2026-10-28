"use client";

import { Button, Stack, Text, TextInput } from "@mantine/core";
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
      <form onSubmit={submit} className="flex flex-col items-stretch gap-3 min-[481px]:flex-row min-[481px]:items-end">
        <TextInput
          className="flex-1"
          label="Name"
          placeholder="Name des Gastes"
          value={name}
          onChange={event => onNameChange(event.currentTarget.value)}
          maxLength={100}
          disabled={pending}
          error={error ? <span role="alert">{error}</span> : undefined}
        />
        <Button type="submit" loading={pending} disabled={pending}>Gast hinzufügen</Button>
      </form>
      {success && <Text role="status" size="sm" c="green">{success}</Text>}
    </Stack>
  );
}
