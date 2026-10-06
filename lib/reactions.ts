// The fixed list of reactions. Must match the reactions.kind check constraint
// in supabase/migrations/20261005010000_reactions.sql and the icons in
// components/reaction-icons.tsx.

export const REACTION_KINDS = ["heart", "hug", "thinking_of_you"] as const;

export type ReactionKind = (typeof REACTION_KINDS)[number];

export const REACTIONS: Record<ReactionKind, { label: string; sent: string }> = {
  heart: { label: "Heart", sent: "sent you a heart" },
  hug: { label: "Hug", sent: "sent you a hug" },
  thinking_of_you: { label: "Thinking of you", sent: "is thinking of you" },
};

/** How long a reaction shows on the receiver's screen. */
export const REACTION_SHOW_MS = 5_000;

/** A reaction older than this when the app opens is old news: don't pop it. */
export const REACTION_FRESH_MS = 10 * 60_000;
