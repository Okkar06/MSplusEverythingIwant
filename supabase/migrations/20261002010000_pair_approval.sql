-- The code's owner approves each link before it happens.
--
-- Typing a code no longer links anyone. It files a request on the invite
-- (request_pair), and the owner sees "Ben (ben@…) wants to link with you" and
-- approves or declines it. So even a correctly guessed code can't link a
-- stranger, whatever the guess limit lets through.
--
--   request_pair(code)      requester: files a request, returns the owner's name
--   my_pair_request()       requester: your pending request, if any
--   cancel_pair_request()   requester: withdraws it
--   approve_pair_request()  owner: links you both
--   decline_pair_request()  owner: refuses, and cancels the code (it has leaked)
--
-- Replaces accept_pair_invite from 20261002000000_pair_invites.sql (kept as a stub, below).


-- ─── Requests live on the invite ─────────────────────────────────────────────

-- One request per invite. The name and email are copied at request time
-- because the owner can't read the requester's profile until they're linked,
-- and the email is shown because display names can be anything.
alter table public.pair_invites
  add column requested_by    uuid references public.profiles (id) on delete set null,
  add column requested_name  text,
  add column requested_email text,
  add column requested_at    timestamptz;

-- Each person has at most one pending request at a time.
create unique index pair_invites_one_request_each
  on public.pair_invites (requested_by)
  where requested_by is not null;

-- The owner's screen updates live when a request arrives. The select policy
-- (owner only) still decides who receives which rows.
alter publication supabase_realtime add table public.pair_invites;

-- The old one-step accept is retired, but kept as a stub (same signature and
-- grants) so a page still running the previous app version gets a clear
-- message instead of "function not found". Drop it in a later migration.
create or replace function public.accept_pair_invite(invite_code text)
returns uuid
language plpgsql
volatile
security definer
set search_path = ''
as $$
begin
  raise exception 'The app was updated. Reload the page and try again.';
end;
$$;


-- ─── Request ─────────────────────────────────────────────────────────────────

-- A code that doesn't match returns null instead of raising, so the miss is
-- recorded (raising would roll it back). Same guess limit as before.
create function public.request_pair(invite_code text)
returns text
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
  owner_name text;
begin
  if me is null then
    raise exception 'Sign in first.';
  end if;
  -- Checked before the lookup so a linked account can't probe which codes exist.
  if public.has_mutual_partner(me) then
    raise exception 'You''re already linked with a partner.';
  end if;

  -- One request at a time per person, so parallel calls can't slip past the count.
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
  if invite.requested_by is not null and invite.requested_by <> me then
    raise exception 'Someone else already used that code. Ask for a new one.';
  end if;

  select p.display_name into owner_name from public.profiles p where p.id = invite.owner_id;

  if invite.requested_by = me then
    return owner_name; -- asked again: already pending
  end if;

  -- Replace any request you made on another code.
  update public.pair_invites i
  set requested_by = null, requested_name = null, requested_email = null, requested_at = null
  where i.requested_by = me;

  update public.pair_invites i
  set requested_by    = me,
      requested_name  = (select p.display_name from public.profiles p where p.id = me),
      requested_email = (select u.email from auth.users u where u.id = me),
      requested_at    = now()
  where i.code = invite.code;

  -- Misses are only cleared when a link is approved. Clearing them here would
  -- let anyone reset their count by requesting a code from their own second account.
  return owner_name;
end;
$$;


-- ─── Requester: check or cancel ──────────────────────────────────────────────

-- The requester can't read the invite row (it's the owner's), so this tells
-- them whether their request is still waiting, and on whom.
create function public.my_pair_request()
returns table (owner_name text, expires_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select p.display_name, i.expires_at
  from public.pair_invites i
  join public.profiles p on p.id = i.owner_id
  where i.requested_by = auth.uid()
    and i.expires_at > now();
$$;

create function public.cancel_pair_request()
returns void
language sql
volatile
security definer
set search_path = ''
as $$
  update public.pair_invites i
  set requested_by = null, requested_name = null, requested_email = null, requested_at = null
  where i.requested_by = auth.uid();
$$;


-- ─── Owner: approve or decline ───────────────────────────────────────────────

-- Links you with whoever requested your code, and returns their profile id.
create function public.approve_pair_request()
returns uuid
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  me uuid := auth.uid();
  invite public.pair_invites;
begin
  if me is null then
    raise exception 'Sign in first.';
  end if;

  select * into invite
  from public.pair_invites i
  where i.owner_id = me
  for update;

  if not found or invite.requested_by is null then
    raise exception 'There''s no request to accept.';
  end if;
  if invite.expires_at < now() then
    raise exception 'That request has expired. Get a new code and try again.';
  end if;

  -- Lock both profiles in a fixed order so two links can't race.
  perform 1
  from public.profiles p
  where p.id in (me, invite.requested_by)
  order by p.id
  for update;

  if public.has_mutual_partner(me) then
    raise exception 'You''re already linked with a partner.';
  end if;
  if public.has_mutual_partner(invite.requested_by) then
    raise exception 'That person is already linked with a partner.';
  end if;

  update public.profiles p
  set partner_id = case when p.id = me then invite.requested_by else me end
  where p.id in (me, invite.requested_by);

  delete from public.pair_invites i where i.owner_id in (me, invite.requested_by);
  update public.pair_invites i
  set requested_by = null, requested_name = null, requested_email = null, requested_at = null
  where i.requested_by in (me, invite.requested_by);
  delete from public.pair_attempts a where a.user_id = invite.requested_by;

  return invite.requested_by;
end;
$$;

-- Refuses the request and cancels the code, since someone you didn't want has it.
create function public.decline_pair_request()
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Sign in first.';
  end if;
  delete from public.pair_invites i
  where i.owner_id = auth.uid() and i.requested_by is not null;
end;
$$;


revoke execute on function public.request_pair(text) from public, anon;
revoke execute on function public.my_pair_request() from public, anon;
revoke execute on function public.cancel_pair_request() from public, anon;
revoke execute on function public.approve_pair_request() from public, anon;
revoke execute on function public.decline_pair_request() from public, anon;
grant execute on function public.request_pair(text) to authenticated;
grant execute on function public.my_pair_request() to authenticated;
grant execute on function public.cancel_pair_request() to authenticated;
grant execute on function public.approve_pair_request() to authenticated;
grant execute on function public.decline_pair_request() to authenticated;
