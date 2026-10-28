"use client";

import { Alert, Button, Paper, PasswordInput, Stack, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconArrowRight, IconLock } from "@tabler/icons-react";
import styles from "./login-form.module.css";

export function LoginForm({ password, onPassword, onSubmit, loading, error }: {
  password: string;
  onPassword: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error?: string;
}) {
  return (
    <main className={styles.page}>
      <Paper className={styles.card} withBorder>
        <Stack gap={28}>
          <div className={styles.lockMark}><IconLock size={22} stroke={1.5} aria-hidden /></div>
          <header>
            <Text className={styles.eyebrow}>21. Geburtstag</Text>
            <Title className={styles.heading} order={1}>Admin-Anmeldung</Title>
          </header>
          <form onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
            <Stack gap={20}>
              <PasswordInput
                label="Admin-Passwort"
                placeholder="Passwort eingeben"
                autoComplete="current-password"
                required
                maxLength={1024}
                value={password}
                onChange={(event) => onPassword(event.currentTarget.value)}
                disabled={loading}
                size="md"
                radius="sm"
                visibilityToggleButtonProps={{ "aria-label": "Passwort anzeigen oder verbergen" }}
              />
              {error && <Alert color="red" icon={<IconAlertCircle size={18} />} role="alert">{error}</Alert>}
              <Button type="submit" variant="filled" fullWidth size="md" radius="sm" loading={loading} rightSection={<IconArrowRight size={17} />}>Anmelden</Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </main>
  );
}
