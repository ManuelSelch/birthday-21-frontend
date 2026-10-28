import type { Metadata } from "next";
import { TimelineContainer } from "@/features/timeline/ui/containers/timeline-container";

export const metadata: Metadata = { title: "Programm · 21. Geburtstag" };

export default async function TimelinePage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await searchParams;
  return <TimelineContainer invitationId={id} />;
}
