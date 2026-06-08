import type { Request, Response } from "express";
import { requireCrmSupabaseClient } from "../../../data/crm/require-crm-supabase-client";
import { getJobNewsletterSourceById } from "../../../data/job-newsletter-sources";

/**
 * GET /api/data/job-newsletter-sources/get?id=
 */
export const handleJobNewsletterSourceGet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log("📥 GET /api/data/job-newsletter-sources/get");
  try {
    const id = typeof req.query.id === "string" ? req.query.id.trim() : "";
    if (!id) {
      res.status(400).json({ success: false, error: "id query param is required" });
      return;
    }

    const data = await getJobNewsletterSourceById(requireCrmSupabaseClient(), id);
    if (!data) {
      res.status(404).json({ success: false, error: "Newsletter source not found" });
      return;
    }

    console.log("📤 200 GET /api/data/job-newsletter-sources/get");
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to get newsletter source";
    console.error("❌ handleJobNewsletterSourceGet:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
