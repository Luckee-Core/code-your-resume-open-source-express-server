import type { Request, Response } from "express";
import { requireCrmSupabaseClient } from "../../../data/crm/require-crm-supabase-client";
import { listJobNewsletterSources } from "../../../data/job-newsletter-sources";

/**
 * GET /api/data/job-newsletter-sources/list
 */
export const handleJobNewsletterSourceList = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  console.log("📥 GET /api/data/job-newsletter-sources/list");
  try {
    const data = await listJobNewsletterSources(requireCrmSupabaseClient());
    console.log("📤 200 GET /api/data/job-newsletter-sources/list");
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to list newsletter sources";
    console.error("❌ handleJobNewsletterSourceList:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
