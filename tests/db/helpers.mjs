// Runs the real migrations in supabase/migrations/ on an in-process Postgres
// (PGlite, Postgres compiled to WebAssembly), so the database rules can be
// tested without Docker or a Supabase project. See tests/db/README.md.

import { PGlite } from "@electric-sql/pglite";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const MIGRATIONS = fileURLToPath(new URL("../../supabase/migrations/", import.meta.url));

// The parts of Supabase the migrations rely on: the anon/authenticated roles,
// auth.users, auth.uid() (read from the request's JWT claim), Supabase's
// default grants on new tables and functions, and the Realtime publication.
const SUPABASE_STUBS = `
  create role anon;
  create role authenticated;
  create schema auth;
  create table auth.users (
    id uuid primary key,
    email text,
    raw_user_meta_data jsonb default '{}'
  );
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
  $$;
  grant usage on schema auth to authenticated, anon;
  grant usage on schema public to authenticated, anon;
  alter default privileges in schema public grant all on tables to anon, authenticated;
  alter default privileges in schema public grant all on functions to anon, authenticated;
  create publication supabase_realtime;
`;

/** Test user ids: user(0), user(1), … */
export const user = (i) => `00000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`;

async function build(users, upTo) {
  const pg = new PGlite();
  await pg.exec(SUPABASE_STUBS);
  for (const file of readdirSync(MIGRATIONS).filter((f) => f.endsWith(".sql")).sort()) {
    if (upTo && file > upTo) continue;
    await pg.exec(readFileSync(MIGRATIONS + file, "utf8"));
  }
  for (let i = 0; i < users; i++) {
    await pg.query("insert into auth.users (id, email) values ($1, $2)", [user(i), `user${i}@example.com`]);
  }
  return pg;
}

// Booting Postgres and running every migration takes a couple of seconds, so
// each schema is built once per test file and every test gets a clone of it.
const templates = new Map();

/**
 * A fresh database with every migration applied (or only those up to and
 * including `upTo`, to compare behaviour before a migration).
 */
export async function createDb({ users = 4, upTo } = {}) {
  const key = `${users}:${upTo ?? ""}`;
  if (!templates.has(key)) templates.set(key, build(users, upTo));
  const pg = await (await templates.get(key)).clone();

  /** Runs SQL as the database owner (like the SQL editor): no RLS. */
  const admin = async (sql, params = []) => (await pg.query(sql, params)).rows;

  /**
   * Runs SQL as a signed-in user, through RLS and grants, the way a request
   * from the app does. Returns { rows } or { error } instead of throwing.
   */
  async function as(userId, sql, params = []) {
    await pg.exec(`reset role; select set_config('request.jwt.claim.sub', '${userId ?? ""}', false); set role authenticated;`);
    try {
      return { rows: (await pg.query(sql, params)).rows };
    } catch (e) {
      return { error: e.message };
    } finally {
      await pg.exec("reset role");
    }
  }

  /** Runs SQL as a signed-out visitor (no JWT, so auth.uid() is null). */
  async function anon(sql, params = []) {
    await pg.exec("reset role; select set_config('request.jwt.claim.sub', '', false); set role anon;");
    try {
      return { rows: (await pg.query(sql, params)).rows };
    } catch (e) {
      return { error: e.message };
    } finally {
      await pg.exec("reset role");
    }
  }

  /** Links two users both ways, as an approved pairing does. */
  async function link(a, b) {
    await admin("update public.profiles set partner_id = $2 where id = $1", [a, b]);
    await admin("update public.profiles set partner_id = $2 where id = $1", [b, a]);
  }

  const partnerOf = async (id) => (await admin("select partner_id from public.profiles where id = $1", [id]))[0].partner_id;

  return { pg, admin, as, anon, link, partnerOf, close: () => pg.close() };
}
