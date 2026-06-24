create sequence if not exists public.plants_pid_seq
  as bigint
  start with 1001
  increment by 1
  minvalue 1001;

do $$
declare
  current_max bigint;
begin
  select coalesce(max(pid::bigint), 1000)
    into current_max
    from public.plants
    where pid ~ '^[0-9]+$';

  perform setval(
    'public.plants_pid_seq',
    greatest(current_max, 1000),
    true
  );
end $$;

create or replace function public.next_plant_pid()
returns text
language sql
security definer
set search_path = public
as $$
  select nextval('public.plants_pid_seq')::text;
$$;

create or replace function public.plant_leaderboard(p_limit integer default 50)
returns table (
  user_id uuid,
  user_name text,
  plant_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    plants.user_id,
    max(plants.user_name)::text as user_name,
    count(*)::bigint as plant_count
  from public.plants
  group by plants.user_id
  order by count(*) desc, max(plants.user_name) asc
  limit least(greatest(p_limit, 1), 100);
$$;

revoke all on function public.next_plant_pid() from public;
revoke all on function public.plant_leaderboard(integer) from public;

grant execute on function public.next_plant_pid() to service_role;
grant execute on function public.plant_leaderboard(integer) to anon, authenticated, service_role;

