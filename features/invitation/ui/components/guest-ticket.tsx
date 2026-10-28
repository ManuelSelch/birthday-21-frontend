import { Button, Stack } from "@mantine/core";
import { IconWallet } from "@tabler/icons-react";
import { QRCodeSVG } from "qrcode.react";
import styles from "./invitation.module.css";

export interface GuestTicketProps {
  name: string;
  links: { invitation: string; wallet: string; whatsapp: string };
}

export function GuestTicket({ name, links }: GuestTicketProps) {
  return (
    <Stack gap="lg" className={styles.ticketBlock}>
      <section className={styles.ticket} aria-label="Dein Ticket">
        <QRCodeSVG value={links.invitation} size={200} marginSize={4} level="M" role="img" title={`Eintrittsticket für ${name}`} />
        <div className={styles.ticketName}>
          <span>DEIN TICKET</span>
          <strong>{name}</strong>
        </div>
      </section>
      <Button component="a" href={links.wallet} fullWidth variant="outline" className={styles.secondary} leftSection={<IconWallet size={17} aria-hidden="true" />}>
        Apple Wallet
      </Button>
    </Stack>
  );
}
