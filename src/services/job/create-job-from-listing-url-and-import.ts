import { createJobInStore } from "../../data/crm/read-write-jobs";
import { getCompanyFromStore } from "../../data/crm/read-write-companies";
import type { Job } from "../../data/crm/types";
import { PLACEHOLDER_JOB_LISTING_TITLE } from "./job-listing-constants";
import { runJobListingImport } from "./scrape-job-listing";
import { validatePublicJobListingUrl } from "./validate-public-job-listing-url";

const normalizeListingUrlInput = (raw: string): string => {
  const t = raw.trim();
  if (!t) return "";
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
};

export type CreateJobFromListingUrlAndImportResult =
  | { ok: true; job: Job; scrapeRunId: string; exchangeId: string | null }
  | {
      ok: false;
      statusCode: 400 | 422 | 502 | 500;
      error: string;
      /** Present when the job row was created but `runJobListingImport` failed. */
      createdJob?: Job;
      scrapeRunId?: string;
    };

/**
 * Creates a `Job` row then runs {@link runJobListingImport} (HTTP scrape + optional Anthropic).
 * Single orchestration entry for “posting URL → vault + AI snapshot”.
 */
export const createJobFromListingUrlAndImport = async (input: {
  companyId: string;
  urlRaw: string;
}): Promise<CreateJobFromListingUrlAndImportResult> => {
  const companyId = input.companyId.trim();
  if (!companyId) {
    return { ok: false, statusCode: 400, error: "companyId is required" };
  }
  const normalized = normalizeListingUrlInput(input.urlRaw);
  if (!normalized) {
    return { ok: false, statusCode: 400, error: "url is required" };
  }
  const urlCheck = validatePublicJobListingUrl(normalized);
  if (!urlCheck.ok) {
    return { ok: false, statusCode: 400, error: urlCheck.error };
  }

  let created: Job;
  try {
    created = await createJobInStore({
      companyId,
      title: PLACEHOLDER_JOB_LISTING_TITLE,
      url: urlCheck.href,
      status: "draft",
    });
  } catch {
    return { ok: false, statusCode: 500, error: "Failed to create job" };
  }

  const company =
    created.companyId.trim() !== "" ? await getCompanyFromStore(created.companyId) : null;

  const result = await runJobListingImport({
    job: created,
    sourceUrl: urlCheck.href,
    companyName: company?.name,
  });

  if (!result.ok) {
    return {
      ok: false,
      statusCode: result.statusCode,
      error: result.error,
      createdJob: created,
      scrapeRunId: result.scrapeRunId,
    };
  }

  return {
    ok: true,
    job: result.job,
    scrapeRunId: result.scrapeRunId,
    exchangeId: result.exchangeId,
  };
};
