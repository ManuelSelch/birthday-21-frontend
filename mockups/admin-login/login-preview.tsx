import { useState, type FormEvent } from 'react';
import { Alert, Anchor, Badge, Button, Group, Paper, PasswordInput, Stack, Table, Text, Title } from '@mantine/core';
import { IconAlertCircle, IconArrowRight, IconLock, IconLogout } from '@tabler/icons-react';

type State = 'idle' | 'loading' | 'error' | 'limited' | 'authenticated';
const supported: State[] = ['idle', 'loading', 'error', 'limited', 'authenticated'];

function initialState(): State {
  const value = new URLSearchParams(location.search).get('state') as State;
  return supported.includes(value) ? value : 'idle';
}

function LoginCard({ state, password, onPassword, onSubmit }: {
  state: State; password: string; onPassword: (value: string) => void; onSubmit: (event: FormEvent) => void;
}) {
  const loading = state === 'loading';
  return (
    <Paper className="login-card" p="xl" withBorder>
      <Stack gap="lg">
        <div className="lock-mark"><IconLock size={24} stroke={1.6} aria-hidden /></div>
        <div>
          <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb={8}>21. Geburtstag · Organisation</Text>
          <Title order={1} size={28}>Admin-Anmeldung</Title>
          <Text c="dimmed" size="sm" mt={8}>Melde dich an, um Gäste, Check-in und Punkte zu verwalten.</Text>
        </div>
        <form onSubmit={onSubmit}>
          <Stack gap="md">
            <PasswordInput
              label="Admin-Passwort"
              placeholder="Passwort eingeben"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => onPassword(event.currentTarget.value)}
              disabled={loading || state === 'limited'}
              size="md"
            />
            {state === 'error' && <Alert color="red" icon={<IconAlertCircle size={18} />} role="alert">Anmeldung fehlgeschlagen. Bitte versuche es erneut.</Alert>}
            {state === 'limited' && <Alert color="orange" icon={<IconAlertCircle size={18} />} role="alert">Zu viele Versuche. Bitte versuche es in 15 Minuten erneut.</Alert>}
            <Button type="submit" fullWidth size="md" color="yellow.6" c="black" loading={loading} disabled={state === 'limited'} rightSection={<IconArrowRight size={18} />}>Anmelden</Button>
          </Stack>
        </form>
        <Text size="xs" c="dimmed">Nur für das Orga-Team. Gäste benötigen keine Anmeldung.</Text>
      </Stack>
    </Paper>
  );
}

function AdminPreview({ onLogout }: { onLogout: () => void }) {
  return (
    <Paper className="admin-preview" withBorder p="lg">
      <Group justify="space-between" gap="md" mb="xl">
        <div><Text size="xs" c="dimmed">ORGA-TEAM</Text><Title order={1} size={26}>Gäste</Title></div>
        <Button variant="default" leftSection={<IconLogout size={16} />} onClick={onLogout}>Abmelden</Button>
      </Group>
      <Group mb="md"><Badge color="gray" variant="light">Vorschau</Badge><Text size="sm" c="dimmed">12 Stunden angemeldet</Text></Group>
      <Table><Table.Thead><Table.Tr><Table.Th>Name</Table.Th><Table.Th>Zugesagt</Table.Th><Table.Th>Check-in</Table.Th></Table.Tr></Table.Thead>
        <Table.Tbody><Table.Tr><Table.Td>Alex Beispiel</Table.Td><Table.Td>Ja</Table.Td><Table.Td>Nein</Table.Td></Table.Tr></Table.Tbody>
      </Table>
    </Paper>
  );
}

export function LoginPreview() {
  const [state, setState] = useState<State>(initialState);
  const [password, setPassword] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (state === 'loading' || state === 'limited') return;
    setState('loading');
    await new Promise((resolve) => setTimeout(resolve, 650));
    setState(password === 'demo' ? 'authenticated' : 'error');
    setPassword('');
  }
  return (
    <main className="preview-page">
      <div className="screen">
        {state === 'authenticated'
          ? <AdminPreview onLogout={() => { setState('idle'); setPassword(''); }} />
          : <LoginCard state={state} password={password} onPassword={setPassword} onSubmit={submit} />}
      </div>
      <aside className="review-tools" aria-label="Mockup-Vorschau">
        <Text size="xs" c="dimmed">Mockup · Keine echte Anmeldung · Testpasswort: demo</Text>
        <Group gap="sm" justify="center" mt={8}>
          <Anchor size="xs" href="?state=idle">Login</Anchor>
          <Anchor size="xs" href="?state=error">Fehler</Anchor>
          <Anchor size="xs" href="?state=loading">Lädt</Anchor>
          <Anchor size="xs" href="?state=limited">Versuchslimit</Anchor>
          <Anchor size="xs" href="?state=authenticated">Abmelden</Anchor>
        </Group>
      </aside>
    </main>
  );
}
