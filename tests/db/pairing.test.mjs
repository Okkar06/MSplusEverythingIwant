// Linking two accounts: invite codes, requests, owner approval, the guess
// limit, and unlinking (including what it clears).

import { after, beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { createDb, user } from "./helpers.mjs";

const [A, B, C, D, E] = [user(0), user(1), user(2), user(3), user(4)];

let db;
beforeEach(async () => {
  await db?.close();
  db = await createDb({ users: 5 });
});
after(() => db?.close());

const code = async (u) => (await db.as(u, "select code from create_pair_invite()")).rows[0].code;
const request = (u, c) => db.as(u, "select request_pair($1) as owner", [c]);

describe("invite codes", () => {
  test("look like ABC234 and only the newest one works", async () => {
    const first = await code(A);
    const second = await code(A);
    assert.match(second, /^[A-HJ-NP-Z2-9]{6}$/);
    assert.equal((await request(B, first)).rows[0].owner, null); // a miss
    assert.equal((await request(B, second)).rows[0].owner, "user0");
  });

  test("only the owner can see their code", async () => {
    await code(A);
    assert.equal((await db.as(A, "select code from pair_invites")).rows.length, 1);
    assert.equal((await db.as(B, "select code from pair_invites")).rows.length, 0);
    assert.ok((await db.as(B, "insert into pair_invites (code, owner_id) values ('ABCDEF', $1)", [B])).error);
  });

  test("typing is forgiving: case, spaces and dashes are ignored", async () => {
    const c = await code(A);
    const messy = ` ${c.slice(0, 3).toLowerCase()}-${c.slice(3)} `;
    assert.equal((await request(B, messy)).rows[0].owner, "user0");
  });

  test("your own code is refused", async () => {
    assert.match((await request(A, await code(A))).error, /your own code/);
  });

  test("an expired code is a miss", async () => {
    const c = await code(A);
    await db.admin("update public.pair_invites set expires_at = now() - interval '1 minute'");
    assert.equal((await request(B, c)).rows[0].owner, null);
  });
});

describe("requests and approval", () => {
  test("a request links nobody until the owner approves", async () => {
    await request(B, await code(A));
    assert.equal(await db.partnerOf(A), null);
    const [r] = (await db.as(A, "select requested_name, requested_email from pair_invites")).rows;
    assert.deepEqual(r, { requested_name: "user1", requested_email: "user1@example.com" });

    assert.equal((await db.as(A, "select approve_pair_request() as p")).rows[0].p, B);
    assert.equal(await db.partnerOf(A), B);
    assert.equal(await db.partnerOf(B), A);
    assert.equal((await db.admin("select * from public.pair_invites")).length, 0);
  });

  test("only the owner can approve or decline", async () => {
    await request(B, await code(A));
    assert.match((await db.as(B, "select approve_pair_request()")).error, /no request to accept/);
    await db.as(C, "select decline_pair_request()");
    assert.equal((await db.as(A, "select requested_name from pair_invites")).rows[0].requested_name, "user1");
  });

  test("declining cancels the code", async () => {
    const c = await code(A);
    await request(B, c);
    await db.as(A, "select decline_pair_request()");
    assert.equal((await db.as(B, "select * from my_pair_request()")).rows.length, 0);
    assert.equal((await request(B, c)).rows[0].owner, null);
    assert.equal(await db.partnerOf(A), null);
  });

  test("a second person can't take over a pending request", async () => {
    const c = await code(A);
    await request(B, c);
    assert.match((await request(C, c)).error, /Someone else already used/);
  });

  test("the requester can see and cancel their request", async () => {
    await request(B, await code(A));
    assert.equal((await db.as(B, "select owner_name from my_pair_request()")).rows[0].owner_name, "user0");
    await db.as(B, "select cancel_pair_request()");
    assert.match((await db.as(A, "select approve_pair_request()")).error, /no request to accept/);
  });

  test("an expired request can't be approved", async () => {
    await request(B, await code(A));
    await db.admin("update public.pair_invites set expires_at = now() - interval '1 minute'");
    assert.match((await db.as(A, "select approve_pair_request()")).error, /expired/);
  });

  test("someone already linked can't request", async () => {
    await db.link(A, B);
    assert.match((await request(A, await code(C))).error, /already linked/);
  });

  test("a request can't be approved once either side has linked with someone else", async () => {
    await request(B, await code(A));
    await db.link(B, C); // B linked elsewhere while the request waited
    assert.match((await db.as(A, "select approve_pair_request()")).error, /already linked/);
    assert.equal(await db.partnerOf(A), null);
  });

  test("the retired one-step accept tells old app versions to reload", async () => {
    assert.match((await db.as(B, "select accept_pair_invite('ABCDEF')")).error, /Reload the page/);
  });
});

describe("guess limit", () => {
  test("10 misses in an hour block further tries, even with a valid code", async () => {
    const c = await code(A);
    for (let i = 0; i < 10; i++) await request(B, "ZZZZZZ");
    assert.match((await request(B, c)).error, /Too many tries/);
  });

  test("misses are counted even though the call doesn't fail", async () => {
    await request(B, "ZZZZZZ");
    assert.equal((await db.admin("select count(*)::int n from public.pair_attempts where user_id = $1", [B]))[0].n, 1);
  });

  test("the block lifts after an hour, and an approved link clears it", async () => {
    const c = await code(A);
    for (let i = 0; i < 10; i++) await request(B, "ZZZZZZ");
    await db.admin("update public.pair_attempts set attempted_at = now() - interval '61 minutes'");
    assert.equal((await request(B, c)).rows[0].owner, "user0");
    await db.as(A, "select approve_pair_request()");
    assert.equal((await db.admin("select count(*)::int n from public.pair_attempts where user_id = $1", [B]))[0].n, 0);
  });

  test("the app can't read or reset its own misses", async () => {
    assert.ok((await db.as(B, "select * from pair_attempts")).error);
  });
});

describe("unlinking", () => {
  async function setUp() {
    await db.link(A, B);
    for (const u of [A, B]) {
      await db.as(u, "insert into locations (user_id, latitude, longitude) values ($1, 1, 1)", [u]);
      await db.as(u, "insert into reactions (user_id, kind) values ($1, 'hug')", [u]);
      await db.as(u, "insert into moods (user_id, mood, note) values ($1, 'loved', 'for my partner')", [u]);
    }
    await db.admin("alter table public.moods disable trigger moods_set_updated_at");
    await db.admin("update public.moods set updated_at = '2026-01-01T10:00:00Z'");
    await db.admin("alter table public.moods enable trigger moods_set_updated_at");
  }

  test("clears the link, both locations and reactions, and both mood notes", async () => {
    await setUp();
    assert.equal((await db.as(A, "select unpair()")).error, undefined);
    assert.equal(await db.partnerOf(A), null);
    assert.equal(await db.partnerOf(B), null);
    assert.equal((await db.admin("select * from public.locations")).length, 0);
    assert.equal((await db.admin("select * from public.reactions")).length, 0);
    const moods = await db.admin("select mood, note, updated_at from public.moods");
    assert.equal(moods.length, 2);
    for (const m of moods) {
      assert.equal(m.mood, "loved"); // the mood stays
      assert.equal(m.note, null); // the note was written to the old partner
      assert.equal(new Date(m.updated_at).toISOString(), "2026-01-01T10:00:00.000Z"); // not "just now"
    }
  });

  test("a new partner sees nothing meant for the old one", async () => {
    await setUp();
    await db.as(A, "select unpair()");
    await db.link(A, C);
    assert.equal((await db.as(C, "select * from reactions where user_id = $1", [A])).rows.length, 0);
    assert.equal((await db.as(C, "select note from moods where user_id = $1", [A])).rows[0].note, null);
  });

  test("after unlinking, normal updates still get the current time", async () => {
    await setUp();
    await db.as(A, "select unpair()");
    await db.as(A, "update moods set mood = 'happy' where user_id = $1", [A]);
    const [m] = await db.admin("select updated_at from public.moods where user_id = $1", [A]);
    assert.ok(Date.now() - new Date(m.updated_at).getTime() < 60_000);
  });

  test("a one-sided link only clears your own side", async () => {
    // D points at E, but E is linked with B.
    await db.link(E, B);
    await db.admin("update public.profiles set partner_id = $2 where id = $1", [D, E]);
    for (const u of [D, E]) {
      await db.as(u, "insert into locations (user_id, latitude, longitude) values ($1, 1, 1)", [u]);
      await db.as(u, "insert into reactions (user_id, kind) values ($1, 'hug')", [u]);
      await db.as(u, "insert into moods (user_id, mood, note) values ($1, 'calm', 'note')", [u]);
    }
    await db.as(D, "select unpair()");
    assert.equal(await db.partnerOf(E), B);
    assert.deepEqual((await db.admin("select user_id from public.locations")).map((r) => r.user_id), [E]);
    assert.deepEqual((await db.admin("select user_id from public.reactions")).map((r) => r.user_id), [E]);
    assert.equal((await db.admin("select note from public.moods where user_id = $1", [E]))[0].note, "note");
    assert.equal((await db.admin("select note from public.moods where user_id = $1", [D]))[0].note, null);
  });

  test("refused when you're not linked", async () => {
    assert.match((await db.as(A, "select unpair()")).error, /not linked/);
  });
});

describe("functions the app can and can't call", () => {
  const appFunctions = [
    "create_pair_invite()",
    "request_pair(text)",
    "my_pair_request()",
    "cancel_pair_request()",
    "approve_pair_request()",
    "decline_pair_request()",
    "unpair()",
  ];

  test("signed-in users can call the pairing functions; visitors can't", async () => {
    for (const fn of appFunctions) {
      const [r] = await db.admin(
        `select has_function_privilege('authenticated', 'public.${fn}', 'execute') as signed_in,
                has_function_privilege('anon', 'public.${fn}', 'execute') as visitor`,
      );
      assert.deepEqual(r, { signed_in: true, visitor: false }, fn);
    }
  });

  test("internal helpers aren't callable from the app", async () => {
    assert.ok((await db.as(A, "select has_mutual_partner($1)", [A])).error);
  });

  test("every security-definer function pins search_path", async () => {
    const loose = await db.admin(
      `select p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
       where n.nspname = 'public' and p.prosecdef
         and not coalesce(p.proconfig::text like '%search_path=%', false)`,
    );
    assert.deepEqual(loose, []);
  });
});
