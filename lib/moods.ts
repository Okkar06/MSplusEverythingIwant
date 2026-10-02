// The fixed mood list. Must match the moods.mood check constraint in the
// migration, design/tokens.json, app/globals.css and components/mood-icons.tsx.

export const MOOD_VALUES = [
  "happy",
  "loved",
  "calm",
  "excited",
  "tired",
  "sad",
  "stressed",
  "missing_you",
] as const;

export type MoodValue = (typeof MOOD_VALUES)[number];

type MoodStyle = {
  label: string;
  /** Text colour, for the icon (via currentColor). */
  text: string;
  /** Soft tinted background behind the icon. */
  tint: string;
};

// Class names are written out in full so Tailwind can find them.
export const MOODS: Record<MoodValue, MoodStyle> = {
  happy: { label: "Happy", text: "text-mood-happy", tint: "bg-mood-happy/15" },
  loved: { label: "Loved", text: "text-mood-loved", tint: "bg-mood-loved/15" },
  calm: { label: "Calm", text: "text-mood-calm", tint: "bg-mood-calm/15" },
  excited: { label: "Excited", text: "text-mood-excited", tint: "bg-mood-excited/15" },
  tired: { label: "Tired", text: "text-mood-tired", tint: "bg-mood-tired/15" },
  sad: { label: "Sad", text: "text-mood-sad", tint: "bg-mood-sad/15" },
  stressed: { label: "Stressed", text: "text-mood-stressed", tint: "bg-mood-stressed/15" },
  missing_you: {
    label: "Missing you",
    text: "text-mood-missing-you",
    tint: "bg-mood-missing-you/15",
  },
};
