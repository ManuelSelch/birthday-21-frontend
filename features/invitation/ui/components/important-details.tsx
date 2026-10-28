import { Button } from "@mantine/core";
import { IconArrowUpRight, IconBrandWhatsapp, IconHanger, IconTicket } from "@tabler/icons-react";
import styles from "./invitation.module.css";

export function ImportantDetails({ whatsapp }: { whatsapp: string }) {
  return (
    <section className={styles.important} aria-labelledby="important-details-title">
      <div className={styles.sectionLabel}>FÜR DEINEN ABEND</div>
      <h2 id="important-details-title">Gut zu wissen</h2>
      <div className={styles.detailRow}>
        <IconBrandWhatsapp size={23} stroke={1.5} aria-hidden="true" />
        <div>
          <h3>WhatsApp-Gruppe</h3>
          <Button component="a" href={whatsapp} target="_blank" rel="noopener noreferrer" variant="subtle" className={styles.joinButton} rightSection={<IconArrowUpRight size={17} aria-hidden="true" />}>
            Gruppe beitreten
          </Button>
        </div>
      </div>
      <div className={styles.detailRow}>
        <IconTicket size={23} stroke={1.5} aria-hidden="true" />
        <h3>Einlass nur mit Ticket</h3>
      </div>
      <div className={styles.detailRow}>
        <IconHanger size={23} stroke={1.5} aria-hidden="true" />
        <h3>Dresscode: Anzug</h3>
      </div>
    </section>
  );
}
