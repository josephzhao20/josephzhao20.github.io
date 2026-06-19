-- 0005_storage.sql
-- Storage buckets. Photos are public-read (it's a public map app) but only
-- writable by their owner, under a path that embeds the owner's uid so the
-- policy can check it without an extra join.
--   adventure-photos/{user_id}/{adventure_id}/{filename}
--   avatars/{user_id}/{filename}

insert into storage.buckets (id, name, public)
values ('adventure-photos', 'adventure-photos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- adventure-photos: public read
drop policy if exists "adventure_photos_public_read" on storage.objects;
create policy "adventure_photos_public_read"
  on storage.objects for select
  using (bucket_id = 'adventure-photos');

-- adventure-photos: owner-scoped write (path must start with their uid)
drop policy if exists "adventure_photos_owner_insert" on storage.objects;
create policy "adventure_photos_owner_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'adventure-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
    and exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.upload_approved = true and u.suspended = false
    )
  );

drop policy if exists "adventure_photos_owner_delete" on storage.objects;
create policy "adventure_photos_owner_delete"
  on storage.objects for delete
  using (
    bucket_id = 'adventure-photos'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or exists (select 1 from public.users u where u.id = auth.uid() and u.is_admin = true)
    )
  );

-- avatars: public read, owner-scoped write
drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "avatars_owner_write" on storage.objects;
create policy "avatars_owner_write"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatars_owner_update" on storage.objects;
create policy "avatars_owner_update"
  on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
