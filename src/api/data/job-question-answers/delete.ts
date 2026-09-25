import type { Request, Response } from "express";
import { requireCrmPgPool } from "../../../data/crm/require-crm-pg-pool";
import { deleteJobQuestionAnswer } from "../../../data/job-question-answers";

/**
 * DELETE /api/data/job-question-answers/delete?id=
 */
export const handleJobQuestionAnswerDelete = async (req: Request, res: Response): Promise<void> => {
  console.log("📥 DELETE /api/data/job-question-answers/delete");
  try {
    const id = typeof req.query.id === "string" ? req.query.id : "";
    if (!id.trim()) {
      res.status(400).json({ success: false, error: "id is required" });
      return;
    }
    const ok = await deleteJobQuestionAnswer(requireCrmPgPool(), id);
    if (!ok) {
      res.status(404).json({ success: false, error: "Not found" });
      return;
    }
    console.log("📤 200 DELETE /api/data/job-question-answers/delete");
    res.status(200).json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete job question answer";
    console.error("❌ handleJobQuestionAnswerDelete:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
