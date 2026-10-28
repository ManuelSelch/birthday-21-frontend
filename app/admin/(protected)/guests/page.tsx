import { GuestManagement } from "@/features/guests/ui";
import type { Guest } from "@/features/guests/model";
import { LogoutContainer } from "@/features/admin-auth/ui";
import cockpit from "@/lib/cockpit";

export default async function GuestsPage() {
  const guests = await cockpit.getItems<Guest>("guests");
  return <GuestManagement guests={guests} logout={<LogoutContainer />} />;
}
