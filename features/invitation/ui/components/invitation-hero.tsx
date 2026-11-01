import Image from "next/image";
import birthdayStage from "../../assets/birthday-stage.png";
import { invitationEvent } from "../../domain/invitation";
import styles from "./invitation.module.css";

export function InvitationHero() {
  return (
    <header className={styles.hero}>
      <div className={styles.topline}><span>{invitationEvent.hosts}</span><span>20 NOV 2026</span></div>
      <Image src={birthdayStage} alt="Manuel, Marco und David am Richterpult zum 21. Geburtstag" sizes="(max-width: 920px) 100vw, 920px" className={styles.heroImage} preload />
      <div className={styles.heroTitle}><h1>Unser 21. <em>Geburtstag</em></h1></div>
    </header>
  );
}
