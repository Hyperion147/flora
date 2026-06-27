alter table public.plants
  add column if not exists user_avatar_url text;

update public.plants
set user_avatar_url = coalesce(
  auth_users.raw_user_meta_data->>'avatar_url',
  auth_users.raw_user_meta_data->>'picture'
)
from auth.users as auth_users
where auth_users.id = public.plants.user_id
  and public.plants.user_avatar_url is null;

drop function if exists public.plant_leaderboard(integer);

create or replace function public.plant_leaderboard(p_limit integer default 50)
returns table (
  user_id uuid,
  user_name text,
  plant_count bigint,
  avatar_url text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    plants.user_id,
    max(plants.user_name)::text as user_name,
    count(*)::bigint as plant_count,
    max(plants.user_avatar_url)::text as avatar_url
  from public.plants
  group by plants.user_id
  order by count(*) desc, max(plants.user_name) asc
  limit least(greatest(p_limit, 1), 100);
$$;

revoke all on function public.plant_leaderboard(integer) from public;
grant execute on function public.plant_leaderboard(integer) to anon, authenticated, service_role;
