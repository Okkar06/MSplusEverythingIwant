// Service worker: lets the installed app open without a connection.
//
// What it caches (this origin only):
//   the page itself    network first, the cached copy when offline
//   /_next/static/*    cache first: file names change whenever contents do
//   icons, manifest    cached copy first, refreshed in the background
// Supabase requests (another origin) are never touched: live data comes from
// the network, and the app keeps its own saved copy for offline use.
//
// Bump VERSION to drop every old cache on the next visit.

const VERSION = "v2";
const CACHE = `us-${VERSION}`;
const SHELL = "/";

const STATIC = "/_next/static/";

/** The path of a same-origin URL, or null for anything else (including ../ tricks). */
function ownPath(url) {
  try {
    const u = new URL(url, self.location.origin);
    return u.origin === self.location.origin ? u.pathname : null;
  } catch {
    return null;
  }
}

/** Static files the cached page references. */
async function shellAssets(cache) {
  const res = await cache.match(SHELL);
  if (!res) return [];
  const html = await res.text();
  return [...html.matchAll(/(?:src|href)="(\/_next\/static\/[^"]+)"/g)].map((m) => m[1]);
}

/**
 * Drop cached static files the current app no longer uses. Every deploy
 * renames its chunks, so without this the cache would only ever grow.
 */
async function pruneStatic(cache, keep) {
  const keepSet = new Set([...keep, ...(await shellAssets(cache))]);
  const keys = await cache.keys();
  await Promise.all(
    keys
      .filter((req) => {
        const path = ownPath(req.url);
        return path?.startsWith(STATIC) && !keepSet.has(path);
      })
      .map((req) => cache.delete(req)),
  );
}

// Cache the page and every static file it references, so the first offline
// open works even if this worker only took over after those files loaded.
async function cacheShell() {
  const cache = await caches.open(CACHE);
  const res = await fetch(SHELL, { cache: "no-store" });
  if (!res.ok) return;
  const html = await res.clone().text();
  await cache.put(SHELL, res);
  const assets = [...html.matchAll(/(?:src|href)="(\/_next\/static\/[^"]+)"/g)].map((m) => m[1]);
  await Promise.all(
    [...new Set(assets)].map((url) =>
      cache.match(url).then((hit) => hit ?? cache.add(url).catch(() => {})),
    ),
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheShell().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("us-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// The page sends the static files it already loaded: Next loads some chunks at
// runtime that aren't in the HTML, and the first visit fetches them before this
// worker takes over, so cacheShell() alone can miss them.
// That list is also what the running app uses, so anything else under
// /_next/static (from an older deploy) is pruned.
self.addEventListener("message", (event) => {
  const urls = event.data?.type === "cache-assets" ? event.data.urls : null;
  if (!Array.isArray(urls)) return;
  // Resolve each URL first, so "/_next/static/../../x" can't cache "/x".
  const own = urls
    .map((u) => (typeof u === "string" ? ownPath(u) : null))
    .filter((path) => path?.startsWith(STATIC));
  event.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      await Promise.all(own.map((url) => cache.match(url).then((hit) => hit ?? cache.add(url).catch(() => {}))));
      await pruneStatic(cache, own);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok && url.pathname === SHELL) {
            const copy = res.clone();
            // Keep the worker alive until the copy is written.
            event.waitUntil(caches.open(CACHE).then((c) => c.put(SHELL, copy)));
          }
          return res;
        })
        .catch(async () => (await caches.match(SHELL)) ?? Response.error()),
    );
    return;
  }

  if (url.pathname.startsWith(STATIC)) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ??
          fetch(request).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              event.waitUntil(caches.open(CACHE).then((c) => c.put(request, copy)));
            }
            return res;
          }),
      ),
    );
    return;
  }

  if (/^\/(icon|apple-icon|icon-\d+)\b|\/manifest\.webmanifest$/.test(url.pathname)) {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const hit = await cache.match(request);
        const fresh = fetch(request)
          .then((res) => (res.ok ? cache.put(request, res.clone()).then(() => res) : res))
          .catch(() => hit);
        if (!hit) return fresh;
        // Answer from the cache now, and keep the worker alive for the refresh.
        // waitUntil has to be called here, while respondWith is still pending:
        // called later, once the event has finished, it throws.
        event.waitUntil(fresh);
        return hit;
      }),
    );
  }
});
