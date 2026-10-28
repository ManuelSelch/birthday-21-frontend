import cockpit from "@/lib/cockpit";
import { parseTimeline } from "../domain/timeline";

export async function fetchTimeline() {
  return parseTimeline(await cockpit.getItems<unknown>("timeline"));
}
