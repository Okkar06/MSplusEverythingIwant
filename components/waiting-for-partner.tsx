"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { getSupabase } from "@/lib/supabase/client";
import {
  approveRequest,
  cancelRequest,
  createInvite,
  declineRequest,
  formatCode,
  hasPartner,
  loadInvite,
  loadMyRequest,
  requestPair,
  type Invite,
  type MyRequest,
} from "@/lib/pairing";

type Props = {
  userId: string;
  name: string | undefined;
  email: string | undefined;
  onPaired: () => void;
  onSignOut: () => void;
};

const POLL_MS = 5_000;

const primaryButton =
  "h-11 w-full rounded-md bg-accent text-small font-semibold text-on-accent transition-transform duration-(--duration-quick) ease-standard active:scale-95 disabled:opacity-60";
const quietButton = "h-11 text-small text-accent disabled:opacity-60";

type Shown = Invite & { hours: number };

function withHours(invite: Invite): Shown {
  const hours = Math.max(1, Math.ceil((Date.parse(invite.expires_at) - Date.now()) / 3_600_000));
  return { ...invite, hours };
}

// Shown until the mutual partner link exists. One of you shares a code, the
// other types it in, which sends a request; the code's owner approves it, and
// only then are you linked. Once linked, Realtime updates both profiles and
// this screen gives way to the home screen by itself.
export function WaitingForPartner({ userId, name, email, onPaired, onSignOut }: Props) {
  const [invite, setInvite] = useState<Shown | null>(null);
  const [request, setRequest] = useState<MyRequest | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState<"create" | "request" | "approve" | "decline" | "cancel" | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const refreshInvite = useCallback(async () => {
    const found = await loadInvite();
    setInvite(found && withHours(found));
  }, []);

  // Restore an open code or a pending request, and hear about requests on
  // your code as they arrive.
  useEffect(() => {
    let cancelled = false;
    Promise.all([loadInvite(), loadMyRequest()]).then(([found, mine]) => {
      if (cancelled) return;
      setInvite(found && withHours(found));
      setRequest(mine.request);
    });

    const supabase = getSupabase();
    const channel = supabase
      .channel(`pair-invite:${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pair_invites", filter: `owner_id=eq.${userId}` },
        () => {
          if (!cancelled) refreshInvite();
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [userId, refreshInvite]);

  // While your request waits, check on it. You can't read the owner's invite,
  // so there's nothing to subscribe to; a light poll does instead.
  useEffect(() => {
    if (!request) return;
    const id = setInterval(async () => {
      if (document.visibilityState !== "visible") return;
      const mine = await loadMyRequest();
      // Still waiting, or the check failed (offline?): try again next tick.
      if (mine.failed || mine.request) return;
      // Gone: either approved (you now have a partner) or declined/expired.
      const linked = await hasPartner(userId);
      if (linked === null) return;
      if (linked) {
        onPaired();
        return;
      }
      setRequest(null);
      setMessage(`${request.owner_name} didn't accept, or the code expired. Ask for a new one.`);
    }, POLL_MS);
    return () => clearInterval(id);
  }, [request, userId, onPaired]);

  async function makeCode() {
    setBusy("create");
    setMessage(null);
    const { invite, error } = await createInvite();
    setBusy(null);
    if (error || !invite) setMessage(error ?? "Couldn't make a code. Try again.");
    else setInvite(withHours(invite));
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

  async function sendRequest(e: FormEvent) {
    e.preventDefault();
    setBusy("request");
    setMessage(null);
    const { request, error } = await requestPair(code);
    setBusy(null);
    if (error) setMessage(error);
    else {
      setRequest(request);
      setCode("");
    }
  }

  async function withdraw() {
    setBusy("cancel");
    const error = await cancelRequest();
    setBusy(null);
    if (error) setMessage(error);
    else setRequest(null);
  }

  async function approve() {
    setBusy("approve");
    setMessage(null);
    const error = await approveRequest();
    setBusy(null);
    if (error) {
      setMessage(error);
      refreshInvite();
    } else onPaired();
  }

  async function decline() {
    setBusy("decline");
    setMessage(null);
    const error = await declineRequest();
    setBusy(null);
    if (error) setMessage(error);
    else {
      setInvite(null);
      setMessage("Declined. That code no longer works; get a new one when you're ready.");
    }
  }

  return (
    <section className="animate-fade-up rounded-lg bg-surface p-4 sm:p-6">
      <div className="mx-auto mt-4 flex w-fit items-center">
        <span className="size-11 rounded-full bg-you" />
        <span className="-ml-3 size-11 rounded-full border-2 border-dashed border-partner bg-surface" />
      </div>
      <h1 className="mt-6 text-center font-display text-display">Almost there</h1>

      {invite?.requested_name ? (
        <IncomingRequest
          name={invite.requested_name}
          email={invite.requested_email}
          busy={busy}
          onApprove={approve}
          onDecline={decline}
        />
      ) : request ? (
        <div className="mt-6 flex flex-col items-center gap-2 text-center" role="status">
          <span className="relative flex size-3" aria-hidden>
            <span className="absolute inset-0 rounded-full bg-partner animate-breathe" />
            <span className="relative size-3 rounded-full bg-partner" />
          </span>
          <p className="text-body">
            Waiting for <span className="font-medium">{request.owner_name}</span> to accept…
          </p>
          <p className="text-caption text-ink-muted">This screen moves on by itself once they do.</p>
          <button className={quietButton} onClick={withdraw} disabled={busy !== null}>
            {busy === "cancel" ? "Cancelling…" : "Cancel request"}
          </button>
        </div>
      ) : (
        <>
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
                  Works for {invite.hours === 1 ? "about an hour" : `${invite.hours} more hours`}.
                  You&apos;ll be asked to accept when your partner uses it.
                </p>
                <button className={primaryButton} onClick={() => shareCode(invite.code)}>
                  Share code
                </button>
                <button className={quietButton} onClick={makeCode} disabled={busy !== null}>
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

          <form onSubmit={sendRequest} className="flex flex-col gap-2">
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
                {busy === "request" ? "Sending…" : "Ask to link"}
              </button>
            </div>
          </form>
        </>
      )}

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

function IncomingRequest({
  name,
  email,
  busy,
  onApprove,
  onDecline,
}: {
  name: string;
  email: string | null;
  busy: string | null;
  onApprove: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="mt-6 flex flex-col gap-2" role="group" aria-label="Link request">
      <p className="text-center text-body">
        <span className="font-medium">{name}</span> wants to link with you.
      </p>
      {email && <p className="text-center text-small text-ink-muted">{email}</p>}
      <p className="mt-2 text-center text-caption text-ink-muted">
        Only accept if this is your partner. Once linked, you&apos;ll see each other&apos;s mood
        and location.
      </p>
      <button className={`${primaryButton} mt-4`} onClick={onApprove} disabled={busy !== null}>
        {busy === "approve" ? "Linking…" : "Accept"}
      </button>
      <button className={quietButton} onClick={onDecline} disabled={busy !== null}>
        {busy === "decline" ? "Declining…" : "Decline"}
      </button>
    </div>
  );
}
