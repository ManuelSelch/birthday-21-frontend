import Image from "next/image";
import manuel from "../../assets/manuel.jpg";
import marco from "../../assets/marco.jpg";
import david from "../../assets/david.jpg";
import styles from "./invitation.module.css";

const hosts = [
  { name: "Manuel", photo: manuel },
  { name: "Marco", photo: marco },
  { name: "David", photo: david },
];

export function InvitationHosts() {
  return (
    <section className={styles.hostsSection} aria-labelledby="hosts-title">
      <h2 id="hosts-title">Wir feiern mit euch</h2>
      <div className={styles.hostRow}>
        {hosts.map(({ name, photo }) => (
          <figure className={styles.hostPortrait} key={name}>
            <Image src={photo} alt={name} width={80} height={80} sizes="(max-width: 350px) 72px, 80px" className={styles.portraitImage} />
            <figcaption>{name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
