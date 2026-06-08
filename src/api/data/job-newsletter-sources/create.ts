import type { Request, Response } from "express";
import { requireCrmSupabaseClient } from "../../../data/crm/require-crm-supabase-client";
import { createJobNewsletterSource } from "../../../data/job-newsletter-sources";

type Body = {
  name?: unknown;
  sender_email?: unknown;
  enabled?: unknown;
  parse_instructions?: unknown;
};

/**
 * POST /api/data/job-newsletter-sources/create
 */
export const handleJobNewsletterSourceCreate = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log("📥 POST /api/data/job-newsletter-sources/create");
  try {
    const body = req.body as Body;
    const name = typeof body.name === "string" ? body.name : "";
    const senderEmail = typeof body.sender_email === "string" ? body.sender_email : "";
    const parseInstructions =
      typeof body.parse_instructions === "string" ? body.parse_instructions : "";

    if (!name.trim() || !senderEmail.trim() || !parseInstructions.trim()) {
      res.status(400).json({
        success: false,
        error: "name, sender_email, and parse_instructions are required",
      });
      return;
    }

    const data = await createJobNewsletterSource(requireCrmSupabaseClient(), {
      name,
      sender_email: senderEmail,
      enabled: typeof body.enabled === "boolean" ? body.enabled : true,
      parse_instructions: parseInstructions,
    });

    console.log("📤 201 POST /api/data/job-newsletter-sources/create");
    res.status(201).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create newsletter source";
    console.error("❌ handleJobNewsletterSourceCreate:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
