"use client";

import { useState, type FormEvent } from "react";

type Props = {
  name: string;
  onSave: (name: string) => Promise<string | null>;
  onSignOut: () => void;
  delayMs?: number;
};

export function NameCard({ name, onSave, onSignOut, delayMs = 0 }: Props) {
  const [draft, setDraft] = useState(name);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const clean = draft.trim();
  const changed = clean !== name && clean.length > 0;

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!changed) return;
    setBusy(true);
    const error = await onSave(clean);
    setBusy(false);
    setMessage(error ?? "Saved.");
  }

  return (
    <section
      className="animate-fade-up rounded-lg bg-surface p-4 sm:p-6"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <form onSubmit={save} className="flex flex-col gap-1">
        <label htmlFor="display-name" className="text-small font-medium">
          Your name
        </label>
        <div className="flex gap-2">
          <input
            id="display-name"
            className="h-11 min-w-0 flex-1 rounded-md border border-line bg-sunken px-3 text-body text-ink"
            maxLength={40}
            required
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setMessage(null);
            }}
          />
          <button
            className="h-11 shrink-0 rounded-md bg-accent px-4 text-small font-semibold text-on-accent transition-transform duration-(--duration-quick) ease-standard active:scale-95 disabled:opacity-60"
            disabled={!changed || busy}
          >
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
        <p className="min-h-4 text-caption text-ink-muted" aria-live="polite">
          {message}
        </p>
      </form>
      <button className="mt-2 h-11 text-small text-accent" onClick={onSignOut}>
        Sign out
      </button>
    </section>
  );
}
