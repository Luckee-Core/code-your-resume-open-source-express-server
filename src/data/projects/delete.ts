import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Delete a project by id (cascades project_notes).
 */
export const deleteProject = async (supabase: SupabaseClient, id: string): Promise<void> => {
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    console.error("❌ deleteProject:", error.message);
    throw new Error(error.message);
  }
};
