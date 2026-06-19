-- 0004_views.sql
-- Read-optimized views. Views inherit RLS from their underlying tables via
-- security_invoker, so they stay public-read / no-extra-exposure.

-- Adventures with denormalized like_count and photo_count, joined with the
-- author's public username. This is what the map, the adventure cards, and
-- the detail page should select from instead of raw `adventures`.
create or replace view public.adventures_with_stats
  with (security_invoker = true) as
select
  a.*,
  u.username,
  u.avatar_url as user_avatar_url,
  coalesce(l.like_count, 0) as like_count,
  coalesce(p.photo_count, 0) as photo_count
from public.adventures a
join public.users u on u.id = a.user_id
left join (
  select adventure_id, count(*) as like_count
  from public.likes
  group by adventure_id
) l on l.adventure_id = a.id
left join (
  select adventure_id, count(*) as photo_count
  from public.adventure_photos
  group by adventure_id
) p on p.adventure_id = a.id;

-- Global community heatmap: adventure count per country. Excludes nothing —
-- even 'hidden' adventures contribute to the *country-level* aggregate count
-- (no precise location is ever exposed), matching "global community
-- heatmap" intent without leaking a hidden adventure's pin.
create or replace view public.country_heatmap
  with (security_invoker = true) as
select
  country_code,
  country,
  count(*) as adventure_count
from public.adventures
where country_code is not null
group by country_code, country;

-- Per-user heatmap: which countries a given user has adventures in, plus
-- counts, used to color their profile map.
create or replace view public.user_country_heatmap
  with (security_invoker = true) as
select
  user_id,
  country_code,
  country,
  count(*) as adventure_count
from public.adventures
where country_code is not null
group by user_id, country_code, country;

-- Per-user profile stats: countries visited, total adventures, total photos.
create or replace view public.user_stats
  with (security_invoker = true) as
select
  u.id as user_id,
  count(distinct a.id) as total_adventures,
  count(distinct a.country_code) as countries_visited,
  coalesce(sum(p.photo_count), 0) as total_photos
from public.users u
left join public.adventures a on a.user_id = u.id
left join (
  select adventure_id, count(*) as photo_count
  from public.adventure_photos
  group by adventure_id
) p on p.adventure_id = a.id
group by u.id;
