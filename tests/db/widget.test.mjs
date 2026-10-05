// widget_summary(): what a home-screen widget shows, and what it must never show.

import { after, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { createDb, user } from "./helpers.mjs";

const [A, B, C] = [user(0), user(1), user(2)];
const LONDON = [51.5074, -0.1278];
const PARIS = [48.8566, 2.3522];

// Mirror of distanceMeters() in lib/distance.ts, so the widget and the app agree.
function distanceMeters([lat1, lon1], [lat2, lon2]) {
  const toRad = (d) => (d * Math.PI) / 180;
  const h =
    Math.sin(toRad(lat2 - lat1) / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(toRad(lon2 - lon1) / 2) ** 2;
  return 2 * 6_371_000 * Math.asin(Math.min(1, Math.sqrt(h)));
}

let db;
beforeEach(async () => {
  await db?.close();
  db = await createDb({ users: 3 });
});
after(() => db?.close());

const summary = async (u) => {
  const r = await db.as(u, "select widget_summary() as s");
  assert.equal(r.error, undefined);
  return r.rows[0].s;
};
const at = (u, [lat, lon]) =>
  db.as(u, "insert into locations (user_id, latitude, longitude) values ($1, $2, $3) on conflict (user_id) do update set latitude = excluded.latitude, longitude = excluded.longitude", [u, lat, lon]);
const mood = (u, m, note = null) =>
  db.as(u, "insert into moods (user_id, mood, note) values ($1, $2, $3) on conflict (user_id) do update set mood = excluded.mood, note = excluded.note", [u, m, note]);

test("not linked yet: just you, no partner, no distance", async () => {
  await mood(A, "calm");
  const s = await summary(A);
  assert.equal(s.me.name, "user0");
  assert.equal(s.me.mood, "calm");
  assert.equal(s.me.sharing_location, false);
  assert.equal(s.partner, null);
  assert.equal(s.distance_m, null);
});

test("linked: both names and moods, and the distance between you", async () => {
  await db.link(A, B);
  await mood(A, "happy");
  await mood(B, "missing_you");
  await at(A, LONDON);
  await at(B, PARIS);
  const s = await summary(A);
  assert.equal(s.partner.name, "user1");
  assert.equal(s.partner.mood, "missing_you");
  assert.equal(s.me.sharing_location, true);
  assert.equal(s.partner.live, true);
  // Same as the app's own calculation, rounded to 10 m.
  assert.equal(s.distance_m, Math.round(distanceMeters(LONDON, PARIS) / 10) * 10);
  assert.ok(s.distance_m > 340_000 && s.distance_m < 345_000);
});

test("never includes coordinates or mood notes", async () => {
  await db.link(A, B);
  await mood(B, "loved", "a private message");
  await at(A, LONDON);
  await at(B, PARIS);
  const text = JSON.stringify(await summary(A));
  assert.doesNotMatch(text, /latitude|longitude|51\.50|48\.85|0\.12|2\.35/);
  assert.doesNotMatch(text, /note|a private message/);
});

test("no distance until both of you share a location", async () => {
  await db.link(A, B);
  await at(A, LONDON);
  const s = await summary(A);
  assert.equal(s.me.sharing_location, true);
  assert.equal(s.distance_m, null);
  assert.equal(s.partner.live, false);
  assert.equal(s.partner.location_updated_at, null);
});

/** Sets a location's updated_at directly (the trigger would stamp now()). */
async function locatedAt(u, iso) {
  await db.admin("alter table public.locations disable trigger locations_set_updated_at");
  await db.admin("update public.locations set updated_at = $2 where user_id = $1", [u, iso]);
  await db.admin("alter table public.locations enable trigger locations_set_updated_at");
}
const minutesAgo = (m) => new Date(Date.now() - m * 60_000).toISOString();

test("live means a location from the last 5 minutes, as in the app", async () => {
  await db.link(A, B);
  await at(A, LONDON);
  await at(B, PARIS);
  await locatedAt(B, minutesAgo(4));
  await locatedAt(A, minutesAgo(6));
  let s = await summary(A);
  assert.equal(s.partner.live, true, "4 minutes old is live");
  assert.equal(s.me.live, false, "6 minutes old isn't");
  assert.equal(s.me.sharing_location, true, "a stale location is still being shared");

  await locatedAt(B, minutesAgo(6));
  await locatedAt(A, minutesAgo(4));
  s = await summary(A);
  assert.equal(s.partner.live, false);
  assert.equal(s.me.live, true);
});

test("the distance is only as fresh as the older location", async () => {
  await db.link(A, B);
  await at(A, LONDON);
  await at(B, PARIS);
  await db.admin("alter table public.locations disable trigger locations_set_updated_at");
  await db.admin("update public.locations set updated_at = '2026-01-01T10:00:00Z' where user_id = $1", [B]);
  await db.admin("alter table public.locations enable trigger locations_set_updated_at");
  const s = await summary(A);
  assert.equal(new Date(s.distance_as_of).toISOString(), "2026-01-01T10:00:00.000Z");
  assert.equal(s.partner.live, false); // older than 5 minutes
});

test("a one-sided or stranger link shows nothing of the other person", async () => {
  await db.admin("update public.profiles set partner_id = $2 where id = $1", [A, C]); // A → C only
  await mood(C, "sad");
  await at(A, LONDON);
  await at(C, PARIS);
  const s = await summary(A);
  assert.equal(s.partner, null);
  assert.equal(s.distance_m, null);
  assert.doesNotMatch(JSON.stringify(s), /sad|user2/);
});

test("after unlinking, the old partner disappears from the widget", async () => {
  await db.link(A, B);
  await at(A, LONDON);
  await at(B, PARIS);
  await db.as(B, "select unpair()");
  const s = await summary(A);
  assert.equal(s.partner, null);
  assert.equal(s.distance_m, null);
});

test("signed-out visitors can't call it; a request with no user gets nothing", async () => {
  assert.ok((await db.anon("select widget_summary()")).error);
  // Denied by the function's own grant, not only because visitors can't read the tables.
  const [g] = await db.admin(
    `select has_function_privilege('anon', 'public.widget_summary()', 'execute') as visitor,
            has_function_privilege('authenticated', 'public.widget_summary()', 'execute') as signed_in`,
  );
  assert.deepEqual(g, { visitor: false, signed_in: true });
  assert.equal((await db.as(null, "select widget_summary() as s")).rows[0].s, null);
});

test("runs with the caller's rights, not the owner's", async () => {
  const [fn] = await db.admin("select prosecdef, proconfig from pg_proc where proname = 'widget_summary'");
  assert.equal(fn.prosecdef, false);
  assert.match(String(fn.proconfig), /search_path=/);
});
