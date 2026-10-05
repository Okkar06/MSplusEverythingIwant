import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;
let storageKey: string | undefined;

// Created on first use rather than at import, so the app can still be built
// (and prerendered) on a machine without .env.local.
export function getSupabase(): SupabaseClient {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
  }

  if (!supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable");
  }

  // supabase-js's default key, spelled out so storedUser() can read it too.
  storageKey = `sb-${new URL(supabaseUrl).hostname.split(".")[0]}-auth-token`;
  client = createClient(supabaseUrl, supabaseAnonKey, { auth: { storageKey } });
  return client;
}

/**
 * The user of the session stored on this device, even if it has expired and
 * can't be refreshed right now (e.g. offline). Only for showing this device's
 * saved copy: every request still needs a valid session, and RLS still applies.
 * A real sign-out (or a revoked session) deletes the stored session, and this
 * returns null.
 */
export function storedUser(): { id: string; email: string | undefined } | null {
  if (!storageKey) return null;
  try {
    const raw = localStorage.getItem(storageKey);
    const user = raw ? JSON.parse(raw)?.user : null;
    return typeof user?.id === "string" ? { id: user.id, email: user.email } : null;
  } catch {
    return null;
  }
}
