import type { Request, Response } from "express";
import { deleteJobFromStore } from "../../../data/crm";

export const handleJobDelete = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = typeof req.query.id === "string" ? req.query.id : "";
    if (!id) {
      res.status(400).json({ success: false, error: "id is required" });
      return;
    }
    const ok = await deleteJobFromStore(id);
    if (!ok) {
      res.status(404).json({ success: false, error: "Not found" });
      return;
    }
    res.status(200).json({ success: true, data: { id } });
  } catch {
    res.status(500).json({ success: false, error: "Failed to delete job" });
  }
};
