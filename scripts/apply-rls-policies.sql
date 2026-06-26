-- Repeatable RLS policy script for Flora.
-- Run from the Supabase SQL editor after the plants table exists.
-- The default plant image bucket is "plants"; update the bucket_id values here
-- if SUPABASE_PLANT_IMAGES_BUCKET is changed.

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
