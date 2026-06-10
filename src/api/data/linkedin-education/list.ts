import type { Request, Response } from "express";
import { requireCrmSupabaseClient } from "../../../data/crm/require-crm-supabase-client";
import { listLinkedInEducationsByProfileId } from "../../../data/linkedin-educations";

/**
 * GET /api/data/linkedin-education/list?profileId=
 */
export const handleLinkedInEducationList = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log("📥 GET /api/data/linkedin-education/list");
  try {
    const profileId = typeof req.query.profileId === "string" ? req.query.profileId.trim() : "";
    if (!profileId) {
      res.status(400).json({ success: false, error: "profileId is required" });
      return;
    }

    const data = await listLinkedInEducationsByProfileId(requireCrmSupabaseClient(), profileId);
    console.log("📤 200 GET /api/data/linkedin-education/list");
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to list LinkedIn educations";
    console.error("❌ handleLinkedInEducationList:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
