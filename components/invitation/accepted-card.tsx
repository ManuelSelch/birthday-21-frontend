import { Anchor, Group, Image, Overlay, Paper, Stack, Text } from "@mantine/core";
import { QRCodeSVG } from "qrcode.react";
import appleWallet from "@/img/apple_wallet.png";
import googleWallet from "@/img/google_wallet.png";
import whatsapp from "@/img/whatsapp.webp";

export default function AcceptedCard({guest}: {guest: any}) {

    const guestLink = `https://geburtstag.manuelselch.de/invite?id=${guest._id}`;
    const applePassLink = `https://geburtstag.manuelselch.de/api/apple-pass?id=${guest._id}`;
    const whatsappLink = `https://chat.whatsapp.com/KlJOiGqBwcEDC4R4pTK0vN?mode=wwt`;

    return (
        <Stack>
            <Text c={"green"} className="font-semibold mb-4">Deine Teilnahme ist bestätigt!</Text>

            <Group pt="md" justify="center">
                <Anchor href={applePassLink}>
                <Image src={appleWallet.src} h={60} w={60}/>
                </Anchor>

                <Paper className="relative">
                <Image src={googleWallet.src} h={50} w={50} radius="md"/>
                <Overlay radius="md"/>
                </Paper>

                <Anchor href={whatsappLink}>
                <Image src={whatsapp.src} h={60} w={60}/>
                </Anchor>

                <QRCodeSVG value={guestLink} size={50} />
            </Group>
        </Stack>
    )
}