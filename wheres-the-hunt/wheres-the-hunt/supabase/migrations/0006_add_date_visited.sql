-- Add date_visited to adventures so users can record when a trip happened
-- (separate from created_at which is the upload date)
alter table public.adventures
  add column if not exists date_visited date null;
