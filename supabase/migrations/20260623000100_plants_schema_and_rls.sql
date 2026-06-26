create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.plants (
  id uuid primary key default extensions.gen_random_uuid(),
  pid varchar(20),
  name varchar(255) not null,
  description text,
  category varchar(100),
  user_id uuid not null,
  user_name varchar(255) not null,
  lat double precision not null,
  lng double precision not null,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create sequence if not exists public.plants_pid_seq
  as bigint
  start with 1001
  increment by 1
  minvalue 1001;

update public.plants
set pid = nextval('public.plants_pid_seq')::text
where pid is null;

alter table public.plants
  alter column pid set not null,
  alter column created_at set default now(),
  alter column created_at set not null,
  alter column updated_at set default now(),
  alter column updated_at set not null;

create unique index if not exists plants_pid_unique on public.plants (pid);
create index if not exists idx_plants_pid on public.plants (pid);
create index if not exists idx_plants_user_id on public.plants (user_id);
create index if not exists idx_plants_created_at on public.plants (created_at);
create index if not exists idx_plants_name on public.plants (name);
create index if not exists idx_plants_category on public.plants (category);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'plants_lat_range'
  ) then
    alter table public.plants
      add constraint plants_lat_range check (lat between -90 and 90);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'plants_lng_range'
  ) then
    alter table public.plants
      add constraint plants_lng_range check (lng between -180 and 180);
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_plants_updated_at on public.plants;
create trigger set_plants_updated_at
before update on public.plants
for each row
execute function public.set_updated_at();

alter table public.plants enable row level security;

drop policy if exists "Plants are publicly readable" on public.plants;
drop policy if exists "Authenticated users can create their plants" on public.plants;
drop policy if exists "Users can update their plants" on public.plants;
drop policy if exists "Users can delete their plants" on public.plants;

create policy "Plants are publicly readable"
on public.plants
for select
to anon, authenticated
using (true);

create policy "Authenticated users can create their plants"
on public.plants
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their plants"
on public.plants
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their plants"
on public.plants
for delete
to authenticated
using (auth.uid() = user_id);

grant select on public.plants to anon;
grant select, insert, update, delete on public.plants to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'plants',
  'plants',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Plant images are publicly readable" on storage.objects;
drop policy if exists "Users can upload plant images" on storage.objects;
drop policy if exists "Users can update their plant images" on storage.objects;
drop policy if exists "Users can delete their plant images" on storage.objects;

create policy "Plant images are publicly readable"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'plants');

create policy "Users can upload plant images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'plants'
  and (storage.foldername(name))[1] = 'plants'
  and (storage.foldername(name))[2] = auth.uid()::text
);

create policy "Users can update their plant images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'plants'
  and (storage.foldername(name))[1] = 'plants'
  and (storage.foldername(name))[2] = auth.uid()::text
)
with check (
  bucket_id = 'plants'
  and (storage.foldername(name))[1] = 'plants'
  and (storage.foldername(name))[2] = auth.uid()::text
);

create policy "Users can delete their plant images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'plants'
  and (storage.foldername(name))[1] = 'plants'
  and (storage.foldername(name))[2] = auth.uid()::text
);
