// Invite-code pairing (see supabase/migrations/20261002000000_pair_invites.sql).

import { getSupabase } from "./supabase/client";

export type Invite = { code: string; expires_at: string };

/** Your open invite, if you made one earlier and it hasn't expired. */
export async function loadInvite(): Promise<Invite | null> {
  const { data } = await getSupabase()
    .from("pair_invites")
    .select("code, expires_at")
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  return data;
}

/** Makes a fresh code. Any code you had before stops working. */
export async function createInvite(): Promise<{ invite: Invite | null; error: string | null }> {
  const { data, error } = await getSupabase().rpc("create_pair_invite").single<Invite>();
  return { invite: data, error: error?.message ?? null };
}

/** Links you with whoever made this code. Returns an error message, or null on success. */
export async function acceptInvite(code: string): Promise<string | null> {
  const { data, error } = await getSupabase().rpc("accept_pair_invite", { invite_code: code });
  if (error) return error.message;
  // A miss comes back as null rather than an error, so the server can count it.
  if (!data) return "That code doesn't work. Check it, or ask for a new one.";
  return null;
}

/** "ABC234" → "ABC 234", easier to read out loud. */
export function formatCode(code: string) {
  return `${code.slice(0, 3)} ${code.slice(3)}`;
}
