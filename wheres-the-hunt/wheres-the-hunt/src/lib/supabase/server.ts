import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { Database } from '@/lib/types/database.types';

/**
 * Server-side Supabase client bound to the request's auth cookies.
 * Use this in Server Components, Route Handlers, and Server Actions.
 *
 * In a Server Component, `cookies().set()` will throw (Next.js forbids
 * mutating cookies during render) — that's expected and harmless as long as
 * a middleware refreshes the session on navigation (see middleware.ts).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — the middleware handles
            // refreshing the session instead. Safe to ignore.
          }
        },
      },
    }
  );
}

/**
 * Admin client using the service-role key. This BYPASSES Row Level Security
 * — only call it from trusted server-side code (route handlers / server
 * actions) after you've independently verified the caller is an admin.
 * NEVER import this from a client component or expose the key to the browser.
 */
export function createAdminClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          /* no-op: the admin client doesn't manage a user session */
        },
      },
    }
  );
}
