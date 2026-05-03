import { Router } from "express";
import { handleCompanyList } from "./list";
import { handleCompanyGet } from "./get";
import { handleCompanyCreate } from "./create";
import { handleCompanyUpdate } from "./update";
import { handleCompanyDelete } from "./delete";
import { handleCompanyDiscoverSitePageUrls } from "./discover-site-page-urls";
import { handleCompanyWebsiteResearch } from "./website-research";

/**
 * `/api/data/company/*` action routes (list, get, create, update, delete).
 */
export const createCompanyApiRouter = (): Router => {
  const router = Router();
  router.get("/list", handleCompanyList);
  router.get("/get", handleCompanyGet);
  router.post("/create", handleCompanyCreate);
  router.post("/discover-site-page-urls", handleCompanyDiscoverSitePageUrls);
  router.post("/website-research", handleCompanyWebsiteResearch);
  router.patch("/update", handleCompanyUpdate);
  router.delete("/delete", handleCompanyDelete);
  return router;
};
