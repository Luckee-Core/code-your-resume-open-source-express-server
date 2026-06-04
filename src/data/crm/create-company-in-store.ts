import { randomUUID } from "node:crypto";
import type { Company } from "./types";
import { requireCrmSupabaseClient } from "./require-crm-supabase-client";
import { getCompanyFromSupabase } from "./supabase/get-company-from-supabase";

/**
 * Inserts a new company row in Supabase CRM.
 */
export const createCompanyInStore = async (input: {
  name: string;
  website: string;
  notes: string;
}): Promise<Company> => {
  const supabase = requireCrmSupabaseClient();
  const id = randomUUID();
  const now = new Date().toISOString();
  const { error } = await supabase.from("companies").insert({
    id,
    name: input.name.trim(),
    website: input.website.trim(),
    notes: input.notes.trim(),
    website_urls: [],
    playwright_website_url_discovery_attempted: false,
    website_research_summary: "",
    website_research_completed_at: null,
    created_at: now,
    updated_at: now,
  });

  if (error) {
    console.error("❌ createCompanyInStore:", error.message);
    throw new Error(error.message);
  }

  const row = await getCompanyFromSupabase(supabase, id);
  if (!row) {
    throw new Error("Failed to load company after insert");
  }
  return row;
};
