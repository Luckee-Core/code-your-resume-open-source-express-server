import type { Request, Response } from "express";
import { requireCrmSupabaseClient } from "../../../data/crm/require-crm-supabase-client";
import { getProjectById } from "../../../data/projects";

/**
 * GET /api/data/project/get?id=
 */
export const handleProjectGet = async (req: Request, res: Response): Promise<void> => {
  console.log("📥 GET /api/data/project/get");
  try {
    const id = typeof req.query.id === "string" ? req.query.id.trim() : "";
    if (!id) {
      res.status(400).json({ success: false, error: "id is required" });
      return;
    }

    const data = await getProjectById(requireCrmSupabaseClient(), id);
    if (!data) {
      res.status(404).json({ success: false, error: "Project not found" });
      return;
    }

    console.log("📤 200 GET /api/data/project/get");
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to get project";
    console.error("❌ handleProjectGet:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
