import Link from "next/link";
import { Alert, Button, Stack, UnstyledButton } from "@mantine/core";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";
import { GuestTicket, type GuestTicketProps } from "./guest-ticket";
import { ImportantDetails } from "./important-details";
import { VenueMap } from "./venue-map";
import styles from "./invitation.module.css";

export interface GuestResponseProps extends GuestTicketProps {
  links: GuestTicketProps["links"] & { timeline: string };
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
      <div className={styles.sectionLabel}>DEINE PERSÖNLICHE EINLADUNG</div>
      <h2 aria-live="polite">{accepted ? `Du bist dabei, ${name}.` : `${name}, bist du dabei?`}</h2>
      {!accepted && <p className={styles.responseIntro}>Wir freuen uns darauf, diesen besonderen Abend mit dir zu feiern.</p>}
      {accepted ? (
        <Stack gap="lg">
          <Link href={links.timeline} className={styles.programmeLink}>Programm ansehen <IconArrowRight size={17} aria-hidden="true" /></Link>
          <UnstyledButton
            className={styles.companionChoice}
            aria-label="Ich bringe eine Begleitung mit"
            aria-pressed={companion}
            data-selected={companion}
            disabled={busy}
            onClick={() => onCompanionChange(!companion)}
          >
            <span className={styles.companionCopy}>
              <span className={styles.companionTitle}>{companion ? "Deine Begleitung ist dabei" : "Ich bringe eine Begleitung mit"}</span>
              <span className={styles.companionHint}>{companion ? "Erneut tippen zum Entfernen" : "Nur wenn deine Begleitung keine eigene Einladung hat."}</span>
            </span>
            <span className={styles.companionIcon} aria-hidden="true">
              {companion ? <IconCheck size={20} stroke={1.7} /> : <IconArrowRight size={20} stroke={1.7} />}
            </span>
          </UnstyledButton>
          <ImportantDetails whatsapp={links.whatsapp} />
          <GuestTicket name={name} links={links} />
          <VenueMap />
          <Button variant="subtle" className={styles.cancel} disabled={busy} loading={pending === "cancel"} onClick={onCancel}>
            Teilnahme absagen
          </Button>
        </Stack>
      ) : (
        <>
          <Button fullWidth size="lg" className={styles.rsvp} disabled={busy} loading={pending === "accept"} rightSection={<IconArrowRight size={19} aria-hidden="true" />} onClick={onAccept}>
            Ich bin dabei
          </Button>
          <Link href={links.timeline} className={styles.programmeLink}>Programm ansehen <IconArrowRight size={17} aria-hidden="true" /></Link>
          <VenueMap />
        </>
      )}
      {error && <Alert color="red" mt="md" title="Das hat nicht geklappt" role="alert">{error}</Alert>}
    </section>
  );
}
