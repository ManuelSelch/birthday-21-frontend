import { useState, type FormEvent } from 'react';
import { Alert, Anchor, Button, Group, Paper, PasswordInput, Stack, Text, Title } from '@mantine/core';
import { IconAlertCircle, IconArrowRight, IconCheck, IconLock } from '@tabler/icons-react';

type State = 'idle' | 'loading' | 'error' | 'success';
function initialState(): State {
  const state = new URLSearchParams(location.search).get('state');
  return state === 'loading' || state === 'error' || state === 'success' ? state : 'idle';
}

function LoginCard({ state, password, onPassword, onSubmit, onReset }: {
  state: State; password: string; onPassword: (value: string) => void;
  onSubmit: (event: FormEvent) => void; onReset: () => void;
}) {
  const loading = state === 'loading';
  return (
    <Paper className="login-card" withBorder>
      <Stack gap={28}>
        <div className="lock-mark"><IconLock size={22} stroke={1.5} aria-hidden /></div>
        <header>
          <Text className="eyebrow">21. Geburtstag</Text>
          <Title order={1}>Admin-Anmeldung</Title>
        </header>
        {state === 'success' ? <Stack>
          <Alert color="teal" icon={<IconCheck size={18} />} role="status">Angemeldet — nur eine Vorschau.</Alert>
          <Button variant="outline" onClick={onReset}>Zurück zur Anmeldung</Button>
        </Stack> : <form onSubmit={onSubmit}>
          <Stack gap={20}>
            <PasswordInput label="Admin-Passwort" placeholder="Passwort eingeben"
              autoComplete="current-password" required size="md" value={password}
              onChange={(event) => onPassword(event.currentTarget.value)} disabled={loading}
              visibilityToggleButtonProps={{ 'aria-label': 'Passwort anzeigen oder verbergen' }} />
            {state === 'error' && <Alert color="red" icon={<IconAlertCircle size={18} />} role="alert">Anmeldung fehlgeschlagen. Bitte versuche es erneut.</Alert>}
            <Button type="submit" fullWidth size="md" loading={loading}
              rightSection={<IconArrowRight size={17} />}>Anmelden</Button>
          </Stack>
        </form>}
      </Stack>
    </Paper>
  );
}

export function LoginPreview() {
  const [state, setState] = useState<State>(initialState);
  const [password, setPassword] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (state === 'loading') return;
    setState('loading');
    await new Promise((resolve) => setTimeout(resolve, 650));
    setState(password === 'demo' ? 'success' : 'error');
    setPassword('');
  }
  return (
    <div className="preview-page">
      <main className="screen">
        <LoginCard state={state} password={password} onPassword={setPassword} onSubmit={submit}
          onReset={() => { setState('idle'); setPassword(''); }} />
      </main>
      <aside className="review-tools" aria-label="Mockup-Vorschau">
        <Text size="xs">Mockup · Keine echte Anmeldung · Testpasswort: demo</Text>
        <Group gap="md" justify="center" mt={8}>
          <Anchor size="xs" href="?state=idle">Login</Anchor>
          <Anchor size="xs" href="?state=error">Fehler</Anchor>
          <Anchor size="xs" href="?state=loading">Lädt</Anchor>
        </Group>
      </aside>
    </div>
  );
}
