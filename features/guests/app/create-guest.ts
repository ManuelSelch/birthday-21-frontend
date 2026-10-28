import { newGuest, type NewGuest } from "../domain/new-guest";

export function createGuestHandler(dependencies: {
  authorize: (request: Request) => Response | undefined;
  readBody: (request: Request) => Promise<Record<string, unknown> | null>;
  json: (body: unknown, status?: number) => Response;
  save: (guest: NewGuest) => Promise<unknown>;
}) {
  return async (request: Request): Promise<Response> => {
    const denied = dependencies.authorize(request);
    if (denied) return denied;

    const body = await dependencies.readBody(request);
    const guest = newGuest(body?.name);
    if (!guest) return dependencies.json({ error: "Bitte gib einen Namen mit 1 bis 100 Zeichen ein." }, 400);

    try {
      const saved = await dependencies.save(guest);
      if (!saved || typeof saved !== "object" || !("_id" in saved) || typeof saved._id !== "string" || !saved._id) {
        throw new Error("Guest creation was not confirmed");
      }
      return dependencies.json({ success: true }, 201);
    } catch {
      return dependencies.json({ error: "Gast konnte nicht hinzugefügt werden. Bitte versuche es erneut." }, 502);
    }
  };
}
