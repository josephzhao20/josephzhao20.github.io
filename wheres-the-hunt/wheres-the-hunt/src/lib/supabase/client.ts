'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/types/database.types';

/**
 * Client-component Supabase client. Safe to call repeatedly — it's cheap and
 * @supabase/ssr de-dupes the underlying connection.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
