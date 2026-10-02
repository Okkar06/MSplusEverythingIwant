"use client";

type Props = {
  name: string | undefined;
  email: string | undefined;
  onCheckAgain: () => void;
  onSignOut: () => void;
};

// Shown until the mutual partner link exists (see supabase/snippets/pair_partners.sql).
export function WaitingForPartner({ name, email, onCheckAgain, onSignOut }: Props) {
  return (
    <section className="animate-fade-up rounded-lg bg-surface p-4 text-center sm:p-6">
      <div className="mx-auto mt-4 flex w-fit items-center">
        <span className="size-11 rounded-full bg-you" />
        <span className="-ml-3 size-11 rounded-full border-2 border-dashed border-partner bg-surface" />
      </div>
      <h1 className="mt-6 font-display text-display">Almost there</h1>
      <p className="mt-4 text-body text-ink-muted">
        {name ? `You're signed in, ${name}. ` : "You're signed in. "}
        Once your partner has signed in too, link your two accounts by running{" "}
        <code className="rounded-sm bg-sunken px-1 text-small text-ink">pair_partners.sql</code> in
        the Supabase SQL editor.
      </p>
      {email && <p className="mt-2 text-caption text-ink-muted">Signed in as {email}</p>}
      <div className="mt-8 flex flex-col gap-2">
        <button
          className="h-11 rounded-md bg-accent text-small font-semibold text-on-accent transition-transform duration-(--duration-quick) ease-standard active:scale-95"
          onClick={onCheckAgain}
        >
          Check again
        </button>
        <button className="h-11 text-small text-accent" onClick={onSignOut}>
          Sign out
        </button>
      </div>
    </section>
  );
}
