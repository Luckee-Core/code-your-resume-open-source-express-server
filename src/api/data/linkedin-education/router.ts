import { Router } from "express";
import { handleLinkedInEducationList } from "./list";

/**
 * LinkedIn education routes under `/api/data/linkedin-education`.
 */
export const createLinkedInEducationRouter = (): Router => {
  const router = Router();
  router.get("/list", handleLinkedInEducationList);
  return router;
};
