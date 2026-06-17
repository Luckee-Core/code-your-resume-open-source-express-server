import type { SupabaseClient } from "@supabase/supabase-js";
import type { Project } from "./types";
import { mapProjectRow } from "./map-project-row";

/**
 * List all projects, newest first.
 */
export const listProjects = async (supabase: SupabaseClient): Promise<Project[]> => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ listProjects:", error.message);
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapProjectRow(row));
};
