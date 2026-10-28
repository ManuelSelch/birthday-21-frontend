import { guestAssignments, type GuestAssignments } from "../domain/assignments";

export function updateAssignmentsHandler(dependencies: {
  authorize: (request: Request) => Response | undefined;
  readBody: (request: Request) => Promise<Record<string, unknown> | null>;
  json: (body: unknown, status?: number) => Response;
  find: (id: string) => Promise<{ _id?: string } | null>;
  save: (guest: GuestAssignments & { _id: string }) => Promise<unknown>;
}) {
  return async (request: Request): Promise<Response> => {
    const denied = dependencies.authorize(request);
    if (denied) return denied;
    const body = await dependencies.readBody(request);
    const assignments = guestAssignments(body);
    if (!assignments || typeof body?.id !== "string" || !/^[a-zA-Z0-9_-]{1,100}$/.test(body.id)) {
      return dependencies.json({ error: "Bitte prüfe Gast, Gruppen und Hosts." }, 400);
    }
    try {
      const guest = await dependencies.find(body.id);
      if (!guest || guest._id !== body.id) return dependencies.json({ error: "Gast nicht gefunden." }, 404);
      const saved = await dependencies.save({ _id: body.id, ...assignments });
      if (!saved || typeof saved !== "object" || !("_id" in saved) || saved._id !== body.id) throw new Error("Unconfirmed save");
      return dependencies.json({ success: true });
    } catch {
      return dependencies.json({ error: "Zuordnung konnte nicht gespeichert werden. Bitte versuche es erneut." }, 502);
    }
  };
}
