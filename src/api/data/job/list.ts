import type { Request, Response } from "express";
import { listJobsFromStore } from "../../../data/crm/read-write-jobs";

export const handleJobList = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await listJobsFromStore();
    res.status(200).json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: "Failed to list jobs" });
  }
};
