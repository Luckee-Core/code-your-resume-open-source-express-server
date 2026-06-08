import type { Request, Response } from "express";
import { requireCrmSupabaseClient } from "../../../data/crm/require-crm-supabase-client";
import { updateJobNewsletterSource } from "../../../data/job-newsletter-sources";
import type { UpdateJobNewsletterSourceInput } from "../../../data/job-newsletter-sources";

type Body = UpdateJobNewsletterSourceInput & { id?: unknown };

/**
 * PATCH /api/data/job-newsletter-sources/update
 */
export const handleJobNewsletterSourceUpdate = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log("📥 PATCH /api/data/job-newsletter-sources/update");
  try {
    const body = req.body as Body;
    const id = typeof body.id === "string" ? body.id.trim() : "";
    if (!id) {
      res.status(400).json({ success: false, error: "id is required" });
      return;
    }

    const patch: UpdateJobNewsletterSourceInput = {};
    if (typeof body.name === "string") patch.name = body.name;
    if (typeof body.sender_email === "string") patch.sender_email = body.sender_email;
    if (typeof body.enabled === "boolean") patch.enabled = body.enabled;
    if (typeof body.parse_instructions === "string") {
      patch.parse_instructions = body.parse_instructions;
    }

    const data = await updateJobNewsletterSource(requireCrmSupabaseClient(), id, patch);
    console.log("📤 200 PATCH /api/data/job-newsletter-sources/update");
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update newsletter source";
    console.error("❌ handleJobNewsletterSourceUpdate:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
