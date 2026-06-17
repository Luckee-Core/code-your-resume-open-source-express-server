import type { Request, Response } from "express";
import { runProjectWebsiteResearch } from "../../../services/project/run-project-website-research";

type Body = { id?: unknown };

/**
 * POST /api/data/project/website-research — crawl project URL + optional AI summary.
 */
export const handleProjectWebsiteResearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Body;
    const id = typeof body.id === "string" ? body.id : "";
    if (!id.trim()) {
      res.status(400).json({ success: false, error: "id is required" });
      return;
    }

    console.log("📥 POST /api/data/project/website-research", { id });
    const result = await runProjectWebsiteResearch(id);
    if (!result.ok) {
      if (result.code === "not_found") {
        res.status(404).json({ success: false, error: result.message });
        return;
      }
      res.status(400).json({ success: false, error: result.message });
      return;
    }

    console.log("📤 200 POST /api/data/project/website-research", { id });
    res.status(200).json({ success: true, data: result.project });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to run website research";
    console.error("❌ handleProjectWebsiteResearch:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
