import type { Request, Response } from "express";
import { requireCrmSupabaseClient } from "../../../data/crm/require-crm-supabase-client";
import { syncTenantLinkedInProfileFromApify } from "../../../services/linkedin-profile";

/**
 * POST /api/data/linkedin-profile/sync-tenant
 */
export const handleLinkedInProfileSyncTenant = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  console.log("📥 POST /api/data/linkedin-profile/sync-tenant");
  try {
    const result = await syncTenantLinkedInProfileFromApify(requireCrmSupabaseClient());

    if ("error" in result) {
      const status = result.error.includes("not configured") ? 400 : 500;
      res.status(status).json({ success: false, error: result.error });
      return;
    }

    console.log("📤 200 POST /api/data/linkedin-profile/sync-tenant");
    res.status(200).json({ success: true, data: result });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to sync tenant LinkedIn profile";
    console.error("❌ handleLinkedInProfileSyncTenant:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
