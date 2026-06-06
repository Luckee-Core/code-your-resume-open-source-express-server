import { Router } from "express";
import { handleApiErrorReport } from "./report";

/**
 * Router factory for `api_errors` — POST /api/data/api-errors/report
 */
export const createApiErrorsRouter = (): Router => {
  const router = Router();
  router.post("/report", handleApiErrorReport);
  return router;
};
