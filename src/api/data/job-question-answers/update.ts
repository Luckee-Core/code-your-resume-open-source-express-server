import type { Request, Response } from "express";
import { requireCrmSupabaseClient } from "../../../data/crm/require-crm-supabase-client";
import { updateJobQuestionAnswer } from "../../../data/job-question-answers";
import type { JobQuestionAnswer } from "../../../data/job-question-answers/types";

type Body = {
  id?: unknown;
  answer?: unknown;
  sortOrder?: unknown;
};

/**
 * PATCH /api/data/job-question-answers/update
 */
export const handleJobQuestionAnswerUpdate = async (req: Request, res: Response): Promise<void> => {
  console.log("📥 PATCH /api/data/job-question-answers/update");
  try {
    const body = req.body as Body;
    const id = typeof body.id === "string" ? body.id : "";
    if (!id.trim()) {
      res.status(400).json({ success: false, error: "id is required" });
      return;
    }
    const patch: Partial<Pick<JobQuestionAnswer, "answer" | "sortOrder">> = {};
    if (typeof body.answer === "string") {
      patch.answer = body.answer;
    }
    if (typeof body.sortOrder === "number") {
      patch.sortOrder = body.sortOrder;
    }
    const data = await updateJobQuestionAnswer(requireCrmSupabaseClient(), id, patch);
    if (!data) {
      res.status(404).json({ success: false, error: "Not found" });
      return;
    }
    console.log("📤 200 PATCH /api/data/job-question-answers/update");
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update job question answer";
    console.error("❌ handleJobQuestionAnswerUpdate:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
