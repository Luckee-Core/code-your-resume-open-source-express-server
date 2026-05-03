import { Router } from "express";
import { handleEmployeeList } from "./list";
import { handleEmployeeGet } from "./get";
import { handleEmployeeCreate } from "./create";
import { handleEmployeeUpdate } from "./update";
import { handleEmployeeDelete } from "./delete";

export const createEmployeeApiRouter = (): Router => {
  const router = Router();
  router.get("/list", handleEmployeeList);
  router.get("/get", handleEmployeeGet);
  router.post("/create", handleEmployeeCreate);
  router.patch("/update", handleEmployeeUpdate);
  router.delete("/delete", handleEmployeeDelete);
  return router;
};
