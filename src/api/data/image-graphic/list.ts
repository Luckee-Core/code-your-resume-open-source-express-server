import type { Request, Response } from "express";
import { listImageGraphics } from "../../../data/image-graphics";
import { getSupabaseForImageGraphicHandler } from "./get-supabase-for-handler";

/**
 * GET /api/data/image-graphic/list — lists graphics from tenant Supabase.
 */
export const handleImageGraphicList = async (_req: Request, res: Response): Promise<void> => {
  try {
    const supabase = getSupabaseForImageGraphicHandler(res);
    if (!supabase) return;
    const graphics = await listImageGraphics(supabase);
    res.status(200).json({ success: true, data: { graphics } });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to list image graphics";
    console.error("❌ handleImageGraphicList:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
