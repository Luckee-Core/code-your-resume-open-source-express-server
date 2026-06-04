import { Router } from "express";
import { handleJobQuestionAnswerList } from "./list";
import { handleJobQuestionAnswerGet } from "./get";
import { handleJobQuestionAnswerCreate } from "./create";
import { handleJobQuestionAnswerUpdate } from "./update";
import { handleJobQuestionAnswerDelete } from "./delete";

/**
 * Per-job question answer routes under `/api/data/job-question-answers`.
 */
export const createJobQuestionAnswersRouter = (): Router => {
  const router = Router();
  router.get("/list", handleJobQuestionAnswerList);
  router.get("/get", handleJobQuestionAnswerGet);
  router.post("/create", handleJobQuestionAnswerCreate);
  router.patch("/update", handleJobQuestionAnswerUpdate);
  router.delete("/delete", handleJobQuestionAnswerDelete);
  return router;
};
