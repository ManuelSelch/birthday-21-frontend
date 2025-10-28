import { BackgroundImage } from "@mantine/core";
import casinoBackground from "@/img/casino-background.jpg"

export default function InvitationHero() {
    return (
        <BackgroundImage src={casinoBackground.src}  className="fixed inset-0 w-full min-h-screen">
            <div className="absolute inset-0 bg-black/80" />
        </BackgroundImage>
    )
}