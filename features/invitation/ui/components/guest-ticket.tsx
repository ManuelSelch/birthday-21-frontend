import { Button, Group, Stack } from "@mantine/core";
import { IconBrandWhatsapp, IconWallet } from "@tabler/icons-react";
import { QRCodeSVG } from "qrcode.react";
import styles from "./invitation.module.css";

export interface GuestTicketProps {
  name: string;
  links: { invitation: string; wallet: string; whatsapp: string };
}

export function GuestTicket({ name, links }: GuestTicketProps) {
  return (
    <Stack gap="lg">
      <section className={styles.ticket} aria-label="Dein Ticket">
        <QRCodeSVG value={links.invitation} size={200} marginSize={4} level="M" role="img" title={`Eintrittsticket für ${name}`} />
        <div className={styles.ticketName}>
          <span>DEIN TICKET</span>
          <strong>{name}</strong>
        </div>
      </section>
      <Group grow wrap="nowrap" gap={9} className={styles.ticketActions}>
        <Button component="a" href={links.wallet} variant="outline" className={styles.secondary} leftSection={<IconWallet size={17} aria-hidden="true" />}>
          Apple Wallet
        </Button>
        <Button component="a" href={links.whatsapp} target="_blank" rel="noopener noreferrer" variant="outline" className={styles.secondary} leftSection={<IconBrandWhatsapp size={17} aria-hidden="true" />}>
          WhatsApp
        </Button>
      </Group>
    </Stack>
  );
}
