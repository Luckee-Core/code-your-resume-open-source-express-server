import { Request, Response } from "express";
import { getManagedPgPool } from "../../../services/postgres";
import { getJobFromStore } from "../../../data/crm";
import { loadJobStudioPayload } from "../loadJobStudioPayload";

/**
 * GET /api/job-studio?jobId=<uuid>
 *
 * Returns chat messages for the Job Studio coach for one CRM job.
 */
export const getJobStudioHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobId = typeof req.query.jobId === "string" ? req.query.jobId.trim() : "";
    if (!jobId) {
      res.status(400).json({ success: false, error: "jobId query param is required" });
      return;
    }

    const job = await getJobFromStore(jobId);
    if (!job) {
      res.status(404).json({ success: false, error: "Job not found" });
      return;
    }

    const pool = getManagedPgPool();
    if (!pool) {
      res.status(500).json({ success: false, error: "Postgres not configured — set DATABASE_URL" });
      return;
    }

    const payload = await loadJobStudioPayload(pool, jobId);
    res.json({ success: true, ...payload });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ getJobStudioHandler:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
