import { randomUUID } from "node:crypto";
import type { Pool } from "pg";
import type { ImageGraphic } from "./types";
import { getImageGraphic } from "./get-image-graphic";
import { insertRow } from "../../utils/postgres";

/**
 * Inserts a new image graphic row.
 */
export const insertImageGraphic = async (
  pool: Pool,
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
  await insertRow(pool, "image_graphics", {
    id,
    title: input.title.trim() || "Untitled graphic",
    job_id: input.jobId?.trim() ?? "",
    canvas_width_px: input.canvasWidthPx,
    canvas_height_px: input.canvasHeightPx,
    metadata: input.metadata ?? {},
    created_at: now,
    updated_at: now,
  });

  const row = await getImageGraphic(pool, id);
  if (!row) {
    throw new Error("Failed to load image graphic after insert");
  }
  return row;
};
