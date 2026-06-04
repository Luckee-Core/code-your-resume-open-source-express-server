import type { Request, Response } from "express";
import { requireCrmSupabaseClient } from "../../../data/crm/require-crm-supabase-client";
import { deleteJobQuestion } from "../../../data/job-questions";

/**
 * DELETE /api/data/job-questions/delete?id=
 */
export const handleJobQuestionDelete = async (req: Request, res: Response): Promise<void> => {
  console.log("📥 DELETE /api/data/job-questions/delete");
  try {
    const id = typeof req.query.id === "string" ? req.query.id : "";
    if (!id.trim()) {
      res.status(400).json({ success: false, error: "id is required" });
      return;
    }
    const ok = await deleteJobQuestion(requireCrmSupabaseClient(), id);
    if (!ok) {
      res.status(404).json({ success: false, error: "Not found" });
      return;
    }
    console.log("📤 200 DELETE /api/data/job-questions/delete");
    res.status(200).json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete job question";
    console.error("❌ handleJobQuestionDelete:", msg);
    if (msg.includes("linked to jobs")) {
      res.status(400).json({ success: false, error: msg });
      return;
    }
    res.status(500).json({ success: false, error: msg });
  }
};
