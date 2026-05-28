import type { Request, Response } from "express";
import { getImageGraphic } from "../../../data/image-graphics";
import { getSupabaseForImageGraphicHandler } from "./get-supabase-for-handler";

/**
 * GET /api/data/image-graphic/get?id= — returns one graphic from Supabase.
 */
export const handleImageGraphicGet = async (req: Request, res: Response): Promise<void> => {
  try {
    const supabase = getSupabaseForImageGraphicHandler(res);
    if (!supabase) return;
    const id = typeof req.query.id === "string" ? req.query.id.trim() : "";
    if (!id) {
      res.status(400).json({ success: false, error: "id is required" });
      return;
    }
    const data = await getImageGraphic(supabase, id);
    if (!data) {
      res.status(404).json({ success: false, error: "Graphic not found" });
      return;
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to get image graphic";
    console.error("❌ handleImageGraphicGet:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
