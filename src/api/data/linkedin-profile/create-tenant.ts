import type { Request, Response } from "express";
import { requireCrmSupabaseClient } from "../../../data/crm/require-crm-supabase-client";
import { getTenantLinkedInProfile, insertTenantLinkedInProfile } from "../../../data/linkedin-profiles";
import { isLinkedInProfileUrl, normalizeLinkedInProfileUrl } from "../../../utils/linkedin-profile";

type Body = {
  linkedinUrl?: unknown;
};

/**
 * POST /api/data/linkedin-profile/create-tenant
 */
export const handleLinkedInProfileCreateTenant = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log("📥 POST /api/data/linkedin-profile/create-tenant");
  try {
    const body = req.body as Body;
    const linkedinUrl = normalizeLinkedInProfileUrl(
      typeof body.linkedinUrl === "string" ? body.linkedinUrl : "",
    );

    if (!linkedinUrl) {
      res.status(400).json({ success: false, error: "linkedinUrl is required" });
      return;
    }

    if (!isLinkedInProfileUrl(linkedinUrl)) {
      res.status(400).json({
        success: false,
        error: "linkedinUrl must be a LinkedIn profile URL (linkedin.com/in/…)",
      });
      return;
    }

    const existing = await getTenantLinkedInProfile(requireCrmSupabaseClient());
    if (existing) {
      res.status(400).json({ success: false, error: "Tenant LinkedIn profile already exists" });
      return;
    }

    const data = await insertTenantLinkedInProfile(requireCrmSupabaseClient(), { linkedinUrl });
    console.log("📤 200 POST /api/data/linkedin-profile/create-tenant");
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create tenant LinkedIn profile";
    console.error("❌ handleLinkedInProfileCreateTenant:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
