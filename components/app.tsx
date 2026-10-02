"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase/client";
import { useCouple } from "@/lib/use-couple";
import { SignIn } from "./sign-in";
import { WaitingForPartner } from "./waiting-for-partner";
import { HomeScreen } from "./home-screen";

type Auth =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "signed-in"; session: Session }
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
    // Fires once straight away with the stored session (INITIAL_SESSION), then on every change.
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuth(session ? { status: "signed-in", session } : { status: "signed-out" });
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return auth;
}

function signOut() {
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
      {auth.status === "signed-in" && <SignedIn session={auth.session} />}
    </main>
  );
}

function SignedIn({ session }: { session: Session }) {
  const couple = useCouple(session.user.id);

  if (couple.loading) return <Loading />;

  if (!couple.me || !couple.partner) {
    return (
      <WaitingForPartner
        name={couple.me?.display_name}
        email={session.user.email}
        onPaired={couple.reload}
        onSignOut={signOut}
      />
    );
  }

  return <HomeScreen couple={couple} me={couple.me} partner={couple.partner} onSignOut={signOut} />;
}

function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center" role="status">
      <span className="sr-only">Loading</span>
      <span className="relative flex size-4">
        <span className="absolute inset-0 rounded-full bg-you animate-breathe" />
        <span className="relative size-4 rounded-full bg-you" />
      </span>
    </div>
  );
}
