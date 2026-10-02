"use client";

import { compassDirection, distanceMeters } from "@/lib/distance";
import { isLive } from "@/lib/time";
import type { LocationRow } from "@/lib/types";

// A tile-free map: just the two of you and the line between, drawn to scale
// and oriented north-up. No map tiles means no third party ever sees a location.

const W = 320;
const H = 160;
const PAD = 28;
const NEAR_M = 50; // closer than this, draw you side by side

type Props = {
  mine: LocationRow;
  theirs: LocationRow;
  partnerName: string;
  now: number;
  delayMs?: number;
};

function project(mine: LocationRow, theirs: LocationRow) {
  // Take the short way round across the antimeridian.
  let theirLon = theirs.longitude;
  if (theirLon - mine.longitude > 180) theirLon -= 360;
  if (theirLon - mine.longitude < -180) theirLon += 360;

  // Equirectangular around the midpoint: fine at the scale of one screen.
  const k = Math.cos((((mine.latitude + theirs.latitude) / 2) * Math.PI) / 180);
  const a = { x: mine.longitude * k, y: -mine.latitude };
  const b = { x: theirLon * k, y: -theirs.latitude };

  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const scale = Math.min((W - 2 * PAD) / Math.abs(dx || 1e-9), (H - 2 * PAD) / Math.abs(dy || 1e-9));
  const cx = W / 2;
  const cy = H / 2;
  return {
    you: { x: cx - (dx * scale) / 2, y: cy - (dy * scale) / 2 },
    them: { x: cx + (dx * scale) / 2, y: cy + (dy * scale) / 2 },
  };
}

export function MiniMap({ mine, theirs, partnerName, now, delayMs = 0 }: Props) {
  const near = distanceMeters(mine, theirs) < NEAR_M;
  const { you, them } = near
    ? { you: { x: W / 2 - 10, y: H / 2 }, them: { x: W / 2 + 10, y: H / 2 } }
    : project(mine, theirs);
  const live = isLive(theirs.updated_at, now);
  const caption = near
    ? `You and ${partnerName} are together.`
    : `${partnerName} is ${compassDirection(mine, theirs)} of you.`;

  return (
    <section
      className="animate-fade-up rounded-lg bg-surface p-4 sm:p-6"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-md bg-sunken" role="img" aria-label={caption}>
        {/* North marker */}
        <g className="fill-ink-muted text-caption" transform={`translate(${W - 18} 20)`}>
          <path d="M0 -8 L4 2 L0 0 L-4 2 Z" />
          <text y="14" textAnchor="middle" className="font-sans" fontSize="10">
            N
          </text>
        </g>

        {!near && (
          <line
            x1={you.x}
            y1={you.y}
            x2={them.x}
            y2={them.y}
            className="stroke-ink-muted"
            strokeWidth={2}
            strokeDasharray="2 6"
            strokeLinecap="round"
          />
        )}

        {live && (
          <circle
            cx={them.x}
            cy={them.y}
            r={14}
            className="animate-breathe fill-partner"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        )}
        <circle cx={them.x} cy={them.y} r={7} className="fill-partner stroke-surface" strokeWidth={2} />
        <circle cx={you.x} cy={you.y} r={7} className="fill-you stroke-surface" strokeWidth={2} />
      </svg>
      <p className="mt-3 text-center text-small text-ink-muted">{caption}</p>
    </section>
  );
}
