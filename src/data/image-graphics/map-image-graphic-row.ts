import type { ImageGraphic, ImageGraphicRow } from "./types";
import { normalizeImageGraphic } from "./normalize-image-graphic";

const metadataRecord = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return { ...(value as Record<string, unknown>) };
};

const resolveJobId = (row: ImageGraphicRow): string => {
  const fromColumn = typeof row.job_id === "string" ? row.job_id.trim() : "";
  if (fromColumn) return fromColumn;
  const meta = metadataRecord(row.metadata);
  const legacy = typeof meta.jobId === "string" ? meta.jobId.trim() : "";
  return legacy;
};

/**
 * Maps a Supabase row to the API `ImageGraphic` shape.
 */
export const mapImageGraphicRow = (row: ImageGraphicRow): ImageGraphic | null => {
  return normalizeImageGraphic({
    id: row.id,
    title: row.title,
    jobId: resolveJobId(row),
    canvasWidthPx: row.canvas_width_px,
    canvasHeightPx: row.canvas_height_px,
    metadata: row.metadata,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
};
