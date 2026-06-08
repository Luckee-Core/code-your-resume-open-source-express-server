import type { SupabaseClient } from '@supabase/supabase-js';
import type { Company } from '../types';
import { mapCompanyRow } from './map-company-row';

const normalizeComparableText = (value: string): string =>
  value.trim().toLowerCase().replace(/\s+/g, ' ');

/**
 * Find a company by exact normalized name (case-insensitive).
 */
export const findCompanyByNameFromSupabase = async (
  supabase: SupabaseClient,
  name: string
): Promise<Company | null> => {
  const target = normalizeComparableText(name);
  const { data, error } = await supabase
    .from('companies')
    .select(
      'id, name, website, notes, website_urls, playwright_website_url_discovery_attempted, website_research_summary, website_research_completed_at, created_at, updated_at',
    );

  if (error) {
    console.error('❌ findCompanyByNameFromSupabase:', error.message);
    throw new Error(error.message);
  }

  const match = (data ?? []).find(
    (row) => normalizeComparableText(String(row.name ?? '')) === target
  );

  return match ? mapCompanyRow(match) : null;
};
