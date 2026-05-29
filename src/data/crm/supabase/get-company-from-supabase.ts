import type { SupabaseClient } from "@supabase/supabase-js";
import type { Company } from "../types";
import { mapCompanyRow } from "./map-company-row";

/**
 * Loads one company by id from Supabase.
 */
export const getCompanyFromSupabase = async (
  supabase: SupabaseClient,
  id: string,
): Promise<Company | null> => {
  const { data, error } = await supabase
    .from("companies")
    .select(
      "id, name, website, notes, website_urls, playwright_website_url_discovery_attempted, website_research_summary, website_research_completed_at, created_at, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("❌ getCompanyFromSupabase:", error.message);
    throw new Error(error.message);
  }

  return data ? mapCompanyRow(data) : null;
};
