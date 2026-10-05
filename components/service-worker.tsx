"use client";

import { useEffect } from "react";

// Registers public/sw.js so the installed app can open without a connection.
// Production only: in development it would serve stale code after edits.
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
        // Not supported here (or blocked): the app still works online.
      });
      // Hand the worker the static files this page already loaded, so they're
      // cached for opening offline (see the "message" handler in sw.js).
      navigator.serviceWorker.ready.then((reg) => {
        const urls = performance
          .getEntriesByType("resource")
          .map((e) => new URL(e.name).pathname)
          .filter((path) => path.startsWith("/_next/static/"));
        reg.active?.postMessage({ type: "cache-assets", urls });
      });
    };
    // Registering needs the network (to fetch sw.js and cache the app), so
    // when opened offline, wait until the connection is back.
    if (navigator.onLine) {
      register();
      return;
    }
    window.addEventListener("online", register, { once: true });
    return () => window.removeEventListener("online", register);
  }, []);
  return null;
}
