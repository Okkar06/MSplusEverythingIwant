// Invite-code pairing with owner approval (see supabase/migrations/
// 20261002000000_pair_invites.sql and 20261002010000_pair_approval.sql).
//
// The owner makes a code; the partner types it in, which files a request;
// the owner approves it, and only then are the two linked.

import { getSupabase } from "./supabase/client";

/** Your own code, and the request waiting on it, if any. */
export type Invite = {
  code: string;
  expires_at: string;
  requested_name: string | null;
  requested_email: string | null;
};

/** A request you made on someone else's code. */
export type MyRequest = { owner_name: string };

const INVITE_COLUMNS = "code, expires_at, requested_name, requested_email";

/** Your open invite, if you made one earlier and it hasn't expired. */
export async function loadInvite(): Promise<Invite | null> {
  const { data } = await getSupabase()
    .from("pair_invites")
    .select(INVITE_COLUMNS)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  return data;
}

/** Makes a fresh code. Any code you had before, and any request on it, is dropped. */
export async function createInvite(): Promise<{ invite: Invite | null; error: string | null }> {
  const { data, error } = await getSupabase()
    .rpc("create_pair_invite")
    .single<{ code: string; expires_at: string }>();
  return {
    invite: data && { ...data, requested_name: null, requested_email: null },
    error: error?.message ?? null,
  };
}

/** Asks to link with whoever made this code. */
export async function requestPair(
  code: string,
): Promise<{ request: MyRequest | null; error: string | null }> {
  const { data, error } = await getSupabase().rpc("request_pair", { invite_code: code });
  if (error) return { request: null, error: error.message };
  // A miss comes back as null rather than an error, so the server can count it.
  if (!data) return { request: null, error: "That code doesn't work. Check it, or ask for a new one." };
  return { request: { owner_name: data as string }, error: null };
}

/** Your request that's still waiting for an answer, if any. */
export async function loadMyRequest(): Promise<MyRequest | null> {
  const { data } = await getSupabase().rpc("my_pair_request").maybeSingle<MyRequest>();
  return data;
}

export async function cancelRequest(): Promise<string | null> {
  const { error } = await getSupabase().rpc("cancel_pair_request");
  return error?.message ?? null;
}

/** Owner: links you with whoever asked. Returns an error message, or null on success. */
export async function approveRequest(): Promise<string | null> {
  const { error } = await getSupabase().rpc("approve_pair_request");
  return error?.message ?? null;
}

/** Owner: says no, and cancels the code. */
export async function declineRequest(): Promise<string | null> {
  const { error } = await getSupabase().rpc("decline_pair_request");
  return error?.message ?? null;
}

/** Whether your profile now points at a partner (i.e. your request was approved). */
export async function hasPartner(userId: string): Promise<boolean> {
  const { data } = await getSupabase()
    .from("profiles")
    .select("partner_id")
    .eq("id", userId)
    .maybeSingle<{ partner_id: string | null }>();
  return !!data?.partner_id;
}

/** "ABC234" → "ABC 234", easier to read out loud. */
export function formatCode(code: string) {
  return `${code.slice(0, 3)} ${code.slice(3)}`;
}
