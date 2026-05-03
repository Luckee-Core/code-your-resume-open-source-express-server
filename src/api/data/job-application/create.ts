import type { Request, Response } from "express";
import { createJobApplicationInStore } from "../../../data/crm/read-write-job-applications";

type Body = {
  jobId?: unknown;
  submittedAt?: unknown;
  imageGraphicId?: unknown;
  notes?: unknown;
};

export const handleJobApplicationCreate = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Body;
    const jobId = typeof body.jobId === "string" ? body.jobId : "";
    const imageGraphicId = typeof body.imageGraphicId === "string" ? body.imageGraphicId : "";
    if (!jobId.trim() || !imageGraphicId.trim()) {
      res.status(400).json({ success: false, error: "jobId and imageGraphicId are required" });
      return;
    }
    const submittedAt =
      typeof body.submittedAt === "string" && body.submittedAt.trim()
        ? body.submittedAt
        : new Date().toISOString();
    const notes = typeof body.notes === "string" ? body.notes : "";
    const data = await createJobApplicationInStore({ jobId, submittedAt, imageGraphicId, notes });
    res.status(201).json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: "Failed to create job application" });
  }
};
