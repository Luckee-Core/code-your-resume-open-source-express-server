import { Router } from "express";
import { handleLinkedInCertificationList } from "./list";

/**
 * LinkedIn certification routes under `/api/data/linkedin-certification`.
 */
export const createLinkedInCertificationRouter = (): Router => {
  const router = Router();
  router.get("/list", handleLinkedInCertificationList);
  return router;
};
