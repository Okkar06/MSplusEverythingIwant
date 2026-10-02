"use client";

import { useState, type FormEvent } from "react";
import { getSupabase } from "@/lib/supabase/client";

const input =
  "h-11 w-full rounded-md border border-line bg-sunken px-3 text-body text-ink placeholder:text-ink-muted";
const primaryButton =
  "h-11 w-full rounded-md bg-accent text-small font-semibold text-on-accent transition-transform duration-(--duration-quick) ease-standard active:scale-95 disabled:opacity-60";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendLink(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await getSupabase().auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
        // Only used the first time, when the profile is created.
        data: name.trim() ? { display_name: name.trim() } : undefined,
      },
    });
    setBusy(false);
    if (error) setError(error.message);
    else setStep("code");
  }

  async function verifyCode(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await getSupabase().auth.verifyOtp({
      email,
      token: code.trim(),
      type: "email",
    });
    setBusy(false);
    if (error) setError(error.message);
  }

  return (
    <section className="animate-fade-up rounded-lg bg-surface p-4 sm:p-6">
      <h1 className="font-display text-heading">Hello, you two</h1>

      {/* Keyed so React builds new elements per step. Otherwise it reuses the
          "Use a different email" button as the email form's submit button
          mid-click, and that click sends the email again. */}
      {step === "email" ? (
        <form key="email" onSubmit={sendLink} className="mt-6 flex flex-col gap-4">
          <p className="text-body text-ink-muted">
            Sign in with your email. We&apos;ll send you a link and a code.
          </p>
          <label className="flex flex-col gap-1">
            <span className="text-small font-medium">Email</span>
            <input
              className={input}
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-small font-medium">
              Your name <span className="text-ink-muted">(first time only)</span>
            </span>
            <input
              className={input}
              type="text"
              autoComplete="given-name"
              maxLength={40}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <button className={primaryButton} disabled={busy}>
            {busy ? "Sending…" : "Send sign-in email"}
          </button>
        </form>
      ) : (
        <form key="code" onSubmit={verifyCode} className="mt-6 flex flex-col gap-4">
          <p className="text-body text-ink-muted">
            Check <span className="font-medium text-ink">{email}</span>. Tap the link, or type the
            code here.
          </p>
          <label className="flex flex-col gap-1">
            <span className="text-small font-medium">Code</span>
            <input
              className={`${input} text-center font-display text-title tracking-wide tabular-nums`}
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6,10}"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </label>
          <button className={primaryButton} disabled={busy}>
            {busy ? "Checking…" : "Sign in"}
          </button>
          <button
            type="button"
            className="h-11 text-small text-accent"
            onClick={() => {
              setStep("email");
              setCode("");
              setError(null);
            }}
          >
            Use a different email
          </button>
        </form>
      )}

      {error && (
        <p role="alert" className="mt-4 text-small text-ink">
          {error}
        </p>
      )}
    </section>
  );
}
