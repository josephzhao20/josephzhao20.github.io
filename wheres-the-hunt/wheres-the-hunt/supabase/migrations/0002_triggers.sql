-- 0002_triggers.sql
-- Auto-provisioning + column-level protection.

-- ──────────────────────────────────────────────────────────────────────────
-- When a new auth.users row is created, mirror it into public.users.
-- Username defaults to the local part of the email; the user can change it
-- later. Falls back to a short random suffix on collision.
-- ──────────────────────────────────────────────────────────────────────────

create or replace function public.handle_new_auth_user()
returns trigger as $$
declare
  base_username text;
  final_username text;
  attempt int := 0;
begin
  base_username := lower(regexp_replace(split_part(new.email, '@', 1), '[^a-zA-Z0-9_]', '', 'g'));
  if base_username is null or base_username = '' then
    base_username := 'explorer';
  end if;

  final_username := base_username;
  while exists (select 1 from public.users where lower(username) = lower(final_username)) loop
    attempt := attempt + 1;
    final_username := base_username || attempt::text;
  end loop;

  insert into public.users (id, email, username)
  values (new.id, new.email, final_username);

  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- ──────────────────────────────────────────────────────────────────────────
-- Prevent ordinary users from granting themselves admin / upload approval /
-- un-suspending themselves. Only the service role (which bypasses RLS *and*
-- this trigger, since it runs as a separate check) or an existing admin
-- acting through the admin API may change these columns. The admin API uses
-- the service-role key server-side, which sets a session var we check here.
-- ──────────────────────────────────────────────────────────────────────────

create or replace function public.protect_privileged_user_columns()
returns trigger as $$
begin
  if auth.role() = 'service_role' then
    return new; -- server-side admin actions go through the service role
  end if;

  if new.is_admin is distinct from old.is_admin
     or new.upload_approved is distinct from old.upload_approved
     or new.suspended is distinct from old.suspended then
    raise exception 'Only admins may change is_admin, upload_approved, or suspended';
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists users_protect_privileged_columns on public.users;
create trigger users_protect_privileged_columns
  before update on public.users
  for each row execute function public.protect_privileged_user_columns();
