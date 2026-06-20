import { createClient } from '@/lib/supabase/server';
import { toMapPin, type MapPin } from '@/lib/types';
import type { AdventureWithStats, CountryHeatmapRow } from '@/lib/types/database.types';

export async function getMapPins(): Promise<MapPin[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('adventures_with_stats')
    .select('*')
    .neq('privacy_mode', 'hidden')
    .order('created_at', { ascending: false })
    .limit(500);

  return ((data as AdventureWithStats[] | null) ?? [])
    .map(toMapPin)
    .filter((p): p is MapPin => p !== null);
}

export async function getFeaturedAdventures(limit = 6): Promise<AdventureWithStats[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('adventures_with_stats')
    .select('*')
    .eq('is_featured', true)
    .order('featured_at', { ascending: false })
    .limit(limit);

  return (data as AdventureWithStats[] | null) ?? [];
}

/** Featured story spotlight: admin-featured overrides, else most-liked in last 90 days. */
export async function getSpotlightStory(): Promise<AdventureWithStats | null> {
  const supabase = await createClient();

  // Admin-featured first
  const { data: adminFeatured } = await supabase
    .from('adventures_with_stats')
    .select('*')
    .eq('is_featured', true)
    .neq('privacy_mode', 'hidden')
    .order('featured_at', { ascending: false })
    .limit(1)
    .single();

  if (adminFeatured) return adminFeatured as AdventureWithStats;

  // Fallback: most-liked in last 90 days
  const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  const { data: topLiked } = await supabase
    .from('adventures_with_stats')
    .select('*')
    .neq('privacy_mode', 'hidden')
    .gte('created_at', since)
    .order('like_count', { ascending: false })
    .limit(1)
    .single();

  return (topLiked as AdventureWithStats | null) ?? null;
}

export async function getRecentStories(limit = 6): Promise<AdventureWithStats[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('adventures_with_stats')
    .select('*')
    .neq('privacy_mode', 'hidden')
    .order('created_at', { ascending: false })
    .limit(limit);

  return (data as AdventureWithStats[] | null) ?? [];
}

export async function getTopStoriesLast3Months(limit = 5): Promise<AdventureWithStats[]> {
  const supabase = await createClient();
  const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  const { data } = await supabase
    .from('adventures_with_stats')
    .select('*')
    .neq('privacy_mode', 'hidden')
    .gte('created_at', since)
    .order('like_count', { ascending: false })
    .limit(limit);

  return (data as AdventureWithStats[] | null) ?? [];
}

export async function searchStories(query: string, limit = 30): Promise<AdventureWithStats[]> {
  const supabase = await createClient();
  const q = `%${query.trim()}%`;
  const { data } = await supabase
    .from('adventures_with_stats')
    .select('*')
    .neq('privacy_mode', 'hidden')
    .or(`title.ilike.${q},description.ilike.${q}`)
    .order('created_at', { ascending: false })
    .limit(limit);

  return (data as AdventureWithStats[] | null) ?? [];
}

export async function getAllStories(limit = 50): Promise<AdventureWithStats[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('adventures_with_stats')
    .select('*')
    .neq('privacy_mode', 'hidden')
    .order('created_at', { ascending: false })
    .limit(limit);

  return (data as AdventureWithStats[] | null) ?? [];
}

export async function getGlobalHeatmap(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data } = await supabase.from('country_heatmap').select('*');

  const counts: Record<string, number> = {};
  ((data as CountryHeatmapRow[] | null) ?? []).forEach((row) => {
    counts[row.country_code] = row.adventure_count;
  });
  return counts;
}

export async function getUserHeatmap(userId: string): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('user_country_heatmap')
    .select('*')
    .eq('user_id', userId);

  const counts: Record<string, number> = {};
  (data ?? []).forEach((row) => {
    counts[row.country_code] = row.adventure_count;
  });
  return counts;
}

export async function getAdventureWithStats(id: string): Promise<AdventureWithStats | null> {
  const supabase = await createClient();
  const { data } = await supabase.from('adventures_with_stats').select('*').eq('id', id).single();
  return (data as AdventureWithStats | null) ?? null;
}

export async function getUserAdventures(userId: string): Promise<AdventureWithStats[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('adventures_with_stats')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return (data as AdventureWithStats[] | null) ?? [];
}

export async function getAllAdventuresForAdmin(): Promise<AdventureWithStats[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('adventures_with_stats')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  return (data as AdventureWithStats[] | null) ?? [];
}
