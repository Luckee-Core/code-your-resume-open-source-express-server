export const IMAGE_GRAPHIC_SELECT_COLUMNS =
  "id, title, job_id, canvas_width_px, canvas_height_px, metadata, created_at, updated_at";

export type ImageGraphic = {
  id: string;
  title: string;
  jobId: string;
  canvasWidthPx: number;
  canvasHeightPx: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type ImageGraphicRow = {
  id: string;
  title: string;
  job_id: string;
  canvas_width_px: number;
  canvas_height_px: number;
  metadata: unknown;
  created_at: string;
  updated_at: string;
};
