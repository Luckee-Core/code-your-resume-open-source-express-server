import type { Request, Response } from "express";
import { requireCrmSupabaseClient } from "../../../data/crm/require-crm-supabase-client";
import { updateProject } from "../../../data/projects";

type Body = {
  id?: unknown;
  businessName?: unknown;
  description?: unknown;
  url?: unknown;
  duration?: unknown;
  technologies?: unknown;
};

const toStringArray = (value: unknown): string[] | undefined => {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
};

/**
 * PATCH /api/data/project/update
 */
export const handleProjectUpdate = async (req: Request, res: Response): Promise<void> => {
  console.log("📥 PATCH /api/data/project/update");
  try {
    const body = req.body as Body;
    const id = typeof body.id === "string" ? body.id.trim() : "";

    if (!id) {
      res.status(400).json({ success: false, error: "id is required" });
      return;
    }

    const data = await updateProject(requireCrmSupabaseClient(), id, {
      businessName: typeof body.businessName === "string" ? body.businessName : undefined,
      description: typeof body.description === "string" ? body.description : undefined,
      url: typeof body.url === "string" ? body.url : undefined,
      duration: typeof body.duration === "string" ? body.duration : undefined,
      technologies: toStringArray(body.technologies),
    });

    console.log("📤 200 PATCH /api/data/project/update");
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update project";
    console.error("❌ handleProjectUpdate:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
