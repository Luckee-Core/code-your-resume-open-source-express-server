import type { Request, Response } from "express";
import { requireCrmSupabaseClient } from "../../../data/crm/require-crm-supabase-client";
import { getJobQuestion } from "../../../data/job-questions";

/**
 * GET /api/data/job-questions/get?id=
 */
export const handleJobQuestionGet = async (req: Request, res: Response): Promise<void> => {
  console.log("📥 GET /api/data/job-questions/get");
  try {
    const id = typeof req.query.id === "string" ? req.query.id : "";
    if (!id.trim()) {
      res.status(400).json({ success: false, error: "id is required" });
      return;
    }
    const data = await getJobQuestion(requireCrmSupabaseClient(), id);
    if (!data) {
      res.status(404).json({ success: false, error: "Not found" });
      return;
    }
    console.log("📤 200 GET /api/data/job-questions/get");
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to get job question";
    console.error("❌ handleJobQuestionGet:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
