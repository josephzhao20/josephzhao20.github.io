import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const BASE = 'https://josephzhao20-github-io.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data: adventures } = await supabase
    .from('adventures')
    .select('id, updated_at')
    .neq('privacy_mode', 'hidden');

  const adventureUrls: MetadataRoute.Sitemap = (adventures ?? []).map((a) => ({
    url: `${BASE}/adventures/${a.id}`,
    lastModified: new Date(a.updated_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/map`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/merch`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...adventureUrls,
  ];
}
