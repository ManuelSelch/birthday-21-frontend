import cockpit from "@/lib/cockpit";
import { parseGuest } from "@/features/invitation/domain/invitation";
import { InvitationContainer } from "@/features/invitation/ui/containers/invitation-container";
import { InvitationUnavailable } from "@/features/invitation/ui/components/invitation-unavailable";

export default async function InvitePage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await searchParams;
  if (typeof id !== "string" || !id.trim()) return <InvitationUnavailable />;

  const data = await cockpit.getItem<unknown>("guests", encodeURIComponent(id)).catch(() => null);
  const guest = parseGuest(data);
  if (!guest || guest._id !== id) return <InvitationUnavailable />;
  return <InvitationContainer key={guest._id} guest={guest} />;
}
