import type { Request, Response } from "express";
import { listImageGraphics } from "../../../data/image-graphics";
import { getPgPoolForImageGraphicHandler } from "./get-pg-pool-for-handler";

/**
 * GET /api/data/image-graphic/list — lists graphics from tenant Supabase.
 */
export const handleImageGraphicList = async (_req: Request, res: Response): Promise<void> => {
  try {
    const pool = getPgPoolForImageGraphicHandler(res);
    if (!pool) return;
    const graphics = await listImageGraphics(pool);
    res.status(200).json({ success: true, data: { graphics } });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to list image graphics";
    console.error("❌ handleImageGraphicList:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
