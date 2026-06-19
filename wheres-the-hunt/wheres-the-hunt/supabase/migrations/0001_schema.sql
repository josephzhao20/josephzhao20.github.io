-- 0001_schema.sql
-- Where's The Hunt? — core schema
-- Run via Supabase CLI: supabase db push
-- or paste into the Supabase SQL editor in order (0001 -> 0004).

create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ──────────────────────────────────────────────────────────────────────────
-- Enums
-- ──────────────────────────────────────────────────────────────────────────

do $$ begin
  create type privacy_mode as enum ('exact', 'region', 'country', 'hidden');
exception when duplicate_object then null;
end $$;

-- ──────────────────────────────────────────────────────────────────────────
-- users  (public profile, 1:1 with auth.users)
-- ──────────────────────────────────────────────────────────────────────────

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  username text not null unique,
  avatar_url text,
  bio text,
  is_admin boolean not null default false,
  upload_approved boolean not null default false,
  upload_requested boolean not null default false,
  suspended boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists users_username_idx on public.users (lower(username));

-- ──────────────────────────────────────────────────────────────────────────
-- adventures  (a trip; one pin, many photos)
-- ──────────────────────────────────────────────────────────────────────────

create table if not exists public.adventures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  description text check (char_length(description) <= 2000),
  cover_image_url text,
  privacy_mode privacy_mode not null default 'exact',

  -- ground truth — never shown to the client, never randomized
  real_latitude double precision not null,
  real_longitude double precision not null,

  -- what the map actually renders — randomized per privacy_mode
  display_latitude double precision,
  display_longitude double precision,

  country text,
  country_code text, -- ISO 3166-1 alpha-2, used for heatmap joins
  region text,

  is_featured boolean not null default false,
  featured_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists adventures_user_id_idx on public.adventures (user_id);
create index if not exists adventures_country_code_idx on public.adventures (country_code);
create index if not exists adventures_featured_idx on public.adventures (is_featured) where is_featured;
create index if not exists adventures_created_at_idx on public.adventures (created_at desc);

-- ──────────────────────────────────────────────────────────────────────────
-- adventure_photos
-- ──────────────────────────────────────────────────────────────────────────

create table if not exists public.adventure_photos (
  id uuid primary key default gen_random_uuid(),
  adventure_id uuid not null references public.adventures (id) on delete cascade,
  image_url text not null,
  sort_order int not null default 0,
  exif_latitude double precision,
  exif_longitude double precision,
  created_at timestamptz not null default now()
);

create index if not exists adventure_photos_adventure_id_idx on public.adventure_photos (adventure_id);

-- ──────────────────────────────────────────────────────────────────────────
-- likes
-- ──────────────────────────────────────────────────────────────────────────

create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  adventure_id uuid not null references public.adventures (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, adventure_id)
);

create index if not exists likes_adventure_id_idx on public.likes (adventure_id);
create index if not exists likes_user_id_idx on public.likes (user_id);

-- ──────────────────────────────────────────────────────────────────────────
-- updated_at trigger for adventures
-- ──────────────────────────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists adventures_set_updated_at on public.adventures;
create trigger adventures_set_updated_at
  before update on public.adventures
  for each row execute function public.set_updated_at();
