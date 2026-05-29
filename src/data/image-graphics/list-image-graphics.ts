import type { SupabaseClient } from "@supabase/supabase-js";
import { IMAGE_GRAPHIC_SELECT_COLUMNS, type ImageGraphic, type ImageGraphicRow } from "./types";
import { mapImageGraphicRow } from "./map-image-graphic-row";

/**
 * Lists all image graphics (newest `updated_at` first).
 */
export const listImageGraphics = async (supabase: SupabaseClient): Promise<ImageGraphic[]> => {
  const { data, error } = await supabase
    .from("image_graphics")
    .select(IMAGE_GRAPHIC_SELECT_COLUMNS)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("❌ listImageGraphics:", error.message);
    throw new Error(error.message);
  }

  return (data ?? [])
    .map((row) => mapImageGraphicRow(row as ImageGraphicRow))
    .filter((g): g is ImageGraphic => g !== null);
};
