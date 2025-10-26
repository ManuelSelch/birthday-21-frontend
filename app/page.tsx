import { Button, Card, Stack, Text, Title } from "@mantine/core";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-black to-gray-900 text-white flex flex-col items-center justify-center p-6">
      {/* hero */}
      <Stack align="center">
        <Title order={1} className="text-5xl font-bold text-amber-400">Casino Nacht 2025</Title>
        <Text className="text-gray-300 mt-2">Unsere 20. Geburtstagsfeier</Text>
      </Stack>
      
      {/* invitation card */}
      <div className="grow flex items-center justify-center">
        <Card shadow="xl" radius="lg" className="bg-gray-800 p-8 text-center border border-amber-500">
          <Title order={3} className="text-amber-500 mb-4">Wilkommen, Name</Title>

          <Text className="text-gray-300 mb-6">
            Sei dabei bei einer unvergesslichen Nacht voller Spiele, Drinks und Spaß.<br/>
            <span>Event Date</span>
          </Text>

          <Text className="text-green-400 font-semibild-mb-4">Deine Teilnahme ist bestätigt! Wir freuen uns auf dich!</Text>

          <Button color="yellow" radius="md" size="lg" className="transition-transform transform hover:scale-105">Teilnahme bestätigen</Button>
        </Card>

        
      </div>

      {/* footer */}
      <footer className="mt-10 text-gray-500 text-sm text-center">
        <Text>Designed with ❤️ for our 20th birthday</Text>
      </footer>
    </div>
  );
}
