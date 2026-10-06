// The RLS performance migration (20261005040000_rls_performance.sql): auth.uid() is
// evaluated once per query instead of once per row, and profiles.partner_id is
// indexed. What the rules allow is covered by access.test.mjs; these tests pin
// the shape, so a later migration can't quietly bring back the per-row call.

import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { createDb, user } from "./helpers.mjs";

const [A, B, C, D] = [user(0), user(1), user(2), user(3)]; // A+B linked, C stranger, D points at A one-sidedly

let db;
before(async () => {
  db = await createDb({ users: 4 });
  await db.link(A, B);
  await db.admin("update public.profiles set partner_id = $2 where id = $1", [D, A]);
});
after(() => db.close());

// Postgres prints `(select auth.uid())` back as `( SELECT auth.uid() AS uid)`.
const bare = (sql) => (sql ?? "").replaceAll("( SELECT auth.uid() AS uid)", "").includes("auth.uid()");

test("no policy calls auth.uid() once per row", async () => {
  const policies = await db.admin(
    "select tablename, policyname, qual, with_check from pg_policies where schemaname = 'public'",
  );
  const usesUid = policies.filter((p) => `${p.qual} ${p.with_check}`.includes("auth.uid()"));
  assert.ok(usesUid.length >= 7, `expected the 7 own-row policies, found ${usesUid.length}`);
  const offenders = usesUid.filter((p) => bare(p.qual) || bare(p.with_check)).map((p) => p.policyname);
  assert.deepEqual(offenders, []);
});

test("is_me_or_partner() calls auth.uid() once per query", async () => {
  const [{ src }] = await db.admin("select prosrc as src from pg_proc where proname = 'is_me_or_partner'");
  assert.match(src, /\(select auth\.uid\(\)\)/);
  assert.doesNotMatch(src.replaceAll("(select auth.uid())", ""), /auth\.uid\(\)/);
});

test("is_me_or_partner() keeps its rule: you, and a mutual partner only", async () => {
  const check = async (as, id) => (await db.as(as, "select public.is_me_or_partner($1) as ok", [id])).rows[0].ok;
  assert.equal(await check(A, A), true);
  assert.equal(await check(A, B), true);
  assert.equal(await check(B, A), true);
  assert.equal(await check(A, C), false);
  assert.equal(await check(D, A), false, "a one-sided link grants nothing");
  assert.equal(await check(A, D), false);
});

test("profiles.partner_id has an index", async () => {
  const rows = await db.admin(
    "select indexdef from pg_indexes where schemaname = 'public' and tablename = 'profiles' and indexdef like '%(partner_id)%'",
  );
  assert.equal(rows.length, 1);
});
