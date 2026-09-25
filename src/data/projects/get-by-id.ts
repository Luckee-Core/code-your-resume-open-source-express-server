import type { Pool } from "pg";
import type { Project, ProjectRow } from "./types";
import { mapProjectRow } from "./map-project-row";
import { selectOneFrom } from "../../utils/postgres";

/**
 * Get a project by id.
 */
export const getProjectById = async (
  pool: Pool,
  id: string,
): Promise<Project | null> => {
  const data = await selectOneFrom<ProjectRow>(pool, "projects", { eq: { id } });
  return data ? mapProjectRow(data) : null;
};
