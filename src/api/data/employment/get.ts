import type { Request, Response } from "express";
import { getEmploymentFromStore } from "../../../data/crm/read-write-employments";

/**
 * GET /api/data/employment/get?id=
 */
export const handleEmploymentGet = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = typeof req.query.id === "string" ? req.query.id : "";
    if (!id) {
      res.status(400).json({ success: false, error: "id is required" });
      return;
    }
    const row = await getEmploymentFromStore(id);
    if (!row) {
      res.status(404).json({ success: false, error: "Not found" });
      return;
    }
    res.status(200).json({ success: true, data: row });
  } catch {
    res.status(500).json({ success: false, error: "Failed to get employment" });
  }
};
