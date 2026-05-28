import type { Request, Response } from "express";
import { patchImageGraphicStudioDraft } from "../../../data/image-graphics";
import { getSupabaseForImageGraphicHandler } from "./get-supabase-for-handler";

type Body = {
  graphicId?: unknown;
  tsx?: unknown;
};

/**
 * PATCH /api/data/image-graphic/patch-studio-draft — saves TSX in metadata.studioDraft.
 */
export const handleImageGraphicPatchStudioDraft = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const supabase = getSupabaseForImageGraphicHandler(res);
    if (!supabase) return;
    const body = req.body as Body;
    const graphicId = typeof body.graphicId === "string" ? body.graphicId.trim() : "";
    const tsx = typeof body.tsx === "string" ? body.tsx : "";
    if (!graphicId) {
      res.status(400).json({ success: false, error: "graphicId is required" });
      return;
    }
    const row = await patchImageGraphicStudioDraft(supabase, graphicId, tsx);
    if (!row) {
      res.status(404).json({ success: false, error: "Graphic not found" });
      return;
    }
    res.status(200).json({
      success: true,
      data: { id: row.id, metadata: row.metadata, updatedAt: row.updatedAt },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to patch studio draft";
    console.error("❌ handleImageGraphicPatchStudioDraft:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
