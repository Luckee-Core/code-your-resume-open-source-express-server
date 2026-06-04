import type { Request, Response } from "express";
import { requireCrmSupabaseClient } from "../../../data/crm/require-crm-supabase-client";
import { insertJobQuestionAnswer } from "../../../data/job-question-answers";

type Body = {
  jobId?: unknown;
  jobQuestionId?: unknown;
  answer?: unknown;
  sortOrder?: unknown;
};

/**
 * POST /api/data/job-question-answers/create
 */
export const handleJobQuestionAnswerCreate = async (req: Request, res: Response): Promise<void> => {
  console.log("📥 POST /api/data/job-question-answers/create");
  try {
    const body = req.body as Body;
    const jobId = typeof body.jobId === "string" ? body.jobId : "";
    const jobQuestionId = typeof body.jobQuestionId === "string" ? body.jobQuestionId : "";
    if (!jobId.trim() || !jobQuestionId.trim()) {
      res.status(400).json({ success: false, error: "jobId and jobQuestionId are required" });
      return;
    }
    const answer = typeof body.answer === "string" ? body.answer : "";
    const sortOrder = typeof body.sortOrder === "number" ? body.sortOrder : undefined;
    const data = await insertJobQuestionAnswer(requireCrmSupabaseClient(), {
      jobId,
      jobQuestionId,
      answer,
      sortOrder,
    });
    console.log("📤 200 POST /api/data/job-question-answers/create");
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create job question answer";
    console.error("❌ handleJobQuestionAnswerCreate:", msg);
    if (msg.includes("already linked")) {
      res.status(400).json({ success: false, error: msg });
      return;
    }
    res.status(500).json({ success: false, error: msg });
  }
};
