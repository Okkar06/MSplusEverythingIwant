-- Initial schema: two-person mood + live location sharing.
--
-- Tables
--   profiles   one row per user, created automatically on sign-up
--   moods      each user's CURRENT mood (one row per user, upserted)
--   locations  each user's CURRENT location (one row per user, upserted)
--
-- Only the current mood/location is stored — no history — so there is never
-- a trail of where either of you has been.
--
-- Access rule (enforced by row-level security):
--   you can read your own rows and your partner's rows, and write only your own.
--   A partner link only counts when it's mutual (A → B and B → A), and users
--   cannot change partner_id themselves — pairing is done once in the SQL editor
--   (see supabase/snippets/pair_partners.sql).


-- ─── Profiles ────────────────────────────────────────────────────────────────

create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  partner_id   uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  check (partner_id is null or partner_id <> id)
);

-- Create a profile whenever someone signs up.
-- display_name comes from sign-up metadata, falling back to the email prefix.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ─── Access helper ───────────────────────────────────────────────────────────

-- True if `user_id` is the signed-in user or their (mutual) partner.
-- security definer so it can read profiles without tripping profiles' own RLS.
create function public.is_me_or_partner(user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select user_id = auth.uid()
      or exists (
           select 1
           from public.profiles me
           join public.profiles them on them.id = me.partner_id
           where me.id = auth.uid()
             and them.id = user_id
             and them.partner_id = me.id
         );
$$;


-- ─── Moods ───────────────────────────────────────────────────────────────────

-- Mood is a fixed list so the web app and the future widgets render the same
-- set of icons. To add a mood: add it here (new migration) and in the UI.
create table public.moods (
  user_id    uuid primary key references public.profiles (id) on delete cascade,
  mood       text not null check (mood in (
               'happy', 'loved', 'calm', 'excited',
               'tired', 'sad', 'stressed', 'missing_you'
             )),
  note       text check (char_length(note) <= 80),
  updated_at timestamptz not null default now()
);


-- ─── Locations ───────────────────────────────────────────────────────────────

create table public.locations (
  user_id    uuid primary key references public.profiles (id) on delete cascade,
  latitude   double precision not null check (latitude between -90 and 90),
  longitude  double precision not null check (longitude between -180 and 180),
  accuracy_m double precision check (accuracy_m >= 0),
  updated_at timestamptz not null default now()
);


-- ─── updated_at ──────────────────────────────────────────────────────────────

-- Keep updated_at honest on upserts, whatever the client sends.
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger moods_set_updated_at
  before insert or update on public.moods
  for each row execute function public.set_updated_at();

create trigger locations_set_updated_at
  before insert or update on public.locations
  for each row execute function public.set_updated_at();


-- ─── Row-level security ──────────────────────────────────────────────────────

alter table public.profiles  enable row level security;
alter table public.moods     enable row level security;
alter table public.locations enable row level security;

-- Signed-out visitors get nothing.
revoke all on public.profiles, public.moods, public.locations from anon;

-- Profiles: read yourself + partner; edit only your display name.
-- (Column-level grant: partner_id can't be changed from the app.)
create policy "profiles: read me and partner"
  on public.profiles for select to authenticated
  using (public.is_me_or_partner(id));

create policy "profiles: update my own"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

revoke insert, update, delete on public.profiles from authenticated;
grant update (display_name) on public.profiles to authenticated;

-- Moods: read yourself + partner; write only your own.
create policy "moods: read me and partner"
  on public.moods for select to authenticated
  using (public.is_me_or_partner(user_id));

create policy "moods: insert my own"
  on public.moods for insert to authenticated
  with check (user_id = auth.uid());

create policy "moods: update my own"
  on public.moods for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Locations: same as moods, plus delete (= stop sharing location).
create policy "locations: read me and partner"
  on public.locations for select to authenticated
  using (public.is_me_or_partner(user_id));

create policy "locations: insert my own"
  on public.locations for insert to authenticated
  with check (user_id = auth.uid());

create policy "locations: update my own"
  on public.locations for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "locations: delete my own"
  on public.locations for delete to authenticated
  using (user_id = auth.uid());


-- ─── Realtime ────────────────────────────────────────────────────────────────

-- Broadcast changes to subscribed clients. Realtime applies the select
-- policies above, so each of you only receives your own and your partner's rows.
alter publication supabase_realtime add table public.moods, public.locations;
