import { Request, Response } from "express";
import { getSupabaseCrmMirrorClient } from "../../../services/supabase/get-supabase-crm-mirror-client";
import { getJobFromStore } from "../../../data/crm/read-write-jobs";
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

    const supabase = getSupabaseCrmMirrorClient();
    if (!supabase) {
      res.status(500).json({ success: false, error: "Supabase client not configured" });
      return;
    }

    const payload = await loadJobStudioPayload(supabase, jobId);
    res.json({ success: true, ...payload });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ getJobStudioHandler:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
