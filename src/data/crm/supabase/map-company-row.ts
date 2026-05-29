import type { Company } from "../types";
import { normalizeCompany } from "../normalize-company";
import { toIsoTimestampString } from "../../../utils/crm/to-iso-timestamp-string";

type CompanyRow = {
  id: string;
  name: string;
  website: string | null;
  notes: string | null;
  website_urls: unknown;
  playwright_website_url_discovery_attempted: boolean | null;
  website_research_summary: string | null;
  website_research_completed_at: string | null;
  created_at: string;
  updated_at: string;
};

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
};

/**
 * Maps a Supabase `companies` row to the CRM `Company` type.
 */
export const mapCompanyRow = (row: CompanyRow): Company => {
  return normalizeCompany({
    id: row.id,
    name: row.name,
    website: row.website ?? "",
    notes: row.notes ?? "",
    websiteUrls: toStringArray(row.website_urls),
    playwrightWebsiteUrlDiscoveryAttempted: row.playwright_website_url_discovery_attempted ?? false,
    websiteResearchSummary: row.website_research_summary ?? "",
    websiteResearchCompletedAt: toIsoTimestampString(row.website_research_completed_at),
    createdAt: toIsoTimestampString(row.created_at),
    updatedAt: toIsoTimestampString(row.updated_at),
  });
};
