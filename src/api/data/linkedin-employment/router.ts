import { Router } from "express";
import { handleLinkedInEmploymentList } from "./list";

/**
 * LinkedIn employment routes under `/api/data/linkedin-employment`.
 */
export const createLinkedInEmploymentRouter = (): Router => {
  const router = Router();
  router.get("/list", handleLinkedInEmploymentList);
  return router;
};
