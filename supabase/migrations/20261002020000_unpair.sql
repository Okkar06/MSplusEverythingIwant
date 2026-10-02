-- Unlink from your partner from inside the app.
--
-- Either of you can unlink at any time; the other doesn't have to agree.
-- Both partner_id links are cleared, and both stored locations are deleted,
-- so neither of you keeps the other's last spot. (Only when the link was
-- mutual; a one-sided pointer only clears your own side and location.) Moods stay (they're only
-- visible to a partner, and you no longer have one).

create function public.unpair()
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
end;
$$;

revoke execute on function public.unpair() from public, anon;
grant execute on function public.unpair() to authenticated;
