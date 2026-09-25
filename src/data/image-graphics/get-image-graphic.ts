import type { Pool } from "pg";
import { IMAGE_GRAPHIC_SELECT_COLUMNS, type ImageGraphic, type ImageGraphicRow } from "./types";
import { mapImageGraphicRow } from "./map-image-graphic-row";
import { selectOneFrom } from "../../utils/postgres";

/**
 * Returns one image graphic by id, or null when missing.
 */
export const getImageGraphic = async (
  pool: Pool,
  id: string,
): Promise<ImageGraphic | null> => {
  const data = await selectOneFrom<ImageGraphicRow>(pool, "image_graphics", {
    columns: IMAGE_GRAPHIC_SELECT_COLUMNS,
    eq: { id },
  });

  if (!data) return null;
  return mapImageGraphicRow(data);
};
