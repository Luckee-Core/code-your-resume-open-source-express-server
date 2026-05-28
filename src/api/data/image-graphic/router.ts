import { Router } from "express";
import { handleImageGraphicList } from "./list";
import { handleImageGraphicGet } from "./get";
import { handleImageGraphicCreate } from "./create";
import { handleImageGraphicPatchStudioDraft } from "./patch-studio-draft";
import { handleImageGraphicUpdateDetails } from "./update-details";
import { handleImageGraphicDelete } from "./delete";

/**
 * `/api/data/image-graphic/*` — Graphics Studio CRUD (Supabase `image_graphics`).
 */
export const createImageGraphicApiRouter = (): Router => {
  const router = Router();
  router.get("/list", handleImageGraphicList);
  router.get("/get", handleImageGraphicGet);
  router.post("/create", handleImageGraphicCreate);
  router.patch("/patch-studio-draft", handleImageGraphicPatchStudioDraft);
  router.patch("/update-details", handleImageGraphicUpdateDetails);
  router.delete("/delete", handleImageGraphicDelete);
  return router;
};
