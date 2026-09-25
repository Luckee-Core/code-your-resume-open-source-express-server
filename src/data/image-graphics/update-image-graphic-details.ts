import type { Pool } from "pg";
import type { ImageGraphic } from "./types";
import { getImageGraphic } from "./get-image-graphic";
import { updateRows } from "../../utils/postgres";

/**
 * Updates title and canvas dimensions for one graphic.
 */
export const updateImageGraphicDetails = async (
  pool: Pool,
  graphicId: string,
  patch: { title: string; canvasWidthPx: number; canvasHeightPx: number },
): Promise<ImageGraphic | null> => {
  const prev = await getImageGraphic(pool, graphicId);
  if (!prev) return null;

  const updatedAt = new Date().toISOString();
  await updateRows(
    pool,
    "image_graphics",
    {
      title: patch.title.trim() || "Untitled graphic",
      canvas_width_px: patch.canvasWidthPx,
      canvas_height_px: patch.canvasHeightPx,
      updated_at: updatedAt,
    },
    { id: graphicId },
  );

  return getImageGraphic(pool, graphicId);
};
