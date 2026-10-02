"use client";

import { useState } from "react";
import { MoodIcon } from "./mood-icons";
import { MOOD_VALUES, MOODS, type MoodValue } from "@/lib/moods";
import type { MoodRow } from "@/lib/types";

type Props = {
  current: MoodRow | undefined;
  onPick: (mood: MoodValue, note: string | null) => void;
  delayMs?: number;
};

export function MoodPicker({ current, onPick, delayMs = 0 }: Props) {
  const [note, setNote] = useState(current?.note ?? "");
  const cleanNote = note.trim() || null;

  function saveNote() {
    if (current && cleanNote !== current.note) onPick(current.mood, cleanNote);
  }

  return (
    <section
      className="animate-fade-up rounded-lg bg-surface p-4 sm:p-6"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <h2 className="font-display text-title">How are you feeling?</h2>

      <div className="mt-4 grid grid-cols-4 gap-2" role="radiogroup" aria-label="Your mood">
        {MOOD_VALUES.map((value) => {
          const style = MOODS[value];
          const selected = current?.mood === value;
          return (
            <button
              key={value}
              role="radio"
              aria-checked={selected}
              onClick={() => onPick(value, cleanNote)}
              className={`flex min-h-11 flex-col items-center gap-1 rounded-md px-1 py-2 transition-[transform,background-color] duration-(--duration-quick) ease-standard active:scale-95 ${
                selected ? style.tint : "hover:bg-sunken"
              }`}
            >
              <MoodIcon
                key={selected ? "on" : "off"}
                mood={value}
                className={`size-8 ${style.text} ${selected ? "animate-pop-in" : ""}`}
              />
              <span className="text-caption text-ink">{style.label}</span>
            </button>
          );
        })}
      </div>

      <label className="mt-4 flex flex-col gap-1">
        <span className="text-small font-medium">
          Add a note <span className="text-ink-muted">(optional)</span>
        </span>
        <input
          className="h-11 w-full rounded-md border border-line bg-sunken px-3 text-body text-ink placeholder:text-ink-muted"
          maxLength={80}
          placeholder="Long day, thinking of you"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={saveNote}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
        />
      </label>
      {!current && (
        <p className="mt-2 text-caption text-ink-muted">Your note is sent when you pick a mood.</p>
      )}
    </section>
  );
}
