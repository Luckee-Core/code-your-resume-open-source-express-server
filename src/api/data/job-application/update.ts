import type { Request, Response } from "express";
import { updateJobApplicationInStore } from "../../../data/crm/read-write-job-applications";
import type { JobApplication } from "../../../data/crm/types";

type Body = {
  id?: unknown;
  jobId?: unknown;
  submittedAt?: unknown;
  imageGraphicId?: unknown;
  notes?: unknown;
};

export const handleJobApplicationUpdate = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Body;
    const id = typeof body.id === "string" ? body.id : "";
    if (!id) {
      res.status(400).json({ success: false, error: "id is required" });
      return;
    }
    const patch: Partial<
      Pick<JobApplication, "jobId" | "submittedAt" | "imageGraphicId" | "notes">
    > = {};
    if (typeof body.jobId === "string") patch.jobId = body.jobId;
    if (typeof body.submittedAt === "string") patch.submittedAt = body.submittedAt;
    if (typeof body.imageGraphicId === "string") patch.imageGraphicId = body.imageGraphicId;
    if (typeof body.notes === "string") patch.notes = body.notes;
    const data = await updateJobApplicationInStore(id, patch);
    if (!data) {
      res.status(404).json({ success: false, error: "Not found" });
      return;
    }
    res.status(200).json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: "Failed to update job application" });
  }
};
