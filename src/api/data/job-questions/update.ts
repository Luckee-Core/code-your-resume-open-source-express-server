import type { Request, Response } from "express";
import { requireCrmSupabaseClient } from "../../../data/crm/require-crm-supabase-client";
import { updateJobQuestion } from "../../../data/job-questions";

type Body = {
  id?: unknown;
  prompt?: unknown;
};

/**
 * PATCH /api/data/job-questions/update
 */
export const handleJobQuestionUpdate = async (req: Request, res: Response): Promise<void> => {
  console.log("📥 PATCH /api/data/job-questions/update");
  try {
    const body = req.body as Body;
    const id = typeof body.id === "string" ? body.id : "";
    if (!id.trim()) {
      res.status(400).json({ success: false, error: "id is required" });
      return;
    }
    const patch: { prompt?: string } = {};
    if (typeof body.prompt === "string") {
      patch.prompt = body.prompt;
    }
    const data = await updateJobQuestion(requireCrmSupabaseClient(), id, patch);
    if (!data) {
      res.status(404).json({ success: false, error: "Not found" });
      return;
    }
    console.log("📤 200 PATCH /api/data/job-questions/update");
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update job question";
    console.error("❌ handleJobQuestionUpdate:", msg);
    if (msg.includes("prompt is required")) {
      res.status(400).json({ success: false, error: msg });
      return;
    }
    res.status(500).json({ success: false, error: msg });
  }
};
