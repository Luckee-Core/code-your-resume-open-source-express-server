import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Deletes a job question answer (unlink question from job).
 */
export const deleteJobQuestionAnswer = async (
  supabase: SupabaseClient,
  id: string,
): Promise<boolean> => {
  const { error, count } = await supabase
    .from("job_question_answers")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) {
    console.error("❌ deleteJobQuestionAnswer:", error.message);
    throw new Error(error.message);
  }

  return (count ?? 0) > 0;
};
