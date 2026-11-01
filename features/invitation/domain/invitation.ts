export interface InvitationGuest {
  _id: string;
  name: string;
  accepted: boolean;
  companion: boolean;
}

export const invitationEvent = {
  title: "21. Geburtstag",
  year: "2026",
  hosts: "MANUEL · MARCO · DAVID",
  date: "20. November 2026",
  location: "Reichshof Bayreuth",
};

export function parseGuest(value: unknown): InvitationGuest | null {
  if (!value || typeof value !== "object" || !("_id" in value) || !("name" in value)) return null;
  if (typeof value._id !== "string" || !value._id.trim() || typeof value.name !== "string" || !value.name.trim()) return null;
  return {
    _id: value._id,
    name: value.name,
    accepted: "accepted" in value && value.accepted === true,
    companion: "companion" in value && value.companion === true,
  };
}

export function ticketLinks(id: string) {
  const encoded = encodeURIComponent(id);
  return {
    invitation: `https://geburtstag.manuelselch.de/invite?id=${encoded}`,
    timeline: `/timeline?id=${encoded}`,
    wallet: `/api/apple-pass?id=${encoded}`,
    whatsapp: "https://chat.whatsapp.com/CjiF2b7n2dnB3lJ50a7FL0?s=cl&p=i&mlu=4&ilr=4&iam=2",
  };
}
