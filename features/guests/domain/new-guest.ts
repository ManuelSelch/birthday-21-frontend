export function newGuest(value: unknown) {
  if (typeof value !== "string") return;
  const name = value.trim();
  if (!name || name.length > 100) return;

  return { name, invited: false, accepted: false, checked_in: false, companion: false, points: 0 };
}

export type NewGuest = NonNullable<ReturnType<typeof newGuest>>;
