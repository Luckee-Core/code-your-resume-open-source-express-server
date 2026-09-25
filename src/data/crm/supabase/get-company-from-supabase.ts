import type { Pool } from "pg";
import type { Company } from "../types";
import { mapCompanyRow, type CompanyRow } from "./map-company-row";
import { selectOneFrom } from "../../../utils/postgres";

/**
 * Loads one company by id from Supabase.
 */
export const getCompanyFromSupabase = async (
  pool: Pool,
  id: string,
): Promise<Company | null> => {
  const data = await selectOneFrom<CompanyRow>(pool, "companies", {
    columns:
      "id, name, website, notes, website_urls, playwright_website_url_discovery_attempted, website_research_summary, website_research_completed_at, created_at, updated_at",
    eq: { id },
  });

  return data ? mapCompanyRow(data) : null;
};
