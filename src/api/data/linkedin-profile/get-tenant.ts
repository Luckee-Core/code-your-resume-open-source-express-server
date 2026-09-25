import type { Request, Response } from "express";
import { requireCrmPgPool } from "../../../data/crm/require-crm-pg-pool";
import { getTenantLinkedInProfile } from "../../../data/linkedin-profiles";

/**
 * GET /api/data/linkedin-profile/get-tenant
 */
export const handleLinkedInProfileGetTenant = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  console.log("📥 GET /api/data/linkedin-profile/get-tenant");
  try {
    const data = await getTenantLinkedInProfile(requireCrmPgPool());
    console.log("📤 200 GET /api/data/linkedin-profile/get-tenant");
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load tenant LinkedIn profile";
    console.error("❌ handleLinkedInProfileGetTenant:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
