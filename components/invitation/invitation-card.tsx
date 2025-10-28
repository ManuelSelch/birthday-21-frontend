"use client";
import { Button, Card, Group, Text, Title, Image, Paper, Overlay, Container, Stack, Anchor } from "@mantine/core";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import reichshofImage from "@/img/reichshof.jpg";
import ManuelMarcoCardDavid from "./manuel-marco-david-card";
import appleWallet from "@/img/apple_wallet.png";
import googleWallet from "@/img/google_wallet.png";
import whatsapp from "@/img/whatsapp.webp";

export default function InvitationCard({guest}: {guest: any}) {
  const [confirmed, setConfirmed] = useState(guest?.accepted ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const guestName = guest.name;
  const eventDate = "01. November 2025";
  const eventTime = "21:00 Uhr";
  const eventLocation = "Reichshof Bayreuth";

  const guestLink = `https://geburtstag.manuelselch.de/invite?id=${guest._id}`;
  const applePassLink = `https://geburtstag.manuelselch.de/api/apple-pass?id=${guest._id}`;
  const whatsappLink = `https://chat.whatsapp.com/KlJOiGqBwcEDC4R4pTK0vN?mode=wwt`;

  const confirmAttendance = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/accept?id=${guest._id}`, { method: "GET" });
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      setConfirmed(true);
    } catch (err: any) {
      console.error(err);
      setError("Teilnahme konnte nicht bestätigt werden.");
    } finally {
      setLoading(false);
    }
  };

  return (
       <Container className="grow flex flex-col items-center justify-center">
        {/* Header mit Reichshof-Hintergrund */}
        <div className="relative w-full rounded-xl overflow-hidden shadow-2xl border border-amber-600">
          <Image
            src={reichshofImage.src}
            alt="Reichshof Bayreuth Außenansicht"
            className="w-full h-[150px] object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-6 left-8">
            <Title order={2} className="text-amber-400 drop-shadow-lg">
              Casino Nacht im Reichshof
            </Title>
            <Text c="white" className="mt-1">
              {eventDate}, {eventTime}
            </Text>
            <Text c="white" className="italic">{eventLocation}</Text>
          </div>
        </div>

        {/* Einladungskarte */}
        <div className="flex justify-center w-full">
          <Card
            shadow="xl"
            radius="lg"
            mt="md"
            className="bg-gray-900/80 text-center border border-amber-500 backdrop-blur-md w-full"
          >
            <Title order={3} className="text-amber-400" pb="lg">
              Willkommen, {guestName}!
            </Title>

            {confirmed ? (
              <Text c={"green"} className="font-semibold mb-4">
                Deine Teilnahme ist bestätigt!
              </Text>
            ) : (
              <Stack align="center">
                <Button
                  color="yellow"
                  radius="md"
                  size="lg"
                  w="300px"
                  loading={loading}
                  onClick={confirmAttendance}
                  className="transition-transform transform hover:scale-105"
                >
                  Teilnahme bestätigen
                </Button>
                {error && <Text c="red">{error}</Text>}
              </Stack>
              
            )}

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
          </Card>
        </div>

        <ManuelMarcoCardDavid/>
      </Container>
  );
}
