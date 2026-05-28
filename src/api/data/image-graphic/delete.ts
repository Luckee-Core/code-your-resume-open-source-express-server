import type { Request, Response } from "express";
import { deleteImageGraphic } from "../../../data/image-graphics";
import { getSupabaseForImageGraphicHandler } from "./get-supabase-for-handler";

/**
 * DELETE /api/data/image-graphic/delete?id= — removes one graphic from Supabase.
 */
export const handleImageGraphicDelete = async (req: Request, res: Response): Promise<void> => {
  try {
    const supabase = getSupabaseForImageGraphicHandler(res);
    if (!supabase) return;
    const id = typeof req.query.id === "string" ? req.query.id.trim() : "";
    if (!id) {
      res.status(400).json({ success: false, error: "id is required" });
      return;
    }
    const ok = await deleteImageGraphic(supabase, id);
    if (!ok) {
      res.status(404).json({ success: false, error: "Graphic not found" });
      return;
    }
    res.status(200).json({ success: true, data: { deleted: true } });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to delete image graphic";
    console.error("❌ handleImageGraphicDelete:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
