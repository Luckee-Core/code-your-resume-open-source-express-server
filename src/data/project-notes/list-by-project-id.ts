import type { Pool } from "pg";
import type { ProjectNote, ProjectNoteRow } from "./types";
import { mapProjectNoteRow } from "./map-project-note-row";
import { selectRowsFrom } from "../../utils/postgres";

/**
 * List notes for a project, newest first.
 */
export const listProjectNotesByProjectId = async (
  pool: Pool,
  projectId: string,
): Promise<ProjectNote[]> => {
  const rows = await selectRowsFrom<ProjectNoteRow>(pool, "project_notes", {
    eq: { project_id: projectId },
    order: [{ column: "created_at", ascending: false }],
  });

  return rows.map((row) => mapProjectNoteRow(row));
};
