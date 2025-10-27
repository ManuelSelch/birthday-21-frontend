import InvitationCard from "@/components/invitation/invitation-card";
import cockpit from "@/lib/cockpit";
import { Card } from "@mantine/core";

export default async function Home({searchParams}: {
  searchParams: Promise<{ [key: string]: string }>
}) {
  const id = (await searchParams)?.id;

  try {
    const guest = await cockpit.getItem("guests", id);

    return (
      <>
        <InvitationCard guest={guest}/>
      </>
    );
  } catch {
    return <Card m="lg">You dont have Access to this page</Card>
  }
}
