import type { Request, Response } from "express";
import { listJobsFromStore } from "../../../data/crm";

export const handleJobList = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await listJobsFromStore();
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to list jobs";
    console.error("❌ handleJobList:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
