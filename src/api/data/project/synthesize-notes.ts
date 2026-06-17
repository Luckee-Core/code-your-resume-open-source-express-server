import type { Request, Response } from "express";
import { runProjectNotesSynthesis } from "../../../services/project/run-project-notes-synthesis";

type Body = {
  id?: unknown;
  synthesisText?: unknown;
};

/**
 * POST /api/data/project/synthesize-notes — extract project notes from pasted text via AI.
 * Replaces all existing notes for the project.
 */
export const handleProjectSynthesizeNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Body;
    const id = typeof body.id === "string" ? body.id : "";
    const synthesisText = typeof body.synthesisText === "string" ? body.synthesisText : "";

    if (!id.trim()) {
      res.status(400).json({ success: false, error: "id is required" });
      return;
    }

    console.log("📥 POST /api/data/project/synthesize-notes", {
      projectId: id,
      synthesisChars: synthesisText.trim().length,
    });

    const result = await runProjectNotesSynthesis({ projectId: id, synthesisText });

    if (!result.ok) {
      console.log("⚠️ project/synthesize-notes failed", {
        projectId: id,
        error: result.error,
        statusCode: result.statusCode,
      });
      res.status(result.statusCode).json({ success: false, error: result.error });
      return;
    }

    console.log("✅ project/synthesize-notes done", {
      projectId: id,
      exchangeId: result.exchangeId,
      notesCount: result.notes.length,
    });

    res.status(200).json({
      success: true,
      data: {
        notes: result.notes,
        exchangeId: result.exchangeId,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to synthesize project notes";
    console.error("❌ handleProjectSynthesizeNotes:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
