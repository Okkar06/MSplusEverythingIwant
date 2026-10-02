"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSupabase } from "./supabase/client";
import { distanceMeters } from "./distance";

const PREF_KEY = "share-location";
const MIN_MOVE_M = 20; // send sooner than the heartbeat only if you've moved this far
const HEARTBEAT_MS = 60_000; // re-send while still, so you keep showing as live

function readPref(): boolean {
  try {
    return localStorage.getItem(PREF_KEY) === "on";
  } catch {
    return false;
  }
}

function writePref(on: boolean) {
  try {
    localStorage.setItem(PREF_KEY, on ? "on" : "off");
  } catch {
    // Storage blocked: sharing still works for this visit.
  }
}

type Fix = { latitude: number; longitude: number; accuracy_m: number };

/**
 * Shares your current location while `sharing` is on and the page is open.
 * Turning it off deletes your row, so your partner stops seeing any location.
 */
export function useLocationSharing(userId: string) {
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastSent = useRef<{ fix: Fix; at: number } | null>(null);
  const latest = useRef<Fix | null>(null);

  // Restore the saved choice after mount (localStorage isn't available on the server).
  useEffect(() => {
    if (!readPref()) return;
    const id = requestAnimationFrame(() => setSharing(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const send = useCallback(
    async (fix: Fix) => {
      lastSent.current = { fix, at: Date.now() };
      const { error } = await getSupabase()
        .from("locations")
        .upsert({ user_id: userId, ...fix });
      if (error) setError(error.message);
    },
    [userId],
  );

  useEffect(() => {
    if (!sharing) return;
    if (!("geolocation" in navigator)) {
      queueMicrotask(() => {
        setError("This browser can't share its location.");
        setSharing(false);
      });
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const fix = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy_m: pos.coords.accuracy,
        };
        latest.current = fix;
        setError(null);
        const prev = lastSent.current;
        if (
          !prev ||
          Date.now() - prev.at >= HEARTBEAT_MS ||
          distanceMeters(prev.fix, fix) >= MIN_MOVE_M
        ) {
          send(fix);
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setError("Location permission is off. Turn it on in your browser settings to share.");
          setSharing(false);
          writePref(false);
        } else {
          setError("Couldn't get your location right now. Still trying…");
        }
      },
      { enableHighAccuracy: true, maximumAge: 30_000, timeout: 30_000 },
    );

    const heartbeat = setInterval(() => {
      if (latest.current && document.visibilityState === "visible") send(latest.current);
    }, HEARTBEAT_MS);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearInterval(heartbeat);
    };
  }, [sharing, send]);

  const start = useCallback(() => {
    setError(null);
    writePref(true);
    setSharing(true);
  }, []);

  const stop = useCallback(async () => {
    writePref(false);
    setSharing(false);
    lastSent.current = null;
    latest.current = null;
    const { error } = await getSupabase().from("locations").delete().eq("user_id", userId);
    if (error) setError(error.message);
  }, [userId]);

  return { sharing, error, start, stop };
}
