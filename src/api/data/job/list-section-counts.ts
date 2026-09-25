import type { Request, Response } from "express";
import { listAllJobListingSectionCounts } from "../../../data/job-listing-section-counts";
import { getManagedPgPool } from "../../../services/postgres";

/**
 * GET /api/data/job/list-section-counts
 *
 * Per-job counts of listing-import section rows (responsibilities, requirements, nice-to-haves).
 */
export const handleJobListSectionCounts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  console.log("📥 GET /api/data/job/list-section-counts");

  const pool = getManagedPgPool();
  if (!pool) {
    res.status(500).json({ success: false, error: "Supabase client unavailable" });
    return;
  }

  try {
    const data = await listAllJobListingSectionCounts(pool);
    console.log("📤 200 GET /api/data/job/list-section-counts", { jobs: data.length });
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to list section counts";
    console.error("❌ handleJobListSectionCounts:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
