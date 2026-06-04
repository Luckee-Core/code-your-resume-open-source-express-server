import type { Request, Response } from "express";
import { listEmploymentsFromStore } from "../../../data/crm";

/**
 * GET /api/data/employment/list — list all employment rows.
 */
export const handleEmploymentList = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await listEmploymentsFromStore();
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to list employments";
    console.error("❌ handleEmploymentList:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
