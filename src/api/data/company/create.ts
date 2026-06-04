import type { Request, Response } from "express";
import { createCompanyInStore } from "../../../data/crm";

type Body = { name?: unknown; website?: unknown; notes?: unknown };

export const handleCompanyCreate = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Body;
    const name = typeof body.name === "string" ? body.name : "";
    if (!name.trim()) {
      res.status(400).json({ success: false, error: "name is required" });
      return;
    }
    const website = typeof body.website === "string" ? body.website : "";
    const notes = typeof body.notes === "string" ? body.notes : "";
    const data = await createCompanyInStore({ name, website, notes });
    res.status(201).json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: "Failed to create company" });
  }
};
