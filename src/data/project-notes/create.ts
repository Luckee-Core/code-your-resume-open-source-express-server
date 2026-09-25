import { randomUUID } from "node:crypto";
import type { Pool } from "pg";
import type { CreateProjectNoteInput, ProjectNote, ProjectNoteRow } from "./types";
import { mapProjectNoteRow } from "./map-project-note-row";
import { insertRow } from "../../utils/postgres";

/**
 * Insert a project note row.
 */
export const createProjectNote = async (
  pool: Pool,
  input: CreateProjectNoteInput,
): Promise<ProjectNote> => {
  const now = new Date().toISOString();
  const data = await insertRow<ProjectNoteRow>(pool, "project_notes", {
    id: randomUUID(),
    project_id: input.projectId.trim(),
    body: input.body.trim(),
    created_at: now,
  });

  return mapProjectNoteRow(data);
};
