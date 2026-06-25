import type { Request, Response } from "express";
import { runQuickApplyPipeline } from "../../../services/quick-apply/run-quick-apply-pipeline";

type Body = {
  companyWebsiteUrl?: unknown;
  jobListingUrl?: unknown;
};

/**
 * POST /api/data/quick-apply/run — company resolve/scrape, job scrape, resume queue.
 */
export const handleQuickApplyRun = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Body;
    const companyWebsiteUrl =
      typeof body.companyWebsiteUrl === "string" ? body.companyWebsiteUrl : "";
    const jobListingUrl = typeof body.jobListingUrl === "string" ? body.jobListingUrl : "";

    console.log("📥 POST /api/data/quick-apply/run", {
      companyWebsitePreview: companyWebsiteUrl.slice(0, 80),
      jobListingPreview: jobListingUrl.slice(0, 80),
    });

    if (!companyWebsiteUrl.trim()) {
      res.status(400).json({ success: false, error: "companyWebsiteUrl is required" });
      return;
    }
    if (!jobListingUrl.trim()) {
      res.status(400).json({ success: false, error: "jobListingUrl is required" });
      return;
    }

    const outcome = await runQuickApplyPipeline({ companyWebsiteUrl, jobListingUrl });

    if (!outcome.ok) {
      console.error("❌ POST /api/data/quick-apply/run:", outcome.error);
      res.status(outcome.statusCode).json({
        success: false,
        error: outcome.error,
        data: outcome.data,
      });
      return;
    }

    console.log("📤 POST /api/data/quick-apply/run — success", {
      companyId: outcome.data.companyId,
      jobId: outcome.data.jobId,
      resumeQueued: outcome.data.resumeQueued,
    });
    res.status(200).json({ success: true, data: outcome.data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Quick apply pipeline failed";
    console.error("❌ POST /api/data/quick-apply/run:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
