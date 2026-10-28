export function updateVideoHandler(dependencies: {
  authorize: (request: Request) => Response | undefined;
  readBody: (request: Request) => Promise<Record<string, unknown> | null>;
  json: (body: unknown, status?: number) => Response;
  find: (id: string) => Promise<{ _id?: string } | null>;
  save: (guest: { _id: string; video: boolean }) => Promise<unknown>;
}) {
  return async (request: Request): Promise<Response> => {
    const denied = dependencies.authorize(request);
    if (denied) return denied;
    const body = await dependencies.readBody(request);
    if (typeof body?.id !== "string" || !/^[a-zA-Z0-9_-]{1,100}$/.test(body.id) || typeof body.video !== "boolean") {
      return dependencies.json({ error: "Bitte prüfe Gast und Video-Status." }, 400);
    }
    try {
      const guest = await dependencies.find(body.id);
      if (!guest || guest._id !== body.id) return dependencies.json({ error: "Gast nicht gefunden." }, 404);
      const saved = await dependencies.save({ _id: body.id, video: body.video });
      if (!saved || typeof saved !== "object" || !("_id" in saved) || saved._id !== body.id) throw new Error("Unconfirmed save");
      return dependencies.json({ success: true });
    } catch {
      return dependencies.json({ error: "Video-Status konnte nicht gespeichert werden. Bitte versuche es erneut." }, 502);
    }
  };
}
