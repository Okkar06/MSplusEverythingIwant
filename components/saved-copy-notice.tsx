"use client";

import { useOnline } from "@/lib/use-online";
import { timeAgo } from "@/lib/time";

type Props = {
  savedAt: string;
  now: number;
};

// Shown while the home screen is showing this device's saved copy instead of
// live data, e.g. when the app was opened without a connection.
export function SavedCopyNotice({ savedAt, now }: Props) {
  const online = useOnline();
  return (
    <p
      role="status"
      className="flex items-center gap-2 rounded-md bg-sunken px-3 py-2 text-small text-ink"
    >
      <span className="size-2 shrink-0 rounded-full bg-ink-muted" aria-hidden />
      <span>
        {online ? "Reconnecting…" : "You're offline."} Showing what you last saw,{" "}
        {timeAgo(savedAt, now)}.
      </span>
    </p>
  );
}
