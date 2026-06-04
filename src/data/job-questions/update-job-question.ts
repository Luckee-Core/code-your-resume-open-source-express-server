import type { SupabaseClient } from "@supabase/supabase-js";
import type { JobQuestion } from "./types";
import { getJobQuestion } from "./get-job-question";

/**
 * Updates a job question prompt.
 */
export const updateJobQuestion = async (
  supabase: SupabaseClient,
  id: string,
  patch: Partial<Pick<JobQuestion, "prompt">>,
): Promise<JobQuestion | null> => {
  const prev = await getJobQuestion(supabase, id);
  if (!prev) {
    return null;
  }

  const prompt = patch.prompt !== undefined ? patch.prompt.trim() : prev.prompt;
  if (!prompt) {
    throw new Error("prompt is required");
  }

  const updatedAt = new Date().toISOString();
  const { error } = await supabase
    .from("job_questions")
    .update({ prompt, updated_at: updatedAt })
    .eq("id", id);

  if (error) {
    console.error("❌ updateJobQuestion:", error.message);
    throw new Error(error.message);
  }

  return getJobQuestion(supabase, id);
};
