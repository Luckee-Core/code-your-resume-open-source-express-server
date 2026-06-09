import type { Job } from "../../data/crm/types";
import { updateJobInStore } from "../../data/crm";
import { validatePublicJobListingUrl } from "./validate-public-job-listing-url";
import { scrapeJobListingUrl } from "./scrape-job-listing-url";
import { persistJobListingAiLedger } from "./persist-job-listing-ai-ledger";

export type RunJobListingImportResult =
  | { ok: true; job: Job; scrapeRunId: string; exchangeId: string | null }
  | { ok: false; statusCode: 400 | 422 | 502 | 500; error: string; scrapeRunId?: string };

/**
 * Orchestrates job listing import: validates the URL, scrapes the page, runs the
 * AI ledger pass, then writes the updated job snapshot to the local CRM store.
 */
export const runJobListingImport = async (input: {
  job: Job;
  sourceUrl: string;
  companyName?: string;
}): Promise<RunJobListingImportResult> => {
  const validated = validatePublicJobListingUrl(input.sourceUrl);
  if (!validated.ok) {
    console.warn("⚠️ runJobListingImport: URL validation failed", {
      jobId: input.job.id,
      error: validated.error,
    });
    return { ok: false, statusCode: 400, error: validated.error };
  }

  console.log("🚀 runJobListingImport: start", {
    jobId: input.job.id,
    url: validated.href.slice(0, 160),
    companyName: input.companyName?.trim() || null,
  });

  const scrapeResult = await scrapeJobListingUrl({
    jobId: input.job.id,
    sourceUrl: validated.href,
  });

  if (!scrapeResult.ok) {
    console.warn("⚠️ runJobListingImport: scrape failed", {
      jobId: input.job.id,
      statusCode: scrapeResult.statusCode,
      error: scrapeResult.error,
      scrapeRunId: scrapeResult.scrapeRunId,
    });
    return {
      ok: false,
      statusCode: scrapeResult.statusCode,
      error: scrapeResult.error,
      scrapeRunId: scrapeResult.scrapeRunId,
    };
  }

  const { scrapeRunId, cappedPlain } = scrapeResult;

  console.log("📊 runJobListingImport: scrape ok, starting AI extract", {
    jobId: input.job.id,
    scrapeRunId,
    httpStatus: scrapeResult.httpStatus,
    cappedPlainChars: cappedPlain.length,
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

  const { exchangeId, title, description, responsibilities, requirements, niceToHaves } = ledgerResult;
  const nowIso = new Date().toISOString();

  try {
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
      description: description || cappedPlain.slice(0, 10_000),
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
      console.error("❌ runJobListingImport: job row missing after update", {
        jobId: input.job.id,
        scrapeRunId,
      });
      return { ok: false, statusCode: 500, error: "Job disappeared during import", scrapeRunId };
    }

    console.log("✅ runJobListingImport: job snapshot saved", {
      jobId: job.id,
      scrapeRunId,
      exchangeId,
      titleUpdated: Boolean(title),
      savedTitle: job.title,
      descriptionChars: (job.description ?? "").length,
      responsibilities: responsibilities.length,
      requirements: requirements.length,
      niceToHaves: niceToHaves.length,
    });

    return { ok: true, job, scrapeRunId, exchangeId };
  } catch (err) {
    console.error("❌ runJobListingImport: failed to update job row", {
      jobId: input.job.id,
      scrapeRunId,
      err,
    });
    return { ok: false, statusCode: 500, error: "Failed to update job", scrapeRunId };
  }
};
