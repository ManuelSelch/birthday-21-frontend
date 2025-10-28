"use client";
import { Card, Text, Title, Image, Container} from "@mantine/core";
import { useState } from "react";
import reichshofImage from "@/img/reichshof.jpg";
import ManuelMarcoCardDavid from "./manuel-marco-david-card";
import AcceptedCard from "./accepted-card";
import AcceptCard from "./accept-card";

export default function InvitationCard({guest}: {guest: any}) {
  const [confirmed, setConfirmed] = useState(guest?.accepted ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompanion, setIsCompanion] = useState(guest?.companion ?? false);

  const guestName = guest.name;
  const eventDate = "01. November 2025";
  const eventTime = "21:00 Uhr";
  const eventLocation = "Reichshof Bayreuth";

  const confirmInvited = async () => {
    try {
      await fetch(`/api/invited?id=${guest._id}`, { method: "GET" });
    } catch (err: any) { }
  };

  confirmInvited();

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

  const cancelInvitation = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/cancel?id=${guest._id}`, { method: "GET" });
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      setConfirmed(false);
    } catch (err: any) {
      console.error(err);
      setError("Absage konnte nicht bestätigt werden.");
    } finally {
      setLoading(false);
    }
  }

  const setCompanion = async (isCompanion: boolean) => {
    setLoading(true);
    setError(null);

    const companion = isCompanion ? "1" : "0";

    try {
      const res = await fetch(`/api/companion?id=${guest._id}&companion=${companion}`, { method: "GET" });
      if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
      }

      setIsCompanion(isCompanion);
    } catch (err: any) {
      console.error(err);
      setError("Begleitung konnte nicht bestätigt werden.");
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
              <AcceptedCard companion={isCompanion} setCompanion={setCompanion} guest={guest} loading={loading} cancelInvitation={cancelInvitation} error={error}/>
            ) : (
              <AcceptCard loading={loading} confirmAttendance={confirmAttendance} error={error}/>
            )}
          </Card>
        </div>
        
        {confirmed ? <div></div>: <ManuelMarcoCardDavid/>}
       
      </Container>
  );
}
