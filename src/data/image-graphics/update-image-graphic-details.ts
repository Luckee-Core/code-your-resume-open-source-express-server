import type { SupabaseClient } from "@supabase/supabase-js";
import type { ImageGraphic } from "./types";
import { getImageGraphic } from "./get-image-graphic";

/**
 * Updates title and canvas dimensions for one graphic.
 */
export const updateImageGraphicDetails = async (
  supabase: SupabaseClient,
  graphicId: string,
  patch: { title: string; canvasWidthPx: number; canvasHeightPx: number },
): Promise<ImageGraphic | null> => {
  const prev = await getImageGraphic(supabase, graphicId);
  if (!prev) return null;

  const updatedAt = new Date().toISOString();
  const { error } = await supabase
    .from("image_graphics")
    .update({
      title: patch.title.trim() || "Untitled graphic",
      canvas_width_px: patch.canvasWidthPx,
      canvas_height_px: patch.canvasHeightPx,
      updated_at: updatedAt,
    })
    .eq("id", graphicId);

  if (error) {
    console.error("❌ updateImageGraphicDetails:", error.message);
    throw new Error(error.message);
  }

  return getImageGraphic(supabase, graphicId);
};
