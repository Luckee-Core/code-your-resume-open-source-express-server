import type { SupabaseClient } from "@supabase/supabase-js";
import { IMAGE_GRAPHIC_SELECT_COLUMNS, type ImageGraphic, type ImageGraphicRow } from "./types";
import { mapImageGraphicRow } from "./map-image-graphic-row";

/**
 * Returns one image graphic by id, or null when missing.
 */
export const getImageGraphic = async (
  supabase: SupabaseClient,
  id: string,
): Promise<ImageGraphic | null> => {
  const { data, error } = await supabase
    .from("image_graphics")
    .select(IMAGE_GRAPHIC_SELECT_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("❌ getImageGraphic:", error.message);
    throw new Error(error.message);
  }

  if (!data) return null;
  return mapImageGraphicRow(data as ImageGraphicRow);
};
