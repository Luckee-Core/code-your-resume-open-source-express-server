import type { Pool } from "pg";
import type { Project, ProjectRow } from "./types";
import { mapProjectRow } from "./map-project-row";
import { selectRowsFrom } from "../../utils/postgres";

/**
 * List all projects, newest first.
 */
export const listProjects = async (pool: Pool): Promise<Project[]> => {
  const rows = await selectRowsFrom<ProjectRow>(pool, "projects", {
    order: [{ column: "created_at", ascending: false }],
  });

  return rows.map((row) => mapProjectRow(row));
};
