import { invitationReturnLink } from "../../domain/timeline";
import { fetchTimeline } from "../../infra/cockpit-timeline";
import { TimelineView } from "../components/timeline-view";

export async function TimelineContainer({ invitationId }: { invitationId: string | string[] | undefined }) {
  const result = await fetchTimeline().then(
    entries => ({ entries, unavailable: false }),
    () => ({ entries: [], unavailable: true }),
  );
  return <TimelineView {...result} invitationHref={invitationReturnLink(invitationId)} />;
}
