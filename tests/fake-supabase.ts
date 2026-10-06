// A stand-in for Supabase, so the e2e tests need no real project.
// It answers the auth, REST, RPC and Realtime calls the app makes, keeps the
// rows in memory, and records requests so tests can check what was sent.

import { test as base, type BrowserContext, type Request } from "@playwright/test";
import type { LocationRow, MoodRow, Profile, ReactionRow } from "@/lib/types";
import type { ReactionKind } from "@/lib/reactions";
import type { MoodValue } from "@/lib/moods";

export const ME = "00000000-0000-4000-8000-00000000000a";
export const PARTNER = "00000000-0000-4000-8000-00000000000b";
export const PARTNER_CODE = "BEN234";

const ORIGIN = "https://e2e.supabase.co"; // matches playwright.config.ts
const STORAGE_KEY = "sb-e2e-auth-token";
const MISS_LIMIT = 10;
const NO_ROWS = {
  code: "PGRST116",
  details: "The result contains 0 rows",
  hint: null,
  message: "JSON object requested, multiple (or no) rows returned",
};

type Table = "profiles" | "moods" | "locations" | "pair_invites" | "reactions";
type Invite = {
  code: string;
  expires_at: string;
  requested_name: string | null;
  requested_email: string | null;
};
type Push = (table: Table, type: "INSERT" | "UPDATE" | "DELETE", record: object) => void;

const cors = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "*",
  "access-control-allow-methods": "*",
  "access-control-expose-headers": "*",
};

function b64(value: object) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function makeSession({ expired = false } = {}) {
  const expiresAt = Math.floor(Date.now() / 1000) + (expired ? -3_600 : 86_400);
  const user = {
    id: ME,
    aud: "authenticated",
    role: "authenticated",
    email: "ana@example.com",
    app_metadata: { provider: "email" },
    user_metadata: {},
    created_at: new Date().toISOString(),
  };
  return {
    access_token: `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub: ME, role: "authenticated", exp: expiresAt })}.sig`,
    refresh_token: "e2e-refresh",
    token_type: "bearer",
    expires_in: 86_400,
    expires_at: expiresAt,
    user,
  };
}

export class FakeSupabase {
  profiles: Record<string, Profile> = { [ME]: { id: ME, display_name: "Ana", partner_id: null } };
  moods: Record<string, MoodRow> = {};
  locations: Record<string, LocationRow> = {};
  reactions: Record<string, ReactionRow> = {};
  /** Ana's own code, and any request waiting on it. */
  invite: Invite | null = null;
  /** Ana's request on someone else's code, waiting for them to accept. */
  myRequest: { owner_name: string } | null = null;
  misses = 0;
  /** Paths (e.g. "/rpc/my_pair_request") whose next call fails, as if offline. */
  failNext = new Set<string>();
  /** When true, Supabase is unreachable: every request fails and Realtime never connects. */
  get down() {
    return this._down;
  }
  set down(value: boolean) {
    this._down = value;
    if (value) this.wasDown = true;
  }
  private _down = false;
  /** Whether this test took Supabase down at some point (see the console check below). */
  wasDown = false;
  /** Every request to the fake project, for assertions. */
  requests: Request[] = [];
  private pushers: Push[] = [];
  private nextCode = 0;

  /** Starts the browser already signed in as Ana. */
  async signIn(context: BrowserContext, { expired = false } = {}) {
    await context.addInitScript(
      ([key, session]) => localStorage.setItem(key, session),
      [STORAGE_KEY, JSON.stringify(makeSession({ expired }))] as const,
    );
  }

  /** When true, refreshing the session is refused, as if it was revoked elsewhere. */
  refreshRevoked = false;

  /** Makes Ben a profile, linked with Ana both ways. */
  link() {
    this.profiles[ME] = { ...this.profiles[ME], partner_id: PARTNER };
    this.profiles[PARTNER] = { id: PARTNER, display_name: "Ben", partner_id: ME };
  }

  /** Ben types Ana's code on his phone: a request lands on her invite. */
  requestFromBen() {
    if (!this.invite) throw new Error("Ana has no code yet");
    this.invite = { ...this.invite, requested_name: "Ben", requested_email: "ben@example.com" };
    this.push("pair_invites", "UPDATE", { ...this.invite, owner_id: ME });
  }

  /** Ben accepts Ana's request on his code. */
  benApproves() {
    this.myRequest = null;
    this.link();
    this.push("profiles", "UPDATE", this.profiles[ME]);
  }

  /** Clears both links, locations, reactions and mood notes, as unpair() does. */
  unlink() {
    this.reactions = {};
    for (const [id, m] of Object.entries(this.moods)) this.moods[id] = { ...m, note: null };
    this.profiles[ME] = { ...this.profiles[ME], partner_id: null };
    if (this.profiles[PARTNER]) this.profiles[PARTNER] = { ...this.profiles[PARTNER], partner_id: null };
    this.locations = {};
  }

  /** Ben unlinks on his phone; Realtime tells Ana's app. */
  benUnlinks() {
    this.unlink();
    this.push("profiles", "UPDATE", this.profiles[ME]);
  }

  /** Ben taps a reaction on his phone; Realtime brings it to Ana. */
  benReacts(kind: ReactionKind, sentAt = new Date()) {
    const row = { user_id: PARTNER, kind, sent_at: sentAt.toISOString() };
    this.reactions[PARTNER] = row;
    this.push("reactions", "UPDATE", row);
    return row;
  }

  setMood(userId: string, mood: MoodValue, note: string | null = null) {
    const row = { user_id: userId, mood, note, updated_at: new Date().toISOString() };
    this.moods[userId] = row;
    return row;
  }

  /** Sends a Realtime change to every open channel, as the database would. */
  push: Push = (table, type, record) => {
    for (const send of this.pushers) send(table, type, record);
  };

  /** Rows RLS would return to Ana. */
  private visible<T>(rows: Record<string, T>, key: (row: T) => string): T[] {
    const me = this.profiles[ME];
    const partner = me.partner_id ? this.profiles[me.partner_id] : undefined;
    const mutual = partner?.partner_id === ME;
    return Object.values(rows).filter((row) => key(row) === ME || (mutual && key(row) === partner.id));
  }

  async install(context: BrowserContext) {
    await context.route(`${ORIGIN}/**`, async (route) => {
      const request = route.request();
      if (request.method() === "OPTIONS") return route.fulfill({ status: 200, headers: cors });
      this.requests.push(request);

      const path = new URL(request.url()).pathname;
      const wantsObject = (request.headers()["accept"] ?? "").includes("vnd.pgrst.object");
      const reply = (status: number, body?: unknown) =>
        route.fulfill({
          status,
          headers: {
            ...cors,
            "content-type": wantsObject ? "application/vnd.pgrst.object+json" : "application/json",
          },
          body: body === undefined ? "" : JSON.stringify(body),
        });
      // A 503, not route.abort(): after an abort, WebKit under Playwright sends
      // later requests past the routes to the real network.
      // With a message, like a real gateway error: an empty one reads as "no error"
      // in supabase-js callers that check error.message.
      if (this.down) return reply(503, { message: "Service Unavailable" });
      for (const failing of this.failNext) {
        if (path.endsWith(failing)) {
          this.failNext.delete(failing);
          return route.fulfill({ status: 503, headers: cors, body: "" });
        }
      }
      const raise = (message: string) =>
        reply(400, { code: "P0001", details: null, hint: null, message });

      // ── Auth ──
      if (path === "/auth/v1/otp") return reply(200, {});
      if (path === "/auth/v1/verify") return reply(200, makeSession());
      if (path === "/auth/v1/logout") return reply(204);
      if (path === "/auth/v1/user") return reply(200, makeSession().user);
      if (path === "/auth/v1/token") {
        if (this.refreshRevoked) {
          return reply(400, { code: 400, error_code: "refresh_token_not_found", msg: "Invalid Refresh Token: Refresh Token Not Found" });
        }
        return reply(200, makeSession());
      }

      // ── Tables ──
      if (path === "/rest/v1/profiles") {
        if (request.method() === "PATCH") {
          this.profiles[ME] = { ...this.profiles[ME], ...request.postDataJSON() };
          return reply(204);
        }
        const rows = this.visible(this.profiles, (p) => p.id);
        const id = new URL(request.url()).searchParams.get("id")?.replace(/^eq\./, "");
        const filtered = id ? rows.filter((p) => p.id === id) : rows;
        if (wantsObject) return filtered.length ? reply(200, filtered[0]) : reply(406, NO_ROWS);
        return reply(200, filtered);
      }
      if (path === "/rest/v1/moods") {
        if (request.method() === "POST") {
          const { mood, note } = request.postDataJSON();
          return reply(201, [this.setMood(ME, mood, note)]);
        }
        return reply(200, this.visible(this.moods, (m) => m.user_id));
      }
      if (path === "/rest/v1/reactions") {
        if (request.method() === "POST") {
          // As the trigger does: sent_at is always the server's clock.
          const row = { user_id: ME, kind: request.postDataJSON().kind, sent_at: new Date().toISOString() };
          this.reactions[ME] = row;
          return reply(201);
        }
        return reply(200, this.visible(this.reactions, (r) => r.user_id));
      }
      if (path === "/rest/v1/locations") {
        if (request.method() === "POST") {
          this.locations[ME] = { ...request.postDataJSON(), updated_at: new Date().toISOString() };
          return reply(201);
        }
        if (request.method() === "DELETE") {
          delete this.locations[ME];
          return reply(204);
        }
        return reply(200, this.visible(this.locations, (l) => l.user_id));
      }
      if (path === "/rest/v1/pair_invites") {
        const live = this.invite && Date.parse(this.invite.expires_at) > Date.now() ? [this.invite] : [];
        if (!wantsObject) return reply(200, live);
        return live.length ? reply(200, live[0]) : reply(406, NO_ROWS);
      }

      // ── RPCs (same rules as the migration) ──
      if (path === "/rest/v1/rpc/create_pair_invite") {
        this.invite = {
          code: ["K7P2MX", "QRS789", "HJW456"][this.nextCode++ % 3],
          expires_at: new Date(Date.now() + 86_400_000).toISOString(),
          requested_name: null,
          requested_email: null,
        };
        const { code, expires_at } = this.invite;
        return reply(200, wantsObject ? { code, expires_at } : [{ code, expires_at }]);
      }
      if (path === "/rest/v1/rpc/request_pair") {
        if (this.misses >= MISS_LIMIT) return raise("Too many tries. Wait a bit and try again.");
        const typed = String(request.postDataJSON().invite_code).replace(/[^a-z0-9]/gi, "").toUpperCase();
        if (this.invite && typed === this.invite.code) {
          return raise("That's your own code. Send it to your partner instead.");
        }
        if (typed !== PARTNER_CODE) {
          this.misses++;
          return reply(200, null);
        }
        this.myRequest = { owner_name: "Ben" };
        return reply(200, "Ben");
      }
      if (path === "/rest/v1/rpc/my_pair_request") {
        const rows = this.myRequest ? [{ ...this.myRequest, expires_at: new Date(Date.now() + 86_400_000).toISOString() }] : [];
        if (!wantsObject) return reply(200, rows);
        return rows.length ? reply(200, rows[0]) : reply(406, NO_ROWS);
      }
      if (path === "/rest/v1/rpc/cancel_pair_request") {
        this.myRequest = null;
        return reply(204);
      }
      if (path === "/rest/v1/rpc/approve_pair_request") {
        if (!this.invite?.requested_name) return raise("There's no request to accept.");
        this.invite = null;
        this.link();
        return reply(200, PARTNER);
      }
      if (path === "/rest/v1/rpc/unpair") {
        if (!this.profiles[ME].partner_id) return raise("You're not linked with anyone.");
        this.unlink();
        return reply(204);
      }
      if (path === "/rest/v1/rpc/decline_pair_request") {
        if (this.invite?.requested_name) this.invite = null;
        return reply(204);
      }

      return reply(404, { message: `fake-supabase: no handler for ${request.method()} ${path}` });
    });

    // Realtime speaks the Phoenix protocol: [join_ref, ref, topic, event, payload].
    await context.routeWebSocket(/e2e\.supabase\.co\/realtime/, (ws) => {
      ws.onMessage((raw) => {
        if (this.down) return; // no answer: the channel never subscribes
        const [joinRef, ref, topic, event, payload] = JSON.parse(String(raw));
        const send = (ev: string, body: object, msgRef: string | null = ref) =>
          ws.send(JSON.stringify([joinRef, msgRef, topic, ev, body]));

        if (event !== "phx_join") return send("phx_reply", { status: "ok", response: {} });

        const bindings = ((payload.config?.postgres_changes ?? []) as { table: string }[]).map(
          (binding, i) => ({ ...binding, id: i + 1 }),
        );
        send("phx_reply", { status: "ok", response: { postgres_changes: bindings } });
        this.pushers.push((table, type, record) => {
          const binding = bindings.find((b) => b.table === table);
          if (!binding) return;
          send(
            "postgres_changes",
            {
              ids: [binding.id],
              data: {
                schema: "public",
                table,
                type,
                commit_timestamp: new Date().toISOString(),
                columns: [],
                record: type === "DELETE" ? {} : record,
                old_record: type === "DELETE" ? record : {},
                errors: null,
              },
            },
            null,
          );
        });
      });
    });
  }
}

/** `test` with a fake Supabase installed, and console errors failing the test. */
export const test = base.extend<{ supabase: FakeSupabase }>({
  supabase: async ({ context, page }, provide) => {
    const supabase = new FakeSupabase();
    await supabase.install(context);

    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (msg) => {
      // The browser logs every non-2xx response; the app shows those to the user itself.
      if (msg.type() === "error" && !/Failed to load resource/.test(msg.text())) errors.push(msg.text());
    });

    await provide(supabase);
    // WebKit logs a failed cross-origin request as "... due to access control
    // checks". That's expected when a test took Supabase down on purpose, and
    // still fails every other test.
    const unexpected = supabase.wasDown ? errors.filter((e) => !/due to access control checks/.test(e)) : errors;
    base.expect(unexpected, "console errors").toEqual([]);
  },
});

export { expect } from "@playwright/test";
