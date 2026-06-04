import type { Request, Response } from "express";
import { getCompanyFromStore } from "../../../data/crm";
import { getJobFromStore } from "../../../data/crm";
import { runJobListingImport } from "../../../services/job/scrape-job-listing";
import { validatePublicJobListingUrl } from "../../../services/job/validate-public-job-listing-url";

type Body = {
  id?: unknown;
};

/**
 * POST /api/data/job/import-listing — fetch job posting URL, write ledger, update Job snapshot.
 */
export const handleJobImportListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Body;
    const id = typeof body.id === "string" ? body.id : "";
    if (!id.trim()) {
      res.status(400).json({ success: false, error: "id is required" });
      return;
    }

    const job = await getJobFromStore(id);
    if (!job) {
      res.status(404).json({ success: false, error: "Not found" });
      return;
    }

    const url = job.url.trim();
    if (!url) {
      res.status(400).json({ success: false, error: "Job has no posting URL" });
      return;
    }

    const urlCheck = validatePublicJobListingUrl(url);
    if (!urlCheck.ok) {
      res.status(400).json({ success: false, error: urlCheck.error });
      return;
    }

    const company =
      job.companyId.trim() !== "" ? await getCompanyFromStore(job.companyId) : null;

    console.log("📥 POST /api/data/job/import-listing", {
      jobId: id,
      url: url.slice(0, 120),
    });

    const result = await runJobListingImport({
      job,
      sourceUrl: url,
      companyName: company?.name,
    });

    if (!result.ok) {
      console.log("⚠️ job/import-listing failed", { jobId: id, error: result.error });
      res.status(result.statusCode).json({
        success: false,
        error: result.error,
        scrapeRunId: result.scrapeRunId,
      });
      return;
    }

    console.log("✅ job/import-listing done", {
      jobId: id,
      scrapeRunId: result.scrapeRunId,
      exchangeId: result.exchangeId,
    });
    res.status(200).json({
      success: true,
      data: result.job,
      scrapeRunId: result.scrapeRunId,
      exchangeId: result.exchangeId,
    });
  } catch {
    res.status(500).json({ success: false, error: "Failed to import listing" });
  }
};
