import type { Job } from "./types";
import { isJobStatus } from "./is-job-status";
import { requireCrmPgPool } from "./require-crm-pg-pool";
import { getJobFromSupabase } from "./supabase/get-job-from-supabase";
import { updateRows } from "../../utils/postgres";

/**
 * Updates an existing job row in Supabase CRM.
 */
export const updateJobInStore = async (
  id: string,
  patch: Partial<
    Pick<
      Job,
      | "companyId"
      | "type"
      | "title"
      | "url"
      | "status"
      | "description"
      | "listingImportedAt"
      | "latestScrapeRunId"
      | "latestAiExchangeId"
    >
  >,
): Promise<Job | null> => {
  const pool = requireCrmPgPool();
  const prev = await getJobFromSupabase(pool, id);
  if (!prev) {
    return null;
  }

  const status =
    patch.status !== undefined && isJobStatus(patch.status) ? patch.status : prev.status;
  const next: Job = {
    ...prev,
    companyId: patch.companyId !== undefined ? patch.companyId : prev.companyId,
    type: patch.type !== undefined ? patch.type : prev.type,
    title: patch.title !== undefined ? patch.title.trim() : prev.title,
    url: patch.url !== undefined ? patch.url.trim() : prev.url,
    status,
    description: patch.description !== undefined ? patch.description : prev.description,
    listingImportedAt:
      patch.listingImportedAt !== undefined ? patch.listingImportedAt : prev.listingImportedAt,
    latestScrapeRunId:
      patch.latestScrapeRunId !== undefined ? patch.latestScrapeRunId : prev.latestScrapeRunId,
    latestAiExchangeId:
      patch.latestAiExchangeId !== undefined ? patch.latestAiExchangeId : prev.latestAiExchangeId,
    updatedAt: new Date().toISOString(),
  };

  await updateRows(
    pool,
    "jobs",
    {
      company_id: next.companyId,
      title: next.title,
      url: next.url,
      status: next.status,
      description: next.description,
      listing_imported_at: next.listingImportedAt.trim() ? next.listingImportedAt : null,
      latest_scrape_run_id: next.latestScrapeRunId.trim() ? next.latestScrapeRunId : null,
      latest_ai_exchange_id: next.latestAiExchangeId.trim() ? next.latestAiExchangeId : null,
      updated_at: next.updatedAt,
    },
    { id },
  );

  return next;
};
