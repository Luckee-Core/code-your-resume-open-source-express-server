import type { ImageGraphic } from "./types";

const DEFAULT_CANVAS_W = 960;
const DEFAULT_CANVAS_H = 540;

const clampCanvas = (n: unknown, fallback: number): number => {
  if (typeof n !== "number" || !Number.isFinite(n)) return fallback;
  const rounded = Math.round(n);
  if (rounded < 64) return 64;
  if (rounded > 8192) return 8192;
  return rounded;
};

const isImageGraphicLike = (
  value: unknown,
): value is Omit<ImageGraphic, "canvasWidthPx" | "canvasHeightPx"> & {
  canvasWidthPx?: unknown;
  canvasHeightPx?: unknown;
} => {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.title === "string" &&
    typeof o.createdAt === "string" &&
    typeof o.updatedAt === "string" &&
    typeof o.metadata === "object" &&
    o.metadata !== null &&
    !Array.isArray(o.metadata)
  );
};

/**
 * Normalizes a graphic payload (canvas clamp, metadata).
 */
export const normalizeImageGraphic = (value: unknown): ImageGraphic | null => {
  if (!isImageGraphicLike(value)) return null;
  const o = value as ImageGraphic;
  return {
    id: o.id,
    title: o.title.trim() || "Untitled graphic",
    canvasWidthPx: clampCanvas(o.canvasWidthPx, DEFAULT_CANVAS_W),
    canvasHeightPx: clampCanvas(o.canvasHeightPx, DEFAULT_CANVAS_H),
    metadata: { ...o.metadata },
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
};
