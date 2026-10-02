import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

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

  client = createClient(supabaseUrl, supabaseAnonKey);
  return client;
}
