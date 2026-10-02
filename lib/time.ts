"use client";

import { useEffect, useState } from "react";

/** The current time, refreshed every `intervalMs`. */
export function useNow(intervalMs = 30_000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

/** "just now", "4 min ago", "2 h ago", "3 days ago". */
export function timeAgo(iso: string, now: number): string {
  const seconds = Math.max(0, (now - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}

/** A location counts as live if it was updated in the last few minutes. */
export const LIVE_WINDOW_MS = 5 * 60_000;

export function isLive(iso: string | undefined, now: number): boolean {
  return iso !== undefined && now - new Date(iso).getTime() < LIVE_WINDOW_MS;
}
