"use client";

type Props = {
  partnerName: string;
  sharing: boolean;
  error: string | null;
  onStart: () => void;
  onStop: () => void;
  delayMs?: number;
};

export function LocationCard({ partnerName, sharing, error, onStart, onStop, delayMs = 0 }: Props) {
  return (
    <section
      className="animate-fade-up rounded-lg bg-surface p-4 sm:p-6"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-body font-semibold">Share my location</h2>
          <p className="mt-1 text-small text-ink-muted">
            Only {partnerName} can see it, and only your latest spot is kept. Sharing pauses when
            you close the app.
          </p>
        </div>
        <button
          role="switch"
          aria-checked={sharing}
          aria-label="Share my location"
          onClick={sharing ? onStop : onStart}
          className="flex h-11 shrink-0 items-center"
        >
          <span
            className={`flex h-7 w-12 items-center rounded-full p-1 transition-colors duration-(--duration-base) ease-standard ${
              sharing ? "bg-you" : "bg-sunken ring-1 ring-line"
            }`}
          >
            <span
              className={`size-5 rounded-full bg-surface transition-transform duration-(--duration-base) ease-standard ${
                sharing ? "translate-x-5" : ""
              }`}
            />
          </span>
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-small text-ink">
          {error}
        </p>
      )}
    </section>
  );
}
