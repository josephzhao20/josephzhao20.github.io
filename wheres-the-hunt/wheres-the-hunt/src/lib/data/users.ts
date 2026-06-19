import { createClient } from '@/lib/supabase/server';
import type { UserRow, UserStatsRow } from '@/lib/types/database.types';

export async function getUserByUsername(username: string): Promise<UserRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('users')
    .select('*')
    .ilike('username', username)
    .single();
  return data ?? null;
}

export async function getUserStats(userId: string): Promise<UserStatsRow | null> {
  const supabase = await createClient();
  const { data } = await supabase.from('user_stats').select('*').eq('user_id', userId).single();
  return data ?? null;
}

export async function hasLiked(userId: string, adventureId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('adventure_id', adventureId)
    .maybeSingle();
  return !!data;
}

export async function getAllUsersForAdmin(): Promise<UserRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(300);
  return data ?? [];
}
