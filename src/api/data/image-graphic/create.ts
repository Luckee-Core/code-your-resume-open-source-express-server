import type { Request, Response } from "express";
import { insertImageGraphic } from "../../../data/image-graphics";
import { getSupabaseForImageGraphicHandler } from "./get-supabase-for-handler";

type Body = {
  title?: unknown;
  canvasWidthPx?: unknown;
  canvasHeightPx?: unknown;
  jobId?: unknown;
  metadata?: unknown;
  id?: unknown;
};

/**
 * POST /api/data/image-graphic/create — creates a graphic in Supabase.
 */
export const handleImageGraphicCreate = async (req: Request, res: Response): Promise<void> => {
  try {
    const supabase = getSupabaseForImageGraphicHandler(res);
    if (!supabase) return;
    const body = req.body as Body;
    const title = typeof body.title === "string" ? body.title : "";
    const canvasWidthPx = typeof body.canvasWidthPx === "number" ? body.canvasWidthPx : 960;
    const canvasHeightPx = typeof body.canvasHeightPx === "number" ? body.canvasHeightPx : 540;
    const jobId = typeof body.jobId === "string" ? body.jobId.trim() : "";
    const metadata =
      body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata)
        ? (body.metadata as Record<string, unknown>)
        : {};
    const id = typeof body.id === "string" ? body.id : undefined;
    const row = await insertImageGraphic(supabase, {
      title,
      canvasWidthPx,
      canvasHeightPx,
      jobId,
      metadata,
      id,
    });
    res.status(201).json({ success: true, data: { id: row.id } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create image graphic";
    if (message.includes("duplicate") || message.includes("unique")) {
      res.status(409).json({ success: false, error: message });
      return;
    }
    console.error("❌ handleImageGraphicCreate:", message);
    res.status(500).json({ success: false, error: message });
  }
};
