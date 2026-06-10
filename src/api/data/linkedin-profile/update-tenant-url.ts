import type { Request, Response } from "express";
import { requireCrmSupabaseClient } from "../../../data/crm/require-crm-supabase-client";
import { getTenantLinkedInProfile, updateLinkedInProfile } from "../../../data/linkedin-profiles";
import { isLinkedInProfileUrl, normalizeLinkedInProfileUrl } from "../../../utils/linkedin-profile";

type Body = {
  linkedinUrl?: unknown;
};

/**
 * PATCH /api/data/linkedin-profile/update-tenant-url
 */
export const handleLinkedInProfileUpdateTenantUrl = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log("📥 PATCH /api/data/linkedin-profile/update-tenant-url");
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

    const tenant = await getTenantLinkedInProfile(requireCrmSupabaseClient());
    if (!tenant) {
      res.status(400).json({ success: false, error: "Tenant LinkedIn profile is not configured" });
      return;
    }

    const data = await updateLinkedInProfile(requireCrmSupabaseClient(), tenant.id, {
      linkedinUrl,
    });

    if (!data) {
      res.status(500).json({ success: false, error: "Failed to update tenant LinkedIn profile" });
      return;
    }

    console.log("📤 200 PATCH /api/data/linkedin-profile/update-tenant-url");
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update tenant LinkedIn profile URL";
    console.error("❌ handleLinkedInProfileUpdateTenantUrl:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
