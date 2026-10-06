-- RLS performance, following the Supabase Postgres best-practices skill
-- (.agents/skills/supabase-postgres-best-practices/references/
--  security-rls-performance.md and schema-foreign-key-indexes.md).
--
-- No behaviour changes: every policy keeps exactly the same rule.
--
-- 1. Wrap auth.uid() in (select …). A bare auth.uid() in a policy is
--    evaluated for every row checked; wrapped, Postgres evaluates it once
--    per query and reuses the result.
-- 2. Same inside is_me_or_partner(), which every read policy calls per row.
-- 3. Index profiles.partner_id. It's a foreign key (on delete set null), and
--    Postgres doesn't index those automatically, so deleting a profile had to
--    scan every profile to clear links pointing at it.


-- ─── 1. Policies ─────────────────────────────────────────────────────────────

alter policy "profiles: update my own" on public.profiles
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

alter policy "moods: insert my own" on public.moods
  with check (user_id = (select auth.uid()));

alter policy "moods: update my own" on public.moods
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

alter policy "locations: insert my own" on public.locations
  with check (user_id = (select auth.uid()));

alter policy "locations: update my own" on public.locations
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

alter policy "locations: delete my own" on public.locations
  using (user_id = (select auth.uid()));

alter policy "pair_invites: read my own" on public.pair_invites
  using (owner_id = (select auth.uid()));


-- ─── 2. The read-policy helper ───────────────────────────────────────────────

-- Same body as in 20261001000000_initial_schema.sql, with auth.uid() wrapped.
-- (The call in the read policies can't be wrapped itself: its argument is the
-- row's id, so it differs per row.)
create or replace function public.is_me_or_partner(user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select user_id = (select auth.uid())
      or exists (
           select 1
           from public.profiles me
           join public.profiles them on them.id = me.partner_id
           where me.id = (select auth.uid())
             and them.id = user_id
             and them.partner_id = me.id
         );
$$;


-- ─── 3. Foreign-key index ────────────────────────────────────────────────────

create index profiles_partner_id_idx on public.profiles (partner_id);
