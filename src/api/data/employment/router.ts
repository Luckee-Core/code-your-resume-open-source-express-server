import { Router } from "express";
import { handleEmploymentList } from "./list";
import { handleEmploymentGet } from "./get";
import { handleEmploymentCreate } from "./create";
import { handleEmploymentUpdate } from "./update";
import { handleEmploymentDelete } from "./delete";

/**
 * `/api/data/employment/*` CRM routes for resume employment history rows.
 */
export const createEmploymentApiRouter = (): Router => {
  const router = Router();
  router.get("/list", handleEmploymentList);
  router.get("/get", handleEmploymentGet);
  router.post("/create", handleEmploymentCreate);
  router.patch("/update", handleEmploymentUpdate);
  router.delete("/delete", handleEmploymentDelete);
  return router;
};
