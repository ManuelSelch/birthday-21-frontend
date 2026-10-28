"use client";

import { Alert, Button, Paper, PasswordInput, Stack, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconArrowRight, IconLock } from "@tabler/icons-react";
import styles from "./login-form.module.css";

export function LoginForm({ password, onPassword, onSubmit, loading, error, limited }: {
  password: string;
  onPassword: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error?: string;
  limited: boolean;
}) {
  return (
    <main className={styles.page}>
      <Paper className={styles.card} p="xl" withBorder>
        <Stack gap="lg">
          <div className={styles.lockMark}><IconLock size={24} stroke={1.6} aria-hidden /></div>
          <div>
            <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb={8}>21. Geburtstag</Text>
            <Title order={1} size={28}>Admin-Anmeldung</Title>
          </div>
          <form onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
            <Stack gap="md">
              <PasswordInput
                label="Admin-Passwort"
                placeholder="Passwort eingeben"
                autoComplete="current-password"
                required
                maxLength={1024}
                value={password}
                onChange={(event) => onPassword(event.currentTarget.value)}
                disabled={loading || limited}
                size="md"
              />
              {error && <Alert color={limited ? "orange" : "red"} icon={<IconAlertCircle size={18} />} role="alert">{error}</Alert>}
              <Button type="submit" fullWidth size="md" color="blue" loading={loading} disabled={limited} rightSection={<IconArrowRight size={18} />}>Anmelden</Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </main>
  );
}
