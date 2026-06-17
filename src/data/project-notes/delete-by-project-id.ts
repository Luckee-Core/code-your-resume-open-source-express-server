import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Delete all project notes for a project id.
 */
export const deleteProjectNotesByProjectId = async (
  supabase: SupabaseClient,
  projectId: string,
): Promise<void> => {
  const { error } = await supabase.from("project_notes").delete().eq("project_id", projectId.trim());

  if (error) {
    console.error("❌ deleteProjectNotesByProjectId:", error.message);
    throw new Error(error.message);
  }
};
