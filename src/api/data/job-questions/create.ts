import type { Request, Response } from "express";
import { requireCrmSupabaseClient } from "../../../data/crm/require-crm-supabase-client";
import { insertJobQuestion } from "../../../data/job-questions";

type Body = {
  prompt?: unknown;
};

/**
 * POST /api/data/job-questions/create
 */
export const handleJobQuestionCreate = async (req: Request, res: Response): Promise<void> => {
  console.log("📥 POST /api/data/job-questions/create");
  try {
    const body = req.body as Body;
    const prompt = typeof body.prompt === "string" ? body.prompt : "";
    if (!prompt.trim()) {
      res.status(400).json({ success: false, error: "prompt is required" });
      return;
    }
    const data = await insertJobQuestion(requireCrmSupabaseClient(), { prompt });
    console.log("📤 200 POST /api/data/job-questions/create");
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create job question";
    console.error("❌ handleJobQuestionCreate:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
