import type { Request, Response } from "express";
import { runCompanyWebsiteResearch } from "../../../services/company/run-company-website-research";

type Body = { id?: unknown };

/**
 * POST /api/data/company/website-research — crawl company URLs + optional AI summary into `websiteResearchSummary`.
 */
export const handleCompanyWebsiteResearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Body;
    const id = typeof body.id === "string" ? body.id : "";
    if (!id.trim()) {
      res.status(400).json({ success: false, error: "id is required" });
      return;
    }

    console.log("📥 POST /api/data/company/website-research", { id });
    const result = await runCompanyWebsiteResearch(id);
    if (!result.ok) {
      if (result.code === "not_found") {
        res.status(404).json({ success: false, error: result.message });
        return;
      }
      res.status(400).json({ success: false, error: result.message });
      return;
    }

    res.status(200).json({ success: true, data: result.company });
  } catch {
    res.status(500).json({ success: false, error: "Failed to run website research" });
  }
};
