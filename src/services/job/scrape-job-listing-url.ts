import {
  createPendingJobListingScrapeRun,
  updateJobListingScrapeRunById,
} from "../../data/job-listing";
import { fetchJobListingDocument } from "./fetch-job-listing-document";
import { htmlJobListingToPlainText } from "./html-job-listing-to-plain-text";
import {
  JOB_LISTING_MAX_PLAINTEXT_CHARS,
  JOB_LISTING_MAX_SCRAPE_PLAINTEXT_STORED,
} from "./job-listing-constants";

export type ScrapeJobListingUrlResult =
  | { ok: true; scrapeRunId: string; cappedPlain: string; httpStatus: number | null }
  | { ok: false; statusCode: 400 | 422 | 502 | 500; error: string; scrapeRunId?: string };

/**
 * Fetches a job posting URL, records the scrape run in the local JSON store,
 * and returns the capped plain-text body for downstream AI processing.
 */
export const scrapeJobListingUrl = async (params: {
  jobId: string;
  sourceUrl: string;
}): Promise<ScrapeJobListingUrlResult> => {
  const { jobId, sourceUrl } = params;
  const nowIso = () => new Date().toISOString();

  let scrapeRow;
  try {
    scrapeRow = await createPendingJobListingScrapeRun({ jobId, sourceUrl });
  } catch {
    return { ok: false, statusCode: 500, error: "Failed to record scrape run" };
  }

  const scrapeRunId = scrapeRow.id;

  const failScrape = async (failParams: {
    httpStatus: number | null;
    error: string;
    statusCode: 400 | 422 | 502 | 500;
  }): Promise<ScrapeJobListingUrlResult> => {
    console.warn("⚠️ scrapeJobListingUrl: fetch or text step failed", {
      jobId,
      scrapeRunId,
      httpStatus: failParams.httpStatus,
      statusCode: failParams.statusCode,
      error: failParams.error,
    });
    await updateJobListingScrapeRunById(scrapeRunId, {
      status: "failed",
      httpStatus: failParams.httpStatus,
      plainText: "",
      error: failParams.error,
      completedAt: nowIso(),
    });
    return {
      ok: false,
      statusCode: failParams.statusCode,
      error: failParams.error,
      scrapeRunId,
    };
  };

  console.log("📥 scrapeJobListingUrl: fetching HTML", {
    jobId,
    scrapeRunId,
    url: sourceUrl.slice(0, 160),
  });

  const fetched = await fetchJobListingDocument(sourceUrl);
  if (!fetched.ok) {
    return failScrape({
      httpStatus: fetched.httpStatus,
      error: fetched.error,
      statusCode: 502,
    });
  }

  const plain =
    fetched.fetchMethod === "playwright"
      ? fetched.bodyText.replace(/\s+/g, " ").trim()
      : htmlJobListingToPlainText(fetched.bodyText);
  const cappedPlain =
    plain.length > JOB_LISTING_MAX_PLAINTEXT_CHARS
      ? plain.slice(0, JOB_LISTING_MAX_PLAINTEXT_CHARS)
      : plain;

  const plainLower = cappedPlain.toLowerCase();
  const looksUnavailable =
    plainLower.includes("no longer available") ||
    plainLower.includes("position has been filled") ||
    plainLower.includes("job posting is closed");

  console.log("📊 scrapeJobListingUrl: plain text extracted", {
    jobId,
    scrapeRunId,
    fetchMethod: fetched.fetchMethod,
    finalUrl: fetched.finalUrl?.slice(0, 200) ?? null,
    plainChars: plain.length,
    cappedPlainChars: cappedPlain.length,
    looksUnavailable,
  });

  if (!cappedPlain.trim()) {
    return failScrape({
      httpStatus: fetched.httpStatus,
      error: "No extractable text",
      statusCode: 422,
    });
  }

  const storedPlain =
    cappedPlain.length > JOB_LISTING_MAX_SCRAPE_PLAINTEXT_STORED
      ? cappedPlain.slice(0, JOB_LISTING_MAX_SCRAPE_PLAINTEXT_STORED)
      : cappedPlain;

  await updateJobListingScrapeRunById(scrapeRunId, {
    status: "completed",
    httpStatus: fetched.httpStatus,
    plainText: storedPlain,
    error: "",
    completedAt: nowIso(),
  });

  console.log("✅ scrapeJobListingUrl: scrape run completed", {
    jobId,
    scrapeRunId,
    httpStatus: fetched.httpStatus,
    plainChars: plain.length,
    cappedPlainChars: cappedPlain.length,
  });

  return {
    ok: true,
    scrapeRunId,
    cappedPlain,
    httpStatus: fetched.httpStatus,
  };
};
