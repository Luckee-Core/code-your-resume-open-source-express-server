import { Router } from "express";
import { handleProjectNoteList } from "./list";
import { handleProjectNoteCreate } from "./create";
import { handleProjectNoteDelete } from "./delete";

/**
 * `/api/data/project-notes/*` action routes.
 */
export const createProjectNotesApiRouter = (): Router => {
  const router = Router();
  router.get("/list", handleProjectNoteList);
  router.post("/create", handleProjectNoteCreate);
  router.delete("/delete", handleProjectNoteDelete);
  return router;
};
