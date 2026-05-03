import { Router } from "express";
import { handleJobApplicationList } from "./list";
import { handleJobApplicationGet } from "./get";
import { handleJobApplicationCreate } from "./create";
import { handleJobApplicationUpdate } from "./update";
import { handleJobApplicationDelete } from "./delete";

export const createJobApplicationApiRouter = (): Router => {
  const router = Router();
  router.get("/list", handleJobApplicationList);
  router.get("/get", handleJobApplicationGet);
  router.post("/create", handleJobApplicationCreate);
  router.patch("/update", handleJobApplicationUpdate);
  router.delete("/delete", handleJobApplicationDelete);
  return router;
};
