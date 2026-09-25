import { randomUUID } from "node:crypto";
import type { Company } from "./types";
import { requireCrmPgPool } from "./require-crm-pg-pool";
import { getCompanyFromSupabase } from "./supabase/get-company-from-supabase";
import { insertRow } from "../../utils/postgres";

/**
 * Inserts a new company row in Supabase CRM.
 */
export const createCompanyInStore = async (input: {
  name: string;
  website: string;
  notes: string;
}): Promise<Company> => {
  const pool = requireCrmPgPool();
  const id = randomUUID();
  const now = new Date().toISOString();
  await insertRow(pool, "companies", {
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

  const row = await getCompanyFromSupabase(pool, id);
  if (!row) {
    throw new Error("Failed to load company after insert");
  }
  return row;
};
