-- Unlinking also clears both partners' latest reactions and mood notes.
--
-- Neither has a recipient: a reaction or a mood note is "mine", shown to
-- whoever my partner is. Without this, a hug or a note like "miss you Ben"
-- written for an old partner would show to the next one.
--
--   reactions   deleted
--   mood notes  cleared; the mood itself stays (it's about you, not them)
--
-- Same rule as for locations in unpair(): both people's rows when the link was
-- mutual, only your own when it was one-sided.
--
-- Same function as in 20261002020000_unpair.sql (create or replace keeps its
-- owner and grants), plus the two statements at the end.
--
-- Clearing a note must not make the mood look freshly set, so set_updated_at()
-- learns to keep the old updated_at when the transaction-local setting
-- app.keep_updated_at is on. Only unpair() turns it on; app requests can't
-- (PostgREST only lets clients set request.* settings, and no RPC exposes this).

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' and current_setting('app.keep_updated_at', true) = 'on' then
    new.updated_at = old.updated_at;
  else
    new.updated_at = now();
  end if;
  return new;
end;
$$;


create or replace function public.unpair()
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  me uuid := auth.uid();
  them uuid;
  mutual boolean;
begin
  if me is null then
    raise exception 'Sign in first.';
  end if;

  select p.partner_id into them from public.profiles p where p.id = me;
  if them is null then
    raise exception 'You''re not linked with anyone.';
  end if;

  -- Lock both profiles in a fixed order, as linking does, so an unlink can't
  -- race a link or the other person unlinking at the same time.
  perform 1
  from public.profiles p
  where p.id in (me, them)
  order by p.id
  for update;

  -- Re-read under the locks: the link may have changed since the first read.
  select p.partner_id into them from public.profiles p where p.id = me;
  if them is null then
    raise exception 'You''re not linked with anyone.';
  end if;
  select coalesce(p.partner_id = me, false) into mutual from public.profiles p where p.id = them;

  -- Clear your side, and theirs only if it points back at you.
  update public.profiles p
  set partner_id = null
  where p.id = me
     or (p.id = them and mutual);

  -- Delete their location only if you were really linked. A one-sided pointer
  -- (e.g. a half-run pair_partners.sql) must not let you wipe the location of
  -- someone who's linked with somebody else.
  delete from public.locations l
  where l.user_id = me
     or (l.user_id = them and mutual);

  -- Same for reactions: a reaction has no recipient, so one sent before the
  -- unlink would otherwise show to whoever either of you links with next.
  delete from public.reactions r
  where r.user_id = me
     or (r.user_id = them and mutual);

  -- The note was written to the old partner; the mood is about you and stays,
  -- with its original time: clearing a note isn't setting a mood, so the next
  -- partner mustn't see it as "just now". The flag is transaction-local.
  perform set_config('app.keep_updated_at', 'on', true);
  update public.moods m
  set note = null
  where m.note is not null
    and (m.user_id = me or (m.user_id = them and mutual));
  perform set_config('app.keep_updated_at', 'off', true);
end;
$$;
