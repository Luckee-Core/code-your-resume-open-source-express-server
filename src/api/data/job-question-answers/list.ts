import type { Request, Response } from "express";
import { requireCrmSupabaseClient } from "../../../data/crm/require-crm-supabase-client";
import { listJobQuestionAnswersByJobId } from "../../../data/job-question-answers";

/**
 * GET /api/data/job-question-answers/list?jobId=
 */
export const handleJobQuestionAnswerList = async (req: Request, res: Response): Promise<void> => {
  console.log("📥 GET /api/data/job-question-answers/list");
  try {
    const jobId = typeof req.query.jobId === "string" ? req.query.jobId : "";
    if (!jobId.trim()) {
      res.status(400).json({ success: false, error: "jobId is required" });
      return;
    }
    const data = await listJobQuestionAnswersByJobId(requireCrmSupabaseClient(), jobId);
    console.log("📤 200 GET /api/data/job-question-answers/list");
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to list job question answers";
    console.error("❌ handleJobQuestionAnswerList:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
