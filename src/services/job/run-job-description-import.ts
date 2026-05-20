import type { Job } from "../../data/crm/types";
import {
  createPendingJobListingScrapeRun,
  updateJobListingScrapeRunById,
} from "../../data/job-listing";
import { updateJobInStore } from "../../data/crm/read-write-jobs";
import { persistJobListingAiLedger } from "./persist-job-listing-ai-ledger";
import {
  JOB_LISTING_MAX_PLAINTEXT_CHARS,
  JOB_LISTING_MAX_SCRAPE_PLAINTEXT_STORED,
  JOB_LISTING_MAX_STORED_DESCRIPTION_CHARS,
} from "./job-listing-constants";
import type { RunJobListingImportResult } from "./scrape-job-listing";

const MANUAL_SOURCE_URL = "manual://pasted-description";
const MIN_DESCRIPTION_CHARS = 40;

/**
 * Runs the job-listing AI extract pipeline on user-pasted plain text (no HTTP scrape).
 * Records a completed manual scrape run, syncs section bullets, and updates the Job snapshot.
 */
export const runJobDescriptionImport = async (input: {
  job: Job;
  descriptionText: string;
  companyName?: string;
}): Promise<RunJobListingImportResult> => {
  const trimmed = input.descriptionText.trim();
  if (trimmed.length < MIN_DESCRIPTION_CHARS) {
    return {
      ok: false,
      statusCode: 400,
      error: `Description must be at least ${MIN_DESCRIPTION_CHARS} characters`,
    };
  }

  if (!process.env.ANTHROPIC_API_KEY?.trim()) {
    return {
      ok: false,
      statusCode: 500,
      error: "Anthropic API key is not configured on the server",
    };
  }

  const cappedPlain =
    trimmed.length > JOB_LISTING_MAX_PLAINTEXT_CHARS
      ? trimmed.slice(0, JOB_LISTING_MAX_PLAINTEXT_CHARS)
      : trimmed;

  console.log("🚀 runJobDescriptionImport: start", {
    jobId: input.job.id,
    descriptionChars: trimmed.length,
    cappedPlainChars: cappedPlain.length,
  });

  let scrapeRow;
  try {
    scrapeRow = await createPendingJobListingScrapeRun({
      jobId: input.job.id,
      sourceUrl: MANUAL_SOURCE_URL,
    });
  } catch {
    return { ok: false, statusCode: 500, error: "Failed to record import run" };
  }

  const scrapeRunId = scrapeRow.id;
  const nowIso = new Date().toISOString();
  const storedPlain =
    cappedPlain.length > JOB_LISTING_MAX_SCRAPE_PLAINTEXT_STORED
      ? cappedPlain.slice(0, JOB_LISTING_MAX_SCRAPE_PLAINTEXT_STORED)
      : cappedPlain;

  await updateJobListingScrapeRunById(scrapeRunId, {
    status: "completed",
    httpStatus: null,
    plainText: storedPlain,
    error: "",
    completedAt: nowIso,
  });

  const ledgerResult = await persistJobListingAiLedger({
    jobId: input.job.id,
    scrapeRunId,
    cappedPlain,
    hints: {
      titleHint: input.job.title,
      companyName: input.companyName,
    },
  });

  if (!ledgerResult.ok) {
    return { ok: false, statusCode: 500, error: ledgerResult.error, scrapeRunId };
  }

  const { exchangeId, title, description, responsibilities, requirements, niceToHaves } =
    ledgerResult;

  const hasExtractedBullets =
    responsibilities.length + requirements.length + niceToHaves.length > 0;

  if (!hasExtractedBullets && !description.trim()) {
    return {
      ok: false,
      statusCode: 422,
      error: "Could not extract responsibilities, requirements, or nice-to-haves from this text",
      scrapeRunId,
    };
  }

  try {
    const storedDescription = (description || cappedPlain).slice(
      0,
      JOB_LISTING_MAX_STORED_DESCRIPTION_CHARS,
    );
    const patch: Partial<
      Pick<
        Job,
        | "description"
        | "listingImportedAt"
        | "latestScrapeRunId"
        | "latestAiExchangeId"
        | "title"
        | "responsibilities"
        | "requirements"
        | "niceToHaves"
      >
    > = {
      description: storedDescription,
      listingImportedAt: nowIso,
      latestScrapeRunId: scrapeRunId,
      latestAiExchangeId: exchangeId,
      responsibilities,
      requirements,
      niceToHaves,
    };
    if (title) {
      patch.title = title;
    }

    const job = await updateJobInStore(input.job.id, patch);
    if (!job) {
      return { ok: false, statusCode: 500, error: "Job disappeared during import", scrapeRunId };
    }

    console.log("✅ runJobDescriptionImport: job snapshot saved", {
      jobId: job.id,
      scrapeRunId,
      exchangeId,
      responsibilities: responsibilities.length,
      requirements: requirements.length,
      niceToHaves: niceToHaves.length,
    });

    return { ok: true, job, scrapeRunId, exchangeId };
  } catch (err) {
    console.error("❌ runJobDescriptionImport: failed to update job row", {
      jobId: input.job.id,
      scrapeRunId,
      err,
    });
    return { ok: false, statusCode: 500, error: "Failed to update job", scrapeRunId };
  }
};
