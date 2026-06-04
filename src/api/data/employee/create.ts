import type { Request, Response } from "express";
import { createEmployeeInStore } from "../../../data/crm";

type Body = {
  companyId?: unknown;
  name?: unknown;
  role?: unknown;
  email?: unknown;
  linkedinUrl?: unknown;
};

export const handleEmployeeCreate = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Body;
    const companyId = typeof body.companyId === "string" ? body.companyId : "";
    const name = typeof body.name === "string" ? body.name : "";
    if (!companyId.trim() || !name.trim()) {
      res.status(400).json({ success: false, error: "companyId and name are required" });
      return;
    }
    const role = typeof body.role === "string" ? body.role : "";
    const email = typeof body.email === "string" ? body.email : "";
    const linkedinUrl = typeof body.linkedinUrl === "string" ? body.linkedinUrl : "";
    const data = await createEmployeeInStore({ companyId, name, role, email, linkedinUrl });
    res.status(201).json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: "Failed to create employee" });
  }
};
