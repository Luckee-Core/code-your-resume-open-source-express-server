import type { Request, Response } from "express";
import { listCompaniesFromStore } from "../../../data/crm";

/**
 * GET /api/data/company/list — list all companies.
 */
export const handleCompanyList = async (_req: Request, res: Response): Promise<void> => {
  console.log("📥 GET /api/data/company/list");
  try {
    const data = await listCompaniesFromStore();
    console.log("📤 200 GET /api/data/company/list");
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to list companies";
    console.error("❌ handleCompanyList:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
