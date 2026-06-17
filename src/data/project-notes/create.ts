import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CreateProjectNoteInput, ProjectNote } from "./types";
import { mapProjectNoteRow } from "./map-project-note-row";

/**
 * Insert a project note row.
 */
export const createProjectNote = async (
  supabase: SupabaseClient,
  input: CreateProjectNoteInput,
): Promise<ProjectNote> => {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("project_notes")
    .insert({
      id: randomUUID(),
      project_id: input.projectId.trim(),
      body: input.body.trim(),
      created_at: now,
    })
    .select("*")
    .single();

  if (error) {
    console.error("❌ createProjectNote:", error.message);
    throw new Error(error.message);
  }

  return mapProjectNoteRow(data);
};
