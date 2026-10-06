// The last couple data this device loaded, so the app can open without a
// connection and show where things stood instead of a spinner.
//
// It stays on this device only, per signed-in user, and is replaced on every
// successful load. Reactions aren't kept: they're a moment, not a state.
// Signing out deletes it.

import type { LocationRow, MoodRow, Profile } from "./types";

const PREFIX = "couple-snapshot:v1:";

export type CoupleSnapshot = {
  savedAt: string;
  profiles: Record<string, Profile>;
  moods: Record<string, MoodRow>;
  locations: Record<string, LocationRow>;
};

export function readSnapshot(userId: string): CoupleSnapshot | null {
  try {
    const raw = localStorage.getItem(PREFIX + userId);
    if (!raw) return null;
    const snap = JSON.parse(raw) as CoupleSnapshot;
    // Only trust what this app version wrote.
    return snap && typeof snap.savedAt === "string" && snap.profiles?.[userId] ? snap : null;
  } catch {
    return null;
  }
}

export function writeSnapshot(userId: string, snap: Omit<CoupleSnapshot, "savedAt">) {
  try {
    localStorage.setItem(PREFIX + userId, JSON.stringify({ ...snap, savedAt: new Date().toISOString() }));
  } catch {
    // Storage full or blocked: the app still works, just not offline.
  }
}

/** Forget every saved snapshot on this device (on sign-out). */
export function clearSnapshots() {
  try {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith(PREFIX)) localStorage.removeItem(key);
    }
  } catch {
    // Nothing to clear.
  }
}
