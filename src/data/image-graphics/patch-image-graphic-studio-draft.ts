import type { SupabaseClient } from "@supabase/supabase-js";
import type { ImageGraphic } from "./types";
import { getImageGraphic } from "./get-image-graphic";

/**
 * Merges TSX into `metadata.studioDraft` for one graphic.
 */
export const patchImageGraphicStudioDraft = async (
  supabase: SupabaseClient,
  graphicId: string,
  tsx: string,
): Promise<ImageGraphic | null> => {
  const prev = await getImageGraphic(supabase, graphicId);
  if (!prev) return null;

  const metadata: Record<string, unknown> = {
    ...prev.metadata,
    studioDraft: { tsx },
  };
  const updatedAt = new Date().toISOString();

  const { error } = await supabase
    .from("image_graphics")
    .update({ metadata, updated_at: updatedAt })
    .eq("id", graphicId);

  if (error) {
    console.error("❌ patchImageGraphicStudioDraft:", error.message);
    throw new Error(error.message);
  }

  return getImageGraphic(supabase, graphicId);
};
