"use client";

import { useEffect, useState } from "react";
import { ReactionIcon } from "./reaction-icons";
import { REACTION_KINDS, REACTIONS, type ReactionKind } from "@/lib/reactions";

type Props = {
  partnerName: string;
  onSend: (kind: ReactionKind) => Promise<string | null>;
  delayMs?: number;
};

/** After sending, the buttons rest briefly, so a reaction stays a small gesture, not a spam. */
const COOLDOWN_MS = 2_000;

export function ReactionBar({ partnerName, onSend, delayMs = 0 }: Props) {
  const [sent, setSent] = useState<ReactionKind | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sent) return;
    const id = setTimeout(() => setSent(null), COOLDOWN_MS);
    return () => clearTimeout(id);
  }, [sent]);

  async function send(kind: ReactionKind) {
    setBusy(true);
    setError(null);
    const message = await onSend(kind);
    setBusy(false);
    if (message) setError(message);
    else setSent(kind);
  }

  return (
    <section
      aria-label={`Send ${partnerName} a reaction`}
      className="animate-fade-up rounded-lg bg-surface p-4 sm:p-6"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <h2 className="text-small font-medium">Send {partnerName} a little something</h2>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {REACTION_KINDS.map((kind) => {
          const justSent = sent === kind;
          return (
            <button
              key={kind}
              onClick={() => send(kind)}
              disabled={busy || sent !== null}
              className={`flex min-h-11 flex-col items-center justify-start gap-1 rounded-md px-1 py-2 transition-[transform,background-color,opacity] duration-(--duration-quick) ease-standard active:scale-95 disabled:opacity-60 ${
                justSent ? "bg-you/15 disabled:opacity-100" : "hover:bg-sunken"
              }`}
            >
              <ReactionIcon
                key={justSent ? "sent" : "idle"}
                kind={kind}
                className={`size-8 text-you ${justSent ? "animate-pop-in" : ""}`}
              />
              <span className="text-center text-caption leading-tight text-ink">{justSent ? "Sent" : REACTIONS[kind].label}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 min-h-4 text-caption text-ink" role="status" aria-live="polite">
        {error ?? (sent ? `${partnerName} will see it right away.` : null)}
      </p>
    </section>
  );
}
