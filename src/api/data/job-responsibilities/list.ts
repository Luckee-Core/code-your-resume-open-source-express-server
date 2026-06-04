import type { Request, Response } from "express";
import { listJobResponsibilitiesByJobId } from "../../../data/job-responsibilities";
import { getSupabaseCrmMirrorClient } from "../../../services/supabase/get-supabase-crm-mirror-client";

/**
 * GET /api/data/job-responsibilities/list?jobId=<id>
 *
 * Returns all responsibility rows for the given job, ordered by sort_order.
 */
export const handleJobResponsibilitiesList = async (req: Request, res: Response): Promise<void> => {
  console.log("📥 GET /api/data/job-responsibilities/list");
  const jobId = req.query.jobId as string | undefined;
  if (!jobId) {
    res.status(400).json({ success: false, error: "jobId query param is required" });
    return;
  }

  const supabase = getSupabaseCrmMirrorClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: "Supabase client unavailable" });
    return;
  }

  try {
    const data = await listJobResponsibilitiesByJobId(supabase, jobId);
    console.log("📤 200 GET /api/data/job-responsibilities/list");
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to list job responsibilities";
    console.error("❌ handleJobResponsibilitiesList:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
