import type { Pool } from "pg";
import type { Project, ProjectRow, UpdateProjectInput } from "./types";
import { mapProjectRow } from "./map-project-row";
import { selectOneFrom, updateRows } from "../../utils/postgres";

/**
 * Update a project by id.
 */
export const updateProject = async (
  pool: Pool,
  id: string,
  input: UpdateProjectInput,
): Promise<Project> => {
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.businessName !== undefined) updates.business_name = input.businessName.trim();
  if (input.description !== undefined) updates.description = input.description.trim();
  if (input.url !== undefined) updates.url = input.url.trim();
  if (input.duration !== undefined) updates.duration = input.duration.trim();
  if (input.technologies !== undefined) updates.technologies = input.technologies;
  if (input.websiteResearchSummary !== undefined) {
    updates.website_research_summary = input.websiteResearchSummary.trim();
  }
  if (input.websiteResearchCompletedAt !== undefined) {
    updates.website_research_completed_at =
      input.websiteResearchCompletedAt.trim() || null;
  }

  await updateRows(pool, "projects", updates, { id });
  const data = await selectOneFrom<ProjectRow>(pool, "projects", { eq: { id } });
  if (!data) {
    throw new Error("Failed to load project after update");
  }

  return mapProjectRow(data);
};
