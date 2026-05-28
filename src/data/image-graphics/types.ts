export type ImageGraphic = {
  id: string;
  title: string;
  canvasWidthPx: number;
  canvasHeightPx: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type ImageGraphicRow = {
  id: string;
  title: string;
  canvas_width_px: number;
  canvas_height_px: number;
  metadata: unknown;
  created_at: string;
  updated_at: string;
};
