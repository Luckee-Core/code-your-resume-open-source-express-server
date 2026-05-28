import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Deletes one image graphic by id. Returns false when no row matched.
 */
export const deleteImageGraphic = async (
  supabase: SupabaseClient,
  graphicId: string,
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("image_graphics")
    .delete()
    .eq("id", graphicId)
    .select("id");

  if (error) {
    console.error("❌ deleteImageGraphic:", error.message);
    throw new Error(error.message);
  }

  return (data?.length ?? 0) > 0;
};
