import type { Pool } from "pg";
import type { ImageGraphic } from "./types";
import { getImageGraphic } from "./get-image-graphic";
import { updateRows } from "../../utils/postgres";

/**
 * Merges TSX into `metadata.studioDraft` for one graphic.
 */
export const patchImageGraphicStudioDraft = async (
  pool: Pool,
  graphicId: string,
  tsx: string,
): Promise<ImageGraphic | null> => {
  const prev = await getImageGraphic(pool, graphicId);
  if (!prev) return null;

  const metadata: Record<string, unknown> = {
    ...prev.metadata,
    studioDraft: { tsx },
  };
  const updatedAt = new Date().toISOString();

  await updateRows(
    pool,
    "image_graphics",
    { metadata, updated_at: updatedAt },
    { id: graphicId },
  );

  return getImageGraphic(pool, graphicId);
};
