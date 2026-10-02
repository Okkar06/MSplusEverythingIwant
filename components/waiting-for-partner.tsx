"use client";

import { useEffect, useState, type FormEvent } from "react";
import { acceptInvite, createInvite, formatCode, loadInvite, type Invite } from "@/lib/pairing";

type Props = {
  name: string | undefined;
  email: string | undefined;
  onPaired: () => void;
  onSignOut: () => void;
};

const primaryButton =
  "h-11 w-full rounded-md bg-accent text-small font-semibold text-on-accent transition-transform duration-(--duration-quick) ease-standard active:scale-95 disabled:opacity-60";

function hoursLeft(invite: Invite) {
  return Math.max(1, Math.ceil((Date.parse(invite.expires_at) - Date.now()) / 3_600_000));
}

// Shown until the mutual partner link exists. One of you shares a code, the
// other types it in. When your partner uses your code, Realtime updates your
// profile and this screen gives way to the home screen by itself.
export function WaitingForPartner({ name, email, onPaired, onSignOut }: Props) {
  const [invite, setInvite] = useState<{ code: string; hours: number } | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState<"create" | "accept" | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadInvite().then((found) => {
      if (!cancelled && found) setInvite({ code: found.code, hours: hoursLeft(found) });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function makeCode() {
    setBusy("create");
    setMessage(null);
    const { invite, error } = await createInvite();
    setBusy(null);
    if (error || !invite) setMessage(error ?? "Couldn't make a code. Try again.");
    else setInvite({ code: invite.code, hours: hoursLeft(invite) });
  }

  async function shareCode(value: string) {
    const text = `Link up with me on Us. My code is ${formatCode(value)}`;
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
      await navigator.clipboard.writeText(value);
      setMessage("Code copied.");
    } catch (e) {
      // Closing the share sheet isn't an error worth showing.
      if ((e as Error).name !== "AbortError") setMessage("Couldn't share. Read the code out instead.");
    }
  }

  async function linkUp(e: FormEvent) {
    e.preventDefault();
    setBusy("accept");
    setMessage(null);
    const error = await acceptInvite(code);
    setBusy(null);
    if (error) setMessage(error);
    else onPaired();
  }

  return (
    <section className="animate-fade-up rounded-lg bg-surface p-4 sm:p-6">
      <div className="mx-auto mt-4 flex w-fit items-center">
        <span className="size-11 rounded-full bg-you" />
        <span className="-ml-3 size-11 rounded-full border-2 border-dashed border-partner bg-surface" />
      </div>
      <h1 className="mt-6 text-center font-display text-display">Almost there</h1>
      <p className="mt-4 text-center text-body text-ink-muted">
        {name ? `You're signed in, ${name}. ` : "You're signed in. "}
        Now link up with your partner: one of you shares a code, the other types it in.
      </p>

      <div className="mt-8 flex flex-col gap-2">
        <h2 className="text-small font-medium">Share your code</h2>
        {invite ? (
          <>
            <p
              className="rounded-md bg-sunken py-3 text-center font-display text-display tracking-wide tabular-nums"
              aria-label={`Your code: ${invite.code.split("").join(" ")}`}
            >
              {formatCode(invite.code)}
            </p>
            <p className="text-caption text-ink-muted">
              Works for {invite.hours === 1 ? "about an hour" : `${invite.hours} more hours`}. This
              screen moves on by itself once your partner uses it.
            </p>
            <button className={primaryButton} onClick={() => shareCode(invite.code)}>
              Share code
            </button>
            <button
              className="h-11 text-small text-accent disabled:opacity-60"
              onClick={makeCode}
              disabled={busy !== null}
            >
              {busy === "create" ? "Making a new code…" : "Get a new code"}
            </button>
          </>
        ) : (
          <button className={primaryButton} onClick={makeCode} disabled={busy !== null}>
            {busy === "create" ? "Making a code…" : "Get a code"}
          </button>
        )}
      </div>

      <div className="my-6 flex items-center gap-3 text-caption text-ink-muted" aria-hidden>
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={linkUp} className="flex flex-col gap-2">
        <label htmlFor="partner-code" className="text-small font-medium">
          Got your partner&apos;s code?
        </label>
        <div className="flex gap-2">
          <input
            id="partner-code"
            className="h-11 min-w-0 flex-1 rounded-md border border-line bg-sunken px-3 text-center font-display text-title uppercase tracking-wide placeholder:text-ink-muted"
            autoCapitalize="characters"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            maxLength={9}
            placeholder="ABC 234"
            required
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setMessage(null);
            }}
          />
          <button
            className="h-11 shrink-0 rounded-md bg-accent px-4 text-small font-semibold text-on-accent transition-transform duration-(--duration-quick) ease-standard active:scale-95 disabled:opacity-60"
            disabled={busy !== null || code.replace(/[^a-z0-9]/gi, "").length !== 6}
          >
            {busy === "accept" ? "Linking…" : "Link us"}
          </button>
        </div>
      </form>

      <p className="mt-4 min-h-5 text-center text-small text-ink" role="status" aria-live="polite">
        {message}
      </p>

      {email && <p className="mt-4 text-center text-caption text-ink-muted">Signed in as {email}</p>}
      <div className="mt-2 flex justify-center gap-4">
        <button className="h-11 text-small text-accent" onClick={onPaired}>
          Check again
        </button>
        <button className="h-11 text-small text-accent" onClick={onSignOut}>
          Sign out
        </button>
      </div>
    </section>
  );
}
