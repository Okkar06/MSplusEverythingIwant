"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "./supabase/client";
import type { LocationRow, MoodRow, Profile } from "./types";
import type { MoodValue } from "./moods";

type ByUser<T> = Record<string, T>;

type CoupleState = {
  loading: boolean;
  error: string | null;
  profiles: ByUser<Profile>;
  moods: ByUser<MoodRow>;
  locations: ByUser<LocationRow>;
};

const initial: CoupleState = {
  loading: true,
  error: null,
  profiles: {},
  moods: {},
  locations: {},
};

function byUser<T extends { user_id: string }>(rows: T[]): ByUser<T> {
  return Object.fromEntries(rows.map((row) => [row.user_id, row]));
}

function without<T>(map: ByUser<T>, userId: string): ByUser<T> {
  const next = { ...map };
  delete next[userId];
  return next;
}

/**
 * Loads your profile, your partner's profile, and both current moods and
 * locations, then keeps them up to date over Supabase Realtime.
 * Row-level security decides what comes back, so this only ever sees the two of you.
 */
export function useCouple(userId: string) {
  const [state, setState] = useState<CoupleState>(initial);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const supabase = getSupabase();
    let cancelled = false;

    async function load() {
      const [profiles, moods, locations] = await Promise.all([
        supabase.from("profiles").select("id, display_name, partner_id"),
        supabase.from("moods").select("user_id, mood, note, updated_at"),
        supabase.from("locations").select("user_id, latitude, longitude, accuracy_m, updated_at"),
      ]);
      if (cancelled) return;
      const error = profiles.error ?? moods.error ?? locations.error;
      setState({
        loading: false,
        error: error ? error.message : null,
        profiles: Object.fromEntries(
          ((profiles.data ?? []) as Profile[]).map((p) => [p.id, p]),
        ),
        moods: byUser((moods.data ?? []) as MoodRow[]),
        locations: byUser((locations.data ?? []) as LocationRow[]),
      });
    }

    const channel = supabase
      .channel(`couple:${userId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "moods" }, (payload) => {
        setState((s) =>
          payload.eventType === "DELETE"
            ? { ...s, moods: without(s.moods, (payload.old as MoodRow).user_id) }
            : { ...s, moods: { ...s.moods, [(payload.new as MoodRow).user_id]: payload.new as MoodRow } },
        );
      })
      // A profile change can be a new partner link (which also changes which
      // moods and locations RLS lets us see), so reload everything.
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        load();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "locations" }, (payload) => {
        setState((s) =>
          payload.eventType === "DELETE"
            ? { ...s, locations: without(s.locations, (payload.old as LocationRow).user_id) }
            : {
                ...s,
                locations: {
                  ...s.locations,
                  [(payload.new as LocationRow).user_id]: payload.new as LocationRow,
                },
              },
        );
      })
      .subscribe((status) => {
        // Reload on (re)connect so nothing missed while offline is lost.
        if (status === "SUBSCRIBED") load();
      });

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [userId, reloadKey]);

  const me = state.profiles[userId];
  // A partner only counts once the link is mutual; until then RLS hides their profile.
  const partner = me?.partner_id ? state.profiles[me.partner_id] : undefined;

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  const setMood = useCallback(
    async (mood: MoodValue, note: string | null) => {
      const row = { user_id: userId, mood, note, updated_at: new Date().toISOString() };
      // Show it straight away; the realtime echo brings the server's timestamp.
      setState((s) => ({ ...s, moods: { ...s.moods, [userId]: row } }));
      const { error } = await getSupabase().from("moods").upsert({ user_id: userId, mood, note });
      if (error) setState((s) => ({ ...s, error: error.message }));
    },
    [userId],
  );

  // Updates locally straight away; your partner gets it over Realtime.
  const setName = useCallback(
    async (displayName: string) => {
      const { error } = await getSupabase()
        .from("profiles")
        .update({ display_name: displayName })
        .eq("id", userId);
      if (error) return error.message;
      setState((s) => ({
        ...s,
        profiles: { ...s.profiles, [userId]: { ...s.profiles[userId], display_name: displayName } },
      }));
      return null;
    },
    [userId],
  );

  // Ends the link for both of you (see supabase/migrations/20261002020000_unpair.sql).
  // The partner's app moves on by itself when Realtime brings their changed profile.
  const unlink = useCallback(async () => {
    const { error } = await getSupabase().rpc("unpair");
    if (error) return error.message;
    reload();
    return null;
  }, [reload]);

  return { ...state, me, partner, reload, setMood, setName, unlink };
}
