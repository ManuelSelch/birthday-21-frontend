import { GuestDataError, GuestManagement } from "@/features/guests/ui";
import { parseGuestList } from "@/features/guests/model";
import { LogoutContainer } from "@/features/admin-auth/ui";
import cockpit from "@/lib/cockpit";

export default async function GuestsPage() {
  const result = parseGuestList(await cockpit.getItems<unknown>("guests"));
  if (!result.ok) return <GuestDataError invalidIds={result.invalidIds} />;
  return <GuestManagement guests={result.guests} logout={<LogoutContainer key="admin-logout" />} />;
}
