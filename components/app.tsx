"use client";

import { useEffect, useState } from "react";
import { getSupabase, storedUser } from "@/lib/supabase/client";
import { clearSnapshots } from "@/lib/couple-snapshot";
import { useOnline } from "@/lib/use-online";
import { useCouple } from "@/lib/use-couple";
import { SignIn } from "./sign-in";
import { WaitingForPartner } from "./waiting-for-partner";
import { HomeScreen } from "./home-screen";

type Auth =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "signed-in"; userId: string; email: string | undefined }
  | { status: "misconfigured"; message: string };

function useAuth(): Auth {
  const [auth, setAuth] = useState<Auth>({ status: "loading" });

  useEffect(() => {
    let supabase;
    try {
      supabase = getSupabase();
    } catch (e) {
      const message = (e as Error).message;
      queueMicrotask(() => setAuth({ status: "misconfigured", message }));
      return;
    }
    // If this device has a stored session, show its saved copy right away. The
    // first auth event can take several seconds when the session has expired
    // and the refresh has to be retried (e.g. offline); the events below then
    // correct this either way.
    const stored = storedUser();
    if (stored) {
      queueMicrotask(() =>
        setAuth((a) => (a.status === "loading" ? { status: "signed-in", userId: stored.id, email: stored.email } : a)),
      );
    }

    // Fires once with the stored session (INITIAL_SESSION), then on every change.
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      // Also when signed out elsewhere or the session was revoked, not only
      // via our Sign out button: the saved copy holds your partner's location.
      if (event === "SIGNED_OUT") clearSnapshots();
      if (session) {
        setAuth({ status: "signed-in", userId: session.user.id, email: session.user.email });
        return;
      }
      // No usable session, but one is still stored: it has expired and couldn't
      // be refreshed (offline, or Supabase unreachable). The library keeps
      // retrying, so stay on this device's saved copy rather than showing a
      // sign-in form that can't work offline. A real sign-out deletes the
      // stored session and fires SIGNED_OUT, which lands here with none stored.
      const still = event === "SIGNED_OUT" ? null : storedUser();
      setAuth(still ? { status: "signed-in", userId: still.id, email: still.email } : { status: "signed-out" });
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return auth;
}

function signOut() {
  // The saved copy holds your partner's last location: don't leave it behind.
  clearSnapshots();
  getSupabase().auth.signOut();
}

export function App() {
  const auth = useAuth();

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 py-8 sm:gap-6 sm:py-16">
      {auth.status === "loading" && <Loading />}
      {auth.status === "misconfigured" && (
        <section className="rounded-lg bg-surface p-4 sm:p-6">
          <h1 className="font-display text-heading">Almost set up</h1>
          <p className="mt-4 text-body text-ink-muted">
            {auth.message}. Copy <code>.env.example</code> to <code>.env.local</code>, add your
            Supabase values and restart the dev server.
          </p>
        </section>
      )}
      {auth.status === "signed-out" && <SignIn />}
      {auth.status === "signed-in" && <SignedIn userId={auth.userId} email={auth.email} />}
    </main>
  );
}

function SignedIn({ userId, email }: { userId: string; email: string | undefined }) {
  const couple = useCouple(userId);
  const online = useOnline();

  if (couple.loading) return <Loading offline={!online} />;

  if (!couple.me || !couple.partner) {
    return (
      <WaitingForPartner
        userId={userId}
        name={couple.me?.display_name}
        email={email}
        onPaired={couple.reload}
        onSignOut={signOut}
      />
    );
  }

  return <HomeScreen couple={couple} me={couple.me} partner={couple.partner} onSignOut={signOut} />;
}

function Loading({ offline = false }: { offline?: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4" role="status">
      <span className="sr-only">Loading</span>
      <span className="relative flex size-4">
        <span className="absolute inset-0 rounded-full bg-you animate-breathe" />
        <span className="relative size-4 rounded-full bg-you" />
      </span>
      {offline && (
        <p className="max-w-xs text-center text-small text-ink-muted">
          You&apos;re offline. This will load when you&apos;re back online, and after that the
          app keeps a copy here for next time.
        </p>
      )}
    </div>
  );
}
