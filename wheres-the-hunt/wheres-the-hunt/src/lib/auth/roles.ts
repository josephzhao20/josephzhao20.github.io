import { createClient } from '@/lib/supabase/server';
import type { UserRow } from '@/lib/types/database.types';

/** Current authenticated user's profile row, or null if signed out. */
export async function getCurrentProfile(): Promise<UserRow | null> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', auth.user.id)
    .single();

  return profile ?? null;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

/** Throws AuthError if there's no signed-in, non-suspended user. */
export async function requireUser(): Promise<UserRow> {
  const profile = await getCurrentProfile();
  if (!profile) throw new AuthError('You need to be signed in to do that.', 401);
  if (profile.suspended) throw new AuthError('Your account has been suspended.', 403);
  return profile;
}

/** Throws AuthError if the signed-in user isn't an approved uploader. */
export async function requireUploader(): Promise<UserRow> {
  const profile = await requireUser();
  if (!profile.upload_approved) {
    throw new AuthError('You need upload permission to create adventures.', 403);
  }
  return profile;
}

/** Throws AuthError if the signed-in user isn't an admin. */
export async function requireAdmin(): Promise<UserRow> {
  const profile = await requireUser();
  if (!profile.is_admin) throw new AuthError('Admins only.', 403);
  return profile;
}
