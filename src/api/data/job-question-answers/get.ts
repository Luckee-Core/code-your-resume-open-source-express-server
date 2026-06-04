import type { Request, Response } from "express";
import { requireCrmSupabaseClient } from "../../../data/crm/require-crm-supabase-client";
import { getJobQuestionAnswer } from "../../../data/job-question-answers";

/**
 * GET /api/data/job-question-answers/get?id=
 */
export const handleJobQuestionAnswerGet = async (req: Request, res: Response): Promise<void> => {
  console.log("📥 GET /api/data/job-question-answers/get");
  try {
    const id = typeof req.query.id === "string" ? req.query.id : "";
    if (!id.trim()) {
      res.status(400).json({ success: false, error: "id is required" });
      return;
    }
    const data = await getJobQuestionAnswer(requireCrmSupabaseClient(), id);
    if (!data) {
      res.status(404).json({ success: false, error: "Not found" });
      return;
    }
    console.log("📤 200 GET /api/data/job-question-answers/get");
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to get job question answer";
    console.error("❌ handleJobQuestionAnswerGet:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
