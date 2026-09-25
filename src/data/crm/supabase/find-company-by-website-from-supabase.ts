import type { Pool } from "pg";
import { websitesMatchForCompanyDedup } from "../../../utils/company/websites-match-for-company-dedup";
import type { Company } from "../types";
import { mapCompanyRow, type CompanyRow } from "./map-company-row";
import { selectRowsFrom } from "../../../utils/postgres";

/**
 * Find a company whose `website` hostname matches the given URL (normalized comparison).
 *
 * @param pool - CRM Postgres pool
 * @param websiteUrl - Company website URL to match
 */
export const findCompanyByWebsiteFromSupabase = async (
  pool: Pool,
  websiteUrl: string,
): Promise<Company | null> => {
  const target = websiteUrl.trim();
  if (!target) {
    return null;
  }

  const rows = await selectRowsFrom<CompanyRow>(pool, "companies", {
    columns:
      "id, name, website, notes, website_urls, playwright_website_url_discovery_attempted, website_research_summary, website_research_completed_at, created_at, updated_at",
  });

  const match = rows.find((row) =>
    websitesMatchForCompanyDedup(String(row.website ?? ""), target),
  );

  return match ? mapCompanyRow(match) : null;
};
