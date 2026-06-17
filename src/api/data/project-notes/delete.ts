import type { Request, Response } from "express";
import { requireCrmSupabaseClient } from "../../../data/crm/require-crm-supabase-client";
import { deleteProjectNote } from "../../../data/project-notes";

/**
 * DELETE /api/data/project-notes/delete?id=
 */
export const handleProjectNoteDelete = async (req: Request, res: Response): Promise<void> => {
  console.log("📥 DELETE /api/data/project-notes/delete");
  try {
    const id = typeof req.query.id === "string" ? req.query.id.trim() : "";
    if (!id) {
      res.status(400).json({ success: false, error: "id is required" });
      return;
    }

    await deleteProjectNote(requireCrmSupabaseClient(), id);

    console.log("📤 200 DELETE /api/data/project-notes/delete");
    res.status(200).json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete project note";
    console.error("❌ handleProjectNoteDelete:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
