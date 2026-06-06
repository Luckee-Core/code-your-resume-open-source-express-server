import { Router } from "express";
import { getApiDocsJsonHandler } from "./routes/get-api-docs-json-handler";

/**
 * Creates the API docs router (catalog JSON only).
 */
export const createApiDocsRouter = (): Router => {
  const router = Router();
  router.get("/api-docs.json", getApiDocsJsonHandler);
  return router;
};
