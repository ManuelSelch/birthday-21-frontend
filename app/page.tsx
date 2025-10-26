"use client"
import { BackgroundImage, Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import casinoBackground from "@/img/casino-background.jpg"
import { useState } from "react";
import {QRCodeSVG} from 'qrcode.react';

export default function Home() {
  const [confirmed, setConfirmed] = useState(false);

  const guestName = "Basti"
  const eventDate = "01. November 2025";
  const eventTime = "21:00 Uhr";
  const eventLocation = "Bayreuth, TBD";
  const walletPassLink = `https://manuelselch.de/wallet-pass/${guestName}`; // Placeholder link

  return (
    <div 
      className="min-h-screen bg-linear-to-b from-black to-gray-900 text-white flex flex-col items-center justify-center p-6"
    >
      <BackgroundImage src={casinoBackground.src} className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-black/60" />
      </BackgroundImage>

      <div className="relative z-10 flex flex-col grow">
        {/* hero */}
        <Stack align="center">
          <Title order={1} className="text-5xl font-bold text-amber-400">Casino Nacht 2025</Title>
          <Text className="text-gray-300 mt-2">Unsere 20. Geburtstagsfeier</Text>
        </Stack>
        
        {/* invitation card */}
        <div className="grow flex items-center justify-center">
          <Card shadow="xl" radius="lg" className="bg-gray-800 p-8 text-center border border-amber-500">
            <Title order={3} className="text-amber-500 mb-4">Wilkommen, {guestName}</Title>

            <Text className="text-gray-300 mb-6">
              Sei dabei bei einer unvergesslichen Nacht voller Spiele, Drinks und Spaß.<br/>
              <span className="text-amber-400">{eventDate}, {eventTime}</span><br />
              <span className="text-amber-400">{eventLocation}</span>
            </Text>

            {confirmed 
              ? <Text c={"green"} className="text-green font-semibild-mb-4">Deine Teilnahme ist bestätigt! Wir freuen uns auf dich!</Text>
              : <Button color="yellow" radius="md" size="lg" onClick={() => {setConfirmed(true)}} className="transition-transform transform hover:scale-105">Teilnahme bestätigen</Button>
            }
            

            <div className="flex justify-center mt-6">
              <QRCodeSVG value={`https://manuelselch.de`} size={128} />
            </div>

             {/* Apple Wallet / Google Wallet Buttons */}
            <Group pt="lg" >
              <Button component="a" href={`${walletPassLink}.pkpass`} target="_blank" color="green" radius="md">
                Apple Wallet
              </Button>
              <Button component="a" href={`${walletPassLink}.gpay`} target="_blank" color="blue" radius="md">
                Google Wallet
              </Button>
            </Group>
            
          </Card>
        </div>

        {/* footer */}
        <footer className="mt-10 text-gray-500 text-sm text-center">
          <Text>Designed with love for our 20th birthday</Text>
        </footer>
      </div>
    </div>
  );
}
