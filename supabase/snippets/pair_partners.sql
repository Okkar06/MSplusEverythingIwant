-- Pair the two of you as partners. Run once in the Supabase SQL editor
-- (it runs as an admin, so it can set partner_id, which the app can't).
--
-- Do this after both of you have signed in at least once, so both profiles exist.
-- Replace the two emails below.

update public.profiles p
set partner_id = other.id
from auth.users me, auth.users other_user, public.profiles other
where p.id = me.id
  and other.id = other_user.id
  and (me.email, other_user.email) in (
    ('you@example.com',     'partner@example.com'),
    ('partner@example.com', 'you@example.com')
  );

-- Check: both rows should show each other's id.
select p.display_name, u.email, p.partner_id
from public.profiles p
join auth.users u on u.id = p.id;
