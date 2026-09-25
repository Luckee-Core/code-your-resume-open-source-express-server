import type { Pool } from 'pg';
import type { Company } from '../types';
import { mapCompanyRow, type CompanyRow } from './map-company-row';
import { selectRowsFrom } from '../../../utils/postgres';

const normalizeComparableText = (value: string): string =>
  value.trim().toLowerCase().replace(/\s+/g, ' ');

/**
 * Find a company by exact normalized name (case-insensitive).
 */
export const findCompanyByNameFromSupabase = async (
  pool: Pool,
  name: string
): Promise<Company | null> => {
  const target = normalizeComparableText(name);
  const rows = await selectRowsFrom<CompanyRow>(pool, 'companies', {
    columns:
      'id, name, website, notes, website_urls, playwright_website_url_discovery_attempted, website_research_summary, website_research_completed_at, created_at, updated_at',
  });

  const match = rows.find(
    (row) => normalizeComparableText(String(row.name ?? '')) === target
  );

  return match ? mapCompanyRow(match) : null;
};
