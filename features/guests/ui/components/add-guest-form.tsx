"use client";

import { Button, TextInput } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import type { FormEvent } from "react";
import styles from "./guest-list.module.css";

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
    <div className={styles.creation}>
      <form onSubmit={submit} className={styles.addForm}>
        <TextInput aria-label="Name" placeholder="Name des neuen Gasts" radius="xs"
          value={name} onChange={event => onNameChange(event.currentTarget.value)}
          maxLength={100} disabled={pending} aria-invalid={!!error}
          aria-describedby={error ? "add-guest-error" : undefined} />
        <Button radius="xs" type="submit" leftSection={<IconPlus size={16} />} loading={pending}
          disabled={pending}>Hinzufügen</Button>
      </form>
      {error && <p id="add-guest-error" role="alert" className={styles.error}>{error}</p>}
      {success && <p role="status" className={styles.success}>{success}</p>}
    </div>
  );
}
