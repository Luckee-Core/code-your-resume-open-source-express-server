import type { Request, Response } from "express";
import { requireCrmSupabaseClient } from "../../../data/crm/require-crm-supabase-client";
import { createProject } from "../../../data/projects";

type Body = {
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
 * POST /api/data/project/create
 */
export const handleProjectCreate = async (req: Request, res: Response): Promise<void> => {
  console.log("📥 POST /api/data/project/create");
  try {
    const body = req.body as Body;
    const businessName = typeof body.businessName === "string" ? body.businessName : "";

    if (!businessName.trim()) {
      res.status(400).json({ success: false, error: "businessName is required" });
      return;
    }

    const data = await createProject(requireCrmSupabaseClient(), {
      businessName,
      description: typeof body.description === "string" ? body.description : "",
      url: typeof body.url === "string" ? body.url : "",
      duration: typeof body.duration === "string" ? body.duration : "",
      technologies: toStringArray(body.technologies) ?? [],
    });

    console.log("📤 201 POST /api/data/project/create");
    res.status(201).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create project";
    console.error("❌ handleProjectCreate:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
