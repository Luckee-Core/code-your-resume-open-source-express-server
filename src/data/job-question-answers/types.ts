export type JobQuestionAnswer = {
  id: string;
  jobId: string;
  jobQuestionId: string;
  answer: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type JobQuestionAnswerRow = {
  id: string;
  job_id: string;
  job_question_id: string;
  answer: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export const JOB_QUESTION_ANSWER_SELECT_COLUMNS =
  "id, job_id, job_question_id, answer, sort_order, created_at, updated_at";
