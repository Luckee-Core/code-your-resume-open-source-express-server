import type { SupabaseClient } from "@supabase/supabase-js";
import { websitesMatchForCompanyDedup } from "../../../utils/company/websites-match-for-company-dedup";
import type { Company } from "../types";
import { mapCompanyRow } from "./map-company-row";

/**
 * Find a company whose `website` hostname matches the given URL (normalized comparison).
 *
 * @param supabase - CRM Supabase client
 * @param websiteUrl - Company website URL to match
 */
export const findCompanyByWebsiteFromSupabase = async (
  supabase: SupabaseClient,
  websiteUrl: string,
): Promise<Company | null> => {
  const target = websiteUrl.trim();
  if (!target) {
    return null;
  }

  const { data, error } = await supabase
    .from("companies")
    .select(
      "id, name, website, notes, website_urls, playwright_website_url_discovery_attempted, website_research_summary, website_research_completed_at, created_at, updated_at",
    );

  if (error) {
    console.error("❌ findCompanyByWebsiteFromSupabase:", error.message);
    throw new Error(error.message);
  }

  const match = (data ?? []).find((row) =>
    websitesMatchForCompanyDedup(String(row.website ?? ""), target),
  );

  return match ? mapCompanyRow(match) : null;
};
