-- 0003_rls.sql
-- Row Level Security. Public read access matches the product's "no login
-- required to browse" model; writes are locked down per role.

alter table public.users enable row level security;
alter table public.adventures enable row level security;
alter table public.adventure_photos enable row level security;
alter table public.likes enable row level security;

-- ──────────────────────────────────────────────────────────────────────────
-- users
-- ──────────────────────────────────────────────────────────────────────────

drop policy if exists "users_select_public" on public.users;
create policy "users_select_public"
  on public.users for select
  using (true);

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
-- note: the privileged-column trigger (0002) blocks self-escalation even
-- though this policy allows the row-level update.

-- ──────────────────────────────────────────────────────────────────────────
-- adventures
-- privacy_mode = 'hidden' still allows the row to be read (it must appear on
-- the owner's profile) — the *map* simply never queries display coordinates
-- for hidden adventures. See lib/geo for enforcement on the read side.
-- ──────────────────────────────────────────────────────────────────────────

drop policy if exists "adventures_select_public" on public.adventures;
create policy "adventures_select_public"
  on public.adventures for select
  using (true);

drop policy if exists "adventures_insert_approved" on public.adventures;
create policy "adventures_insert_approved"
  on public.adventures for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.users u
      where u.id = auth.uid()
        and u.upload_approved = true
        and u.suspended = false
    )
  );

drop policy if exists "adventures_update_own" on public.adventures;
create policy "adventures_update_own"
  on public.adventures for update
  using (
    auth.uid() = user_id
    or exists (select 1 from public.users u where u.id = auth.uid() and u.is_admin = true)
  );

drop policy if exists "adventures_delete_own_or_admin" on public.adventures;
create policy "adventures_delete_own_or_admin"
  on public.adventures for delete
  using (
    auth.uid() = user_id
    or exists (select 1 from public.users u where u.id = auth.uid() and u.is_admin = true)
  );

-- ──────────────────────────────────────────────────────────────────────────
-- adventure_photos
-- ──────────────────────────────────────────────────────────────────────────

drop policy if exists "photos_select_public" on public.adventure_photos;
create policy "photos_select_public"
  on public.adventure_photos for select
  using (true);

drop policy if exists "photos_insert_owner" on public.adventure_photos;
create policy "photos_insert_owner"
  on public.adventure_photos for insert
  with check (
    exists (
      select 1 from public.adventures a
      where a.id = adventure_id and a.user_id = auth.uid()
    )
  );

drop policy if exists "photos_delete_owner_or_admin" on public.adventure_photos;
create policy "photos_delete_owner_or_admin"
  on public.adventure_photos for delete
  using (
    exists (
      select 1 from public.adventures a
      where a.id = adventure_id
        and (a.user_id = auth.uid()
             or exists (select 1 from public.users u where u.id = auth.uid() and u.is_admin = true))
    )
  );

-- ──────────────────────────────────────────────────────────────────────────
-- likes
-- ──────────────────────────────────────────────────────────────────────────

drop policy if exists "likes_select_public" on public.likes;
create policy "likes_select_public"
  on public.likes for select
  using (true);

drop policy if exists "likes_insert_own" on public.likes;
create policy "likes_insert_own"
  on public.likes for insert
  with check (auth.uid() = user_id);

drop policy if exists "likes_delete_own" on public.likes;
create policy "likes_delete_own"
  on public.likes for delete
  using (auth.uid() = user_id);
