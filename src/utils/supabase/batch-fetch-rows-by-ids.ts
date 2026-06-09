import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Fetches rows from a Supabase table by primary key `id` (deduped).
 *
 * @param supabase - Supabase client
 * @param table - Table name
 * @param ids - Row IDs to load
 * @param columns - PostgREST select fragment
 * @returns Map of id → row object
 */
export const batchFetchRowsByIds = async (
  supabase: SupabaseClient,
  table: string,
  ids: string[],
  columns: string,
): Promise<Map<string, Record<string, unknown>>> => {
  const uniqueIds = [...new Set(ids.map((id) => id.trim()).filter(Boolean))];
  const map = new Map<string, Record<string, unknown>>();
  if (uniqueIds.length === 0) return map;

  const { data, error } = await supabase.from(table).select(columns).in('id', uniqueIds);
  if (error) {
    throw new Error(error.message);
  }

  for (const row of data ?? []) {
    const record = row as unknown as Record<string, unknown>;
    map.set(String(record.id ?? ''), record);
  }

  return map;
};
