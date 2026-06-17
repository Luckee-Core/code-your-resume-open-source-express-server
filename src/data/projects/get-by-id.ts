import type { SupabaseClient } from "@supabase/supabase-js";
import type { Project } from "./types";
import { mapProjectRow } from "./map-project-row";

/**
 * Get a project by id.
 */
export const getProjectById = async (
  supabase: SupabaseClient,
  id: string,
): Promise<Project | null> => {
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("❌ getProjectById:", error.message);
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return mapProjectRow(data);
};
