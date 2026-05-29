import type { Job } from "../types";
import { normalizeJob } from "../normalize-job";
import { toIsoTimestampString } from "../../../utils/crm/to-iso-timestamp-string";

type JobRow = {
  id: string;
  company_id: string;
  title: string;
  url: string | null;
  status: string | null;
  description: string | null;
  listing_imported_at: string | null;
  latest_scrape_run_id: string | null;
  latest_ai_exchange_id: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Maps a Supabase `jobs` row to the CRM `Job` type (bullet rows loaded separately).
 */
export const mapJobRow = (row: JobRow): Job => {
  return normalizeJob({
    id: row.id,
    companyId: row.company_id,
    type: "job",
    title: row.title,
    url: row.url ?? "",
    status: row.status ?? "draft",
    description: row.description ?? "",
    listingImportedAt: toIsoTimestampString(row.listing_imported_at),
    latestScrapeRunId: row.latest_scrape_run_id ?? "",
    latestAiExchangeId: row.latest_ai_exchange_id ?? "",
    responsibilities: [],
    requirements: [],
    niceToHaves: [],
    createdAt: toIsoTimestampString(row.created_at),
    updatedAt: toIsoTimestampString(row.updated_at),
  });
};
