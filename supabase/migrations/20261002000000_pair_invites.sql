-- In-app pairing with a short invite code, replacing the manual SQL step.
--
-- One of you creates a code (create_pair_invite), the other types it in
-- (accept_pair_invite), and both profiles get each other's partner_id.
-- partner_id is still not writable from the app: only these two
-- security-definer functions can set it, and only through a valid code.
-- supabase/snippets/pair_partners.sql still works as an admin fallback.


-- ─── Invites ─────────────────────────────────────────────────────────────────

-- At most one open invite per person. Codes are 6 characters from an alphabet
-- without look-alikes (no 0/O, 1/I) and expire after a day.
create table public.pair_invites (
  code       text primary key check (code ~ '^[A-HJ-NP-Z2-9]{6}$'),
  owner_id   uuid not null unique references public.profiles (id) on delete cascade,
  expires_at timestamptz not null default now() + interval '1 day'
);

alter table public.pair_invites enable row level security;

revoke all on public.pair_invites from anon, authenticated;
grant select on public.pair_invites to authenticated;

-- You can see your own open invite (to show it again after a reload).
-- Nobody can list other people's codes; accepting goes through the function.
create policy "pair_invites: read my own"
  on public.pair_invites for select to authenticated
  using (owner_id = auth.uid());


-- ─── Helpers ─────────────────────────────────────────────────────────────────

-- True if this profile already has a mutual partner.
create function public.has_mutual_partner(profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles me
    join public.profiles them on them.id = me.partner_id
    where me.id = profile_id
      and them.partner_id = me.id
  );
$$;

revoke execute on function public.has_mutual_partner(uuid) from public, anon, authenticated;


-- ─── Create an invite ────────────────────────────────────────────────────────

-- Replaces any invite you already had, so only the newest code works.
create function public.create_pair_invite()
returns table (code text, expires_at timestamptz)
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- 32 characters
  me uuid := auth.uid();
  bytes bytea;
  new_code text;
begin
  if me is null then
    raise exception 'Sign in first.';
  end if;
  if public.has_mutual_partner(me) then
    raise exception 'You''re already linked with your partner.';
  end if;

  delete from public.pair_invites i where i.owner_id = me;

  loop
    -- gen_random_uuid() uses a cryptographically strong source. Bytes 0-5 are
    -- fully random, and 256 is a multiple of 32, so there's no modulo bias.
    bytes := uuid_send(gen_random_uuid());
    new_code := '';
    for n in 0..5 loop
      new_code := new_code || substr(alphabet, (get_byte(bytes, n) % 32) + 1, 1);
    end loop;

    begin
      insert into public.pair_invites (code, owner_id) values (new_code, me);
      exit;
    exception when unique_violation then
      -- Someone else's live code; try another.
    end;
  end loop;

  return query
    select i.code, i.expires_at from public.pair_invites i where i.owner_id = me;
end;
$$;


-- ─── Guess limit ─────────────────────────────────────────────────────────────

-- Failed code lookups, so nobody can guess their way into someone's location.
-- Only accept_pair_invite reads or writes this; the app has no access.
create table public.pair_attempts (
  user_id      uuid not null references public.profiles (id) on delete cascade,
  attempted_at timestamptz not null default now()
);

create index pair_attempts_user_time on public.pair_attempts (user_id, attempted_at);

alter table public.pair_attempts enable row level security;
revoke all on public.pair_attempts from anon, authenticated;


-- ─── Accept an invite ────────────────────────────────────────────────────────

-- Links you and the invite's owner, and returns their profile id.
-- Spaces, dashes and lower case in the typed code are ignored.
--
-- A code that doesn't match returns null instead of raising, because raising
-- would roll back the failed-attempt row and make the limit useless.
-- After 10 misses in an hour, every try is refused until the hour passes.
create function public.accept_pair_invite(invite_code text)
returns uuid
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  max_misses constant int := 10;
  me uuid := auth.uid();
  clean text := upper(regexp_replace(coalesce(invite_code, ''), '[^A-Za-z0-9]', '', 'g'));
  invite public.pair_invites;
begin
  if me is null then
    raise exception 'Sign in first.';
  end if;
  -- Checked before the lookup so a linked account can't probe which codes exist.
  if public.has_mutual_partner(me) then
    raise exception 'You''re already linked with a partner.';
  end if;

  -- One accept at a time per person, so parallel calls can't slip past the count.
  perform pg_advisory_xact_lock(hashtext('accept_pair_invite:' || me::text));

  delete from public.pair_attempts a
  where a.user_id = me and a.attempted_at < now() - interval '1 hour';

  if (select count(*) from public.pair_attempts a where a.user_id = me) >= max_misses then
    raise exception 'Too many tries. Wait a bit and try again.';
  end if;

  select * into invite
  from public.pair_invites i
  where i.code = clean
  for update;

  if not found or invite.expires_at < now() then
    insert into public.pair_attempts (user_id) values (me);
    return null;
  end if;
  if invite.owner_id = me then
    raise exception 'That''s your own code. Send it to your partner instead.';
  end if;

  -- Lock both profiles in a fixed order so two people accepting at once can't
  -- both succeed with different partners.
  perform 1
  from public.profiles p
  where p.id in (me, invite.owner_id)
  order by p.id
  for update;

  if public.has_mutual_partner(me) then
    raise exception 'You''re already linked with a partner.';
  end if;
  if public.has_mutual_partner(invite.owner_id) then
    raise exception 'That person is already linked with a partner.';
  end if;

  update public.profiles p
  set partner_id = case when p.id = me then invite.owner_id else me end
  where p.id in (me, invite.owner_id);

  delete from public.pair_invites i where i.owner_id in (me, invite.owner_id);
  delete from public.pair_attempts a where a.user_id = me;

  return invite.owner_id;
end;
$$;

revoke execute on function public.create_pair_invite() from public, anon;
revoke execute on function public.accept_pair_invite(text) from public, anon;
grant execute on function public.create_pair_invite() to authenticated;
grant execute on function public.accept_pair_invite(text) to authenticated;


-- ─── Realtime ────────────────────────────────────────────────────────────────

-- Broadcast profile changes too, so the person who shared the code sees the
-- link happen, and a renamed partner shows up without a reload.
-- The profiles select policy still decides who receives which rows.
alter publication supabase_realtime add table public.profiles;
