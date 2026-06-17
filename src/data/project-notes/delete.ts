import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Delete a project note by id.
 */
export const deleteProjectNote = async (supabase: SupabaseClient, id: string): Promise<void> => {
  const { error } = await supabase.from("project_notes").delete().eq("id", id);

  if (error) {
    console.error("❌ deleteProjectNote:", error.message);
    throw new Error(error.message);
  }
};
