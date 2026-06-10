import { Router } from "express";
import { handleLinkedInProfileGetTenant } from "./get-tenant";
import { handleLinkedInProfileCreateTenant } from "./create-tenant";
import { handleLinkedInProfileUpdateTenantUrl } from "./update-tenant-url";
import { handleLinkedInProfileSyncTenant } from "./sync-tenant";

/**
 * LinkedIn profile routes under `/api/data/linkedin-profile`.
 */
export const createLinkedInProfileRouter = (): Router => {
  const router = Router();
  router.get("/get-tenant", handleLinkedInProfileGetTenant);
  router.post("/create-tenant", handleLinkedInProfileCreateTenant);
  router.patch("/update-tenant-url", handleLinkedInProfileUpdateTenantUrl);
  router.post("/sync-tenant", handleLinkedInProfileSyncTenant);
  return router;
};
