import type { SupabaseClient } from "@supabase/supabase-js";
import type { Company } from "../types";
import { mapCompanyRow } from "./map-company-row";

/**
 * Lists all companies from Supabase `companies` (newest `updated_at` first).
 */
export const listCompaniesFromSupabase = async (supabase: SupabaseClient): Promise<Company[]> => {
  const { data, error } = await supabase
    .from("companies")
    .select(
      "id, name, website, notes, website_urls, playwright_website_url_discovery_attempted, website_research_summary, website_research_completed_at, created_at, updated_at",
    )
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("❌ listCompaniesFromSupabase:", error.message);
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapCompanyRow(row));
};
