import type { Request, Response } from "express";
import { requireCrmSupabaseClient } from "../../../data/crm/require-crm-supabase-client";
import { createProjectNote } from "../../../data/project-notes";

type Body = {
  projectId?: unknown;
  body?: unknown;
};

/**
 * POST /api/data/project-notes/create
 */
export const handleProjectNoteCreate = async (req: Request, res: Response): Promise<void> => {
  console.log("📥 POST /api/data/project-notes/create");
  try {
    const body = req.body as Body;
    const projectId = typeof body.projectId === "string" ? body.projectId.trim() : "";
    const noteBody = typeof body.body === "string" ? body.body : "";

    if (!projectId) {
      res.status(400).json({ success: false, error: "projectId is required" });
      return;
    }
    if (!noteBody.trim()) {
      res.status(400).json({ success: false, error: "body is required" });
      return;
    }

    const data = await createProjectNote(requireCrmSupabaseClient(), {
      projectId,
      body: noteBody,
    });

    console.log("📤 201 POST /api/data/project-notes/create");
    res.status(201).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create project note";
    console.error("❌ handleProjectNoteCreate:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
