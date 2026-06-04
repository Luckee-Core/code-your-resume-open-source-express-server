import type { Request, Response } from "express";
import { getJobFromStore } from "../../../data/crm";
import { createEmploymentInStore } from "../../../data/crm";

type Body = {
  companyId?: unknown;
  jobId?: unknown;
  startDate?: unknown;
  endDate?: unknown;
};

/**
 * POST /api/data/employment/create — links company + job with tenure dates.
 * Ensures the job exists and `job.companyId` matches `companyId`.
 */
export const handleEmploymentCreate = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Body;
    const companyId = typeof body.companyId === "string" ? body.companyId.trim() : "";
    const jobId = typeof body.jobId === "string" ? body.jobId.trim() : "";
    const startDate = typeof body.startDate === "string" ? body.startDate.trim() : "";
    const endDate = typeof body.endDate === "string" ? body.endDate.trim() : "";

    if (!companyId || !jobId || !startDate) {
      res.status(400).json({ success: false, error: "companyId, jobId, and startDate are required" });
      return;
    }

    const job = await getJobFromStore(jobId);
    if (!job) {
      res.status(400).json({ success: false, error: "job not found" });
      return;
    }
    if (job.companyId !== companyId) {
      res.status(400).json({
        success: false,
        error: "job.companyId must match companyId",
      });
      return;
    }

    const data = await createEmploymentInStore({
      companyId,
      jobId,
      startDate,
      endDate,
    });
    res.status(201).json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: "Failed to create employment" });
  }
};
