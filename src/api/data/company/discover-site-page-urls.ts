import type { Request, Response } from "express";
import { discoverCompanySitePageUrls } from "../../../services/company/discover-company-site-page-urls";

type Body = { id?: unknown };

/**
 * POST /api/data/company/discover-site-page-urls — one-shot homepage link harvest (same-origin).
 */
export const handleCompanyDiscoverSitePageUrls = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Body;
    const id = typeof body.id === "string" ? body.id : "";
    if (!id.trim()) {
      res.status(400).json({ success: false, error: "id is required" });
      return;
    }

    const result = await discoverCompanySitePageUrls(id);
    if (!result.ok) {
      if (result.code === "already_attempted") {
        res.status(400).json({
          success: false,
          error: "playwright_website_url_discovery_already_attempted",
          message: result.message,
        });
        return;
      }
      if (result.code === "not_found") {
        res.status(404).json({ success: false, error: result.message });
        return;
      }
      if (result.code === "fetch_failed") {
        res.status(502).json({ success: false, error: result.message });
        return;
      }
      res.status(400).json({ success: false, error: result.message });
      return;
    }

    res.status(200).json({
      success: true,
      companyUpdated: result.companyUpdated,
      linkCount: result.linkCount,
      data: result.company,
    });
  } catch {
    res.status(500).json({ success: false, error: "Failed to discover site page URLs" });
  }
};
