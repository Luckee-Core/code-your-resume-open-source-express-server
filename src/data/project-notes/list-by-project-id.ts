import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProjectNote } from "./types";
import { mapProjectNoteRow } from "./map-project-note-row";

/**
 * List notes for a project, newest first.
 */
export const listProjectNotesByProjectId = async (
  supabase: SupabaseClient,
  projectId: string,
): Promise<ProjectNote[]> => {
  const { data, error } = await supabase
    .from("project_notes")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ listProjectNotesByProjectId:", error.message);
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapProjectNoteRow(row));
};
