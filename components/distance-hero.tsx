"use client";

import { distanceMeters, formatDistance } from "@/lib/distance";
import { isLive, timeAgo } from "@/lib/time";
import { useCountUp } from "@/lib/use-count-up";
import type { LocationRow } from "@/lib/types";

type Props = {
  mine: LocationRow | undefined;
  theirs: LocationRow | undefined;
  partnerName: string;
  sharing: boolean;
  now: number;
};

export function DistanceHero({ mine, theirs, partnerName, sharing, now }: Props) {
  const target = mine && theirs ? distanceMeters(mine, theirs) : null;
  const shown = useCountUp(target);
  const partnerLive = isLive(theirs?.updated_at, now);

  let message: string | null = null;
  if (!mine && !theirs) message = "Share your locations to see how far apart you are.";
  else if (!mine) message = sharing ? "Finding you…" : "Share your location to see the distance.";
  else if (!theirs) message = `Waiting for ${partnerName}'s location.`;

  return (
    <section className="animate-fade-up rounded-lg bg-surface px-4 py-12 text-center sm:px-6">
      {shown !== null ? (
        <>
          <p className="font-display text-hero tabular-nums" aria-live="polite">
            {formatDistance(shown).value}
            <span className="ml-2 align-baseline text-lead font-sans text-ink-muted">
              {formatDistance(shown).unit}
            </span>
          </p>
          <p className="mt-2 text-small text-ink-muted">apart</p>
        </>
      ) : (
        <p className="mx-auto max-w-xs text-lead text-ink-muted">{message}</p>
      )}

      <div className="mt-8 flex justify-center gap-8">
        <Presence label="You" tone="you" location={mine} now={now} />
        <Presence label={partnerName} tone="partner" location={theirs} live={partnerLive} now={now} />
      </div>
    </section>
  );
}

function Presence({
  label,
  tone,
  location,
  live = false,
  now,
}: {
  label: string;
  tone: "you" | "partner";
  location: LocationRow | undefined;
  live?: boolean;
  now: number;
}) {
  const dot = tone === "you" ? "bg-you" : "bg-partner";
  const ring = tone === "you" ? "bg-you" : "bg-partner";
  return (
    <div className="flex items-center gap-2 text-left">
      <span className="relative flex size-3">
        {live && <span className={`absolute inset-0 rounded-full ${ring} animate-breathe`} />}
        <span
          className={`relative size-3 rounded-full transition-colors duration-(--duration-base) ${
            location ? dot : "bg-line"
          }`}
        />
      </span>
      <span>
        <span className="block text-small font-medium">{label}</span>
        <span className="block text-caption text-ink-muted">
          {location ? `updated ${timeAgo(location.updated_at, now)}` : "not sharing"}
        </span>
      </span>
    </div>
  );
}
