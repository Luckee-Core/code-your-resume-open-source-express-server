import { Router } from "express";
import { handleUiErrorReport } from "./report";

/**
 * Router factory for `ui_errors` — POST /api/data/ui-errors/report
 */
export const createUiErrorsRouter = (): Router => {
  const router = Router();
  router.post("/report", handleUiErrorReport);
  return router;
};
