import type { Request, Response } from "express";
import { getSupabaseCrmMirrorClient } from "../../../services/supabase/get-supabase-crm-mirror-client";

/**
 * GET /api/data/job-responsibilities/list?jobId=<id>
 *
 * Returns all responsibility rows for the given job, ordered by sort_order.
 */
export const handleJobResponsibilitiesList = async (req: Request, res: Response): Promise<void> => {
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
    const { data, error } = await supabase
      .from("job_responsibilities")
      .select("id, job_id, body, sort_order")
      .eq("job_id", jobId)
      .order("sort_order");

    if (error) throw error;

    const rows = (data ?? []).map((r) => ({
      id: r.id,
      jobId: r.job_id,
      body: r.body,
      sortOrder: r.sort_order,
    }));

    res.status(200).json({ success: true, data: rows });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to list job responsibilities";
    console.error("❌ handleJobResponsibilitiesList:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
