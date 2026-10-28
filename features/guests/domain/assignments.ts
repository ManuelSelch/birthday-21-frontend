export const HOSTS = ["Manuel", "Marco", "David"] as const;
export type Host = typeof HOSTS[number];
export type GuestAssignments = { groups: string[]; hosts: Host[] };

export function guestAssignments(value: unknown): GuestAssignments | undefined {
  if (!value || typeof value !== "object" || !("groups" in value) || !("hosts" in value)) return;
  const { groups, hosts } = value;
  if (!Array.isArray(groups) || groups.length > 50 || !Array.isArray(hosts) || hosts.length > 50) return;
  if (!groups.every((group: unknown) => typeof group === "string" && group.trim().length > 0 && group.trim().length <= 40)) return;
  if (!hosts.every((host: unknown) => typeof host === "string" && HOSTS.includes(host as Host))) return;
  return { groups: [...new Set(groups.map((group: string) => group.trim()))], hosts: [...new Set(hosts)] as Host[] };
}
