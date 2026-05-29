import type { Request, Response } from "express";
import { listJobApplicationsFromStore } from "../../../data/crm/read-write-job-applications";

export const handleJobApplicationList = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await listJobApplicationsFromStore();
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to list job applications";
    console.error("❌ handleJobApplicationList:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
