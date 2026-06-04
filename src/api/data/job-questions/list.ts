import type { Request, Response } from "express";
import { requireCrmSupabaseClient } from "../../../data/crm/require-crm-supabase-client";
import { listJobQuestions } from "../../../data/job-questions";

/**
 * GET /api/data/job-questions/list
 */
export const handleJobQuestionList = async (_req: Request, res: Response): Promise<void> => {
  console.log("📥 GET /api/data/job-questions/list");
  try {
    const data = await listJobQuestions(requireCrmSupabaseClient());
    console.log("📤 200 GET /api/data/job-questions/list");
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to list job questions";
    console.error("❌ handleJobQuestionList:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
