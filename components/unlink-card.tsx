"use client";

import { useState } from "react";

type Props = {
  partnerName: string;
  onUnlink: () => Promise<string | null>;
  delayMs?: number;
};

// Ending the link is one tap away but always asks first: it can't be undone
// without making and approving a new code.
export function UnlinkCard({ partnerName, onUnlink, delayMs = 0 }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function unlink() {
    setBusy(true);
    setError(null);
    const message = await onUnlink();
    // On success this card unmounts with the home screen.
    setBusy(false);
    if (message) setError(message);
  }

  return (
    <section
      aria-label="Unlink"
      className="animate-fade-up rounded-lg bg-surface p-4 sm:p-6"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {confirming ? (
        <div className="flex flex-col gap-2">
          <p className="text-body">Unlink from {partnerName}?</p>
          <p className="text-small text-ink-muted">
            You&apos;ll both stop seeing each other&apos;s mood and location, and both your stored
            locations are deleted. Your location sharing turns off. To link again, one of you
            shares a new code.
          </p>
          <div className="mt-2 flex gap-2">
            <button
              className="h-11 flex-1 rounded-md bg-accent text-small font-semibold text-on-accent transition-transform duration-(--duration-quick) ease-standard active:scale-95 disabled:opacity-60"
              onClick={unlink}
              disabled={busy}
            >
              {busy ? "Unlinking…" : "Unlink"}
            </button>
            <button
              className="h-11 flex-1 rounded-md bg-sunken text-small font-semibold text-ink transition-transform duration-(--duration-quick) ease-standard active:scale-95 disabled:opacity-60"
              onClick={() => {
                setConfirming(false);
                setError(null);
              }}
              disabled={busy}
            >
              Keep linked
            </button>
          </div>
          {error && (
            <p role="alert" className="text-small text-ink">
              {error}
            </p>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <p className="text-small text-ink-muted">Linked with {partnerName}</p>
          <button className="h-11 shrink-0 text-small text-accent" onClick={() => setConfirming(true)}>
            Unlink…
          </button>
        </div>
      )}
    </section>
  );
}
