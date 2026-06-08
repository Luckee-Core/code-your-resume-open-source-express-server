import { Router } from "express";
import { handleJobNewsletterSourceList } from "./list";
import { handleJobNewsletterSourceGet } from "./get";
import { handleJobNewsletterSourceCreate } from "./create";
import { handleJobNewsletterSourceUpdate } from "./update";

/**
 * Job newsletter source config routes under `/api/data/job-newsletter-sources`.
 */
export const createJobNewsletterSourcesRouter = (): Router => {
  const router = Router();
  router.get("/list", handleJobNewsletterSourceList);
  router.get("/get", handleJobNewsletterSourceGet);
  router.post("/create", handleJobNewsletterSourceCreate);
  router.patch("/update", handleJobNewsletterSourceUpdate);
  return router;
};
