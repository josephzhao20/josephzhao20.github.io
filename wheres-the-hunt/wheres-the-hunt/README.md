# Where's The Hunt? 🧭

> Every pin tells a story.

A public, map-first adventure-sharing platform. Users upload trip-based photo
albums ("adventures") that are pinned to a global interactive map, with
privacy controls that range from an exact pin to "somewhere in this country."

Built with **Next.js 14 (App Router) + TypeScript + Supabase (Postgres, Auth,
Storage) + Leaflet/OpenStreetMap**.

---

## 1. What's actually wired up

This is a complete, working MVP — not a wireframe. Specifically:

- **Auth**: Supabase Auth (email/password) via `@supabase/ssr`, with a
  middleware that refreshes the session cookie on every request.
- **Database**: full Postgres schema, RLS policies, triggers, and views (see
  `supabase/migrations/`). A new `auth.users` row automatically gets a public
  `users` profile via trigger.
- **Roles**: public (no login) → registered → approved uploader → admin,
  enforced **twice** — once in Postgres RLS (the real boundary) and once in
  the route handlers (for friendly error messages).
- **Map**: React-Leaflet + OpenStreetMap tiles, marker clustering, custom
  compass-pin markers, popup cards, and a toggleable country-level heatmap.
- **Upload flow**: EXIF GPS extraction (`exifr`) → reverse geocoding →
  manual override via search or click-to-pin → privacy-mode-aware
  randomization → direct-to-Supabase-Storage upload → adventure creation.
- **Privacy modes**: `exact | region | country | hidden`, with real
  coordinates always preserved separately from the randomized "display"
  coordinates the map actually renders (see "Location system" below).
- **Heatmaps**: global community heatmap and per-user profile heatmap, both
  backed by a `country_heatmap` / `user_country_heatmap` SQL view.
- **Admin dashboard**: approve/revoke upload permission, suspend/unsuspend
  users, feature/unfeature and delete adventures.
- **Likes**: optimistic-UI like button, backed by a unique `(user_id,
  adventure_id)` constraint.

I verified this by actually running `npm install`, `tsc --noEmit`, and
`next build` against the real dependency tree — not just writing code that
looks right. All TypeScript types are checked end-to-end against the real
Supabase client generics (more on a tricky version gotcha below).

---

## 2. Project structure

```
src/
  app/                      # Next.js App Router pages + API routes
    page.tsx                # Home (hero, embedded map, featured, mission)
    map/page.tsx            # Full-screen map
    upload/page.tsx         # Upload flow (gatekept by role)
    adventures/[id]/page.tsx
    profile/[username]/page.tsx
    admin/page.tsx
    login/ signup/ auth/callback/
    api/                    # Route handlers (REST-ish JSON API)
  components/
    map/                    # Leaflet map, markers, heatmap, location picker
    adventure/               # Card, gallery, like button, privacy selector
    upload/                  # Upload form + request-access button
    admin/                  # Admin tables
    layout/  ui/  auth/  profile/
  lib/
    supabase/               # browser / server / admin / middleware clients
    auth/roles.ts           # requireUser / requireUploader / requireAdmin
    geo/                    # randomize.ts (privacy math), geocode.ts (Nominatim)
    exif/extractGps.ts      # client-side EXIF GPS extraction
    data/                   # server-side data-access functions
    types/                  # Database types + app-level types
  data/country-bounds.ts    # bounding boxes for "country" privacy mode
supabase/migrations/        # SQL, run in order 0001 → 0005
```

---

## 3. Location system (how privacy actually works)

**Resolution priority** (`components/upload/UploadForm.tsx`):

1. **Manual** — if the person searches a place or clicks/drags the map pin,
   that always wins and is sticky for the rest of the session.
2. **EXIF GPS** — if no manual pick yet, GPS pulled from the first photo with
   embedded location data seeds the pin.
3. **Geocoder fallback** — if neither exists, the person must search for a
   place before submitting (the form blocks submission otherwise).

**Privacy modes** (`lib/geo/randomize.ts`):

| Mode      | What's stored as `display_lat/lng`                                   |
|-----------|------------------------------------------------------------------------|
| `exact`   | The real coordinates, unchanged.                                      |
| `region`  | A point randomized within an ~80 km disc around the real point. There's no bundled state/province polygon dataset in this MVP, so "region" is approximated rather than snapped to an administrative boundary — documented in code as a known simplification. |
| `country` | A uniformly random point inside that country's bounding box (table in `src/data/country-bounds.ts`, ~70 countries; unlisted countries fall back to a 250 km jitter disc). |
| `hidden`  | No `display_lat/lng` at all — the map never sees a coordinate, only the owner's profile shows the adventure. |

`real_latitude/longitude` are written once at creation and never touched
again. Only `display_latitude/longitude` change when privacy mode changes.

---

## 4. Setup

### 4.1 Create the Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run the files in `supabase/migrations/` **in order**
   (0001 → 0005), or link the project and run `supabase db push` with the
   Supabase CLI.
3. Confirm the `adventure-photos` and `avatars` storage buckets exist
   (created by `0005_storage.sql`) and are marked public.

### 4.2 Configure environment variables

```bash
cp .env.example .env.local
```

Fill in:

- **`NEXT_PUBLIC_SUPABASE_URL`** — in the Supabase dashboard, open your
  project, then **Settings → API Keys**. Your project URL
  (`https://<project-ref>.supabase.co`) is shown at the top of that page (and
  also in the **Connect** button at the top of the project, if you'd rather
  grab it from there).

- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** and **`SUPABASE_SERVICE_ROLE_KEY`** —
  same **Settings → API Keys** page. Supabase is in the middle of replacing
  the old JWT `anon` / `service_role` keys with new `publishable` /
  `secret` keys, so what you see depends on when your project was created:

  - **If you see an "API Keys" tab with `Publishable key` and `Secret keys`
    sections** (new projects, and any project that's opted in): copy the
    **Publishable key** (`sb_publishable_...`) into
    `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and a **Secret key**
    (`sb_secret_...`) into `SUPABASE_SERVICE_ROLE_KEY`. If no secret key
    exists yet, click **Create new API Keys** first. These are drop-in
    replacements — the code in this repo doesn't care which key style you
    use, only that the publishable one is safe for the browser and the
    secret one never is.
  - **If you see a "Legacy API Keys" tab instead**: copy the **`anon`
    `public`** key into `NEXT_PUBLIC_SUPABASE_ANON_KEY` and the
    **`service_role`** key into `SUPABASE_SERVICE_ROLE_KEY`. These still
    work today, but Supabase has said legacy keys will eventually be
    removed — if your project offers the option to migrate to the new key
    system, it's worth doing sooner rather than later.

  Either way: **`SUPABASE_SERVICE_ROLE_KEY` (or its `sb_secret_...`
  equivalent) is server-only — never put it behind `NEXT_PUBLIC_`, never
  commit it, never send it to the browser.** It powers the admin actions
  (approve, suspend, feature, delete) by deliberately bypassing RLS, but
  only after the route handler has independently verified the caller is an
  admin (see `lib/auth/roles.ts`).

- **`NOMINATIM_CONTACT_EMAIL`** — this one isn't from Supabase at all. It's
  just your own email address, sent in the `User-Agent` header on requests
  to OpenStreetMap's free Nominatim geocoder, per their
  [usage policy](https://operations.osmfoundation.org/policies/nominatim/).
  Any address you'd be okay with OSM contacting if your app sends them
  unusually heavy traffic is fine.

### 4.3 Install and run

```bash
npm install
npm run dev
```

### 4.4 Make yourself an admin

There's no UI for the very first admin (chicken-and-egg problem by design —
admin can't self-promote through the app). After signing up once:

```sql
update public.users set is_admin = true where username = 'your_username';
```

---

## 5. Deployment (Vercel + Supabase)

1. Push this repo to GitHub.
2. In Vercel: **New Project** → import the repo.
3. Add the same environment variables from `.env.local` in
   **Project Settings → Environment Variables**.
4. Set `NEXT_PUBLIC_SITE_URL` to your real production URL (used for the
   email-confirmation redirect).
5. In Supabase → **Authentication → URL Configuration**, add your production
   URL plus `/auth/callback` to the redirect allow-list.
6. Deploy. Supabase Storage and Postgres are already hosted — there's
   nothing else to provision.

---

## 6. Notable implementation decisions (and a real gotcha I hit)

- **Uploads go straight from the browser to Supabase Storage**, not through
  a Next.js API route. This avoids serverless body-size limits and is the
  pattern Supabase's own docs recommend; security is enforced by a storage
  policy that requires the upload path to start with the uploader's own
  `auth.uid()` (see `0005_storage.sql`), not by trusting the client.
- **Admin writes use the service-role client deliberately.** A Postgres
  trigger (`0002_triggers.sql`) blocks any *ordinary* update to
  `is_admin` / `upload_approved` / `suspended` — even from the row's own
  owner — unless the request runs as `service_role`. The admin API routes
  call `requireAdmin()` first (checked against the *caller's* normal
  session), then perform the actual write with the service-role client.
  Two independent checks for one sensitive action.
- **A real version-compatibility bug, for the record**: `@supabase/ssr`
  pinned below `0.12.x` ships a `createServerClient` type signature that's
  stale against `@supabase/supabase-js` ^2.45 (which added extra generic
  parameters to `SupabaseClient` for Postgrest-version feature detection).
  The mismatch doesn't fail at runtime, but it silently collapses every
  `.insert()` / `.update()` argument type to `never` — so every database
  write in the app would have looked broken under `tsc --noEmit` despite
  Postgres being completely fine. `package.json` here pins
  `@supabase/ssr@^0.12.0` to avoid it. If you bump `supabase-js` later and
  start seeing `Argument of type '{...}' is not assignable to parameter of
  type 'never'` everywhere, this is almost certainly why.
- **Heatmap polygons are fetched client-side from a public country-boundary
  GeoJSON** (`datasets/geo-countries` on GitHub) rather than bundled, to keep
  the repo light. It's cached in memory for the session after first load.
- **`region` privacy mode is a documented approximation** (radius jitter, not
  a real state/province polygon) — see section 3. Swapping in a proper
  admin-boundary dataset later is a drop-in replacement inside
  `resolveDisplayCoordinates`.

---

## 7. Explicitly out of scope (per the brief)

Comments, a 3D globe view, messaging, trip collaboration, and paid tiers are
intentionally not built. The schema and component structure don't preclude
adding them later.
