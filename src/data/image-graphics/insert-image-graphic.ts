import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ImageGraphic } from "./types";
import { getImageGraphic } from "./get-image-graphic";

/**
 * Inserts a new image graphic row.
 */
export const insertImageGraphic = async (
  supabase: SupabaseClient,
  input: {
    title: string;
    canvasWidthPx: number;
    canvasHeightPx: number;
    jobId?: string;
    metadata?: Record<string, unknown>;
    id?: string;
  },
): Promise<ImageGraphic> => {
  const id = input.id?.trim() || randomUUID();
  const now = new Date().toISOString();
  const { error } = await supabase.from("image_graphics").insert({
    id,
    title: input.title.trim() || "Untitled graphic",
    job_id: input.jobId?.trim() ?? "",
    canvas_width_px: input.canvasWidthPx,
    canvas_height_px: input.canvasHeightPx,
    metadata: input.metadata ?? {},
    created_at: now,
    updated_at: now,
  });

  if (error) {
    console.error("❌ insertImageGraphic:", error.message);
    throw new Error(error.message);
  }

  const row = await getImageGraphic(supabase, id);
  if (!row) {
    throw new Error("Failed to load image graphic after insert");
  }
  return row;
};
