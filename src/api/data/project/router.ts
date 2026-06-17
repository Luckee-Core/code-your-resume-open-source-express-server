import { Router } from "express";
import { handleProjectList } from "./list";
import { handleProjectGet } from "./get";
import { handleProjectCreate } from "./create";
import { handleProjectUpdate } from "./update";
import { handleProjectDelete } from "./delete";
import { handleProjectSynthesizeNotes } from "./synthesize-notes";
import { handleProjectWebsiteResearch } from "./website-research";

/**
 * `/api/data/project/*` action routes.
 */
export const createProjectApiRouter = (): Router => {
  const router = Router();
  router.get("/list", handleProjectList);
  router.get("/get", handleProjectGet);
  router.post("/create", handleProjectCreate);
  router.patch("/update", handleProjectUpdate);
  router.delete("/delete", handleProjectDelete);
  router.post("/synthesize-notes", handleProjectSynthesizeNotes);
  router.post("/website-research", handleProjectWebsiteResearch);
  return router;
};
