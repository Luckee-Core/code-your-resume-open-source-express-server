import type { Request, Response } from "express";
import { createJobFromListingUrlAndImport } from "../../../services/job/create-job-from-listing-url-and-import";

type Body = {
  companyId?: unknown;
  url?: unknown;
};

/**
 * POST /api/data/job/create-from-listing-url — create Job row then run scrape + optional Anthropic (`runJobListingImport`).
 */
export const handleJobCreateFromListingUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Body;
    const companyId = typeof body.companyId === "string" ? body.companyId : "";
    const urlRaw = typeof body.url === "string" ? body.url : "";

    console.log("📥 POST /api/data/job/create-from-listing-url (vault + scrape-job-listing)", {
      companyId,
      urlPreview: urlRaw.slice(0, 120),
    });

    const outcome = await createJobFromListingUrlAndImport({ companyId, urlRaw });

    if (!outcome.ok) {
      if (outcome.createdJob) {
        res.status(outcome.statusCode).json({
          success: false,
          error: outcome.error,
          data: outcome.createdJob,
          scrapeRunId: outcome.scrapeRunId,
        });
        return;
      }
      res.status(outcome.statusCode).json({ success: false, error: outcome.error });
      return;
    }

    console.log("✅ job/create-from-listing-url done", {
      jobId: outcome.job.id,
      scrapeRunId: outcome.scrapeRunId,
      exchangeId: outcome.exchangeId,
    });
    res.status(201).json({
      success: true,
      data: outcome.job,
      scrapeRunId: outcome.scrapeRunId,
      exchangeId: outcome.exchangeId,
    });
  } catch (err) {
    console.error("❌ POST /api/data/job/create-from-listing-url", err);
    res.status(500).json({ success: false, error: "Failed to create job from listing URL" });
  }
};
