export const juryIds = ['manuel', 'marco', 'david'] as const;
export type JuryId = typeof juryIds[number];

export const acts = [
  { name: 'Joschua', act: 'Kartenzauber', initials: 'JO', icon: 'cards' },
  { name: 'Danny', act: 'Jonglieren', initials: 'DA', icon: 'sparkles' },
  { name: 'Johannes', act: 'Klavier', initials: 'JO', icon: 'star' },
  { name: 'Jakob', act: 'Zeichentalent', initials: 'JA', icon: 'star' },
  { name: 'Charlie', act: 'Karaoke? / noch offen', initials: 'CH', icon: 'microphone' },
  { name: 'Daniel, Thiebaud & Leonard', act: 'Überraschung / noch offen', initials: 'DTL', icon: 'sparkles' },
] as const;
