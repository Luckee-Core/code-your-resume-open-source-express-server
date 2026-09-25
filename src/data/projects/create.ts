import { randomUUID } from "node:crypto";
import type { Pool } from "pg";
import type { CreateProjectInput, Project, ProjectRow } from "./types";
import { mapProjectRow } from "./map-project-row";
import { insertRow } from "../../utils/postgres";

/**
 * Insert a project row.
 */
export const createProject = async (
  pool: Pool,
  input: CreateProjectInput,
): Promise<Project> => {
  const now = new Date().toISOString();
  const data = await insertRow<ProjectRow>(pool, "projects", {
    id: randomUUID(),
    business_name: input.businessName.trim(),
    description: input.description?.trim() ?? "",
    url: input.url?.trim() ?? "",
    duration: input.duration?.trim() ?? "",
    technologies: input.technologies ?? [],
    created_at: now,
    updated_at: now,
  });

  return mapProjectRow(data);
};
