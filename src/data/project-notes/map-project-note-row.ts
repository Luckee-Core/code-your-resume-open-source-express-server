import type { ProjectNote, ProjectNoteRow } from "./types";
import { toIsoTimestampString } from "../../utils/crm/to-iso-timestamp-string";

/**
 * Maps a Supabase `project_notes` row to the `ProjectNote` type.
 */
export const mapProjectNoteRow = (row: ProjectNoteRow): ProjectNote => ({
  id: row.id,
  projectId: row.project_id,
  body: row.body ?? "",
  createdAt: toIsoTimestampString(row.created_at),
});
