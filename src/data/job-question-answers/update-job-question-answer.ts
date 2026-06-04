import type { SupabaseClient } from "@supabase/supabase-js";
import type { JobQuestionAnswer } from "./types";
import { getJobQuestionAnswer } from "./get-job-question-answer";

/**
 * Updates a job question answer row.
 */
export const updateJobQuestionAnswer = async (
  supabase: SupabaseClient,
  id: string,
  patch: Partial<Pick<JobQuestionAnswer, "answer" | "sortOrder">>,
): Promise<JobQuestionAnswer | null> => {
  const prev = await getJobQuestionAnswer(supabase, id);
  if (!prev) {
    return null;
  }

  const answer = patch.answer !== undefined ? patch.answer.trim() : prev.answer;
  const sortOrder = patch.sortOrder !== undefined ? patch.sortOrder : prev.sortOrder;
  const updatedAt = new Date().toISOString();

  const { error } = await supabase
    .from("job_question_answers")
    .update({
      answer,
      sort_order: sortOrder,
      updated_at: updatedAt,
    })
    .eq("id", id);

  if (error) {
    console.error("❌ updateJobQuestionAnswer:", error.message);
    throw new Error(error.message);
  }

  return getJobQuestionAnswer(supabase, id);
};
