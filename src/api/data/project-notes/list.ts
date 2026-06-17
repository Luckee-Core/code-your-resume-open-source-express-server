import type { Request, Response } from "express";
import { requireCrmSupabaseClient } from "../../../data/crm/require-crm-supabase-client";
import { listProjectNotesByProjectId } from "../../../data/project-notes";

/**
 * GET /api/data/project-notes/list?projectId=
 */
export const handleProjectNoteList = async (req: Request, res: Response): Promise<void> => {
  console.log("📥 GET /api/data/project-notes/list");
  try {
    const projectId = typeof req.query.projectId === "string" ? req.query.projectId.trim() : "";
    if (!projectId) {
      res.status(400).json({ success: false, error: "projectId is required" });
      return;
    }

    const data = await listProjectNotesByProjectId(requireCrmSupabaseClient(), projectId);

    console.log("📤 200 GET /api/data/project-notes/list");
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to list project notes";
    console.error("❌ handleProjectNoteList:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
