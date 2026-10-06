"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { ReactionIcon } from "./reaction-icons";
import { REACTION_FRESH_MS, REACTION_SHOW_MS, REACTIONS } from "@/lib/reactions";
import type { ReactionRow } from "@/lib/types";

type Props = {
  partnerName: string;
  /** Your partner's latest reaction, if any. */
  reaction: ReactionRow | undefined;
  now: number;
};

// The last reaction you've already seen, so reopening the app doesn't replay it.
const SEEN_KEY = "reaction-seen:v1";

function readSeen(): string | null {
  try {
    return localStorage.getItem(SEEN_KEY);
  } catch {
    return null;
  }
}

function writeSeen(sentAt: string) {
  try {
    localStorage.setItem(SEEN_KEY, sentAt);
  } catch {
    // Storage blocked: at worst the same reaction shows once more next visit.
  }
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

/** Whether the page is on screen (not a background tab or a locked phone). */
function usePageVisible() {
  return useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "visible",
    () => true,
  );
}

/**
 * Shows your partner's reaction for a few seconds when it arrives, or when you
 * open the app and there's a recent one you haven't seen. Tap to dismiss.
 *
 * A reaction only counts as seen after it has been on screen for the full few
 * seconds: one that arrives while the app is in the background or the phone
 * is locked waits, and its countdown starts when you come back.
 */
export function ReactionBanner({ partnerName, reaction, now }: Props) {
  const [seen, setSeen] = useState<string | null>(readSeen);
  const pageVisible = usePageVisible();

  const showing =
    reaction !== undefined &&
    reaction.sent_at !== seen &&
    now - Date.parse(reaction.sent_at) < REACTION_FRESH_MS;

  const sentAt = showing ? reaction.sent_at : null;

  useEffect(() => {
    if (!sentAt || !pageVisible) return;
    const id = setTimeout(() => {
      writeSeen(sentAt);
      setSeen(sentAt);
    }, REACTION_SHOW_MS);
    return () => clearTimeout(id);
  }, [sentAt, pageVisible]);

  function dismiss() {
    if (!sentAt) return;
    writeSeen(sentAt);
    setSeen(sentAt);
  }

  // The live region stays mounted (empty when nothing shows) so screen readers
  // announce a reaction when it appears; the button inside is a normal button.
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-4 z-10 flex justify-center px-4"
    >
      {showing && (
        <button
          key={reaction.sent_at}
          onClick={dismiss}
          className="animate-pop-in pointer-events-auto flex min-h-11 items-center gap-3 rounded-full bg-surface py-2 pr-5 pl-3 shadow-lg ring-1 ring-line"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-partner/15">
            <ReactionIcon kind={reaction.kind} className="size-6 text-partner" />
          </span>
          <span className="text-body text-ink">
            <span className="font-medium">{partnerName}</span> {REACTIONS[reaction.kind].sent}
          </span>
        </button>
      )}
    </div>
  );
}
