import type { Pool } from "pg";
import type { Company } from "../types";
import { mapCompanyRow, type CompanyRow } from "./map-company-row";
import { selectRowsFrom } from "../../../utils/postgres";

/**
 * Lists all companies from Supabase `companies` (newest `updated_at` first).
 */
export const listCompaniesFromSupabase = async (pool: Pool): Promise<Company[]> => {
  const rows = await selectRowsFrom<CompanyRow>(pool, "companies", {
    columns:
      "id, name, website, notes, website_urls, playwright_website_url_discovery_attempted, website_research_summary, website_research_completed_at, created_at, updated_at",
    order: [{ column: "updated_at", ascending: false }],
  });

  return rows.map((row) => mapCompanyRow(row));
};
