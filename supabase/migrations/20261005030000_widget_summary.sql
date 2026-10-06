-- Everything a home-screen widget shows, in one call (see DESIGN.md → Widgets):
-- both names, both moods, the distance between you, and how fresh each is.
-- The iOS and Android widgets call this and only render the result.
--
-- What it deliberately leaves out, because widget data sits on a lock screen
-- and in the OS's widget cache:
--   coordinates   only the distance between you, rounded
--   mood notes    they're messages to each other, not glanceable status
--
-- It runs with the caller's own rights (security invoker), so the normal
-- row-level security decides what it can see: your rows, and your partner's
-- once the link is mutual. Nothing here bypasses those rules.

create function public.widget_summary()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with me as (
    select p.id, p.display_name, p.partner_id
    from public.profiles p
    where p.id = (select auth.uid())
  ),
  -- RLS hides a partner's profile until the link is mutual, so this is empty
  -- for a one-sided or missing link.
  partner as (
    select p.id, p.display_name
    from public.profiles p
    join me on p.id = me.partner_id
  ),
  my_loc as (select l.* from public.locations l join me on l.user_id = me.id),
  their_loc as (select l.* from public.locations l join partner on l.user_id = partner.id),
  distance as (
    -- Great-circle distance in metres, same formula and radius as
    -- lib/distance.ts so the app and the widget agree. Rounded to 10 m.
    select
      round(
        2 * 6371000 * asin(least(1, sqrt(
          power(sin(radians(t.latitude - m.latitude) / 2), 2)
          + cos(radians(m.latitude)) * cos(radians(t.latitude))
            * power(sin(radians(t.longitude - m.longitude) / 2), 2)
        ))) / 10
      ) * 10 as metres,
      -- The distance is only as fresh as the older of the two fixes.
      least(m.updated_at, t.updated_at) as as_of
    from my_loc m, their_loc t
  )
  select case when not exists (select 1 from me) then null else jsonb_build_object(
    'me', (
      select jsonb_build_object(
        'name', me.display_name,
        'mood', mo.mood,
        'mood_updated_at', mo.updated_at,
        'sharing_location', exists (select 1 from my_loc),
        -- Same 5-minute window as for the partner: a stale location isn't live.
        'live', coalesce((select updated_at > now() - interval '5 minutes' from my_loc), false)
      )
      from me left join public.moods mo on mo.user_id = me.id
    ),
    'partner', (
      select jsonb_build_object(
        'name', partner.display_name,
        'mood', mo.mood,
        'mood_updated_at', mo.updated_at,
        'location_updated_at', (select updated_at from their_loc),
        -- Same 5-minute window as isLive() in lib/time.ts.
        'live', coalesce((select updated_at > now() - interval '5 minutes' from their_loc), false)
      )
      from partner left join public.moods mo on mo.user_id = partner.id
    ),
    'distance_m', (select metres from distance),
    'distance_as_of', (select as_of from distance),
    'generated_at', now()
  ) end;
$$;

revoke execute on function public.widget_summary() from public, anon;
grant execute on function public.widget_summary() to authenticated;
