import type { SupabaseClient } from "@supabase/supabase-js";
import type { Project, UpdateProjectInput } from "./types";
import { mapProjectRow } from "./map-project-row";

/**
 * Update a project by id.
 */
export const updateProject = async (
  supabase: SupabaseClient,
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

  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("❌ updateProject:", error.message);
    throw new Error(error.message);
  }

  return mapProjectRow(data);
};
