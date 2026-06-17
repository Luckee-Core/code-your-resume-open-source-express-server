import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CreateProjectInput, Project } from "./types";
import { mapProjectRow } from "./map-project-row";

/**
 * Insert a project row.
 */
export const createProject = async (
  supabase: SupabaseClient,
  input: CreateProjectInput,
): Promise<Project> => {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      id: randomUUID(),
      business_name: input.businessName.trim(),
      description: input.description?.trim() ?? "",
      url: input.url?.trim() ?? "",
      duration: input.duration?.trim() ?? "",
      technologies: input.technologies ?? [],
      created_at: now,
      updated_at: now,
    })
    .select("*")
    .single();

  if (error) {
    console.error("❌ createProject:", error.message);
    throw new Error(error.message);
  }

  return mapProjectRow(data);
};
