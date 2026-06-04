import type { SupabaseClient } from "@supabase/supabase-js";
import {
  JOB_QUESTION_ANSWER_SELECT_COLUMNS,
  type JobQuestionAnswer,
  type JobQuestionAnswerRow,
} from "./types";
import { mapJobQuestionAnswerRow } from "./map-job-question-answer-row";

/**
 * Lists job question answers for one job (by sort_order, then created_at).
 */
export const listJobQuestionAnswersByJobId = async (
  supabase: SupabaseClient,
  jobId: string,
): Promise<JobQuestionAnswer[]> => {
  const { data, error } = await supabase
    .from("job_question_answers")
    .select(JOB_QUESTION_ANSWER_SELECT_COLUMNS)
    .eq("job_id", jobId.trim())
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("❌ listJobQuestionAnswersByJobId:", error.message);
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapJobQuestionAnswerRow(row as JobQuestionAnswerRow));
};
