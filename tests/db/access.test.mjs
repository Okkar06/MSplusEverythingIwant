// Who can read and write what: the row-level security and grants from the
// initial schema, and the reactions table. These rules are what keeps a
// person's location private to their partner.

import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { createDb, user } from "./helpers.mjs";

const [A, B, C] = [user(0), user(1), user(2)]; // A and B are partners; C is a stranger

describe("access rules", () => {
  let db;
  before(async () => {
    db = await createDb({ users: 3 });
    await db.link(A, B);
  });
  after(() => db.close());

  test("sign-up creates a profile, named from the email when no name is given", async () => {
    const [p] = await db.admin("select display_name, partner_id from public.profiles where id = $1", [C]);
    assert.deepEqual(p, { display_name: "user2", partner_id: null });
  });

  describe("profiles", () => {
    test("you see yourself and your partner, not strangers", async () => {
      assert.equal((await db.as(A, "select id from profiles")).rows.length, 2);
      assert.equal((await db.as(C, "select id from profiles")).rows.length, 1);
    });

    test("you can rename yourself, nobody else", async () => {
      assert.equal((await db.as(A, "update profiles set display_name = 'Ana' where id = $1 returning 1", [A])).rows.length, 1);
      assert.equal((await db.as(A, "update profiles set display_name = 'x' where id = $1 returning 1", [B])).rows.length, 0);
    });

    test("you can't set your own partner (only pairing can)", async () => {
      assert.ok((await db.as(A, "update profiles set partner_id = $2 where id = $1", [A, C])).error);
    });
  });

  for (const table of ["moods", "locations", "reactions"]) {
    describe(table, () => {
      const row = {
        moods: [`(user_id, mood) values ($1, 'calm')`],
        locations: [`(user_id, latitude, longitude) values ($1, 1, 1)`],
        reactions: [`(user_id, kind) values ($1, 'heart')`],
      }[table][0];

      test("you write your own row, not someone else's", async () => {
        assert.equal((await db.as(A, `insert into ${table} ${row}`, [A])).error, undefined);
        assert.ok((await db.as(A, `insert into ${table} ${row}`, [B])).error);
      });

      test("your partner reads it; a stranger doesn't", async () => {
        assert.equal((await db.as(B, `select * from ${table} where user_id = $1`, [A])).rows.length, 1);
        assert.equal((await db.as(C, `select * from ${table} where user_id = $1`, [A])).rows.length, 0);
      });

      test("your partner can't change it", async () => {
        assert.equal((await db.as(B, `update ${table} set user_id = user_id where user_id = $1 returning 1`, [A])).rows.length, 0);
      });

      test("signed-out visitors get nothing", async () => {
        assert.ok((await db.anon(`select * from ${table}`)).error);
      });
    });
  }

  test("only locations can be deleted by their owner (stop sharing)", async () => {
    assert.equal((await db.as(B, "delete from locations where user_id = $1 returning 1", [A])).rows.length, 0);
    assert.equal((await db.as(A, "delete from locations where user_id = $1 returning 1", [A])).rows.length, 1);
    assert.ok((await db.as(A, "delete from reactions where user_id = $1", [A])).error);
  });

  test("a one-sided link grants nothing", async () => {
    await db.admin("update public.profiles set partner_id = $2 where id = $1", [C, A]);
    await db.as(C, "insert into moods (user_id, mood) values ($1, 'sad') on conflict do nothing", [C]);
    assert.equal((await db.as(C, "select * from moods where user_id = $1", [A])).rows.length, 0);
    assert.equal((await db.as(A, "select * from moods where user_id = $1", [C])).rows.length, 0);
    await db.admin("update public.profiles set partner_id = null where id = $1", [C]);
  });

  test("timestamps come from the server, not the client", async () => {
    await db.as(A, "update moods set mood = 'happy', updated_at = '2000-01-01' where user_id = $1", [A]);
    const upsert = await db.as(A, "insert into reactions (user_id, kind, sent_at) values ($1, 'hug', '2000-01-01') on conflict (user_id) do update set kind = excluded.kind, sent_at = excluded.sent_at", [A]);
    assert.equal(upsert.error, undefined);
    const [m] = await db.admin("select updated_at from public.moods where user_id = $1", [A]);
    const [r] = await db.admin("select sent_at from public.reactions where user_id = $1", [A]);
    assert.ok(new Date(m.updated_at).getFullYear() > 2000);
    assert.ok(new Date(r.sent_at).getFullYear() > 2000);
  });

  test("deleting an account removes its rows and clears the partner link", async () => {
    await db.admin("delete from auth.users where id = $1", [B]);
    assert.equal(await (async () => (await db.admin("select partner_id from public.profiles where id = $1", [A]))[0].partner_id)(), null);
    assert.equal((await db.admin("select * from public.moods where user_id = $1", [B])).length, 0);
  });
});

test("a signed-out visitor has no user id", async (t) => {
  const db = await createDb({ users: 1 });
  t.after(() => db.close()); // also when an assertion fails, or the run would hang
  await db.as(user(0), "select 1"); // a signed-in request just before
  const r = await db.anon("select auth.uid() as uid");
  assert.equal(r.rows?.[0]?.uid ?? null, null);
});
