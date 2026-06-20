import { createClient } from '@/lib/supabase/server';
import type { MerchItem } from '@/lib/types/database.types';

export async function getMerchItems(): Promise<MerchItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('merch_items')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  return (data as MerchItem[] | null) ?? [];
}
