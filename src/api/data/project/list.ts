import type { Request, Response } from "express";
import { requireCrmPgPool } from "../../../data/crm/require-crm-pg-pool";
import { listProjects } from "../../../data/projects";

/**
 * GET /api/data/project/list
 */
export const handleProjectList = async (_req: Request, res: Response): Promise<void> => {
  console.log("📥 GET /api/data/project/list");
  try {
    const data = await listProjects(requireCrmPgPool());
    console.log("📤 200 GET /api/data/project/list");
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to list projects";
    console.error("❌ handleProjectList:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
