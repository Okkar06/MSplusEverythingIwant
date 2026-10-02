"use client";

import { MoodIcon } from "./mood-icons";
import { MOODS } from "@/lib/moods";
import { timeAgo } from "@/lib/time";
import type { MoodRow } from "@/lib/types";

type Props = {
  name: string;
  tone: "you" | "partner";
  mood: MoodRow | undefined;
  now: number;
  delayMs?: number;
};

export function MoodCard({ name, tone, mood, now, delayMs = 0 }: Props) {
  const style = mood ? MOODS[mood.mood] : undefined;
  return (
    <section
      aria-label={tone === "you" ? "Your current mood" : `${name}'s current mood`}
      className="animate-fade-up flex flex-col items-center rounded-lg bg-surface p-4 text-center sm:p-6"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <p className="flex items-center gap-1 text-small font-medium">
        <span className={`size-2 rounded-full ${tone === "you" ? "bg-you" : "bg-partner"}`} />
        {name}
      </p>

      <div
        className={`mt-4 flex size-20 items-center justify-center rounded-full transition-colors duration-(--duration-base) ${
          style ? `${style.tint} ${style.text}` : "bg-sunken text-ink-muted"
        }`}
      >
        {mood ? (
          // Keyed on the mood so a change remounts the icon and it pops in.
          <MoodIcon key={mood.mood} mood={mood.mood} className="size-12 animate-pop-in" />
        ) : (
          <span className="font-display text-title">?</span>
        )}
      </div>

      {style ? (
        <p className="mt-3 font-display text-title">{style.label}</p>
      ) : (
        <p className="mt-3 text-body text-ink-muted">No mood yet</p>
      )}
      {mood?.note && <p className="mt-1 text-small text-ink-muted break-words">“{mood.note}”</p>}
      {mood && (
        <p className="mt-2 text-caption text-ink-muted">{timeAgo(mood.updated_at, now)}</p>
      )}
    </section>
  );
}
