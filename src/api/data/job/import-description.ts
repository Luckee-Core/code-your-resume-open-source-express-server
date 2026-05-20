import type { Request, Response } from "express";
import { getCompanyFromStore } from "../../../data/crm/read-write-companies";
import { getJobFromStore } from "../../../data/crm/read-write-jobs";
import { runJobDescriptionImport } from "../../../services/job/run-job-description-import";

type Body = {
  id?: unknown;
  description?: unknown;
};

/**
 * POST /api/data/job/import-description — extract responsibilities / requirements /
 * nice-to-haves from pasted job description text (no URL scrape).
 */
export const handleJobImportDescription = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Body;
    const id = typeof body.id === "string" ? body.id : "";
    const descriptionText = typeof body.description === "string" ? body.description : "";

    if (!id.trim()) {
      res.status(400).json({ success: false, error: "id is required" });
      return;
    }

    const job = await getJobFromStore(id);
    if (!job) {
      res.status(404).json({ success: false, error: "Not found" });
      return;
    }

    const company =
      job.companyId.trim() !== "" ? await getCompanyFromStore(job.companyId) : null;

    console.log("📥 POST /api/data/job/import-description", {
      jobId: id,
      descriptionChars: descriptionText.trim().length,
    });

    const result = await runJobDescriptionImport({
      job,
      descriptionText,
      companyName: company?.name,
    });

    if (!result.ok) {
      console.log("⚠️ job/import-description failed", { jobId: id, error: result.error });
      res.status(result.statusCode).json({
        success: false,
        error: result.error,
        scrapeRunId: result.scrapeRunId,
      });
      return;
    }

    console.log("✅ job/import-description done", {
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
    res.status(500).json({ success: false, error: "Failed to import description" });
  }
};
