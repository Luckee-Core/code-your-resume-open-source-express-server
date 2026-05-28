import type { ImageGraphic, ImageGraphicRow } from "./types";
import { normalizeImageGraphic } from "./normalize-image-graphic";

/**
 * Maps a Supabase row to the API `ImageGraphic` shape.
 */
export const mapImageGraphicRow = (row: ImageGraphicRow): ImageGraphic | null => {
  return normalizeImageGraphic({
    id: row.id,
    title: row.title,
    canvasWidthPx: row.canvas_width_px,
    canvasHeightPx: row.canvas_height_px,
    metadata: row.metadata,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
};
