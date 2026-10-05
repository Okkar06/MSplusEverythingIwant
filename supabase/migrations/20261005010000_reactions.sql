-- Reactions: a quick "thinking of you" you send your partner with one tap.
--
-- Like moods and locations, only each person's latest reaction is stored (one
-- row per sender, upserted), so there's no history. The partner's app hears
-- about it over Realtime and shows it for a few seconds.
--
-- Access, as for moods: read your own and your partner's, write only your own.

create table public.reactions (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  kind    text not null check (kind in ('heart', 'hug', 'thinking_of_you')),
  sent_at timestamptz not null default now()
);

-- sent_at is always the server's clock, whatever the client sends, so a
-- partner's "just now" can't be faked or skewed by a wrong phone clock.
create function public.set_sent_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.sent_at = now();
  return new;
end;
$$;

create trigger reactions_set_sent_at
  before insert or update on public.reactions
  for each row execute function public.set_sent_at();

alter table public.reactions enable row level security;

revoke all on public.reactions from anon;
revoke delete on public.reactions from authenticated;

create policy "reactions: read me and partner"
  on public.reactions for select to authenticated
  using (public.is_me_or_partner(user_id));

create policy "reactions: insert my own"
  on public.reactions for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "reactions: update my own"
  on public.reactions for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

alter publication supabase_realtime add table public.reactions;
