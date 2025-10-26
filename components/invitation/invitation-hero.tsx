import { BackgroundImage } from "@mantine/core";
import casinoBackground from "@/img/casino-background.jpg"

export default function InvitationHero() {
    return (
        <BackgroundImage src={casinoBackground.src} className="absolute inset-0 w-full h-full">
            <div className="absolute inset-0 bg-black/60" />
        </BackgroundImage>
    )
}