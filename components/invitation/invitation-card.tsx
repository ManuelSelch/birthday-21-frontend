"use client";
import { Button, Card, Group, Text, Title, Image, Paper, Overlay } from "@mantine/core";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import reichshofImage from "@/img/reichshof.jpg";
import reichshofInterior from "@/img/reichshof_interior.jpeg";

export default function InvitationCard() {
  const [confirmed, setConfirmed] = useState(false);

  const guestName = "Basti";
  const eventDate = "01. November 2025";
  const eventTime = "21:00 Uhr";
  const eventLocation = "Reichshof Bayreuth";

  const walletPassLink = `https://manuelselch.de/wallet-pass/${guestName}`;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white">
      {/* Header mit Reichshof-Hintergrund */}
      <div className="relative w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl border border-amber-600">
        <Image
          src={reichshofImage.src}
          alt="Reichshof Bayreuth Außenansicht"
          className="w-full h-[250px] object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-6 left-8">
          <Title order={2} className="text-amber-400 drop-shadow-lg">
            Casino Nacht im Reichshof
          </Title>
          <Text className="text-gray-200 mt-1">
            {eventDate}, {eventTime}
          </Text>
          <Text className="text-gray-400 italic">{eventLocation}</Text>
        </div>
      </div>

      {/* Einladungskarte */}
      <div className="mt-10 flex justify-center w-ful">
        <Card
          shadow="xl"
          radius="lg"
          className="bg-gray-900/80 p-8 text-center border border-amber-500 backdrop-blur-md"
        >
          <Title order={3} className="text-amber-400 mb-4">
            Willkommen, {guestName}!
          </Title>

          <Text className="text-gray-300 mb-8 leading-relaxed">
            Wir laden dich herzlich ein,<br/>
            mit uns unseren 20. Geburtstag im
            stilvollen Ambiente des Reichshofs zu feiern.
            <br /><br/>
            Freu dich auf ein exklusives Casino-Erlebnis mit Drinks, Musik und
            guter Stimmung!
          </Text>

          {confirmed ? (
            <Text c={"green"} className="font-semibold mb-4">
              ✅ Deine Teilnahme ist bestätigt!
            </Text>
          ) : (
            <Button
              color="yellow"
              radius="md"
              size="lg"
              onClick={() => setConfirmed(true)}
              className="transition-transform transform hover:scale-105"
            >
              Teilnahme bestätigen
            </Button>
          )}

          <div className="flex justify-center mt-6">
            <QRCodeSVG value={`https://manuelselch.de`} size={128} />
          </div>

          <Group pt="lg">
            <Button
              component="a"
              href={`${walletPassLink}.pkpass`}
              target="_blank"
              color="green"
              radius="md"
            >
              Apple Wallet
            </Button>
            <Button
              component="a"
              href={`${walletPassLink}.gpay`}
              target="_blank"
              color="blue"
              radius="md"
            >
              Google Wallet
            </Button>
          </Group>
        </Card>
      </div>

      {/* Optional: Innenaufnahme als Fußzeilen-Visual */}
      <div className="mt-12 w-full max-w-3xl rounded-lg overflow-hidden opacity-70">
        <Image
          src={reichshofInterior.src}
          alt="Reichshof Bayreuth Innenansicht"
          className="w-full h-[200px] object-cover brightness-50"
        />
      </div>
    </div>
  );
}
