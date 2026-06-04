import type { Request, Response } from "express";
import { deleteEmploymentFromStore } from "../../../data/crm";

/**
 * DELETE /api/data/employment/delete?id=
 */
export const handleEmploymentDelete = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = typeof req.query.id === "string" ? req.query.id : "";
    if (!id) {
      res.status(400).json({ success: false, error: "id is required" });
      return;
    }
    const ok = await deleteEmploymentFromStore(id);
    if (!ok) {
      res.status(404).json({ success: false, error: "Not found" });
      return;
    }
    res.status(200).json({ success: true, data: { id } });
  } catch {
    res.status(500).json({ success: false, error: "Failed to delete employment" });
  }
};
