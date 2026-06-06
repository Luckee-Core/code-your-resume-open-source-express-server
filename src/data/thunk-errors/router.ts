import { Router } from "express";
import { handleThunkErrorReport } from "./report";

/**
 * Router factory for `thunk_errors` — POST /api/data/thunk-errors/report
 */
export const createThunkErrorsRouter = (): Router => {
  const router = Router();
  router.post("/report", handleThunkErrorReport);
  return router;
};
