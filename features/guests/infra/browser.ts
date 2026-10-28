export async function submitGuest(name: string): Promise<void> {
  const response = await fetch("/api/guests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
    cache: "no-store",
  });
  const result: unknown = await response.json();
  if (response.status !== 201 || !result || typeof result !== "object" || !("success" in result) || result.success !== true) {
    throw new Error("Guest creation failed");
  }
}
