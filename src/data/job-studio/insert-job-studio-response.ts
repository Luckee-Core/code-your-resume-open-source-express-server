import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Persist parsed Job Studio coach payload (content, coachSections).
 */
export const insertJobStudioResponse = async (
  supabase: SupabaseClient,
  id: string,
  structured: unknown,
): Promise<void> => {
  const now = new Date().toISOString();
  const { error } = await supabase.from("job_studio_responses").insert({
    id,
    structured,
    created_at: now,
    updated_at: now,
  });

  if (error) {
    console.error("❌ insertJobStudioResponse:", error);
    throw new Error(error.message);
  }
};
