import type { Pool } from "pg";
import type { ProjectNote, ProjectNoteRow } from "./types";
import { mapProjectNoteRow } from "./map-project-note-row";
import { selectRowsFrom } from "../../utils/postgres";

/**
 * List all project notes (for AI generation context), newest first per project.
 */
export const listAllProjectNotes = async (pool: Pool): Promise<ProjectNote[]> => {
  const rows = await selectRowsFrom<ProjectNoteRow>(pool, "project_notes", {
    order: [{ column: "created_at", ascending: false }],
  });

  return rows.map((row) => mapProjectNoteRow(row));
};
