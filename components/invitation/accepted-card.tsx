import { Anchor, Button, Center, Group, Image, Overlay, Paper, Stack, Switch, Text } from "@mantine/core";
import { QRCodeSVG } from "qrcode.react";
import appleWallet from "@/img/apple_wallet.png";
import googleWallet from "@/img/google_wallet.png";
import whatsapp from "@/img/whatsapp.webp";
import { useState } from "react";

export default function AcceptedCard({companion, setCompanion, guest, loading, cancelInvitation, error}: {companion: any, setCompanion: any, guest: any, loading: any, cancelInvitation: any, error: any}) {
    const guestLink = `https://geburtstag.manuelselch.de/invite?id=${guest._id}`;
    const applePassLink = `https://geburtstag.manuelselch.de/api/apple-pass?id=${guest._id}`;
    const whatsappLink = `https://chat.whatsapp.com/KlJOiGqBwcEDC4R4pTK0vN?mode=wwt`;

    return (
        <Stack align="center">
            <Text c={"green"} className="font-semibold mb-4">Deine Teilnahme ist bestätigt!</Text>

            <Group>
                <Text fw="bold">Kommst du mit Begleitung?</Text>
                <Switch checked={companion} onChange={(event) => setCompanion(event.currentTarget.checked)}/>
            </Group>

            <br/>

            <Text>Trete der WhatsApp Gruppe bei, um weitere Orga Infos zu erhalten</Text>
            <Text>Zeige diesen QR Code beim Check-In vor oder füge das Ticket deinem Apple Wallet hinzu</Text>

            
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

            <Button bg="black" c="red" loading={loading} onClick={cancelInvitation}>Absagen</Button>

            {error && <Text c="red">{error}</Text>}
        </Stack>
    )
}