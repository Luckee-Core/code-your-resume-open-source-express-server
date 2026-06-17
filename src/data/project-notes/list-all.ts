import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProjectNote } from "./types";
import { mapProjectNoteRow } from "./map-project-note-row";

/**
 * List all project notes (for AI generation context), newest first per project.
 */
export const listAllProjectNotes = async (supabase: SupabaseClient): Promise<ProjectNote[]> => {
  const { data, error } = await supabase
    .from("project_notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ listAllProjectNotes:", error.message);
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapProjectNoteRow(row));
};
