import { Alert, Button, Stack, Switch } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { GuestTicket, type GuestTicketProps } from "./guest-ticket";
import styles from "./invitation.module.css";

export interface GuestResponseProps extends GuestTicketProps {
  accepted: boolean;
  companion: boolean;
  pending: "invited" | "accept" | "cancel" | "companion" | null;
  error: string | null;
  onAccept: () => void;
  onCancel: () => void;
  onCompanionChange: (value: boolean) => void;
}

export function GuestResponse({ name, links, accepted, companion, pending, error, onAccept, onCancel, onCompanionChange }: GuestResponseProps) {
  const busy = pending !== null;
  return (
    <section className={styles.response} aria-label="Deine Rückmeldung" aria-busy={busy}>
      <h2 aria-live="polite">{accepted ? `Du bist dabei, ${name}.` : `${name}, bist du dabei?`}</h2>
      {accepted ? (
        <Stack gap="lg">
          <Switch
            label="Ich bringe eine Begleitung mit"
            checked={companion}
            disabled={busy}
            onChange={event => onCompanionChange(event.currentTarget.checked)}
            classNames={{ label: styles.companionLabel, track: styles.companionTrack }}
          />
          <GuestTicket name={name} links={links} />
          <Button variant="subtle" className={styles.cancel} disabled={busy} loading={pending === "cancel"} onClick={onCancel}>
            Teilnahme absagen
          </Button>
        </Stack>
      ) : (
        <Button fullWidth size="lg" className={styles.rsvp} disabled={busy} loading={pending === "accept"} rightSection={<IconArrowRight size={19} aria-hidden="true" />} onClick={onAccept}>
          Ich bin dabei
        </Button>
      )}
      {error && <Alert color="red" mt="md" title="Das hat nicht geklappt" role="alert">{error}</Alert>}
    </section>
  );
}
