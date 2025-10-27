"use client";
import { Button, Card, Group, Text, Title, Image, Paper, Overlay, Container, Stack, Anchor } from "@mantine/core";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import reichshofImage from "@/img/reichshof.jpg";
import ManuelMarcoCard from "./manuel-marco-card";
import Footer from "../footer";
import appleWallet from "@/img/apple_wallet.png";
import googleWallet from "@/img/google_wallet.png";

export default function InvitationCard() {
  const [confirmed, setConfirmed] = useState(false);

  const guestName = "Basti";
  const eventDate = "01. November 2025";
  const eventTime = "21:00 Uhr";
  const eventLocation = "Reichshof Bayreuth";

  const walletPassLink = `https://manuelselch.de/wallet-pass/${guestName}`;

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
                  onClick={() => setConfirmed(true)}
                  className="transition-transform transform hover:scale-105"
                >
                  Teilnahme bestätigen
                </Button>
              </Stack>
              
            )}

            <Group pt="md" justify="center">
              <Anchor href={`${walletPassLink}.pkpass`}>
                <Image src={appleWallet.src} h={50} w={50}/>
              </Anchor>
              <Anchor href={`${walletPassLink}.gpay`}>
                <Image src={googleWallet.src} h={40} w={40}/>
              </Anchor>

              <QRCodeSVG value={`https://manuelselch.de`} size={40} />
            </Group>
          </Card>
        </div>

        <ManuelMarcoCard/>
      </Container>
  );
}
