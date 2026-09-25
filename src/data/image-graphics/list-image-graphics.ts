import type { Pool } from "pg";
import { IMAGE_GRAPHIC_SELECT_COLUMNS, type ImageGraphic, type ImageGraphicRow } from "./types";
import { mapImageGraphicRow } from "./map-image-graphic-row";
import { selectRowsFrom } from "../../utils/postgres";

/**
 * Lists all image graphics (newest `updated_at` first).
 */
export const listImageGraphics = async (pool: Pool): Promise<ImageGraphic[]> => {
  const rows = await selectRowsFrom<ImageGraphicRow>(pool, "image_graphics", {
    columns: IMAGE_GRAPHIC_SELECT_COLUMNS,
    order: [{ column: "updated_at", ascending: false }],
  });

  return rows
    .map((row) => mapImageGraphicRow(row))
    .filter((g): g is ImageGraphic => g !== null);
};
