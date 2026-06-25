import { Router } from "express";
import { handleQuickApplyRun } from "./run";

/**
 * Quick apply pipeline routes under `/api/data/quick-apply`.
 */
export const createQuickApplyRouter = (): Router => {
  const router = Router();
  router.post("/run", handleQuickApplyRun);
  return router;
};
