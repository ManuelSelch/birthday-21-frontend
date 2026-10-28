export async function submitAuthentication(action: "login" | "logout", body: Record<string, unknown> = {}) {
  const response = await fetch(`/api/admin/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    cache: "no-store",
    body: JSON.stringify(body),
  });
  const data = await response.json() as { redirectTo?: string };
  return { ok: response.ok, status: response.status, ...data };
}
