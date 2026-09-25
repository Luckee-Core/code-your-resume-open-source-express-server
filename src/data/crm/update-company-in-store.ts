import type { Company } from "./types";
import { requireCrmPgPool } from "./require-crm-pg-pool";
import { getCompanyFromSupabase } from "./supabase/get-company-from-supabase";
import { updateRows } from "../../utils/postgres";

/**
 * Updates an existing company row in Supabase CRM.
 */
export const updateCompanyInStore = async (
  id: string,
  patch: Partial<
    Pick<
      Company,
      | "name"
      | "website"
      | "notes"
      | "websiteUrls"
      | "playwrightWebsiteUrlDiscoveryAttempted"
      | "websiteResearchSummary"
      | "websiteResearchCompletedAt"
    >
  >,
): Promise<Company | null> => {
  const pool = requireCrmPgPool();
  const prev = await getCompanyFromSupabase(pool, id);
  if (!prev) {
    return null;
  }

  const next: Company = {
    ...prev,
    name: patch.name !== undefined ? patch.name.trim() : prev.name,
    website: patch.website !== undefined ? patch.website.trim() : prev.website,
    notes: patch.notes !== undefined ? patch.notes.trim() : prev.notes,
    websiteUrls: patch.websiteUrls !== undefined ? patch.websiteUrls : prev.websiteUrls,
    playwrightWebsiteUrlDiscoveryAttempted:
      patch.playwrightWebsiteUrlDiscoveryAttempted !== undefined
        ? patch.playwrightWebsiteUrlDiscoveryAttempted
        : prev.playwrightWebsiteUrlDiscoveryAttempted,
    websiteResearchSummary:
      patch.websiteResearchSummary !== undefined
        ? patch.websiteResearchSummary
        : prev.websiteResearchSummary,
    websiteResearchCompletedAt:
      patch.websiteResearchCompletedAt !== undefined
        ? patch.websiteResearchCompletedAt
        : prev.websiteResearchCompletedAt,
    updatedAt: new Date().toISOString(),
  };

  await updateRows(
    pool,
    "companies",
    {
      name: next.name,
      website: next.website,
      notes: next.notes,
      website_urls: next.websiteUrls,
      playwright_website_url_discovery_attempted: next.playwrightWebsiteUrlDiscoveryAttempted,
      website_research_summary: next.websiteResearchSummary,
      website_research_completed_at: next.websiteResearchCompletedAt.trim()
        ? next.websiteResearchCompletedAt
        : null,
      updated_at: next.updatedAt,
    },
    { id },
  );

  return next;
};
