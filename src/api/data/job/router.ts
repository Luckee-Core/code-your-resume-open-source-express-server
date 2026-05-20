import { Router } from "express";
import { handleJobList } from "./list";
import { handleJobGet } from "./get";
import { handleJobCreate } from "./create";
import { handleJobCreateFromListingUrl } from "./create-from-listing-url";
import { handleJobUpdate } from "./update";
import { handleJobDelete } from "./delete";
import { handleJobImportListing } from "./import-listing";
import { handleJobImportDescription } from "./import-description";

export const createJobApiRouter = (): Router => {
  const router = Router();
  router.get("/list", handleJobList);
  router.get("/get", handleJobGet);
  router.post("/create", handleJobCreate);
  router.post("/create-from-listing-url", handleJobCreateFromListingUrl);
  router.post("/import-listing", handleJobImportListing);
  router.post("/import-description", handleJobImportDescription);
  router.patch("/update", handleJobUpdate);
  router.delete("/delete", handleJobDelete);
  return router;
};
