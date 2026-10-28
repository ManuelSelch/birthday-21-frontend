export type InvitationAction = "invited" | "accept" | "cancel" | "companion";

export async function submitInvitation(
  action: InvitationAction,
  id: string,
  companion?: boolean,
  request: typeof fetch = fetch,
): Promise<boolean> {
  const query = new URLSearchParams({ id });
  if (action === "companion") query.set("companion", companion ? "1" : "0");

  try {
    const response = await request(`/api/${action}?${query}`, { method: "GET", cache: "no-store" });
    if (!response.ok) return false;
    const result: unknown = await response.json();
    return !!result && typeof result === "object" && "success" in result && result.success === true;
  } catch {
    return false;
  }
}
