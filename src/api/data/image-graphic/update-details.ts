import type { Request, Response } from "express";
import { updateImageGraphicDetails } from "../../../data/image-graphics";
import { getSupabaseForImageGraphicHandler } from "./get-supabase-for-handler";

type Body = {
  graphicId?: unknown;
  title?: unknown;
  canvasWidthPx?: unknown;
  canvasHeightPx?: unknown;
};

/**
 * PATCH /api/data/image-graphic/update-details — updates title and canvas size.
 */
export const handleImageGraphicUpdateDetails = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const supabase = getSupabaseForImageGraphicHandler(res);
    if (!supabase) return;
    const body = req.body as Body;
    const graphicId = typeof body.graphicId === "string" ? body.graphicId.trim() : "";
    const title = typeof body.title === "string" ? body.title : "";
    const canvasWidthPx = typeof body.canvasWidthPx === "number" ? body.canvasWidthPx : 960;
    const canvasHeightPx = typeof body.canvasHeightPx === "number" ? body.canvasHeightPx : 540;
    if (!graphicId) {
      res.status(400).json({ success: false, error: "graphicId is required" });
      return;
    }
    const row = await updateImageGraphicDetails(supabase, graphicId, {
      title,
      canvasWidthPx,
      canvasHeightPx,
    });
    if (!row) {
      res.status(404).json({ success: false, error: "Graphic not found" });
      return;
    }
    res.status(200).json({ success: true, data: row });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to update image graphic";
    console.error("❌ handleImageGraphicUpdateDetails:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
